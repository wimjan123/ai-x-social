/**
 * Response Cache Implementation
 *
 * Caches AI responses for performance optimization and cost reduction.
 * Part of T049e: Health monitoring and automatic switching
 */

import crypto from 'crypto';
import { AIResponse, ResponseCache as IResponseCache, CacheEntry } from '../interfaces/IAIProvider';

export class ResponseCache implements IResponseCache {
  private cache: Map<string, CacheEntry> = new Map();
  private config: ResponseCacheConfig;
  private cleanupInterval?: NodeJS.Timeout;

  constructor(config?: Partial<ResponseCacheConfig>) {
    this.config = {
      defaultTTL: config?.defaultTTL || 300000, // 5 minutes
      maxSize: config?.maxSize || 1000,
      cleanupInterval: config?.cleanupInterval || 60000, // 1 minute
      enableCompression: config?.enableCompression || true,
      cacheByProvider: config?.cacheByProvider || false,
      ...config
    };

    // Start cleanup process
    this.startCleanup();
  }

  // ============================================================================
  // CORE CACHE OPERATIONS
  // ============================================================================

  async get(key: string): Promise<AIResponse | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() > entry.expiresAt.getTime()) {
      this.cache.delete(key);
      return null;
    }

    // Return a copy to prevent mutation
    return {
      ...entry.response,
      provider: `${entry.response.provider} (cached)`
    };
  }

  async set(key: string, response: AIResponse, ttl: number): Promise<void> {
    // Check cache size limits
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttl);

    const entry: CacheEntry = {
      key,
      response: { ...response }, // Store a copy
      timestamp: now,
      expiresAt
    };

    this.cache.set(key, entry);
  }

  async invalidate(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  // ============================================================================
  // ADVANCED CACHE OPERATIONS
  // ============================================================================

  async getMultiple(keys: string[]): Promise<Map<string, AIResponse>> {
    const results = new Map<string, AIResponse>();

    for (const key of keys) {
      const response = await this.get(key);
      if (response) {
        results.set(key, response);
      }
    }

    return results;
  }

  async setMultiple(entries: Array<{ key: string; response: AIResponse; ttl?: number }>): Promise<void> {
    for (const entry of entries) {
      await this.set(entry.key, entry.response, entry.ttl || this.config.defaultTTL);
    }
  }

  async invalidatePattern(pattern: RegExp): Promise<number> {
    let invalidated = 0;

    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        invalidated++;
      }
    }

    return invalidated;
  }

  async invalidateByProvider(providerName: string): Promise<number> {
    let invalidated = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.response.provider === providerName) {
        this.cache.delete(key);
        invalidated++;
      }
    }

    return invalidated;
  }

  // ============================================================================
  // CACHE KEY GENERATION
  // ============================================================================

  generateCacheKey(context: CacheKeyContext): string {
    const keyData = {
      context: context.context,
      personaId: context.personaId,
      constraints: {
        maxLength: context.constraints.maxLength,
        requirePoliticalStance: context.constraints.requirePoliticalStance,
        requiredTone: context.constraints.requiredTone,
        avoidTopics: context.constraints.avoidTopics?.sort() // Sort for consistency
      },
      newsContext: context.newsContext ? {
        id: context.newsContext.id,
        title: context.newsContext.title
      } : null
    };

    // Include provider in key if cacheByProvider is enabled
    if (this.config.cacheByProvider && context.provider) {
      (keyData as any).provider = context.provider;
    }

    // Include conversation history hash if provided
    if (context.conversationHistory && context.conversationHistory.length > 0) {
      const historyHash = this.hashConversationHistory(context.conversationHistory);
      (keyData as any).historyHash = historyHash;
    }

    return this.hashObject(keyData);
  }

  private hashObject(obj: any): string {
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    return crypto.createHash('md5').update(str).digest('hex');
  }

  private hashConversationHistory(history: any[]): string {
    // Only hash the last few turns to keep cache relevant
    const recentHistory = history.slice(-3);
    const historyStr = recentHistory
      .map(turn => `${turn.role}:${turn.content}`)
      .join('|');
    return crypto.createHash('md5').update(historyStr).digest('hex').substring(0, 8);
  }

  // ============================================================================
  // CACHE MANAGEMENT
  // ============================================================================

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp.getTime() < oldestTime) {
        oldestTime = entry.timestamp.getTime();
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt.getTime()) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));

    if (keysToDelete.length > 0) {
      console.log(`Cleaned up ${keysToDelete.length} expired cache entries`);
    }
  }

  // ============================================================================
  // CACHE STATISTICS & MONITORING
  // ============================================================================

  getStats(): CacheStats {
    const now = Date.now();
    let totalSize = 0;
    let expiredEntries = 0;

    for (const entry of this.cache.values()) {
      totalSize += JSON.stringify(entry.response).length;
      if (now > entry.expiresAt.getTime()) {
        expiredEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      maxSize: this.config.maxSize,
      memoryUsageBytes: totalSize,
      expiredEntries,
      hitRate: this.getHitRate(),
      oldestEntryAge: this.getOldestEntryAge(),
      newestEntryAge: this.getNewestEntryAge()
    };
  }

  private hitRate: { hits: number; misses: number } = { hits: 0, misses: 0 };

  async getWithStats(key: string): Promise<AIResponse | null> {
    const result = await this.get(key);

    if (result) {
      this.hitRate.hits++;
    } else {
      this.hitRate.misses++;
    }

    return result;
  }

  private getHitRate(): number {
    const total = this.hitRate.hits + this.hitRate.misses;
    return total > 0 ? this.hitRate.hits / total : 0;
  }

  private getOldestEntryAge(): number {
    let oldest = 0;
    const now = Date.now();

    for (const entry of this.cache.values()) {
      const age = now - entry.timestamp.getTime();
      if (age > oldest) {
        oldest = age;
      }
    }

    return oldest;
  }

  private getNewestEntryAge(): number {
    let newest = Number.MAX_SAFE_INTEGER;
    const now = Date.now();

    for (const entry of this.cache.values()) {
      const age = now - entry.timestamp.getTime();
      if (age < newest) {
        newest = age;
      }
    }

    return newest === Number.MAX_SAFE_INTEGER ? 0 : newest;
  }

  // ============================================================================
  // CONFIGURATION & UTILITIES
  // ============================================================================

  updateConfiguration(config: Partial<ResponseCacheConfig>): void {
    this.config = { ...this.config, ...config };

    // Restart cleanup if interval changed
    if (config.cleanupInterval && this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.startCleanup();
    }
  }

  getConfiguration(): ResponseCacheConfig {
    return { ...this.config };
  }

  // ============================================================================
  // ADVANCED FEATURES
  // ============================================================================

  async warmup(keys: string[]): Promise<void> {
    // Pre-populate cache with commonly used keys
    // This could be used during startup to load frequently accessed responses
    console.log(`Warming up cache with ${keys.length} keys`);
  }

  async precompute(contexts: CacheKeyContext[]): Promise<void> {
    // Pre-generate cache keys for common scenarios
    for (const context of contexts) {
      const key = this.generateCacheKey(context);
      console.log(`Pre-computed cache key: ${key}`);
    }
  }

  exportCache(): CacheExport {
    const entries: ExportedCacheEntry[] = [];

    for (const [key, entry] of this.cache.entries()) {
      entries.push({
        key,
        response: entry.response,
        timestamp: entry.timestamp.toISOString(),
        expiresAt: entry.expiresAt.toISOString()
      });
    }

    return {
      entries,
      exportedAt: new Date().toISOString(),
      config: this.config
    };
  }

  importCache(cacheData: CacheExport): number {
    let imported = 0;
    const now = Date.now();

    for (const entry of cacheData.entries) {
      const expiresAt = new Date(entry.expiresAt);

      // Only import entries that haven't expired
      if (expiresAt.getTime() > now) {
        const cacheEntry: CacheEntry = {
          key: entry.key,
          response: entry.response,
          timestamp: new Date(entry.timestamp),
          expiresAt
        };

        this.cache.set(entry.key, cacheEntry);
        imported++;
      }
    }

    return imported;
  }

  // ============================================================================
  // CLEANUP & DISPOSAL
  // ============================================================================

  dispose(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }

    this.cache.clear();
  }

  // ============================================================================
  // DEBUGGING & DEVELOPMENT
  // ============================================================================

  debug(): CacheDebugInfo {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      provider: entry.response.provider,
      contentLength: entry.response.content.length,
      timestamp: entry.timestamp.toISOString(),
      expiresAt: entry.expiresAt.toISOString(),
      isExpired: Date.now() > entry.expiresAt.getTime()
    }));

    return {
      totalEntries: this.cache.size,
      config: this.config,
      stats: this.getStats(),
      entries: entries.slice(0, 10) // Limit for debugging
    };
  }
}

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ResponseCacheConfig {
  defaultTTL: number;
  maxSize: number;
  cleanupInterval: number;
  enableCompression: boolean;
  cacheByProvider: boolean;
}

interface CacheKeyContext {
  context: string;
  personaId: string;
  constraints: {
    maxLength: number;
    requirePoliticalStance: boolean;
    requiredTone?: string;
    avoidTopics?: string[];
  };
  newsContext?: {
    id: string;
    title: string;
  };
  conversationHistory?: any[];
  provider?: string;
}

interface CacheStats {
  totalEntries: number;
  maxSize: number;
  memoryUsageBytes: number;
  expiredEntries: number;
  hitRate: number;
  oldestEntryAge: number;
  newestEntryAge: number;
}

interface ExportedCacheEntry {
  key: string;
  response: AIResponse;
  timestamp: string;
  expiresAt: string;
}

interface CacheExport {
  entries: ExportedCacheEntry[];
  exportedAt: string;
  config: ResponseCacheConfig;
}

interface CacheDebugInfo {
  totalEntries: number;
  config: ResponseCacheConfig;
  stats: CacheStats;
  entries: Array<{
    key: string;
    provider: string;
    contentLength: number;
    timestamp: string;
    expiresAt: string;
    isExpired: boolean;
  }>;
}
// Rate Limiter for real-time connections
// Prevents abuse and ensures fair resource allocation

import { RateLimitConfig } from './types';

interface RateLimitEntry {
  requests: number[];
  lastReset: number;
}

export class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;
  private cleanupInterval: NodeJS.Timeout;

  constructor(config: RateLimitConfig) {
    this.config = {
      windowMs: 1000,
      maxRequests: 10,
      skipSuccessfulRequests: false,
      skipFailedRequests: true,
      ...config
    };

    // Cleanup old entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  /**
   * Check if a connection is rate limited
   */
  isRateLimited(connectionId: string): boolean {
    const now = Date.now();
    const entry = this.getOrCreateEntry(connectionId);

    // Remove requests outside the window
    entry.requests = entry.requests.filter(
      timestamp => now - timestamp < this.config.windowMs
    );

    // Check if limit exceeded
    return entry.requests.length >= this.config.maxRequests;
  }

  /**
   * Record a request for rate limiting
   */
  recordRequest(connectionId: string, isSuccess = true): boolean {
    // Skip recording based on configuration
    if (isSuccess && this.config.skipSuccessfulRequests) {
      return false;
    }
    if (!isSuccess && this.config.skipFailedRequests) {
      return false;
    }

    const now = Date.now();
    const entry = this.getOrCreateEntry(connectionId);

    // Add current request
    entry.requests.push(now);

    // Remove requests outside the window
    entry.requests = entry.requests.filter(
      timestamp => now - timestamp < this.config.windowMs
    );

    return entry.requests.length >= this.config.maxRequests;
  }

  /**
   * Get remaining requests for a connection
   */
  getRemainingRequests(connectionId: string): number {
    if (!this.limits.has(connectionId)) {
      return this.config.maxRequests;
    }

    const now = Date.now();
    const entry = this.limits.get(connectionId)!;

    // Remove requests outside the window
    entry.requests = entry.requests.filter(
      timestamp => now - timestamp < this.config.windowMs
    );

    return Math.max(0, this.config.maxRequests - entry.requests.length);
  }

  /**
   * Get time until rate limit resets
   */
  getResetTime(connectionId: string): number {
    if (!this.limits.has(connectionId)) {
      return 0;
    }

    const entry = this.limits.get(connectionId)!;
    if (entry.requests.length === 0) {
      return 0;
    }

    const oldestRequest = Math.min(...entry.requests);
    return Math.max(0, oldestRequest + this.config.windowMs - Date.now());
  }

  /**
   * Reset rate limit for a connection
   */
  reset(connectionId: string): void {
    this.limits.delete(connectionId);
  }

  /**
   * Get or create rate limit entry
   */
  private getOrCreateEntry(connectionId: string): RateLimitEntry {
    if (!this.limits.has(connectionId)) {
      this.limits.set(connectionId, {
        requests: [],
        lastReset: Date.now()
      });
    }
    return this.limits.get(connectionId)!;
  }

  /**
   * Cleanup old entries
   */
  private cleanup(): void {
    const now = Date.now();
    const cutoff = now - (this.config.windowMs * 2); // Keep for 2x window size

    Array.from(this.limits.entries()).forEach(([connectionId, entry]) => {
      // Remove entries that haven't been used recently
      if (entry.lastReset < cutoff && entry.requests.length === 0) {
        this.limits.delete(connectionId);
      } else {
        // Update last reset time if there are recent requests
        if (entry.requests.length > 0) {
          entry.lastReset = now;
        }

        // Clean up old requests
        entry.requests = entry.requests.filter(
          timestamp => now - timestamp < this.config.windowMs
        );
      }
    });
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalConnections: number;
    rateLimitedConnections: number;
    averageRequestsPerConnection: number;
  } {
    const now = Date.now();
    let totalRequests = 0;
    let rateLimitedCount = 0;

    Array.from(this.limits.entries()).forEach(([connectionId, entry]) => {
      // Update requests within window
      entry.requests = entry.requests.filter(
        timestamp => now - timestamp < this.config.windowMs
      );

      totalRequests += entry.requests.length;

      if (entry.requests.length >= this.config.maxRequests) {
        rateLimitedCount++;
      }
    });

    return {
      totalConnections: this.limits.size,
      rateLimitedConnections: rateLimitedCount,
      averageRequestsPerConnection: this.limits.size > 0 ? totalRequests / this.limits.size : 0
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<RateLimitConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Destroy rate limiter
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.limits.clear();
  }
}
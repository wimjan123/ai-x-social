/**
 * AI Orchestrator - Main Coordination Layer
 *
 * Coordinates multiple AI providers with intelligent fallback and health monitoring.
 * Implements T049e: Provider health monitoring and automatic switching
 */

import {
  IAIProvider,
  AIRequest,
  AIResponse,
  AIConfig,
  ProviderHealthReport,
  ProviderSelection,
  GenerationContext,
  AIOrchestatorMetrics,
  ProviderMetrics
} from './interfaces/IAIProvider';

import { ClaudeProvider } from './providers/ClaudeProvider';
import { GPTProvider } from './providers/GPTProvider';
import { GeminiProvider } from './providers/GeminiProvider';
import { DemoProvider } from './providers/DemoProvider';

import { CircuitBreaker } from './utils/CircuitBreaker';
import { HealthMonitor } from './utils/HealthMonitor';
import { ResponseCache } from './utils/ResponseCache';

export class AIOrchestrator {
  private providers: IAIProvider[] = [];
  private circuitBreaker: CircuitBreaker;
  private healthMonitor: HealthMonitor;
  private responseCache: ResponseCache;
  private config: AIConfig;
  private metrics: Map<string, ProviderMetrics> = new Map();
  private isInitialized: boolean = false;

  constructor(config: AIConfig) {
    this.config = config;

    // Initialize core components
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 3,
      recoveryTimeout: 30000,
      halfOpenMaxCalls: 2
    });

    this.responseCache = new ResponseCache({
      defaultTTL: config.cacheTTL || 300000, // 5 minutes
      maxSize: 1000,
      cacheByProvider: false
    });

    // Initialize providers and health monitoring
    this.initializeProviders();
    this.healthMonitor = new HealthMonitor(this.providers, this.circuitBreaker);

    this.isInitialized = true;
  }

  // ============================================================================
  // MAIN AI GENERATION METHOD
  // ============================================================================

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    if (!this.isInitialized) {
      throw new Error('AIOrchestrator not initialized');
    }

    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      // Generate cache key
      const cacheKey = this.generateCacheKey(request);

      // Check cache first if enabled
      if (this.config.cacheEnabled !== false) {
        const cachedResponse = await this.responseCache.getWithStats(cacheKey);
        if (cachedResponse) {
          return {
            ...cachedResponse,
            processingTime: Date.now() - startTime
          };
        }
      }

      // Get available providers in priority order
      const availableProviders = this.getHealthyProviders();

      if (availableProviders.length === 0) {
        throw new Error('No healthy AI providers available');
      }

      let lastError: Error | null = null;
      let selectedProvider: ProviderSelection | null = null;

      // Try providers in order of priority
      for (const provider of availableProviders) {
        try {
          selectedProvider = {
            provider,
            reason: provider.priority === 1 ? 'primary' : 'fallback'
          };

          const response = await this.tryProvider(provider, request, requestId);

          // Cache successful responses
          if (this.config.cacheEnabled !== false) {
            await this.responseCache.set(cacheKey, response, this.config.cacheTTL || 300000);
          }

          // Update metrics
          this.updateMetrics(provider.name, true, Date.now() - startTime, response);

          // Create generation context
          const context: GenerationContext = {
            requestId,
            timestamp: new Date(),
            selectedProvider,
            cacheHit: false,
            responseTime: Date.now() - startTime
          };

          return {
            ...response,
            processingTime: Date.now() - startTime
          };

        } catch (error) {
          lastError = error as Error;

          console.warn(`Provider ${provider.name} failed:`, error);

          // Update circuit breaker
          this.circuitBreaker.recordFailure(provider.name, error as Error);

          // Update metrics
          this.updateMetrics(provider.name, false, Date.now() - startTime);

          continue;
        }
      }

      throw lastError || new Error('All AI providers failed');

    } catch (error) {
      console.error('AIOrchestrator generation failed:', error);
      throw error;
    }
  }

  private async tryProvider(provider: IAIProvider, request: AIRequest, requestId: string): Promise<AIResponse> {
    // Check circuit breaker
    if (!this.circuitBreaker.canExecute(provider.name)) {
      throw new Error(`Circuit breaker open for ${provider.name}`);
    }

    console.log(`Attempting generation with ${provider.name} for request ${requestId}`);

    const response = await provider.generateResponse(request);

    // Record success
    this.circuitBreaker.recordSuccess(provider.name);

    return response;
  }

  // ============================================================================
  // PROVIDER MANAGEMENT
  // ============================================================================

  private initializeProviders(): void {
    // Initialize providers based on configuration
    if (this.config.claude?.apiKey) {
      try {
        const claudeProvider = new ClaudeProvider(
          this.config.claude.apiKey,
          this.config.claude.baseURL,
          this.config.claude.model
        );
        this.providers.push(claudeProvider);
        this.initializeProviderMetrics(claudeProvider.name);
        console.log('Initialized Claude provider');
      } catch (error) {
        console.warn('Failed to initialize Claude provider:', error);
      }
    }

    if (this.config.openai?.apiKey) {
      try {
        const gptProvider = new GPTProvider(
          this.config.openai.apiKey,
          this.config.openai.baseURL,
          this.config.openai.model
        );
        this.providers.push(gptProvider);
        this.initializeProviderMetrics(gptProvider.name);
        console.log('Initialized GPT provider');
      } catch (error) {
        console.warn('Failed to initialize GPT provider:', error);
      }
    }

    if (this.config.google?.apiKey) {
      try {
        const geminiProvider = new GeminiProvider(
          this.config.google.apiKey,
          this.config.google.model
        );
        this.providers.push(geminiProvider);
        this.initializeProviderMetrics(geminiProvider.name);
        console.log('Initialized Gemini provider');
      } catch (error) {
        console.warn('Failed to initialize Gemini provider:', error);
      }
    }

    // Always add demo provider as ultimate fallback
    const demoProvider = new DemoProvider();
    this.providers.push(demoProvider);
    this.initializeProviderMetrics(demoProvider.name);
    console.log('Initialized Demo provider (fallback)');

    console.log(`AIOrchestrator initialized with ${this.providers.length} providers`);
  }

  private getHealthyProviders(): IAIProvider[] {
    return this.providers
      .filter(provider => {
        const isHealthy = provider.isHealthy;
        const canExecute = this.circuitBreaker.canExecute(provider.name);
        return isHealthy && canExecute;
      })
      .sort((a, b) => a.priority - b.priority);
  }

  // ============================================================================
  // CACHE KEY GENERATION
  // ============================================================================

  private generateCacheKey(request: AIRequest): string {
    return this.responseCache.generateCacheKey({
      context: request.context,
      personaId: request.persona.id,
      constraints: {
        maxLength: request.constraints.maxLength,
        requirePoliticalStance: request.constraints.requirePoliticalStance,
        requiredTone: request.constraints.requiredTone,
        avoidTopics: request.constraints.avoidTopics
      },
      newsContext: request.newsContext ? {
        id: request.newsContext.id,
        title: request.newsContext.title
      } : undefined,
      conversationHistory: request.conversationHistory
    });
  }

  // ============================================================================
  // METRICS & MONITORING
  // ============================================================================

  private initializeProviderMetrics(providerName: string): void {
    this.metrics.set(providerName, {
      provider: providerName,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      totalTokensUsed: 0,
      estimatedCost: 0,
      lastUsed: new Date()
    });
  }

  private updateMetrics(providerName: string, success: boolean, responseTime: number, response?: AIResponse): void {
    const metrics = this.metrics.get(providerName);
    if (!metrics) return;

    metrics.totalRequests++;
    metrics.lastUsed = new Date();

    if (success) {
      metrics.successfulRequests++;

      // Update average response time
      const totalResponseTime = metrics.averageResponseTime * (metrics.successfulRequests - 1) + responseTime;
      metrics.averageResponseTime = totalResponseTime / metrics.successfulRequests;

      // Update token usage and cost
      if (response?.tokens) {
        metrics.totalTokensUsed += response.tokens.total;

        // Estimate cost based on provider capabilities
        const provider = this.providers.find(p => p.name === providerName);
        if (provider) {
          const costPerToken = provider.getCapabilities().costPerToken;
          metrics.estimatedCost += response.tokens.total * costPerToken;
        }
      }
    } else {
      metrics.failedRequests++;
    }

    this.metrics.set(providerName, metrics);
  }

  async getProviderHealthReports(): Promise<ProviderHealthReport[]> {
    return await this.healthMonitor.getProviderHealthReports();
  }

  getMetrics(): AIOrchestatorMetrics {
    const providerMetrics = Array.from(this.metrics.values());
    const totalRequests = providerMetrics.reduce((sum, m) => sum + m.totalRequests, 0);
    const totalCost = providerMetrics.reduce((sum, m) => sum + m.estimatedCost, 0);

    const cacheStats = this.responseCache.getStats();

    return {
      providers: providerMetrics,
      totalRequests,
      cacheHitRate: cacheStats.hitRate,
      averageResponseTime: providerMetrics.reduce((sum, m) => sum + m.averageResponseTime, 0) / Math.max(providerMetrics.length, 1),
      totalCost,
      uptime: this.getSystemUptime()
    };
  }

  private getSystemUptime(): number {
    // Simple uptime calculation - in production this would be more sophisticated
    return 1.0; // 100% uptime assumption
  }

  // ============================================================================
  // HEALTH MONITORING CONTROL
  // ============================================================================

  startHealthMonitoring(): void {
    this.healthMonitor.startMonitoring();
    console.log('AI provider health monitoring started');
  }

  stopHealthMonitoring(): void {
    this.healthMonitor.stopMonitoring();
    console.log('AI provider health monitoring stopped');
  }

  async performHealthCheck(): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();

    for (const provider of this.providers) {
      try {
        const health = await provider.checkHealth();
        results.set(provider.name, health.isHealthy);
      } catch (error) {
        results.set(provider.name, false);
      }
    }

    return results;
  }

  // ============================================================================
  // CACHE MANAGEMENT
  // ============================================================================

  async clearCache(): Promise<void> {
    await this.responseCache.clear();
    console.log('AI response cache cleared');
  }

  async invalidateCacheForProvider(providerName: string): Promise<number> {
    return await this.responseCache.invalidateByProvider(providerName);
  }

  getCacheStats() {
    return this.responseCache.getStats();
  }

  // ============================================================================
  // CONFIGURATION & CONTROL
  // ============================================================================

  updateConfiguration(config: Partial<AIConfig>): void {
    this.config = { ...this.config, ...config };

    // Update cache configuration
    if (config.cacheTTL || config.cacheEnabled !== undefined) {
      this.responseCache.updateConfiguration({
        defaultTTL: config.cacheTTL || this.responseCache.getConfiguration().defaultTTL
      });
    }

    console.log('AIOrchestrator configuration updated');
  }

  getConfiguration(): AIConfig {
    return { ...this.config };
  }

  // ============================================================================
  // ADVANCED FEATURES
  // ============================================================================

  async testAllProviders(): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();

    console.log('Testing all AI providers...');

    for (const provider of this.providers) {
      try {
        // Test with a simple request
        const testRequest: AIRequest = {
          context: 'Test message',
          persona: {
            id: 'test',
            name: 'Test Persona',
            handle: 'test',
            systemPrompt: 'You are a test persona.',
            politicalAlignment: {
              id: 'test-alignment',
              userId: 'test-user',
              economicPosition: 50,
              socialPosition: 50,
              primaryIssues: ['test'],
              partyAffiliation: null,
              ideologyTags: ['test'],
              debateWillingness: 50,
              controversyTolerance: 50,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            toneStyle: 'CASUAL' as any,
            personalityTraits: ['test'],
            interests: ['test'],
            expertise: ['test'],
            controversyTolerance: 50,
            debateAggression: 50,
            engagementFrequency: 50
          },
          constraints: {
            maxLength: 100,
            requirePoliticalStance: false,
            contextWindow: 1000
          }
        };

        const response = await provider.generateResponse(testRequest);
        results.set(provider.name, true);
        console.log(`✓ ${provider.name} test passed`);
      } catch (error) {
        results.set(provider.name, false);
        console.log(`✗ ${provider.name} test failed:`, error);
      }
    }

    return results;
  }

  getProviderByName(name: string): IAIProvider | null {
    return this.providers.find(provider => provider.name === name) || null;
  }

  resetCircuitBreakers(): void {
    this.circuitBreaker.resetAllProviders();
    console.log('All circuit breakers reset');
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getStatus() {
    const healthyProviders = this.getHealthyProviders();
    const circuitBreakerHealth = this.circuitBreaker.getHealthSummary();
    const cacheStats = this.responseCache.getStats();

    return {
      initialized: this.isInitialized,
      totalProviders: this.providers.length,
      healthyProviders: healthyProviders.length,
      primaryProviderHealthy: healthyProviders.length > 0 && healthyProviders[0].priority === 1,
      monitoring: this.healthMonitor.isMonitoring(),
      circuitBreaker: circuitBreakerHealth,
      cache: cacheStats,
      lastCheck: new Date()
    };
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================

  async shutdown(): Promise<void> {
    console.log('Shutting down AIOrchestrator...');

    this.stopHealthMonitoring();
    this.responseCache.dispose();
    this.circuitBreaker.cleanup();

    this.isInitialized = false;
    console.log('AIOrchestrator shutdown complete');
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

export function createAIOrchestrator(config: AIConfig): AIOrchestrator {
  const orchestrator = new AIOrchestrator(config);

  // Start health monitoring by default
  orchestrator.startHealthMonitoring();

  return orchestrator;
}
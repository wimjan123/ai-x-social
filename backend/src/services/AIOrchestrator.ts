import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../lib/logger';
import { cacheService } from './CacheService';
import { redis } from '../lib/redis';

interface AIProvider {
  name: string;
  isAvailable: boolean;
  priority: number;
  rateLimitRemaining: number;
  lastError?: string;
  lastUsed?: Date;
}

interface AIRequest {
  personaId: string;
  prompt: string;
  context?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

interface AIResponse {
  content: string;
  provider: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  finishReason: string;
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  timeout: number;
  retryAfter: number;
}

class CircuitBreaker {
  private failures: number = 0;
  private lastFailure?: Date;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailure = new Date();

    if (this.failures >= this.config.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  private shouldAttemptReset(): boolean {
    if (!this.lastFailure) return false;
    return Date.now() - this.lastFailure.getTime() > this.config.retryAfter;
  }

  get isOpen(): boolean {
    return this.state === 'OPEN';
  }
}

export class AIOrchestrator {
  private static instance: AIOrchestrator;
  private providers: Map<string, AIProvider> = new Map();
  private clients: Map<string, any> = new Map();
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();
  private demoMode: boolean = false;

  private readonly circuitBreakerConfig: CircuitBreakerConfig = {
    failureThreshold: 3,
    timeout: 30000,
    retryAfter: 60000,
  };

  private constructor() {
    this.initializeProviders();
    this.setupMonitoring();
  }

  public static getInstance(): AIOrchestrator {
    if (!AIOrchestrator.instance) {
      AIOrchestrator.instance = new AIOrchestrator();
    }
    return AIOrchestrator.instance;
  }

  private initializeProviders(): void {
    // Initialize Anthropic Claude
    if (process.env.ANTHROPIC_API_KEY) {
      const claude = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      this.clients.set('claude', claude);
      this.providers.set('claude', {
        name: 'Claude',
        isAvailable: true,
        priority: 1,
        rateLimitRemaining: 1000,
      });
      this.circuitBreakers.set('claude', new CircuitBreaker(this.circuitBreakerConfig));
      logger.info('Anthropic Claude initialized');
    }

    // Initialize OpenAI GPT
    if (process.env.OPENAI_API_KEY) {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      this.clients.set('openai', openai);
      this.providers.set('openai', {
        name: 'OpenAI GPT',
        isAvailable: true,
        priority: 2,
        rateLimitRemaining: 1000,
      });
      this.circuitBreakers.set('openai', new CircuitBreaker(this.circuitBreakerConfig));
      logger.info('OpenAI GPT initialized');
    }

    // Initialize Google Gemini
    if (process.env.GOOGLE_API_KEY) {
      const gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      this.clients.set('gemini', gemini);
      this.providers.set('gemini', {
        name: 'Google Gemini',
        isAvailable: true,
        priority: 3,
        rateLimitRemaining: 1000,
      });
      this.circuitBreakers.set('gemini', new CircuitBreaker(this.circuitBreakerConfig));
      logger.info('Google Gemini initialized');
    }

    // Demo mode fallback
    if (this.providers.size === 0) {
      this.demoMode = true;
      this.providers.set('demo', {
        name: 'Demo Mode',
        isAvailable: true,
        priority: 99,
        rateLimitRemaining: 10000,
      });
      logger.warn('No AI providers configured, running in demo mode');
    }

    logger.info(`AI Orchestrator initialized with ${this.providers.size} provider(s)`);
  }

  private setupMonitoring(): void {
    // Health check every 5 minutes
    setInterval(async () => {
      await this.healthCheckProviders();
    }, 5 * 60 * 1000);

    // Rate limit reset every hour
    setInterval(() => {
      this.resetRateLimits();
    }, 60 * 60 * 1000);
  }

  private async healthCheckProviders(): Promise<void> {
    for (const [providerName, provider] of this.providers) {
      if (providerName === 'demo') continue;

      try {
        await this.testProvider(providerName);
        provider.isAvailable = true;
        logger.debug(`Health check passed for ${providerName}`);
      } catch (error) {
        provider.isAvailable = false;
        provider.lastError = error instanceof Error ? error.message : 'Unknown error';
        logger.warn(`Health check failed for ${providerName}:`, error);
      }
    }
  }

  private async testProvider(providerName: string): Promise<void> {
    const client = this.clients.get(providerName);
    if (!client) throw new Error('Client not found');

    switch (providerName) {
      case 'claude':
        await client.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hello' }],
        });
        break;

      case 'openai':
        await client.chat.completions.create({
          model: 'gpt-3.5-turbo',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hello' }],
        });
        break;

      case 'gemini':
        const model = client.getGenerativeModel({ model: 'gemini-pro' });
        await model.generateContent('Hello');
        break;

      default:
        throw new Error(`Unknown provider: ${providerName}`);
    }
  }

  private resetRateLimits(): void {
    for (const provider of this.providers.values()) {
      provider.rateLimitRemaining = 1000; // Reset to default
    }
    logger.debug('Rate limits reset for all providers');
  }

  private selectProvider(request: AIRequest): string {
    const availableProviders = Array.from(this.providers.entries())
      .filter(([name, provider]) => {
        if (!provider.isAvailable) return false;
        if (provider.rateLimitRemaining <= 0) return false;

        const circuitBreaker = this.circuitBreakers.get(name);
        if (circuitBreaker?.isOpen) return false;

        return true;
      })
      .sort(([, a], [, b]) => a.priority - b.priority);

    if (availableProviders.length === 0) {
      if (this.demoMode || this.providers.has('demo')) {
        return 'demo';
      }
      throw new Error('No AI providers available');
    }

    return availableProviders[0][0];
  }

  public async generateResponse(request: AIRequest): Promise<AIResponse> {
    const providerName = this.selectProvider(request);
    const provider = this.providers.get(providerName)!;

    // Check cache first
    const cacheKey = `ai:response:${providerName}:${Buffer.from(request.prompt).toString('base64')}`;
    const cachedResponse = await cacheService.getAIContext(request.personaId, 'cached');

    if (cachedResponse) {
      logger.debug(`Cache hit for AI response: ${providerName}`);
      return cachedResponse;
    }

    logger.info(`Generating AI response using ${providerName} for persona ${request.personaId}`);

    try {
      const response = await this.callProvider(providerName, request);

      // Cache the response
      await cacheService.cacheAIContext(request.personaId, 'cached', response, 3600);

      // Update provider stats
      provider.lastUsed = new Date();
      provider.rateLimitRemaining = Math.max(0, provider.rateLimitRemaining - 1);

      return response;
    } catch (error) {
      logger.error(`AI generation failed with ${providerName}:`, error);

      // Try fallback providers
      const fallbackProviders = Array.from(this.providers.keys())
        .filter(name => name !== providerName && this.providers.get(name)?.isAvailable);

      for (const fallbackName of fallbackProviders) {
        try {
          logger.info(`Trying fallback provider: ${fallbackName}`);
          const response = await this.callProvider(fallbackName, request);

          // Update fallback provider stats
          const fallbackProvider = this.providers.get(fallbackName)!;
          fallbackProvider.lastUsed = new Date();
          fallbackProvider.rateLimitRemaining = Math.max(0, fallbackProvider.rateLimitRemaining - 1);

          return response;
        } catch (fallbackError) {
          logger.error(`Fallback provider ${fallbackName} also failed:`, fallbackError);
        }
      }

      // If all providers fail, return demo response
      return this.generateDemoResponse(request);
    }
  }

  private async callProvider(providerName: string, request: AIRequest): Promise<AIResponse> {
    const circuitBreaker = this.circuitBreakers.get(providerName);

    if (circuitBreaker) {
      return await circuitBreaker.execute(() => this.executeProviderCall(providerName, request));
    } else {
      return await this.executeProviderCall(providerName, request);
    }
  }

  private async executeProviderCall(providerName: string, request: AIRequest): Promise<AIResponse> {
    const client = this.clients.get(providerName);
    const systemPrompt = request.systemPrompt || this.getDefaultSystemPrompt(request.personaId);

    switch (providerName) {
      case 'claude':
        return await this.callClaude(client, request, systemPrompt);

      case 'openai':
        return await this.callOpenAI(client, request, systemPrompt);

      case 'gemini':
        return await this.callGemini(client, request, systemPrompt);

      case 'demo':
        return this.generateDemoResponse(request);

      default:
        throw new Error(`Unknown provider: ${providerName}`);
    }
  }

  private async callClaude(client: Anthropic, request: AIRequest, systemPrompt: string): Promise<AIResponse> {
    const response = await client.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: request.maxTokens || 1000,
      temperature: request.temperature || 0.7,
      system: systemPrompt,
      messages: [
        ...(request.context ? [{ role: 'user' as const, content: request.context }] : []),
        { role: 'user' as const, content: request.prompt },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    return {
      content: content.text,
      provider: 'claude',
      model: 'claude-3-sonnet-20240229',
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
      finishReason: response.stop_reason || 'unknown',
    };
  }

  private async callOpenAI(client: OpenAI, request: AIRequest, systemPrompt: string): Promise<AIResponse> {
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      max_tokens: request.maxTokens || 1000,
      temperature: request.temperature || 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        ...(request.context ? [{ role: 'user' as const, content: request.context }] : []),
        { role: 'user', content: request.prompt },
      ],
    });

    const choice = response.choices[0];
    if (!choice.message.content) {
      throw new Error('No content in OpenAI response');
    }

    return {
      content: choice.message.content,
      provider: 'openai',
      model: 'gpt-4',
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
      finishReason: choice.finish_reason || 'unknown',
    };
  }

  private async callGemini(client: GoogleGenerativeAI, request: AIRequest, systemPrompt: string): Promise<AIResponse> {
    const model = client.getGenerativeModel({
      model: 'gemini-pro',
      generationConfig: {
        temperature: request.temperature || 0.7,
        maxOutputTokens: request.maxTokens || 1000,
      },
    });

    const fullPrompt = `${systemPrompt}\n\n${request.context ? request.context + '\n\n' : ''}${request.prompt}`;
    const response = await model.generateContent(fullPrompt);

    const content = response.response.text();
    if (!content) {
      throw new Error('No content in Gemini response');
    }

    return {
      content,
      provider: 'gemini',
      model: 'gemini-pro',
      usage: {
        promptTokens: 0, // Gemini doesn't provide token usage
        completionTokens: 0,
        totalTokens: 0,
      },
      finishReason: 'stop',
    };
  }

  private generateDemoResponse(request: AIRequest): AIResponse {
    const demoResponses = [
      "I appreciate your engagement! As an AI persona in this demonstration, I'm generating responses to simulate political discourse.",
      "Thank you for bringing up this important topic. In this demo environment, I represent a particular political viewpoint to showcase platform capabilities.",
      "This is a fascinating point you've raised. As part of the AI social media simulation, I'm designed to respond with authentic political perspectives.",
      "I understand your concern about this issue. This platform demonstrates how AI personas can engage in political discussions with distinct viewpoints.",
      "That's an interesting perspective. In this demonstration, I'm simulating how different political figures might respond to current events and discussions.",
    ];

    const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];

    return {
      content: randomResponse,
      provider: 'demo',
      model: 'demo-v1',
      usage: {
        promptTokens: request.prompt.length / 4, // Rough estimate
        completionTokens: randomResponse.length / 4,
        totalTokens: (request.prompt.length + randomResponse.length) / 4,
      },
      finishReason: 'stop',
    };
  }

  private getDefaultSystemPrompt(personaId: string): string {
    return `You are an AI persona representing a political figure or influencer on a social media platform.
Respond authentically to user posts and comments while maintaining your character's political alignment,
personality traits, and expertise areas. Keep responses concise and engaging, suitable for social media interaction.
Persona ID: ${personaId}`;
  }

  public async getProviderStatus(): Promise<Record<string, AIProvider>> {
    const status: Record<string, AIProvider> = {};

    for (const [name, provider] of this.providers) {
      const circuitBreaker = this.circuitBreakers.get(name);
      status[name] = {
        ...provider,
        isAvailable: provider.isAvailable && !circuitBreaker?.isOpen,
      };
    }

    return status;
  }

  public async configureCustomProvider(apiKey: string, baseUrl?: string): Promise<boolean> {
    try {
      // This could be used for custom OpenAI-compatible APIs
      const customClient = new OpenAI({
        apiKey,
        baseURL: baseUrl,
      });

      // Test the custom provider
      await customClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hello' }],
      });

      this.clients.set('custom', customClient);
      this.providers.set('custom', {
        name: 'Custom Provider',
        isAvailable: true,
        priority: 0, // Highest priority
        rateLimitRemaining: 1000,
      });

      logger.info('Custom AI provider configured successfully');
      return true;
    } catch (error) {
      logger.error('Failed to configure custom AI provider:', error);
      return false;
    }
  }

  public getMetrics(): {
    totalProviders: number;
    availableProviders: number;
    totalRequests: number;
    averageResponseTime: number;
    providerUsage: Record<string, number>;
  } {
    // This would be implemented with proper metrics tracking
    return {
      totalProviders: this.providers.size,
      availableProviders: Array.from(this.providers.values()).filter(p => p.isAvailable).length,
      totalRequests: 0, // Would track this
      averageResponseTime: 0, // Would track this
      providerUsage: {}, // Would track per-provider usage
    };
  }
}

export const aiOrchestrator = AIOrchestrator.getInstance();
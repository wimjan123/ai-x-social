/**
 * AI Provider Interface and Core Types
 *
 * Defines the contract for multi-provider AI integration with political persona support.
 * Implements T049a: Base AI provider interface and abstract class
 */

import { PoliticalAlignment } from '../../../models/PoliticalAlignment';
import { ToneStyle } from '../../../generated/prisma';

// ============================================================================
// CORE INTERFACES
// ============================================================================

export interface IAIProvider {
  readonly name: string;
  readonly priority: number;
  readonly isHealthy: boolean;

  generateResponse(request: AIRequest): Promise<AIResponse>;
  checkHealth(): Promise<HealthStatus>;
  getCapabilities(): ProviderCapabilities;
}

export interface AIRequest {
  context: string;
  persona: PersonaConfiguration;
  constraints: ResponseConstraints;
  conversationHistory?: ConversationTurn[];
  newsContext?: NewsItem;
}

export interface AIResponse {
  content: string;
  confidence: number;
  processingTime: number;
  provider: string;
  model: string;
  tokens?: TokenUsage;
  safety?: SafetyResults;
}

export interface PersonaConfiguration {
  id: string;
  name: string;
  handle: string;
  systemPrompt: string;
  politicalAlignment: PoliticalAlignment;
  toneStyle: ToneStyle;
  personalityTraits: string[];
  interests: string[];
  expertise: string[];
  controversyTolerance: number;
  debateAggression: number;
  engagementFrequency: number;
}

export interface ResponseConstraints {
  maxLength: number;
  requirePoliticalStance: boolean;
  avoidTopics?: string[];
  requiredTone?: ToneStyle;
  contextWindow: number;
  temperature?: number;
}

export interface ConversationTurn {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  personaId?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  category: string;
  keywords: string[];
  sentiment: number;
  publishedAt: Date;
}

export interface TokenUsage {
  input: number;
  output: number;
  total: number;
}

export interface SafetyResults {
  isAllowed: boolean;
  flags: string[];
  confidence: number;
}

export interface HealthStatus {
  isHealthy: boolean;
  responseTime: number;
  errorRate: number;
  lastChecked: Date;
  consecutiveFailures: number;
}

export interface ProviderCapabilities {
  maxTokens: number;
  supportsConversationHistory: boolean;
  supportsPoliticalAlignment: boolean;
  supportsPersonaInjection: boolean;
  supportsContentFiltering: boolean;
  supportedLanguages: string[];
  costPerToken: number;
}

// ============================================================================
// AI CONFIGURATION
// ============================================================================

export interface AIConfig {
  claude?: {
    apiKey: string;
    baseURL?: string;
    model?: string;
  };
  openai?: {
    apiKey: string;
    baseURL?: string;
    model?: string;
  };
  google?: {
    apiKey: string;
    model?: string;
  };
  defaultProvider?: string;
  fallbackEnabled?: boolean;
  cacheEnabled?: boolean;
  cacheTTL?: number;
}

// ============================================================================
// POLITICAL ALIGNMENT TYPES (Enhanced)
// ============================================================================

export interface PoliticalAlignment {
  id: string;
  userId: string;
  economicPosition: number; // 0-100: left to right
  socialPosition: number;   // 0-100: liberal to conservative
  primaryIssues: string[];
  partyAffiliation: string | null;
  ideologyTags: string[];
  debateWillingness: number;
  controversyTolerance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PoliticalContext {
  economicStance: 'left' | 'center-left' | 'center' | 'center-right' | 'right';
  socialStance: 'liberal' | 'moderate-liberal' | 'moderate' | 'moderate-conservative' | 'conservative';
  quadrant: 'auth-left' | 'auth-right' | 'lib-left' | 'lib-right';
  primaryIssues: string[];
  ideologyTags: string[];
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export abstract class AIProviderError extends Error {
  constructor(
    public provider: string,
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class RateLimitError extends AIProviderError {
  constructor(provider: string, message: string = 'Rate limit exceeded') {
    super(provider, message, 429);
  }
}

export class ServiceUnavailableError extends AIProviderError {
  constructor(provider: string, message: string = 'Service temporarily unavailable') {
    super(provider, message, 503);
  }
}

export class ContentFilterError extends AIProviderError {
  constructor(provider: string, message: string = 'Content filtered by safety checks') {
    super(provider, message, 400);
  }
}

export class InvalidRequestError extends AIProviderError {
  constructor(provider: string, message: string = 'Invalid request parameters') {
    super(provider, message, 400);
  }
}

export class ModelNotFoundError extends AIProviderError {
  constructor(provider: string, model: string) {
    super(provider, `Model ${model} not found or not accessible`, 404);
  }
}

// ============================================================================
// PROVIDER HEALTH & MONITORING
// ============================================================================

export interface ProviderHealthReport {
  name: string;
  priority: number;
  health: HealthStatus;
  circuitBreakerState: CircuitBreakerState;
  capabilities: ProviderCapabilities;
  lastResponse?: {
    timestamp: Date;
    responseTime: number;
    success: boolean;
  };
}

export interface CircuitBreakerState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  consecutiveFailures: number;
  lastFailure: number;
  nextRetryTime?: number;
}

// ============================================================================
// CACHE INTERFACES
// ============================================================================

export interface CacheEntry {
  key: string;
  response: AIResponse;
  timestamp: Date;
  expiresAt: Date;
}

export interface ResponseCache {
  get(key: string): Promise<AIResponse | null>;
  set(key: string, response: AIResponse, ttl: number): Promise<void>;
  invalidate(key: string): Promise<void>;
  clear(): Promise<void>;
}

// ============================================================================
// METRICS & ANALYTICS
// ============================================================================

export interface ProviderMetrics {
  provider: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  totalTokensUsed: number;
  estimatedCost: number;
  lastUsed: Date;
}

export interface AIOrchestatorMetrics {
  providers: ProviderMetrics[];
  totalRequests: number;
  cacheHitRate: number;
  averageResponseTime: number;
  totalCost: number;
  uptime: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ProviderName = 'Claude' | 'GPT' | 'Gemini' | 'Demo';

export interface ProviderSelection {
  provider: IAIProvider;
  reason: 'primary' | 'fallback' | 'circuit_breaker' | 'health_check';
}

export interface GenerationContext {
  requestId: string;
  timestamp: Date;
  selectedProvider: ProviderSelection;
  cacheHit: boolean;
  responseTime: number;
}
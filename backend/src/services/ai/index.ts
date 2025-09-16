/**
 * AI Services Main Export
 *
 * Central export point for all AI service components.
 * Provides a complete multi-provider AI integration system.
 */

// ============================================================================
// MAIN ORCHESTRATOR
// ============================================================================

export { AIOrchestrator, createAIOrchestrator } from './AIOrchestrator';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export type {
  IAIProvider,
  AIRequest,
  AIResponse,
  AIConfig,
  PersonaConfiguration,
  ResponseConstraints,
  ConversationTurn,
  NewsItem,
  TokenUsage,
  SafetyResults,
  HealthStatus,
  ProviderCapabilities,
  ProviderHealthReport,
  CircuitBreakerState,
  CacheEntry,
  ResponseCache,
  ProviderMetrics,
  AIOrchestatorMetrics,
  ProviderSelection,
  GenerationContext,
  PoliticalAlignment,
  PoliticalContext,
  ProviderName
} from './interfaces/IAIProvider';

// ============================================================================
// ERROR TYPES
// ============================================================================

export {
  AIProviderError,
  RateLimitError,
  ServiceUnavailableError,
  ContentFilterError,
  InvalidRequestError,
  ModelNotFoundError
} from './interfaces/IAIProvider';

// ============================================================================
// PROVIDERS
// ============================================================================

export { BaseAIProvider } from './providers/BaseProvider';
export { ClaudeProvider } from './providers/ClaudeProvider';
export { GPTProvider } from './providers/GPTProvider';
export { GeminiProvider } from './providers/GeminiProvider';
export { DemoProvider } from './providers/DemoProvider';

// ============================================================================
// UTILITIES
// ============================================================================

export { CircuitBreaker } from './utils/CircuitBreaker';
export { HealthMonitor } from './utils/HealthMonitor';
export { ResponseCache } from './utils/ResponseCache';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a basic AI configuration with demo provider only
 */
export function createDemoConfig(): AIConfig {
  return {
    defaultProvider: 'Demo',
    fallbackEnabled: true,
    cacheEnabled: true,
    cacheTTL: 300000 // 5 minutes
  };
}

/**
 * Creates AI configuration from environment variables
 */
export function createConfigFromEnv(): AIConfig {
  const config: AIConfig = {
    defaultProvider: process.env.AI_DEFAULT_PROVIDER || 'Demo',
    fallbackEnabled: process.env.AI_FALLBACK_ENABLED !== 'false',
    cacheEnabled: process.env.AI_CACHE_ENABLED !== 'false',
    cacheTTL: parseInt(process.env.AI_CACHE_TTL || '300000')
  };

  // Claude configuration
  if (process.env.ANTHROPIC_API_KEY) {
    config.claude = {
      apiKey: process.env.ANTHROPIC_API_KEY,
      baseURL: process.env.ANTHROPIC_BASE_URL,
      model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229'
    };
  }

  // OpenAI configuration
  if (process.env.OPENAI_API_KEY) {
    config.openai = {
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
      model: process.env.OPENAI_MODEL || 'gpt-4'
    };
  }

  // Google AI configuration
  if (process.env.GOOGLE_AI_API_KEY) {
    config.google = {
      apiKey: process.env.GOOGLE_AI_API_KEY,
      model: process.env.GOOGLE_AI_MODEL || 'gemini-pro'
    };
  }

  return config;
}

/**
 * Validates AI configuration
 */
export function validateConfig(config: AIConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if at least one provider is configured
  const hasProvider = config.claude?.apiKey || config.openai?.apiKey || config.google?.apiKey;
  if (!hasProvider) {
    errors.push('At least one AI provider must be configured (or demo mode will be used)');
  }

  // Validate cache settings
  if (config.cacheEnabled && config.cacheTTL && config.cacheTTL < 1000) {
    errors.push('Cache TTL should be at least 1000ms (1 second)');
  }

  // Validate provider-specific settings
  if (config.claude?.apiKey && !config.claude.apiKey.startsWith('sk-ant-')) {
    errors.push('Claude API key should start with "sk-ant-"');
  }

  if (config.openai?.apiKey && !config.openai.apiKey.startsWith('sk-')) {
    errors.push('OpenAI API key should start with "sk-"');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Creates a basic AI request for testing
 */
export function createTestRequest(
  context: string = 'Hello, how are you?',
  personaOverrides?: Partial<PersonaConfiguration>
): AIRequest {
  const defaultPersona: PersonaConfiguration = {
    id: 'test-persona',
    name: 'Test User',
    handle: 'testuser',
    systemPrompt: 'You are a helpful AI assistant with moderate political views.',
    politicalAlignment: {
      id: 'test-alignment',
      userId: 'test-user',
      economicPosition: 50,
      socialPosition: 50,
      primaryIssues: ['economy', 'healthcare'],
      partyAffiliation: null,
      ideologyTags: ['moderate'],
      debateWillingness: 50,
      controversyTolerance: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    toneStyle: 'CASUAL' as any,
    personalityTraits: ['friendly', 'thoughtful'],
    interests: ['technology', 'politics'],
    expertise: ['general'],
    controversyTolerance: 50,
    debateAggression: 30,
    engagementFrequency: 70
  };

  return {
    context,
    persona: { ...defaultPersona, ...personaOverrides },
    constraints: {
      maxLength: 280,
      requirePoliticalStance: false,
      contextWindow: 2000
    }
  };
}

/**
 * Gets political alignment description
 */
export function describePoliticalAlignment(alignment: PoliticalAlignment): string {
  const economic = alignment.economicPosition < 30 ? 'left-leaning' :
                  alignment.economicPosition > 70 ? 'right-leaning' : 'centrist';
  const social = alignment.socialPosition < 30 ? 'liberal' :
                alignment.socialPosition > 70 ? 'conservative' : 'moderate';

  return `${economic} economically, ${social} socially`;
}

/**
 * Calculates political distance between two alignments
 */
export function calculatePoliticalDistance(a: PoliticalAlignment, b: PoliticalAlignment): number {
  const economicDiff = Math.abs(a.economicPosition - b.economicPosition);
  const socialDiff = Math.abs(a.socialPosition - b.socialPosition);

  // Euclidean distance in political space
  return Math.sqrt(economicDiff * economicDiff + socialDiff * socialDiff);
}

/**
 * Determines if two personas would likely agree on a topic
 */
export function wouldPersonasAgree(
  personaA: PersonaConfiguration,
  personaB: PersonaConfiguration,
  topic?: string
): number {
  const distance = calculatePoliticalDistance(personaA.politicalAlignment, personaB.politicalAlignment);
  const maxDistance = Math.sqrt(100 * 100 + 100 * 100); // Maximum possible distance

  // Base agreement on political distance (0-1, where 1 is full agreement)
  let agreement = 1 - (distance / maxDistance);

  // Adjust for controversy tolerance
  const avgControversy = (personaA.controversyTolerance + personaB.controversyTolerance) / 2;
  if (avgControversy > 70) {
    agreement *= 0.8; // High controversy tolerance may lead to more disagreement
  }

  // Topic-specific adjustments
  if (topic) {
    const topicLower = topic.toLowerCase();
    const controversialTopics = ['abortion', 'gun control', 'taxes', 'immigration', 'healthcare'];

    if (controversialTopics.some(ct => topicLower.includes(ct))) {
      agreement *= 0.7; // Controversial topics reduce agreement
    }
  }

  return Math.max(0, Math.min(1, agreement));
}

/**
 * Estimates response cost for a request
 */
export function estimateResponseCost(
  request: AIRequest,
  provider: IAIProvider
): number {
  const capabilities = provider.getCapabilities();
  const estimatedInputTokens = Math.floor(request.context.length / 4);
  const estimatedOutputTokens = Math.floor(request.constraints.maxLength / 4);
  const totalTokens = estimatedInputTokens + estimatedOutputTokens;

  return totalTokens * capabilities.costPerToken;
}

/**
 * Formats a response for display
 */
export function formatResponse(response: AIResponse): string {
  const cost = response.tokens
    ? `(${response.tokens.total} tokens)`
    : '';

  return `[${response.provider}] ${response.content} ${cost}`.trim();
}

/**
 * Creates a summary of system health
 */
export function summarizeSystemHealth(reports: ProviderHealthReport[]): {
  status: 'healthy' | 'degraded' | 'unhealthy';
  summary: string;
  details: string[];
} {
  const healthyCount = reports.filter(r => r.health.isHealthy).length;
  const totalCount = reports.length;

  let status: 'healthy' | 'degraded' | 'unhealthy';
  let summary: string;

  if (healthyCount === totalCount) {
    status = 'healthy';
    summary = 'All AI providers are healthy';
  } else if (healthyCount > 0) {
    status = 'degraded';
    summary = `${healthyCount}/${totalCount} AI providers are healthy`;
  } else {
    status = 'unhealthy';
    summary = 'No AI providers are healthy';
  }

  const details = reports.map(report => {
    const health = report.health.isHealthy ? '✓' : '✗';
    const responseTime = `${report.health.responseTime}ms`;
    return `${health} ${report.name} (${responseTime})`;
  });

  return { status, summary, details };
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const AI_PROVIDER_PRIORITIES = {
  CLAUDE: 1,
  GPT: 2,
  GEMINI: 3,
  DEMO: 999
} as const;

export const DEFAULT_CONSTRAINTS: ResponseConstraints = {
  maxLength: 280,
  requirePoliticalStance: false,
  contextWindow: 2000
};

export const POLITICAL_QUADRANTS = {
  'lib-left': 'Liberal Left',
  'lib-right': 'Liberal Right',
  'auth-left': 'Authoritarian Left',
  'auth-right': 'Authoritarian Right'
} as const;
/**
 * Claude AI Provider Implementation
 *
 * Anthropic Claude integration with political persona support and error handling.
 * Implements T049b: Claude provider with error handling and retries
 */

import Anthropic from '@anthropic-ai/sdk';
import { BaseAIProvider } from './BaseProvider';
import {
  AIRequest,
  AIResponse,
  HealthStatus,
  ProviderCapabilities,
  PersonaConfiguration,
  SafetyResults,
  RateLimitError,
  ServiceUnavailableError,
  ModelNotFoundError
} from '../interfaces/IAIProvider';

export class ClaudeProvider extends BaseAIProvider {
  readonly name = 'Claude';
  readonly priority = 1; // Highest priority

  private client: Anthropic;
  private model: string;
  private maxRetries: number;

  constructor(
    apiKey: string,
    baseURL?: string,
    model: string = 'claude-3-sonnet-20240229',
    maxRetries: number = 3
  ) {
    super();

    this.client = new Anthropic({
      apiKey,
      baseURL: baseURL || 'https://api.anthropic.com'
    });

    this.model = model;
    this.maxRetries = maxRetries;
  }

  // ============================================================================
  // PROVIDER-SPECIFIC IMPLEMENTATION
  // ============================================================================

  protected async callAPI(prompt: string, request: AIRequest): Promise<any> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const temperature = this.getTemperatureFromPersona(request.persona);
        const maxTokens = Math.min(
          Math.floor(request.constraints.maxLength / 2.5), // Rough character to token conversion
          4096
        );

        const response = await this.client.messages.create({
          model: this.model,
          max_tokens: maxTokens,
          temperature,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          metadata: {
            persona_id: request.persona.id,
            request_type: 'political_simulation'
          }
        });

        return response;

      } catch (error: any) {
        lastError = error;

        // Don't retry on certain errors
        if (error.status === 400 || error.status === 401 || error.status === 403) {
          throw error;
        }

        // For rate limits and server errors, retry with exponential backoff
        if (attempt < this.maxRetries && (error.status === 429 || error.status >= 500)) {
          const backoffMs = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue;
        }

        throw error;
      }
    }

    throw lastError;
  }

  protected extractContent(rawResponse: any): string {
    if (!rawResponse.content || !Array.isArray(rawResponse.content) || rawResponse.content.length === 0) {
      throw new Error('Invalid response format from Claude API');
    }

    const textContent = rawResponse.content.find((c: any) => c.type === 'text');
    if (!textContent) {
      throw new Error('No text content found in Claude response');
    }

    return textContent.text;
  }

  protected extractTokenUsage(rawResponse: any): { input: number; output: number; total: number } {
    const usage = rawResponse.usage;
    return {
      input: usage?.input_tokens || 0,
      output: usage?.output_tokens || 0,
      total: (usage?.input_tokens || 0) + (usage?.output_tokens || 0)
    };
  }

  protected getModelName(rawResponse: any): string {
    return rawResponse.model || this.model;
  }

  protected calculateConfidence(rawResponse: any, request: AIRequest): number {
    let confidence = 0.9; // Claude generally high confidence

    // Adjust based on response characteristics
    const content = this.extractContent(rawResponse);

    // Higher confidence for longer, more detailed responses
    if (content.length > 100) {
      confidence += 0.05;
    }

    // Adjust based on political alignment requirements
    if (request.constraints.requirePoliticalStance) {
      confidence += 0.05;
    }

    // Adjust based on persona complexity
    if (request.persona.personalityTraits.length > 3) {
      confidence -= 0.05;
    }

    return Math.min(confidence, 1.0);
  }

  // ============================================================================
  // ENHANCED SAFETY & VALIDATION
  // ============================================================================

  protected async checkContentSafety(content: string, persona: PersonaConfiguration): Promise<SafetyResults> {
    const flags: string[] = [];
    let confidence = 1.0;

    // Claude has built-in safety, but add additional political context checks
    const hateSpeechCheck = this.detectHateSpeech(content);
    const misinformationCheck = this.detectMisinformation(content);
    const extremismCheck = this.detectExtremism(content, persona);
    const politicalBiasCheck = this.checkPoliticalBias(content, persona);

    if (hateSpeechCheck.detected) {
      flags.push('hate_speech');
      confidence = Math.min(confidence, hateSpeechCheck.confidence);
    }

    if (misinformationCheck.detected) {
      flags.push('misinformation');
      confidence = Math.min(confidence, misinformationCheck.confidence);
    }

    if (extremismCheck.detected) {
      flags.push('extremism');
      confidence = Math.min(confidence, extremismCheck.confidence);
    }

    if (politicalBiasCheck.detected) {
      flags.push('excessive_bias');
      confidence = Math.min(confidence, politicalBiasCheck.confidence);
    }

    return {
      isAllowed: flags.length === 0,
      flags,
      confidence
    };
  }

  private checkPoliticalBias(content: string, persona: PersonaConfiguration): { detected: boolean; confidence: number } {
    // Check for excessive political bias that might violate platform guidelines
    const extremeBiasPatterns = [
      /(?:all|every) (?:republicans|democrats|conservatives|liberals) are (?:evil|stupid|corrupt|traitors)/i,
      /(?:republicans|democrats) (?:hate|want to destroy) america/i,
      /(?:left|right) wing (?:conspiracy|plot) to (?:destroy|control)/i
    ];

    const detected = extremeBiasPatterns.some(pattern => pattern.test(content));

    return {
      detected,
      confidence: detected ? 0.8 : 1.0
    };
  }

  // ============================================================================
  // HEALTH MONITORING
  // ============================================================================

  async checkHealth(): Promise<HealthStatus> {
    const startTime = Date.now();

    try {
      // Simple health check with minimal token usage
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 10,
        messages: [
          {
            role: 'user',
            content: 'Health check - respond with OK'
          }
        ]
      });

      const responseTime = Date.now() - startTime;

      // Verify we got a valid response
      if (!response.content || response.content.length === 0) {
        throw new Error('Invalid health check response');
      }

      return {
        isHealthy: true,
        responseTime,
        errorRate: this._errorRate,
        lastChecked: new Date(),
        consecutiveFailures: this._consecutiveFailures
      };

    } catch (error: any) {
      console.warn(`Claude health check failed:`, error.message);

      return {
        isHealthy: false,
        responseTime: Date.now() - startTime,
        errorRate: 1.0,
        lastChecked: new Date(),
        consecutiveFailures: this._consecutiveFailures + 1
      };
    }
  }

  // ============================================================================
  // PROVIDER CAPABILITIES
  // ============================================================================

  getCapabilities(): ProviderCapabilities {
    return {
      maxTokens: 4096,
      supportsConversationHistory: true,
      supportsPoliticalAlignment: true,
      supportsPersonaInjection: true,
      supportsContentFiltering: true,
      supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
      costPerToken: 0.000008 // Approximate cost per token (varies by model)
    };
  }

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  protected handleError(error: any): Error {
    // Map Claude-specific errors
    if (error.type === 'rate_limit_error') {
      return new RateLimitError(this.name, `Claude rate limit: ${error.message}`);
    }

    if (error.type === 'overloaded_error') {
      return new ServiceUnavailableError(this.name, 'Claude service is overloaded');
    }

    if (error.status === 404 || error.type === 'not_found_error') {
      return new ModelNotFoundError(this.name, this.model);
    }

    if (error.status === 401 || error.type === 'authentication_error') {
      return new Error(`Claude authentication failed: ${error.message}`);
    }

    if (error.status === 403 || error.type === 'permission_error') {
      return new Error(`Claude permission denied: ${error.message}`);
    }

    // Use base class error handling for other cases
    return super.handleError(error);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  getModel(): string {
    return this.model;
  }

  setModel(model: string): void {
    this.model = model;
  }

  async testConnection(): Promise<boolean> {
    try {
      const health = await this.checkHealth();
      return health.isHealthy;
    } catch {
      return false;
    }
  }

  getEstimatedCost(request: AIRequest): number {
    const estimatedTokens = Math.floor(request.context.length / 4) +
                           Math.floor(request.constraints.maxLength / 4);
    return estimatedTokens * this.getCapabilities().costPerToken;
  }
}
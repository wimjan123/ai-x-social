/**
 * GPT AI Provider Implementation
 *
 * OpenAI GPT integration with political persona support and fallback capabilities.
 * Implements T049c: GPT fallback provider with error handling
 */

import OpenAI from 'openai';
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

export class GPTProvider extends BaseAIProvider {
  readonly name = 'GPT';
  readonly priority = 2; // Second priority after Claude

  private client: OpenAI;
  private model: string;
  private maxRetries: number;

  constructor(
    apiKey: string,
    baseURL?: string,
    model: string = 'gpt-4',
    maxRetries: number = 3
  ) {
    super();

    this.client = new OpenAI({
      apiKey,
      baseURL: baseURL || 'https://api.openai.com/v1'
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
          Math.floor(request.constraints.maxLength / 2.5), // Character to token conversion
          4096
        );

        // Split system prompt and user prompt for GPT's format
        const systemPrompt = this.extractSystemPrompt(request.persona);
        const userPrompt = this.extractUserPrompt(prompt, request);

        const response = await this.client.chat.completions.create({
          model: this.model,
          max_tokens: maxTokens,
          temperature,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          user: `persona_${request.persona.id}`, // For tracking and safety
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
    if (!rawResponse.choices || rawResponse.choices.length === 0) {
      throw new Error('Invalid response format from GPT API');
    }

    const choice = rawResponse.choices[0];
    if (!choice.message || !choice.message.content) {
      throw new Error('No content found in GPT response');
    }

    return choice.message.content;
  }

  protected extractTokenUsage(rawResponse: any): { input: number; output: number; total: number } {
    const usage = rawResponse.usage;
    return {
      input: usage?.prompt_tokens || 0,
      output: usage?.completion_tokens || 0,
      total: usage?.total_tokens || 0
    };
  }

  protected getModelName(rawResponse: any): string {
    return rawResponse.model || this.model;
  }

  protected calculateConfidence(rawResponse: any, request: AIRequest): number {
    let confidence = 0.85; // Slightly lower than Claude

    // Check finish reason for quality indicators
    const choice = rawResponse.choices?.[0];
    if (choice?.finish_reason === 'stop') {
      confidence += 0.1; // Clean completion
    } else if (choice?.finish_reason === 'length') {
      confidence -= 0.1; // Truncated response
    }

    // Adjust based on political alignment requirements
    if (request.constraints.requirePoliticalStance) {
      confidence += 0.05;
    }

    // GPT-4 vs GPT-3.5 adjustment
    if (this.model.includes('gpt-4')) {
      confidence += 0.1;
    } else if (this.model.includes('gpt-3.5')) {
      confidence -= 0.05;
    }

    return Math.min(confidence, 1.0);
  }

  // ============================================================================
  // GPT-SPECIFIC PROMPT HANDLING
  // ============================================================================

  private extractSystemPrompt(persona: PersonaConfiguration): string {
    const politicalContext = this.buildPoliticalContext(persona.politicalAlignment);
    const formattedContext = this.formatPoliticalContext(politicalContext);

    return `${persona.systemPrompt}

PERSONA IDENTITY:
You are ${persona.name} (@${persona.handle}), a political figure with specific views and characteristics.

POLITICAL ALIGNMENT:
${formattedContext}

PERSONALITY PROFILE:
- Traits: ${persona.personalityTraits.join(', ')}
- Interests: ${persona.interests.join(', ')}
- Expertise: ${persona.expertise.join(', ')}
- Communication Style: ${persona.toneStyle}
- Controversy Tolerance: ${persona.controversyTolerance}/100
- Debate Aggression: ${persona.debateAggression}/100
- Engagement Level: ${persona.engagementFrequency}/100

BEHAVIORAL GUIDELINES:
- Stay completely in character at all times
- Express opinions consistent with your political alignment
- React to content based on your political perspective
- Use your designated tone and communication style
- Engage with topics related to your interests and expertise
- Show appropriate levels of controversy and debate aggression
- Keep responses concise and social media appropriate
- Include relevant political commentary when appropriate`;
  }

  private extractUserPrompt(fullPrompt: string, request: AIRequest): string {
    // Extract just the user-specific content from the full prompt
    const sections = fullPrompt.split('CURRENT CONTEXT:');
    if (sections.length < 2) return fullPrompt;

    const contextAndConstraints = sections[1];

    // Add conversation history if present
    let historyContext = '';
    if (request.conversationHistory && request.conversationHistory.length > 0) {
      historyContext = this.buildHistoryContext(request.conversationHistory);
    }

    // Add news context if present
    let newsContext = '';
    if (request.newsContext) {
      newsContext = this.buildNewsContext(request.newsContext);
    }

    return `${historyContext}${newsContext}

CURRENT CONTEXT: ${contextAndConstraints}

RESPONSE CONSTRAINTS:
- Maximum length: ${request.constraints.maxLength} characters
- Must reflect political alignment in response
- Tone must match persona configuration: ${request.persona.toneStyle}
- Stay in character as ${request.persona.name} (@${request.persona.handle})
- Include political perspective naturally
- Use appropriate level of controversy based on tolerance: ${request.persona.controversyTolerance}/100

Respond as ${request.persona.name} would, considering your political alignment and personality:`;
  }

  // ============================================================================
  // ENHANCED SAFETY & VALIDATION
  // ============================================================================

  protected async checkContentSafety(content: string, persona: PersonaConfiguration): Promise<SafetyResults> {
    const flags: string[] = [];
    let confidence = 1.0;

    // GPT has built-in moderation, but add additional checks
    const hateSpeechCheck = this.detectHateSpeech(content);
    const misinformationCheck = this.detectMisinformation(content);
    const extremismCheck = this.detectExtremism(content, persona);
    const politicalIncitementCheck = this.checkPoliticalIncitement(content);

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

    if (politicalIncitementCheck.detected) {
      flags.push('political_incitement');
      confidence = Math.min(confidence, politicalIncitementCheck.confidence);
    }

    return {
      isAllowed: flags.length === 0,
      flags,
      confidence
    };
  }

  private checkPoliticalIncitement(content: string): { detected: boolean; confidence: number } {
    // Check for content that might incite political violence or illegal activity
    const incitementPatterns = [
      /(?:time for|need) (?:armed|violent) (?:resistance|revolution)/i,
      /(?:kill|assassinate|eliminate) (?:politicians|leaders|officials)/i,
      /(?:storm|attack|raid) the (?:capitol|government|congress)/i,
      /(?:civil war|armed uprising) (?:is|now|today)/i
    ];

    const detected = incitementPatterns.some(pattern => pattern.test(content));

    return {
      detected,
      confidence: detected ? 0.9 : 1.0
    };
  }

  // ============================================================================
  // HEALTH MONITORING
  // ============================================================================

  async checkHealth(): Promise<HealthStatus> {
    const startTime = Date.now();

    try {
      // Simple health check with minimal token usage
      const response = await this.client.chat.completions.create({
        model: this.model,
        max_tokens: 5,
        messages: [
          {
            role: 'user',
            content: 'Health check - respond with OK'
          }
        ]
      });

      const responseTime = Date.now() - startTime;

      // Verify we got a valid response
      if (!response.choices || response.choices.length === 0) {
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
      console.warn(`GPT health check failed:`, error.message);

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
    const baseCapabilities = {
      supportsConversationHistory: true,
      supportsPoliticalAlignment: true,
      supportsPersonaInjection: true,
      supportsContentFiltering: true,
      supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar']
    };

    // Model-specific capabilities
    if (this.model.includes('gpt-4')) {
      return {
        ...baseCapabilities,
        maxTokens: 8192,
        costPerToken: 0.00003 // GPT-4 pricing
      };
    } else if (this.model.includes('gpt-3.5')) {
      return {
        ...baseCapabilities,
        maxTokens: 4096,
        costPerToken: 0.000002 // GPT-3.5 pricing
      };
    }

    // Default capabilities
    return {
      ...baseCapabilities,
      maxTokens: 4096,
      costPerToken: 0.00002
    };
  }

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  protected handleError(error: any): Error {
    // Map OpenAI-specific errors
    if (error.code === 'rate_limit_exceeded') {
      return new RateLimitError(this.name, `OpenAI rate limit: ${error.message}`);
    }

    if (error.code === 'model_not_found') {
      return new ModelNotFoundError(this.name, this.model);
    }

    if (error.status === 401 || error.code === 'invalid_api_key') {
      return new Error(`OpenAI authentication failed: ${error.message}`);
    }

    if (error.status === 403 || error.code === 'insufficient_quota') {
      return new Error(`OpenAI quota exceeded: ${error.message}`);
    }

    if (error.status >= 500) {
      return new ServiceUnavailableError(this.name, 'OpenAI service temporarily unavailable');
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

  async useModeration(content: string): Promise<boolean> {
    try {
      const response = await this.client.moderations.create({
        input: content
      });

      return !response.results[0].flagged;
    } catch (error) {
      console.warn('GPT moderation check failed:', error);
      return true; // Default to allowing content if moderation fails
    }
  }
}
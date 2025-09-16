/**
 * Base AI Provider Implementation
 *
 * Abstract base class providing shared functionality for all AI providers.
 * Implements T049a: Base AI provider interface and abstract class
 */

import crypto from 'crypto';
import {
  IAIProvider,
  AIRequest,
  AIResponse,
  HealthStatus,
  ProviderCapabilities,
  PersonaConfiguration,
  PoliticalAlignment,
  PoliticalContext,
  ConversationTurn,
  NewsItem,
  SafetyResults,
  AIProviderError,
  RateLimitError,
  ServiceUnavailableError,
  ContentFilterError,
  InvalidRequestError
} from '../interfaces/IAIProvider';
import { ToneStyle } from '../../../generated/prisma';

export abstract class BaseAIProvider implements IAIProvider {
  abstract readonly name: string;
  abstract readonly priority: number;

  protected _isHealthy: boolean = true;
  protected _consecutiveFailures: number = 0;
  protected _lastHealthCheck: Date = new Date();
  protected _responseTimeHistory: number[] = [];
  protected _errorRate: number = 0;

  get isHealthy(): boolean {
    return this._isHealthy && this._consecutiveFailures < 3;
  }

  // ============================================================================
  // MAIN GENERATION METHOD
  // ============================================================================

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      // Validate request
      this.validateRequest(request);

      // Build prompt with persona injection
      const prompt = this.buildPrompt(request);

      // Call provider-specific implementation
      const rawResponse = await this.callAPI(prompt, request);

      // Process and validate response
      const response = await this.processResponse(rawResponse, request, startTime);

      // Update health metrics
      this.updateHealthMetrics(true, Date.now() - startTime);

      return response;

    } catch (error) {
      this.updateHealthMetrics(false, Date.now() - startTime);
      throw this.handleError(error);
    }
  }

  // ============================================================================
  // ABSTRACT METHODS (Provider-specific)
  // ============================================================================

  protected abstract callAPI(prompt: string, request: AIRequest): Promise<any>;

  abstract checkHealth(): Promise<HealthStatus>;

  abstract getCapabilities(): ProviderCapabilities;

  // ============================================================================
  // PROMPT BUILDING & PERSONA INJECTION
  // ============================================================================

  protected buildPrompt(request: AIRequest): string {
    const { context, persona, constraints } = request;

    // Political alignment injection
    const politicalContext = this.buildPoliticalContext(persona.politicalAlignment);

    // Conversation history
    const historyContext = request.conversationHistory
      ? this.buildHistoryContext(request.conversationHistory)
      : '';

    // News context if provided
    const newsContext = request.newsContext
      ? this.buildNewsContext(request.newsContext)
      : '';

    // Generate comprehensive system prompt
    const systemPrompt = this.buildSystemPrompt(persona, politicalContext);

    return `${systemPrompt}

${historyContext}
${newsContext}

CURRENT CONTEXT: ${context}

RESPONSE CONSTRAINTS:
- Maximum length: ${constraints.maxLength} characters
- Must reflect political alignment in response
- Tone must match persona configuration: ${persona.toneStyle}
- Stay in character as ${persona.name} (@${persona.handle})
- Include political perspective naturally
- Use appropriate level of controversy based on tolerance: ${persona.controversyTolerance}/100

Respond as ${persona.name} would, considering your political alignment and personality:`;
  }

  protected buildSystemPrompt(persona: PersonaConfiguration, politicalContext: PoliticalContext): string {
    return `${persona.systemPrompt}

PERSONA IDENTITY:
You are ${persona.name} (@${persona.handle}), a political figure with specific views and characteristics.

POLITICAL ALIGNMENT:
${this.formatPoliticalContext(politicalContext)}

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
- Keep responses under the specified character limit
- Include relevant political commentary when appropriate`;
  }

  protected buildPoliticalContext(alignment: PoliticalAlignment): PoliticalContext {
    // Map numeric positions to descriptive labels
    const economicStance = this.mapEconomicPosition(alignment.economicPosition);
    const socialStance = this.mapSocialPosition(alignment.socialPosition);
    const quadrant = this.determineQuadrant(alignment.economicPosition, alignment.socialPosition);

    return {
      economicStance,
      socialStance,
      quadrant,
      primaryIssues: alignment.primaryIssues,
      ideologyTags: alignment.ideologyTags
    };
  }

  protected formatPoliticalContext(context: PoliticalContext): string {
    return `Economic Position: ${context.economicStance}
Social Position: ${context.socialStance}
Political Quadrant: ${context.quadrant}
Primary Issues: ${context.primaryIssues.join(', ')}
Ideology Tags: ${context.ideologyTags.join(', ')}`;
  }

  protected buildHistoryContext(history: ConversationTurn[]): string {
    if (history.length === 0) return '';

    const formattedHistory = history
      .slice(-5) // Only include last 5 turns to manage context
      .map(turn => `${turn.role.toUpperCase()}: ${turn.content}`)
      .join('\n');

    return `CONVERSATION HISTORY:
${formattedHistory}

`;
  }

  protected buildNewsContext(news: NewsItem): string {
    return `CURRENT NEWS CONTEXT:
Title: ${news.title}
Summary: ${news.summary}
Source: ${news.source}
Category: ${news.category}
Keywords: ${news.keywords.join(', ')}
Sentiment: ${news.sentiment > 0 ? 'Positive' : news.sentiment < 0 ? 'Negative' : 'Neutral'}

`;
  }

  // ============================================================================
  // RESPONSE PROCESSING & VALIDATION
  // ============================================================================

  protected async processResponse(rawResponse: any, request: AIRequest, startTime: number): Promise<AIResponse> {
    const content = this.extractContent(rawResponse);

    // Validate response length
    if (content.length > request.constraints.maxLength) {
      throw new InvalidRequestError(this.name, 'Response exceeds length constraints');
    }

    // Content safety check
    const safetyResults = await this.checkContentSafety(content, request.persona);
    if (!safetyResults.isAllowed) {
      throw new ContentFilterError(this.name, `Response failed safety checks: ${safetyResults.flags.join(', ')}`);
    }

    // Political alignment validation
    if (request.constraints.requirePoliticalStance) {
      await this.validatePoliticalAlignment(content, request.persona.politicalAlignment);
    }

    const processingTime = Date.now() - startTime;
    const tokens = this.extractTokenUsage(rawResponse);

    return {
      content: content.trim(),
      confidence: this.calculateConfidence(rawResponse, request),
      processingTime,
      provider: this.name,
      model: this.getModelName(rawResponse),
      tokens,
      safety: safetyResults
    };
  }

  protected abstract extractContent(rawResponse: any): string;
  protected abstract extractTokenUsage(rawResponse: any): { input: number; output: number; total: number };
  protected abstract getModelName(rawResponse: any): string;

  protected calculateConfidence(rawResponse: any, request: AIRequest): number {
    // Base confidence varies by provider - can be overridden
    let baseConfidence = 0.8;

    // Adjust based on political alignment match
    if (request.constraints.requirePoliticalStance) {
      baseConfidence += 0.1;
    }

    // Adjust based on persona match
    if (request.persona.controversyTolerance > 50) {
      baseConfidence += 0.05;
    }

    return Math.min(baseConfidence, 1.0);
  }

  // ============================================================================
  // VALIDATION & SAFETY
  // ============================================================================

  protected validateRequest(request: AIRequest): void {
    if (!request.context || request.context.trim().length === 0) {
      throw new InvalidRequestError(this.name, 'Context is required');
    }

    if (!request.persona || !request.persona.id) {
      throw new InvalidRequestError(this.name, 'Valid persona configuration is required');
    }

    if (!request.constraints || request.constraints.maxLength <= 0) {
      throw new InvalidRequestError(this.name, 'Valid response constraints are required');
    }

    if (request.constraints.maxLength > this.getCapabilities().maxTokens * 4) {
      throw new InvalidRequestError(this.name, 'Requested length exceeds provider capabilities');
    }
  }

  protected async checkContentSafety(content: string, persona: PersonaConfiguration): Promise<SafetyResults> {
    const flags: string[] = [];
    let confidence = 1.0;

    // Basic safety checks
    const hateSpeechCheck = this.detectHateSpeech(content);
    const misinformationCheck = this.detectMisinformation(content);
    const extremismCheck = this.detectExtremism(content, persona);

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

    return {
      isAllowed: flags.length === 0,
      flags,
      confidence
    };
  }

  protected detectHateSpeech(content: string): { detected: boolean; confidence: number } {
    const hateSpeechKeywords = [
      'hate', 'genocide', 'supremacist', 'nazi', 'fascist',
      'terrorist', 'violence against', 'kill all', 'death to'
    ];

    const lowerContent = content.toLowerCase();
    const detected = hateSpeechKeywords.some(keyword => lowerContent.includes(keyword));

    return {
      detected,
      confidence: detected ? 0.9 : 1.0
    };
  }

  protected detectMisinformation(content: string): { detected: boolean; confidence: number } {
    const misinformationPatterns = [
      /election was (?:stolen|rigged|fraud)/i,
      /vaccines? (?:cause|contain|are dangerous)/i,
      /climate change (?:is|isn't) (?:a hoax|fake|conspiracy)/i,
      /(?:jews|muslims|christians) (?:control|run|own) the (?:world|media|banks)/i
    ];

    const detected = misinformationPatterns.some(pattern => pattern.test(content));

    return {
      detected,
      confidence: detected ? 0.8 : 1.0
    };
  }

  protected detectExtremism(content: string, persona: PersonaConfiguration): { detected: boolean; confidence: number } {
    // Allow more controversial content based on persona's controversy tolerance
    const controversyThreshold = persona.controversyTolerance;

    const extremeKeywords = [
      'revolution', 'overthrow', 'civil war', 'armed resistance',
      'destroy the system', 'burn it all down', 'total war'
    ];

    const lowerContent = content.toLowerCase();
    const hasExtremeContent = extremeKeywords.some(keyword => lowerContent.includes(keyword));

    // Higher controversy tolerance allows more extreme content
    const detected = hasExtremeContent && controversyThreshold < 70;

    return {
      detected,
      confidence: detected ? 0.7 : 1.0
    };
  }

  protected async validatePoliticalAlignment(content: string, alignment: PoliticalAlignment): Promise<void> {
    // This is a simplified validation - in production, you might use more sophisticated NLP
    const lowerContent = content.toLowerCase();

    // Check if response aligns with economic position
    const economicKeywords = {
      left: ['government', 'regulation', 'public', 'social programs', 'inequality'],
      right: ['free market', 'private', 'business', 'individual', 'competition']
    };

    const isEconomicallyLeft = alignment.economicPosition < 50;
    const expectedKeywords = isEconomicallyLeft ? economicKeywords.left : economicKeywords.right;

    // Simple check - ensure at least some alignment with expected position
    const hasExpectedKeywords = expectedKeywords.some(keyword => lowerContent.includes(keyword));

    if (!hasExpectedKeywords && alignment.economicPosition !== 50) {
      // Don't throw error, just log - political alignment is often subtle
      console.warn(`Response may not align with expected political position for ${alignment.id}`);
    }
  }

  // ============================================================================
  // HEALTH & ERROR MANAGEMENT
  // ============================================================================

  protected updateHealthMetrics(success: boolean, responseTime: number): void {
    // Update response time history (keep last 10)
    this._responseTimeHistory.push(responseTime);
    if (this._responseTimeHistory.length > 10) {
      this._responseTimeHistory.shift();
    }

    // Update failure tracking
    if (success) {
      this._consecutiveFailures = 0;
      this._isHealthy = true;
    } else {
      this._consecutiveFailures++;
      if (this._consecutiveFailures >= 3) {
        this._isHealthy = false;
      }
    }

    // Update error rate
    const recentAttempts = Math.min(this._responseTimeHistory.length, 10);
    this._errorRate = this._consecutiveFailures / Math.max(recentAttempts, 1);

    this._lastHealthCheck = new Date();
  }

  protected handleError(error: any): AIProviderError {
    if (error instanceof AIProviderError) {
      return error;
    }

    // Map common API errors
    if (error.response?.status === 429 || error.code === 'rate_limit_exceeded') {
      return new RateLimitError(this.name, error.message);
    }

    if (error.response?.status >= 500 || error.code === 'service_unavailable') {
      return new ServiceUnavailableError(this.name, error.message);
    }

    if (error.response?.status === 400 || error.code === 'invalid_request') {
      return new InvalidRequestError(this.name, error.message);
    }

    // Default to generic provider error
    return new AIProviderError(this.name, error.message || 'Unknown provider error');
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  protected mapEconomicPosition(position: number): PoliticalContext['economicStance'] {
    if (position <= 20) return 'left';
    if (position <= 40) return 'center-left';
    if (position <= 60) return 'center';
    if (position <= 80) return 'center-right';
    return 'right';
  }

  protected mapSocialPosition(position: number): PoliticalContext['socialStance'] {
    if (position <= 20) return 'liberal';
    if (position <= 40) return 'moderate-liberal';
    if (position <= 60) return 'moderate';
    if (position <= 80) return 'moderate-conservative';
    return 'conservative';
  }

  protected determineQuadrant(economic: number, social: number): PoliticalContext['quadrant'] {
    const isEconomicallyLeft = economic < 50;
    const isSociallyLiberal = social < 50;

    if (isEconomicallyLeft && isSociallyLiberal) return 'lib-left';
    if (!isEconomicallyLeft && isSociallyLiberal) return 'lib-right';
    if (isEconomicallyLeft && !isSociallyLiberal) return 'auth-left';
    return 'auth-right';
  }

  protected getTemperatureFromPersona(persona: PersonaConfiguration): number {
    // Base temperature
    let temperature = 0.7;

    // Adjust based on persona characteristics
    const controversyModifier = (persona.controversyTolerance - 50) / 200; // -0.25 to +0.25
    const aggressionModifier = (persona.debateAggression - 50) / 200; // -0.25 to +0.25

    // Tone style adjustments
    const toneModifiers = {
      [ToneStyle.PROFESSIONAL]: -0.1,
      [ToneStyle.CASUAL]: 0.0,
      [ToneStyle.AGGRESSIVE]: 0.2,
      [ToneStyle.HUMOROUS]: 0.15,
      [ToneStyle.SARCASTIC]: 0.1,
      [ToneStyle.INSPIRATIONAL]: 0.05
    };

    temperature += controversyModifier;
    temperature += aggressionModifier;
    temperature += (toneModifiers[persona.toneStyle] || 0);

    // Ensure within valid range
    return Math.max(0.1, Math.min(1.0, temperature));
  }

  protected generateRequestId(): string {
    return crypto.randomBytes(8).toString('hex');
  }

  protected getAverageResponseTime(): number {
    if (this._responseTimeHistory.length === 0) return 0;
    return this._responseTimeHistory.reduce((sum, time) => sum + time, 0) / this._responseTimeHistory.length;
  }
}
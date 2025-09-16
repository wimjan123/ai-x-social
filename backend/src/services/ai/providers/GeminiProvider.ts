/**
 * Gemini AI Provider Implementation
 *
 * Google Gemini integration with political persona support and fallback capabilities.
 * Implements T049c: Gemini fallback provider with error handling
 */

import { GoogleGenerativeAI, GenerativeModel, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
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

export class GeminiProvider extends BaseAIProvider {
  readonly name = 'Gemini';
  readonly priority = 3; // Third priority after Claude and GPT

  private client: GoogleGenerativeAI;
  private model: GenerativeModel;
  private modelName: string;
  private maxRetries: number;

  constructor(
    apiKey: string,
    modelName: string = 'gemini-pro',
    maxRetries: number = 3
  ) {
    super();

    this.client = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
    this.maxRetries = maxRetries;

    // Configure safety settings for political content
    this.model = this.client.getGenerativeModel({
      model: modelName,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
  }

  // ============================================================================
  // PROVIDER-SPECIFIC IMPLEMENTATION
  // ============================================================================

  protected async callAPI(prompt: string, request: AIRequest): Promise<any> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        // Configure generation parameters
        const generationConfig = {
          temperature: this.getTemperatureFromPersona(request.persona),
          topK: 40,
          topP: 0.95,
          maxOutputTokens: Math.min(
            Math.floor(request.constraints.maxLength / 2.5), // Character to token conversion
            2048 // Gemini Pro limit
          ),
        };

        // Enhanced prompt for Gemini
        const enhancedPrompt = this.enhancePromptForGemini(prompt, request);

        const result = await this.model.generateContent({
          contents: [{ role: 'user', parts: [{ text: enhancedPrompt }] }],
          generationConfig,
        });

        return result;

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
    if (!rawResponse.response) {
      throw new Error('Invalid response format from Gemini API');
    }

    try {
      const text = rawResponse.response.text();
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini API');
      }
      return text;
    } catch (error) {
      // Handle cases where content might be blocked
      if (rawResponse.response.candidates?.[0]?.finishReason === 'SAFETY') {
        throw new Error('Response blocked by Gemini safety filters');
      }
      throw new Error('Failed to extract content from Gemini response');
    }
  }

  protected extractTokenUsage(rawResponse: any): { input: number; output: number; total: number } {
    // Gemini doesn't provide detailed token counts, so we estimate
    const response = rawResponse.response;
    const content = this.extractContent(rawResponse);

    // Rough estimation based on content length
    const outputTokens = Math.floor(content.length / 4);
    const inputTokens = Math.floor((response.text?.length || 0) / 4);

    return {
      input: inputTokens,
      output: outputTokens,
      total: inputTokens + outputTokens
    };
  }

  protected getModelName(rawResponse: any): string {
    return this.modelName;
  }

  protected calculateConfidence(rawResponse: any, request: AIRequest): number {
    let confidence = 0.8; // Base confidence for Gemini

    // Check finish reason for quality indicators
    const candidate = rawResponse.response?.candidates?.[0];
    if (candidate) {
      if (candidate.finishReason === 'STOP') {
        confidence += 0.1; // Clean completion
      } else if (candidate.finishReason === 'MAX_TOKENS') {
        confidence -= 0.1; // Truncated response
      } else if (candidate.finishReason === 'SAFETY') {
        confidence -= 0.3; // Safety concerns
      }
    }

    // Adjust based on safety scores
    if (candidate?.safetyRatings) {
      const highRiskRatings = candidate.safetyRatings.filter(
        (rating: any) => rating.probability === 'HIGH' || rating.probability === 'MEDIUM'
      );
      confidence -= (highRiskRatings.length * 0.1);
    }

    // Adjust based on political alignment requirements
    if (request.constraints.requirePoliticalStance) {
      confidence += 0.05;
    }

    return Math.max(0.1, Math.min(confidence, 1.0));
  }

  // ============================================================================
  // GEMINI-SPECIFIC PROMPT ENHANCEMENT
  // ============================================================================

  private enhancePromptForGemini(prompt: string, request: AIRequest): string {
    // Gemini works better with more explicit instructions
    const politicalContext = this.buildPoliticalContext(request.persona.politicalAlignment);
    const formattedContext = this.formatPoliticalContext(politicalContext);

    return `You are roleplaying as a specific political persona. Here are your character details:

PERSONA: ${request.persona.name} (@${request.persona.handle})
SYSTEM PROMPT: ${request.persona.systemPrompt}

POLITICAL ALIGNMENT:
${formattedContext}

PERSONALITY TRAITS: ${request.persona.personalityTraits.join(', ')}
COMMUNICATION STYLE: ${request.persona.toneStyle}
EXPERTISE AREAS: ${request.persona.expertise.join(', ')}
CONTROVERSY TOLERANCE: ${request.persona.controversyTolerance}/100
DEBATE AGGRESSION: ${request.persona.debateAggression}/100

IMPORTANT INSTRUCTIONS:
- You must stay completely in character as ${request.persona.name}
- Express political opinions that align with your configured positions
- Use the specified communication style and tone
- Keep responses under ${request.constraints.maxLength} characters
- Show political perspective naturally in your responses
- Be authentic to your persona's personality traits and expertise

${prompt}

Remember: Respond as ${request.persona.name} would, considering your political alignment, personality, and communication style. Stay in character throughout your response.`;
  }

  // ============================================================================
  // ENHANCED SAFETY & VALIDATION
  // ============================================================================

  protected async checkContentSafety(content: string, persona: PersonaConfiguration): Promise<SafetyResults> {
    const flags: string[] = [];
    let confidence = 1.0;

    // Gemini has built-in safety, but add additional checks for political content
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

  // ============================================================================
  // HEALTH MONITORING
  // ============================================================================

  async checkHealth(): Promise<HealthStatus> {
    const startTime = Date.now();

    try {
      // Simple health check with minimal token usage
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: 'Health check - respond with OK' }] }],
        generationConfig: {
          maxOutputTokens: 10,
          temperature: 0.1,
        },
      });

      const responseTime = Date.now() - startTime;

      // Verify we got a valid response
      if (!result.response) {
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
      console.warn(`Gemini health check failed:`, error.message);

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
      maxTokens: 2048, // Gemini Pro current limit
      supportsConversationHistory: true,
      supportsPoliticalAlignment: true,
      supportsPersonaInjection: true,
      supportsContentFiltering: true,
      supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi'],
      costPerToken: 0.00000075 // Gemini Pro pricing (very competitive)
    };
  }

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  protected handleError(error: any): Error {
    // Map Gemini-specific errors
    if (error.status === 429) {
      return new RateLimitError(this.name, `Gemini rate limit: ${error.message}`);
    }

    if (error.status === 404) {
      return new ModelNotFoundError(this.name, this.modelName);
    }

    if (error.status === 401 || error.status === 403) {
      return new Error(`Gemini authentication failed: ${error.message}`);
    }

    if (error.status >= 500) {
      return new ServiceUnavailableError(this.name, 'Gemini service temporarily unavailable');
    }

    // Handle safety-related blocks
    if (error.message?.includes('SAFETY') || error.message?.includes('blocked')) {
      return new Error(`Gemini content policy violation: ${error.message}`);
    }

    // Use base class error handling for other cases
    return super.handleError(error);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  getModel(): string {
    return this.modelName;
  }

  setModel(modelName: string): void {
    this.modelName = modelName;
    this.model = this.client.getGenerativeModel({
      model: modelName,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
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

  getSafetySettings() {
    return [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  }
}
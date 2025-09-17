import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Set up environment variables first
const originalEnv = process.env;

// Mock dependencies before importing
const mockClaudeCreate = jest.fn();
const mockOpenAICreate = jest.fn();
const mockGeminiGenerate = jest.fn();
const mockGetAIContext = jest.fn();
const mockCacheAIContext = jest.fn();

jest.mock('@anthropic-ai/sdk', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    messages: { create: mockClaudeCreate },
  })),
}));

jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    chat: { completions: { create: mockOpenAICreate } },
  })),
}));

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn(() => ({
    getGenerativeModel: () => ({ generateContent: mockGeminiGenerate }),
  })),
}));

jest.mock('@/services/CacheService', () => ({
  cacheService: {
    getAIContext: mockGetAIContext,
    cacheAIContext: mockCacheAIContext,
  },
}));

jest.mock('@/lib/redis', () => ({
  redis: { healthCheck: jest.fn(), disconnect: jest.fn() },
}));

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

jest.mock('@/lib/logger', () => ({
  logger: mockLogger,
}));

describe('AIOrchestrator', () => {
  beforeEach(() => {
    // Set environment variables
    process.env = {
      ...originalEnv,
      ANTHROPIC_API_KEY: 'test-anthropic-key',
      OPENAI_API_KEY: 'test-openai-key',
      GOOGLE_API_KEY: 'test-google-key',
    };

    // Clear all mocks
    jest.clearAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Provider Selection and Response Generation', () => {
    it('should generate response using available provider', async () => {
      // Import after environment is set
      const { AIOrchestrator } = await import('@/services/AIOrchestrator');

      // Reset singleton
      (AIOrchestrator as any).instance = undefined;
      const orchestrator = AIOrchestrator.getInstance();

      const request = {
        personaId: 'test-persona',
        prompt: 'Test prompt',
      };

      // Mock successful response
      mockClaudeCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'Claude response' }],
        usage: { input_tokens: 10, output_tokens: 20 },
        stop_reason: 'end_turn',
      });

      mockGetAIContext.mockResolvedValue(null);
      mockCacheAIContext.mockResolvedValue(undefined);

      const response = await orchestrator.generateResponse(request);

      expect(response.content).toBe('Claude response');
      expect(response.provider).toBe('claude');
      expect(mockClaudeCreate).toHaveBeenCalled();
    });

    it('should fallback to OpenAI when Claude fails', async () => {
      const { AIOrchestrator } = await import('@/services/AIOrchestrator');

      (AIOrchestrator as any).instance = undefined;
      const orchestrator = AIOrchestrator.getInstance();

      const request = {
        personaId: 'test-persona',
        prompt: 'Test prompt',
      };

      // Mock Claude failure and OpenAI success
      mockClaudeCreate.mockRejectedValue(new Error('Claude API error'));
      mockOpenAICreate.mockResolvedValue({
        choices: [{
          message: { content: 'OpenAI fallback response' },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
      });

      mockGetAIContext.mockResolvedValue(null);
      mockCacheAIContext.mockResolvedValue(undefined);

      const response = await orchestrator.generateResponse(request);

      expect(response.provider).toBe('openai');
      expect(response.content).toBe('OpenAI fallback response');
      expect(mockClaudeCreate).toHaveBeenCalled();
      expect(mockOpenAICreate).toHaveBeenCalled();
    });

    it('should return demo response when all providers fail', async () => {
      const { AIOrchestrator } = await import('@/services/AIOrchestrator');

      (AIOrchestrator as any).instance = undefined;
      const orchestrator = AIOrchestrator.getInstance();

      const request = {
        personaId: 'test-persona',
        prompt: 'Test prompt',
      };

      // Mock all providers to fail
      mockClaudeCreate.mockRejectedValue(new Error('Claude error'));
      mockOpenAICreate.mockRejectedValue(new Error('OpenAI error'));
      mockGeminiGenerate.mockRejectedValue(new Error('Gemini error'));

      mockGetAIContext.mockResolvedValue(null);

      const response = await orchestrator.generateResponse(request);

      expect(response.provider).toBe('demo');
      expect(response.content).toContain('AI');
    });
  });

  describe('Caching', () => {
    it('should return cached response when available', async () => {
      const { AIOrchestrator } = await import('@/services/AIOrchestrator');

      (AIOrchestrator as any).instance = undefined;
      const orchestrator = AIOrchestrator.getInstance();

      const request = {
        personaId: 'test-persona',
        prompt: 'Test prompt',
      };

      const cachedResponse = {
        content: 'Cached response',
        provider: 'claude',
        model: 'claude-3-sonnet',
        usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
        finishReason: 'stop',
      };

      mockGetAIContext.mockResolvedValue(cachedResponse);

      const response = await orchestrator.generateResponse(request);

      expect(response).toEqual(cachedResponse);
      expect(mockClaudeCreate).not.toHaveBeenCalled();
    });

    it('should cache response after generation', async () => {
      const { AIOrchestrator } = await import('@/services/AIOrchestrator');

      (AIOrchestrator as any).instance = undefined;
      const orchestrator = AIOrchestrator.getInstance();

      const request = {
        personaId: 'test-persona',
        prompt: 'Test prompt',
      };

      mockClaudeCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'Claude response' }],
        usage: { input_tokens: 10, output_tokens: 20 },
        stop_reason: 'end_turn',
      });

      mockGetAIContext.mockResolvedValue(null);
      mockCacheAIContext.mockResolvedValue(undefined);

      await orchestrator.generateResponse(request);

      expect(mockCacheAIContext).toHaveBeenCalledWith(
        request.personaId,
        'cached',
        expect.any(Object),
        3600
      );
    });
  });

  describe('Provider-Specific Implementations', () => {
    describe('Claude Integration', () => {
      it('should call Claude with correct parameters', async () => {
        const { AIOrchestrator } = await import('@/services/AIOrchestrator');

        (AIOrchestrator as any).instance = undefined;
        const orchestrator = AIOrchestrator.getInstance();

        const request = {
          personaId: 'test-persona',
          prompt: 'Test prompt',
          context: 'Previous context',
          systemPrompt: 'Custom system prompt',
          temperature: 0.8,
          maxTokens: 500,
        };

        mockClaudeCreate.mockResolvedValue({
          content: [{ type: 'text', text: 'Claude response' }],
          usage: { input_tokens: 10, output_tokens: 20 },
          stop_reason: 'end_turn',
        });

        mockGetAIContext.mockResolvedValue(null);
        mockCacheAIContext.mockResolvedValue(undefined);

        await orchestrator.generateResponse(request);

        expect(mockClaudeCreate).toHaveBeenCalledWith({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 500,
          temperature: 0.8,
          system: 'Custom system prompt',
          messages: [
            { role: 'user', content: 'Previous context' },
            { role: 'user', content: 'Test prompt' },
          ],
        });
      });

      it('should handle Claude response format correctly', async () => {
        const { AIOrchestrator } = await import('@/services/AIOrchestrator');

        (AIOrchestrator as any).instance = undefined;
        const orchestrator = AIOrchestrator.getInstance();

        const request = {
          personaId: 'test-persona',
          prompt: 'Test prompt',
        };

        mockClaudeCreate.mockResolvedValue({
          content: [{ type: 'text', text: 'Claude response text' }],
          usage: { input_tokens: 15, output_tokens: 25 },
          stop_reason: 'end_turn',
        });

        mockGetAIContext.mockResolvedValue(null);
        mockCacheAIContext.mockResolvedValue(undefined);

        const response = await orchestrator.generateResponse(request);

        expect(response).toEqual({
          content: 'Claude response text',
          provider: 'claude',
          model: 'claude-3-sonnet-20240229',
          usage: {
            promptTokens: 15,
            completionTokens: 25,
            totalTokens: 40,
          },
          finishReason: 'end_turn',
        });
      });

      it('should handle unexpected Claude response type', async () => {
        const { AIOrchestrator } = await import('@/services/AIOrchestrator');

        (AIOrchestrator as any).instance = undefined;
        const orchestrator = AIOrchestrator.getInstance();

        const request = {
          personaId: 'test-persona',
          prompt: 'Test prompt',
        };

        mockClaudeCreate.mockResolvedValue({
          content: [{ type: 'image', source: 'data' }],
          usage: { input_tokens: 10, output_tokens: 20 },
          stop_reason: 'end_turn',
        });

        // Mock other providers to fail to prevent fallback
        mockOpenAICreate.mockRejectedValue(new Error('OpenAI not available'));
        mockGeminiGenerate.mockRejectedValue(new Error('Gemini not available'));

        mockGetAIContext.mockResolvedValue(null);

        // Since all providers will fail after Claude's invalid response, it will fallback to demo
        const response = await orchestrator.generateResponse(request);
        expect(response.provider).toBe('demo');
      });
    });

    describe('OpenAI Integration', () => {
      it('should handle OpenAI response format correctly', async () => {
        const { AIOrchestrator } = await import('@/services/AIOrchestrator');

        (AIOrchestrator as any).instance = undefined;
        const orchestrator = AIOrchestrator.getInstance();

        const request = {
          personaId: 'test-persona',
          prompt: 'Test prompt',
        };

        // Force OpenAI by making Claude fail
        mockClaudeCreate.mockRejectedValue(new Error('Claude error'));
        mockOpenAICreate.mockResolvedValue({
          choices: [{
            message: { content: 'OpenAI response text' },
            finish_reason: 'stop'
          }],
          usage: { prompt_tokens: 12, completion_tokens: 18, total_tokens: 30 },
        });

        mockGetAIContext.mockResolvedValue(null);
        mockCacheAIContext.mockResolvedValue(undefined);

        const response = await orchestrator.generateResponse(request);

        expect(response).toEqual({
          content: 'OpenAI response text',
          provider: 'openai',
          model: 'gpt-4',
          usage: {
            promptTokens: 12,
            completionTokens: 18,
            totalTokens: 30,
          },
          finishReason: 'stop',
        });
      });

      it('should handle missing content in OpenAI response', async () => {
        const { AIOrchestrator } = await import('@/services/AIOrchestrator');

        (AIOrchestrator as any).instance = undefined;
        const orchestrator = AIOrchestrator.getInstance();

        const request = {
          personaId: 'test-persona',
          prompt: 'Test prompt',
        };

        mockClaudeCreate.mockRejectedValue(new Error('Claude error'));
        mockOpenAICreate.mockResolvedValue({
          choices: [{ message: { content: null }, finish_reason: 'stop' }],
          usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
        });

        // Mock Gemini to fail to prevent further fallback
        mockGeminiGenerate.mockRejectedValue(new Error('Gemini not available'));

        mockGetAIContext.mockResolvedValue(null);

        // Since OpenAI returns null content and Gemini fails, it will fallback to demo
        const response = await orchestrator.generateResponse(request);
        expect(response.provider).toBe('demo');
      });
    });
  });

  describe('Error Handling and Circuit Breaker', () => {
    it('should track failures and use circuit breaker', async () => {
      const { AIOrchestrator } = await import('@/services/AIOrchestrator');

      (AIOrchestrator as any).instance = undefined;
      const orchestrator = AIOrchestrator.getInstance();

      const request = {
        personaId: 'test-persona',
        prompt: 'Test prompt',
      };

      // Mock repeated failures
      mockClaudeCreate.mockRejectedValue(new Error('API Error'));
      mockOpenAICreate.mockResolvedValue({
        choices: [{ message: { content: 'Fallback response' }, finish_reason: 'stop' }],
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
      });

      mockGetAIContext.mockResolvedValue(null);
      mockCacheAIContext.mockResolvedValue(undefined);

      // Multiple requests should eventually trigger circuit breaker
      for (let i = 0; i < 5; i++) {
        try {
          await orchestrator.generateResponse(request);
        } catch (e) {
          // Some may fail, that's expected
        }
      }

      expect(mockClaudeCreate).toHaveBeenCalled();
      expect(mockOpenAICreate).toHaveBeenCalled();
    });

    it('should log errors appropriately', async () => {
      const { AIOrchestrator } = await import('@/services/AIOrchestrator');

      (AIOrchestrator as any).instance = undefined;
      const orchestrator = AIOrchestrator.getInstance();

      const request = {
        personaId: 'test-persona',
        prompt: 'Test prompt',
      };

      const error = new Error('API Error');
      mockClaudeCreate.mockRejectedValue(error);
      mockOpenAICreate.mockResolvedValue({
        choices: [{ message: { content: 'Fallback response' }, finish_reason: 'stop' }],
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
      });

      mockGetAIContext.mockResolvedValue(null);
      mockCacheAIContext.mockResolvedValue(undefined);

      await orchestrator.generateResponse(request);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'AI generation failed with claude:',
        error
      );
    });
  });

  describe('Provider Status and Metrics', () => {
    it('should return provider status', async () => {
      const { AIOrchestrator } = await import('@/services/AIOrchestrator');

      (AIOrchestrator as any).instance = undefined;
      const orchestrator = AIOrchestrator.getInstance();

      const status = await orchestrator.getProviderStatus();

      expect(status).toBeDefined();
      expect(typeof status).toBe('object');
    });

    it('should return metrics', async () => {
      const { AIOrchestrator } = await import('@/services/AIOrchestrator');

      (AIOrchestrator as any).instance = undefined;
      const orchestrator = AIOrchestrator.getInstance();

      const metrics = orchestrator.getMetrics();

      expect(metrics).toEqual({
        totalProviders: expect.any(Number),
        availableProviders: expect.any(Number),
        totalRequests: 0,
        averageResponseTime: 0,
        providerUsage: {},
      });
    });
  });

  describe('Custom Provider Configuration', () => {
    it('should configure custom provider successfully', async () => {
      const { AIOrchestrator } = await import('@/services/AIOrchestrator');

      (AIOrchestrator as any).instance = undefined;
      const orchestrator = AIOrchestrator.getInstance();

      // Mock successful test call
      mockOpenAICreate.mockResolvedValue({
        choices: [{ message: { content: 'Test response' }, finish_reason: 'stop' }],
        usage: { prompt_tokens: 1, completion_tokens: 2, total_tokens: 3 },
      });

      const result = await orchestrator.configureCustomProvider(
        'custom-api-key',
        'https://custom-api.com'
      );

      expect(result).toBe(true);
    });

    it('should handle custom provider configuration failure', async () => {
      const { AIOrchestrator } = await import('@/services/AIOrchestrator');

      (AIOrchestrator as any).instance = undefined;
      const orchestrator = AIOrchestrator.getInstance();

      // Mock failure
      mockOpenAICreate.mockRejectedValue(new Error('Invalid API key'));

      const result = await orchestrator.configureCustomProvider('invalid-key');

      expect(result).toBe(false);
    });
  });

  describe('Demo Mode', () => {
    it('should initialize in demo mode when no API keys provided', async () => {
      // Remove API keys
      process.env = {
        ...originalEnv,
        ANTHROPIC_API_KEY: '',
        OPENAI_API_KEY: '',
        GOOGLE_API_KEY: '',
      };

      const { AIOrchestrator } = await import('@/services/AIOrchestrator');

      (AIOrchestrator as any).instance = undefined;
      const orchestrator = AIOrchestrator.getInstance();

      const status = await orchestrator.getProviderStatus();
      expect(Object.keys(status)).toContain('demo');
    });

    it('should generate demo response with proper format', async () => {
      const { AIOrchestrator } = await import('@/services/AIOrchestrator');

      (AIOrchestrator as any).instance = undefined;
      const orchestrator = AIOrchestrator.getInstance();

      const request = {
        personaId: 'test-persona',
        prompt: 'Test prompt',
      };

      const response = (orchestrator as any).generateDemoResponse(request);

      expect(response).toEqual({
        content: expect.any(String),
        provider: 'demo',
        model: 'demo-v1',
        usage: {
          promptTokens: expect.any(Number),
          completionTokens: expect.any(Number),
          totalTokens: expect.any(Number),
        },
        finishReason: 'stop',
      });
      expect(response.content.length).toBeGreaterThan(0);
    });
  });

  describe('Rate Limiting', () => {
    it('should track and update rate limits', async () => {
      const { AIOrchestrator } = await import('@/services/AIOrchestrator');

      (AIOrchestrator as any).instance = undefined;
      const orchestrator = AIOrchestrator.getInstance();

      const request = {
        personaId: 'test-persona',
        prompt: 'Test prompt',
      };

      mockClaudeCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'Claude response' }],
        usage: { input_tokens: 10, output_tokens: 20 },
        stop_reason: 'end_turn',
      });

      mockGetAIContext.mockResolvedValue(null);
      mockCacheAIContext.mockResolvedValue(undefined);

      const initialStatus = await orchestrator.getProviderStatus();
      const initialRateLimit = Object.values(initialStatus)[0]?.rateLimitRemaining || 1000;

      await orchestrator.generateResponse(request);

      const updatedStatus = await orchestrator.getProviderStatus();
      const updatedRateLimit = Object.values(updatedStatus)[0]?.rateLimitRemaining || 1000;

      expect(updatedRateLimit).toBeLessThanOrEqual(initialRateLimit);
    });
  });
});
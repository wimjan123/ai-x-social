import express from 'express';
import { z } from 'zod';
import { aiOrchestrator } from '../services/AIOrchestrator';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { logger } from '../lib/logger';

const router = express.Router();

// Schema for AI request
const aiRequestSchema = z.object({
  personaId: z.string().min(1),
  prompt: z.string().min(1).max(2000),
  context: z.string().optional(),
  systemPrompt: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(4000).optional(),
  stream: z.boolean().optional(),
});

// Schema for custom provider configuration
const customProviderSchema = z.object({
  apiKey: z.string().min(1),
  baseUrl: z.string().url().optional(),
});

/**
 * @route GET /api/ai/status
 * @desc Get AI providers status
 * @access Private
 */
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const status = await aiOrchestrator.getProviderStatus();
    const metrics = aiOrchestrator.getMetrics();

    res.json({
      success: true,
      data: {
        providers: status,
        metrics,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Error getting AI status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI provider status',
    });
  }
});

/**
 * @route POST /api/ai/generate
 * @desc Generate AI response
 * @access Private
 */
router.post('/generate', authMiddleware, validateRequest(aiRequestSchema), async (req, res) => {
  try {
    const userId = req.user!.id;
    const request = req.body;

    // Log the AI request for monitoring
    logger.info('AI generation request:', {
      userId,
      personaId: request.personaId,
      promptLength: request.prompt.length,
      hasContext: !!request.context,
      hasSystemPrompt: !!request.systemPrompt,
    });

    const response = await aiOrchestrator.generateResponse(request);

    // Log successful response
    logger.info('AI generation successful:', {
      userId,
      personaId: request.personaId,
      provider: response.provider,
      model: response.model,
      usage: response.usage,
      responseLength: response.content.length,
    });

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    logger.error('Error generating AI response:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'AI generation failed',
    });
  }
});

/**
 * @route POST /api/ai/custom-provider
 * @desc Configure custom AI provider
 * @access Private (Admin only)
 */
router.post('/custom-provider', authMiddleware, validateRequest(customProviderSchema), async (req, res) => {
  try {
    const { apiKey, baseUrl } = req.body;

    // Only allow administrators to configure custom providers
    if (!req.user!.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin privileges required',
      });
    }

    const configured = await aiOrchestrator.configureCustomProvider(apiKey, baseUrl);

    if (configured) {
      logger.info('Custom AI provider configured by admin:', {
        userId: req.user!.id,
        baseUrl: baseUrl || 'default',
      });

      res.json({
        success: true,
        message: 'Custom AI provider configured successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to configure custom AI provider',
      });
    }
  } catch (error) {
    logger.error('Error configuring custom AI provider:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to configure custom provider',
    });
  }
});

/**
 * @route POST /api/ai/test
 * @desc Test AI providers (Admin only)
 * @access Private (Admin only)
 */
router.post('/test', authMiddleware, async (req, res) => {
  try {
    // Only allow administrators to test AI providers
    if (!req.user!.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin privileges required',
      });
    }

    const testRequest = {
      personaId: 'test-persona',
      prompt: 'This is a test message. Please respond briefly.',
      systemPrompt: 'You are a test AI assistant. Respond concisely.',
      temperature: 0.7,
      maxTokens: 100,
    };

    const response = await aiOrchestrator.generateResponse(testRequest);

    logger.info('AI test completed by admin:', {
      userId: req.user!.id,
      provider: response.provider,
      model: response.model,
    });

    res.json({
      success: true,
      data: {
        provider: response.provider,
        model: response.model,
        usage: response.usage,
        responseLength: response.content.length,
        content: response.content.substring(0, 200), // Preview only
      },
    });
  } catch (error) {
    logger.error('Error testing AI providers:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'AI test failed',
    });
  }
});

/**
 * @route GET /api/ai/metrics
 * @desc Get AI usage metrics (Admin only)
 * @access Private (Admin only)
 */
router.get('/metrics', authMiddleware, async (req, res) => {
  try {
    // Only allow administrators to view metrics
    if (!req.user!.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin privileges required',
      });
    }

    const metrics = aiOrchestrator.getMetrics();
    const status = await aiOrchestrator.getProviderStatus();

    // Calculate additional metrics
    const totalProviders = Object.keys(status).length;
    const availableProviders = Object.values(status).filter(p => p.isAvailable).length;
    const providerHealth = (availableProviders / totalProviders) * 100;

    res.json({
      success: true,
      data: {
        ...metrics,
        providerHealth: Math.round(providerHealth),
        providersStatus: status,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Error getting AI metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI metrics',
    });
  }
});

/**
 * @route POST /api/ai/personas/:personaId/reply
 * @desc Generate AI persona reply to a post
 * @access Private
 */
router.post('/personas/:personaId/reply', authMiddleware, async (req, res) => {
  try {
    const { personaId } = req.params;
    const { postContent, context } = req.body;

    if (!postContent) {
      return res.status(400).json({
        success: false,
        message: 'Post content is required',
      });
    }

    // Get persona information (this would come from PersonaService)
    // For now, using a basic system prompt
    const systemPrompt = `You are an AI persona with ID ${personaId}. Respond to social media posts in character,
    maintaining your political alignment and personality. Keep responses under 280 characters, engaging and authentic.`;

    const request = {
      personaId,
      prompt: `Please respond to this post: "${postContent}"`,
      context,
      systemPrompt,
      temperature: 0.8,
      maxTokens: 150,
    };

    const response = await aiOrchestrator.generateResponse(request);

    logger.info('AI persona reply generated:', {
      personaId,
      postContentLength: postContent.length,
      responseLength: response.content.length,
      provider: response.provider,
    });

    res.json({
      success: true,
      data: {
        reply: response.content,
        provider: response.provider,
        model: response.model,
        usage: response.usage,
      },
    });
  } catch (error) {
    logger.error('Error generating AI persona reply:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate persona reply',
    });
  }
});

export default router;
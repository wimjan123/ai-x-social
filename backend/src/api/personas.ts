/**
 * Personas Routes - GET /api/personas, GET /api/personas/{personaId}, POST /api/personas/{personaId}/reply
 *
 * Implements AI personas endpoints for political simulation with authentication,
 * validation, and AI response generation following OpenAPI specification.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import PersonaService, { PersonaNotFoundError, PersonaServiceError } from '../services/PersonaService';
import { AIOrchestrator } from '../services/ai/AIOrchestrator';
import AuthService from '../services/AuthService';
import { validateBody, validateQuery, validateParams } from '../lib/utils/validation';
import { logger } from '../lib/logger';
import { config } from '../lib/config';
import { PersonaType, ToneStyle } from '../generated/prisma';
import type { AIRequest, AIResponse } from '../services/ai/interfaces/IAIProvider';

// Extend Express Request interface to include user and session
declare global {
  namespace Express {
    interface Request {
      user?: any;
      session?: any;
    }
  }
}

const router = Router();
const authService = new AuthService();

// Initialize AI Orchestrator with configuration
const aiOrchestrator = new AIOrchestrator({
  claude: {
    apiKey: config.anthropicApiKey || '',
    baseURL: 'https://api.anthropic.com',
    model: 'claude-3-sonnet-20240229'
  },
  openai: {
    apiKey: config.openaiApiKey || '',
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4'
  },
  google: {
    apiKey: config.googleApiKey || '',
    model: 'gemini-pro'
  },
  cacheEnabled: true,
  cacheTTL: 300000 // 5 minutes
});

// ============================================================================
// VALIDATION SCHEMAS (matching OpenAPI specification)
// ============================================================================

const getPersonasQuerySchema = z.object({
  type: z.enum(['POLITICIAN', 'INFLUENCER', 'JOURNALIST', 'ACTIVIST', 'BUSINESS', 'ENTERTAINER']).optional(),
  active: z.coerce.boolean().optional()
});

const personaIdParamsSchema = z.object({
  personaId: z.string().uuid('Persona ID must be a valid UUID')
});

const personaReplyRequestSchema = z.object({
  context: z
    .string()
    .min(1, 'Context is required')
    .max(2000, 'Context must be less than 2000 characters'),
  postId: z
    .string()
    .uuid('Post ID must be a valid UUID')
    .optional(),
  newsItemId: z
    .string()
    .uuid('News item ID must be a valid UUID')
    .optional()
});

// ============================================================================
// RATE LIMITING
// ============================================================================

const personaListRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: {
    error: 'Too many persona list requests',
    message: 'Rate limit exceeded for persona listing',
    success: false
  },
  standardHeaders: true,
  legacyHeaders: false
});

const personaDetailRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    error: 'Too many persona detail requests',
    message: 'Rate limit exceeded for persona details',
    success: false
  },
  standardHeaders: true,
  legacyHeaders: false
});

const personaReplyRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 AI generation requests per minute
  message: {
    error: 'Too many AI generation requests',
    message: 'Rate limit exceeded for AI persona replies',
    success: false
  },
  standardHeaders: true,
  legacyHeaders: false
});

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Access token is required',
        success: false
      });
    }

    const token = authHeader.substring(7);
    const authContext = await authService.validateToken(token);

    if (!authContext || !authContext.isAuthenticated) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Access token is invalid or expired',
        success: false
      });
    }

    // Attach user context to request
    req.user = authContext.user;
    req.session = authContext.session;

    next();
  } catch (error) {
    logger.error('Authentication middleware error', { error: error.message });
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Failed to authenticate request',
      success: false
    });
  }
};

// ============================================================================
// PERSONAS ENDPOINTS
// ============================================================================

/**
 * GET /api/personas
 * List all available AI personas with optional filtering
 */
router.get('/',
  personaListRateLimit,
  validateQuery(getPersonasQuerySchema),
  async (req: Request, res: Response) => {
    try {
      logger.info('Fetching personas list', {
        query: req.query,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });

      const { type, active } = req.query as z.infer<typeof getPersonasQuerySchema>;

      // Build filter options
      const filterOptions: any = {};
      if (type) filterOptions.type = type;
      if (active !== undefined) filterOptions.active = active;

      // Get personas from service
      const personas = await PersonaService.listPersonas(filterOptions);

      // Ensure default personas are loaded if none exist
      if (personas.length === 0 && !type && active !== false) {
        logger.info('No personas found, loading default personas');
        const defaultPersonas = await PersonaService.loadDefaultPersonas();
        const filteredDefaults = defaultPersonas.filter(persona => {
          if (active !== undefined && persona.isActive !== active) return false;
          return true;
        });

        // Map to public format
        const publicPersonas = filteredDefaults.map(persona => mapToPublicPersona(persona));

        logger.info('Default personas loaded and filtered', { count: publicPersonas.length });
        return res.json(publicPersonas);
      }

      // Map to public persona format (exclude sensitive data)
      const publicPersonas = personas.map(persona => mapToPublicPersona(persona));

      logger.info('Personas fetched successfully', {
        count: publicPersonas.length,
        filtered: { type, active }
      });

      res.json(publicPersonas);

    } catch (error) {
      logger.error('Failed to fetch personas', {
        error: error.message,
        stack: error.stack,
        query: req.query
      });

      if (error instanceof PersonaServiceError) {
        return res.status(error.statusCode).json({
          error: error.code,
          message: error.message,
          success: false
        });
      }

      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch personas',
        success: false
      });
    }
  }
);

/**
 * GET /api/personas/{personaId}
 * Get specific persona details by ID
 */
router.get('/:personaId',
  personaDetailRateLimit,
  validateParams(personaIdParamsSchema),
  async (req: Request, res: Response) => {
    try {
      const { personaId } = req.params;

      logger.info('Fetching persona details', {
        personaId,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });

      const persona = await PersonaService.getPersonaById(personaId);

      if (!persona) {
        return res.status(404).json({
          error: 'Persona not found',
          message: `Persona with ID ${personaId} not found`,
          success: false
        });
      }

      // Map to public format
      const publicPersona = mapToPublicPersona(persona);

      logger.info('Persona details fetched successfully', {
        personaId,
        handle: persona.handle,
        type: persona.personaType
      });

      res.json(publicPersona);

    } catch (error) {
      logger.error('Failed to fetch persona details', {
        error: error.message,
        stack: error.stack,
        personaId: req.params.personaId
      });

      if (error instanceof PersonaNotFoundError) {
        return res.status(404).json({
          error: 'Persona not found',
          message: error.message,
          success: false
        });
      }

      if (error instanceof PersonaServiceError) {
        return res.status(error.statusCode).json({
          error: error.code,
          message: error.message,
          success: false
        });
      }

      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch persona details',
        success: false
      });
    }
  }
);

/**
 * POST /api/personas/{personaId}/reply
 * Generate AI response from persona to given context
 */
router.post('/:personaId/reply',
  personaReplyRateLimit,
  requireAuth,
  validateParams(personaIdParamsSchema),
  validateBody(personaReplyRequestSchema),
  async (req: Request, res: Response) => {
    try {
      const { personaId } = req.params;
      const { context, postId, newsItemId } = req.body;

      logger.info('Generating AI persona reply', {
        personaId,
        userId: req.user?.id,
        contextLength: context.length,
        hasPostId: !!postId,
        hasNewsItemId: !!newsItemId
      });

      // Get persona configuration
      const persona = await PersonaService.getPersonaById(personaId);
      if (!persona) {
        return res.status(404).json({
          error: 'Persona not found',
          message: `Persona with ID ${personaId} not found`,
          success: false
        });
      }

      if (!persona.isActive) {
        return res.status(400).json({
          error: 'Persona inactive',
          message: 'This persona is currently inactive and cannot generate responses',
          success: false
        });
      }

      // Prepare AI request
      const aiRequest: AIRequest = {
        context,
        persona: {
          id: persona.id,
          name: persona.name,
          handle: persona.handle,
          systemPrompt: persona.systemPrompt,
          politicalAlignment: {
            id: persona.politicalAlignmentId,
            userId: 'system',
            economicPosition: 50, // Will be populated from actual alignment
            socialPosition: 50,
            primaryIssues: [],
            partyAffiliation: null,
            ideologyTags: [],
            debateWillingness: 75,
            controversyTolerance: persona.controversyTolerance,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          toneStyle: persona.toneStyle,
          personalityTraits: persona.personalityTraits,
          interests: persona.interests,
          expertise: persona.expertise,
          controversyTolerance: persona.controversyTolerance,
          debateAggression: persona.debateAggression,
          engagementFrequency: persona.engagementFrequency
        },
        constraints: {
          maxLength: 280,
          requirePoliticalStance: true,
          contextWindow: persona.contextWindow || 8000,
          requiredTone: persona.toneStyle,
          avoidTopics: []
        },
        newsContext: newsItemId ? {
          id: newsItemId,
          title: '',
          summary: '',
          url: '',
          source: '',
          category: '',
          keywords: [],
          sentiment: 0,
          publishedAt: new Date()
        } : undefined,
        conversationHistory: []
      };

      // Generate AI response
      let aiResponse: AIResponse;
      try {
        aiResponse = await aiOrchestrator.generateResponse(aiRequest);
      } catch (aiError) {
        logger.warn('AI generation failed, using demo mode', {
          error: aiError.message,
          personaId,
          context: context.substring(0, 100)
        });

        // Fallback to demo mode
        aiResponse = generateDemoResponse(persona, context);
      }

      // Create post from AI response
      const post = {
        id: generateUUID(),
        authorId: null, // AI-generated posts have no human author
        personaId: persona.id,
        content: aiResponse.content,
        mediaUrls: [],
        linkPreview: null,
        threadId: generateUUID(),
        parentPostId: postId || null,
        repostOfId: null,
        isAIGenerated: true,
        hashtags: extractHashtags(aiResponse.content),
        mentions: extractMentions(aiResponse.content),
        newsItemId: newsItemId || null,
        likeCount: 0,
        repostCount: 0,
        commentCount: 0,
        impressionCount: 0,
        contentWarning: null,
        isHidden: false,
        publishedAt: new Date().toISOString(),
        editedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: null,
        persona: mapToPublicPersona(persona)
      };

      logger.info('AI persona reply generated successfully', {
        personaId,
        postId: post.id,
        contentLength: aiResponse.content.length,
        processingTime: aiResponse.processingTime,
        isDemoMode: aiResponse.content.includes('[Demo Mode]')
      });

      res.status(201).json(post);

    } catch (error) {
      logger.error('Failed to generate AI persona reply', {
        error: error.message,
        stack: error.stack,
        personaId: req.params.personaId,
        userId: req.user?.id
      });

      if (error instanceof PersonaNotFoundError) {
        return res.status(404).json({
          error: 'Persona not found',
          message: error.message,
          success: false
        });
      }

      if (error instanceof PersonaServiceError) {
        return res.status(error.statusCode).json({
          error: error.code,
          message: error.message,
          success: false
        });
      }

      // AI service unavailable
      if (error.message.includes('AI') || error.message.includes('provider')) {
        return res.status(503).json({
          error: 'AI service unavailable',
          message: 'AI service is temporarily unavailable, please try again later',
          success: false
        });
      }

      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to generate AI response',
        success: false
      });
    }
  }
);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Map internal persona configuration to public API format
 */
function mapToPublicPersona(persona: any) {
  return {
    id: persona.id,
    name: persona.name,
    handle: persona.handle,
    bio: persona.bio,
    profileImageUrl: persona.profileImageUrl,
    personaType: persona.personaType,
    personalityTraits: persona.personalityTraits,
    interests: persona.interests,
    expertise: persona.expertise,
    toneStyle: persona.toneStyle,
    isActive: persona.isActive,
    isDefault: persona.isDefault
    // Exclude: systemPrompt, politicalAlignmentId, aiProvider, contextWindow, etc.
  };
}

/**
 * Generate demo response when AI services are unavailable
 */
function generateDemoResponse(persona: any, context: string): AIResponse {
  const demoResponses = {
    POLITICIAN: [
      '[Demo Mode] This is a critical issue that requires immediate bipartisan action.',
      '[Demo Mode] The people deserve better representation on this matter.',
      '[Demo Mode] We must prioritize the needs of our constituents above partisan politics.'
    ],
    INFLUENCER: [
      '[Demo Mode] This really makes you think about our society today.',
      '[Demo Mode] Sharing my thoughts on this important topic.',
      '[Demo Mode] We need to have more conversations like this.'
    ],
    JOURNALIST: [
      '[Demo Mode] The facts speak for themselves on this issue.',
      '[Demo Mode] Important context everyone should be aware of.',
      '[Demo Mode] Here\'s what the data actually shows.'
    ],
    ACTIVIST: [
      '[Demo Mode] This is exactly why we need to keep fighting for change.',
      '[Demo Mode] The system must be held accountable.',
      '[Demo Mode] Together we can make a difference on this issue.'
    ],
    BUSINESS: [
      '[Demo Mode] This has significant implications for the economy.',
      '[Demo Mode] Market dynamics suggest we need strategic action.',
      '[Demo Mode] Innovation and growth depend on addressing this properly.'
    ],
    ENTERTAINER: [
      '[Demo Mode] This hits different when you really think about it.',
      '[Demo Mode] Just wanted to share my perspective on this.',
      '[Demo Mode] Sometimes the truth is stranger than fiction.'
    ]
  };

  const responses = demoResponses[persona.personaType] || demoResponses.INFLUENCER;
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  return {
    content: randomResponse,
    processingTime: 100,
    tokens: {
      input: 50,
      output: 20,
      total: 70
    },
    provider: 'demo',
    model: 'demo-v1',
    confidence: 0.8
  };
}

/**
 * Extract hashtags from content
 */
function extractHashtags(content: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const matches = content.match(hashtagRegex);
  return matches ? matches.map(tag => tag.substring(1)) : [];
}

/**
 * Extract mentions from content
 */
function extractMentions(content: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const matches = content.match(mentionRegex);
  return matches ? matches.map(mention => mention.substring(1)) : [];
}

/**
 * Generate UUID (simplified version)
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default router;
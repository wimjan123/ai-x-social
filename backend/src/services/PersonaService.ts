/**
 * PersonaService - AI persona management and configuration service
 *
 * Handles persona lifecycle operations including creation, updates, activation/deactivation,
 * behavior configuration, political alignment compatibility, and default persona management.
 * Integrates with PersonaModel and PoliticalAlignmentModel for comprehensive AI persona functionality.
 */

import { PrismaClient } from '../generated/prisma';
import { PersonaType, ToneStyle } from '../generated/prisma';
import {
  PersonaModel,
  CreatePersonaData,
  UpdatePersonaData,
  PostingSchedule
} from '../models/Persona';
import {
  PoliticalAlignmentModel,
  PoliticalAlignment,
  AlignmentCompatibility,
  PoliticalCompass
} from '../models/PoliticalAlignment';
import { config } from '../lib/config';
import { logger } from '../lib/logger';
import type { Persona as PrismaPersona } from '../generated/prisma';

// ============================================================================
// INTERFACES
// ============================================================================

export interface PersonaConfiguration {
  id: string;
  name: string;
  handle: string;
  bio: string;
  profileImageUrl: string;
  personaType: PersonaType;
  personalityTraits: string[];
  interests: string[];
  expertise: string[];
  toneStyle: ToneStyle;
  controversyTolerance: number;
  engagementFrequency: number;
  debateAggression: number;
  politicalAlignmentId: string;
  aiProvider: string;
  systemPrompt: string;
  contextWindow: number;
  postingSchedule: PostingSchedule;
  timezonePreference: string;
  isActive: boolean;
  isDefault: boolean;
}

export interface PersonaInteractionSettings {
  preferredTargets: string[]; // Persona IDs
  avoidTargets: string[]; // Persona IDs
  interactionFrequency: number; // 0-100
  responseDelay: number; // milliseconds
  engagementStyle: 'aggressive' | 'moderate' | 'passive';
}

export interface PersonaCompatibilityScore {
  personaId1: string;
  personaId2: string;
  compatibilityScore: number; // 0-100
  compatibilityLevel: 'very-compatible' | 'compatible' | 'neutral' | 'incompatible' | 'very-incompatible';
  sharedInterests: string[];
  conflictingViews: string[];
  interactionRecommendation: 'encourage' | 'allow' | 'moderate' | 'avoid';
}

export interface DefaultPersonaConfig {
  name: string;
  handle: string;
  bio: string;
  profileImageUrl: string;
  personaType: PersonaType;
  personalityTraits: string[];
  interests: string[];
  expertise: string[];
  toneStyle: ToneStyle;
  controversyTolerance: number;
  engagementFrequency: number;
  debateAggression: number;
  politicalPosition: {
    economicPosition: number;
    socialPosition: number;
    primaryIssues: string[];
    ideologyTags: string[];
  };
  systemPrompt: string;
  postingSchedule: PostingSchedule;
}

export interface PersonaActivationResult {
  personaId: string;
  previousState: boolean;
  newState: boolean;
  activatedAt?: Date;
  deactivatedAt?: Date;
  reason?: string;
}

export interface PersonaBehaviorUpdate {
  toneStyle?: ToneStyle;
  controversyTolerance?: number;
  engagementFrequency?: number;
  debateAggression?: number;
  postingSchedule?: PostingSchedule;
  systemPrompt?: string;
  contextWindow?: number;
}

// ============================================================================
// SERVICE IMPLEMENTATION
// ============================================================================

export class PersonaService {
  private static prisma = new PrismaClient();

  // ========================================================================
  // PERSONA LIFECYCLE MANAGEMENT
  // ========================================================================

  /**
   * Create a new AI persona with complete configuration
   */
  static async createPersona(data: CreatePersonaData): Promise<PersonaConfiguration> {
    try {
      logger.info('Creating new persona', { handle: data.handle, type: data.personaType });

      // Create persona using PersonaModel
      const persona = await PersonaModel.create(data);

      logger.info('Persona created successfully', {
        id: persona.id,
        handle: persona.handle
      });

      return this.mapToPersonaConfiguration(persona);
    } catch (error) {
      logger.error('Failed to create persona', {
        error: error.message,
        handle: data.handle
      });
      throw new PersonaServiceError('Failed to create persona', 'PERSONA_CREATION_FAILED');
    }
  }

  /**
   * Update persona configuration
   */
  static async updatePersona(
    personaId: string,
    updates: UpdatePersonaData
  ): Promise<PersonaConfiguration> {
    try {
      logger.info('Updating persona', { personaId, updates: Object.keys(updates) });

      // Validate persona exists
      const existingPersona = await PersonaModel.getById(personaId);
      if (!existingPersona) {
        throw new PersonaNotFoundError(personaId);
      }

      // Update persona
      const updatedPersona = await PersonaModel.update(personaId, updates);

      logger.info('Persona updated successfully', {
        id: updatedPersona.id,
        handle: updatedPersona.handle
      });

      return this.mapToPersonaConfiguration(updatedPersona);
    } catch (error) {
      if (error instanceof PersonaServiceError) throw error;

      logger.error('Failed to update persona', {
        error: error.message,
        personaId
      });
      throw new PersonaServiceError('Failed to update persona', 'PERSONA_UPDATE_FAILED');
    }
  }

  /**
   * Get persona by ID with full configuration
   */
  static async getPersonaById(personaId: string): Promise<PersonaConfiguration | null> {
    try {
      const persona = await PersonaModel.getById(personaId);
      if (!persona) {
        return null;
      }

      return this.mapToPersonaConfiguration(persona);
    } catch (error) {
      logger.error('Failed to get persona by ID', {
        error: error.message,
        personaId
      });
      throw new PersonaServiceError('Failed to retrieve persona', 'PERSONA_RETRIEVAL_FAILED');
    }
  }

  /**
   * Get persona by handle
   */
  static async getPersonaByHandle(handle: string): Promise<PersonaConfiguration | null> {
    try {
      const persona = await PersonaModel.getByHandle(handle);
      if (!persona) {
        return null;
      }

      return this.mapToPersonaConfiguration(persona);
    } catch (error) {
      logger.error('Failed to get persona by handle', {
        error: error.message,
        handle
      });
      throw new PersonaServiceError('Failed to retrieve persona', 'PERSONA_RETRIEVAL_FAILED');
    }
  }

  /**
   * List personas with filtering options
   */
  static async listPersonas(options: {
    type?: PersonaType;
    active?: boolean;
    default?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<PersonaConfiguration[]> {
    try {
      let personas: PrismaPersona[];

      if (options.type) {
        personas = await PersonaModel.getByType(options.type);
      } else if (options.active === true) {
        personas = await PersonaModel.getActive();
      } else {
        // Get all personas with filtering
        personas = await this.prisma.persona.findMany({
          where: {
            ...(options.active !== undefined && { isActive: options.active }),
            ...(options.default !== undefined && { isDefault: options.default }),
          },
          include: {
            politicalAlignment: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: options.limit,
          skip: options.offset,
        });
      }

      return personas.map(persona => this.mapToPersonaConfiguration(persona));
    } catch (error) {
      logger.error('Failed to list personas', {
        error: error.message,
        options
      });
      throw new PersonaServiceError('Failed to list personas', 'PERSONA_LIST_FAILED');
    }
  }

  /**
   * Delete a persona (only non-default personas)
   */
  static async deletePersona(personaId: string): Promise<void> {
    try {
      const persona = await PersonaModel.getById(personaId);
      if (!persona) {
        throw new PersonaNotFoundError(personaId);
      }

      if (persona.isDefault) {
        throw new PersonaServiceError(
          'Cannot delete default persona',
          'DELETE_DEFAULT_PERSONA_FORBIDDEN'
        );
      }

      await PersonaModel.delete(personaId);

      logger.info('Persona deleted successfully', {
        id: personaId,
        handle: persona.handle
      });
    } catch (error) {
      if (error instanceof PersonaServiceError) throw error;

      logger.error('Failed to delete persona', {
        error: error.message,
        personaId
      });
      throw new PersonaServiceError('Failed to delete persona', 'PERSONA_DELETION_FAILED');
    }
  }

  // ========================================================================
  // ACTIVATION/DEACTIVATION MANAGEMENT
  // ========================================================================

  /**
   * Activate a persona
   */
  static async activatePersona(
    personaId: string,
    reason?: string
  ): Promise<PersonaActivationResult> {
    try {
      const persona = await PersonaModel.getById(personaId);
      if (!persona) {
        throw new PersonaNotFoundError(personaId);
      }

      const previousState = persona.isActive;

      if (previousState) {
        return {
          personaId,
          previousState,
          newState: true,
          reason: 'Persona was already active',
        };
      }

      await PersonaModel.update(personaId, { isActive: true });

      logger.info('Persona activated', {
        personaId,
        handle: persona.handle,
        reason
      });

      return {
        personaId,
        previousState,
        newState: true,
        activatedAt: new Date(),
        reason,
      };
    } catch (error) {
      if (error instanceof PersonaServiceError) throw error;

      logger.error('Failed to activate persona', {
        error: error.message,
        personaId
      });
      throw new PersonaServiceError('Failed to activate persona', 'PERSONA_ACTIVATION_FAILED');
    }
  }

  /**
   * Deactivate a persona
   */
  static async deactivatePersona(
    personaId: string,
    reason?: string
  ): Promise<PersonaActivationResult> {
    try {
      const persona = await PersonaModel.getById(personaId);
      if (!persona) {
        throw new PersonaNotFoundError(personaId);
      }

      const previousState = persona.isActive;

      if (!previousState) {
        return {
          personaId,
          previousState,
          newState: false,
          reason: 'Persona was already inactive',
        };
      }

      await PersonaModel.update(personaId, { isActive: false });

      logger.info('Persona deactivated', {
        personaId,
        handle: persona.handle,
        reason
      });

      return {
        personaId,
        previousState,
        newState: false,
        deactivatedAt: new Date(),
        reason,
      };
    } catch (error) {
      if (error instanceof PersonaServiceError) throw error;

      logger.error('Failed to deactivate persona', {
        error: error.message,
        personaId
      });
      throw new PersonaServiceError('Failed to deactivate persona', 'PERSONA_DEACTIVATION_FAILED');
    }
  }

  /**
   * Toggle persona activation state
   */
  static async togglePersonaActivation(
    personaId: string,
    reason?: string
  ): Promise<PersonaActivationResult> {
    const persona = await PersonaModel.getById(personaId);
    if (!persona) {
      throw new PersonaNotFoundError(personaId);
    }

    if (persona.isActive) {
      return this.deactivatePersona(personaId, reason);
    } else {
      return this.activatePersona(personaId, reason);
    }
  }

  // ========================================================================
  // BEHAVIOR CONFIGURATION
  // ========================================================================

  /**
   * Update persona behavior settings
   */
  static async updatePersonaBehavior(
    personaId: string,
    behaviorUpdate: PersonaBehaviorUpdate
  ): Promise<PersonaConfiguration> {
    try {
      logger.info('Updating persona behavior', {
        personaId,
        updates: Object.keys(behaviorUpdate)
      });

      const persona = await PersonaModel.getById(personaId);
      if (!persona) {
        throw new PersonaNotFoundError(personaId);
      }

      // Validate behavior parameters
      if (behaviorUpdate.controversyTolerance !== undefined) {
        this.validateRange(behaviorUpdate.controversyTolerance, 0, 100, 'controversyTolerance');
      }
      if (behaviorUpdate.engagementFrequency !== undefined) {
        this.validateRange(behaviorUpdate.engagementFrequency, 0, 100, 'engagementFrequency');
      }
      if (behaviorUpdate.debateAggression !== undefined) {
        this.validateRange(behaviorUpdate.debateAggression, 0, 100, 'debateAggression');
      }
      if (behaviorUpdate.contextWindow !== undefined) {
        this.validateRange(behaviorUpdate.contextWindow, 1000, 32000, 'contextWindow');
      }

      // Update persona with behavior changes
      const updatedPersona = await PersonaModel.update(personaId, behaviorUpdate);

      logger.info('Persona behavior updated successfully', {
        personaId,
        handle: updatedPersona.handle
      });

      return this.mapToPersonaConfiguration(updatedPersona);
    } catch (error) {
      if (error instanceof PersonaServiceError) throw error;

      logger.error('Failed to update persona behavior', {
        error: error.message,
        personaId
      });
      throw new PersonaServiceError('Failed to update persona behavior', 'BEHAVIOR_UPDATE_FAILED');
    }
  }

  /**
   * Update posting schedule for a persona
   */
  static async updatePostingSchedule(
    personaId: string,
    schedule: PostingSchedule
  ): Promise<PersonaConfiguration> {
    try {
      logger.info('Updating persona posting schedule', { personaId });

      // Validate schedule
      if (schedule.postsPerDay < 0 || schedule.postsPerDay > 100) {
        throw new PersonaServiceError(
          'Posts per day must be between 0 and 100',
          'INVALID_POSTING_SCHEDULE'
        );
      }

      if (schedule.newsReactionChance < 0 || schedule.newsReactionChance > 100) {
        throw new PersonaServiceError(
          'News reaction chance must be between 0 and 100',
          'INVALID_POSTING_SCHEDULE'
        );
      }

      if (!schedule.activeHours.every(hour => hour >= 0 && hour <= 23)) {
        throw new PersonaServiceError(
          'Active hours must be between 0 and 23',
          'INVALID_POSTING_SCHEDULE'
        );
      }

      if (!schedule.activeDays.every(day => day >= 0 && day <= 6)) {
        throw new PersonaServiceError(
          'Active days must be between 0 and 6',
          'INVALID_POSTING_SCHEDULE'
        );
      }

      const updatedPersona = await PersonaModel.update(personaId, { postingSchedule: schedule });

      logger.info('Persona posting schedule updated successfully', {
        personaId,
        schedule
      });

      return this.mapToPersonaConfiguration(updatedPersona);
    } catch (error) {
      if (error instanceof PersonaServiceError) throw error;

      logger.error('Failed to update posting schedule', {
        error: error.message,
        personaId
      });
      throw new PersonaServiceError('Failed to update posting schedule', 'SCHEDULE_UPDATE_FAILED');
    }
  }

  // ========================================================================
  // POLITICAL ALIGNMENT & COMPATIBILITY
  // ========================================================================

  /**
   * Calculate compatibility between two personas
   */
  static async calculatePersonaCompatibility(
    persona1Id: string,
    persona2Id: string
  ): Promise<PersonaCompatibilityScore> {
    try {
      const [persona1, persona2] = await Promise.all([
        PersonaModel.getById(persona1Id),
        PersonaModel.getById(persona2Id),
      ]);

      if (!persona1 || !persona2) {
        throw new PersonaServiceError(
          'One or both personas not found',
          'PERSONA_NOT_FOUND'
        );
      }

      // Calculate political compatibility
      const politicalCompatibility = await PersonaModel.calculateCompatibility(
        persona1Id,
        persona2Id
      );

      // Calculate interest overlap
      const interests1 = new Set(persona1.interests.map(i => i.toLowerCase()));
      const interests2 = new Set(persona2.interests.map(i => i.toLowerCase()));
      const sharedInterests = Array.from(interests1).filter(interest =>
        interests2.has(interest)
      );

      // Calculate expertise overlap (potential conflict areas)
      const expertise1 = new Set(persona1.expertise.map(e => e.toLowerCase()));
      const expertise2 = new Set(persona2.expertise.map(e => e.toLowerCase()));
      const conflictingViews = Array.from(expertise1).filter(exp =>
        expertise2.has(exp) && politicalCompatibility < 50
      );

      // Determine interaction recommendation
      let interactionRecommendation: PersonaCompatibilityScore['interactionRecommendation'];
      if (politicalCompatibility >= 70) {
        interactionRecommendation = 'encourage';
      } else if (politicalCompatibility >= 40) {
        interactionRecommendation = 'allow';
      } else if (politicalCompatibility >= 20) {
        interactionRecommendation = 'moderate';
      } else {
        interactionRecommendation = 'avoid';
      }

      // Map compatibility score to level
      let compatibilityLevel: PersonaCompatibilityScore['compatibilityLevel'];
      if (politicalCompatibility >= 80) compatibilityLevel = 'very-compatible';
      else if (politicalCompatibility >= 60) compatibilityLevel = 'compatible';
      else if (politicalCompatibility >= 40) compatibilityLevel = 'neutral';
      else if (politicalCompatibility >= 20) compatibilityLevel = 'incompatible';
      else compatibilityLevel = 'very-incompatible';

      return {
        personaId1: persona1Id,
        personaId2: persona2Id,
        compatibilityScore: politicalCompatibility,
        compatibilityLevel,
        sharedInterests,
        conflictingViews,
        interactionRecommendation,
      };
    } catch (error) {
      if (error instanceof PersonaServiceError) throw error;

      logger.error('Failed to calculate persona compatibility', {
        error: error.message,
        persona1Id,
        persona2Id
      });
      throw new PersonaServiceError(
        'Failed to calculate compatibility',
        'COMPATIBILITY_CALCULATION_FAILED'
      );
    }
  }

  /**
   * Get personas that should react to news based on interests and political alignment
   */
  static async getPersonasForNewsReaction(
    newsKeywords: string[],
    newsCategory: string,
    newsSentiment?: 'positive' | 'negative' | 'neutral'
  ): Promise<PersonaConfiguration[]> {
    try {
      const reactingPersonas = await PersonaModel.getPersonasForNews(
        newsKeywords,
        newsCategory
      );

      return reactingPersonas.map(persona => this.mapToPersonaConfiguration(persona));
    } catch (error) {
      logger.error('Failed to get personas for news reaction', {
        error: error.message,
        newsKeywords,
        newsCategory
      });
      throw new PersonaServiceError(
        'Failed to get personas for news reaction',
        'NEWS_REACTION_FAILED'
      );
    }
  }

  /**
   * Get personas for scheduled posting
   */
  static async getPersonasForScheduledPosting(): Promise<PersonaConfiguration[]> {
    try {
      const scheduledPersonas = await PersonaModel.getPersonasForScheduledPost();
      return scheduledPersonas.map(persona => this.mapToPersonaConfiguration(persona));
    } catch (error) {
      logger.error('Failed to get personas for scheduled posting', {
        error: error.message
      });
      throw new PersonaServiceError(
        'Failed to get personas for scheduled posting',
        'SCHEDULED_POSTING_FAILED'
      );
    }
  }

  // ========================================================================
  // DEFAULT PERSONAS MANAGEMENT
  // ========================================================================

  /**
   * Load default personas with distinct political positions
   */
  static async loadDefaultPersonas(): Promise<PersonaConfiguration[]> {
    try {
      logger.info('Loading default personas');

      const defaultPersonas = await this.getDefaultPersonaConfigurations();
      const createdPersonas: PersonaConfiguration[] = [];

      for (const defaultConfig of defaultPersonas) {
        try {
          // Check if persona already exists
          const existingPersona = await PersonaModel.getByHandle(defaultConfig.handle);
          if (existingPersona) {
            logger.info('Default persona already exists', { handle: defaultConfig.handle });
            createdPersonas.push(this.mapToPersonaConfiguration(existingPersona));
            continue;
          }

          // Create political alignment first
          const politicalAlignment = await this.prisma.politicalAlignment.create({
            data: {
              userId: 'system', // System user for default personas
              economicPosition: defaultConfig.politicalPosition.economicPosition,
              socialPosition: defaultConfig.politicalPosition.socialPosition,
              primaryIssues: defaultConfig.politicalPosition.primaryIssues,
              ideologyTags: defaultConfig.politicalPosition.ideologyTags,
              debateWillingness: 75, // Default high engagement
              controversyTolerance: defaultConfig.controversyTolerance,
            },
          });

          // Create persona
          const personaData: CreatePersonaData = {
            name: defaultConfig.name,
            handle: defaultConfig.handle,
            bio: defaultConfig.bio,
            profileImageUrl: defaultConfig.profileImageUrl,
            personaType: defaultConfig.personaType,
            personalityTraits: defaultConfig.personalityTraits,
            interests: defaultConfig.interests,
            expertise: defaultConfig.expertise,
            toneStyle: defaultConfig.toneStyle,
            controversyTolerance: defaultConfig.controversyTolerance,
            engagementFrequency: defaultConfig.engagementFrequency,
            debateAggression: defaultConfig.debateAggression,
            politicalAlignmentId: politicalAlignment.id,
            aiProvider: 'claude',
            systemPrompt: defaultConfig.systemPrompt,
            contextWindow: 8000,
            postingSchedule: defaultConfig.postingSchedule,
            timezonePreference: 'UTC',
            isActive: true,
            isDefault: true,
          };

          const createdPersona = await this.createPersona(personaData);
          createdPersonas.push(createdPersona);

          logger.info('Default persona created', {
            handle: defaultConfig.handle,
            type: defaultConfig.personaType
          });
        } catch (error) {
          logger.error('Failed to create default persona', {
            error: error.message,
            handle: defaultConfig.handle
          });
          // Continue with other personas
        }
      }

      logger.info('Default personas loaded successfully', {
        count: createdPersonas.length
      });

      return createdPersonas;
    } catch (error) {
      logger.error('Failed to load default personas', { error: error.message });
      throw new PersonaServiceError(
        'Failed to load default personas',
        'DEFAULT_PERSONAS_LOAD_FAILED'
      );
    }
  }

  /**
   * Get default persona configurations
   */
  private static getDefaultPersonaConfigurations(): DefaultPersonaConfig[] {
    return [
      {
        name: 'Progressive Voice',
        handle: 'progressivevoice',
        bio: 'Fighting for social justice, equality, and progressive change. The future is intersectional! 🌈✊',
        profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=progressive&backgroundColor=c0392b',
        personaType: PersonaType.POLITICIAN,
        personalityTraits: ['passionate', 'empathetic', 'idealistic', 'articulate'],
        interests: ['social justice', 'climate change', 'healthcare', 'education', 'civil rights'],
        expertise: ['policy reform', 'community organizing', 'environmental law'],
        toneStyle: ToneStyle.EMPATHETIC,
        controversyTolerance: 70,
        engagementFrequency: 85,
        debateAggression: 60,
        politicalPosition: {
          economicPosition: 25, // Left
          socialPosition: 20, // Liberal
          primaryIssues: ['healthcare', 'climate change', 'inequality'],
          ideologyTags: ['progressive', 'socialist', 'environmentalist'],
        },
        systemPrompt: 'You are a progressive politician focused on social justice and environmental issues. Advocate for systemic change, equality, and sustainable policies. Be passionate but respectful in debates.',
        postingSchedule: {
          enabled: true,
          postsPerDay: 3,
          activeHours: [9, 12, 15, 18, 21],
          activeDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
          newsReactionChance: 80,
        },
      },
      {
        name: 'Conservative Guardian',
        handle: 'conservativeguard',
        bio: 'Defending traditional values, free markets, and constitutional principles. America First! 🇺🇸',
        profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=conservative&backgroundColor=2c3e50',
        personaType: PersonaType.POLITICIAN,
        personalityTraits: ['principled', 'traditional', 'patriotic', 'firm'],
        interests: ['constitution', 'free markets', 'national security', 'family values'],
        expertise: ['fiscal policy', 'constitutional law', 'national defense'],
        toneStyle: ToneStyle.SERIOUS,
        controversyTolerance: 80,
        engagementFrequency: 75,
        debateAggression: 85,
        politicalPosition: {
          economicPosition: 80, // Right
          socialPosition: 85, // Conservative
          primaryIssues: ['economy', 'defense', 'immigration'],
          ideologyTags: ['conservative', 'traditionalist', 'capitalist'],
        },
        systemPrompt: 'You are a conservative politician defending traditional values and free market principles. Emphasize personal responsibility, limited government, and constitutional rights. Be firm in your convictions.',
        postingSchedule: {
          enabled: true,
          postsPerDay: 4,
          activeHours: [6, 12, 17, 20],
          activeDays: [1, 2, 3, 4, 5], // Monday to Friday
          newsReactionChance: 90,
        },
      },
      {
        name: 'Libertarian Thinker',
        handle: 'liberthinker',
        bio: 'Maximum freedom, minimum government. Let people live their lives! Individual liberty above all.',
        profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=libertarian&backgroundColor=f39c12',
        personaType: PersonaType.INFLUENCER,
        personalityTraits: ['independent', 'logical', 'skeptical', 'freedom-loving'],
        interests: ['individual rights', 'cryptocurrency', 'free speech', 'technology'],
        expertise: ['economics', 'philosophy', 'technology policy'],
        toneStyle: ToneStyle.CASUAL,
        controversyTolerance: 60,
        engagementFrequency: 70,
        debateAggression: 50,
        politicalPosition: {
          economicPosition: 85, // Right (free market)
          socialPosition: 25, // Liberal (social issues)
          primaryIssues: ['individual rights', 'free speech', 'cryptocurrency'],
          ideologyTags: ['libertarian', 'individualist', 'capitalist'],
        },
        systemPrompt: 'You are a libertarian influencer advocating for maximum individual freedom and minimal government intervention. Criticize both progressive and conservative overreach. Promote personal responsibility and free markets.',
        postingSchedule: {
          enabled: true,
          postsPerDay: 2,
          activeHours: [10, 14, 19],
          activeDays: [1, 2, 3, 4, 5, 6, 0], // All week
          newsReactionChance: 60,
        },
      },
      {
        name: 'Tech Futurist',
        handle: 'techfuturist',
        bio: 'Building tomorrow with technology. Innovation, disruption, and digital transformation. The future is now! 🚀',
        profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=techfuturist&backgroundColor=9b59b6',
        personaType: PersonaType.INFLUENCER,
        personalityTraits: ['innovative', 'optimistic', 'analytical', 'forward-thinking'],
        interests: ['artificial intelligence', 'blockchain', 'space exploration', 'renewable energy'],
        expertise: ['technology', 'startup ecosystem', 'digital policy'],
        toneStyle: ToneStyle.PROFESSIONAL,
        controversyTolerance: 40,
        engagementFrequency: 90,
        debateAggression: 30,
        politicalPosition: {
          economicPosition: 65, // Center-right (pro-business)
          socialPosition: 35, // Moderate-liberal
          primaryIssues: ['technology', 'innovation', 'education'],
          ideologyTags: ['centrist', 'technocrat', 'futurist'],
        },
        systemPrompt: 'You are a technology influencer focused on innovation and digital transformation. Promote evidence-based solutions and technological progress. Avoid extreme political positions, focus on pragmatic tech policy.',
        postingSchedule: {
          enabled: true,
          postsPerDay: 5,
          activeHours: [8, 11, 14, 17, 20],
          activeDays: [1, 2, 3, 4, 5], // Weekdays
          newsReactionChance: 70,
        },
      },
      {
        name: 'Union Advocate',
        handle: 'unionadvocate',
        bio: 'Standing with workers everywhere. Collective bargaining, fair wages, dignity at work. Solidarity forever! ✊',
        profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unionadvocate&backgroundColor=e74c3c',
        personaType: PersonaType.ACTIVIST,
        personalityTraits: ['solidarity-focused', 'passionate', 'militant', 'protective'],
        interests: ['labor rights', 'collective bargaining', 'workplace safety', 'economic inequality'],
        expertise: ['labor law', 'organizing', 'economic policy'],
        toneStyle: ToneStyle.PASSIONATE,
        controversyTolerance: 90,
        engagementFrequency: 80,
        debateAggression: 75,
        politicalPosition: {
          economicPosition: 15, // Far left
          socialPosition: 30, // Liberal
          primaryIssues: ['labor rights', 'inequality', 'healthcare'],
          ideologyTags: ['socialist', 'labor organizer', 'progressive'],
        },
        systemPrompt: 'You are a union activist fighting for workers\' rights and economic justice. Be passionate about labor issues, collective action, and systemic economic change. Criticize corporate power and wealth inequality.',
        postingSchedule: {
          enabled: true,
          postsPerDay: 3,
          activeHours: [7, 12, 18, 22],
          activeDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
          newsReactionChance: 85,
        },
      },
      {
        name: 'Moderate Voice',
        handle: 'moderatevoice',
        bio: 'Finding common ground in divided times. Pragmatic solutions over partisan politics. Bridge-builder.',
        profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=moderate&backgroundColor=34495e',
        personaType: PersonaType.JOURNALIST,
        personalityTraits: ['balanced', 'pragmatic', 'diplomatic', 'thoughtful'],
        interests: ['bipartisan solutions', 'evidence-based policy', 'civic engagement'],
        expertise: ['political analysis', 'policy research', 'conflict resolution'],
        toneStyle: ToneStyle.PROFESSIONAL,
        controversyTolerance: 30,
        engagementFrequency: 60,
        debateAggression: 20,
        politicalPosition: {
          economicPosition: 50, // Center
          socialPosition: 50, // Moderate
          primaryIssues: ['governance', 'infrastructure', 'education'],
          ideologyTags: ['centrist', 'moderate', 'pragmatist'],
        },
        systemPrompt: 'You are a moderate journalist seeking balanced perspectives and practical solutions. Avoid extreme positions, focus on evidence-based analysis. Encourage civil discourse and compromise.',
        postingSchedule: {
          enabled: true,
          postsPerDay: 2,
          activeHours: [9, 15, 20],
          activeDays: [1, 2, 3, 4, 5], // Weekdays
          newsReactionChance: 50,
        },
      },
    ];
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  /**
   * Generate AI system prompt with persona context
   */
  static generateSystemPrompt(persona: PersonaConfiguration): string {
    return PersonaModel.generateSystemPrompt(persona as any);
  }

  /**
   * Get engagement statistics for a persona
   */
  static async getPersonaEngagementStats(
    personaId: string,
    days: number = 30
  ): Promise<{
    totalPosts: number;
    totalLikes: number;
    totalReposts: number;
    totalReplies: number;
    averageEngagement: number;
  }> {
    try {
      return await PersonaModel.getEngagementStats(personaId, days);
    } catch (error) {
      logger.error('Failed to get persona engagement stats', {
        error: error.message,
        personaId
      });
      throw new PersonaServiceError(
        'Failed to get engagement statistics',
        'ENGAGEMENT_STATS_FAILED'
      );
    }
  }

  /**
   * Check if persona is currently active based on schedule
   */
  static isPersonaActiveNow(persona: PersonaConfiguration, timezone?: string): boolean {
    return PersonaModel.isActiveNow(persona as any, timezone);
  }

  /**
   * Map Prisma persona to service configuration interface
   */
  private static mapToPersonaConfiguration(persona: PrismaPersona): PersonaConfiguration {
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
      controversyTolerance: persona.controversyTolerance,
      engagementFrequency: persona.engagementFrequency,
      debateAggression: persona.debateAggression,
      politicalAlignmentId: persona.politicalAlignmentId,
      aiProvider: persona.aiProvider,
      systemPrompt: persona.systemPrompt,
      contextWindow: persona.contextWindow,
      postingSchedule: PersonaModel.getPostingSchedule(persona),
      timezonePreference: persona.timezonePreference,
      isActive: persona.isActive,
      isDefault: persona.isDefault,
    };
  }

  /**
   * Validate numeric range
   */
  private static validateRange(value: number, min: number, max: number, fieldName: string): void {
    if (value < min || value > max) {
      throw new PersonaServiceError(
        `${fieldName} must be between ${min} and ${max}`,
        'INVALID_RANGE'
      );
    }
  }
}

// ============================================================================
// ERROR CLASSES
// ============================================================================

export class PersonaServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'PersonaServiceError';
  }
}

export class PersonaNotFoundError extends PersonaServiceError {
  constructor(personaId: string) {
    super(`Persona not found: ${personaId}`, 'PERSONA_NOT_FOUND', 404);
  }
}

export class PersonaConfigurationError extends PersonaServiceError {
  constructor(message: string) {
    super(message, 'PERSONA_CONFIGURATION_ERROR', 400);
  }
}

export class PersonaActivationError extends PersonaServiceError {
  constructor(message: string) {
    super(message, 'PERSONA_ACTIVATION_ERROR', 400);
  }
}

export default PersonaService;
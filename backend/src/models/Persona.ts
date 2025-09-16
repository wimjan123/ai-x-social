// Persona model for AI character management and configuration
// Implements data-model.md:245-285 specifications

import { z } from 'zod';
import { PrismaClient, Persona as PrismaPersona, ToneStyle, PersonaType, Prisma } from '../generated/prisma';

const prisma = new PrismaClient();

// PostingSchedule interface as specified in data-model.md:297-303
export interface PostingSchedule {
  enabled: boolean;
  postsPerDay: number;        // Target posts per day
  activeHours: number[];      // Hours of day when active (0-23)
  activeDays: number[];       // Days of week when active (0-6)
  newsReactionChance: number; // 0-100: Chance to react to news
}

// Validation schemas
export const CreatePersonaSchema = z.object({
  name: z.string().min(1).max(50, 'Name must be 1-50 characters'),
  handle: z.string().min(3).max(15, 'Handle must be 3-15 characters').regex(/^[a-zA-Z0-9_]+$/, 'Handle can only contain letters, numbers, and underscores'),
  bio: z.string().min(1).max(500, 'Bio must be 1-500 characters'),
  profileImageUrl: z.string().url('Invalid profile image URL'),
  personaType: z.nativeEnum(PersonaType),
  personalityTraits: z.array(z.string().max(50)).max(10, 'Maximum 10 personality traits'),
  interests: z.array(z.string().max(50)).max(10, 'Maximum 10 interests'),
  expertise: z.array(z.string().max(50)).max(10, 'Maximum 10 expertise areas'),
  toneStyle: z.nativeEnum(ToneStyle).default(ToneStyle.PROFESSIONAL),
  controversyTolerance: z.number().min(0).max(100, 'Controversy tolerance must be 0-100'),
  engagementFrequency: z.number().min(0).max(100, 'Engagement frequency must be 0-100'),
  debateAggression: z.number().min(0).max(100, 'Debate aggression must be 0-100'),
  politicalAlignmentId: z.string().uuid('Invalid political alignment ID'),
  aiProvider: z.string().min(1).max(50, 'AI provider must be specified'),
  systemPrompt: z.string().min(1, 'System prompt is required'),
  contextWindow: z.number().min(1000).max(32000, 'Context window must be between 1000-32000'),
  postingSchedule: z.object({
    enabled: z.boolean(),
    postsPerDay: z.number().min(0).max(100),
    activeHours: z.array(z.number().min(0).max(23)).max(24),
    activeDays: z.array(z.number().min(0).max(6)).max(7),
    newsReactionChance: z.number().min(0).max(100),
  }).refine(
    (schedule) => schedule.activeHours.every(hour => Number.isInteger(hour)),
    { message: 'Active hours must be integers between 0-23' }
  ).refine(
    (schedule) => schedule.activeDays.every(day => Number.isInteger(day)),
    { message: 'Active days must be integers between 0-6' }
  ),
  timezonePreference: z.string().default('UTC'),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
});

export const UpdatePersonaSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  bio: z.string().min(1).max(500).optional(),
  profileImageUrl: z.string().url().optional(),
  personalityTraits: z.array(z.string().max(50)).max(10).optional(),
  interests: z.array(z.string().max(50)).max(10).optional(),
  expertise: z.array(z.string().max(50)).max(10).optional(),
  toneStyle: z.nativeEnum(ToneStyle).optional(),
  controversyTolerance: z.number().min(0).max(100).optional(),
  engagementFrequency: z.number().min(0).max(100).optional(),
  debateAggression: z.number().min(0).max(100).optional(),
  systemPrompt: z.string().min(1).optional(),
  contextWindow: z.number().min(1000).max(32000).optional(),
  postingSchedule: z.object({
    enabled: z.boolean(),
    postsPerDay: z.number().min(0).max(100),
    activeHours: z.array(z.number().min(0).max(23)).max(24),
    activeDays: z.array(z.number().min(0).max(6)).max(7),
    newsReactionChance: z.number().min(0).max(100),
  }).optional(),
  timezonePreference: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreatePersonaData = z.infer<typeof CreatePersonaSchema>;
export type UpdatePersonaData = z.infer<typeof UpdatePersonaSchema>;

export class PersonaModel {
  /**
   * Create a new AI persona
   */
  static async create(data: CreatePersonaData): Promise<PrismaPersona> {
    // Validate input data
    const validatedData = CreatePersonaSchema.parse(data);

    // Check handle uniqueness
    const existingPersona = await prisma.persona.findUnique({
      where: { handle: validatedData.handle.toLowerCase() },
    });

    if (existingPersona) {
      throw new Error('Handle already exists');
    }

    // Verify political alignment exists
    const politicalAlignment = await prisma.politicalAlignment.findUnique({
      where: { id: validatedData.politicalAlignmentId },
    });

    if (!politicalAlignment) {
      throw new Error('Political alignment not found');
    }

    // Create persona
    const persona = await prisma.persona.create({
      data: {
        name: validatedData.name,
        handle: validatedData.handle.toLowerCase(),
        bio: validatedData.bio,
        profileImageUrl: validatedData.profileImageUrl,
        personaType: validatedData.personaType,
        personalityTraits: validatedData.personalityTraits,
        interests: validatedData.interests,
        expertise: validatedData.expertise,
        toneStyle: validatedData.toneStyle,
        controversyTolerance: validatedData.controversyTolerance,
        engagementFrequency: validatedData.engagementFrequency,
        debateAggression: validatedData.debateAggression,
        politicalAlignmentId: validatedData.politicalAlignmentId,
        aiProvider: validatedData.aiProvider,
        systemPrompt: validatedData.systemPrompt,
        contextWindow: validatedData.contextWindow,
        postingSchedule: JSON.stringify(validatedData.postingSchedule),
        timezonePreference: validatedData.timezonePreference,
        isActive: validatedData.isActive,
        isDefault: validatedData.isDefault,
      },
      include: {
        politicalAlignment: true,
      },
    });

    return persona;
  }

  /**
   * Get persona by ID with political alignment
   */
  static async getById(id: string): Promise<PrismaPersona | null> {
    return prisma.persona.findUnique({
      where: { id },
      include: {
        politicalAlignment: true,
        posts: {
          orderBy: {
            publishedAt: 'desc',
          },
          take: 10, // Latest 10 posts
          include: {
            reactions: true,
            _count: {
              select: {
                reactions: true,
                replies: true,
                reposts: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get persona by handle
   */
  static async getByHandle(handle: string): Promise<PrismaPersona | null> {
    return prisma.persona.findUnique({
      where: { handle: handle.toLowerCase() },
      include: {
        politicalAlignment: true,
      },
    });
  }

  /**
   * Get all active personas
   */
  static async getActive(): Promise<PrismaPersona[]> {
    return prisma.persona.findMany({
      where: { isActive: true },
      include: {
        politicalAlignment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get personas by type
   */
  static async getByType(personaType: PersonaType): Promise<PrismaPersona[]> {
    return prisma.persona.findMany({
      where: {
        personaType,
        isActive: true,
      },
      include: {
        politicalAlignment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update persona configuration
   */
  static async update(id: string, data: UpdatePersonaData): Promise<PrismaPersona> {
    const validatedData = UpdatePersonaSchema.parse(data);

    // Prepare update data
    const updateData: any = { ...validatedData };
    if (updateData.postingSchedule) {
      updateData.postingSchedule = JSON.stringify(updateData.postingSchedule);
    }

    return prisma.persona.update({
      where: { id },
      data: updateData,
      include: {
        politicalAlignment: true,
      },
    });
  }

  /**
   * Delete a persona
   */
  static async delete(id: string): Promise<void> {
    await prisma.persona.delete({
      where: { id },
    });
  }

  /**
   * Get posting schedule for a persona
   */
  static getPostingSchedule(persona: PrismaPersona): PostingSchedule {
    try {
      return JSON.parse(persona.postingSchedule as string) as PostingSchedule;
    } catch (error) {
      // Return default schedule if parsing fails
      return {
        enabled: false,
        postsPerDay: 1,
        activeHours: [9, 12, 15, 18],
        activeDays: [1, 2, 3, 4, 5], // Monday to Friday
        newsReactionChance: 30,
      };
    }
  }

  /**
   * Check if persona should be active at current time
   */
  static isActiveNow(persona: PrismaPersona, timezone?: string): boolean {
    const schedule = this.getPostingSchedule(persona);

    if (!schedule.enabled || !persona.isActive) {
      return false;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    return (
      schedule.activeHours.includes(currentHour) &&
      schedule.activeDays.includes(currentDay)
    );
  }

  /**
   * Calculate political compatibility between two personas
   */
  static async calculateCompatibility(persona1Id: string, persona2Id: string): Promise<number> {
    const [persona1, persona2] = await Promise.all([
      this.getById(persona1Id),
      this.getById(persona2Id),
    ]);

    if (!persona1 || !persona2) {
      return 0;
    }

    // Get political alignments separately since they're not included in getById by default
    const [pa1, pa2] = await Promise.all([
      prisma.politicalAlignment.findUnique({ where: { id: persona1.politicalAlignmentId } }),
      prisma.politicalAlignment.findUnique({ where: { id: persona2.politicalAlignmentId } }),
    ]);

    if (!pa1 || !pa2) {
      return 0;
    }

    // Calculate compatibility based on political positions (0-100 scale)
    const economicDiff = Math.abs(pa1.economicPosition - pa2.economicPosition);
    const socialDiff = Math.abs(pa1.socialPosition - pa2.socialPosition);

    // Convert to compatibility score (closer positions = higher compatibility)
    const economicCompat = (100 - economicDiff) / 100;
    const socialCompat = (100 - socialDiff) / 100;

    // Average the compatibility scores
    return Math.round(((economicCompat + socialCompat) / 2) * 100);
  }

  /**
   * Get personas that should react to news based on interests
   */
  static async getPersonasForNews(
    newsKeywords: string[],
    newsCategory: string
  ): Promise<PrismaPersona[]> {
    const personas = await this.getActive();

    return personas.filter(persona => {
      const schedule = this.getPostingSchedule(persona);

      // Check if persona is currently active
      if (!this.isActiveNow(persona)) {
        return false;
      }

      // Check news reaction chance
      if (Math.random() * 100 > schedule.newsReactionChance) {
        return false;
      }

      // Check if persona's interests or expertise match news keywords
      const personaKeywords = [
        ...persona.interests,
        ...persona.expertise,
        persona.personaType.toLowerCase(),
      ].map(k => k.toLowerCase());

      const newsKeywordsLower = newsKeywords.map(k => k.toLowerCase());

      return personaKeywords.some(keyword =>
        newsKeywordsLower.some(newsKeyword =>
          newsKeyword.includes(keyword) || keyword.includes(newsKeyword)
        )
      );
    });
  }

  /**
   * Generate system prompt with persona context
   */
  static generateSystemPrompt(persona: PrismaPersona): string {
    const basePrompt = persona.systemPrompt;
    const schedule = this.getPostingSchedule(persona);

    const personalityContext = `
You are ${persona.name} (@${persona.handle}), a ${persona.personaType.toLowerCase()} with the following characteristics:

Bio: ${persona.bio}

Personality Traits: ${persona.personalityTraits.join(', ')}
Interests: ${persona.interests.join(', ')}
Expertise: ${persona.expertise.join(', ')}

Communication Style:
- Tone: ${persona.toneStyle}
- Controversy Tolerance: ${persona.controversyTolerance}/100
- Debate Aggression: ${persona.debateAggression}/100
- Engagement Frequency: ${persona.engagementFrequency}/100

Behavior Guidelines:
- Stay in character at all times
- Express opinions consistent with your political alignment
- Engage with topics related to your interests and expertise
- Respond in your designated tone style
- Keep posts under 280 characters
- Use relevant hashtags naturally

${basePrompt}
`;

    return personalityContext.trim();
  }

  /**
   * Get personas for scheduled posting
   */
  static async getPersonasForScheduledPost(): Promise<PrismaPersona[]> {
    const allPersonas = await this.getActive();

    return allPersonas.filter(persona => {
      const schedule = this.getPostingSchedule(persona);

      if (!schedule.enabled) {
        return false;
      }

      // Check if enough time has passed since last post
      // This would require tracking last post times in a real implementation
      return this.isActiveNow(persona);
    });
  }

  /**
   * Get engagement statistics for a persona
   */
  static async getEngagementStats(personaId: string, days: number = 30): Promise<{
    totalPosts: number;
    totalLikes: number;
    totalReposts: number;
    totalReplies: number;
    averageEngagement: number;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const posts = await prisma.post.findMany({
      where: {
        personaId,
        publishedAt: {
          gte: startDate,
        },
      },
      include: {
        _count: {
          select: {
            reactions: true,
            replies: true,
            reposts: true,
          },
        },
      },
    });

    const totalPosts = posts.length;
    const totalLikes = posts.reduce((sum, post) => sum + post.likeCount, 0);
    const totalReposts = posts.reduce((sum, post) => sum + post.repostCount, 0);
    const totalReplies = posts.reduce((sum, post) => sum + post.commentCount, 0);

    const totalEngagement = totalLikes + totalReposts + totalReplies;
    const averageEngagement = totalPosts > 0 ? totalEngagement / totalPosts : 0;

    return {
      totalPosts,
      totalLikes,
      totalReposts,
      totalReplies,
      averageEngagement: Math.round(averageEngagement * 100) / 100,
    };
  }
}

export default PersonaModel;
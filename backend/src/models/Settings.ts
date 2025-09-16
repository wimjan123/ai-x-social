import { z } from 'zod';
import {
  Settings as PrismaSettings,
  NewsCategory,
  ToneStyle,
  NotificationCategory,
  ProfileVisibility,
  Theme,
  Prisma
} from '../generated/prisma';
import type { PrismaClient } from '../generated/prisma';

// ============================================================================
// ENUMS (Re-exported from Prisma)
// ============================================================================

export { 
  NewsCategory, 
  ToneStyle, 
  NotificationCategory, 
  ProfileVisibility, 
  Theme 
} from '../generated/prisma';

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

export const NewsCategorySchema = z.nativeEnum(NewsCategory);
export const ToneStyleSchema = z.nativeEnum(ToneStyle);
export const NotificationCategorySchema = z.nativeEnum(NotificationCategory);
export const ProfileVisibilitySchema = z.nativeEnum(ProfileVisibility);
export const ThemeSchema = z.nativeEnum(Theme);

export const SettingsCreateSchema = z.object({
  userId: z.string().cuid(),
  
  // News preferences
  newsRegion: z.string().max(10).default('WORLDWIDE'),
  newsCategories: z.array(NewsCategorySchema).default([]),
  newsLanguages: z.array(z.string().length(2)).default(['en']),
  
  // AI interaction preferences
  aiChatterLevel: z.number().int().min(0).max(100).default(50),
  aiPersonalities: z.array(z.string().max(30)).default([]),
  aiResponseTone: ToneStyleSchema.default(ToneStyle.PROFESSIONAL),
  
  // Notification preferences
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  notificationCategories: z.array(NotificationCategorySchema).default([
    NotificationCategory.MENTIONS,
    NotificationCategory.REPLIES
  ]),
  
  // Privacy settings
  profileVisibility: ProfileVisibilitySchema.default(ProfileVisibility.PUBLIC),
  allowPersonaInteractions: z.boolean().default(true),
  allowDataForAI: z.boolean().default(true),
  
  // Display preferences
  theme: ThemeSchema.default(Theme.AUTO),
  language: z.string().length(2).default('en'),
  timezone: z.string().max(50).default('UTC'),
  
  // API configuration (for power users)
  customAIApiKey: z.string().max(512).nullable().optional(),
  customAIBaseUrl: z.string().url().max(512).nullable().optional()
});

export const SettingsUpdateSchema = SettingsCreateSchema.partial().omit({
  userId: true // User ID should not be updatable
});

export const SettingsQuerySchema = z.object({
  userId: z.string().cuid().optional(),
  theme: ThemeSchema.optional(),
  profileVisibility: ProfileVisibilitySchema.optional(),
  newsRegion: z.string().max(10).optional(),
  hasCustomAI: z.boolean().optional() // Whether user has custom AI config
});

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================

export interface SettingsBase extends PrismaSettings {}

export interface SettingsWithUser extends PrismaSettings {
  user?: any;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  categories: NotificationCategory[];
  quietHours?: {
    start: string; // HH:MM format
    end: string;   // HH:MM format
    timezone: string;
  };
}

export interface NewsPreferences {
  region: string;
  categories: NewsCategory[];
  languages: string[];
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  sources?: string[]; // Preferred news sources
}

export interface AIPreferences {
  chatterLevel: number;
  personalities: string[];
  responseTone: ToneStyle;
  customApiKey?: string;
  customBaseUrl?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface PrivacyPreferences {
  profileVisibility: ProfileVisibility;
  allowPersonaInteractions: boolean;
  allowDataForAI: boolean;
  shareAnalytics: boolean;
  allowTargetedContent: boolean;
}

export interface DisplayPreferences {
  theme: Theme;
  language: string;
  timezone: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  fontSize: 'small' | 'medium' | 'large';
}

export interface SettingsDefaults {
  news: NewsPreferences;
  notifications: NotificationPreferences;
  ai: AIPreferences;
  privacy: PrivacyPreferences;
  display: DisplayPreferences;
}

// ============================================================================
// BUSINESS LOGIC CLASS
// ============================================================================

export class SettingsModel {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create settings for a new user with sensible defaults
   */
  async create(data: z.infer<typeof SettingsCreateSchema>): Promise<SettingsBase> {
    const validated = SettingsCreateSchema.parse(data);

    return this.prisma.settings.create({
      data: validated as Prisma.SettingsCreateInput
    });
  }

  /**
   * Create default settings for a new user
   */
  async createDefaults(userId: string, userLocale?: string): Promise<SettingsBase> {
    const defaults = this.getDefaultSettings(userLocale);
    
    return this.create({
      userId,
      ...defaults
    });
  }

  /**
   * Update user settings
   */
  async update(userId: string, data: z.infer<typeof SettingsUpdateSchema>): Promise<SettingsBase> {
    const validated = SettingsUpdateSchema.parse(data);

    return this.prisma.settings.update({
      where: { userId },
      data: validated as Prisma.SettingsUpdateInput
    });
  }

  /**
   * Get settings by user ID
   */
  async findByUserId(userId: string): Promise<SettingsBase | null> {
    return this.prisma.settings.findUnique({
      where: { userId }
    });
  }

  /**
   * Get settings by user ID with user relation
   */
  async findByUserIdWithUser(userId: string): Promise<SettingsWithUser | null> {
    return this.prisma.settings.findUnique({
      where: { userId },
      include: { user: true }
    });
  }

  /**
   * Get or create settings for a user
   */
  async findOrCreate(userId: string, userLocale?: string): Promise<SettingsBase> {
    const existing = await this.findByUserId(userId);
    
    if (existing) {
      return existing;
    }
    
    return this.createDefaults(userId, userLocale);
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(
    userId: string, 
    preferences: Partial<NotificationPreferences>
  ): Promise<SettingsBase> {
    const updateData: any = {};
    
    if (preferences.email !== undefined) {
      updateData.emailNotifications = preferences.email;
    }
    if (preferences.push !== undefined) {
      updateData.pushNotifications = preferences.push;
    }
    if (preferences.categories) {
      updateData.notificationCategories = preferences.categories;
    }
    
    return this.update(userId, updateData);
  }

  /**
   * Update news preferences
   */
  async updateNewsPreferences(
    userId: string, 
    preferences: Partial<NewsPreferences>
  ): Promise<SettingsBase> {
    const updateData: any = {};
    
    if (preferences.region) {
      updateData.newsRegion = preferences.region;
    }
    if (preferences.categories) {
      updateData.newsCategories = preferences.categories;
    }
    if (preferences.languages) {
      updateData.newsLanguages = preferences.languages;
    }
    
    return this.update(userId, updateData);
  }

  /**
   * Update AI preferences
   */
  async updateAIPreferences(
    userId: string, 
    preferences: Partial<AIPreferences>
  ): Promise<SettingsBase> {
    const updateData: any = {};
    
    if (preferences.chatterLevel !== undefined) {
      updateData.aiChatterLevel = preferences.chatterLevel;
    }
    if (preferences.personalities) {
      updateData.aiPersonalities = preferences.personalities;
    }
    if (preferences.responseTone) {
      updateData.aiResponseTone = preferences.responseTone;
    }
    if (preferences.customApiKey !== undefined) {
      updateData.customAIApiKey = preferences.customApiKey;
    }
    if (preferences.customBaseUrl !== undefined) {
      updateData.customAIBaseUrl = preferences.customBaseUrl;
    }
    
    return this.update(userId, updateData);
  }

  /**
   * Update privacy preferences
   */
  async updatePrivacyPreferences(
    userId: string, 
    preferences: Partial<PrivacyPreferences>
  ): Promise<SettingsBase> {
    const updateData: any = {};
    
    if (preferences.profileVisibility) {
      updateData.profileVisibility = preferences.profileVisibility;
    }
    if (preferences.allowPersonaInteractions !== undefined) {
      updateData.allowPersonaInteractions = preferences.allowPersonaInteractions;
    }
    if (preferences.allowDataForAI !== undefined) {
      updateData.allowDataForAI = preferences.allowDataForAI;
    }
    
    return this.update(userId, updateData);
  }

  /**
   * Update display preferences
   */
  async updateDisplayPreferences(
    userId: string, 
    preferences: Partial<DisplayPreferences>
  ): Promise<SettingsBase> {
    const updateData: any = {};
    
    if (preferences.theme) {
      updateData.theme = preferences.theme;
    }
    if (preferences.language) {
      updateData.language = preferences.language;
    }
    if (preferences.timezone) {
      updateData.timezone = preferences.timezone;
    }
    
    return this.update(userId, updateData);
  }

  /**
   * Reset settings to defaults
   */
  async resetToDefaults(userId: string, userLocale?: string): Promise<SettingsBase> {
    const defaults = this.getDefaultSettings(userLocale);
    
    return this.update(userId, defaults);
  }

  /**
   * Delete user settings
   */
  async delete(userId: string): Promise<void> {
    await this.prisma.settings.delete({
      where: { userId }
    });
  }

  /**
   * Check if user has custom AI configuration
   */
  async hasCustomAI(userId: string): Promise<boolean> {
    const settings = await this.findByUserId(userId);
    return !!(settings?.customAIApiKey || settings?.customAIBaseUrl);
  }

  /**
   * Get users with specific settings criteria
   */
  async findUsersWithCriteria(criteria: {
    theme?: Theme;
    profileVisibility?: ProfileVisibility;
    newsRegion?: string;
    allowPersonaInteractions?: boolean;
    hasCustomAI?: boolean;
  }): Promise<SettingsBase[]> {
    const where: any = {};
    
    if (criteria.theme) where.theme = criteria.theme;
    if (criteria.profileVisibility) where.profileVisibility = criteria.profileVisibility;
    if (criteria.newsRegion) where.newsRegion = criteria.newsRegion;
    if (criteria.allowPersonaInteractions !== undefined) {
      where.allowPersonaInteractions = criteria.allowPersonaInteractions;
    }
    
    if (criteria.hasCustomAI !== undefined) {
      if (criteria.hasCustomAI) {
        where.OR = [
          { customAIApiKey: { not: null } },
          { customAIBaseUrl: { not: null } }
        ];
      } else {
        where.AND = [
          { customAIApiKey: null },
          { customAIBaseUrl: null }
        ];
      }
    }
    
    return this.prisma.settings.findMany({ where });
  }

  /**
   * Get settings statistics
   */
  async getStats() {
    const [total, themes, visibility, regions, customAI] = await Promise.all([
      this.prisma.settings.count(),
      this.prisma.settings.groupBy({
        by: ['theme'],
        _count: true
      }),
      this.prisma.settings.groupBy({
        by: ['profileVisibility'],
        _count: true
      }),
      this.prisma.settings.groupBy({
        by: ['newsRegion'],
        _count: true
      }),
      this.prisma.settings.count({
        where: {
          OR: [
            { customAIApiKey: { not: null } },
            { customAIBaseUrl: { not: null } }
          ]
        }
      })
    ]);

    return {
      total,
      customAIUsers: customAI,
      themes: Object.fromEntries(
        themes.map(item => [item.theme, item._count])
      ),
      profileVisibility: Object.fromEntries(
        visibility.map(item => [item.profileVisibility, item._count])
      ),
      newsRegions: Object.fromEntries(
        regions.map(item => [item.newsRegion, item._count])
      )
    };
  }

  /**
   * Get default settings based on user locale
   */
  private getDefaultSettings(userLocale?: string): Omit<z.infer<typeof SettingsCreateSchema>, 'userId'> {
    const locale = userLocale || 'en-US';
    const [language, region] = locale.split('-');
    
    return {
      // News preferences
      newsRegion: region?.toUpperCase() || 'WORLDWIDE',
      newsCategories: [
        NewsCategory.POLITICS,
        NewsCategory.TECHNOLOGY,
        NewsCategory.WORLD
      ],
      newsLanguages: [language?.toLowerCase() || 'en'],
      
      // AI interaction preferences
      aiChatterLevel: 50,
      aiPersonalities: [],
      aiResponseTone: ToneStyle.PROFESSIONAL,
      
      // Notification preferences
      emailNotifications: true,
      pushNotifications: true,
      notificationCategories: [
        NotificationCategory.MENTIONS,
        NotificationCategory.REPLIES,
        NotificationCategory.FOLLOWERS
      ],
      
      // Privacy settings
      profileVisibility: ProfileVisibility.PUBLIC,
      allowPersonaInteractions: true,
      allowDataForAI: true,
      
      // Display preferences
      theme: Theme.AUTO,
      language: language?.toLowerCase() || 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      
      // API configuration
      customAIApiKey: null,
      customAIBaseUrl: null
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate timezone string
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get timezone offset in hours
 */
export function getTimezoneOffset(timezone: string): number {
  try {
    const now = new Date();
    const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    const tz = new Date(utc.toLocaleString('en-US', { timeZone: timezone }));
    return (tz.getTime() - utc.getTime()) / (1000 * 60 * 60);
  } catch {
    return 0;
  }
}

/**
 * Convert locale to region code
 */
export function localeToRegion(locale: string): string {
  const regionMap: Record<string, string> = {
    'en-US': 'US',
    'en-GB': 'GB',
    'en-CA': 'CA',
    'en-AU': 'AU',
    'fr-FR': 'FR',
    'de-DE': 'DE',
    'es-ES': 'ES',
    'it-IT': 'IT',
    'ja-JP': 'JP',
    'ko-KR': 'KR',
    'zh-CN': 'CN',
    'pt-BR': 'BR',
    'ru-RU': 'RU',
    'ar-SA': 'SA',
    'hi-IN': 'IN'
  };
  
  return regionMap[locale] || 'WORLDWIDE';
}

/**
 * Get supported languages
 */
export function getSupportedLanguages(): Array<{ code: string; name: string }> {
  return [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'zh', name: '中文' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' }
  ];
}

/**
 * Get supported regions
 */
export function getSupportedRegions(): Array<{ code: string; name: string }> {
  return [
    { code: 'WORLDWIDE', name: 'Worldwide' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' },
    { code: 'CN', name: 'China' },
    { code: 'BR', name: 'Brazil' },
    { code: 'RU', name: 'Russia' },
    { code: 'IN', name: 'India' },
    { code: 'SA', name: 'Saudi Arabia' }
  ];
}

/**
 * Validate AI chatter level and return description
 */
export function getChatterLevelDescription(level: number): string {
  if (level < 0 || level > 100) {
    throw new Error('Chatter level must be between 0 and 100');
  }
  
  if (level === 0) return 'Silent - No AI interactions';
  if (level <= 20) return 'Minimal - Very rare interactions';
  if (level <= 40) return 'Low - Occasional interactions';
  if (level <= 60) return 'Medium - Regular interactions';
  if (level <= 80) return 'High - Frequent interactions';
  return 'Maximum - Constant AI chatter';
}

/**
 * Get notification category descriptions
 */
export function getNotificationCategoryDescriptions(): Record<NotificationCategory, string> {
  return {
    [NotificationCategory.MENTIONS]: 'When someone mentions you in a post',
    [NotificationCategory.REPLIES]: 'When someone replies to your posts',
    [NotificationCategory.LIKES]: 'When someone likes your posts',
    [NotificationCategory.REPOSTS]: 'When someone reposts your content',
    [NotificationCategory.FOLLOWERS]: 'When someone follows you',
    [NotificationCategory.NEWS_ALERTS]: 'Breaking news and important updates',
    [NotificationCategory.PERSONA_INTERACTIONS]: 'When AI personas interact with you'
  };
}

/**
 * Check if settings allow specific interaction
 */
export function canInteract(
  settings: SettingsBase,
  interactionType: 'persona' | 'data_ai' | 'public_profile'
): boolean {
  switch (interactionType) {
    case 'persona':
      return settings.allowPersonaInteractions;
    case 'data_ai':
      return settings.allowDataForAI;
    case 'public_profile':
      return settings.profileVisibility === ProfileVisibility.PUBLIC;
    default:
      return false;
  }
}

export default SettingsModel;

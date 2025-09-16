// Database Models Index
// Export all database models and their types

export { default as NewsItemModel } from './NewsItem';
export type {
  NewsItemBase,
  NewsItemWithRelations,
  NewsSearchOptions,
  NewsAnalysis
} from './NewsItem';
export {
  NewsItemCreateSchema,
  NewsItemUpdateSchema,
  NewsItemQuerySchema,
  extractKeywords,
  calculateImpactScore,
  calculateControversyScore,
  buildSearchIndex,
  fuzzySearch
} from './NewsItem';

export { default as TrendModel } from './Trend';
export type {
  TrendBase,
  TrendWithRelations,
  TrendMetrics,
  TrendSearchOptions,
  TrendLifecycle,
  TrendEngagement
} from './Trend';
export {
  TrendCreateSchema,
  TrendUpdateSchema,
  TrendQuerySchema,
  calculateVelocity,
  detectTrendingTopic,
  extractHashtags,
  classifyTrendCategory,
  calculateSustainabilityScore
} from './Trend';

export { default as SettingsModel } from './Settings';
export type {
  SettingsBase,
  SettingsWithUser,
  NotificationPreferences,
  NewsPreferences,
  AIPreferences,
  PrivacyPreferences,
  DisplayPreferences,
  SettingsDefaults
} from './Settings';
export {
  SettingsCreateSchema,
  SettingsUpdateSchema,
  SettingsQuerySchema,
  isValidTimezone,
  getTimezoneOffset,
  localeToRegion,
  getSupportedLanguages,
  getSupportedRegions,
  getChatterLevelDescription,
  getNotificationCategoryDescriptions,
  canInteract
} from './Settings';

// Re-export common Prisma types and enums
export {
  NewsCategory,
  TrendCategory,
  NotificationCategory,
  ProfileVisibility,
  Theme,
  ToneStyle,
  Prisma
} from '../generated/prisma';
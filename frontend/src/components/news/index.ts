// News Components - AI Social Media Platform
// Export all news-related components for easy importing

export { NewsFeed } from './NewsFeed';
export { NewsCard } from './NewsCard';
export { NewsFilters } from './NewsFilters';
export { NewsSearch } from './NewsSearch';
export { TrendingNews } from './TrendingNews';
export { NewsDetail } from './NewsDetail';
export { PersonaReactions } from './PersonaReactions';
export { RegionalNewsToggle } from './RegionalNewsToggle';

// Re-export types that might be needed by consumers
export type {
  NewsArticle,
  TrendingTopic,
  AIPersona,
  PoliticalAlignment,
} from '@/types';

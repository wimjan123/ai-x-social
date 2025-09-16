import { v4 as uuidv4 } from 'uuid';

/**
 * Helper functions for creating test news items in contract tests
 * These functions will initially fail as no implementation exists yet
 */

export interface TestNewsItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  sourceName: string;
  sourceUrl?: string;
  author?: string;
  category: NewsCategory;
  topics?: string[];
  keywords?: string[];
  entities?: string[];
  country?: string;
  region?: string;
  language?: string;
  sentimentScore?: number;
  impactScore?: number;
  controversyScore?: number;
  publishedAt: Date;
  discoveredAt?: Date;
  createdAt: Date;
  aiSummary?: string;
  topicTags?: string[];
}

export type NewsCategory =
  | 'POLITICS'
  | 'BUSINESS'
  | 'TECHNOLOGY'
  | 'SPORTS'
  | 'ENTERTAINMENT'
  | 'HEALTH'
  | 'SCIENCE'
  | 'WORLD'
  | 'LOCAL';

export const createTestNewsItem = async (overrides: Partial<TestNewsItem> = {}): Promise<TestNewsItem> => {
  const newsId = uuidv4();
  const now = new Date();

  const defaultNewsItem: TestNewsItem = {
    id: newsId,
    title: 'Test News Article',
    description: 'This is a test news article for contract testing',
    content: 'Full content of the test news article with more details and context.',
    url: `https://news.example.com/article/${newsId}`,
    sourceName: 'Test News Source',
    sourceUrl: 'https://news.example.com',
    author: 'Test Reporter',
    category: 'POLITICS',
    topics: ['politics', 'government', 'policy'],
    keywords: ['test', 'news', 'politics'],
    entities: ['Government', 'Policy', 'Legislature'],
    country: 'US',
    region: 'North America',
    language: 'en',
    sentimentScore: 0.0,
    impactScore: 50.0,
    controversyScore: 25.0,
    publishedAt: new Date(now.getTime() - 3600000), // 1 hour ago
    discoveredAt: new Date(now.getTime() - 1800000), // 30 minutes ago
    createdAt: now,
    aiSummary: 'AI-generated summary of the test news article highlighting key points.',
    topicTags: ['breaking-news', 'political-update']
  };

  const newsData = { ...defaultNewsItem, ...overrides };

  // This will fail initially as no database/prisma implementation exists
  // The test should expect this failure and validate the API contract
  try {
    // In real implementation, this would be:
    // return await prisma.newsItem.create({
    //   data: {
    //     id: newsData.id,
    //     title: newsData.title,
    //     description: newsData.description,
    //     content: newsData.content,
    //     url: newsData.url,
    //     sourceName: newsData.sourceName,
    //     sourceUrl: newsData.sourceUrl,
    //     author: newsData.author,
    //     category: newsData.category,
    //     topics: newsData.topics,
    //     keywords: newsData.keywords,
    //     entities: newsData.entities,
    //     country: newsData.country,
    //     region: newsData.region,
    //     language: newsData.language,
    //     sentimentScore: newsData.sentimentScore,
    //     impactScore: newsData.impactScore,
    //     controversyScore: newsData.controversyScore,
    //     publishedAt: newsData.publishedAt,
    //     discoveredAt: newsData.discoveredAt,
    //     aiSummary: newsData.aiSummary,
    //     topicTags: newsData.topicTags
    //   }
    // });

    return newsData;
  } catch (error) {
    throw new Error(`Failed to create test news item: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const createBreakingNews = async (
  title: string,
  description: string,
  overrides: Partial<TestNewsItem> = {}
): Promise<TestNewsItem> => {
  return createTestNewsItem({
    title: `BREAKING: ${title}`,
    description,
    impactScore: 90.0,
    controversyScore: 60.0,
    topicTags: ['breaking-news', 'urgent'],
    publishedAt: new Date(), // Just published
    ...overrides
  });
};

export const createPoliticalNews = async (
  title: string,
  description: string,
  overrides: Partial<TestNewsItem> = {}
): Promise<TestNewsItem> => {
  return createTestNewsItem({
    title,
    description,
    category: 'POLITICS',
    topics: ['politics', 'government', 'policy', 'election'],
    keywords: ['political', 'government', 'policy', 'debate'],
    entities: ['Congress', 'Senate', 'House', 'President'],
    controversyScore: 70.0,
    topicTags: ['political-news', 'policy-update'],
    ...overrides
  });
};

export const createTechNews = async (
  title: string,
  description: string,
  overrides: Partial<TestNewsItem> = {}
): Promise<TestNewsItem> => {
  return createTestNewsItem({
    title,
    description,
    category: 'TECHNOLOGY',
    topics: ['technology', 'innovation', 'ai', 'software'],
    keywords: ['tech', 'innovation', 'digital', 'ai'],
    entities: ['Tech Companies', 'Silicon Valley', 'AI'],
    controversyScore: 20.0,
    impactScore: 70.0,
    topicTags: ['tech-news', 'innovation'],
    ...overrides
  });
};

export const createSportsNews = async (
  title: string,
  description: string,
  overrides: Partial<TestNewsItem> = {}
): Promise<TestNewsItem> => {
  return createTestNewsItem({
    title,
    description,
    category: 'SPORTS',
    topics: ['sports', 'competition', 'teams', 'athletes'],
    keywords: ['sports', 'game', 'team', 'championship'],
    entities: ['Teams', 'Athletes', 'Leagues'],
    controversyScore: 10.0,
    impactScore: 40.0,
    topicTags: ['sports-news', 'game-results'],
    ...overrides
  });
};

export const createMultipleNewsItems = async (
  count: number,
  category: NewsCategory = 'POLITICS'
): Promise<TestNewsItem[]> => {
  const newsItems: TestNewsItem[] = [];

  for (let i = 0; i < count; i++) {
    const item = await createTestNewsItem({
      title: `Test News Item ${i + 1}`,
      description: `Description for test news item ${i + 1}`,
      category,
      publishedAt: new Date(Date.now() - i * 3600000) // Stagger by hours
    });
    newsItems.push(item);
  }

  return newsItems;
};

export const createTrendingNews = async (
  topics: string[],
  impactThreshold: number = 80
): Promise<TestNewsItem[]> => {
  const trendingItems: TestNewsItem[] = [];

  for (let i = 0; i < topics.length; i++) {
    const item = await createTestNewsItem({
      title: `Trending: ${topics[i]} Dominates Headlines`,
      description: `Major developments in ${topics[i]} capture public attention`,
      topics: [topics[i].toLowerCase()],
      impactScore: impactThreshold + Math.random() * 20,
      controversyScore: 50 + Math.random() * 50,
      topicTags: ['trending', 'viral', topics[i].toLowerCase()],
      publishedAt: new Date(Date.now() - i * 1800000) // Stagger by 30 minutes
    });
    trendingItems.push(item);
  }

  return trendingItems;
};

export const validateNewsCategory = (category: string): category is NewsCategory => {
  return [
    'POLITICS', 'BUSINESS', 'TECHNOLOGY', 'SPORTS',
    'ENTERTAINMENT', 'HEALTH', 'SCIENCE', 'WORLD', 'LOCAL'
  ].includes(category);
};

export const validateNewsUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

export const validateSentimentScore = (score: number): boolean => {
  return score >= -1 && score <= 1;
};

export const validateImpactScore = (score: number): boolean => {
  return score >= 0 && score <= 100;
};

export const validateControversyScore = (score: number): boolean => {
  return score >= 0 && score <= 100;
};

// Mock news data for consistent testing
export const MOCK_NEWS = {
  BREAKING_POLITICAL: {
    title: 'BREAKING: Major Political Development',
    description: 'Significant political event occurs',
    category: 'POLITICS' as NewsCategory,
    impactScore: 95.0,
    controversyScore: 85.0
  },
  TECH_INNOVATION: {
    title: 'Revolutionary AI Technology Unveiled',
    description: 'New AI breakthrough changes industry',
    category: 'TECHNOLOGY' as NewsCategory,
    impactScore: 80.0,
    controversyScore: 30.0
  },
  SPORTS_CHAMPIONSHIP: {
    title: 'Championship Game Delivers Stunning Upset',
    description: 'Underdog team claims victory',
    category: 'SPORTS' as NewsCategory,
    impactScore: 60.0,
    controversyScore: 15.0
  },
  BUSINESS_MERGER: {
    title: 'Major Corporate Merger Announced',
    description: 'Industry giants combine forces',
    category: 'BUSINESS' as NewsCategory,
    impactScore: 70.0,
    controversyScore: 40.0
  },
  ENTERTAINMENT_SCANDAL: {
    title: 'Celebrity Scandal Rocks Entertainment World',
    description: 'High-profile controversy emerges',
    category: 'ENTERTAINMENT' as NewsCategory,
    impactScore: 50.0,
    controversyScore: 90.0
  }
} as const;

export const NEWS_CATEGORIES: NewsCategory[] = [
  'POLITICS', 'BUSINESS', 'TECHNOLOGY', 'SPORTS',
  'ENTERTAINMENT', 'HEALTH', 'SCIENCE', 'WORLD', 'LOCAL'
];

export const generateNewsTestData = (categoryCount: number, itemsPerCategory: number) => {
  const testData: Array<{
    title: string;
    description: string;
    category: NewsCategory;
    publishedAt: Date;
  }> = [];

  for (let c = 0; c < categoryCount && c < NEWS_CATEGORIES.length; c++) {
    const category = NEWS_CATEGORIES[c];
    for (let i = 0; i < itemsPerCategory; i++) {
      testData.push({
        title: `${category} News Item ${i + 1}`,
        description: `Test description for ${category.toLowerCase()} news ${i + 1}`,
        category,
        publishedAt: new Date(Date.now() - (c * itemsPerCategory + i) * 3600000)
      });
    }
  }

  return testData;
};

export const simulateNewsImpact = (
  baseNews: TestNewsItem[],
  viralFactor: number = 3
): TestNewsItem[] => {
  return baseNews.map(item => ({
    ...item,
    impactScore: Math.min(100, (item.impactScore || 50) * viralFactor),
    topicTags: [...(item.topicTags || []), 'viral', 'trending']
  }));
};
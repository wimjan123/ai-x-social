// NewsService: Multi-source news aggregation with deduplication and sentiment analysis
// Implements research.md:137-158 specifications and FR-007 regional filtering

import { z } from 'zod';
import { NewsItem as PrismaNewsItem, NewsCategory } from '../generated/prisma';
import { prisma } from '../lib/database';
import { redis } from '../lib/redis';


// News source configuration from research.md:118-123
interface NewsSource {
  name: string;
  apiKey?: string;
  baseUrl: string;
  isActive: boolean;
  rateLimit: {
    requests: number;
    period: string; // '1h', '1d', etc.
  };
}

interface RawNewsItem {
  title: string;
  description: string;
  content?: string;
  url: string;
  sourceName: string;
  sourceUrl: string;
  author?: string;
  publishedAt: Date;
  category?: string;
  imageUrl?: string;
  country?: string;
  language: string;
}

interface NewsSearchOptions {
  category?: NewsCategory;
  country?: string;
  language?: string;
  sources?: string[];
  keywords?: string[];
  limit?: number;
  fromDate?: Date;
  toDate?: Date;
}

interface NewsAggregationResult {
  articles: PrismaNewsItem[];
  sources: string[];
  totalFetched: number;
  duplicatesRemoved: number;
  cached: boolean;
}

export class NewsService {
  private static readonly CACHE_TTL = 300; // 5 minutes cache for news
  private static readonly DEDUP_THRESHOLD = 0.85; // Similarity threshold for deduplication
  private static readonly MAX_CONTENT_LENGTH = 10000;

  private static sources: NewsSource[] = [
    {
      name: 'NewsAPI',
      apiKey: process.env.NEWSAPI_KEY,
      baseUrl: 'https://newsapi.org/v2',
      isActive: !!process.env.NEWSAPI_KEY,
      rateLimit: { requests: 1000, period: '1d' }
    },
    {
      name: 'Guardian',
      apiKey: process.env.GUARDIAN_API_KEY,
      baseUrl: 'https://content.guardianapis.com',
      isActive: !!process.env.GUARDIAN_API_KEY,
      rateLimit: { requests: 5000, period: '1d' }
    },
    {
      name: 'GNews',
      apiKey: process.env.GNEWS_API_KEY,
      baseUrl: 'https://gnews.io/api/v4',
      isActive: !!process.env.GNEWS_API_KEY,
      rateLimit: { requests: 100, period: '1d' }
    }
  ];

  /**
   * Aggregate news from multiple sources with deduplication
   */
  static async aggregateNews(options: NewsSearchOptions = {}): Promise<NewsAggregationResult> {
    const cacheKey = `news:${JSON.stringify(options)}`;

    // Check cache first
    const cached = await redis.get<NewsAggregationResult>(cacheKey);
    if (cached) {
      cached.cached = true;
      return cached;
    }

    const activeSources = this.sources.filter(source => source.isActive);
    if (activeSources.length === 0) {
      throw new Error('No active news sources configured');
    }

    const allArticles: RawNewsItem[] = [];
    let totalFetched = 0;

    // Fetch from all active sources in parallel
    const fetchPromises = activeSources.map(async (source) => {
      try {
        const articles = await this.fetchFromSource(source, options);
        totalFetched += articles.length;
        return articles;
      } catch (error) {
        console.error(`Failed to fetch from ${source.name}:`, error);
        return [];
      }
    });

    const sourceResults = await Promise.allSettled(fetchPromises);

    // Combine all successful results
    sourceResults.forEach(result => {
      if (result.status === 'fulfilled') {
        allArticles.push(...result.value);
      }
    });

    // Deduplicate articles
    const { deduplicated, duplicatesRemoved } = await this.deduplicateArticles(allArticles);

    // Process and enrich articles
    const processedArticles = await Promise.all(
      deduplicated.map(article => this.processAndStoreArticle(article))
    );

    const result: NewsAggregationResult = {
      articles: processedArticles,
      sources: activeSources.map(s => s.name),
      totalFetched,
      duplicatesRemoved,
      cached: false
    };

    // Cache the result
    await redis.set(cacheKey, result, { ttl: this.CACHE_TTL });

    return result;
  }

  /**
   * Fetch news from a specific source
   */
  private static async fetchFromSource(source: NewsSource, options: NewsSearchOptions): Promise<RawNewsItem[]> {
    // Check rate limit
    const rateLimitKey = `rate_limit:${source.name}`;
    const currentCount = await redis.get<string>(rateLimitKey, false);

    if (currentCount && parseInt(currentCount) >= source.rateLimit.requests) {
      console.warn(`Rate limit exceeded for ${source.name}`);
      return [];
    }

    let articles: RawNewsItem[] = [];

    switch (source.name) {
      case 'NewsAPI':
        articles = await this.fetchFromNewsAPI(source, options);
        break;
      case 'Guardian':
        articles = await this.fetchFromGuardian(source, options);
        break;
      case 'GNews':
        articles = await this.fetchFromGNews(source, options);
        break;
      default:
        console.warn(`Unknown source: ${source.name}`);
        return [];
    }

    // Update rate limit counter
    const period = source.rateLimit.period;
    const ttl = period === '1h' ? 3600 : period === '1d' ? 86400 : 3600;
    await redis.incr(rateLimitKey, ttl);

    return articles;
  }

  /**
   * Fetch from NewsAPI
   */
  private static async fetchFromNewsAPI(source: NewsSource, options: NewsSearchOptions): Promise<RawNewsItem[]> {
    const params = new URLSearchParams({
      apiKey: source.apiKey!,
      pageSize: (options.limit || 50).toString(),
      sortBy: 'publishedAt',
      language: options.language || 'en'
    });

    if (options.category) {
      params.append('category', options.category.toLowerCase());
    }
    if (options.country) {
      params.append('country', options.country.toLowerCase());
    }
    if (options.keywords?.length) {
      params.append('q', options.keywords.join(' OR '));
    }
    if (options.fromDate) {
      params.append('from', options.fromDate.toISOString());
    }

    const response = await fetch(`${source.baseUrl}/top-headlines?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${data.message}`);
    }

    return data.articles.map((article: any): RawNewsItem => ({
      title: article.title,
      description: article.description || '',
      content: article.content,
      url: article.url,
      sourceName: article.source.name,
      sourceUrl: source.baseUrl,
      author: article.author,
      publishedAt: new Date(article.publishedAt),
      imageUrl: article.urlToImage,
      language: options.language || 'en',
      country: options.country
    }));
  }

  /**
   * Fetch from The Guardian API
   */
  private static async fetchFromGuardian(source: NewsSource, options: NewsSearchOptions): Promise<RawNewsItem[]> {
    const params = new URLSearchParams({
      'api-key': source.apiKey!,
      'page-size': (options.limit || 50).toString(),
      'order-by': 'newest',
      'show-fields': 'body,byline,thumbnail'
    });

    if (options.keywords?.length) {
      params.append('q', options.keywords.join(' AND '));
    }
    if (options.fromDate) {
      params.append('from-date', options.fromDate.toISOString().split('T')[0]);
    }

    const response = await fetch(`${source.baseUrl}/search?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Guardian API error: ${data.message}`);
    }

    return data.response.results.map((article: any): RawNewsItem => ({
      title: article.webTitle,
      description: article.webTitle, // Guardian doesn't provide separate description
      content: article.fields?.body,
      url: article.webUrl,
      sourceName: 'The Guardian',
      sourceUrl: source.baseUrl,
      author: article.fields?.byline,
      publishedAt: new Date(article.webPublicationDate),
      imageUrl: article.fields?.thumbnail,
      language: 'en',
      category: this.mapGuardianSection(article.sectionName)
    }));
  }

  /**
   * Fetch from GNews API
   */
  private static async fetchFromGNews(source: NewsSource, options: NewsSearchOptions): Promise<RawNewsItem[]> {
    const params = new URLSearchParams({
      token: source.apiKey!,
      max: (options.limit || 50).toString(),
      lang: options.language || 'en'
    });

    if (options.country) {
      params.append('country', options.country.toLowerCase());
    }
    if (options.keywords?.length) {
      params.append('q', options.keywords.join(' '));
    }

    const response = await fetch(`${source.baseUrl}/top-headlines?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`GNews API error: ${data.message}`);
    }

    return data.articles.map((article: any): RawNewsItem => ({
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      sourceName: article.source.name,
      sourceUrl: article.source.url,
      author: null, // GNews doesn't provide author info
      publishedAt: new Date(article.publishedAt),
      imageUrl: article.image,
      language: options.language || 'en',
      country: options.country
    }));
  }

  /**
   * Deduplicate articles using title similarity and URL matching
   */
  private static async deduplicateArticles(articles: RawNewsItem[]): Promise<{
    deduplicated: RawNewsItem[];
    duplicatesRemoved: number;
  }> {
    const seen = new Set<string>();
    const deduplicated: RawNewsItem[] = [];
    let duplicatesRemoved = 0;

    for (const article of articles) {
      const urlKey = this.normalizeUrl(article.url);
      const titleKey = this.normalizeTitle(article.title);

      // Check for exact URL match
      if (seen.has(urlKey)) {
        duplicatesRemoved++;
        continue;
      }

      // Check for similar titles
      let isDuplicate = false;
      for (const existing of deduplicated) {
        const similarity = this.calculateTitleSimilarity(article.title, existing.title);
        if (similarity > this.DEDUP_THRESHOLD) {
          isDuplicate = true;
          duplicatesRemoved++;
          break;
        }
      }

      if (!isDuplicate) {
        seen.add(urlKey);
        deduplicated.push(article);
      }
    }

    return { deduplicated, duplicatesRemoved };
  }

  /**
   * Process and store a single article with AI analysis
   */
  private static async processAndStoreArticle(article: RawNewsItem): Promise<PrismaNewsItem> {
    // Check if article already exists
    const existing = await prisma.newsItem.findFirst({
      where: {
        OR: [
          { url: article.url },
          {
            AND: [
              { title: article.title },
              { sourceName: article.sourceName }
            ]
          }
        ]
      }
    });

    if (existing) {
      return existing;
    }

    // Extract topics and entities using simple keyword analysis
    const topics = await this.extractTopics(article.title + ' ' + article.description);
    const keywords = await this.extractKeywords(article.title + ' ' + article.description);
    const entities = await this.extractEntities(article.title + ' ' + article.description);

    // Calculate sentiment score (-1 to 1)
    const sentimentScore = await this.analyzeSentiment(article.title + ' ' + article.description);

    // Calculate impact and controversy scores (0-100)
    const impactScore = this.calculateImpactScore(article);
    const controversyScore = this.calculateControversyScore(article, sentimentScore);

    // Categorize the article
    const category = this.categorizeArticle(article);

    // Generate AI summary if content is available
    const aiSummary = article.content ? await this.generateAISummary(article.content) : null;

    return await prisma.newsItem.create({
      data: {
        title: article.title,
        description: article.description,
        content: article.content?.substring(0, this.MAX_CONTENT_LENGTH) || null,
        url: article.url,
        sourceName: article.sourceName,
        sourceUrl: article.sourceUrl,
        author: article.author,
        category,
        topics,
        keywords,
        entities,
        country: article.country,
        language: article.language,
        sentimentScore,
        impactScore,
        controversyScore,
        publishedAt: article.publishedAt,
        discoveredAt: new Date(),
        aiSummary,
        topicTags: topics.slice(0, 10) // Limit to 10 topic tags
      }
    });
  }

  /**
   * Extract topics using simple keyword analysis
   */
  private static async extractTopics(text: string): Promise<string[]> {
    // Simple topic extraction based on common political/news keywords
    const politicalKeywords = [
      'election', 'vote', 'campaign', 'politics', 'government', 'congress',
      'senate', 'house', 'president', 'democracy', 'policy', 'law', 'bill'
    ];

    const businessKeywords = [
      'economy', 'market', 'stock', 'financial', 'business', 'trade',
      'economic', 'corporate', 'investment', 'bank', 'finance'
    ];

    const technologyKeywords = [
      'technology', 'tech', 'digital', 'ai', 'artificial intelligence',
      'software', 'computer', 'internet', 'cyber', 'data'
    ];

    const textLower = text.toLowerCase();
    const topics: string[] = [];

    if (politicalKeywords.some(keyword => textLower.includes(keyword))) {
      topics.push('politics');
    }
    if (businessKeywords.some(keyword => textLower.includes(keyword))) {
      topics.push('business');
    }
    if (technologyKeywords.some(keyword => textLower.includes(keyword))) {
      topics.push('technology');
    }

    return topics;
  }

  /**
   * Extract keywords using frequency analysis
   */
  private static async extractKeywords(text: string): Promise<string[]> {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'said', 'she', 'use', 'your', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were'].includes(word));

    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Extract named entities (simplified)
   */
  private static async extractEntities(text: string): Promise<string[]> {
    // Simple entity extraction - look for capitalized words that might be names/places
    const words = text.split(/\s+/);
    const entities: string[] = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i].replace(/[^\w]/g, '');
      if (word.length > 2 && word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase()) {
        // Check if it's part of a multi-word entity
        let entity = word;
        let j = i + 1;
        while (j < words.length && words[j].length > 0 && words[j][0] === words[j][0].toUpperCase()) {
          entity += ' ' + words[j].replace(/[^\w]/g, '');
          j++;
        }
        entities.push(entity);
        i = j - 1; // Skip the words we've already processed
      }
    }

    return [...new Set(entities)].slice(0, 20); // Deduplicate and limit
  }

  /**
   * Analyze sentiment (simplified implementation)
   */
  private static async analyzeSentiment(text: string): Promise<number> {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'positive', 'success', 'win', 'victory', 'improve'];
    const negativeWords = ['bad', 'terrible', 'awful', 'negative', 'fail', 'failure', 'lose', 'defeat', 'crisis', 'problem'];

    const textLower = text.toLowerCase();
    let score = 0;

    positiveWords.forEach(word => {
      const matches = (textLower.match(new RegExp(word, 'g')) || []).length;
      score += matches * 0.1;
    });

    negativeWords.forEach(word => {
      const matches = (textLower.match(new RegExp(word, 'g')) || []).length;
      score -= matches * 0.1;
    });

    // Normalize to -1 to 1 range
    return Math.max(-1, Math.min(1, score));
  }

  /**
   * Calculate impact score based on article characteristics
   */
  private static calculateImpactScore(article: RawNewsItem): number {
    let score = 50; // Base score

    // Source reputation impact
    const highImpactSources = ['Reuters', 'Associated Press', 'BBC', 'The Guardian', 'CNN', 'The New York Times'];
    if (highImpactSources.some(source => article.sourceName.includes(source))) {
      score += 20;
    }

    // Recency impact (more recent = higher impact)
    const hoursAgo = (Date.now() - article.publishedAt.getTime()) / (1000 * 60 * 60);
    if (hoursAgo < 1) score += 20;
    else if (hoursAgo < 6) score += 10;
    else if (hoursAgo < 24) score += 5;

    // Content length impact
    if (article.content && article.content.length > 1000) {
      score += 10;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate controversy score based on sentiment and keywords
   */
  private static calculateControversyScore(article: RawNewsItem, sentiment: number): number {
    let score = 0;

    // High controversy keywords
    const controversyKeywords = [
      'scandal', 'controversy', 'protest', 'riot', 'conflict', 'war',
      'corruption', 'investigation', 'lawsuit', 'trial', 'impeach'
    ];

    const text = (article.title + ' ' + article.description).toLowerCase();
    controversyKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 20;
      }
    });

    // Extreme sentiment indicates controversy
    const sentimentExtremity = Math.abs(sentiment);
    score += sentimentExtremity * 30;

    return Math.min(100, score);
  }

  /**
   * Categorize article based on content
   */
  private static categorizeArticle(article: RawNewsItem): NewsCategory {
    const text = (article.title + ' ' + article.description).toLowerCase();

    if (text.match(/politic|election|government|congress|senate|president|vote|campaign/)) {
      return NewsCategory.POLITICS;
    }
    if (text.match(/business|economy|market|financial|trade|stock|corporate/)) {
      return NewsCategory.BUSINESS;
    }
    if (text.match(/technology|tech|digital|ai|software|cyber|computer/)) {
      return NewsCategory.TECHNOLOGY;
    }
    if (text.match(/sports|game|team|player|championship|league/)) {
      return NewsCategory.SPORTS;
    }
    if (text.match(/entertainment|movie|music|celebrity|film|show|star/)) {
      return NewsCategory.ENTERTAINMENT;
    }
    if (text.match(/health|medical|doctor|hospital|disease|treatment/)) {
      return NewsCategory.HEALTH;
    }
    if (text.match(/science|research|study|scientist|discovery|experiment/)) {
      return NewsCategory.SCIENCE;
    }
    if (text.match(/international|world|global|foreign|country|nation/)) {
      return NewsCategory.WORLD;
    }

    return NewsCategory.LOCAL; // Default category
  }

  /**
   * Generate AI summary (placeholder for actual AI integration)
   */
  private static async generateAISummary(content: string): Promise<string | null> {
    // This would integrate with an AI service like Claude or GPT
    // For now, return a simple truncated summary
    if (content.length <= 200) return content;

    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const summary = sentences.slice(0, 3).join('. ') + '.';

    return summary.length > 500 ? summary.substring(0, 497) + '...' : summary;
  }

  /**
   * Helper methods for deduplication
   */
  private static normalizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      return parsed.hostname + parsed.pathname;
    } catch {
      return url;
    }
  }

  private static normalizeTitle(title: string): string {
    return title.toLowerCase().replace(/[^\w\s]/g, '').trim();
  }

  private static calculateTitleSimilarity(title1: string, title2: string): number {
    const norm1 = this.normalizeTitle(title1);
    const norm2 = this.normalizeTitle(title2);

    if (norm1 === norm2) return 1;

    const words1 = norm1.split(/\s+/);
    const words2 = norm2.split(/\s+/);

    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];

    return intersection.length / union.length;
  }

  /**
   * Map Guardian sections to our categories
   */
  private static mapGuardianSection(section: string): string {
    const sectionMap: { [key: string]: string } = {
      'politics': 'POLITICS',
      'business': 'BUSINESS',
      'technology': 'TECHNOLOGY',
      'sport': 'SPORTS',
      'culture': 'ENTERTAINMENT',
      'science': 'SCIENCE',
      'world': 'WORLD',
      'uk': 'LOCAL'
    };

    return sectionMap[section.toLowerCase()] || 'LOCAL';
  }

  /**
   * Get recent news with caching
   */
  static async getRecentNews(options: NewsSearchOptions = {}): Promise<PrismaNewsItem[]> {
    const cacheKey = `recent_news:${JSON.stringify(options)}`;

    const cached = await redis.get<PrismaNewsItem[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const where: any = {
      publishedAt: {
        gte: options.fromDate || new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    };

    if (options.category) {
      where.category = options.category;
    }
    if (options.country) {
      where.country = options.country;
    }
    if (options.language) {
      where.language = options.language;
    }

    const news = await prisma.newsItem.findMany({
      where,
      orderBy: {
        publishedAt: 'desc'
      },
      take: options.limit || 50
    });

    await redis.set(cacheKey, news, { ttl: this.CACHE_TTL });

    return news;
  }

  /**
   * Search news by keywords
   */
  static async searchNews(query: string, options: NewsSearchOptions = {}): Promise<PrismaNewsItem[]> {
    const news = await prisma.$queryRaw<PrismaNewsItem[]>`
      SELECT *,
             ts_rank(to_tsvector('english', title || ' ' || description), plainto_tsquery('english', ${query})) as rank
      FROM news_items
      WHERE to_tsvector('english', title || ' ' || description) @@ plainto_tsquery('english', ${query})
        ${options.category ? Prisma.sql`AND category = ${options.category}` : Prisma.empty}
        ${options.country ? Prisma.sql`AND country = ${options.country}` : Prisma.empty}
        ${options.language ? Prisma.sql`AND language = ${options.language}` : Prisma.empty}
      ORDER BY rank DESC, published_at DESC
      LIMIT ${options.limit || 50}
    `;

    return news;
  }

  /**
   * Get trending news topics
   */
  static async getTrendingTopics(limit: number = 10): Promise<Array<{ topic: string; count: number; category: NewsCategory }>> {
    const result = await prisma.$queryRaw<Array<{ topic: string; count: bigint; category: NewsCategory }>>`
      SELECT unnest(topics) as topic, COUNT(*) as count, category
      FROM news_items
      WHERE published_at >= NOW() - INTERVAL '24 hours'
        AND array_length(topics, 1) > 0
      GROUP BY topic, category
      ORDER BY count DESC
      LIMIT ${limit}
    `;

    return result.map(item => ({
      topic: item.topic,
      count: Number(item.count),
      category: item.category
    }));
  }

  /**
   * Clean up old news items (keep last 30 days)
   */
  static async cleanupOldNews(): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await prisma.newsItem.deleteMany({
      where: {
        publishedAt: {
          lt: thirtyDaysAgo
        }
      }
    });

    return result.count;
  }
}

export default NewsService;
#!/usr/bin/env node

import { NewsService } from '../services/NewsService';
import { logger } from '../lib/logger';

async function initializeNewsService() {
  try {
    logger.info('Starting News Service initialization...');

    // Check which news sources are configured
    const sourcesStatus = {
      newsapi: !!process.env.NEWSAPI_KEY,
      guardian: !!process.env.GUARDIAN_API_KEY,
      gnews: !!process.env.GNEWS_API_KEY,
    };

    logger.info('News API sources configuration:', sourcesStatus);

    const activeSources = Object.entries(sourcesStatus).filter(([, active]) => active);
    const inactiveSources = Object.entries(sourcesStatus).filter(([, active]) => !active);

    if (activeSources.length === 0) {
      logger.warn('⚠️  No news API keys configured. News service will not be functional.');
      logger.warn('   Configure at least one of: NEWSAPI_KEY, GUARDIAN_API_KEY, or GNEWS_API_KEY');
      return;
    }

    logger.info(`✅ ${activeSources.length} news source(s) configured: ${activeSources.map(([name]) => name).join(', ')}`);

    if (inactiveSources.length > 0) {
      logger.info(`ℹ️  Inactive sources: ${inactiveSources.map(([name]) => name).join(', ')}`);
    }

    // Test news aggregation with various options
    logger.info('Testing news aggregation...');

    // Test 1: General news
    try {
      const generalNews = await NewsService.aggregateNews({
        limit: 5,
        category: 'WORLD',
      });

      logger.info('General news test successful:', {
        articlesCount: generalNews.articles.length,
        sources: generalNews.sources,
        totalFetched: generalNews.totalFetched,
        duplicatesRemoved: generalNews.duplicatesRemoved,
        cached: generalNews.cached,
      });

      if (generalNews.articles.length > 0) {
        const sampleArticle = generalNews.articles[0];
        logger.info('Sample article:', {
          title: sampleArticle.title.substring(0, 100),
          source: sampleArticle.sourceName,
          category: sampleArticle.category,
          publishedAt: sampleArticle.publishedAt,
        });
      }
    } catch (error) {
      logger.error('General news test failed:', error);
    }

    // Test 2: Political news
    try {
      const politicalNews = await NewsService.aggregateNews({
        limit: 3,
        category: 'POLITICS',
        language: 'en',
      });

      logger.info('Political news test successful:', {
        articlesCount: politicalNews.articles.length,
        sources: politicalNews.sources,
        cached: politicalNews.cached,
      });
    } catch (error) {
      logger.error('Political news test failed:', error);
    }

    // Test 3: Technology news
    try {
      const techNews = await NewsService.aggregateNews({
        limit: 3,
        category: 'TECHNOLOGY',
      });

      logger.info('Technology news test successful:', {
        articlesCount: techNews.articles.length,
        sources: techNews.sources,
        cached: techNews.cached,
      });
    } catch (error) {
      logger.error('Technology news test failed:', error);
    }

    // Test 4: Regional news (US)
    try {
      const usNews = await NewsService.aggregateNews({
        limit: 3,
        country: 'US',
        language: 'en',
      });

      logger.info('US regional news test successful:', {
        articlesCount: usNews.articles.length,
        sources: usNews.sources,
        cached: usNews.cached,
      });
    } catch (error) {
      logger.error('US regional news test failed:', error);
    }

    // Test 5: Search with keywords
    try {
      const keywordNews = await NewsService.aggregateNews({
        limit: 3,
        keywords: ['artificial intelligence', 'AI'],
      });

      logger.info('Keyword search test successful:', {
        articlesCount: keywordNews.articles.length,
        sources: keywordNews.sources,
        cached: keywordNews.cached,
      });
    } catch (error) {
      logger.error('Keyword search test failed:', error);
    }

    // Test caching by making the same request again
    try {
      const cachedNews = await NewsService.aggregateNews({
        limit: 5,
        category: 'WORLD',
      });

      logger.info('Cache test:', {
        articlesCount: cachedNews.articles.length,
        cached: cachedNews.cached,
        message: cachedNews.cached ? 'Cache working correctly' : 'Cache not used (expected on first run)',
      });
    } catch (error) {
      logger.error('Cache test failed:', error);
    }

    // Performance recommendations
    if (activeSources.length === 1) {
      logger.info('💡 Performance tip: Configure multiple news sources for better coverage and redundancy.');
    }

    if (activeSources.some(([name]) => name === 'gnews')) {
      logger.info('ℹ️  GNews has a lower rate limit (100 requests/day). Consider upgrading or using additional sources for production.');
    }

    logger.info('News Service initialization completed successfully!');

    // Display summary
    logger.info('=== News Service Summary ===');
    logger.info(`Active sources: ${activeSources.length}`);
    logger.info(`Available categories: POLITICS, BUSINESS, TECHNOLOGY, SPORTS, ENTERTAINMENT, HEALTH, SCIENCE, WORLD, LOCAL`);
    logger.info(`Supported languages: en, es, fr, de, and others`);
    logger.info(`Supported countries: US, GB, CA, AU, DE, FR, JP, IN, BR, and others`);
    logger.info(`Cache TTL: 5 minutes`);
    logger.info(`Deduplication threshold: 85%`);

  } catch (error) {
    logger.error('News Service initialization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeNewsService().catch((error) => {
    logger.error('Unhandled error during news service initialization:', error);
    process.exit(1);
  });
}

export { initializeNewsService };
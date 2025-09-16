'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn, getAnimationClasses } from '@/lib/design-system';
import { NewsCard } from './NewsCard';
import { NewsFilters } from './NewsFilters';
import { NewsSearch } from './NewsSearch';
import { TrendingNews } from './TrendingNews';
import { Button } from '@/components/ui/Button';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import type { NewsArticle, ApiResponse } from '@/types';

interface NewsFeedProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'detailed';
  showFilters?: boolean;
  showSearch?: boolean;
  showTrending?: boolean;
  pageSize?: number;
  onArticleClick?: (article: NewsArticle) => void;
  onPersonaReaction?: (article: NewsArticle) => void;
}

interface NewsFilters {
  category?: string;
  region?: string;
  search?: string;
  politicalLean?: 'left' | 'center' | 'right';
}

interface NewsPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface NewsResponse extends ApiResponse<NewsArticle[]> {
  pagination: NewsPagination;
  news: NewsArticle[];
}

export function NewsFeed({
  className,
  variant = 'default',
  showFilters = true,
  showSearch = true,
  showTrending = true,
  pageSize = 20,
  onArticleClick,
  onPersonaReaction,
}: NewsFeedProps) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [pagination, setPagination] = useState<NewsPagination>({
    page: 1,
    limit: pageSize,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<NewsFilters>({});
  const [refreshing, setRefreshing] = useState(false);

  const animations = getAnimationClasses();

  const fetchNews = useCallback(async (
    newFilters: NewsFilters = filters,
    page: number = 1,
    append: boolean = false
  ) => {
    if (!append) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams();
      if (newFilters.category) params.append('category', newFilters.category);
      if (newFilters.region) params.append('region', newFilters.region);
      if (newFilters.search) params.append('search', newFilters.search);
      if (newFilters.politicalLean) params.append('politicalLean', newFilters.politicalLean);
      params.append('page', page.toString());
      params.append('limit', pageSize.toString());

      const response = await fetch(`/api/news?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.statusText}`);
      }

      const data: NewsResponse = await response.json();
      
      if (append) {
        setNews(prev => [...prev, ...data.news]);
      } else {
        setNews(data.news);
      }
      
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [filters, pageSize]);

  const handleFiltersChange = useCallback((newFilters: NewsFilters) => {
    setFilters(newFilters);
    fetchNews(newFilters, 1, false);
  }, [fetchNews]);

  const handleSearch = useCallback((searchTerm: string) => {
    const newFilters = { ...filters, search: searchTerm };
    setFilters(newFilters);
    fetchNews(newFilters, 1, false);
  }, [filters, fetchNews]);

  const loadMore = useCallback(() => {
    if (pagination.page < pagination.pages && !loadingMore) {
      fetchNews(filters, pagination.page + 1, true);
    }
  }, [pagination, loadingMore, filters, fetchNews]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetchNews(filters, 1, false);
  }, [filters, fetchNews]);

  // Initial load
  useEffect(() => {
    fetchNews();
  }, []);

  const handleArticleClick = useCallback((article: NewsArticle) => {
    if (onArticleClick) {
      onArticleClick(article);
    }
  }, [onArticleClick]);

  const handlePersonaReaction = useCallback((article: NewsArticle) => {
    if (onPersonaReaction) {
      onPersonaReaction(article);
    }
  }, [onPersonaReaction]);

  if (loading && news.length === 0) {
    return (
      <div className={cn(
        'flex items-center justify-center py-12',
        className
      )}>
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-x-blue mx-auto" />
          <p className="text-x-text-secondary dark:text-x-text-secondary-dark">
            Loading latest news...
          </p>
        </div>
      </div>
    );
  }

  if (error && news.length === 0) {
    return (
      <div className={cn(
        'flex items-center justify-center py-12',
        className
      )}>
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-x-text dark:text-x-text-dark">
              Failed to Load News
            </h3>
            <p className="text-x-text-secondary dark:text-x-text-secondary-dark">
              {error}
            </p>
          </div>
          <Button
            onClick={refresh}
            className="mt-4"
            isLoading={refreshing}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-x-text dark:text-x-text-dark">
            Latest News
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={refresh}
            isLoading={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={cn(
              'w-4 h-4',
              refreshing && 'animate-spin'
            )} />
            <span>Refresh</span>
          </Button>
        </div>

        {showSearch && (
          <NewsSearch
            onSearch={handleSearch}
            initialValue={filters.search}
            className="w-full"
          />
        )}

        {showFilters && (
          <NewsFilters
            onFiltersChange={handleFiltersChange}
            currentFilters={filters}
            className="w-full"
          />
        )}
      </div>

      {/* Content Layout */}
      <div className={cn(
        'grid gap-6',
        variant === 'detailed' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
      )}>
        {/* Main News Feed */}
        <div className={cn(
          variant === 'detailed' ? 'lg:col-span-2' : 'lg:col-span-3'
        )}>
          {news.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-x-text-secondary dark:text-x-text-secondary-dark">
                No news articles found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className={cn('space-y-6', animations.fadeIn)}>
              {/* Error banner for partial failures */}
              {error && news.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* News Articles */}
              <div className="space-y-4">
                {news.map((article, index) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    variant={variant === 'minimal' ? 'compact' : 'default'}
                    onClick={handleArticleClick}
                    onPersonaReaction={handlePersonaReaction}
                    className={cn(
                      'transition-all duration-200',
                      animations.fadeIn
                    )}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {pagination.page < pagination.pages && (
                <div className="flex justify-center pt-6">
                  <Button
                    onClick={loadMore}
                    isLoading={loadingMore}
                    variant="outline"
                    className="min-w-32"
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}

              {/* End of feed indicator */}
              {news.length > 0 && pagination.page >= pagination.pages && (
                <div className="text-center py-8">
                  <p className="text-x-text-secondary dark:text-x-text-secondary-dark">
                    You're all caught up! Check back later for more news.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Trending News Sidebar */}
        {showTrending && (
          <div className="space-y-6">
            <TrendingNews
              filters={filters}
              onArticleClick={handleArticleClick}
              className="sticky top-6"
            />
          </div>
        )}
      </div>

      {/* Statistics */}
      {news.length > 0 && (
        <div className="text-center pt-6 border-t border-x-border">
          <p className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
            Showing {news.length} of {pagination.total} articles
            {filters.category && ` in ${filters.category}`}
            {filters.region && ` from ${filters.region}`}
          </p>
        </div>
      )}
    </div>
  );
}
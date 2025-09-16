'use client';

import { useState, useEffect } from 'react';
import { cn, getAnimationClasses } from '@/lib/design-system';
import { Settings, RefreshCw } from 'lucide-react';
import { TrendsList } from './TrendsList';
import { TrendFilters } from './TrendFilters';
import { PoliticalTrends } from './PoliticalTrends';
import { HashtagTrends } from './HashtagTrends';
import { RegionalTrends } from './RegionalTrends';
import type { TrendingTopic } from '@/types';

export interface TrendsSidebarProps {
  className?: string;
  showPoliticalTrends?: boolean;
  showHashtagTrends?: boolean;
  showRegionalTrends?: boolean;
  maxItems?: number;
  region?: string;
  onTrendClick?: (trend: TrendingTopic) => void;
  onRefresh?: () => Promise<void>;
}

export function TrendsSidebar({
  className,
  showPoliticalTrends = true,
  showHashtagTrends = true,
  showRegionalTrends = true,
  maxItems = 10,
  region = 'WORLDWIDE',
  onTrendClick,
  onRefresh,
}: TrendsSidebarProps) {
  const [trends, setTrends] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeWindow, setTimeWindow] = useState<string>('24h');
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const animations = getAnimationClasses();

  // Fetch trends from API
  const fetchTrends = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const params = new URLSearchParams({
        region,
        category: selectedCategory !== 'all' ? selectedCategory : '',
        timeWindow,
        limit: maxItems.toString(),
      });

      const response = await fetch(`/api/trends?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch trends: ${response.statusText}`);
      }

      const data = await response.json();
      setTrends(data.trends || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching trends:', err);
      setError(err instanceof Error ? err.message : 'Failed to load trends');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Setup SSE for real-time updates
  useEffect(() => {
    const eventSource = new EventSource('/api/stream?types=trends');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'trends_update') {
          setTrends(data.trends || []);
          setLastUpdated(new Date());
        }
      } catch (err) {
        console.error('Error parsing SSE data:', err);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Initial load and filter changes
  useEffect(() => {
    fetchTrends();
  }, [selectedCategory, timeWindow, region, maxItems]);

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    } else {
      await fetchTrends(true);
    }
  };

  const handleTrendClick = (trend: TrendingTopic) => {
    if (onTrendClick) {
      onTrendClick(trend);
    }
  };

  // Filter trends by category for specialized components
  const politicalTrends = trends.filter(trend =>
    trend.politicalReactions && Object.keys(trend.politicalReactions).length > 0
  );

  const hashtagTrends = trends.filter(trend =>
    trend.hashtag.startsWith('#')
  );

  const regionalTrends = trends.filter(trend =>
    trend.description.toLowerCase().includes(region.toLowerCase()) ||
    region === 'WORLDWIDE'
  );

  return (
    <aside
      className={cn(
        'w-80 h-full bg-white dark:bg-x-dark border-l border-x-border',
        'flex flex-col overflow-hidden',
        animations.slideLeft,
        className
      )}
      role="complementary"
      aria-label="Trending topics sidebar"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white/90 dark:bg-x-dark/90 backdrop-blur-md border-b border-x-border p-4 z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-x-text dark:text-x-text-dark">
            Trends
          </h2>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={cn(
                'p-2 rounded-full transition-all duration-200',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                isRefreshing && 'animate-spin'
              )}
              aria-label="Refresh trends"
            >
              <RefreshCw className="w-5 h-5 text-x-text-secondary dark:text-x-text-secondary-dark" />
            </button>

            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Trend settings"
            >
              <Settings className="w-5 h-5 text-x-text-secondary dark:text-x-text-secondary-dark" />
            </button>
          </div>
        </div>

        {/* Last updated indicator */}
        <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark mb-3">
          Updated {lastUpdated.toLocaleTimeString()}
        </div>

        {/* Filters */}
        <TrendFilters
          selectedCategory={selectedCategory}
          selectedTimeWindow={timeWindow}
          onCategoryChange={setSelectedCategory}
          onTimeWindowChange={setTimeWindow}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="p-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={() => fetchTrends()}
                className="mt-2 text-xs text-red-600 dark:text-red-400 hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {isLoading && !isRefreshing ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main trends list */}
            {trends.length > 0 && (
              <TrendsList
                trends={trends.slice(0, maxItems)}
                onTrendClick={handleTrendClick}
                showPoliticalIndicators={true}
                showCharts={false}
              />
            )}

            {/* Political trends section */}
            {showPoliticalTrends && politicalTrends.length > 0 && (
              <div className="border-t border-x-border pt-4">
                <PoliticalTrends
                  trends={politicalTrends.slice(0, 5)}
                  onTrendClick={handleTrendClick}
                  showAlignmentBreakdown={true}
                />
              </div>
            )}

            {/* Hashtag trends section */}
            {showHashtagTrends && hashtagTrends.length > 0 && (
              <div className="border-t border-x-border pt-4">
                <HashtagTrends
                  trends={hashtagTrends.slice(0, 5)}
                  onTrendClick={handleTrendClick}
                  showTrendingIndicator={true}
                />
              </div>
            )}

            {/* Regional trends section */}
            {showRegionalTrends && regionalTrends.length > 0 && region !== 'WORLDWIDE' && (
              <div className="border-t border-x-border pt-4">
                <RegionalTrends
                  trends={regionalTrends.slice(0, 3)}
                  region={region}
                  onTrendClick={handleTrendClick}
                />
              </div>
            )}

            {/* Empty state */}
            {trends.length === 0 && !isLoading && !error && (
              <div className="p-8 text-center">
                <div className="text-x-text-secondary dark:text-x-text-secondary-dark">
                  <p className="text-lg font-medium mb-2">No trends available</p>
                  <p className="text-sm">
                    Check back later or try adjusting your filters.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
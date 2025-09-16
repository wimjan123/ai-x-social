'use client';

import { useState } from 'react';
import { cn, getAnimationClasses } from '@/lib/design-system';
import { List, Grid, BarChart3 } from 'lucide-react';
import { TrendingItem } from './TrendingItem';
import type { TrendingTopic } from '@/types';

export interface TrendsListProps {
  trends: TrendingTopic[];
  onTrendClick?: (trend: TrendingTopic) => void;
  showPoliticalIndicators?: boolean;
  showCharts?: boolean;
  showMetrics?: boolean;
  maxItems?: number;
  variant?: 'default' | 'compact' | 'detailed';
  showViewToggle?: boolean;
  showRankings?: boolean;
  className?: string;
}

type ViewMode = 'list' | 'grid' | 'chart';

export function TrendsList({
  trends,
  onTrendClick,
  showPoliticalIndicators = false,
  showCharts = false,
  showMetrics = true,
  maxItems,
  variant = 'default',
  showViewToggle = false,
  showRankings = true,
  className,
}: TrendsListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<'trending' | 'posts' | 'engagement'>('trending');

  const animations = getAnimationClasses();

  // Sort trends based on selected criteria
  const sortedTrends = [...trends].sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return b.trendingScore - a.trendingScore;
      case 'posts':
        return b.postsCount - a.postsCount;
      case 'engagement':
        return b.participantsCount - a.participantsCount;
      default:
        return b.trendingScore - a.trendingScore;
    }
  });

  // Limit items if specified
  const displayTrends = maxItems
    ? sortedTrends.slice(0, maxItems)
    : sortedTrends;

  const handleTrendClick = (trend: TrendingTopic) => {
    if (onTrendClick) {
      onTrendClick(trend);
    }
  };

  if (trends.length === 0) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <div className="text-x-text-secondary dark:text-x-text-secondary-dark">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium mb-1">No trends available</p>
          <p className="text-sm">
            Trends will appear here when there's activity to track.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Header with controls */}
      <div className="flex items-center justify-between p-3 border-b border-x-border">
        <div className="flex items-center space-x-4">
          <h3 className="font-semibold text-x-text dark:text-x-text-dark">
            Trending now
          </h3>

          {/* Sort options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm bg-transparent border border-x-border rounded px-2 py-1 text-x-text dark:text-x-text-dark focus:ring-2 focus:ring-x-blue focus:border-transparent"
            aria-label="Sort trends by"
          >
            <option value="trending">Trending Score</option>
            <option value="posts">Post Count</option>
            <option value="engagement">Engagement</option>
          </select>
        </div>

        {/* View mode toggle */}
        {showViewToggle && (
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode('chart')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'chart'
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
              aria-label="Chart view"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Trends list */}
      <div
        className={cn(
          animations.staggerChildren,
          viewMode === 'grid' && 'grid grid-cols-2 gap-2',
          viewMode === 'list' && 'space-y-0',
          viewMode === 'chart' && 'space-y-4'
        )}
        role="list"
        aria-label="Trending topics"
      >
        {displayTrends.map((trend, index) => (
          <div
            key={trend.id}
            className={cn(
              animations.fadeInUp,
              viewMode === 'grid' && 'col-span-1'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            role="listitem"
          >
            <TrendingItem
              trend={trend}
              onClick={handleTrendClick}
              showChart={showCharts || viewMode === 'chart'}
              showPoliticalIndicators={showPoliticalIndicators}
              showMetrics={showMetrics}
              variant={
                viewMode === 'grid' ? 'compact' :
                viewMode === 'chart' ? 'detailed' :
                variant
              }
              rank={showRankings ? index + 1 : undefined}
            />
          </div>
        ))}
      </div>

      {/* Load more indicator */}
      {maxItems && trends.length > maxItems && (
        <div className="p-3 text-center border-t border-x-border">
          <button
            className="text-sm text-x-blue hover:underline font-medium"
            onClick={() => {
              // This would typically trigger loading more trends
              console.log('Load more trends');
            }}
          >
            View all {trends.length} trends
          </button>
        </div>
      )}

      {/* Empty state for filtered results */}
      {displayTrends.length === 0 && trends.length > 0 && (
        <div className="p-6 text-center">
          <div className="text-x-text-secondary dark:text-x-text-secondary-dark">
            <p className="text-lg font-medium mb-1">No trends match your filters</p>
            <p className="text-sm">Try adjusting your sorting or filter criteria.</p>
          </div>
        </div>
      )}
    </div>
  );
}
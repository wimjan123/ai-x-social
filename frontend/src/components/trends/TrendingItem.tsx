'use client';

import { cn, getAnimationClasses } from '@/lib/design-system';
import { TrendingUp, TrendingDown, Users, MessageCircle, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { TrendChart } from './TrendChart';
import type { TrendingTopic } from '@/types';

export interface TrendingItemProps {
  trend: TrendingTopic;
  onClick?: (trend: TrendingTopic) => void;
  showChart?: boolean;
  showPoliticalIndicators?: boolean;
  showMetrics?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  rank?: number;
  className?: string;
}

export function TrendingItem({
  trend,
  onClick,
  showChart = false,
  showPoliticalIndicators = false,
  showMetrics = true,
  variant = 'default',
  rank,
  className,
}: TrendingItemProps) {
  const animations = getAnimationClasses();

  const handleClick = () => {
    if (onClick) {
      onClick(trend);
    }
  };

  const getTrendDirection = (score: number): 'up' | 'down' | 'stable' => {
    if (score > 75) return 'up';
    if (score < 25) return 'down';
    return 'stable';
  };

  const trendDirection = getTrendDirection(trend.trendingScore);

  // Calculate total political engagement
  const totalPoliticalReactions = Object.values(trend.politicalReactions || {}).reduce(
    (sum, count) => sum + count,
    0
  );

  // Get dominant political alignment
  const dominantAlignment = showPoliticalIndicators
    ? Object.entries(trend.politicalReactions || {}).reduce(
        (max, [alignment, count]) =>
          count > (max.count || 0) ? { alignment, count } : max,
        { alignment: '', count: 0 }
      )
    : null;

  // Format numbers for display
  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const rankClasses = rank && rank <= 3 ? {
    1: 'border-l-4 border-l-yellow-500',
    2: 'border-l-4 border-l-gray-400',
    3: 'border-l-4 border-l-yellow-600',
  }[rank] : '';

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-900/50',
          'transition-all duration-200 cursor-pointer group',
          rankClasses,
          className
        )}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`Trending topic: ${trend.hashtag || trend.description}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {rank && (
            <div className="text-sm font-semibold text-x-text-secondary dark:text-x-text-secondary-dark w-6">
              {rank}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-x-text dark:text-x-text-dark truncate">
                {trend.hashtag || trend.description}
              </h4>
              {trendDirection === 'up' && (
                <TrendingUp className="w-4 h-4 text-green-500" />
              )}
              {trendDirection === 'down' && (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>

            <p className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
              {formatCount(trend.postsCount)} posts
            </p>
          </div>
        </div>

        {showMetrics && (
          <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
            Score: {Math.round(trend.trendingScore)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all duration-200',
        'cursor-pointer group border-b border-x-border last:border-b-0',
        rankClasses,
        animations.fadeIn,
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Trending topic: ${trend.hashtag || trend.description}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {rank && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-x-blue text-white text-sm font-bold flex items-center justify-center">
              {rank}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-x-text dark:text-x-text-dark mb-1 truncate group-hover:text-x-blue transition-colors">
              {trend.hashtag || trend.description}
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {trendDirection === 'up' && (
            <div className="flex items-center space-x-1 text-green-500">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Trending</span>
            </div>
          )}
          {trendDirection === 'down' && (
            <div className="flex items-center space-x-1 text-red-500">
              <TrendingDown className="w-5 h-5" />
              <span className="text-sm font-medium">Declining</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {trend.description && trend.description !== trend.hashtag && (
        <p className="text-x-text dark:text-x-text-dark mb-3 line-clamp-2">
          {trend.description}
        </p>
      )}

      {/* Chart */}
      {showChart && (
        <div className="mb-3">
          <TrendChart
            trendId={trend.id}
            timeWindow="24h"
            height={60}
            showAxes={false}
            color="#1da1f2"
          />
        </div>
      )}

      {/* Metrics */}
      {showMetrics && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-x-text-secondary dark:text-x-text-secondary-dark">
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{formatCount(trend.postsCount)} posts</span>
            </div>

            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{formatCount(trend.participantsCount)} people</span>
            </div>

            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>Score: {Math.round(trend.trendingScore)}</span>
            </div>
          </div>

          <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
            {formatDistanceToNow(new Date(trend.lastUpdated), { addSuffix: true })}
          </div>
        </div>
      )}

      {/* Political indicators */}
      {showPoliticalIndicators && dominantAlignment && (
        <div className="mt-3 pt-3 border-t border-x-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
              Political engagement: {formatCount(totalPoliticalReactions)} reactions
            </div>

            <div className="flex items-center space-x-2">
              <div
                className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  dominantAlignment.alignment === 'conservative' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                  dominantAlignment.alignment === 'liberal' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                  dominantAlignment.alignment === 'progressive' && 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
                  dominantAlignment.alignment === 'moderate' && 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
                  dominantAlignment.alignment === 'libertarian' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
                  dominantAlignment.alignment === 'independent' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                )}
              >
                {dominantAlignment.alignment} {Math.round((dominantAlignment.count / totalPoliticalReactions) * 100)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Related articles indicator */}
      {trend.relatedArticles && trend.relatedArticles.length > 0 && (
        <div className="mt-2 text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
          {trend.relatedArticles.length} related news article{trend.relatedArticles.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
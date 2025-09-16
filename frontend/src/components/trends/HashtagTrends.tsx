'use client';

import { cn, getAnimationClasses } from '@/lib/design-system';
import { Hash, TrendingUp, TrendingDown, MessageCircle, Users, Flame } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { TrendingTopic } from '@/types';

export interface HashtagTrendsProps {
  trends: TrendingTopic[];
  onTrendClick?: (trend: TrendingTopic) => void;
  showTrendingIndicator?: boolean;
  showMetrics?: boolean;
  maxItems?: number;
  variant?: 'default' | 'compact';
  className?: string;
}

export function HashtagTrends({
  trends,
  onTrendClick,
  showTrendingIndicator = true,
  showMetrics = true,
  maxItems = 10,
  variant = 'default',
  className,
}: HashtagTrendsProps) {
  const animations = getAnimationClasses();

  // Filter for hashtag trends (starting with #)
  const hashtagTrends = trends
    .filter(trend => trend.hashtag && trend.hashtag.startsWith('#'))
    .slice(0, maxItems);

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getTrendStatus = (score: number): 'hot' | 'rising' | 'stable' | 'declining' => {
    if (score >= 80) return 'hot';
    if (score >= 60) return 'rising';
    if (score >= 30) return 'stable';
    return 'declining';
  };

  const getTrendIcon = (status: string) => {
    switch (status) {
      case 'hot':
        return <Flame className="w-4 h-4 text-red-500" />;
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Hash className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleTrendClick = (trend: TrendingTopic) => {
    if (onTrendClick) {
      onTrendClick(trend);
    }
  };

  if (hashtagTrends.length === 0) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <div className="text-x-text-secondary dark:text-x-text-secondary-dark">
          <Hash className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium mb-1">No hashtag trends</p>
          <p className="text-sm">
            Trending hashtags will appear here when there's activity.
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('space-y-2', animations.fadeIn, className)}>
        <div className="flex items-center space-x-2 mb-3">
          <Hash className="w-5 h-5 text-x-text-secondary dark:text-x-text-secondary-dark" />
          <h3 className="font-semibold text-x-text dark:text-x-text-dark">
            Trending Hashtags
          </h3>
        </div>

        <div className="space-y-1">
          {hashtagTrends.map((trend, index) => {
            const status = getTrendStatus(trend.trendingScore);
            return (
              <button
                key={trend.id}
                onClick={() => handleTrendClick(trend)}
                className={cn(
                  'w-full flex items-center justify-between p-2 rounded-lg',
                  'hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all duration-200',
                  'text-left group',
                  animations.fadeInUp
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <span className="text-lg font-bold text-x-text-secondary dark:text-x-text-secondary-dark">
                    {index + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-x-text dark:text-x-text-dark truncate group-hover:text-x-blue transition-colors">
                        {trend.hashtag}
                      </h4>
                      {showTrendingIndicator && getTrendIcon(status)}
                    </div>

                    {showMetrics && (
                      <p className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
                        {formatCount(trend.postsCount)} posts
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
                  {Math.round(trend.trendingScore)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', animations.fadeIn, className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Hash className="w-5 h-5 text-x-text-secondary dark:text-x-text-secondary-dark" />
          <h3 className="font-semibold text-x-text dark:text-x-text-dark">
            Trending Hashtags
          </h3>
        </div>

        <div className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
          {hashtagTrends.length} trending
        </div>
      </div>

      {/* Hashtag list */}
      <div className="space-y-0">
        {hashtagTrends.map((trend, index) => {
          const status = getTrendStatus(trend.trendingScore);
          const lastUpdated = new Date(trend.lastUpdated);

          return (
            <div
              key={trend.id}
              className={cn(
                'border-b border-x-border last:border-b-0',
                animations.fadeInUp
              )}
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <button
                onClick={() => handleTrendClick(trend)}
                className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all duration-200 text-left group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-x-blue/10 dark:bg-x-blue/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-x-blue">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-lg text-x-text dark:text-x-text-dark truncate group-hover:text-x-blue transition-colors">
                          {trend.hashtag}
                        </h4>
                        {showTrendingIndicator && getTrendIcon(status)}
                      </div>

                      {trend.description && trend.description !== trend.hashtag && (
                        <p className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark line-clamp-2">
                          {trend.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-3">
                    <div className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      status === 'hot' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                      status === 'rising' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                      status === 'stable' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                      status === 'declining' && 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    )}>
                      {status}
                    </div>
                  </div>
                </div>

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

                      <div className="text-xs">
                        Score: {Math.round(trend.trendingScore)}
                      </div>
                    </div>

                    <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
                      {formatDistanceToNow(lastUpdated, { addSuffix: true })}
                    </div>
                  </div>
                )}

                {/* Related articles indicator */}
                {trend.relatedArticles && trend.relatedArticles.length > 0 && (
                  <div className="mt-2 text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
                    {trend.relatedArticles.length} related news article{trend.relatedArticles.length !== 1 ? 's' : ''}
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* View more link */}
      {trends.length > maxItems && (
        <div className="text-center pt-3 border-t border-x-border">
          <button className="text-sm text-x-blue hover:underline font-medium">
            View all hashtag trends
          </button>
        </div>
      )}
    </div>
  );
}
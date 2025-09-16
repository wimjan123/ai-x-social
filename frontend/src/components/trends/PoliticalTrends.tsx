'use client';

import { cn, getAnimationClasses } from '@/lib/design-system';
import { Vote, TrendingUp, Users, Activity } from 'lucide-react';
import { TrendingItem } from './TrendingItem';
import type { TrendingTopic } from '@/types';

export interface PoliticalTrendsProps {
  trends: TrendingTopic[];
  onTrendClick?: (trend: TrendingTopic) => void;
  showAlignmentBreakdown?: boolean;
  showEngagementMetrics?: boolean;
  maxItems?: number;
  className?: string;
}

interface PoliticalAlignment {
  alignment: string;
  count: number;
  percentage: number;
  color: string;
}

export function PoliticalTrends({
  trends,
  onTrendClick,
  showAlignmentBreakdown = true,
  showEngagementMetrics = true,
  maxItems = 5,
  className,
}: PoliticalTrendsProps) {
  const animations = getAnimationClasses();

  // Filter trends with political reactions
  const politicalTrends = trends.filter(trend =>
    trend.politicalReactions && Object.keys(trend.politicalReactions).length > 0
  ).slice(0, maxItems);

  // Calculate overall political engagement statistics
  const overallStats = politicalTrends.reduce((acc, trend) => {
    const reactions = trend.politicalReactions || {};
    Object.entries(reactions).forEach(([alignment, count]) => {
      acc[alignment] = (acc[alignment] || 0) + count;
    });
    return acc;
  }, {} as Record<string, number>);

  const totalEngagement = Object.values(overallStats).reduce((sum, count) => sum + count, 0);

  // Get political alignment data with colors
  const getAlignmentColor = (alignment: string): string => {
    const colorMap: Record<string, string> = {
      conservative: '#dc2626', // red-600
      liberal: '#2563eb', // blue-600
      progressive: '#7c3aed', // violet-600
      moderate: '#6b7280', // gray-500
      libertarian: '#f59e0b', // amber-500
      independent: '#059669', // emerald-600
    };
    return colorMap[alignment] || '#6b7280';
  };

  const alignmentData: PoliticalAlignment[] = Object.entries(overallStats)
    .map(([alignment, count]) => ({
      alignment,
      count,
      percentage: (count / totalEngagement) * 100,
      color: getAlignmentColor(alignment),
    }))
    .sort((a, b) => b.count - a.count);

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (politicalTrends.length === 0) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <div className="text-x-text-secondary dark:text-x-text-secondary-dark">
          <Vote className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium mb-1">No political trends</p>
          <p className="text-sm">
            Political discussions will appear here when there's activity.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', animations.fadeIn, className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Vote className="w-5 h-5 text-x-text-secondary dark:text-x-text-secondary-dark" />
          <h3 className="font-semibold text-x-text dark:text-x-text-dark">
            Political Trends
          </h3>
        </div>

        {showEngagementMetrics && (
          <div className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
            {formatCount(totalEngagement)} political reactions
          </div>
        )}
      </div>

      {/* Overall political engagement breakdown */}
      {showAlignmentBreakdown && alignmentData.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-x-text dark:text-x-text-dark mb-3">
            Political Engagement Breakdown
          </h4>

          {/* Visual breakdown bar */}
          <div className="flex h-2 rounded-full overflow-hidden mb-3">
            {alignmentData.map((item, index) => (
              <div
                key={item.alignment}
                className="transition-all duration-300 hover:opacity-80"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
                title={`${item.alignment}: ${item.percentage.toFixed(1)}%`}
              />
            ))}
          </div>

          {/* Detailed breakdown */}
          <div className="grid grid-cols-2 gap-2">
            {alignmentData.slice(0, 6).map((item) => (
              <div
                key={item.alignment}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-x-text dark:text-x-text-dark capitalize">
                    {item.alignment}
                  </span>
                </div>
                <div className="text-x-text-secondary dark:text-x-text-secondary-dark">
                  {item.percentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>

          {alignmentData.length > 6 && (
            <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark mt-2">
              +{alignmentData.length - 6} more alignments
            </div>
          )}
        </div>
      )}

      {/* Top political trends */}
      <div className="space-y-0">
        {politicalTrends.map((trend, index) => {
          const totalReactions = Object.values(trend.politicalReactions || {}).reduce(
            (sum, count) => sum + count,
            0
          );

          const dominantAlignment = Object.entries(trend.politicalReactions || {}).reduce(
            (max, [alignment, count]) =>
              count > max.count ? { alignment, count } : max,
            { alignment: '', count: 0 }
          );

          return (
            <div
              key={trend.id}
              className={cn(
                'border-l-4 transition-all duration-200',
                animations.fadeInUp
              )}
              style={{
                borderLeftColor: getAlignmentColor(dominantAlignment.alignment),
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="pl-4">
                <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-r-lg transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => onTrendClick?.(trend)}
                        className="text-left w-full group"
                      >
                        <h4 className="font-semibold text-x-text dark:text-x-text-dark group-hover:text-x-blue transition-colors truncate">
                          {trend.hashtag || trend.description}
                        </h4>
                      </button>

                      {trend.description && trend.description !== trend.hashtag && (
                        <p className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark mt-1 line-clamp-2">
                          {trend.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-3">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-x-text dark:text-x-text-dark">
                        #{index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Political metrics */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4 text-x-text-secondary dark:text-x-text-secondary-dark">
                      <div className="flex items-center space-x-1">
                        <Activity className="w-4 h-4" />
                        <span>{formatCount(totalReactions)} reactions</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{formatCount(trend.postsCount)} posts</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div
                        className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          'flex items-center space-x-1'
                        )}
                        style={{
                          backgroundColor: `${getAlignmentColor(dominantAlignment.alignment)}20`,
                          color: getAlignmentColor(dominantAlignment.alignment),
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getAlignmentColor(dominantAlignment.alignment) }}
                        />
                        <span className="capitalize">
                          {dominantAlignment.alignment}
                        </span>
                        <span>
                          {Math.round((dominantAlignment.count / totalReactions) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Political alignment breakdown for this trend */}
                  <div className="mt-3 pt-2 border-t border-x-border">
                    <div className="flex h-1.5 rounded-full overflow-hidden">
                      {Object.entries(trend.politicalReactions || {}).map(([alignment, count]) => (
                        <div
                          key={alignment}
                          className="transition-all duration-300"
                          style={{
                            width: `${(count / totalReactions) * 100}%`,
                            backgroundColor: getAlignmentColor(alignment),
                          }}
                          title={`${alignment}: ${((count / totalReactions) * 100).toFixed(1)}%`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View more link */}
      {trends.length > maxItems && (
        <div className="text-center pt-3 border-t border-x-border">
          <button className="text-sm text-x-blue hover:underline font-medium">
            View all {trends.length} political trends
          </button>
        </div>
      )}
    </div>
  );
}
'use client';

import { cn, getAnimationClasses } from '@/lib/design-system';
import { Globe, MapPin, TrendingUp, MessageCircle, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { TrendingTopic } from '@/types';

export interface RegionalTrendsProps {
  trends: TrendingTopic[];
  region: string;
  onTrendClick?: (trend: TrendingTopic) => void;
  onRegionChange?: (region: string) => void;
  showMetrics?: boolean;
  showRegionSelector?: boolean;
  maxItems?: number;
  className?: string;
}

const regions = [
  { code: 'WORLDWIDE', name: 'Worldwide', flag: '🌍' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
];

export function RegionalTrends({
  trends,
  region,
  onTrendClick,
  onRegionChange,
  showMetrics = true,
  showRegionSelector = true,
  maxItems = 10,
  className,
}: RegionalTrendsProps) {
  const animations = getAnimationClasses();

  const currentRegion = regions.find(r => r.code === region) || regions[0];
  const displayTrends = trends.slice(0, maxItems);

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const handleTrendClick = (trend: TrendingTopic) => {
    if (onTrendClick) {
      onTrendClick(trend);
    }
  };

  if (displayTrends.length === 0) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <div className="text-x-text-secondary dark:text-x-text-secondary-dark">
          <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium mb-1">No regional trends</p>
          <p className="text-sm">
            Trends for {currentRegion.name} will appear here when there's activity.
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
          <Globe className="w-5 h-5 text-x-text-secondary dark:text-x-text-secondary-dark" />
          <h3 className="font-semibold text-x-text dark:text-x-text-dark">
            Regional Trends
          </h3>
        </div>

        <div className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
          {displayTrends.length} trending in {currentRegion.name}
        </div>
      </div>

      {/* Region selector */}
      {showRegionSelector && onRegionChange && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-x-text-secondary dark:text-x-text-secondary-dark" />
            <span className="text-sm font-medium text-x-text dark:text-x-text-dark">
              Select Region
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
            {regions.map((regionOption) => (
              <button
                key={regionOption.code}
                onClick={() => onRegionChange(regionOption.code)}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                  'border border-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
                  region === regionOption.code
                    ? 'bg-x-blue text-white border-x-blue'
                    : 'bg-gray-50 dark:bg-gray-900 text-x-text dark:text-x-text-dark'
                )}
                aria-pressed={region === regionOption.code}
                title={regionOption.name}
              >
                <span className="text-base">{regionOption.flag}</span>
                <span className="truncate text-xs">{regionOption.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current region indicator */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <div className="text-2xl">{currentRegion.flag}</div>
        <div>
          <h4 className="font-semibold text-x-text dark:text-x-text-dark">
            {currentRegion.name}
          </h4>
          <p className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
            {region === 'WORLDWIDE' ? 'Global trends' : 'Local trends'}
          </p>
        </div>
      </div>

      {/* Trends list */}
      <div className="space-y-0">
        {displayTrends.map((trend, index) => {
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
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-x-blue to-blue-600 text-white text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-lg text-x-text dark:text-x-text-dark truncate group-hover:text-x-blue transition-colors">
                          {trend.hashtag || trend.description}
                        </h4>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>

                      {trend.description && trend.description !== trend.hashtag && (
                        <p className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark line-clamp-2">
                          {trend.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-3">
                    <div className="px-2 py-1 rounded-full bg-x-blue/10 dark:bg-x-blue/20 text-x-blue text-xs font-medium">
                      Trending in {currentRegion.name}
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

                {/* Regional context */}
                <div className="mt-2 pt-2 border-t border-x-border">
                  <div className="flex items-center justify-between text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>Popular in {currentRegion.name}</span>
                    </div>

                    {trend.relatedArticles && trend.relatedArticles.length > 0 && (
                      <span>
                        {trend.relatedArticles.length} related article{trend.relatedArticles.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Political reactions for this region */}
                  {trend.politicalReactions && Object.keys(trend.politicalReactions).length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
                          Political engagement:
                        </span>
                        <div className="flex space-x-1">
                          {Object.entries(trend.politicalReactions).slice(0, 3).map(([alignment, count]) => (
                            <div
                              key={alignment}
                              className={cn(
                                'px-1.5 py-0.5 rounded text-xs',
                                alignment === 'conservative' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                                alignment === 'liberal' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                                alignment === 'progressive' && 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
                                alignment === 'moderate' && 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                              )}
                            >
                              {alignment}: {formatCount(count)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* View more link */}
      {trends.length > maxItems && (
        <div className="text-center pt-3 border-t border-x-border">
          <button className="text-sm text-x-blue hover:underline font-medium">
            View all {trends.length} trends in {currentRegion.name}
          </button>
        </div>
      )}
    </div>
  );
}
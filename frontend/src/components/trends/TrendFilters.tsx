'use client';

import { cn } from '@/lib/design-system';
import { Filter, Clock, Globe, Tag, Users } from 'lucide-react';

export interface TrendFiltersProps {
  selectedCategory: string;
  selectedTimeWindow: string;
  selectedRegion?: string;
  onCategoryChange: (category: string) => void;
  onTimeWindowChange: (timeWindow: string) => void;
  onRegionChange?: (region: string) => void;
  showRegionFilter?: boolean;
  className?: string;
}

const categories = [
  { value: 'all', label: 'All Topics', icon: Globe },
  { value: 'politics', label: 'Politics', icon: Users },
  { value: 'technology', label: 'Technology', icon: Tag },
  { value: 'sports', label: 'Sports', icon: Tag },
  { value: 'entertainment', label: 'Entertainment', icon: Tag },
  { value: 'business', label: 'Business', icon: Tag },
  { value: 'health', label: 'Health', icon: Tag },
  { value: 'science', label: 'Science', icon: Tag },
];

const timeWindows = [
  { value: '1h', label: 'Last hour' },
  { value: '6h', label: 'Last 6 hours' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'This week' },
  { value: '30d', label: 'This month' },
];

const regions = [
  { value: 'WORLDWIDE', label: 'Worldwide' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'BR', label: 'Brazil' },
  { value: 'IN', label: 'India' },
];

export function TrendFilters({
  selectedCategory,
  selectedTimeWindow,
  selectedRegion = 'WORLDWIDE',
  onCategoryChange,
  onTimeWindowChange,
  onRegionChange,
  showRegionFilter = true,
  className,
}: TrendFiltersProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Category filter */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Filter className="w-4 h-4 text-x-text-secondary dark:text-x-text-secondary-dark" />
          <label className="text-sm font-medium text-x-text dark:text-x-text-dark">
            Category
          </label>
        </div>

        <div className="grid grid-cols-2 gap-1">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.value}
                onClick={() => onCategoryChange(category.value)}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                  'border border-transparent',
                  selectedCategory === category.value
                    ? 'bg-x-blue text-white border-x-blue'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-x-text dark:text-x-text-dark'
                )}
                aria-pressed={selectedCategory === category.value}
                aria-label={`Filter by ${category.label}`}
              >
                <IconComponent className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time window filter */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Clock className="w-4 h-4 text-x-text-secondary dark:text-x-text-secondary-dark" />
          <label className="text-sm font-medium text-x-text dark:text-x-text-dark">
            Time Period
          </label>
        </div>

        <select
          value={selectedTimeWindow}
          onChange={(e) => onTimeWindowChange(e.target.value)}
          className={cn(
            'w-full px-3 py-2 rounded-lg border border-x-border',
            'bg-white dark:bg-gray-800 text-x-text dark:text-x-text-dark',
            'focus:ring-2 focus:ring-x-blue focus:border-transparent',
            'transition-colors duration-200'
          )}
          aria-label="Select time period for trends"
        >
          {timeWindows.map((window) => (
            <option key={window.value} value={window.value}>
              {window.label}
            </option>
          ))}
        </select>
      </div>

      {/* Region filter */}
      {showRegionFilter && onRegionChange && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="w-4 h-4 text-x-text-secondary dark:text-x-text-secondary-dark" />
            <label className="text-sm font-medium text-x-text dark:text-x-text-dark">
              Region
            </label>
          </div>

          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className={cn(
              'w-full px-3 py-2 rounded-lg border border-x-border',
              'bg-white dark:bg-gray-800 text-x-text dark:text-x-text-dark',
              'focus:ring-2 focus:ring-x-blue focus:border-transparent',
              'transition-colors duration-200'
            )}
            aria-label="Select region for trends"
          >
            {regions.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Active filters summary */}
      <div className="flex items-center justify-between pt-2 border-t border-x-border">
        <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
          Showing {selectedCategory === 'all' ? 'all topics' : selectedCategory} trends
          {showRegionFilter && ` in ${regions.find(r => r.value === selectedRegion)?.label || 'Worldwide'}`}
        </div>

        {(selectedCategory !== 'all' || selectedTimeWindow !== '24h' || (showRegionFilter && selectedRegion !== 'WORLDWIDE')) && (
          <button
            onClick={() => {
              onCategoryChange('all');
              onTimeWindowChange('24h');
              if (onRegionChange) onRegionChange('WORLDWIDE');
            }}
            className="text-xs text-x-blue hover:underline font-medium"
            aria-label="Clear all filters"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
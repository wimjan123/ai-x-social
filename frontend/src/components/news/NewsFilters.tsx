'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/design-system';
import { ChevronDown, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NewsFilters {
  category?: string;
  region?: string;
  politicalLean?: 'left' | 'center' | 'right';
}

interface NewsFiltersProps {
  currentFilters: NewsFilters;
  onFiltersChange: (filters: NewsFilters) => void;
  className?: string;
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'POLITICS', label: 'Politics' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'TECHNOLOGY', label: 'Technology' },
  { value: 'SPORTS', label: 'Sports' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'HEALTH', label: 'Health' },
  { value: 'SCIENCE', label: 'Science' },
  { value: 'WORLD', label: 'World' },
  { value: 'LOCAL', label: 'Local' },
];

const regions = [
  { value: '', label: 'All Regions' },
  { value: 'WORLDWIDE', label: 'Worldwide' },
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'EU', label: 'Europe' },
  { value: 'AS', label: 'Asia' },
  { value: 'AF', label: 'Africa' },
  { value: 'SA', label: 'South America' },
];

const politicalLeans = [
  { value: '', label: 'All Perspectives' },
  { value: 'left', label: 'Left-leaning' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right-leaning' },
];

interface FilterDropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
}

function FilterDropdown({ label, value, options, onChange, className }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value) || options[0];

  const handleSelect = useCallback((optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  }, [onChange]);

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-between w-full px-4 py-2',
          'bg-white dark:bg-x-dark border border-x-border rounded-lg',
          'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-x-blue focus:ring-offset-2',
          isOpen && 'ring-2 ring-x-blue ring-offset-2'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Filter by ${label}`}
      >
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-x-text-secondary dark:text-x-text-secondary-dark" />
          <span className="text-sm font-medium text-x-text dark:text-x-text-dark">
            {label}:
          </span>
          <span className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
            {selectedOption.label}
          </span>
        </div>
        <ChevronDown className={cn(
          'w-4 h-4 text-x-text-secondary dark:text-x-text-secondary-dark transition-transform',
          isOpen && 'transform rotate-180'
        )} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={cn(
            'absolute top-full left-0 right-0 z-20 mt-1',
            'bg-white dark:bg-x-dark border border-x-border rounded-lg shadow-lg',
            'max-h-60 overflow-y-auto'
          )}>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm',
                  'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                  'focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-800',
                  value === option.value
                    ? 'bg-x-blue text-white'
                    : 'text-x-text dark:text-x-text-dark'
                )}
                role="option"
                aria-selected={value === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ActiveFilters({ filters, onClearFilter, onClearAll }: {
  filters: NewsFilters;
  onClearFilter: (key: keyof NewsFilters) => void;
  onClearAll: () => void;
}) {
  const activeFilters = Object.entries(filters).filter(([_, value]) => value);
  
  if (activeFilters.length === 0) return null;

  const getFilterLabel = (key: string, value: string) => {
    switch (key) {
      case 'category':
        return categories.find(c => c.value === value)?.label || value;
      case 'region':
        return regions.find(r => r.value === value)?.label || value;
      case 'politicalLean':
        return politicalLeans.find(p => p.value === value)?.label || value;
      default:
        return value;
    }
  };

  return (
    <div className="flex items-center space-x-2 py-2">
      <span className="text-sm font-medium text-x-text-secondary dark:text-x-text-secondary-dark">
        Active filters:
      </span>
      
      <div className="flex items-center space-x-2">
        {activeFilters.map(([key, value]) => (
          <div
            key={key}
            className={cn(
              'flex items-center space-x-1 px-3 py-1 rounded-full text-xs',
              'bg-x-blue text-white'
            )}
          >
            <span>{getFilterLabel(key, value as string)}</span>
            <button
              onClick={() => onClearFilter(key as keyof NewsFilters)}
              className="hover:bg-blue-600 rounded-full p-0.5 transition-colors"
              aria-label={`Remove ${key} filter`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-xs"
        >
          Clear all
        </Button>
      </div>
    </div>
  );
}

export function NewsFilters({ currentFilters, onFiltersChange, className }: NewsFiltersProps) {
  const handleFilterChange = useCallback((key: keyof NewsFilters, value: string) => {
    const newFilters = {
      ...currentFilters,
      [key]: value || undefined,
    };
    
    // Remove empty filters
    Object.keys(newFilters).forEach(k => {
      if (!newFilters[k as keyof NewsFilters]) {
        delete newFilters[k as keyof NewsFilters];
      }
    });
    
    onFiltersChange(newFilters);
  }, [currentFilters, onFiltersChange]);

  const handleClearFilter = useCallback((key: keyof NewsFilters) => {
    const newFilters = { ...currentFilters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  }, [currentFilters, onFiltersChange]);

  const handleClearAll = useCallback(() => {
    onFiltersChange({});
  }, [onFiltersChange]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FilterDropdown
          label="Category"
          value={currentFilters.category || ''}
          options={categories}
          onChange={(value) => handleFilterChange('category', value)}
        />
        
        <FilterDropdown
          label="Region"
          value={currentFilters.region || ''}
          options={regions}
          onChange={(value) => handleFilterChange('region', value)}
        />
        
        <FilterDropdown
          label="Perspective"
          value={currentFilters.politicalLean || ''}
          options={politicalLeans}
          onChange={(value) => handleFilterChange('politicalLean', value)}
        />
      </div>
      
      {/* Active Filters */}
      <ActiveFilters
        filters={currentFilters}
        onClearFilter={handleClearFilter}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
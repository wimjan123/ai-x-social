'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/design-system';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NewsSearchProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  showRecentSearches?: boolean;
}

interface SearchSuggestion {
  id: string;
  query: string;
  type: 'recent' | 'trending' | 'suggestion';
  count?: number;
}

// Mock trending topics and suggestions
const trendingSearches: SearchSuggestion[] = [
  { id: '1', query: 'climate change', type: 'trending', count: 1234 },
  { id: '2', query: 'artificial intelligence', type: 'trending', count: 987 },
  { id: '3', query: 'economic policy', type: 'trending', count: 756 },
  { id: '4', query: 'healthcare reform', type: 'trending', count: 543 },
  { id: '5', query: 'technology innovation', type: 'trending', count: 432 },
];

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}

function SearchSuggestions({
  suggestions,
  recentSearches,
  onSelect,
  onRemoveRecent,
  isVisible,
}: {
  suggestions: SearchSuggestion[];
  recentSearches: string[];
  onSelect: (query: string) => void;
  onRemoveRecent: (query: string) => void;
  isVisible: boolean;
}) {
  if (!isVisible) return null;

  const hasRecent = recentSearches.length > 0;
  const hasTrending = suggestions.length > 0;

  if (!hasRecent && !hasTrending) return null;

  return (
    <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white dark:bg-x-dark border border-x-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
      {/* Recent Searches */}
      {hasRecent && (
        <div className="p-3 border-b border-x-border">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-x-text-secondary dark:text-x-text-secondary-dark" />
            <span className="text-sm font-medium text-x-text-secondary dark:text-x-text-secondary-dark">
              Recent searches
            </span>
          </div>
          <div className="space-y-1">
            {recentSearches.slice(0, 5).map((query) => (
              <div
                key={query}
                className="flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 py-1"
              >
                <button
                  onClick={() => onSelect(query)}
                  className="flex-1 text-left text-sm text-x-text dark:text-x-text-dark hover:text-x-blue"
                >
                  {query}
                </button>
                <button
                  onClick={() => onRemoveRecent(query)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-opacity"
                  aria-label={`Remove "${query}" from recent searches`}
                >
                  <X className="w-3 h-3 text-x-text-secondary dark:text-x-text-secondary-dark" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Searches */}
      {hasTrending && (
        <div className="p-3">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-x-text-secondary dark:text-x-text-secondary-dark" />
            <span className="text-sm font-medium text-x-text-secondary dark:text-x-text-secondary-dark">
              Trending searches
            </span>
          </div>
          <div className="space-y-1">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => onSelect(suggestion.query)}
                className="w-full flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 py-1 text-left"
              >
                <span className="text-sm text-x-text dark:text-x-text-dark hover:text-x-blue">
                  {suggestion.query}
                </span>
                {suggestion.count && (
                  <span className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
                    {suggestion.count.toLocaleString()}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function NewsSearch({
  onSearch,
  initialValue = '',
  placeholder = 'Search news articles...',
  className,
  showSuggestions = true,
  showRecentSearches = true,
}: NewsSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('news-recent-searches', []);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback((searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      onSearch(trimmedQuery);
      
      // Add to recent searches (avoid duplicates)
      if (showRecentSearches) {
        setRecentSearches(prev => {
          const filtered = prev.filter(item => item !== trimmedQuery);
          return [trimmedQuery, ...filtered].slice(0, 10); // Keep only 10 recent searches
        });
      }
      
      setIsOpen(false);
    }
  }, [onSearch, showRecentSearches, setRecentSearches]);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(query);
  }, [query, handleSubmit]);

  const handleSuggestionSelect = useCallback((selectedQuery: string) => {
    setQuery(selectedQuery);
    handleSubmit(selectedQuery);
  }, [handleSubmit]);

  const handleRemoveRecent = useCallback((queryToRemove: string) => {
    setRecentSearches(prev => prev.filter(item => item !== queryToRemove));
  }, [setRecentSearches]);

  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  }, [onSearch]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }, []);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <form onSubmit={handleFormSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-x-text-secondary dark:text-x-text-secondary-dark" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              'w-full pl-10 pr-10 py-3 text-sm',
              'bg-white dark:bg-x-dark border border-x-border rounded-lg',
              'focus:outline-none focus:ring-2 focus:ring-x-blue focus:border-transparent',
              'placeholder-x-text-secondary dark:placeholder-x-text-secondary-dark',
              'text-x-text dark:text-x-text-dark'
            )}
            aria-label="Search news articles"
            autoComplete="off"
          />
          
          {query && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-x-text-secondary dark:text-x-text-secondary-dark" />
              </button>
            </div>
          )}
        </div>
        
        {/* Hidden submit button for form submission */}
        <button type="submit" className="sr-only">
          Search
        </button>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && (
        <SearchSuggestions
          suggestions={trendingSearches}
          recentSearches={recentSearches}
          onSelect={handleSuggestionSelect}
          onRemoveRecent={handleRemoveRecent}
          isVisible={isOpen}
        />
      )}
    </div>
  );
}
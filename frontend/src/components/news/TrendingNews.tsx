'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn, getAnimationClasses } from '@/lib/design-system';
import { TrendingUp, Flame, Eye, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { NewsArticle, TrendingTopic } from '@/types';

interface TrendingNewsProps {
  filters?: {
    category?: string;
    region?: string;
    politicalLean?: 'left' | 'center' | 'right';
  };
  onArticleClick?: (article: NewsArticle) => void;
  onTopicClick?: (topic: TrendingTopic) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  maxItems?: number;
}

interface TrendingItem {
  id: string;
  title: string;
  description: string;
  type: 'topic' | 'article';
  trendingScore: number;
  engagementCount: number;
  timeframe: string;
  category?: string;
  politicalReactions?: Record<string, number>;
  url?: string;
  imageUrl?: string;
}

// Mock trending data - in real app this would come from API
const mockTrendingData: TrendingItem[] = [
  {
    id: '1',
    title: 'Climate Summit Negotiations',
    description: 'World leaders discuss carbon emission targets',
    type: 'topic',
    trendingScore: 95,
    engagementCount: 15234,
    timeframe: '2h',
    category: 'WORLD',
    politicalReactions: { conservative: 45, liberal: 78, progressive: 92 },
  },
  {
    id: '2',
    title: 'AI Regulation Bill Passes Senate',
    description: 'New legislation aims to govern artificial intelligence development',
    type: 'article',
    trendingScore: 88,
    engagementCount: 9876,
    timeframe: '4h',
    category: 'TECHNOLOGY',
    url: '/news/ai-regulation-bill',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    politicalReactions: { conservative: 34, liberal: 67, progressive: 23 },
  },
  {
    id: '3',
    title: 'Economic Growth Projections',
    description: 'Federal Reserve updates quarterly outlook',
    type: 'article',
    trendingScore: 76,
    engagementCount: 7654,
    timeframe: '6h',
    category: 'BUSINESS',
    url: '/news/economic-growth-projections',
    politicalReactions: { conservative: 56, liberal: 45, progressive: 34 },
  },
  {
    id: '4',
    title: 'Space Mission Launch',
    description: 'Mars exploration rover successfully deployed',
    type: 'topic',
    trendingScore: 82,
    engagementCount: 12456,
    timeframe: '1h',
    category: 'SCIENCE',
    politicalReactions: { conservative: 67, liberal: 78, progressive: 89 },
  },
  {
    id: '5',
    title: 'Healthcare Reform Debate',
    description: 'Proposed changes to national healthcare system',
    type: 'topic',
    trendingScore: 91,
    engagementCount: 18765,
    timeframe: '3h',
    category: 'POLITICS',
    politicalReactions: { conservative: 23, liberal: 89, progressive: 95 },
  },
];

function TrendingIcon({ score }: { score: number }) {
  if (score >= 90) {
    return <Flame className="w-4 h-4 text-red-500" />;
  }
  if (score >= 70) {
    return <TrendingUp className="w-4 h-4 text-orange-500" />;
  }
  return <Eye className="w-4 h-4 text-blue-500" />;
}

function PoliticalReactionBar({ reactions }: { reactions?: Record<string, number> }) {
  if (!reactions) return null;

  const total = Object.values(reactions).reduce((sum, count) => sum + count, 0);
  if (total === 0) return null;

  const getPercentage = (count: number) => (count / total) * 100;

  return (
    <div className="space-y-1">
      <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
        Political reactions:
      </div>
      <div className="flex h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        {reactions.conservative > 0 && (
          <div
            className="bg-red-500"
            style={{ width: `${getPercentage(reactions.conservative)}%` }}
            title={`Conservative: ${reactions.conservative}`}
          />
        )}
        {reactions.liberal > 0 && (
          <div
            className="bg-blue-500"
            style={{ width: `${getPercentage(reactions.liberal)}%` }}
            title={`Liberal: ${reactions.liberal}`}
          />
        )}
        {reactions.progressive > 0 && (
          <div
            className="bg-green-500"
            style={{ width: `${getPercentage(reactions.progressive)}%` }}
            title={`Progressive: ${reactions.progressive}`}
          />
        )}
      </div>
    </div>
  );
}

function TrendingItemCard({
  item,
  variant,
  onClick,
}: {
  item: TrendingItem;
  variant: string;
  onClick: () => void;
}) {
  const animations = getAnimationClasses();

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className={cn(
          'w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-900/50',
          'border-b border-x-border last:border-b-0 transition-colors',
          animations.fadeIn
        )}
      >
        <div className="flex items-start justify-between space-x-3">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center space-x-2">
              <TrendingIcon score={item.trendingScore} />
              <span className="text-sm font-semibold text-x-text dark:text-x-text-dark line-clamp-1">
                {item.title}
              </span>
            </div>
            <p className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark line-clamp-2">
              {item.description}
            </p>
            <div className="flex items-center space-x-3 text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
              <span>{item.engagementCount.toLocaleString()} reactions</span>
              <span>•</span>
              <span>{item.timeframe} ago</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-x-text-secondary dark:text-x-text-secondary-dark flex-shrink-0" />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 bg-white dark:bg-x-dark rounded-lg border border-x-border',
        'hover:shadow-md dark:hover:shadow-xl transition-all duration-200',
        'hover:-translate-y-0.5',
        animations.fadeIn
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <TrendingIcon score={item.trendingScore} />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-x-text dark:text-x-text-dark line-clamp-2">
                {item.title}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
                <Clock className="w-3 h-3" />
                <span>{item.timeframe} ago</span>
                {item.category && (
                  <>
                    <span>•</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                      {item.category}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-x-text dark:text-x-text-dark">
              {item.trendingScore}
            </div>
            <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
              trending
            </div>
          </div>
        </div>

        <p className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
            {item.engagementCount.toLocaleString()} reactions
          </div>
          <ChevronRight className="w-4 h-4 text-x-text-secondary dark:text-x-text-secondary-dark" />
        </div>

        {variant === 'detailed' && (
          <PoliticalReactionBar reactions={item.politicalReactions} />
        )}
      </div>
    </button>
  );
}

export function TrendingNews({
  filters = {},
  onArticleClick,
  onTopicClick,
  className,
  variant = 'default',
  maxItems = 5,
}: TrendingNewsProps) {
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const animations = getAnimationClasses();

  const fetchTrendingData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter mock data based on current filters
      let filteredData = mockTrendingData;
      
      if (filters.category) {
        filteredData = filteredData.filter(item => item.category === filters.category);
      }
      
      // Sort by trending score and limit results
      const sortedData = filteredData
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .slice(0, maxItems);
      
      setTrendingItems(sortedData);
    } catch (err) {
      setError('Failed to load trending news');
      console.error('Error fetching trending data:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, maxItems]);

  useEffect(() => {
    fetchTrendingData();
  }, [fetchTrendingData]);

  const handleItemClick = useCallback((item: TrendingItem) => {
    if (item.type === 'article' && onArticleClick && item.url) {
      // Convert to NewsArticle format
      const article: NewsArticle = {
        id: item.id,
        title: item.title,
        description: item.description,
        url: item.url,
        imageUrl: item.imageUrl,
        publishedAt: new Date(),
        source: 'Trending News',
        category: item.category || 'GENERAL',
        sentiment: 0,
        relevanceScore: item.trendingScore / 100,
      };
      onArticleClick(article);
    } else if (item.type === 'topic' && onTopicClick) {
      // Convert to TrendingTopic format
      const topic: TrendingTopic = {
        id: item.id,
        hashtag: item.title.toLowerCase().replace(/\s+/g, ''),
        description: item.description,
        postsCount: item.engagementCount,
        participantsCount: Math.floor(item.engagementCount * 0.3),
        trendingScore: item.trendingScore,
        relatedArticles: [],
        politicalReactions: item.politicalReactions || {},
        lastUpdated: new Date(),
      };
      onTopicClick(topic);
    }
  }, [onArticleClick, onTopicClick]);

  if (loading) {
    return (
      <div className={cn('bg-white dark:bg-x-dark rounded-xl border border-x-border p-6', className)}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-x-blue" />
            <h3 className="font-bold text-x-text dark:text-x-text-dark">Trending Now</h3>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || trendingItems.length === 0) {
    return (
      <div className={cn('bg-white dark:bg-x-dark rounded-xl border border-x-border p-6', className)}>
        <div className="text-center space-y-2">
          <TrendingUp className="w-8 h-8 text-gray-400 mx-auto" />
          <h3 className="font-bold text-x-text dark:text-x-text-dark">Trending Now</h3>
          <p className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
            {error || 'No trending topics available'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'bg-white dark:bg-x-dark rounded-xl border border-x-border overflow-hidden',
      animations.slideUp,
      className
    )}>
      <div className="p-4 border-b border-x-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-x-blue" />
            <h3 className="font-bold text-x-text dark:text-x-text-dark">Trending Now</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchTrendingData}
            className="text-xs"
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className={cn(
        variant === 'compact' ? 'divide-y divide-x-border' : 'p-4 space-y-4'
      )}>
        {trendingItems.map((item, index) => (
          <div
            key={item.id}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <TrendingItemCard
              item={item}
              variant={variant}
              onClick={() => handleItemClick(item)}
            />
          </div>
        ))}
      </div>

      {trendingItems.length >= maxItems && (
        <div className="p-4 border-t border-x-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-x-blue hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            View all trending topics
          </Button>
        </div>
      )}
    </div>
  );
}
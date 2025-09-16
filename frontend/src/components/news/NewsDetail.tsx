'use client';

import { useState, useCallback } from 'react';
import { cn, getAnimationClasses } from '@/lib/design-system';
import { formatDistanceToNow } from 'date-fns';
import {
  ArrowLeft,
  ExternalLink,
  Share2,
  Bookmark,
  Heart,
  MessageCircle,
  TrendingUp,
  Clock,
  Globe,
  Tag,
  Users,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PersonaReactions } from './PersonaReactions';
import type { NewsArticle } from '@/types';

interface NewsDetailProps {
  article: NewsArticle;
  onBack?: () => void;
  onShare?: (article: NewsArticle) => void;
  onBookmark?: (article: NewsArticle) => void;
  onRelatedClick?: (article: NewsArticle) => void;
  className?: string;
  showPersonaReactions?: boolean;
  showRelatedArticles?: boolean;
}

interface ArticleStats {
  views: number;
  shares: number;
  bookmarks: number;
  reactions: number;
  readTime: number;
}

// Mock article stats and related articles
const mockStats: ArticleStats = {
  views: 15234,
  shares: 892,
  bookmarks: 445,
  reactions: 1256,
  readTime: 4,
};

const mockRelatedArticles: NewsArticle[] = [
  {
    id: 'related-1',
    title: 'Climate Policy Implementation Challenges',
    description: 'Experts discuss barriers to effective climate legislation',
    url: '/news/climate-policy-challenges',
    imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    source: 'Climate Today',
    category: 'WORLD',
    sentiment: -0.2,
    relevanceScore: 0.85,
  },
  {
    id: 'related-2',
    title: 'Global Carbon Markets Update',
    description: 'Analysis of international carbon trading developments',
    url: '/news/carbon-markets-update',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    source: 'Economic Wire',
    category: 'BUSINESS',
    sentiment: 0.1,
    relevanceScore: 0.78,
  },
  {
    id: 'related-3',
    title: 'Renewable Energy Investment Surge',
    description: 'Private sector increases funding for clean energy projects',
    url: '/news/renewable-investment-surge',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    source: 'Energy Report',
    category: 'TECHNOLOGY',
    sentiment: 0.6,
    relevanceScore: 0.72,
  },
];

function ArticleHeader({ article, onBack, onShare, onBookmark }: {
  article: NewsArticle;
  onBack?: () => void;
  onShare?: (article: NewsArticle) => void;
  onBookmark?: (article: NewsArticle) => void;
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const publishedAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });

  const handleShare = useCallback(() => {
    if (onShare) {
      onShare(article);
    } else if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: article.url,
      });
    } else {
      navigator.clipboard.writeText(article.url);
    }
  }, [article, onShare]);

  const handleBookmark = useCallback(() => {
    setIsBookmarked(!isBookmarked);
    if (onBookmark) {
      onBookmark(article);
    }
  }, [article, isBookmarked, onBookmark]);

  return (
    <div className="space-y-4">
      {/* Navigation and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Share2 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={cn(
              'hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
              isBookmarked && 'text-yellow-500'
            )}
          >
            <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
            className="hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Article Metadata */}
      <div className="flex items-center space-x-4 text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
        <div className="flex items-center space-x-1">
          <Globe className="w-4 h-4" />
          <span className="font-medium">{article.source}</span>
        </div>

        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <time
            dateTime={article.publishedAt.toString()}
            title={new Date(article.publishedAt).toLocaleString()}
          >
            {publishedAgo}
          </time>
        </div>

        <div className="flex items-center space-x-1">
          <Tag className="w-4 h-4" />
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
            {article.category}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{mockStats.readTime} min read</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-x-text dark:text-x-text-dark leading-tight">
        {article.title}
      </h1>

      {/* Description */}
      <p className="text-lg text-x-text-secondary dark:text-x-text-secondary-dark leading-relaxed">
        {article.description}
      </p>
    </div>
  );
}

function ArticleStats({ stats }: { stats: ArticleStats }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-x-text-secondary dark:text-x-text-secondary-dark mb-3">
        Article Statistics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-blue-500 mb-1">
            <Users className="w-4 h-4" />
            <span className="font-bold">{stats.views.toLocaleString()}</span>
          </div>
          <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
            Views
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-green-500 mb-1">
            <Share2 className="w-4 h-4" />
            <span className="font-bold">{stats.shares.toLocaleString()}</span>
          </div>
          <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
            Shares
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-1">
            <Bookmark className="w-4 h-4" />
            <span className="font-bold">{stats.bookmarks.toLocaleString()}</span>
          </div>
          <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
            Bookmarks
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-red-500 mb-1">
            <Heart className="w-4 h-4" />
            <span className="font-bold">{stats.reactions.toLocaleString()}</span>
          </div>
          <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
            Reactions
          </div>
        </div>
      </div>
    </div>
  );
}

function SentimentAnalysis({ article }: { article: NewsArticle }) {
  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.3) return 'text-green-500 bg-green-50 dark:bg-green-900/20';
    if (sentiment < -0.3) return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
  };

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 0.5) return 'Very Positive';
    if (sentiment > 0.1) return 'Positive';
    if (sentiment < -0.5) return 'Very Negative';
    if (sentiment < -0.1) return 'Negative';
    return 'Neutral';
  };

  return (
    <div className="bg-white dark:bg-x-dark border border-x-border rounded-lg p-4">
      <h3 className="text-sm font-medium text-x-text-secondary dark:text-x-text-secondary-dark mb-3">
        Article Analysis
      </h3>
      
      <div className="space-y-4">
        {/* Sentiment */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-x-text dark:text-x-text-dark">Sentiment</span>
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              getSentimentColor(article.sentiment)
            )}>
              {getSentimentLabel(article.sentiment)}
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-500',
                article.sentiment > 0 ? 'bg-green-500' : 'bg-red-500'
              )}
              style={{ width: `${Math.abs(article.sentiment) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-x-text-secondary dark:text-x-text-secondary-dark mt-1">
            <span>Negative</span>
            <span>Neutral</span>
            <span>Positive</span>
          </div>
        </div>

        {/* Relevance Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-x-text dark:text-x-text-dark">Relevance</span>
            <span className="text-sm font-medium text-x-text dark:text-x-text-dark">
              {(article.relevanceScore * 100).toFixed(0)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${article.relevanceScore * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function RelatedArticles({
  articles,
  onArticleClick,
}: {
  articles: NewsArticle[];
  onArticleClick?: (article: NewsArticle) => void;
}) {
  return (
    <div className="bg-white dark:bg-x-dark border border-x-border rounded-lg p-4">
      <h3 className="text-lg font-bold text-x-text dark:text-x-text-dark mb-4">
        Related Articles
      </h3>
      
      <div className="space-y-4">
        {articles.map((article) => {
          const publishedAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });
          
          return (
            <button
              key={article.id}
              onClick={() => onArticleClick?.(article)}
              className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg transition-colors"
            >
              <div className="flex space-x-3">
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-medium text-x-text dark:text-x-text-dark line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>{publishedAgo}</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                      {article.category}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function NewsDetail({
  article,
  onBack,
  onShare,
  onBookmark,
  onRelatedClick,
  className,
  showPersonaReactions = true,
  showRelatedArticles = true,
}: NewsDetailProps) {
  const animations = getAnimationClasses();

  return (
    <div className={cn('max-w-4xl mx-auto space-y-8', animations.fadeIn, className)}>
      {/* Main Article */}
      <article className="bg-white dark:bg-x-dark rounded-xl border border-x-border overflow-hidden">
        {/* Article Image */}
        {article.imageUrl && (
          <div className="aspect-video bg-gray-100 dark:bg-gray-800">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="p-8 space-y-6">
          <ArticleHeader
            article={article}
            onBack={onBack}
            onShare={onShare}
            onBookmark={onBookmark}
          />

          {/* Article Body - This would be the full content in a real app */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-x-text dark:text-x-text-dark leading-relaxed">
              This is where the full article content would appear. In a real application,
              this would be fetched from the news API and could include rich formatting,
              embedded media, and other content elements.
            </p>
            <p className="text-x-text dark:text-x-text-dark leading-relaxed">
              The article would be properly formatted with paragraphs, headings, lists,
              and other elements that make up a complete news article. The content would
              be responsive and accessible to all users.
            </p>
          </div>

          {/* Call to Action */}
          <div className="border-t border-x-border pt-6">
            <Button
              onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
              className="w-full sm:w-auto"
            >
              Read Full Article on {article.source}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </article>

      {/* Sidebar Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Persona Reactions */}
          {showPersonaReactions && (
            <PersonaReactions
              article={article}
              variant="detailed"
              className="bg-white dark:bg-x-dark rounded-xl border border-x-border p-6"
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Article Statistics */}
          <ArticleStats stats={mockStats} />

          {/* Sentiment Analysis */}
          <SentimentAnalysis article={article} />

          {/* Related Articles */}
          {showRelatedArticles && (
            <RelatedArticles
              articles={mockRelatedArticles}
              onArticleClick={onRelatedClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}
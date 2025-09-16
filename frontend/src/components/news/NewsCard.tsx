'use client';

import { useState, useCallback } from 'react';
import { cn, getAnimationClasses, getPoliticalColorClasses } from '@/lib/design-system';
import { formatDistanceToNow } from 'date-fns';
import {
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  Bot,
  Clock,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PersonaReactions } from './PersonaReactions';
import type { NewsArticle } from '@/types';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  showPersonaReactions?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (article: NewsArticle) => void;
  onPersonaReaction?: (article: NewsArticle) => void;
  onShare?: (article: NewsArticle) => void;
  onBookmark?: (article: NewsArticle) => void;
}

function ArticleImage({ article, variant }: { article: NewsArticle; variant: string }) {
  if (!article.imageUrl) return null;

  const imageSize = {
    compact: 'w-16 h-16',
    default: 'w-full h-48',
    detailed: 'w-full h-64',
  }[variant] || 'w-full h-48';

  return (
    <div className={cn(
      'overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800',
      variant === 'compact' ? 'flex-shrink-0' : 'mb-4'
    )}>
      <img
        src={article.imageUrl}
        alt={article.title}
        className={cn(
          imageSize,
          'object-cover transition-transform duration-200 hover:scale-105'
        )}
        loading="lazy"
      />
    </div>
  );
}

function ArticleMetadata({ article, variant }: { article: NewsArticle; variant: string }) {
  const publishedAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });
  const iconSize = variant === 'compact' ? 'w-3 h-3' : 'w-4 h-4';
  const textSize = variant === 'compact' ? 'text-xs' : 'text-sm';

  return (
    <div className={cn(
      'flex items-center space-x-4 text-x-text-secondary dark:text-x-text-secondary-dark',
      textSize
    )}>
      {/* Source */}
      <div className="flex items-center space-x-1">
        <Globe className={iconSize} />
        <span className="font-medium">{article.source}</span>
      </div>

      {/* Published time */}
      <div className="flex items-center space-x-1">
        <Clock className={iconSize} />
        <time
          dateTime={article.publishedAt.toString()}
          title={new Date(article.publishedAt).toLocaleString()}
        >
          {publishedAgo}
        </time>
      </div>

      {/* Category */}
      <div className={cn(
        'px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800',
        'text-gray-700 dark:text-gray-300'
      )}>
        {article.category}
      </div>

      {/* Political lean indicator */}
      {article.politicalLean && (
        <div
          className={cn(
            'w-2 h-2 rounded-full',
            article.politicalLean === 'left' && 'bg-blue-500',
            article.politicalLean === 'center' && 'bg-gray-500',
            article.politicalLean === 'right' && 'bg-red-500'
          )}
          title={`Political lean: ${article.politicalLean}`}
        />
      )}
    </div>
  );
}

function ArticleScores({ article, variant }: { article: NewsArticle; variant: string }) {
  const textSize = variant === 'compact' ? 'text-xs' : 'text-sm';
  const iconSize = variant === 'compact' ? 'w-3 h-3' : 'w-4 h-4';

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.3) return 'text-green-500';
    if (sentiment < -0.3) return 'text-red-500';
    return 'text-gray-500';
  };

  const getImpactColor = (impact: number) => {
    if (impact > 70) return 'text-orange-500';
    if (impact > 40) return 'text-yellow-500';
    return 'text-gray-500';
  };

  return (
    <div className={cn(
      'flex items-center space-x-3',
      textSize,
      'text-x-text-secondary dark:text-x-text-secondary-dark'
    )}>
      {/* Sentiment Score */}
      <div className="flex items-center space-x-1">
        <Heart className={cn(iconSize, getSentimentColor(article.sentiment))} />
        <span className={getSentimentColor(article.sentiment)}>
          {article.sentiment > 0 ? '+' : ''}{(article.sentiment * 100).toFixed(0)}%
        </span>
      </div>

      {/* Impact Score */}
      <div className="flex items-center space-x-1">
        <TrendingUp className={cn(iconSize, getImpactColor(article.relevanceScore * 100))} />
        <span className={getImpactColor(article.relevanceScore * 100)}>
          {(article.relevanceScore * 100).toFixed(0)}
        </span>
      </div>
    </div>
  );
}

function ArticleActions({
  article,
  variant,
  onShare,
  onBookmark,
}: {
  article: NewsArticle;
  variant: string;
  onShare?: (article: NewsArticle) => void;
  onBookmark?: (article: NewsArticle) => void;
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const iconSize = variant === 'compact' ? 'w-4 h-4' : 'w-5 h-5';

  const handleShare = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(article);
    } else {
      // Fallback to native sharing
      if (navigator.share) {
        navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
      } else {
        navigator.clipboard.writeText(article.url);
      }
    }
  }, [article, onShare]);

  const handleBookmark = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    if (onBookmark) {
      onBookmark(article);
    }
  }, [article, isBookmarked, onBookmark]);

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
        aria-label="Share article"
      >
        <Share2 className={iconSize} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        className={cn(
          'hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
          isBookmarked && 'text-yellow-500'
        )}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
      >
        <Bookmark className={cn(iconSize, isBookmarked && 'fill-current')} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          window.open(article.url, '_blank', 'noopener,noreferrer');
        }}
        className="hover:bg-gray-50 dark:hover:bg-gray-800"
        aria-label="Read full article"
      >
        <ExternalLink className={iconSize} />
      </Button>
    </div>
  );
}

export function NewsCard({
  article,
  variant = 'default',
  showActions = true,
  showPersonaReactions = true,
  className,
  style,
  onClick,
  onPersonaReaction,
  onShare,
  onBookmark,
}: NewsCardProps) {
  const animations = getAnimationClasses();

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(article);
    }
  }, [article, onClick]);

  const handlePersonaReaction = useCallback(() => {
    if (onPersonaReaction) {
      onPersonaReaction(article);
    }
  }, [article, onPersonaReaction]);

  // Compact variant for lists and sidebar
  if (variant === 'compact') {
    return (
      <article
        className={cn(
          'flex space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50',
          'border-b border-x-border last:border-b-0 transition-colors duration-200',
          onClick && 'cursor-pointer',
          animations.fadeIn,
          className
        )}
        style={style}
        onClick={handleClick}
      >
        <ArticleImage article={article} variant={variant} />

        <div className="flex-1 min-w-0 space-y-2">
          <h3 className="font-semibold text-x-text dark:text-x-text-dark line-clamp-2 leading-tight">
            {article.title}
          </h3>

          <p className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark line-clamp-2">
            {article.description}
          </p>

          <ArticleMetadata article={article} variant={variant} />

          {showActions && (
            <div onClick={(e) => e.stopPropagation()}>
              <ArticleActions
                article={article}
                variant={variant}
                onShare={onShare}
                onBookmark={onBookmark}
              />
            </div>
          )}
        </div>
      </article>
    );
  }

  // Default and detailed variants
  return (
    <article
      className={cn(
        'bg-white dark:bg-x-dark rounded-xl border border-x-border overflow-hidden',
        'hover:shadow-lg dark:hover:shadow-2xl transition-all duration-200',
        onClick && 'cursor-pointer hover:-translate-y-1',
        animations.fadeIn,
        className
      )}
      style={style}
      onClick={handleClick}
    >
      <ArticleImage article={article} variant={variant} />

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-3">
          <ArticleMetadata article={article} variant={variant} />

          <h2 className={cn(
            'font-bold text-x-text dark:text-x-text-dark leading-tight',
            variant === 'detailed' ? 'text-xl' : 'text-lg'
          )}>
            {article.title}
          </h2>

          <p className="text-x-text-secondary dark:text-x-text-secondary-dark leading-relaxed">
            {article.description}
          </p>
        </div>

        {/* Scores and Metrics */}
        <ArticleScores article={article} variant={variant} />

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-2 border-t border-x-border" onClick={(e) => e.stopPropagation()}>
            <ArticleActions
              article={article}
              variant={variant}
              onShare={onShare}
              onBookmark={onBookmark}
            />

            {showPersonaReactions && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePersonaReaction}
                className="flex items-center space-x-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <Bot className="w-4 h-4" />
                <span className="text-sm">AI Reactions</span>
              </Button>
            )}
          </div>
        )}

        {/* AI Persona Reactions */}
        {showPersonaReactions && (
          <PersonaReactions
            article={article}
            variant="preview"
            className="border-t border-x-border pt-4"
          />
        )}
      </div>
    </article>
  );
}
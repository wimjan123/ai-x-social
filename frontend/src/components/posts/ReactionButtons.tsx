'use client';

import { useState, useCallback } from 'react';
import { cn, getEngagementColor, getAnimationClasses } from '@/lib/design-system';
import { Heart, MessageCircle, Repeat2, Share, Bookmark } from 'lucide-react';
import type { Post, EngagementType } from '@/types';

interface ReactionButtonsProps {
  post: Post;
  onLike?: (postId: string) => Promise<void>;
  onReply?: (postId: string) => void;
  onRepost?: (postId: string) => Promise<void>;
  onShare?: (postId: string) => void;
  onBookmark?: (postId: string) => Promise<void>;
  showCounts?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface ReactionButtonProps {
  icon: React.ReactNode;
  count?: number;
  isActive: boolean;
  isLoading?: boolean;
  color: string;
  onClick: () => void;
  ariaLabel: string;
  size: 'sm' | 'md' | 'lg';
  showCount: boolean;
}

function ReactionButton({
  icon,
  count,
  isActive,
  isLoading,
  color,
  onClick,
  ariaLabel,
  size,
  showCount,
}: ReactionButtonProps) {
  const sizeClasses = {
    sm: 'p-1.5 text-sm',
    md: 'p-2',
    lg: 'p-2.5 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const animations = getAnimationClasses();

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        'flex items-center space-x-1 group transition-all duration-200 rounded-full',
        sizeClasses[size],
        isActive
          ? `text-${color} bg-${color}/10`
          : 'text-x-light-gray hover:text-${color} hover:bg-${color}/10',
        isLoading && 'cursor-not-allowed opacity-50'
      )}
      aria-label={ariaLabel}
    >
      <div
        className={cn(
          'flex items-center justify-center transition-transform',
          iconSizes[size],
          isActive && (color === 'engagement-like' && animations.likeBurst),
          isActive && (color === 'engagement-repost' && animations.repostSpin)
        )}
      >
        {icon}
      </div>
      {showCount && count !== undefined && count > 0 && (
        <span className="text-xs font-medium min-w-0">
          {count > 999 ? `${Math.floor(count / 1000)}K` : count}
        </span>
      )}
    </button>
  );
}

export function ReactionButtons({
  post,
  onLike,
  onReply,
  onRepost,
  onShare,
  onBookmark,
  showCounts = true,
  size = 'md',
  className,
}: ReactionButtonsProps) {
  const [loadingStates, setLoadingStates] = useState<Record<EngagementType, boolean>>({
    like: false,
    repost: false,
    comment: false,
    share: false,
    bookmark: false,
  });

  const setLoading = useCallback((action: EngagementType, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [action]: loading }));
  }, []);

  const handleLike = useCallback(async () => {
    if (!onLike || loadingStates.like) return;

    setLoading('like', true);
    try {
      await onLike(post.id);
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setLoading('like', false);
    }
  }, [onLike, post.id, loadingStates.like, setLoading]);

  const handleRepost = useCallback(async () => {
    if (!onRepost || loadingStates.repost) return;

    setLoading('repost', true);
    try {
      await onRepost(post.id);
    } catch (error) {
      console.error('Failed to repost:', error);
    } finally {
      setLoading('repost', false);
    }
  }, [onRepost, post.id, loadingStates.repost, setLoading]);

  const handleBookmark = useCallback(async () => {
    if (!onBookmark || loadingStates.bookmark) return;

    setLoading('bookmark', true);
    try {
      await onBookmark(post.id);
    } catch (error) {
      console.error('Failed to bookmark post:', error);
    } finally {
      setLoading('bookmark', false);
    }
  }, [onBookmark, post.id, loadingStates.bookmark, setLoading]);

  const handleReply = useCallback(() => {
    if (onReply) {
      onReply(post.id);
    }
  }, [onReply, post.id]);

  const handleShare = useCallback(() => {
    if (onShare) {
      onShare(post.id);
    }
  }, [onShare, post.id]);

  return (
    <div className={cn('flex items-center justify-between max-w-md', className)}>
      {/* Reply Button */}
      <ReactionButton
        icon={<MessageCircle className="w-full h-full" />}
        count={showCounts ? post.repliesCount : undefined}
        isActive={false}
        isLoading={loadingStates.comment}
        color={getEngagementColor('comment')}
        onClick={handleReply}
        ariaLabel={`Reply to post by ${post.author.displayName || post.author.username}`}
        size={size}
        showCount={showCounts}
      />

      {/* Repost Button */}
      <ReactionButton
        icon={<Repeat2 className="w-full h-full" />}
        count={showCounts ? post.repostsCount : undefined}
        isActive={post.isReposted}
        isLoading={loadingStates.repost}
        color={getEngagementColor('repost')}
        onClick={handleRepost}
        ariaLabel={`${post.isReposted ? 'Undo repost' : 'Repost'} post by ${post.author.displayName || post.author.username}`}
        size={size}
        showCount={showCounts}
      />

      {/* Like Button */}
      <ReactionButton
        icon={<Heart className={cn('w-full h-full', post.isLiked && 'fill-current')} />}
        count={showCounts ? post.likesCount : undefined}
        isActive={post.isLiked}
        isLoading={loadingStates.like}
        color={getEngagementColor('like')}
        onClick={handleLike}
        ariaLabel={`${post.isLiked ? 'Unlike' : 'Like'} post by ${post.author.displayName || post.author.username}`}
        size={size}
        showCount={showCounts}
      />

      {/* Share Button */}
      <ReactionButton
        icon={<Share className="w-full h-full" />}
        count={undefined}
        isActive={false}
        isLoading={loadingStates.share}
        color={getEngagementColor('share')}
        onClick={handleShare}
        ariaLabel={`Share post by ${post.author.displayName || post.author.username}`}
        size={size}
        showCount={false}
      />

      {/* Bookmark Button */}
      <ReactionButton
        icon={<Bookmark className={cn('w-full h-full', post.isBookmarked && 'fill-current')} />}
        count={undefined}
        isActive={post.isBookmarked}
        isLoading={loadingStates.bookmark}
        color={getEngagementColor('bookmark')}
        onClick={handleBookmark}
        ariaLabel={`${post.isBookmarked ? 'Remove from' : 'Add to'} bookmarks`}
        size={size}
        showCount={false}
      />
    </div>
  );
}
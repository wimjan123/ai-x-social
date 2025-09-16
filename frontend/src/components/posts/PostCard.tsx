'use client';

import { useState, useCallback } from 'react';
import { cn, getPoliticalColorClasses, getAnimationClasses } from '@/lib/design-system';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, CheckCircle, Bot } from 'lucide-react';
import { ReactionButtons } from './ReactionButtons';
import { HashtagLink } from './HashtagLink';
import { MentionLink } from './MentionLink';
import { MediaPreview } from './MediaPreview';
import type { Post, PostComponentProps, User, AIPersona } from '@/types';

interface PostCardProps extends PostComponentProps {
  onUserClick?: (user: User | AIPersona) => void;
  onPostClick?: (post: Post) => void;
  onLike?: (postId: string) => Promise<void>;
  onReply?: (postId: string) => void;
  onRepost?: (postId: string) => Promise<void>;
  onShare?: (postId: string) => void;
  onBookmark?: (postId: string) => Promise<void>;
  onMenuClick?: (post: Post) => void;
}

function PostContent({ content }: { content: string }) {
  // Simple parser for hashtags and mentions
  const parseContent = (text: string) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith('#') && part.length > 1) {
        return <HashtagLink key={index} hashtag={part.slice(1)} />;
      }
      if (part.startsWith('@') && part.length > 1) {
        return <MentionLink key={index} username={part.slice(1)} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="text-x-text dark:text-x-text-dark leading-relaxed whitespace-pre-wrap">
      {parseContent(content)}
    </div>
  );
}

function UserBadge({ user }: { user: User | AIPersona }) {
  const isAI = 'personality' in user;
  const isVerified = 'verified' in user ? user.verified : false;

  if (isAI) {
    return (
      <div className="flex items-center space-x-1">
        <Bot className="w-4 h-4 text-x-blue" />
        <span className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
          AI
        </span>
      </div>
    );
  }

  if (isVerified) {
    return <CheckCircle className="w-4 h-4 text-x-blue" />;
  }

  return null;
}

function PoliticalIndicator({ user }: { user: User | AIPersona }) {
  const politicalAlignment = 'politicalAlignment' in user && user.politicalAlignment
    ? user.politicalAlignment.position
    : undefined;

  if (!politicalAlignment) return null;

  return (
    <div
      className={cn(
        'w-2 h-2 rounded-full',
        `bg-political-${politicalAlignment}-500`
      )}
      title={`Political alignment: ${politicalAlignment}`}
    />
  );
}

export function PostCard({
  post,
  showThread = false,
  showActions = true,
  className,
  onUserClick,
  onPostClick,
  onLike,
  onReply,
  onRepost,
  onShare,
  onBookmark,
  onMenuClick,
}: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const animations = getAnimationClasses();

  const handleUserClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUserClick) {
      onUserClick(post.author);
    }
  }, [onUserClick, post.author]);

  const handlePostClick = useCallback(() => {
    if (onPostClick) {
      onPostClick(post);
    }
  }, [onPostClick, post]);

  const handleMenuClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMenuClick) {
      onMenuClick(post);
    }
  }, [onMenuClick, post]);

  const isLongContent = post.content.length > 280;
  const shouldTruncate = isLongContent && !isExpanded;
  const displayContent = shouldTruncate ? `${post.content.slice(0, 280)}...` : post.content;

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <article
      className={cn(
        'border-b border-x-border hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-200',
        onPostClick && 'cursor-pointer',
        animations.fadeIn,
        className
      )}
      onClick={handlePostClick}
    >
      <div className="p-4">
        <div className="flex space-x-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <button
              onClick={handleUserClick}
              className="block hover:opacity-80 transition-opacity"
            >
              <img
                src={post.author.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author.username}`}
                alt={post.author.displayName || post.author.username}
                className="w-12 h-12 rounded-full"
              />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-1">
              <button
                onClick={handleUserClick}
                className="flex items-center space-x-1 hover:underline group"
              >
                <span className="font-semibold text-x-text dark:text-x-text-dark truncate">
                  {post.author.displayName || post.author.username}
                </span>
                <UserBadge user={post.author} />
              </button>

              <span className="text-x-text-secondary dark:text-x-text-secondary-dark">
                @{post.author.username}
              </span>

              <PoliticalIndicator user={post.author} />

              <span className="text-x-text-secondary dark:text-x-text-secondary-dark">·</span>

              <time
                dateTime={post.createdAt.toString()}
                className="text-x-text-secondary dark:text-x-text-secondary-dark hover:underline"
                title={new Date(post.createdAt).toLocaleString()}
              >
                {timeAgo}
              </time>

              <div className="flex-1" />

              {/* Menu Button */}
              {onMenuClick && (
                <button
                  onClick={handleMenuClick}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="More options"
                >
                  <MoreHorizontal className="w-4 h-4 text-x-text-secondary dark:text-x-text-secondary-dark" />
                </button>
              )}
            </div>

            {/* Parent Post Context (for replies) */}
            {post.parentPost && showThread && (
              <div className="mb-2 text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
                Replying to{' '}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onUserClick) {
                      onUserClick(post.parentPost!.author);
                    }
                  }}
                  className="text-x-blue hover:underline"
                >
                  @{post.parentPost.author.username}
                </button>
              </div>
            )}

            {/* Post Content */}
            <div className="mb-3">
              <PostContent content={displayContent} />

              {shouldTruncate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                  }}
                  className="text-x-blue hover:underline mt-1"
                >
                  Show more
                </button>
              )}
            </div>

            {/* Media Preview */}
            {post.images && post.images.length > 0 && (
              <div className="mb-3">
                <MediaPreview
                  images={post.images}
                  alt={`Media from post by ${post.author.displayName || post.author.username}`}
                />
              </div>
            )}

            {/* Actions */}
            {showActions && (
              <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                <ReactionButtons
                  post={post}
                  onLike={onLike}
                  onReply={onReply}
                  onRepost={onRepost}
                  onShare={onShare}
                  onBookmark={onBookmark}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
'use client';

import { useState, useMemo } from 'react';
import { cn, getAnimationClasses } from '@/lib/design-system';
import { MessageCircle, TrendingUp } from 'lucide-react';
import { PostCard } from './PostCard';
import { PostComposer } from './PostComposer';
import type { Post, User, AIPersona, CreatePostForm } from '@/types';

interface PostThreadProps {
  mainPost: Post;
  replies?: Post[];
  currentUser?: User | AIPersona;
  maxDepth?: number;
  showComposer?: boolean;
  onPostClick?: (post: Post) => void;
  onUserClick?: (user: User | AIPersona) => void;
  onLike?: (postId: string) => Promise<void>;
  onReply?: (post: CreatePostForm) => Promise<void>;
  onRepost?: (postId: string) => Promise<void>;
  onShare?: (postId: string) => void;
  onBookmark?: (postId: string) => Promise<void>;
  className?: string;
}

interface ThreadNode {
  post: Post;
  children: ThreadNode[];
  depth: number;
}

function buildThreadTree(posts: Post[], parentId: string | null = null, depth = 0): ThreadNode[] {
  return posts
    .filter(post => post.parentPostId === parentId)
    .map(post => ({
      post,
      children: buildThreadTree(posts, post.id, depth + 1),
      depth,
    }))
    .sort((a, b) => {
      // Sort by likes, then by date
      const likeDiff = b.post.likesCount - a.post.likesCount;
      if (likeDiff !== 0) return likeDiff;
      return new Date(a.post.createdAt).getTime() - new Date(b.post.createdAt).getTime();
    });
}

function ThreadNode({
  node,
  maxDepth,
  onPostClick,
  onUserClick,
  onLike,
  onRepost,
  onShare,
  onBookmark,
}: {
  node: ThreadNode;
  maxDepth: number;
  onPostClick?: (post: Post) => void;
  onUserClick?: (user: User | AIPersona) => void;
  onLike?: (postId: string) => Promise<void>;
  onRepost?: (postId: string) => Promise<void>;
  onShare?: (postId: string) => void;
  onBookmark?: (postId: string) => Promise<void>;
}) {
  const [isExpanded, setIsExpanded] = useState(node.depth < 3); // Auto-expand first 3 levels
  const animations = getAnimationClasses();

  const hasChildren = node.children.length > 0;
  const shouldShowDepthLimit = node.depth >= maxDepth && hasChildren;

  return (
    <div className="relative">
      {/* Thread Connection Line */}
      {node.depth > 0 && (
        <div className="absolute left-6 top-0 w-px bg-x-border dark:bg-x-border-dark h-4" />
      )}

      {/* Post Content */}
      <div className={cn(node.depth > 0 && 'ml-12')}>
        <PostCard
          post={node.post}
          showThread={true}
          onPostClick={onPostClick}
          onUserClick={onUserClick}
          onLike={onLike}
          onRepost={onRepost}
          onShare={onShare}
          onBookmark={onBookmark}
          className={cn(
            'border-b-0 last:border-b',
            animations.slideUp
          )}
        />

        {/* Thread Actions */}
        {hasChildren && (
          <div className="px-4 pb-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 text-x-blue hover:underline text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>
                {isExpanded ? 'Hide' : 'Show'} {node.children.length}
                {node.children.length === 1 ? ' reply' : ' replies'}
              </span>
            </button>
          </div>
        )}

        {/* Depth Limit Warning */}
        {shouldShowDepthLimit && (
          <div className="px-4 pb-2">
            <div className="flex items-center space-x-2 text-x-text-secondary dark:text-x-text-secondary-dark text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>
                Thread continues with {node.children.length} more{' '}
                {node.children.length === 1 ? 'reply' : 'replies'}
              </span>
              <button
                onClick={() => {
                  const firstChild = node.children[0];
                  if (firstChild && onPostClick) {
                    onPostClick(firstChild.post);
                  }
                }}
                className="text-x-blue hover:underline"
              >
                View thread
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Child Replies */}
      {isExpanded && !shouldShowDepthLimit && (
        <div className="border-l-2 border-x-border dark:border-x-border-dark ml-6">
          {node.children.map(child => (
            <ThreadNode
              key={child.post.id}
              node={child}
              maxDepth={maxDepth}
              onPostClick={onPostClick}
              onUserClick={onUserClick}
              onLike={onLike}
              onRepost={onRepost}
              onShare={onShare}
              onBookmark={onBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ThreadStats({ replies }: { replies: Post[] }) {
  const totalReplies = replies.length;
  const uniqueUsers = new Set(replies.map(reply => reply.author.id)).size;

  if (totalReplies === 0) return null;

  return (
    <div className="px-4 py-3 border-b border-x-border text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
      <div className="flex items-center space-x-4">
        <span>
          <strong className="text-x-text dark:text-x-text-dark">{totalReplies}</strong>{' '}
          {totalReplies === 1 ? 'reply' : 'replies'}
        </span>
        {uniqueUsers > 1 && (
          <span>
            from <strong className="text-x-text dark:text-x-text-dark">{uniqueUsers}</strong>{' '}
            {uniqueUsers === 1 ? 'user' : 'users'}
          </span>
        )}
      </div>
    </div>
  );
}

export function PostThread({
  mainPost,
  replies = [],
  currentUser,
  maxDepth = 5,
  showComposer = true,
  onPostClick,
  onUserClick,
  onLike,
  onReply,
  onRepost,
  onShare,
  onBookmark,
  className,
}: PostThreadProps) {
  const [showReplyComposer, setShowReplyComposer] = useState(false);

  const threadTree = useMemo(() => {
    const allPosts = [mainPost, ...replies];
    return buildThreadTree(allPosts, null);
  }, [mainPost, replies]);

  const handleReplyClick = () => {
    setShowReplyComposer(true);
  };

  const handleReplySubmit = async (replyData: CreatePostForm) => {
    if (onReply) {
      await onReply({
        ...replyData,
        parentPostId: mainPost.id,
      });
      setShowReplyComposer(false);
    }
  };

  const handleReplyCancel = () => {
    setShowReplyComposer(false);
  };

  return (
    <div className={cn('bg-white dark:bg-x-dark', className)}>
      {/* Main Post */}
      <PostCard
        post={mainPost}
        showThread={false}
        onPostClick={onPostClick}
        onUserClick={onUserClick}
        onLike={onLike}
        onReply={handleReplyClick}
        onRepost={onRepost}
        onShare={onShare}
        onBookmark={onBookmark}
        className="border-b border-x-border"
      />

      {/* Thread Stats */}
      <ThreadStats replies={replies} />

      {/* Reply Composer */}
      {showComposer && currentUser && (
        <div className="border-b border-x-border">
          {showReplyComposer ? (
            <PostComposer
              user={currentUser}
              onSubmit={handleReplySubmit}
              onCancel={handleReplyCancel}
              parentPostId={mainPost.id}
              placeholder={`Reply to ${mainPost.author.displayName || mainPost.author.username}`}
            />
          ) : (
            <div className="p-4">
              <div className="flex space-x-3">
                <img
                  src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.username}`}
                  alt={currentUser.displayName || currentUser.username}
                  className="w-12 h-12 rounded-full"
                />
                <button
                  onClick={() => setShowReplyComposer(true)}
                  className="flex-1 text-left p-3 text-xl text-x-text-secondary dark:text-x-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  Post your reply
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reply Thread */}
      {threadTree.map(node => (
        <ThreadNode
          key={node.post.id}
          node={node}
          maxDepth={maxDepth}
          onPostClick={onPostClick}
          onUserClick={onUserClick}
          onLike={onLike}
          onRepost={onRepost}
          onShare={onShare}
          onBookmark={onBookmark}
        />
      ))}

      {/* Load More Indicator */}
      {replies.length > 50 && (
        <div className="p-4 text-center">
          <button className="text-x-blue hover:underline">
            Load more replies
          </button>
        </div>
      )}
    </div>
  );
}
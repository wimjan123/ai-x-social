'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PostCard } from '@/components/posts/PostCard';
import { PostComposer } from '@/components/posts/PostComposer';
import { Button } from '@/components/ui/Button';
import { cn, getAnimationClasses } from '@/lib/design-system';
import { apiClient } from '@/services/api';
import { RefreshCw, Filter, Sparkles, Home, TrendingUp } from 'lucide-react';
import type {
  Post,
  User,
  AIPersona,
  CreatePostForm,
  ApiResponse
} from '@/types';

interface FeedFilters {
  type: 'home' | 'trending' | 'ai' | 'following';
  timeframe?: 'day' | 'week' | 'month';
}

interface FeedPageState {
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  filter: FeedFilters;
  user: User | AIPersona | null;
}

// Server-Sent Events hook for real-time updates
function useSSEFeed(filter: FeedFilters) {
  const [newPosts, setNewPosts] = useState<Post[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Create new SSE connection
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/feed/stream?type=${filter.type}&timeframe=${filter.timeframe || 'day'}`
    );

    eventSource.onmessage = (event) => {
      try {
        const post: Post = JSON.parse(event.data);
        setNewPosts(prev => [post, ...prev.slice(0, 9)]); // Keep last 10 new posts
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
    };

    eventSourceRef.current = eventSource;

    // Cleanup on unmount or dependency change
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [filter.type, filter.timeframe]);

  const clearNewPosts = useCallback(() => {
    setNewPosts([]);
  }, []);

  return { newPosts, clearNewPosts };
}

// Mock user for now - in real app this would come from auth context
const mockUser: User = {
  id: 'user-1',
  username: 'johndoe',
  displayName: 'John Doe',
  email: 'john@example.com',
  avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=johndoe',
  bio: 'Political enthusiast and social media user',
  verified: false,
  followersCount: 1250,
  followingCount: 386,
  postsCount: 2847,
  influenceScore: 67,
  createdAt: new Date('2023-01-15'),
  updatedAt: new Date(),
};

export default function FeedPage() {
  const animations = getAnimationClasses();

  const [state, setState] = useState<FeedPageState>({
    posts: [],
    loading: true,
    refreshing: false,
    error: null,
    hasMore: true,
    page: 1,
    filter: { type: 'home' },
    user: mockUser,
  });

  const { newPosts, clearNewPosts } = useSSEFeed(state.filter);

  // Load posts from API
  const loadPosts = useCallback(async (
    filter: FeedFilters,
    page: number = 1,
    append: boolean = false
  ) => {
    try {
      setState(prev => ({
        ...prev,
        loading: !append,
        refreshing: append ? false : page === 1
      }));

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        type: filter.type,
        ...(filter.timeframe && { timeframe: filter.timeframe }),
      });

      const response: ApiResponse<{ posts: Post[]; hasMore: boolean }> =
        await apiClient.get(`/feed?${queryParams}`);

      setState(prev => ({
        ...prev,
        posts: append ? [...prev.posts, ...response.data.posts] : response.data.posts,
        hasMore: response.data.hasMore,
        page: append ? page : 1,
        loading: false,
        refreshing: false,
        error: null,
      }));
    } catch (error) {
      console.error('Failed to load posts:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: 'Failed to load feed. Please try again.',
      }));
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadPosts(state.filter);
  }, [state.filter, loadPosts]);

  // Filter change handler
  const handleFilterChange = useCallback((newFilter: FeedFilters) => {
    setState(prev => ({ ...prev, filter: newFilter }));
  }, []);

  // Post creation handler
  const handleCreatePost = useCallback(async (postData: CreatePostForm) => {
    if (!state.user) return;

    try {
      const response: ApiResponse<Post> = await apiClient.post('/posts', postData);

      // Add new post to top of feed
      setState(prev => ({
        ...prev,
        posts: [response.data, ...prev.posts],
      }));
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  }, [state.user]);

  // Post interaction handlers
  const handleLike = useCallback(async (postId: string) => {
    try {
      await apiClient.post(`/posts/${postId}/like`);

      setState(prev => ({
        ...prev,
        posts: prev.posts.map(post =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
              }
            : post
        ),
      }));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  }, []);

  const handleRepost = useCallback(async (postId: string) => {
    try {
      await apiClient.post(`/posts/${postId}/repost`);

      setState(prev => ({
        ...prev,
        posts: prev.posts.map(post =>
          post.id === postId
            ? {
                ...post,
                isReposted: !post.isReposted,
                repostsCount: post.isReposted ? post.repostsCount - 1 : post.repostsCount + 1,
              }
            : post
        ),
      }));
    } catch (error) {
      console.error('Failed to repost:', error);
    }
  }, []);

  const handleBookmark = useCallback(async (postId: string) => {
    try {
      await apiClient.post(`/posts/${postId}/bookmark`);

      setState(prev => ({
        ...prev,
        posts: prev.posts.map(post =>
          post.id === postId
            ? { ...post, isBookmarked: !post.isBookmarked }
            : post
        ),
      }));
    } catch (error) {
      console.error('Failed to bookmark post:', error);
    }
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!state.loading && state.hasMore) {
      loadPosts(state.filter, state.page + 1, true);
    }
  }, [state.loading, state.hasMore, state.filter, state.page, loadPosts]);

  const handleRefresh = useCallback(() => {
    loadPosts(state.filter, 1, false);
    clearNewPosts();
  }, [state.filter, loadPosts, clearNewPosts]);

  const handleShowNewPosts = useCallback(() => {
    setState(prev => ({
      ...prev,
      posts: [...newPosts, ...prev.posts],
    }));
    clearNewPosts();
  }, [newPosts, clearNewPosts]);

  const filterButtons = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-4 h-4" />,
      filter: { type: 'home' as const }
    },
    {
      id: 'trending',
      label: 'Trending',
      icon: <TrendingUp className="w-4 h-4" />,
      filter: { type: 'trending' as const }
    },
    {
      id: 'ai',
      label: 'AI Personas',
      icon: <Sparkles className="w-4 h-4" />,
      filter: { type: 'ai' as const }
    },
  ];

  if (!state.user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-x-text dark:text-x-text-dark mb-2">
              Please log in to view your feed
            </h2>
            <Button onClick={() => window.location.href = '/login'}>Log In</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={cn('min-h-screen', animations.fadeIn)}>
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-x-dark/95 backdrop-blur-sm border-b border-x-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-x-text dark:text-x-text-dark">
                Home
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={state.refreshing}
                className="p-2"
                aria-label="Refresh feed"
              >
                <RefreshCw className={cn('w-4 h-4', state.refreshing && 'animate-spin')} />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              {filterButtons.map((button) => (
                <Button
                  key={button.id}
                  variant={state.filter.type === button.filter.type ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleFilterChange(button.filter)}
                  className="flex items-center space-x-1 px-3"
                >
                  {button.icon}
                  <span className="hidden sm:inline">{button.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* New Posts Indicator */}
        {newPosts.length > 0 && (
          <div className="sticky top-16 z-10 p-4">
            <Button
              onClick={handleShowNewPosts}
              className="w-full rounded-full bg-x-blue hover:bg-x-blue-dark transition-colors"
            >
              Show {newPosts.length} new post{newPosts.length > 1 ? 's' : ''}
            </Button>
          </div>
        )}

        {/* Post Composer */}
        {state.filter.type === 'home' && (
          <PostComposer
            user={state.user}
            onSubmit={handleCreatePost}
            placeholder="What's happening?"
          />
        )}

        {/* Feed Content */}
        <div className="pb-20">
          {state.error && (
            <div className="p-4 m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{state.error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}

          {state.loading && state.posts.length === 0 ? (
            <div className="space-y-4 p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex space-x-3 p-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-0">
              {state.posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onRepost={handleRepost}
                  onBookmark={handleBookmark}
                  onUserClick={(user) => {
                    // Navigate to profile page
                    window.location.href = `/profile/${user.username}`;
                  }}
                  onPostClick={(post) => {
                    // Navigate to post detail page
                    window.location.href = `/post/${post.id}`;
                  }}
                />
              ))}

              {/* Load More */}
              {state.hasMore && !state.loading && (
                <div className="p-4 text-center">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    disabled={state.loading}
                    className="rounded-full px-8"
                  >
                    {state.loading ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}

              {/* Loading More */}
              {state.loading && state.posts.length > 0 && (
                <div className="p-4 text-center">
                  <div className="w-6 h-6 border-2 border-x-blue border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              )}

              {/* End of Feed */}
              {!state.hasMore && state.posts.length > 0 && (
                <div className="p-8 text-center text-x-text-secondary dark:text-x-text-secondary-dark">
                  <p>You've reached the end of your feed</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    className="mt-2"
                  >
                    Refresh to see new posts
                  </Button>
                </div>
              )}

              {/* Empty Feed */}
              {!state.loading && state.posts.length === 0 && !state.error && (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Home className="w-8 h-8 text-x-text-secondary dark:text-x-text-secondary-dark" />
                  </div>
                  <h3 className="text-lg font-medium text-x-text dark:text-x-text-dark mb-2">
                    Welcome to your feed!
                  </h3>
                  <p className="text-x-text-secondary dark:text-x-text-secondary-dark mb-4">
                    Follow some accounts to see their posts here, or check out what's trending.
                  </p>
                  <Button
                    onClick={() => handleFilterChange({ type: 'trending' })}
                    className="rounded-full"
                  >
                    Explore Trending
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
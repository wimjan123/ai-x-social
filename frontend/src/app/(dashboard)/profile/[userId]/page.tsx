'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { PostCard } from '@/components/posts/PostCard';
import { Button } from '@/components/ui/Button';
import { cn, getAnimationClasses } from '@/lib/design-system';
import { apiClient } from '@/services/api';
import { ArrowLeft, MoreHorizontal, Share, Flag } from 'lucide-react';
import type {
  User,
  AIPersona,
  Post,
  ApiResponse
} from '@/types';

interface ProfilePageState {
  user: User | AIPersona | null;
  currentUser: User | AIPersona | null;
  posts: Post[];
  replies: Post[];
  media: Post[];
  likes: Post[];
  loading: boolean;
  error: string | null;
  isFollowing: boolean;
  activeTab: string;
  postsLoading: boolean;
  hasMorePosts: boolean;
  postsPage: number;
}

// Mock current user - in real app this would come from auth context
const mockCurrentUser: User = {
  id: 'current-user-1',
  username: 'currentuser',
  displayName: 'Current User',
  email: 'current@example.com',
  avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=currentuser',
  bio: 'Current authenticated user',
  verified: false,
  followersCount: 500,
  followingCount: 200,
  postsCount: 150,
  influenceScore: 45,
  createdAt: new Date('2023-03-15'),
  updatedAt: new Date(),
};

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const animations = getAnimationClasses();

  const userId = params.userId as string;

  const [state, setState] = useState<ProfilePageState>({
    user: null,
    currentUser: mockCurrentUser,
    posts: [],
    replies: [],
    media: [],
    likes: [],
    loading: true,
    error: null,
    isFollowing: false,
    activeTab: 'posts',
    postsLoading: false,
    hasMorePosts: true,
    postsPage: 1,
  });

  // Load user profile
  const loadProfile = useCallback(async (userId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response: ApiResponse<{
        user: User | AIPersona;
        isFollowing: boolean;
        posts: Post[];
        replies: Post[];
        media: Post[];
        likes: Post[];
      }> = await apiClient.get(`/users/${userId}/profile`);

      setState(prev => ({
        ...prev,
        user: response.data.user,
        isFollowing: response.data.isFollowing,
        posts: response.data.posts,
        replies: response.data.replies,
        media: response.data.media,
        likes: response.data.likes,
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to load profile:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load profile. This user may not exist.',
      }));
    }
  }, []);

  // Load posts for specific tab
  const loadTabPosts = useCallback(async (
    userId: string,
    tab: string,
    page: number = 1,
    append: boolean = false
  ) => {
    try {
      setState(prev => ({ ...prev, postsLoading: !append }));

      const endpoint = `/users/${userId}/${tab}?page=${page}&limit=20`;
      const response: ApiResponse<{ posts: Post[]; hasMore: boolean }> =
        await apiClient.get(endpoint);

      setState(prev => {
        const currentPosts = prev[tab as keyof typeof prev] as Post[] || [];
        return {
          ...prev,
          [tab]: append ? [...currentPosts, ...response.data.posts] : response.data.posts,
          hasMorePosts: response.data.hasMore,
          postsPage: append ? page : 1,
          postsLoading: false,
        };
      });
    } catch (error) {
      console.error(`Failed to load ${tab}:`, error);
      setState(prev => ({ ...prev, postsLoading: false }));
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (userId) {
      loadProfile(userId);
    }
  }, [userId, loadProfile]);

  // Load posts when tab changes
  useEffect(() => {
    if (state.user && state.activeTab) {
      loadTabPosts(state.user.username, state.activeTab);
    }
  }, [state.user, state.activeTab, loadTabPosts]);

  // Follow/Unfollow handlers
  const handleFollow = useCallback(async (targetUserId: string) => {
    try {
      await apiClient.post(`/users/${targetUserId}/follow`);
      setState(prev => ({
        ...prev,
        isFollowing: true,
        user: prev.user ? {
          ...prev.user,
          followersCount: prev.user.followersCount + 1,
        } : null,
      }));
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  }, []);

  const handleUnfollow = useCallback(async (targetUserId: string) => {
    try {
      await apiClient.delete(`/users/${targetUserId}/follow`);
      setState(prev => ({
        ...prev,
        isFollowing: false,
        user: prev.user ? {
          ...prev.user,
          followersCount: Math.max(0, prev.user.followersCount - 1),
        } : null,
      }));
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  }, []);

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

  const handleTabChange = useCallback((tab: string) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  const handleLoadMore = useCallback(() => {
    if (state.user && !state.postsLoading && state.hasMorePosts) {
      loadTabPosts(state.user.username, state.activeTab, state.postsPage + 1, true);
    }
  }, [state.user, state.postsLoading, state.hasMorePosts, state.activeTab, state.postsPage, loadTabPosts]);

  const isOwnProfile = state.currentUser && state.user && state.currentUser.id === state.user.id;
  const isAI = state.user && 'personality' in state.user;

  // Document title and meta
  useEffect(() => {
    if (state.user) {
      document.title = `${state.user.displayName || state.user.username} (@${state.user.username}) | AI X Social`;
    }
  }, [state.user]);

  if (state.loading) {
    return (
      <MainLayout>
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="h-64 bg-gray-200 dark:bg-gray-700" />
          <div className="p-4 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (state.error || !state.user) {
    return (
      <MainLayout>
        <div className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-x-text dark:text-x-text-dark mb-4">
              Profile not found
            </h2>
            <p className="text-x-text-secondary dark:text-x-text-secondary-dark mb-6">
              {state.error || 'This profile does not exist or has been removed.'}
            </p>
            <Button
              onClick={() => router.back()}
              className="rounded-full"
            >
              Go Back
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const currentTabPosts = () => {
    switch (state.activeTab) {
      case 'posts':
        return state.posts;
      case 'replies':
        return state.replies;
      case 'media':
        return state.media;
      case 'likes':
        return state.likes;
      default:
        return state.posts;
    }
  };

  return (
    <MainLayout showRightSidebar={!isOwnProfile}>
      <div className={cn('min-h-screen', animations.fadeIn)}>
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-x-dark/95 backdrop-blur-sm border-b border-x-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="p-2"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-x-text dark:text-x-text-dark">
                  {state.user.displayName || state.user.username}
                </h1>
                <p className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
                  {state.user.postsCount.toLocaleString()} posts
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!isOwnProfile && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    aria-label="Share profile"
                  >
                    <Share className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    aria-label="More options"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <ProfileHeader
          user={state.user}
          currentUser={state.currentUser}
          isOwnProfile={isOwnProfile}
          isFollowing={state.isFollowing}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          onEditProfile={() => {
            router.push('/settings/profile');
          }}
          onCoverPhotoUpdate={async (file: File) => {
            // TODO: Implement cover photo upload
            console.log('Cover photo update:', file);
          }}
          onAvatarUpdate={async (file: File) => {
            // TODO: Implement avatar upload
            console.log('Avatar update:', file);
          }}
        />

        {/* Profile Tabs */}
        <ProfileTabs
          user={state.user}
          posts={state.posts}
          replies={state.replies}
          media={state.media}
          likes={isOwnProfile ? state.likes : []} // Only show likes for own profile
          currentUser={state.currentUser}
          activeTab={state.activeTab}
          onTabChange={handleTabChange}
          isOwnProfile={isOwnProfile}
        />

        {/* Posts Content */}
        {(state.activeTab === 'posts' || state.activeTab === 'replies' || state.activeTab === 'likes') && (
          <div className="pb-20">
            {currentTabPosts().length > 0 ? (
              <div className="space-y-0">
                {currentTabPosts().map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    showThread={state.activeTab === 'replies'}
                    onLike={handleLike}
                    onRepost={handleRepost}
                    onBookmark={handleBookmark}
                    onUserClick={(user) => {
                      if (user.username !== state.user?.username) {
                        router.push(`/profile/${user.username}`);
                      }
                    }}
                    onPostClick={(post) => {
                      router.push(`/post/${post.id}`);
                    }}
                  />
                ))}

                {/* Load More */}
                {state.hasMorePosts && (
                  <div className="p-4 text-center">
                    <Button
                      onClick={handleLoadMore}
                      variant="outline"
                      disabled={state.postsLoading}
                      className="rounded-full px-8"
                    >
                      {state.postsLoading ? 'Loading...' : 'Load More'}
                    </Button>
                  </div>
                )}

                {/* Loading More */}
                {state.postsLoading && currentTabPosts().length > 0 && (
                  <div className="p-4 text-center">
                    <div className="w-6 h-6 border-2 border-x-blue border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                )}
              </div>
            ) : (
              !state.postsLoading && (
                <div className="p-12 text-center">
                  <h3 className="text-lg font-medium text-x-text dark:text-x-text-dark mb-2">
                    {state.activeTab === 'posts' && (
                      isOwnProfile ? "You haven't posted yet" : `@${state.user.username} hasn't posted yet`
                    )}
                    {state.activeTab === 'replies' && (
                      isOwnProfile ? "You haven't replied to any posts yet" : `@${state.user.username} hasn't replied yet`
                    )}
                    {state.activeTab === 'likes' && (
                      isOwnProfile ? "You haven't liked any posts yet" : `@${state.user.username} hasn't liked any posts`
                    )}
                  </h3>
                  <p className="text-x-text-secondary dark:text-x-text-secondary-dark">
                    {state.activeTab === 'posts' && (
                      isOwnProfile ? 'Share your thoughts with the world!' : 'Check back later for updates.'
                    )}
                    {state.activeTab === 'replies' && (
                      isOwnProfile ? 'Join the conversation!' : 'Check back later for replies.'
                    )}
                    {state.activeTab === 'likes' && (
                      isOwnProfile ? 'Show appreciation for great content!' : 'Liked posts are private.'
                    )}
                  </p>
                </div>
              )
            )}

            {/* Initial Loading */}
            {state.postsLoading && currentTabPosts().length === 0 && (
              <div className="space-y-4 p-4">
                {[...Array(3)].map((_, i) => (
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
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
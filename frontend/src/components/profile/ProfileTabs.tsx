'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/design-system';
import { MessageSquare, Image, Heart, Bookmark, BarChart3, Users } from 'lucide-react';
import type { User, AIPersona, Post } from '@/types';

interface ProfileTabsProps {
  user: User | AIPersona;
  posts?: Post[];
  replies?: Post[];
  media?: Post[];
  likes?: Post[];
  currentUser?: User | AIPersona;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isOwnProfile?: boolean;
  className?: string;
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
  visible: (isOwnProfile: boolean, user: User | AIPersona) => boolean;
}

function TabButton({
  tab,
  isActive,
  onClick,
  className,
}: {
  tab: TabConfig;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center space-x-2 px-4 py-3 font-medium transition-colors relative',
        'hover:bg-gray-50 dark:hover:bg-gray-800/50',
        'focus:outline-none focus:ring-2 focus:ring-x-blue/20 focus:ring-offset-1',
        isActive
          ? 'text-x-text dark:text-x-text-dark'
          : 'text-x-text-secondary dark:text-x-text-secondary-dark',
        className
      )}
      aria-selected={isActive}
      role="tab"
    >
      <span className="w-5 h-5">{tab.icon}</span>
      <span>{tab.label}</span>
      {tab.count !== undefined && tab.count > 0 && (
        <span className="text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
          {tab.count > 999 ? `${Math.floor(tab.count / 1000)}K` : tab.count}
        </span>
      )}

      {/* Active indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-x-blue rounded-t" />
      )}
    </button>
  );
}

function TabContent({
  activeTab,
  posts = [],
  replies = [],
  media = [],
  likes = [],
  user,
  isOwnProfile,
}: {
  activeTab: string;
  posts?: Post[];
  replies?: Post[];
  media?: Post[];
  likes?: Post[];
  user: User | AIPersona;
  isOwnProfile: boolean;
}) {
  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="border-b border-x-border pb-4 last:border-b-0">
                  {/* Post content would be rendered here */}
                  <div className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
                    Post: {post.content.slice(0, 100)}...
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 mx-auto text-x-text-secondary dark:text-x-text-secondary-dark mb-4" />
                <h3 className="text-lg font-medium text-x-text dark:text-x-text-dark mb-2">
                  {isOwnProfile ? "You haven't posted yet" : `@${user.username} hasn't posted yet`}
                </h3>
                <p className="text-x-text-secondary dark:text-x-text-secondary-dark">
                  {isOwnProfile ? 'Share your thoughts with the world!' : 'Check back later for updates.'}
                </p>
              </div>
            )}
          </div>
        );

      case 'replies':
        return (
          <div className="space-y-4">
            {replies.length > 0 ? (
              replies.map((reply) => (
                <div key={reply.id} className="border-b border-x-border pb-4 last:border-b-0">
                  <div className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark mb-2">
                    Replying to @{reply.parentPost?.author.username}
                  </div>
                  <div className="text-sm text-x-text dark:text-x-text-dark">
                    {reply.content.slice(0, 100)}...
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 mx-auto text-x-text-secondary dark:text-x-text-secondary-dark mb-4" />
                <h3 className="text-lg font-medium text-x-text dark:text-x-text-dark mb-2">
                  {isOwnProfile ? "You haven't replied to any posts yet" : `@${user.username} hasn't replied to any posts yet`}
                </h3>
                <p className="text-x-text-secondary dark:text-x-text-secondary-dark">
                  {isOwnProfile ? 'Join the conversation!' : 'Check back later for replies.'}
                </p>
              </div>
            )}
          </div>
        );

      case 'media':
        return (
          <div>
            {media.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                {media.map((post) => (
                  <div key={post.id} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    {post.images && post.images[0] && (
                      <img
                        src={post.images[0]}
                        alt="Media post"
                        className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Image className="w-12 h-12 mx-auto text-x-text-secondary dark:text-x-text-secondary-dark mb-4" />
                <h3 className="text-lg font-medium text-x-text dark:text-x-text-dark mb-2">
                  {isOwnProfile ? "You haven't shared any media yet" : `@${user.username} hasn't shared any media yet`}
                </h3>
                <p className="text-x-text-secondary dark:text-x-text-secondary-dark">
                  {isOwnProfile ? 'Share photos and videos!' : 'Check back later for media.'}
                </p>
              </div>
            )}
          </div>
        );

      case 'likes':
        return (
          <div className="space-y-4">
            {likes.length > 0 ? (
              likes.map((post) => (
                <div key={post.id} className="border-b border-x-border pb-4 last:border-b-0">
                  <div className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark mb-2">
                    @{user.username} liked
                  </div>
                  <div className="text-sm text-x-text dark:text-x-text-dark">
                    {post.content.slice(0, 100)}...
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 mx-auto text-x-text-secondary dark:text-x-text-secondary-dark mb-4" />
                <h3 className="text-lg font-medium text-x-text dark:text-x-text-dark mb-2">
                  {isOwnProfile ? "You haven't liked any posts yet" : `@${user.username} hasn't liked any posts yet`}
                </h3>
                <p className="text-x-text-secondary dark:text-x-text-secondary-dark">
                  {isOwnProfile ? 'Show appreciation for great content!' : 'Liked posts would appear here.'}
                </p>
              </div>
            )}
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <h4 className="text-lg font-medium text-x-text dark:text-x-text-dark mb-2">
                  Post Performance
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-x-text-secondary dark:text-x-text-secondary-dark">Average likes</span>
                    <span className="font-medium">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-x-text-secondary dark:text-x-text-secondary-dark">Average replies</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-x-text-secondary dark:text-x-text-secondary-dark">Average reposts</span>
                    <span className="font-medium">12</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <h4 className="text-lg font-medium text-x-text dark:text-x-text-dark mb-2">
                  Audience Growth
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-x-text-secondary dark:text-x-text-secondary-dark">This month</span>
                    <span className="font-medium text-green-600">+156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-x-text-secondary dark:text-x-text-secondary-dark">Last month</span>
                    <span className="font-medium">+89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-x-text-secondary dark:text-x-text-secondary-dark">Growth rate</span>
                    <span className="font-medium text-green-600">+75%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-96" role="tabpanel">
      {renderContent()}
    </div>
  );
}

export function ProfileTabs({
  user,
  posts = [],
  replies = [],
  media = [],
  likes = [],
  currentUser,
  activeTab: controlledActiveTab,
  onTabChange,
  isOwnProfile = false,
  className,
}: ProfileTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState('posts');

  const activeTab = controlledActiveTab || internalActiveTab;
  const isAI = 'personality' in user;

  const tabs: TabConfig[] = useMemo(() => [
    {
      id: 'posts',
      label: 'Posts',
      icon: <MessageSquare className="w-5 h-5" />,
      count: posts.length,
      visible: () => true,
    },
    {
      id: 'replies',
      label: 'Replies',
      icon: <MessageSquare className="w-5 h-5" />,
      count: replies.length,
      visible: () => true,
    },
    {
      id: 'media',
      label: 'Media',
      icon: <Image className="w-5 h-5" />,
      count: media.length,
      visible: () => media.length > 0,
    },
    {
      id: 'likes',
      label: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      count: likes.length,
      visible: (isOwn) => isOwn || likes.length > 0,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      visible: (isOwn) => isOwn || isAI,
    },
  ], [posts.length, replies.length, media.length, likes.length, isAI]);

  const visibleTabs = tabs.filter(tab => tab.visible(isOwnProfile, user));

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  return (
    <div className={cn('bg-white dark:bg-x-dark', className)}>
      {/* Tab Navigation */}
      <div className="border-b border-x-border">
        <nav
          className="flex overflow-x-auto scrollbar-hide"
          role="tablist"
          aria-label="Profile content tabs"
        >
          {visibleTabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="flex-shrink-0"
            />
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        <TabContent
          activeTab={activeTab}
          posts={posts}
          replies={replies}
          media={media}
          likes={likes}
          user={user}
          isOwnProfile={isOwnProfile}
        />
      </div>
    </div>
  );
}
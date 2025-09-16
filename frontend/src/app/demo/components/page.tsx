'use client';

import { useState } from 'react';
import { PostComposer, PostCard, ReactionButtons } from '@/components/posts';
import { ProfileCard, ProfileHeader, InfluenceMetrics, PoliticalStanceCard, PersonaIndicator } from '@/components/profile';
import type { User, AIPersona, Post, CreatePostForm } from '@/types';

// Mock data for demo
const mockUser: User = {
  id: 'user-1',
  username: 'john_doe',
  displayName: 'John Doe',
  email: 'john@example.com',
  avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=john_doe',
  bio: 'Political enthusiast and technology advocate. Believes in progressive policies for a better future.',
  location: 'San Francisco, CA',
  website: 'https://johndoe.com',
  verified: true,
  followersCount: 15420,
  followingCount: 892,
  postsCount: 324,
  politicalAlignment: {
    position: 'progressive',
    intensity: 8,
    keyIssues: ['Climate Action', 'Healthcare', 'Technology Policy', 'Income Inequality'],
    description: 'Strong advocate for progressive policies that address systemic inequalities and promote environmental sustainability.',
  },
  influenceScore: 75,
  createdAt: new Date('2022-03-15'),
  updatedAt: new Date('2025-01-15'),
};

const mockAIPersona: AIPersona = {
  id: 'ai-1',
  name: 'ConservativeBot',
  displayName: 'Conservative Voice',
  username: 'conservative_voice',
  bio: 'AI persona representing traditional conservative viewpoints on economic and social policy.',
  avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=conservative_voice',
  verified: true,
  followersCount: 45200,
  followingCount: 156,
  postsCount: 1247,
  politicalAlignment: {
    position: 'conservative',
    intensity: 9,
    keyIssues: ['Fiscal Responsibility', 'Traditional Values', 'Free Markets', 'National Security'],
    description: 'Advocates for conservative principles including limited government, free market economics, and traditional social values.',
  },
  personality: {
    openness: 3,
    conscientiousness: 8,
    extraversion: 7,
    agreeableness: 5,
    neuroticism: 2,
    formalityLevel: 8,
    humorLevel: 4,
  },
  responseStyle: {
    averageResponseTime: 5,
    postFrequency: 8,
    engagementStyle: 'analytical',
    topicFocus: ['economics', 'politics', 'policy'],
    languageComplexity: 'moderate',
  },
  topicExpertise: ['Economics', 'Political Theory', 'Constitutional Law'],
  influenceMetrics: {
    score: 82,
    tier: 'influential',
    engagementRate: 12.5,
    reachEstimate: 125000,
    topicAuthority: {
      economics: 85,
      politics: 90,
      policy: 78,
    },
    viralPostsCount: 23,
    lastUpdated: new Date('2025-01-15'),
  },
  influenceScore: 82,
  isActive: true,
  lastActiveAt: new Date('2025-01-15'),
  createdAt: new Date('2024-01-10'),
  updatedAt: new Date('2025-01-15'),
};

const mockPost: Post = {
  id: 'post-1',
  content: 'Just published my thoughts on the new climate policy proposal. We need bold action now, not incremental changes that barely move the needle. The science is clear and the window is closing. #ClimateAction #Policy',
  authorId: mockUser.id,
  author: mockUser,
  images: ['https://picsum.photos/600/400?random=1'],
  likesCount: 156,
  repliesCount: 23,
  repostsCount: 41,
  isLiked: false,
  isReposted: false,
  isBookmarked: true,
  createdAt: new Date('2025-01-15T10:30:00Z'),
  updatedAt: new Date('2025-01-15T10:30:00Z'),
};

export default function ComponentsDemo() {
  const [currentUser] = useState<User>(mockUser);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleSubmitPost = async (postData: CreatePostForm) => {
    console.log('Submitting post:', postData);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleLike = async (postId: string) => {
    console.log('Liking post:', postId);
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleRepost = async (postId: string) => {
    console.log('Reposting:', postId);
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleFollow = async (userId: string) => {
    console.log('Following user:', userId);
    setIsFollowing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleUnfollow = async (userId: string) => {
    console.log('Unfollowing user:', userId);
    setIsFollowing(false);
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-x-dark">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-x-text dark:text-x-text-dark mb-8">
          Post & Profile Components Demo
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Post Components Section */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-x-text dark:text-x-text-dark mb-4">
                Post Components
              </h2>

              {/* Post Composer */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-x-text dark:text-x-text-dark mb-2">
                  Post Composer
                </h3>
                <PostComposer
                  user={currentUser}
                  onSubmit={handleSubmitPost}
                  placeholder="Share your political thoughts..."
                />
              </div>

              {/* Post Card */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-x-text dark:text-x-text-dark mb-2">
                  Post Card
                </h3>
                <PostCard
                  post={mockPost}
                  onLike={handleLike}
                  onRepost={handleRepost}
                  className="bg-white rounded-lg shadow"
                />
              </div>

              {/* Reaction Buttons (standalone) */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-x-text dark:text-x-text-dark mb-2">
                  Reaction Buttons
                </h3>
                <div className="bg-white p-4 rounded-lg shadow">
                  <ReactionButtons
                    post={mockPost}
                    onLike={handleLike}
                    onRepost={handleRepost}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Profile Components Section */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-x-text dark:text-x-text-dark mb-4">
                Profile Components
              </h2>

              {/* Persona Indicators */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-x-text dark:text-x-text-dark mb-2">
                  Persona Indicators
                </h3>
                <div className="bg-white p-4 rounded-lg shadow space-y-3">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">Human User:</span>
                    <PersonaIndicator user={mockUser} showLabel />
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">AI Persona:</span>
                    <PersonaIndicator user={mockAIPersona} showLabel />
                  </div>
                </div>
              </div>

              {/* Profile Cards */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-x-text dark:text-x-text-dark mb-2">
                  Profile Cards
                </h3>
                <div className="space-y-4">
                  <ProfileCard
                    user={mockUser}
                    variant="compact"
                    currentUser={currentUser}
                    isFollowing={isFollowing}
                    onFollow={handleFollow}
                    onUnfollow={handleUnfollow}
                  />
                  <ProfileCard
                    user={mockAIPersona}
                    variant="standard"
                    currentUser={currentUser}
                    isFollowing={!isFollowing}
                    onFollow={handleFollow}
                    onUnfollow={handleUnfollow}
                  />
                </div>
              </div>

              {/* Political Stance Card */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-x-text dark:text-x-text-dark mb-2">
                  Political Stance
                </h3>
                <PoliticalStanceCard
                  user={mockUser}
                  variant="card"
                />
              </div>

              {/* Influence Metrics */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-x-text dark:text-x-text-dark mb-2">
                  Influence Metrics
                </h3>
                <InfluenceMetrics
                  user={mockAIPersona}
                  variant="card"
                />
              </div>
            </section>
          </div>
        </div>

        {/* Full Profile Header Demo */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-x-text dark:text-x-text-dark mb-4">
            Full Profile Header
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ProfileHeader
              user={mockAIPersona}
              currentUser={currentUser}
              isFollowing={isFollowing}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
              coverImageUrl="https://picsum.photos/1200/300?random=2"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
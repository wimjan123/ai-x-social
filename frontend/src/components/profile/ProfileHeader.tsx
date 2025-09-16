'use client';

import { useState } from 'react';
import { cn, getAnimationClasses, getPoliticalColorClasses } from '@/lib/design-system';
import { MapPin, Link as LinkIcon, Calendar, Camera, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PersonaIndicator } from './PersonaIndicator';
import { FollowButton } from './FollowButton';
import { InfluenceMetrics } from './InfluenceMetrics';
import type { User, AIPersona, UserProfileProps } from '@/types';

interface ProfileHeaderProps extends UserProfileProps {
  onFollow?: (userId: string) => Promise<void>;
  onUnfollow?: (userId: string) => Promise<void>;
  onMessage?: (userId: string) => void;
  onEditProfile?: () => void;
  onCoverPhotoUpdate?: (file: File) => Promise<void>;
  onAvatarUpdate?: (file: File) => Promise<void>;
  currentUser?: User | AIPersona;
  isFollowing?: boolean;
  coverImageUrl?: string;
  className?: string;
}

function CoverPhoto({
  coverImageUrl,
  onUpdate,
  isOwnProfile,
}: {
  coverImageUrl?: string;
  onUpdate?: (file: File) => Promise<void>;
  isOwnProfile: boolean;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdate) return;

    setIsUploading(true);
    try {
      await onUpdate(file);
    } catch (error) {
      console.error('Failed to update cover photo:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative h-48 sm:h-64 bg-gradient-to-r from-x-blue to-purple-500 overflow-hidden">
      {/* Cover Image */}
      {coverImageUrl ? (
        <img
          src={coverImageUrl}
          alt="Profile cover"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-x-blue via-purple-500 to-pink-500" />
      )}

      {/* Overlay for own profile */}
      {isOwnProfile && onUpdate && (
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex items-center space-x-2 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full transition-colors">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isUploading ? 'Uploading...' : 'Update cover'}
              </span>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}

function ProfileAvatar({
  user,
  onUpdate,
  isOwnProfile,
}: {
  user: User | AIPersona;
  onUpdate?: (file: File) => Promise<void>;
  isOwnProfile: boolean;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdate) return;

    setIsUploading(true);
    try {
      await onUpdate(file);
    } catch (error) {
      console.error('Failed to update avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const politicalAlignment = 'politicalAlignment' in user && user.politicalAlignment
    ? user.politicalAlignment.position
    : undefined;

  return (
    <div className="relative">
      <img
        src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
        alt={user.displayName || user.username}
        className={cn(
          'w-32 h-32 rounded-full border-4 border-white dark:border-x-dark shadow-xl',
          politicalAlignment && `ring-4 ring-political-${politicalAlignment}-200 dark:ring-political-${politicalAlignment}-800`
        )}
      />

      {/* Update overlay for own profile */}
      {isOwnProfile && onUpdate && (
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </label>
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

function UserMeta({ user }: { user: User | AIPersona }) {
  const joinDate = new Date(user.createdAt);
  const location = 'location' in user ? user.location : undefined;
  const website = 'website' in user ? user.website : undefined;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
      {location && (
        <div className="flex items-center space-x-1">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
      )}

      {website && (
        <div className="flex items-center space-x-1">
          <LinkIcon className="w-4 h-4" />
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-x-blue hover:underline"
          >
            {website.replace(/^https?:\/\//, '')}
          </a>
        </div>
      )}

      <div className="flex items-center space-x-1">
        <Calendar className="w-4 h-4" />
        <span>
          Joined {joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
}

function UserStats({ user }: { user: User | AIPersona }) {
  const stats = [
    { label: 'Posts', value: user.postsCount },
    { label: 'Following', value: user.followingCount },
    { label: 'Followers', value: user.followersCount },
  ];

  return (
    <div className="flex space-x-8">
      {stats.map((stat, index) => (
        <button
          key={index}
          className="group text-left hover:underline"
          aria-label={`View ${stat.label.toLowerCase()}`}
        >
          <div className="text-xl font-bold text-x-text dark:text-x-text-dark">
            {stat.value > 999 ? `${(stat.value / 1000).toFixed(1)}K` : stat.value.toLocaleString()}
          </div>
          <div className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
            {stat.label}
          </div>
        </button>
      ))}
    </div>
  );
}

export function ProfileHeader({
  user,
  isOwnProfile = false,
  showFollowButton = true,
  onFollow,
  onUnfollow,
  onMessage,
  onEditProfile,
  onCoverPhotoUpdate,
  onAvatarUpdate,
  currentUser,
  isFollowing = false,
  coverImageUrl,
  className,
}: ProfileHeaderProps) {
  const animations = getAnimationClasses();

  return (
    <div className={cn('bg-white dark:bg-x-dark border-b border-x-border', animations.slideUp, className)}>
      {/* Cover Photo */}
      <CoverPhoto
        coverImageUrl={coverImageUrl}
        onUpdate={onCoverPhotoUpdate}
        isOwnProfile={isOwnProfile}
      />

      {/* Profile Content */}
      <div className="relative px-4 sm:px-6 pb-6">
        {/* Avatar */}
        <div className="flex justify-between items-end mb-4">
          <div className="-mt-16">
            <ProfileAvatar
              user={user}
              onUpdate={onAvatarUpdate}
              isOwnProfile={isOwnProfile}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 mt-4">
            {isOwnProfile ? (
              <Button
                variant="outline"
                onClick={onEditProfile}
                className="rounded-full px-6 font-semibold"
              >
                Edit profile
              </Button>
            ) : (
              showFollowButton && currentUser && (
                <FollowButton
                  user={user}
                  currentUser={currentUser}
                  isFollowing={isFollowing}
                  onFollow={onFollow}
                  onUnfollow={onUnfollow}
                  onMessage={onMessage}
                />
              )
            )}

            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="More options"
            >
              <MoreHorizontal className="w-5 h-5 text-x-text-secondary dark:text-x-text-secondary-dark" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-4">
          {/* Name and Handle */}
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-x-text dark:text-x-text-dark">
                {user.displayName || user.username}
              </h1>
              <PersonaIndicator user={user} size="lg" showLabel />
            </div>
            <p className="text-x-text-secondary dark:text-x-text-secondary-dark">
              @{user.username}
            </p>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-x-text dark:text-x-text-dark text-lg leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Meta Information */}
          <UserMeta user={user} />

          {/* Stats */}
          <UserStats user={user} />

          {/* Influence Metrics (for high-influence users) */}
          {'influenceMetrics' in user && user.influenceMetrics && user.influenceMetrics.tier !== 'micro' && (
            <div className="pt-4">
              <InfluenceMetrics user={user} variant="inline" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
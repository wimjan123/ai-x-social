'use client';

import { cn, getAnimationClasses } from '@/lib/design-system';
import { MapPin, Link as LinkIcon, Calendar, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { PersonaIndicator } from './PersonaIndicator';
import { FollowButton } from './FollowButton';
import { PoliticalStanceCard } from './PoliticalStanceCard';
import type { User, AIPersona, UserProfileProps } from '@/types';

interface ProfileCardProps extends UserProfileProps {
  variant?: 'compact' | 'standard' | 'detailed';
  onUserClick?: (user: User | AIPersona) => void;
  onFollow?: (userId: string) => Promise<void>;
  onUnfollow?: (userId: string) => Promise<void>;
  onMessage?: (userId: string) => void;
  currentUser?: User | AIPersona;
  isFollowing?: boolean;
  className?: string;
}

function UserStats({
  user,
  variant,
}: {
  user: User | AIPersona;
  variant: 'compact' | 'standard' | 'detailed';
}) {
  const stats = [
    { label: 'Posts', value: user.postsCount },
    { label: 'Following', value: user.followingCount },
    { label: 'Followers', value: user.followersCount },
  ];

  const textSize = variant === 'compact' ? 'text-xs' : 'text-sm';
  const spacing = variant === 'compact' ? 'space-x-3' : 'space-x-6';

  return (
    <div className={cn('flex', spacing, textSize)}>
      {stats.map((stat, index) => (
        <button
          key={index}
          className="group text-center hover:underline"
          aria-label={`View ${stat.label.toLowerCase()}`}
        >
          <div className="font-semibold text-x-text dark:text-x-text-dark">
            {stat.value > 999 ? `${Math.floor(stat.value / 1000)}K` : stat.value}
          </div>
          <div className="text-x-text-secondary dark:text-x-text-secondary-dark">
            {stat.label}
          </div>
        </button>
      ))}
    </div>
  );
}

function UserMeta({
  user,
  variant,
}: {
  user: User | AIPersona;
  variant: 'compact' | 'standard' | 'detailed';
}) {
  const joinDate = new Date(user.createdAt);
  const location = 'location' in user ? user.location : undefined;
  const website = 'website' in user ? user.website : undefined;

  const iconSize = variant === 'compact' ? 'w-3 h-3' : 'w-4 h-4';
  const textSize = variant === 'compact' ? 'text-xs' : 'text-sm';

  return (
    <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-1', textSize, 'text-x-text-secondary dark:text-x-text-secondary-dark')}>
      {location && (
        <div className="flex items-center space-x-1">
          <MapPin className={iconSize} />
          <span>{location}</span>
        </div>
      )}

      {website && (
        <div className="flex items-center space-x-1">
          <LinkIcon className={iconSize} />
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
        <Calendar className={iconSize} />
        <span>
          Joined {joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
}

export function ProfileCard({
  user,
  variant = 'standard',
  isOwnProfile = false,
  showFollowButton = true,
  onUserClick,
  onFollow,
  onUnfollow,
  onMessage,
  currentUser,
  isFollowing = false,
  className,
}: ProfileCardProps) {
  const animations = getAnimationClasses();

  const handleClick = () => {
    if (onUserClick) {
      onUserClick(user);
    }
  };

  // Compact variant for lists, search results
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors',
          'border-b border-x-border last:border-b-0',
          onUserClick && 'cursor-pointer',
          animations.fadeIn,
          className
        )}
        onClick={handleClick}
      >
        {/* Avatar */}
        <img
          src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
          alt={user.displayName || user.username}
          className="w-12 h-12 rounded-full"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-x-text dark:text-x-text-dark truncate">
              {user.displayName || user.username}
            </h3>
            <PersonaIndicator user={user} size="sm" />
          </div>

          <p className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
            @{user.username}
          </p>

          {user.bio && (
            <p className="text-sm text-x-text dark:text-x-text-dark mt-1 line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>

        {/* Actions */}
        {showFollowButton && !isOwnProfile && (
          <div onClick={(e) => e.stopPropagation()}>
            <FollowButton
              user={user}
              currentUser={currentUser}
              isFollowing={isFollowing}
              onFollow={onFollow}
              onUnfollow={onUnfollow}
              onMessage={onMessage}
              variant="compact"
            />
          </div>
        )}
      </div>
    );
  }

  // Standard variant for profile pages, detailed views
  return (
    <div
      className={cn(
        'bg-white dark:bg-x-dark rounded-2xl border border-x-border overflow-hidden',
        animations.slideUp,
        className
      )}
    >
      {/* Header */}
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          {/* Avatar and Basic Info */}
          <div className="flex items-start space-x-4">
            <img
              src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
              alt={user.displayName || user.username}
              className={cn(
                'rounded-full border-4 border-white dark:border-x-dark shadow-lg',
                variant === 'detailed' ? 'w-24 h-24' : 'w-16 h-16'
              )}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className={cn(
                  'font-bold text-x-text dark:text-x-text-dark truncate',
                  variant === 'detailed' ? 'text-2xl' : 'text-xl'
                )}>
                  {user.displayName || user.username}
                </h2>
                <PersonaIndicator user={user} size={variant === 'detailed' ? 'lg' : 'md'} />
              </div>

              <p className="text-x-text-secondary dark:text-x-text-secondary-dark mb-2">
                @{user.username}
              </p>

              {user.bio && (
                <p className="text-x-text dark:text-x-text-dark leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {showFollowButton && !isOwnProfile && (
              <FollowButton
                user={user}
                currentUser={currentUser}
                isFollowing={isFollowing}
                onFollow={onFollow}
                onUnfollow={onUnfollow}
                onMessage={onMessage}
              />
            )}

            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="More options"
            >
              <MoreHorizontal className="w-5 h-5 text-x-text-secondary dark:text-x-text-secondary-dark" />
            </button>
          </div>
        </div>

        {/* Meta Information */}
        <UserMeta user={user} variant={variant} />

        {/* Stats */}
        <UserStats user={user} variant={variant} />
      </div>

      {/* Political Stance (for detailed variant) */}
      {variant === 'detailed' && 'politicalAlignment' in user && user.politicalAlignment && (
        <div className="px-6 pb-6">
          <PoliticalStanceCard
            user={user}
            variant="compact"
            showDescription={false}
            showKeyIssues={false}
          />
        </div>
      )}
    </div>
  );
}
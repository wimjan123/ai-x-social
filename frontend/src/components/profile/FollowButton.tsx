'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { cn, getPoliticalColorClasses } from '@/lib/design-system';
import { UserPlus, UserMinus, MessageCircle, Bell, BellOff } from 'lucide-react';
import type { User, AIPersona } from '@/types';

interface FollowButtonProps {
  user: User | AIPersona;
  currentUser?: User | AIPersona;
  isFollowing?: boolean;
  isBlocked?: boolean;
  hasNotifications?: boolean;
  onFollow?: (userId: string) => Promise<void>;
  onUnfollow?: (userId: string) => Promise<void>;
  onBlock?: (userId: string) => Promise<void>;
  onMessage?: (userId: string) => void;
  onToggleNotifications?: (userId: string) => Promise<void>;
  variant?: 'default' | 'compact' | 'menu';
  className?: string;
}

export function FollowButton({
  user,
  currentUser,
  isFollowing = false,
  isBlocked = false,
  hasNotifications = false,
  onFollow,
  onUnfollow,
  onBlock,
  onMessage,
  onToggleNotifications,
  variant = 'default',
  className,
}: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const isOwnProfile = currentUser?.id === user.id;
  const isAI = 'personality' in user;

  const handleFollow = useCallback(async () => {
    if (!onFollow || isLoading) return;

    setIsLoading(true);
    try {
      await onFollow(user.id);
    } catch (error) {
      console.error('Failed to follow user:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onFollow, user.id, isLoading]);

  const handleUnfollow = useCallback(async () => {
    if (!onUnfollow || isLoading) return;

    setIsLoading(true);
    try {
      await onUnfollow(user.id);
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onUnfollow, user.id, isLoading]);

  const handleToggleNotifications = useCallback(async () => {
    if (!onToggleNotifications || isLoading) return;

    setIsLoading(true);
    try {
      await onToggleNotifications(user.id);
    } catch (error) {
      console.error('Failed to toggle notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onToggleNotifications, user.id, isLoading]);

  const handleMessage = useCallback(() => {
    if (onMessage) {
      onMessage(user.id);
    }
  }, [onMessage, user.id]);

  const getPoliticalAlignment = () => {
    if ('politicalAlignment' in user && user.politicalAlignment) {
      return user.politicalAlignment.position;
    }
    return undefined;
  };

  const politicalAlignment = getPoliticalAlignment();

  // Don't render if it's the user's own profile
  if (isOwnProfile) {
    return null;
  }

  // Blocked state
  if (isBlocked) {
    return (
      <Button
        variant="destructive"
        size={variant === 'compact' ? 'sm' : 'md'}
        onClick={() => onBlock?.(user.id)}
        className={cn('rounded-full', className)}
      >
        Blocked
      </Button>
    );
  }

  // Compact variant (for cards, lists)
  if (variant === 'compact') {
    return (
      <Button
        variant={isFollowing ? 'outline' : 'default'}
        size="sm"
        onClick={isFollowing ? handleUnfollow : handleFollow}
        isLoading={isLoading}
        className={cn(
          'rounded-full text-sm font-semibold min-w-20',
          !isFollowing && politicalAlignment && `bg-political-${politicalAlignment}-500 hover:bg-political-${politicalAlignment}-600`,
          className
        )}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
    );
  }

  // Menu variant (dropdown actions)
  if (variant === 'menu') {
    return (
      <div className="flex flex-col space-y-2">
        <Button
          variant={isFollowing ? 'outline' : 'default'}
          onClick={isFollowing ? handleUnfollow : handleFollow}
          isLoading={isLoading}
          className={cn(
            'rounded-full w-full',
            !isFollowing && politicalAlignment && `bg-political-${politicalAlignment}-500 hover:bg-political-${politicalAlignment}-600`
          )}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>

        {isFollowing && onToggleNotifications && (
          <Button
            variant="outline"
            onClick={handleToggleNotifications}
            isLoading={isLoading}
            className="rounded-full w-full"
          >
            {hasNotifications ? (
              <>
                <BellOff className="w-4 h-4 mr-2" />
                Turn off notifications
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 mr-2" />
                Turn on notifications
              </>
            )}
          </Button>
        )}

        {onMessage && !isAI && (
          <Button
            variant="outline"
            onClick={handleMessage}
            className="rounded-full w-full"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
        )}
      </div>
    );
  }

  // Default variant (profile header)
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* Main Follow Button */}
      <Button
        variant={isFollowing ? 'outline' : 'default'}
        size="md"
        onClick={isFollowing ? handleUnfollow : handleFollow}
        isLoading={isLoading}
        className={cn(
          'rounded-full px-6 font-semibold transition-all duration-200',
          isFollowing && 'hover:bg-red-50 hover:text-red-600 hover:border-red-200',
          !isFollowing && politicalAlignment && `bg-political-${politicalAlignment}-500 hover:bg-political-${politicalAlignment}-600`
        )}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {isFollowing ? (
          <>
            <UserMinus className="w-4 h-4 mr-2" />
            {showActions ? 'Unfollow' : 'Following'}
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4 mr-2" />
            Follow
          </>
        )}
      </Button>

      {/* Secondary Actions */}
      {isFollowing && (
        <div className="flex items-center space-x-1">
          {/* Notifications Toggle */}
          {onToggleNotifications && (
            <Button
              variant="ghost"
              size="md"
              onClick={handleToggleNotifications}
              isLoading={isLoading}
              className="rounded-full p-2"
              aria-label={hasNotifications ? 'Turn off notifications' : 'Turn on notifications'}
            >
              {hasNotifications ? (
                <Bell className="w-4 h-4" />
              ) : (
                <BellOff className="w-4 h-4" />
              )}
            </Button>
          )}

          {/* Message Button */}
          {onMessage && !isAI && (
            <Button
              variant="ghost"
              size="md"
              onClick={handleMessage}
              className="rounded-full p-2"
              aria-label="Send message"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
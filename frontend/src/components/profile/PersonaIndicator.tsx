'use client';

import { cn, getPoliticalColorClasses, getPoliticalDisplayName } from '@/lib/design-system';
import { Bot, User as UserIcon, Shield, Zap } from 'lucide-react';
import type { User, AIPersona } from '@/types';

interface PersonaIndicatorProps {
  user: User | AIPersona;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

function getPersonaIcon(user: User | AIPersona, size: string) {
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const isAI = 'personality' in user;
  const isVerified = 'verified' in user ? user.verified : false;

  if (isAI) {
    return <Bot className={cn(iconSizes[size as keyof typeof iconSizes], 'text-x-blue')} />;
  }

  if (isVerified) {
    return <Shield className={cn(iconSizes[size as keyof typeof iconSizes], 'text-x-blue')} />;
  }

  return <UserIcon className={cn(iconSizes[size as keyof typeof iconSizes], 'text-x-light-gray')} />;
}

function getPoliticalBadge(user: User | AIPersona) {
  const politicalAlignment = 'politicalAlignment' in user && user.politicalAlignment
    ? user.politicalAlignment.position
    : undefined;

  if (!politicalAlignment) return null;

  return {
    position: politicalAlignment,
    color: getPoliticalColorClasses(politicalAlignment, 500),
    displayName: getPoliticalDisplayName(politicalAlignment),
  };
}

function getInfluenceLevel(user: User | AIPersona) {
  if ('influenceMetrics' in user && user.influenceMetrics) {
    return user.influenceMetrics.tier;
  }

  // For regular users, determine influence based on follower count
  const followers = user.followersCount || 0;
  if (followers >= 1000000) return 'celebrity';
  if (followers >= 100000) return 'mega';
  if (followers >= 10000) return 'macro';
  return 'micro';
}

export function PersonaIndicator({
  user,
  size = 'md',
  showLabel = false,
  className,
}: PersonaIndicatorProps) {
  const isAI = 'personality' in user;
  const politicalBadge = getPoliticalBadge(user);
  const influenceLevel = getInfluenceLevel(user);
  const personaIcon = getPersonaIcon(user, size);

  const containerSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const badgeSizes = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-2.5 py-1 text-sm',
  };

  return (
    <div className={cn('flex items-center space-x-1.5', containerSizes[size], className)}>
      {/* Persona Type Icon */}
      <div
        className="flex items-center justify-center"
        title={isAI ? 'AI Persona' : 'verified' in user && user.verified ? 'Verified User' : 'User'}
      >
        {personaIcon}
      </div>

      {/* Political Alignment Badge */}
      {politicalBadge && (
        <div
          className={cn(
            'rounded-full font-medium text-white',
            badgeSizes[size],
            `bg-political-${politicalBadge.position}-500`
          )}
          title={`Political alignment: ${politicalBadge.displayName}`}
        >
          {showLabel ? politicalBadge.displayName : politicalBadge.position.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Influence Level Indicator */}
      {influenceLevel !== 'micro' && (
        <div
          className={cn(
            'flex items-center space-x-1 rounded-full bg-gradient-to-r',
            badgeSizes[size],
            {
              'from-yellow-400 to-yellow-600': influenceLevel === 'mega',
              'from-orange-400 to-red-500': influenceLevel === 'celebrity',
              'from-purple-400 to-pink-500': influenceLevel === 'macro',
            }
          )}
          title={`Influence level: ${influenceLevel}`}
        >
          <Zap className={cn(
            size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-3.5 h-3.5',
            'text-white'
          )} />
          {showLabel && (
            <span className="text-white font-medium capitalize">
              {influenceLevel}
            </span>
          )}
        </div>
      )}

      {/* AI Specific Indicators */}
      {isAI && 'responseStyle' in user && (
        <div
          className={cn(
            'rounded-full bg-x-blue text-white font-medium',
            badgeSizes[size]
          )}
          title={`Response style: ${user.responseStyle.engagementStyle}`}
        >
          {showLabel ? user.responseStyle.engagementStyle : 'AI'}
        </div>
      )}
    </div>
  );
}
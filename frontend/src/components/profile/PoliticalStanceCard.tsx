'use client';

import { cn, getPoliticalColorClasses, getPoliticalDisplayName } from '@/lib/design-system';
import { Flag, TrendingUp, Users, MessageSquare, BarChart3 } from 'lucide-react';
import type { User, AIPersona, PoliticalAlignment } from '@/types';

interface PoliticalStanceCardProps {
  user: User | AIPersona;
  variant?: 'card' | 'compact' | 'detailed';
  showDescription?: boolean;
  showKeyIssues?: boolean;
  className?: string;
}

interface StanceIndicatorProps {
  position: PoliticalAlignment['position'];
  intensity: number;
  className?: string;
}

function StanceIndicator({ position, intensity, className }: StanceIndicatorProps) {
  const colorClasses = getPoliticalColorClasses(position, 500);
  const bgColorClasses = getPoliticalColorClasses(position, 100);

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      {/* Position Badge */}
      <div className={cn('px-3 py-1 rounded-full text-sm font-semibold text-white', colorClasses)}>
        {getPoliticalDisplayName(position)}
      </div>

      {/* Intensity Meter */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
          Intensity:
        </span>
        <div className="flex items-center space-x-1">
          <div className={cn('w-20 h-2 rounded-full', bgColorClasses)}>
            <div
              className={cn('h-full rounded-full', colorClasses)}
              style={{ width: `${(intensity / 10) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-x-text dark:text-x-text-dark w-6">
            {intensity}/10
          </span>
        </div>
      </div>
    </div>
  );
}

function PoliticalSpectrum({ position, intensity }: { position: PoliticalAlignment['position']; intensity: number }) {
  const positions = ['progressive', 'liberal', 'moderate', 'conservative', 'libertarian'];
  const positionIndex = positions.indexOf(position);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-x-text dark:text-x-text-dark">
        Political Spectrum Position
      </h4>

      <div className="relative">
        {/* Spectrum Line */}
        <div className="h-2 bg-gradient-to-r from-political-progressive-300 via-political-moderate-300 to-political-conservative-300 rounded-full" />

        {/* Position Indicator */}
        <div
          className="absolute top-0 w-4 h-2 transform -translate-x-2"
          style={{ left: `${(positionIndex / (positions.length - 1)) * 100}%` }}
        >
          <div className={cn(
            'w-4 h-4 rounded-full border-2 border-white shadow-lg transform -translate-y-1',
            getPoliticalColorClasses(position, 500)
          )} />
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
        <span>Progressive</span>
        <span>Liberal</span>
        <span>Moderate</span>
        <span>Conservative</span>
        <span>Libertarian</span>
      </div>
    </div>
  );
}

function KeyIssuesList({ issues }: { issues: string[] }) {
  if (!issues || issues.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-x-text dark:text-x-text-dark">
        Key Issues
      </h4>
      <div className="flex flex-wrap gap-2">
        {issues.slice(0, 6).map((issue, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-x-text dark:text-x-text-dark text-xs rounded-md"
          >
            {issue}
          </span>
        ))}
        {issues.length > 6 && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-x-text-secondary dark:text-x-text-secondary-dark text-xs rounded-md">
            +{issues.length - 6} more
          </span>
        )}
      </div>
    </div>
  );
}

export function PoliticalStanceCard({
  user,
  variant = 'card',
  showDescription = true,
  showKeyIssues = true,
  className,
}: PoliticalStanceCardProps) {
  const politicalAlignment = 'politicalAlignment' in user && user.politicalAlignment
    ? user.politicalAlignment
    : null;

  if (!politicalAlignment) {
    return (
      <div className={cn('bg-white dark:bg-x-dark rounded-2xl p-4 border border-x-border', className)}>
        <div className="flex items-center space-x-3 text-x-text-secondary dark:text-x-text-secondary-dark">
          <Flag className="w-5 h-5" />
          <span className="text-sm">No political alignment specified</span>
        </div>
      </div>
    );
  }

  const { position, intensity, keyIssues, description } = politicalAlignment;

  // Compact variant for sidebars or small spaces
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <Flag className="w-4 h-4 text-x-text-secondary dark:text-x-text-secondary-dark" />
        <div className={cn(
          'px-2 py-1 rounded text-xs font-medium text-white',
          getPoliticalColorClasses(position, 500)
        )}>
          {getPoliticalDisplayName(position)}
        </div>
        <span className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
          {intensity}/10
        </span>
      </div>
    );
  }

  // Card variant (standard)
  if (variant === 'card') {
    return (
      <div className={cn('bg-white dark:bg-x-dark rounded-2xl p-6 border border-x-border space-y-4', className)}>
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Flag className="w-5 h-5 text-x-text-secondary dark:text-x-text-secondary-dark" />
          <h3 className="text-lg font-semibold text-x-text dark:text-x-text-dark">
            Political Stance
          </h3>
        </div>

        {/* Stance Indicator */}
        <StanceIndicator position={position} intensity={intensity} />

        {/* Description */}
        {showDescription && description && (
          <p className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark leading-relaxed">
            {description}
          </p>
        )}

        {/* Key Issues */}
        {showKeyIssues && <KeyIssuesList issues={keyIssues} />}
      </div>
    );
  }

  // Detailed variant (comprehensive view)
  return (
    <div className={cn('bg-white dark:bg-x-dark rounded-2xl p-6 border border-x-border space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Flag className="w-6 h-6 text-x-text-secondary dark:text-x-text-secondary-dark" />
          <h3 className="text-xl font-semibold text-x-text dark:text-x-text-dark">
            Political Profile
          </h3>
        </div>
        <div className={cn(
          'px-4 py-2 rounded-full text-sm font-semibold text-white',
          getPoliticalColorClasses(position, 500)
        )}>
          {getPoliticalDisplayName(position)}
        </div>
      </div>

      {/* Political Spectrum */}
      <PoliticalSpectrum position={position} intensity={intensity} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-x-text dark:text-x-text-dark">
            {intensity}/10
          </div>
          <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
            Intensity
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-x-text dark:text-x-text-dark">
            {keyIssues?.length || 0}
          </div>
          <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
            Key Issues
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-x-text dark:text-x-text-dark">
            Active
          </div>
          <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
            Engagement
          </div>
        </div>
      </div>

      {/* Description */}
      {showDescription && description && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-x-text dark:text-x-text-dark">
            Political Views
          </h4>
          <p className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark leading-relaxed">
            {description}
          </p>
        </div>
      )}

      {/* Key Issues */}
      {showKeyIssues && <KeyIssuesList issues={keyIssues} />}

      {/* AI Persona Additional Info */}
      {'personality' in user && (
        <div className="pt-4 border-t border-x-border">
          <div className="flex items-center space-x-2 text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
            <BarChart3 className="w-4 h-4" />
            <span>
              AI persona with {user.responseStyle?.engagementStyle} engagement style
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { cn, getInfluenceColorClasses, getInfluenceDisplayName } from '@/lib/design-system';
import { TrendingUp, Users, Zap, Target, Award, BarChart3 } from 'lucide-react';
import type { User, AIPersona, InfluenceMetrics as InfluenceMetricsType } from '@/types';

interface InfluenceMetricsProps {
  user: User | AIPersona;
  variant?: 'card' | 'inline' | 'detailed';
  showTrendAnalysis?: boolean;
  className?: string;
}

interface MetricItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  color?: string;
  subtitle?: string;
}

function MetricItem({ icon, label, value, change, color, subtitle }: MetricItemProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className={cn('p-2 rounded-lg', color || 'bg-gray-100 dark:bg-gray-800')}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-x-text dark:text-x-text-dark">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {change !== undefined && (
            <span
              className={cn(
                'text-xs font-medium px-1.5 py-0.5 rounded',
                change > 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
              )}
            >
              {change > 0 ? '+' : ''}{change}%
            </span>
          )}
        </div>
        <p className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
          {label}
        </p>
        {subtitle && (
          <p className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function getInfluenceMetrics(user: User | AIPersona): InfluenceMetricsType | null {
  if ('influenceMetrics' in user && user.influenceMetrics) {
    return user.influenceMetrics;
  }
  return null;
}

function calculateEngagementRate(user: User | AIPersona): number {
  const metrics = getInfluenceMetrics(user);
  if (metrics?.engagementRate) {
    return metrics.engagementRate;
  }

  // Fallback calculation for regular users
  const followers = user.followersCount || 0;
  if (followers === 0) return 0;

  // Estimate based on typical engagement patterns
  // This would normally come from actual engagement data
  const estimatedEngagements = Math.floor(followers * 0.05); // 5% engagement rate
  return Math.min(Math.round((estimatedEngagements / followers) * 100), 100);
}

function getInfluenceScore(user: User | AIPersona): number {
  const metrics = getInfluenceMetrics(user);
  if (metrics?.score) {
    return metrics.score;
  }

  // Simple calculation for regular users
  const followers = user.followersCount || 0;
  const posts = user.postsCount || 0;
  const engagement = calculateEngagementRate(user);

  // Weighted score (0-100)
  const score = Math.min(
    Math.round(
      (Math.log10(followers + 1) * 10) + // Follower factor
      (Math.log10(posts + 1) * 5) +      // Content factor
      (engagement * 0.5)                 // Engagement factor
    ),
    100
  );

  return score;
}

export function InfluenceMetrics({
  user,
  variant = 'card',
  showTrendAnalysis = false,
  className,
}: InfluenceMetricsProps) {
  const metrics = getInfluenceMetrics(user);
  const influenceScore = getInfluenceScore(user);
  const engagementRate = calculateEngagementRate(user);
  const tier = metrics?.tier || 'minimal';

  const tierColor = getInfluenceColorClasses(tier);
  const tierDisplay = getInfluenceDisplayName(tier);

  // Inline variant (compact display)
  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center space-x-4 text-sm', className)}>
        <div className="flex items-center space-x-1">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="font-medium">{influenceScore}</span>
          <span className="text-x-text-secondary dark:text-x-text-secondary-dark">
            influence
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="font-medium">{engagementRate}%</span>
          <span className="text-x-text-secondary dark:text-x-text-secondary-dark">
            engagement
          </span>
        </div>

        <div className={cn('px-2 py-1 rounded-full text-xs font-medium', tierColor)}>
          {tierDisplay}
        </div>
      </div>
    );
  }

  // Card variant (standard display)
  if (variant === 'card') {
    return (
      <div className={cn('bg-white dark:bg-x-dark rounded-2xl p-6 border border-x-border', className)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-x-text dark:text-x-text-dark">
            Influence Metrics
          </h3>
          <div className={cn('px-3 py-1 rounded-full text-sm font-medium', tierColor)}>
            {tierDisplay}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <MetricItem
            icon={<Zap className="w-5 h-5 text-yellow-500" />}
            label="Influence Score"
            value={influenceScore}
            color="bg-yellow-100 dark:bg-yellow-900/20"
            subtitle="Overall impact rating"
          />

          <MetricItem
            icon={<TrendingUp className="w-5 h-5 text-green-500" />}
            label="Engagement Rate"
            value={`${engagementRate}%`}
            color="bg-green-100 dark:bg-green-900/20"
            subtitle="Average interaction rate"
          />

          <MetricItem
            icon={<Users className="w-5 h-5 text-blue-500" />}
            label="Reach Estimate"
            value={metrics?.reachEstimate?.toLocaleString() || 'N/A'}
            color="bg-blue-100 dark:bg-blue-900/20"
            subtitle="Estimated audience reach"
          />

          <MetricItem
            icon={<Award className="w-5 h-5 text-purple-500" />}
            label="Viral Posts"
            value={metrics?.viralPostsCount || 0}
            color="bg-purple-100 dark:bg-purple-900/20"
            subtitle="High-impact content"
          />
        </div>
      </div>
    );
  }

  // Detailed variant (comprehensive analysis)
  return (
    <div className={cn('bg-white dark:bg-x-dark rounded-2xl p-6 border border-x-border space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-x-text dark:text-x-text-dark">
          Influence Analysis
        </h3>
        <div className={cn('px-4 py-2 rounded-full text-sm font-medium', tierColor)}>
          {tierDisplay} Influencer
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricItem
          icon={<Zap className="w-6 h-6 text-yellow-500" />}
          label="Overall Influence Score"
          value={influenceScore}
          change={showTrendAnalysis ? Math.floor(Math.random() * 20) - 10 : undefined}
          color="bg-yellow-100 dark:bg-yellow-900/20"
          subtitle={`Top ${100 - influenceScore}% of users`}
        />

        <MetricItem
          icon={<TrendingUp className="w-6 h-6 text-green-500" />}
          label="Engagement Rate"
          value={`${engagementRate}%`}
          change={showTrendAnalysis ? Math.floor(Math.random() * 10) - 5 : undefined}
          color="bg-green-100 dark:bg-green-900/20"
          subtitle="Above platform average"
        />

        <MetricItem
          icon={<Users className="w-6 h-6 text-blue-500" />}
          label="Estimated Reach"
          value={metrics?.reachEstimate?.toLocaleString() || `${Math.floor(user.followersCount * 1.5).toLocaleString()}`}
          color="bg-blue-100 dark:bg-blue-900/20"
          subtitle="Potential audience impact"
        />

        <MetricItem
          icon={<Award className="w-6 h-6 text-purple-500" />}
          label="Viral Content"
          value={metrics?.viralPostsCount || Math.floor(user.postsCount * 0.1)}
          color="bg-purple-100 dark:bg-purple-900/20"
          subtitle="High-performing posts"
        />
      </div>

      {/* Topic Authority */}
      {metrics?.topicAuthority && Object.keys(metrics.topicAuthority).length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-x-text dark:text-x-text-dark mb-3">
            Topic Authority
          </h4>
          <div className="space-y-2">
            {Object.entries(metrics.topicAuthority)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([topic, score]) => (
                <div key={topic} className="flex items-center justify-between">
                  <span className="text-sm text-x-text dark:text-x-text-dark capitalize">
                    {topic}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-x-text-secondary dark:text-x-text-secondary-dark w-8">
                      {Math.round(score)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Last Updated */}
      {metrics?.lastUpdated && (
        <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark text-center">
          Last updated: {new Date(metrics.lastUpdated).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
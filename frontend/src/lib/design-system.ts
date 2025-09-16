import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Political alignment types and utilities
 */
export type PoliticalAlignmentPosition =
  | 'conservative'
  | 'liberal'
  | 'progressive'
  | 'moderate'
  | 'libertarian'
  | 'independent';

export type InfluenceLevel =
  | 'minimal'
  | 'emerging'
  | 'rising'
  | 'influential'
  | 'viral';

export type EngagementType =
  | 'like'
  | 'repost'
  | 'comment'
  | 'share'
  | 'bookmark';

/**
 * Get political alignment color classes
 */
export function getPoliticalColorClasses(
  alignment: PoliticalAlignmentPosition,
  shade = 500
) {
  const colorMap = {
    conservative: `political-conservative-${shade}`,
    liberal: `political-liberal-${shade}`,
    progressive: `political-progressive-${shade}`,
    moderate: `political-moderate-${shade}`,
    libertarian: `political-libertarian-${shade}`,
    independent: `political-green-${shade}`,
  };

  return colorMap[alignment] || 'gray-500';
}

/**
 * Get political alignment text color for good contrast
 */
export function getPoliticalTextColor(
  alignment: PoliticalAlignmentPosition,
  isBackground = false
) {
  if (isBackground) {
    const textColorMap = {
      conservative: 'text-political-conservative-50',
      liberal: 'text-political-liberal-50',
      progressive: 'text-political-progressive-50',
      moderate: 'text-political-moderate-50',
      libertarian: 'text-political-libertarian-50',
      independent: 'text-political-green-50',
    };
    return textColorMap[alignment] || 'text-white';
  }

  const textColorMap = {
    conservative: 'text-political-conservative-600',
    liberal: 'text-political-liberal-600',
    progressive: 'text-political-progressive-600',
    moderate: 'text-political-moderate-600',
    libertarian: 'text-political-libertarian-600',
    independent: 'text-political-green-600',
  };

  return textColorMap[alignment] || 'text-gray-600';
}

/**
 * Get influence level color classes
 */
export function getInfluenceColorClasses(level: InfluenceLevel, _shade = 500) {
  const colorMap = {
    minimal: `influence-minimal`,
    emerging: `influence-emerging`,
    rising: `influence-rising`,
    influential: `influence-influential`,
    viral: `influence-viral`,
  };

  return colorMap[level] || 'gray-500';
}

/**
 * Get engagement action color
 */
export function getEngagementColor(action: EngagementType) {
  const colorMap = {
    like: 'engagement-like',
    repost: 'engagement-repost',
    comment: 'engagement-comment',
    share: 'engagement-share',
    bookmark: 'engagement-bookmark',
  };

  return colorMap[action] || 'x-light-gray';
}

/**
 * Get influence level display name
 */
export function getInfluenceDisplayName(level: InfluenceLevel): string {
  const displayNames = {
    minimal: 'New Voice',
    emerging: 'Rising',
    rising: 'Trending',
    influential: 'Influential',
    viral: 'Viral',
  };

  return displayNames[level] || 'Unknown';
}

/**
 * Get political alignment display name
 */
export function getPoliticalDisplayName(alignment: PoliticalAlignmentPosition): string {
  const displayNames = {
    conservative: 'Conservative',
    liberal: 'Liberal',
    progressive: 'Progressive',
    moderate: 'Moderate',
    libertarian: 'Libertarian',
    independent: 'Independent',
  };

  return displayNames[alignment] || 'Independent';
}

/**
 * Calculate influence score from metrics
 */
export function calculateInfluenceScore(metrics: {
  followers: number;
  engagement: number;
  reach: number;
  posts: number;
}): InfluenceLevel {
  const { followers, engagement, reach, posts } = metrics;

  // Weighted score calculation
  const score =
    (followers * 0.3 + engagement * 0.4 + reach * 0.2 + posts * 0.1) / 1000; // Normalize to reasonable scale

  if (score >= 100) return 'viral';
  if (score >= 50) return 'influential';
  if (score >= 20) return 'rising';
  if (score >= 5) return 'emerging';
  return 'minimal';
}

/**
 * Get X-like responsive breakpoint classes
 */
export function getResponsiveClasses() {
  return {
    container: 'max-w-x-content mx-auto px-4 sm:px-6 lg:px-8',
    grid: {
      desktop: 'grid-cols-x-layout',
      tablet: 'grid-cols-x-tablet',
      mobile: 'grid-cols-x-mobile',
    },
    sidebar: {
      left: 'hidden lg:block w-60 xl:w-72',
      right: 'hidden xl:block w-72',
    },
    main: 'flex-1 min-w-0',
  };
}

/**
 * Animation utility classes for real-time updates
 */
export function getAnimationClasses() {
  return {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    slideDown: 'animate-slide-down',
    slideInRight: 'animate-slide-in-right',
    slideOutRight: 'animate-slide-out-right',
    likeBurst: 'animate-like-burst',
    repostSpin: 'animate-repost-spin',
    politicalPulse: 'animate-political-pulse',
    influenceGlow: 'animate-influence-glow',
    typing: 'animate-typing',
    gentleBounce: 'animate-bounce-gentle',
  };
}

/**
 * X-like component variants
 */
export function getComponentVariants() {
  return {
    button: {
      primary:
        'bg-x-blue hover:bg-x-blue-hover text-white font-semibold py-2 px-6 rounded-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
      secondary:
        'border border-x-blue text-x-blue hover:bg-x-blue-light font-semibold py-2 px-6 rounded-full transition-all duration-200',
      ghost:
        'text-x-light-gray hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-all duration-200',
      political: (alignment: PoliticalAlignmentPosition) =>
        cn(
          'font-semibold py-2 px-6 rounded-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
          `bg-political-${alignment}-500 hover:bg-political-${alignment}-600 text-white`
        ),
    },
    post: {
      container:
        'border-b border-x-border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200 cursor-pointer',
      content: 'p-4 space-y-3',
      header: 'flex items-center space-x-3',
      body: 'text-x-text leading-relaxed',
      footer: 'flex items-center justify-between pt-2',
    },
    profile: {
      header: 'relative h-48 bg-gradient-to-r from-x-blue to-x-blue-hover',
      avatar:
        'absolute -bottom-16 left-4 w-32 h-32 border-4 border-white dark:border-gray-800 rounded-full',
      info: 'pt-20 px-4 pb-4',
      stats: 'flex space-x-6 text-sm text-x-text-secondary',
    },
    sidebar: {
      container: 'space-y-6 p-4',
      section: 'bg-x-surface rounded-2xl p-4 border border-x-border',
      title: 'text-xl font-bold text-x-text mb-3',
      item: 'flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-2 transition-colors duration-200',
    },
  };
}

/**
 * Theme toggle utilities
 */
export function getThemeClasses(isDark: boolean) {
  return {
    background: isDark ? 'bg-x-dark' : 'bg-white',
    surface: isDark ? 'bg-x-darker' : 'bg-white',
    text: isDark ? 'text-x-text-dark' : 'text-x-text',
    textSecondary: isDark
      ? 'text-x-text-secondary-dark'
      : 'text-x-text-secondary',
    border: isDark ? 'border-x-border-dark' : 'border-x-border',
  };
}

/**
 * Accessibility helpers
 */
export function getA11yClasses() {
  return {
    focusVisible:
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-x-blue focus-visible:ring-offset-2',
    screenReader: 'sr-only',
    skipLink:
      'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-x-blue text-white px-4 py-2 rounded-md z-50',
    highContrast: 'high-contrast:border-2 high-contrast:border-black',
  };
}

/**
 * Dark mode utilities
 */
export function createDarkModeToggle() {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem(
      'theme',
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
  };

  const initDarkMode = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  };

  return { toggleDarkMode, initDarkMode };
}

/**
 * Layout composition utilities
 */
export function getLayoutClasses() {
  return {
    app: 'min-h-screen bg-x-bg text-x-text',
    header:
      'sticky top-0 z-x-header bg-x-surface/80 backdrop-blur-sm border-b border-x-border',
    main: 'flex-1 flex',
    content: 'flex-1 max-w-x-content mx-auto',
    sidebar: {
      left: 'w-60 xl:w-72 p-4 space-y-6',
      right: 'w-72 p-4 space-y-6',
    },
    footer: 'border-t border-x-border p-4 text-center text-x-text-secondary',
  };
}

const designSystemUtils = {
  cn,
  getPoliticalColorClasses,
  getPoliticalTextColor,
  getInfluenceColorClasses,
  getEngagementColor,
  getInfluenceDisplayName,
  getPoliticalDisplayName,
  calculateInfluenceScore,
  getResponsiveClasses,
  getAnimationClasses,
  getComponentVariants,
  getThemeClasses,
  getA11yClasses,
  createDarkModeToggle,
  getLayoutClasses,
};

export default designSystemUtils;

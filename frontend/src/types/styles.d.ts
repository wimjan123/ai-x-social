// Type definitions for custom CSS classes and design system

declare module 'react' {
  interface HTMLAttributes<T = unknown> {
    // Allow political alignment classes
    'data-political'?:
      | 'conservative'
      | 'liberal'
      | 'progressive'
      | 'moderate'
      | 'libertarian'
      | 'green';
    // Allow influence level classes
    'data-influence'?:
      | 'minimal'
      | 'emerging'
      | 'rising'
      | 'influential'
      | 'viral';
    // Allow engagement type
    'data-engagement'?: 'like' | 'repost' | 'comment' | 'share' | 'bookmark';
  }
}

// Extend global CSS class types
declare global {
  namespace CSS {
    interface Properties {
      // Custom CSS properties for theme variables
      '--x-blue'?: string;
      '--x-blue-hover'?: string;
      '--x-text'?: string;
      '--x-text-secondary'?: string;
      '--x-border'?: string;
      '--x-background'?: string;
      '--political-conservative'?: string;
      '--political-liberal'?: string;
      '--political-progressive'?: string;
      '--influence-viral'?: string;
      '--influence-glow'?: string;
    }
  }
}

// Design system utility types
export type PoliticalAlignment =
  | 'conservative'
  | 'liberal'
  | 'progressive'
  | 'moderate'
  | 'libertarian'
  | 'green';

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

export type XComponentVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'political'
  | 'influence'
  | 'engagement';

export type ResponsiveBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type AnimationType =
  | 'fade-in'
  | 'fade-out'
  | 'slide-up'
  | 'slide-down'
  | 'slide-in-right'
  | 'slide-out-right'
  | 'like-burst'
  | 'repost-spin'
  | 'political-pulse'
  | 'influence-glow'
  | 'typing'
  | 'bounce-gentle';

export type ThemeMode = 'light' | 'dark' | 'system';

// Component prop types for design system integration
export interface PoliticalProps {
  politicalAlignment?: PoliticalAlignment;
  showPoliticalBorder?: boolean;
  politicalVariant?: 'solid' | 'outline' | 'ghost';
}

export interface InfluenceProps {
  influenceLevel?: InfluenceLevel;
  showInfluenceGlow?: boolean;
  influenceAnimation?: boolean;
}

export interface EngagementProps {
  engagementType?: EngagementType;
  isActive?: boolean;
  count?: number;
  showAnimation?: boolean;
}

export interface XStyleProps {
  variant?: XComponentVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: boolean;
  shadow?: boolean;
  hover?: boolean;
}

// Utility function types
export interface DesignSystemUtils {
  cn: (...inputs: any[]) => string;
  getPoliticalColorClasses: (
    alignment: PoliticalAlignment,
    shade?: number
  ) => string;
  getPoliticalTextColor: (
    alignment: PoliticalAlignment,
    isBackground?: boolean
  ) => string;
  getInfluenceColorClasses: (level: InfluenceLevel, shade?: number) => string;
  getEngagementColor: (action: EngagementType) => string;
  getInfluenceDisplayName: (level: InfluenceLevel) => string;
  getPoliticalDisplayName: (alignment: PoliticalAlignment) => string;
  calculateInfluenceScore: (metrics: {
    followers: number;
    engagement: number;
    reach: number;
    posts: number;
  }) => InfluenceLevel;
}

// Theme configuration types
export interface ThemeConfig {
  colors: {
    x: Record<string, string>;
    xBlue: Record<string, string>;
    political: Record<PoliticalAlignment, Record<string, string>>;
    influence: Record<InfluenceLevel, Record<string, string>>;
    engagement: Record<EngagementType, Record<string, string>>;
  };
  fonts: {
    heading: string;
    body: string;
  };
  components: Record<string, any>;
  styles: {
    global: (props: any) => Record<string, any>;
  };
  semanticTokens: {
    colors: Record<string, any>;
  };
}

export {};

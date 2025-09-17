/**
 * Test configuration and shared constants
 */

export const TEST_CONFIG = {
  // API endpoints
  API_BASE_URL: 'http://localhost:3001/api',
  NEWS_API_URL: '/api/news',
  POSTS_API_URL: '/api/posts',
  USERS_API_URL: '/api/users',

  // Test timeouts
  DEFAULT_TIMEOUT: 5000,
  ASYNC_TIMEOUT: 10000,
  ANIMATION_TIMEOUT: 1000,

  // Test data limits
  MAX_POST_LENGTH: 280,
  MAX_IMAGES_PER_POST: 4,
  MAX_DESCRIPTION_LENGTH: 500,

  // Political alignments
  POLITICAL_POSITIONS: [
    'conservative',
    'liberal',
    'progressive',
    'libertarian',
    'independent'
  ] as const,

  // Influence tiers
  INFLUENCE_TIERS: [
    'micro',
    'macro',
    'mega',
    'celebrity'
  ] as const,

  // News categories
  NEWS_CATEGORIES: [
    'politics',
    'technology',
    'economy',
    'sports',
    'entertainment',
    'health',
    'science',
    'world'
  ] as const,

  // Test user roles
  USER_ROLES: {
    REGULAR: 'regular',
    VERIFIED: 'verified',
    AI_PERSONA: 'ai_persona',
  } as const,

  // Common test strings
  SAMPLE_TEXTS: {
    SHORT_POST: 'This is a short test post.',
    LONG_POST: 'This is a much longer test post that contains more content to test how the application handles posts with more text. It should be long enough to test text truncation and other features that depend on content length.',
    OVER_LIMIT_POST: 'This is an extremely long post that exceeds the character limit for posts. '.repeat(10),
    HASHTAG_POST: 'This post contains #hashtags and mentions @username for testing.',
    EMOJI_POST: 'This post contains emojis 😀 🎉 🚀 for testing Unicode support.',
    MARKDOWN_POST: 'This post contains **bold text** and *italic text* for testing markdown.',
    URL_POST: 'This post contains a URL: https://example.com for testing link detection.',
  },

  // Test file data
  SAMPLE_FILES: {
    VALID_IMAGE: {
      name: 'test-image.jpg',
      type: 'image/jpeg',
      size: 1024 * 1024, // 1MB
    },
    LARGE_IMAGE: {
      name: 'large-image.jpg',
      type: 'image/jpeg',
      size: 10 * 1024 * 1024, // 10MB
    },
    INVALID_FILE: {
      name: 'test-document.pdf',
      type: 'application/pdf',
      size: 1024,
    },
  },

  // Test dates
  SAMPLE_DATES: {
    RECENT: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    HOUR_AGO: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    DAY_AGO: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    WEEK_AGO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
    MONTH_AGO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 1 month ago
  },

  // Test breakpoints for responsive testing
  BREAKPOINTS: {
    MOBILE: 320,
    TABLET: 768,
    DESKTOP: 1024,
    LARGE_DESKTOP: 1440,
  },

  // Common CSS classes for testing
  CSS_CLASSES: {
    LOADING: 'animate-spin',
    FADE_IN: 'animate-fade-in',
    DISABLED: 'opacity-50',
    HIDDEN: 'hidden',
    VISIBLE: 'visible',
    ERROR: 'text-red-500',
    SUCCESS: 'text-green-500',
    WARNING: 'text-yellow-500',
  },

  // Test IDs for consistent testing
  TEST_IDS: {
    POST_COMPOSER: 'post-composer',
    POST_CARD: 'post-card',
    NEWS_FEED: 'news-feed',
    NEWS_CARD: 'news-card',
    PERSONA_INDICATOR: 'persona-indicator',
    POLITICAL_SELECTOR: 'political-selector',
    LOADING_SPINNER: 'loading-spinner',
    ERROR_MESSAGE: 'error-message',
    SUCCESS_MESSAGE: 'success-message',
  },

  // Accessibility labels
  ARIA_LABELS: {
    LIKE_BUTTON: 'Like post',
    REPLY_BUTTON: 'Reply to post',
    REPOST_BUTTON: 'Repost',
    SHARE_BUTTON: 'Share post',
    BOOKMARK_BUTTON: 'Bookmark post',
    ADD_IMAGES: 'Add images',
    REMOVE_IMAGE: 'Remove image',
    POST_SUBMIT: 'Post',
    REPLY_SUBMIT: 'Reply',
  },

  // Mock data counts
  MOCK_COUNTS: {
    SMALL_FOLLOWER_COUNT: 100,
    MEDIUM_FOLLOWER_COUNT: 10000,
    LARGE_FOLLOWER_COUNT: 100000,
    CELEBRITY_FOLLOWER_COUNT: 1000000,
    LOW_INFLUENCE: 25,
    MEDIUM_INFLUENCE: 50,
    HIGH_INFLUENCE: 85,
  },
};

// Helper to get test environment info
export const getTestEnvironment = () => ({
  isCI: process.env.CI === 'true',
  isDebug: process.env.DEBUG === 'true',
  testTimeout: process.env.TEST_TIMEOUT ? parseInt(process.env.TEST_TIMEOUT) : TEST_CONFIG.DEFAULT_TIMEOUT,
  nodeEnv: process.env.NODE_ENV || 'test',
});

// Helper to create test-specific timeouts
export const createTestTimeouts = () => ({
  short: TEST_CONFIG.DEFAULT_TIMEOUT / 2,
  normal: TEST_CONFIG.DEFAULT_TIMEOUT,
  long: TEST_CONFIG.ASYNC_TIMEOUT,
  animation: TEST_CONFIG.ANIMATION_TIMEOUT,
});

// Helper to create viewport configs for responsive testing
export const createViewportConfigs = () => ({
  mobile: { width: TEST_CONFIG.BREAKPOINTS.MOBILE, height: 568 },
  tablet: { width: TEST_CONFIG.BREAKPOINTS.TABLET, height: 1024 },
  desktop: { width: TEST_CONFIG.BREAKPOINTS.DESKTOP, height: 768 },
  largeDesktop: { width: TEST_CONFIG.BREAKPOINTS.LARGE_DESKTOP, height: 900 },
});

// Helper to create consistent test assertions
export const createTestMatchers = () => ({
  toBeVisible: (element: HTMLElement) => expect(element).toBeVisible(),
  toBeHidden: (element: HTMLElement) => expect(element).not.toBeVisible(),
  toHaveClass: (element: HTMLElement, className: string) => expect(element).toHaveClass(className),
  toNotHaveClass: (element: HTMLElement, className: string) => expect(element).not.toHaveClass(className),
  toBeDisabled: (element: HTMLElement) => expect(element).toBeDisabled(),
  toBeEnabled: (element: HTMLElement) => expect(element).toBeEnabled(),
  toHaveText: (element: HTMLElement, text: string) => expect(element).toHaveTextContent(text),
  toContainText: (element: HTMLElement, text: string) => expect(element).toHaveTextContent(expect.stringContaining(text)),
});

export default TEST_CONFIG;
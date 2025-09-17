import { jest } from '@jest/globals';
import React from 'react';

/**
 * Setup mocks for testing environment
 * This file contains common mocks that are used across multiple test files
 */

// Mock Next.js modules
export const mockNextRouter = () => {
  jest.mock('next/router', () => ({
    useRouter: () => ({
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
      isLocaleDomain: true,
      isReady: true,
      defaultLocale: 'en',
      domainLocales: [],
      isPreview: false,
    }),
  }));
};

export const mockNextNavigation = () => {
  jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }),
    useSearchParams: () => ({
      get: jest.fn(),
      getAll: jest.fn(),
      has: jest.fn(),
      keys: jest.fn(),
      values: jest.fn(),
      entries: jest.fn(),
      forEach: jest.fn(),
      toString: jest.fn(),
    }),
    usePathname: () => '/',
    useParams: () => ({}),
  }));
};

// Mock design system utilities
export const mockDesignSystem = () => {
  jest.mock('@/lib/design-system', () => ({
    cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
    getPoliticalColorClasses: (position: string, shade: number) => `political-${position}-${shade}`,
    getPoliticalDisplayName: (position: string) => {
      const names: Record<string, string> = {
        conservative: 'Conservative',
        liberal: 'Liberal',
        progressive: 'Progressive',
        libertarian: 'Libertarian',
        independent: 'Independent',
      };
      return names[position] || position;
    },
    getAnimationClasses: () => ({
      fadeIn: 'animate-fade-in',
      slideIn: 'animate-slide-in',
      bounce: 'animate-bounce',
      pulse: 'animate-pulse',
    }),
  }));
};

// Mock Lucide React icons
export const mockLucideIcons = () => {
  const createMockIcon = (testId: string) => ({ className, ...props }: any) =>
    React.createElement('div', { 'data-testid': testId, className, ...props });

  jest.mock('lucide-react', () => ({
    // User and persona icons
    Bot: createMockIcon('bot-icon'),
    User: createMockIcon('user-icon'),
    Shield: createMockIcon('shield-icon'),
    Zap: createMockIcon('zap-icon'),
    CheckCircle: createMockIcon('check-circle-icon'),

    // Political alignment icons
    Flag: createMockIcon('flag-icon'),
    Scale: createMockIcon('scale-icon'),
    TrendingUp: createMockIcon('trending-up-icon'),
    Users: createMockIcon('users-icon'),
    Heart: createMockIcon('heart-icon'),

    // Post composer icons
    Image: createMockIcon('image-icon'),
    Smile: createMockIcon('smile-icon'),
    MapPin: createMockIcon('map-pin-icon'),
    Calendar: createMockIcon('calendar-icon'),
    X: createMockIcon('x-icon'),
    Camera: createMockIcon('camera-icon'),

    // Post interaction icons
    MoreHorizontal: createMockIcon('more-horizontal-icon'),
    MessageCircle: createMockIcon('message-circle-icon'),
    Repeat2: createMockIcon('repeat-icon'),
    Share: createMockIcon('share-icon'),
    Bookmark: createMockIcon('bookmark-icon'),

    // Loading and status icons
    Loader2: createMockIcon('loader-icon'),
    RefreshCw: createMockIcon('refresh-icon'),
    AlertCircle: createMockIcon('alert-circle-icon'),
    Search: createMockIcon('search-icon'),
    Filter: createMockIcon('filter-icon'),

    // Navigation icons
    Home: createMockIcon('home-icon'),
    Bell: createMockIcon('bell-icon'),
    Mail: createMockIcon('mail-icon'),
    Settings: createMockIcon('settings-icon'),
    LogOut: createMockIcon('logout-icon'),

    // Trend and news icons
    TrendingDown: createMockIcon('trending-down-icon'),
    BarChart3: createMockIcon('bar-chart-icon'),
    Globe: createMockIcon('globe-icon'),
    Clock: createMockIcon('clock-icon'),
    ExternalLink: createMockIcon('external-link-icon'),
  }));
};

// Mock date-fns utilities
export const mockDateFns = () => {
  jest.mock('date-fns', () => ({
    formatDistanceToNow: (date: Date) => {
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

      if (diffInMinutes < 1) return 'now';
      if (diffInMinutes < 60) return `${diffInMinutes}m`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
      return `${Math.floor(diffInMinutes / 1440)}d`;
    },
    format: (date: Date, formatStr: string) => {
      if (formatStr === 'PPP') return date.toLocaleDateString();
      if (formatStr === 'p') return date.toLocaleTimeString();
      return date.toISOString();
    },
    isToday: (date: Date) => {
      const today = new Date();
      return date.toDateString() === today.toDateString();
    },
    isYesterday: (date: Date) => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return date.toDateString() === yesterday.toDateString();
    },
  }));
};

// Mock API services
export const mockApiServices = () => {
  jest.mock('@/services/api', () => ({
    apiClient: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
    },
    authApi: {
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      refreshToken: jest.fn(),
      getCurrentUser: jest.fn(),
    },
    postsApi: {
      getPosts: jest.fn(),
      createPost: jest.fn(),
      updatePost: jest.fn(),
      deletePost: jest.fn(),
      likePost: jest.fn(),
      repostPost: jest.fn(),
      bookmarkPost: jest.fn(),
    },
    newsApi: {
      getNews: jest.fn(),
      getNewsCategories: jest.fn(),
      searchNews: jest.fn(),
      getTrendingNews: jest.fn(),
    },
    usersApi: {
      getUser: jest.fn(),
      updateUser: jest.fn(),
      followUser: jest.fn(),
      unfollowUser: jest.fn(),
      getUserFollowers: jest.fn(),
      getUserFollowing: jest.fn(),
    },
  }));
};

// Mock Chakra UI components that need special handling
export const mockChakraComponents = () => {
  jest.mock('@chakra-ui/react', () => ({
    // Layout components
    Box: ({ children, className, ...props }: any) =>
      React.createElement('div', { className, ...props }, children),
    VStack: ({ children, className, ...props }: any) =>
      React.createElement('div', { className: `flex flex-col ${className}`, ...props }, children),
    HStack: ({ children, className, ...props }: any) =>
      React.createElement('div', { className: `flex flex-row ${className}`, ...props }, children),
    SimpleGrid: ({ children, className, ...props }: any) =>
      React.createElement('div', { className: `grid ${className}`, ...props }, children),

    // Form components
    FormControl: ({ children, ...props }: any) =>
      React.createElement('div', props, children),
    FormLabel: ({ children, ...props }: any) =>
      React.createElement('label', props, children),
    Button: ({ children, onClick, disabled, isLoading, className, ...props }: any) =>
      React.createElement('button',
        { onClick, disabled: disabled || isLoading, className, ...props },
        isLoading ? 'Loading...' : children
      ),
    Textarea: ({ onChange, value, placeholder, ...props }: any) =>
      React.createElement('textarea', { onChange, value, placeholder, ...props }),

    // Slider components
    Slider: ({ children, value, onChange, min, max, step, ...props }: any) =>
      React.createElement('div', props, [
        React.createElement('input', {
          key: 'slider-input',
          type: 'range',
          role: 'slider',
          value,
          onChange: (e: any) => onChange && onChange(Number(e.target.value)),
          min,
          max,
          step,
        }),
        children,
      ]),
    SliderTrack: ({ children, ...props }: any) =>
      React.createElement('div', props, children),
    SliderFilledTrack: ({ ...props }: any) =>
      React.createElement('div', props),
    SliderThumb: ({ children, ...props }: any) =>
      React.createElement('div', props, children),

    // Display components
    Text: ({ children, className, ...props }: any) =>
      React.createElement('span', { className, ...props }, children),
    Badge: ({ children, className, ...props }: any) =>
      React.createElement('span', { className: `badge ${className}`, ...props }, children),
    Tooltip: ({ children, label, ...props }: any) =>
      React.createElement('div', { title: label, ...props }, children),

    // Hooks and utilities
    useColorModeValue: (light: any, dark: any) => light,
    ChakraProvider: ({ children }: any) => children,
  }));
};

// Mock framer-motion
export const mockFramerMotion = () => {
  jest.mock('framer-motion', () => ({
    motion: {
      div: ({ children, ...props }: any) =>
        React.createElement('div', props, children),
      span: ({ children, ...props }: any) =>
        React.createElement('span', props, children),
      button: ({ children, ...props }: any) =>
        React.createElement('button', props, children),
    },
    AnimatePresence: ({ children }: any) => children,
    useAnimation: () => ({
      start: jest.fn(),
      stop: jest.fn(),
      set: jest.fn(),
    }),
  }));
};

// Mock localStorage and sessionStorage
export const mockStorage = () => {
  const createStorageMock = () => {
    let storage: Record<string, string> = {};

    return {
      getItem: jest.fn((key: string) => storage[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        storage[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete storage[key];
      }),
      clear: jest.fn(() => {
        storage = {};
      }),
      get length() {
        return Object.keys(storage).length;
      },
      key: jest.fn((index: number) => {
        const keys = Object.keys(storage);
        return keys[index] || null;
      }),
    };
  };

  Object.defineProperty(window, 'localStorage', {
    value: createStorageMock(),
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: createStorageMock(),
  });
};

// Mock WebAPI features
export const mockWebAPIs = () => {
  // Mock IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  };

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  };

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock fetch
  global.fetch = jest.fn();

  // Mock URL methods
  global.URL.createObjectURL = jest.fn(() => 'mocked-object-url');
  global.URL.revokeObjectURL = jest.fn();

  // Mock FileReader
  const mockFileReader = {
    readAsDataURL: jest.fn(),
    readAsText: jest.fn(),
    readAsArrayBuffer: jest.fn(),
    result: 'mocked-file-data',
    error: null,
    onload: null,
    onerror: null,
    onabort: null,
    onloadstart: null,
    onloadend: null,
    onprogress: null,
    readyState: 0,
    EMPTY: 0,
    LOADING: 1,
    DONE: 2,
    abort: jest.fn(),
  };

  Object.defineProperty(global, 'FileReader', {
    writable: true,
    value: jest.fn(() => mockFileReader),
  });
};

// Setup all common mocks
export const setupAllMocks = () => {
  mockNextRouter();
  mockNextNavigation();
  mockDesignSystem();
  mockLucideIcons();
  mockDateFns();
  mockApiServices();
  mockChakraComponents();
  mockFramerMotion();
  mockStorage();
  mockWebAPIs();
};

// Cleanup function
export const cleanupMocks = () => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
};
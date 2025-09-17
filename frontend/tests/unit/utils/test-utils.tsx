import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import type { User, AIPersona, Post, NewsArticle, PoliticalAlignment } from '@/types';

// Mock providers wrapper
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  );
};

// Custom render function with all providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything from testing library
export * from '@testing-library/react';
export { customRender as render };

// Test data factories
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-1',
  username: 'testuser',
  displayName: 'Test User',
  email: 'test@example.com',
  avatarUrl: 'https://example.com/avatar.jpg',
  bio: 'Test user bio',
  location: 'Test City',
  website: 'https://testuser.com',
  verified: false,
  followersCount: 100,
  followingCount: 50,
  postsCount: 25,
  influenceScore: 75,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
  ...overrides,
});

export const createMockVerifiedUser = (overrides: Partial<User> = {}): User => ({
  ...createMockUser(),
  id: 'verified-user-1',
  username: 'verifieduser',
  displayName: 'Verified User',
  verified: true,
  followersCount: 50000,
  influenceScore: 85,
  ...overrides,
});

export const createMockUserWithPoliticalAlignment = (
  alignment: Partial<PoliticalAlignment> = {},
  userOverrides: Partial<User> = {}
): User => ({
  ...createMockUser(),
  id: 'political-user-1',
  username: 'politicaluser',
  displayName: 'Political User',
  politicalAlignment: {
    position: 'conservative',
    intensity: 7,
    keyIssues: ['Economy', 'Security'],
    description: 'Conservative political views',
    ...alignment,
  },
  ...userOverrides,
});

export const createMockAIPersona = (overrides: Partial<AIPersona> = {}): AIPersona => ({
  id: 'ai-1',
  name: 'AI Conservative',
  displayName: 'Conservative AI Voice',
  username: 'ai_conservative',
  bio: 'AI persona with conservative political views',
  avatarUrl: 'https://example.com/ai-avatar.jpg',
  verified: true,
  followersCount: 75000,
  followingCount: 200,
  postsCount: 1200,
  politicalAlignment: {
    position: 'conservative',
    intensity: 8,
    keyIssues: ['Economy', 'Security', 'Traditional Values'],
    description: 'Strong conservative political stance',
  },
  personality: {
    openness: 6,
    conscientiousness: 8,
    extraversion: 7,
    agreeableness: 5,
    neuroticism: 3,
    formalityLevel: 8,
    humorLevel: 4,
  },
  responseStyle: {
    averageResponseTime: 2,
    postFrequency: 6,
    engagementStyle: 'analytical',
    topicFocus: ['politics', 'economy', 'security'],
    languageComplexity: 'moderate',
  },
  topicExpertise: ['politics', 'economy', 'foreign-policy'],
  influenceMetrics: {
    score: 88,
    tier: 'mega',
    engagementRate: 14.2,
    reachEstimate: 95000,
    topicAuthority: {
      politics: 0.92,
      economy: 0.88,
      security: 0.85,
    },
    viralPostsCount: 18,
    lastUpdated: new Date(),
  },
  influenceScore: 88,
  isActive: true,
  lastActiveAt: new Date(),
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
  ...overrides,
});

export const createMockPost = (
  author: User | AIPersona = createMockUser(),
  overrides: Partial<Post> = {}
): Post => ({
  id: 'post-1',
  content: 'This is a test post with some interesting content to discuss.',
  authorId: author.id,
  author,
  images: undefined,
  likesCount: 15,
  repliesCount: 3,
  repostsCount: 2,
  isLiked: false,
  isReposted: false,
  isBookmarked: false,
  createdAt: new Date('2023-12-01T10:00:00Z'),
  updatedAt: new Date('2023-12-01T10:00:00Z'),
  ...overrides,
});

export const createMockPostWithImages = (
  author: User | AIPersona = createMockUser(),
  imageCount: number = 2,
  overrides: Partial<Post> = {}
): Post => ({
  ...createMockPost(author),
  images: Array.from({ length: imageCount }, (_, i) =>
    `https://example.com/image-${i + 1}.jpg`
  ),
  content: 'Post with attached images',
  ...overrides,
});

export const createMockReply = (
  parentPost: Post,
  author: User | AIPersona = createMockUser(),
  overrides: Partial<Post> = {}
): Post => ({
  ...createMockPost(author),
  id: 'reply-1',
  content: 'This is a reply to the original post.',
  parentPostId: parentPost.id,
  parentPost,
  ...overrides,
});

export const createMockNewsArticle = (overrides: Partial<NewsArticle> = {}): NewsArticle => ({
  id: 'news-1',
  title: 'Breaking Political News Update',
  description: 'Important political development affecting national policy',
  url: 'https://example.com/news/political-update',
  imageUrl: 'https://example.com/news-image.jpg',
  publishedAt: new Date('2023-12-01T08:00:00Z'),
  source: 'News Source',
  category: 'politics',
  politicalLean: 'center',
  sentiment: 0.1,
  relevanceScore: 0.9,
  ...overrides,
});

export const createMockPoliticalAlignment = (
  overrides: Partial<PoliticalAlignment> = {}
): PoliticalAlignment => ({
  position: 'independent',
  intensity: 5,
  keyIssues: [],
  description: '',
  ...overrides,
});

// Mock API responses
export const createMockApiResponse = <T>(data: T, success: boolean = true) => ({
  success,
  data,
  message: success ? 'Success' : 'Error occurred',
});

export const createMockPaginatedResponse = <T>(
  data: T[],
  page: number = 1,
  limit: number = 20,
  total: number = data.length
) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  },
});

// Mock API error response
export const createMockErrorResponse = (message: string, statusCode: number = 400) => ({
  success: false,
  error: 'API Error',
  message,
  statusCode,
});

// Mock fetch responses
export const mockFetchSuccess = <T>(data: T) => {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  } as Response);
};

export const mockFetchError = (message: string, status: number = 400) => {
  return Promise.resolve({
    ok: false,
    status,
    statusText: message,
    json: () => Promise.resolve({ error: message }),
  } as Response);
};

export const mockFetchReject = (error: string) => {
  return Promise.reject(new Error(error));
};

// File helpers for testing
export const createMockFile = (
  name: string = 'test.jpg',
  type: string = 'image/jpeg',
  size: number = 1024
): File => {
  const content = new Array(size).fill('a').join('');
  return new File([content], name, { type });
};

export const createMockImageFiles = (count: number = 3): File[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockFile(`image-${i + 1}.jpg`, 'image/jpeg')
  );
};

// Event helpers
export const createMockEvent = <T extends Event>(
  type: string,
  target: Partial<EventTarget> = {}
): T => {
  const event = new Event(type) as T;
  Object.assign(event, { target });
  return event;
};

export const createMockChangeEvent = (value: string): React.ChangeEvent<HTMLInputElement> => {
  return {
    target: { value },
    currentTarget: { value },
  } as React.ChangeEvent<HTMLInputElement>;
};

export const createMockTextareaChangeEvent = (value: string): React.ChangeEvent<HTMLTextAreaElement> => {
  return {
    target: { value },
    currentTarget: { value },
  } as React.ChangeEvent<HTMLTextAreaElement>;
};

// Common test assertions
export const expectElementToHaveClasses = (element: HTMLElement, classes: string[]) => {
  classes.forEach(className => {
    expect(element).toHaveClass(className);
  });
};

export const expectElementNotToHaveClasses = (element: HTMLElement, classes: string[]) => {
  classes.forEach(className => {
    expect(element).not.toHaveClass(className);
  });
};

// Async helpers
export const waitForApiCall = (mockFn: jest.Mock, callIndex: number = 0) => {
  return new Promise<void>((resolve) => {
    const checkCall = () => {
      if (mockFn.mock.calls.length > callIndex) {
        resolve();
      } else {
        setTimeout(checkCall, 10);
      }
    };
    checkCall();
  });
};

// Testing utilities for complex scenarios
export const createCompleteTestScenario = () => {
  const user = createMockUser();
  const aiPersona = createMockAIPersona();
  const userPost = createMockPost(user);
  const aiPost = createMockPost(aiPersona);
  const reply = createMockReply(userPost, aiPersona);
  const newsArticle = createMockNewsArticle();

  return {
    user,
    aiPersona,
    userPost,
    aiPost,
    reply,
    newsArticle,
    allUsers: [user, aiPersona],
    allPosts: [userPost, aiPost, reply],
  };
};

// Mock implementations for external dependencies
export const mockDesignSystemUtils = {
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
  }),
};

// Mock icon components
export const mockIcons = {
  Bot: ({ className, ...props }: any) => <div data-testid="bot-icon" className={className} {...props} />,
  User: ({ className, ...props }: any) => <div data-testid="user-icon" className={className} {...props} />,
  Shield: ({ className, ...props }: any) => <div data-testid="shield-icon" className={className} {...props} />,
  Zap: ({ className, ...props }: any) => <div data-testid="zap-icon" className={className} {...props} />,
  Flag: ({ className, ...props }: any) => <div data-testid="flag-icon" className={className} {...props} />,
  Scale: ({ className, ...props }: any) => <div data-testid="scale-icon" className={className} {...props} />,
  TrendingUp: ({ className, ...props }: any) => <div data-testid="trending-up-icon" className={className} {...props} />,
  Users: ({ className, ...props }: any) => <div data-testid="users-icon" className={className} {...props} />,
  Heart: ({ className, ...props }: any) => <div data-testid="heart-icon" className={className} {...props} />,
  Image: ({ className, ...props }: any) => <div data-testid="image-icon" className={className} {...props} />,
  Smile: ({ className, ...props }: any) => <div data-testid="smile-icon" className={className} {...props} />,
  MapPin: ({ className, ...props }: any) => <div data-testid="map-pin-icon" className={className} {...props} />,
  Calendar: ({ className, ...props }: any) => <div data-testid="calendar-icon" className={className} {...props} />,
  X: ({ className, ...props }: any) => <div data-testid="x-icon" className={className} {...props} />,
  MoreHorizontal: ({ className, ...props }: any) => <div data-testid="more-horizontal-icon" className={className} {...props} />,
  CheckCircle: ({ className, ...props }: any) => <div data-testid="check-circle-icon" className={className} {...props} />,
  Loader2: ({ className, ...props }: any) => <div data-testid="loader-icon" className={className} {...props} />,
  RefreshCw: ({ className, ...props }: any) => <div data-testid="refresh-icon" className={className} {...props} />,
  AlertCircle: ({ className, ...props }: any) => <div data-testid="alert-circle-icon" className={className} {...props} />,
};

// Common mock implementations
export const mockGlobalAPIs = () => {
  // Mock URL object methods
  global.URL.createObjectURL = jest.fn(() => 'mocked-object-url');
  global.URL.revokeObjectURL = jest.fn();

  // Mock FileReader
  const mockFileReader = {
    readAsDataURL: jest.fn(),
    result: 'data:image/jpeg;base64,mock-image-data',
    onload: null as any,
  };

  Object.defineProperty(global, 'FileReader', {
    writable: true,
    value: jest.fn(() => mockFileReader),
  });

  // Mock fetch
  global.fetch = jest.fn();

  // Mock console methods for cleaner test output
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
};

export const restoreGlobalAPIs = () => {
  jest.restoreAllMocks();
};
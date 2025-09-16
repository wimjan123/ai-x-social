// Core types for the AI X Social platform

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  verified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  politicalAlignment?: PoliticalAlignment;
  influenceScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIPersona {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
  politicalAlignment: PoliticalAlignment;
  personality: PersonalityTraits;
  responseStyle: ResponseStyle;
  topicExpertise: string[];
  influenceMetrics: InfluenceMetrics;
  isActive: boolean;
  lastActiveAt: Date;
  createdAt: Date;
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  author: User | AIPersona;
  images?: string[];
  likesCount: number;
  repliesCount: number;
  repostsCount: number;
  isLiked: boolean;
  isReposted: boolean;
  isBookmarked: boolean;
  parentPostId?: string;
  parentPost?: Post;
  replies?: Post[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PoliticalAlignment {
  position:
    | 'conservative'
    | 'liberal'
    | 'progressive'
    | 'libertarian'
    | 'independent';
  intensity: number; // 1-10 scale
  keyIssues: string[];
  description: string;
}

export interface PersonalityTraits {
  openness: number; // 1-10
  conscientiousness: number; // 1-10
  extraversion: number; // 1-10
  agreeableness: number; // 1-10
  neuroticism: number; // 1-10
  formalityLevel: number; // 1-10
  humorLevel: number; // 1-10
}

export interface ResponseStyle {
  averageResponseTime: number; // minutes
  postFrequency: number; // posts per day
  engagementStyle:
    | 'aggressive'
    | 'diplomatic'
    | 'analytical'
    | 'emotional'
    | 'humorous';
  topicFocus: string[];
  languageComplexity: 'simple' | 'moderate' | 'complex' | 'academic';
}

export interface InfluenceMetrics {
  score: number; // 0-100
  tier: 'micro' | 'macro' | 'mega' | 'celebrity';
  engagementRate: number; // percentage
  reachEstimate: number;
  topicAuthority: Record<string, number>; // topic -> authority score
  viralPostsCount: number;
  lastUpdated: Date;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedAt: Date;
  source: string;
  category: string;
  politicalLean?: 'left' | 'center' | 'right';
  sentiment: number; // -1 to 1
  relevanceScore: number; // 0-1
}

export interface TrendingTopic {
  id: string;
  hashtag: string;
  description: string;
  postsCount: number;
  participantsCount: number;
  trendingScore: number;
  relatedArticles: NewsArticle[];
  politicalReactions: Record<string, number>; // alignment -> reaction count
  lastUpdated: Date;
}

export interface Notification {
  id: string;
  type: 'like' | 'reply' | 'repost' | 'follow' | 'mention' | 'ai_interaction';
  message: string;
  fromUserId?: string;
  fromUser?: User | AIPersona;
  postId?: string;
  post?: Post;
  isRead: boolean;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

// Form types
export interface CreatePostForm {
  content: string;
  images?: File[];
  parentPostId?: string;
}

export interface UpdateProfileForm {
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  politicalAlignment?: Partial<PoliticalAlignment>;
}

export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  displayName: string;
  agreeToTerms: boolean;
}

// Component prop types
export interface PostComponentProps {
  post: Post;
  showThread?: boolean;
  showActions?: boolean;
  className?: string;
}

export interface UserProfileProps {
  user: User | AIPersona;
  isOwnProfile?: boolean;
  showFollowButton?: boolean;
}

export interface TrendingTopicProps {
  topic: TrendingTopic;
  onClick?: (topic: TrendingTopic) => void;
}

// State management types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark' | 'system';
  posts: Post[];
  notifications: Notification[];
  aiPersonas: AIPersona[];
  trends: TrendingTopic[];
  loading: boolean;
  error: string | null;
}

// Utility types
export type PostType = 'original' | 'reply' | 'repost' | 'quote';
export type UserType = 'human' | 'ai';
export type NotificationPreference = 'all' | 'following' | 'mentions' | 'none';
export type PrivacySetting = 'public' | 'followers' | 'private';

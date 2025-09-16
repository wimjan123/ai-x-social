// Common types used across the application

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// User types
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  displayName: string;
  bio?: string;
}

// AI Persona types
export enum PoliticalAlignment {
  FAR_LEFT = 'FAR_LEFT',
  LEFT = 'LEFT',
  CENTER_LEFT = 'CENTER_LEFT',
  CENTER = 'CENTER',
  CENTER_RIGHT = 'CENTER_RIGHT',
  RIGHT = 'RIGHT',
  FAR_RIGHT = 'FAR_RIGHT',
}

export enum PersonaType {
  POLITICIAN = 'POLITICIAN',
  ACTIVIST = 'ACTIVIST',
  JOURNALIST = 'JOURNALIST',
  INFLUENCER = 'INFLUENCER',
  ACADEMIC = 'ACADEMIC',
}

export interface AIPersona {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatarUrl?: string;
  politicalAlignment: PoliticalAlignment;
  personaType: PersonaType;
  personality: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Post types
export interface Post {
  id: string;
  content: string;
  authorId: string;
  isAIGenerated: boolean;
  mediaUrls?: string[];
  hashtags?: string[];
  mentions?: string[];
  replyToId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostData {
  content: string;
  mediaUrls?: string[];
  replyToId?: string;
}

// Interaction types
export enum InteractionType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  REPOST = 'REPOST',
  REPLY = 'REPLY',
  FOLLOW = 'FOLLOW',
  UNFOLLOW = 'UNFOLLOW',
}

export interface Interaction {
  id: string;
  userId: string;
  targetId: string;
  type: InteractionType;
  createdAt: Date;
}

// News types
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary?: string;
  url: string;
  source: string;
  publishedAt: Date;
  category?: string;
  sentiment?: number;
  tags?: string[];
}

// AI Service types
export enum AIProvider {
  CLAUDE = 'CLAUDE',
  GPT = 'GPT',
  GEMINI = 'GEMINI',
  DEMO = 'DEMO',
}

export interface AIRequest {
  prompt: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
  personaId?: string;
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  tokensUsed?: number;
  model?: string;
  finishReason?: string;
}
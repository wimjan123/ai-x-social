// Real-time service types and interfaces
// Implements realtime-architecture.md specifications

import { Response } from 'express';
import { WebSocket } from 'ws';
import { Post, UserProfile, Persona, Trend, NewsItem } from '../../generated/prisma';

// Core real-time event interfaces
export interface RealtimeEvent {
  type: string;
  id?: string;
  data: any;
  timestamp: string;
  userId?: string;
}

export interface SSEEvent {
  type: string;
  id?: string;
  data: any;
}

// SSE Connection Management
export interface SSEConnection {
  id: string;
  userId?: string;
  response: Response;
  connectedAt: Date;
  lastActivity: Date;
  subscriptions: string[];
  filters?: UserFilters;
}

// WebSocket Connection Management
export interface WSConnection {
  id: string;
  userId: string;
  socket: WebSocket;
  connectedAt: Date;
  lastPing: Date;
  subscriptions: Set<string>;
  isAlive: boolean;
}

// User filtering and preferences
export interface UserFilters {
  blockedUsers?: string[];
  blockedTopics?: string[];
  politicalFilter?: PoliticalFilter;
  regionFilter?: string[];
  contentFilter?: ContentFilter;
}

export interface PoliticalFilter {
  alignment?: string;
  showOpposing?: boolean;
  showNeutral?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export interface ContentFilter {
  minEngagement?: number;
  maxAge?: number; // hours
  excludeRetweets?: boolean;
  excludeAI?: boolean;
}

// Specific event types for type safety
export interface PostCreatedEvent extends RealtimeEvent {
  type: 'posts';
  data: {
    postId: string;
    post: Post;
    author: UserProfile;
    authorId: string;
    timestamp: string;
  };
}

export interface PostReactionEvent extends RealtimeEvent {
  type: 'reactions';
  data: {
    postId: string;
    userId: string;
    reactionType: ReactionType;
    newCount: number;
    timestamp: string;
  };
}

export interface TrendUpdateEvent extends RealtimeEvent {
  type: 'trends';
  data: {
    trend: Trend;
    action: 'new' | 'update' | 'expired';
    timestamp: string;
  };
}

export interface NewsItemEvent extends RealtimeEvent {
  type: 'news';
  data: {
    newsItem: NewsItem;
    relevanceScore: number;
    timestamp: string;
  };
}

export interface AIResponseEvent extends RealtimeEvent {
  type: 'ai_responses';
  data: {
    responseId: string;
    post: Post;
    persona: Persona;
    originalPostId?: string;
    timestamp: string;
  };
}

export interface TypingIndicatorEvent extends RealtimeEvent {
  type: 'typing_indicators';
  data: {
    userId: string;
    threadId: string;
    action: 'start' | 'stop';
    timestamp: string;
  };
}

export interface LiveReactionEvent extends RealtimeEvent {
  type: 'live_reactions';
  data: {
    postId: string;
    userId: string;
    reaction: ReactionType;
    timestamp: number;
  };
}

export interface UserStatusEvent extends RealtimeEvent {
  type: 'user_status';
  data: {
    userId: string;
    status: 'online' | 'offline';
    timestamp: string;
  };
}

// Reaction types
export type ReactionType = 'like' | 'dislike' | 'laugh' | 'angry' | 'sad' | 'support' | 'oppose';

// Event handler function type
export type EventHandler = (event: RealtimeEvent) => Promise<void>;

// Connection status
export interface ConnectionStatus {
  sseConnections: number;
  wsConnections: number;
  totalUsers: number;
  activeStreams: number;
}

// Rate limiting configuration
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests: boolean;
  skipFailedRequests: boolean;
}

// Reconnection strategy
export interface ReconnectionOptions {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  jitter: boolean;
}

// Event subscription options
export interface SubscriptionOptions {
  types?: string[];
  userId?: string;
  filters?: UserFilters;
  priority?: 'low' | 'normal' | 'high';
}

// Performance metrics
export interface PerformanceMetrics {
  avgResponseTime: number;
  peakConnections: number;
  eventsPerSecond: number;
  errorRate: number;
  memoryUsage: number;
}

// Channel validation
export const VALID_CHANNELS = [
  'posts',
  'reactions',
  'trends',
  'news',
  'ai_responses',
  'live_reactions',
  'typing_indicators',
  'user_status',
  'direct_messages'
] as const;

export type ValidChannel = typeof VALID_CHANNELS[number];

// Connection cleanup configuration
export interface CleanupConfig {
  staleConnectionTimeout: number; // ms
  heartbeatInterval: number; // ms
  cleanupInterval: number; // ms
  maxConnectionsPerUser: number;
}
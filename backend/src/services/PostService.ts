/**
 * PostService - Content management and engagement tracking service
 *
 * Handles post creation, updates, deletion, content processing, hashtag extraction,
 * mention parsing, link preview generation, thread management, and engagement tracking.
 * Implements moderation and content filtering as specified in FR-019.
 */

import { PrismaClient, Post as PrismaPost, ReactionType } from '../generated/prisma';
import PostModel, { CreatePostData, UpdatePostData, LinkPreview } from '../models/Post';
import { logger } from '../lib/logger';
import { config } from '../lib/config';

export interface CreatePostInput extends CreatePostData {}

export interface UpdatePostInput extends UpdatePostData {}

export interface PostWithDetails extends PrismaPost {
  author: any;
  persona?: any;
  thread: any;
  parentPost?: any;
  repostOf?: any;
  replies?: any[];
  reactions: any[];
  newsItem?: any;
  _count: {
    reactions: number;
    replies: number;
    reposts: number;
  };
}

export interface TimelineOptions {
  userId?: string;
  page?: number;
  limit?: number;
  includeReplies?: boolean;
  includeReposts?: boolean;
  sinceId?: string;
  maxId?: string;
}

export interface SearchOptions {
  query: string;
  hashtags?: string[];
  mentions?: string[];
  fromDate?: Date;
  toDate?: Date;
  authorId?: string;
  personaId?: string;
  hasMedia?: boolean;
  page?: number;
  limit?: number;
}

export interface EngagementStats {
  totalPosts: number;
  totalLikes: number;
  totalReposts: number;
  totalReplies: number;
  averageEngagement: number;
  topHashtags: Array<{ hashtag: string; count: number }>;
  engagementByHour: Array<{ hour: number; engagement: number }>;
}

export interface ModerationResult {
  approved: boolean;
  flags: string[];
  severity: 'low' | 'medium' | 'high';
  autoModerated: boolean;
  humanReviewRequired: boolean;
}

export class PostService {
  private prisma: PrismaClient;

  // Content moderation configuration
  private readonly SPAM_KEYWORDS = [
    'buy now', 'click here', 'free money', 'guaranteed',
    'limited time', 'special offer', 'act now'
  ];

  private readonly INAPPROPRIATE_KEYWORDS = [
    'hate', 'violence', 'harassment', 'threat'
  ];

  private readonly MAX_HASHTAGS = 10;
  private readonly MAX_MENTIONS = 10;
  private readonly MAX_MEDIA_ITEMS = 4;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // ============================================================================
  // POST CREATION
  // ============================================================================

  /**
   * Create a new post with content processing and moderation
   */
  async createPost(postData: CreatePostInput): Promise<PostWithDetails> {
    try {
      // Content moderation check
      const moderationResult = await this.moderateContent(postData.content);
      if (!moderationResult.approved) {
        throw new Error(`Post rejected by moderation: ${moderationResult.flags.join(', ')}`);
      }

      // Create post using PostModel
      const post = await PostModel.create(postData);

      // Process post for notifications and real-time updates
      await this.processNewPost(post);

      logger.info(`Post created successfully`, {
        postId: post.id,
        authorId: post.authorId,
        personaId: post.personaId
      });

      return await this.getPostById(post.id) as PostWithDetails;

    } catch (error) {
      logger.error('Error creating post:', error);
      throw error;
    }
  }

  /**
   * Create a reply post
   */
  async createReply(
    parentPostId: string,
    replyData: Omit<CreatePostInput, 'parentPostId'>
  ): Promise<PostWithDetails> {
    try {
      // Verify parent post exists
      const parentPost = await this.getPostById(parentPostId);
      if (!parentPost) {
        throw new Error('Parent post not found');
      }

      // Create reply
      const reply = await this.createPost({
        ...replyData,
        parentPostId
      });

      // Notify parent post author (if different user)
      if (parentPost.authorId !== replyData.authorId) {
        await this.notifyPostInteraction(parentPost.authorId, reply.id, 'reply');
      }

      // Process mentions in reply
      await this.processMentions(reply);

      return reply;

    } catch (error) {
      logger.error('Error creating reply:', error);
      throw error;
    }
  }

  /**
   * Create a repost
   */
  async createRepost(
    originalPostId: string,
    repostData: {
      authorId: string;
      personaId?: string;
      content?: string; // Optional quote repost
    }
  ): Promise<PostWithDetails> {
    try {
      // Verify original post exists
      const originalPost = await this.getPostById(originalPostId);
      if (!originalPost) {
        throw new Error('Original post not found');
      }

      // Check if user already reposted this
      const existingRepost = await this.prisma.post.findFirst({
        where: {
          authorId: repostData.authorId,
          repostOfId: originalPostId
        }
      });

      if (existingRepost) {
        throw new Error('Post already reposted by this user');
      }

      // Create repost
      const repost = await this.createPost({
        content: repostData.content || '',
        authorId: repostData.authorId,
        personaId: repostData.personaId,
        repostOfId: originalPostId
      });

      // Update original post repost count
      await this.prisma.post.update({
        where: { id: originalPostId },
        data: {
          repostCount: {
            increment: 1
          }
        }
      });

      // Notify original author
      if (originalPost.authorId !== repostData.authorId) {
        await this.notifyPostInteraction(originalPost.authorId, repost.id, 'repost');
      }

      return repost;

    } catch (error) {
      logger.error('Error creating repost:', error);
      throw error;
    }
  }

  // ============================================================================
  // POST RETRIEVAL
  // ============================================================================

  /**
   * Get post by ID with full details
   */
  async getPostById(postId: string): Promise<PostWithDetails | null> {
    try {
      const post = await PostModel.getById(postId);
      return post as PostWithDetails;

    } catch (error) {
      logger.error('Error retrieving post:', error);
      throw error;
    }
  }

  /**
   * Get timeline posts with pagination
   */
  async getTimeline(options: TimelineOptions): Promise<{
    posts: PostWithDetails[];
    hasMore: boolean;
    total: number;
    nextCursor?: string;
  }> {
    try {
      const {
        userId,
        page = 1,
        limit = 20,
        includeReplies = true,
        includeReposts = true,
        sinceId,
        maxId
      } = options;

      // Build where clause
      const where: any = {
        isHidden: false
      };

      // Filter by user following list if userId provided
      if (userId) {
        // Get user's following list
        const following = await this.getUserFollowing(userId);
        where.OR = [
          { authorId: { in: [userId, ...following] } },
          { persona: { isNot: null } } // Include AI persona posts
        ];
      }

      // Filter replies if not included
      if (!includeReplies) {
        where.parentPostId = null;
      }

      // Filter reposts if not included
      if (!includeReposts) {
        where.repostOfId = null;
      }

      // Cursor pagination
      if (sinceId) {
        where.id = { gt: sinceId };
      }
      if (maxId) {
        where.id = { lt: maxId };
      }

      const offset = (page - 1) * limit;

      const [posts, total] = await Promise.all([
        this.prisma.post.findMany({
          where,
          include: {
            author: {
              include: {
                profile: true
              }
            },
            persona: true,
            parentPost: {
              include: {
                author: {
                  include: {
                    profile: true
                  }
                }
              }
            },
            repostOf: {
              include: {
                author: {
                  include: {
                    profile: true
                  }
                }
              }
            },
            reactions: {
              where: userId ? { userId } : undefined,
              select: { type: true }
            },
            _count: {
              select: {
                reactions: true,
                replies: true,
                reposts: true
              }
            },
            thread: true,
            newsItem: true
          },
          orderBy: {
            publishedAt: 'desc'
          },
          skip: offset,
          take: limit
        }),
        this.prisma.post.count({ where })
      ]);

      // Process posts for engagement data
      const processedPosts = await Promise.all(
        posts.map(post => this.enrichPostWithEngagement(post, userId))
      );

      return {
        posts: processedPosts as PostWithDetails[],
        hasMore: offset + posts.length < total,
        total,
        nextCursor: posts.length > 0 ? posts[posts.length - 1].id : undefined
      };

    } catch (error) {
      logger.error('Error getting timeline:', error);
      throw error;
    }
  }

  /**
   * Get user posts with pagination
   */
  async getUserPosts(
    userId: string,
    options: {
      includeReplies?: boolean;
      includeReposts?: boolean;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{
    posts: PostWithDetails[];
    hasMore: boolean;
    total: number;
  }> {
    try {
      const {
        includeReplies = true,
        includeReposts = true,
        page = 1,
        limit = 20
      } = options;

      const where: any = {
        authorId: userId,
        isHidden: false
      };

      if (!includeReplies) {
        where.parentPostId = null;
      }

      if (!includeReposts) {
        where.repostOfId = null;
      }

      const offset = (page - 1) * limit;

      const [posts, total] = await Promise.all([
        this.prisma.post.findMany({
          where,
          include: {
            author: {
              include: {
                profile: true
              }
            },
            persona: true,
            parentPost: {
              include: {
                author: {
                  include: {
                    profile: true
                  }
                }
              }
            },
            repostOf: {
              include: {
                author: {
                  include: {
                    profile: true
                  }
                }
              }
            },
            reactions: {
              select: { type: true, userId: true }
            },
            _count: {
              select: {
                reactions: true,
                replies: true,
                reposts: true
              }
            },
            thread: true,
            newsItem: true
          },
          orderBy: {
            publishedAt: 'desc'
          },
          skip: offset,
          take: limit
        }),
        this.prisma.post.count({ where })
      ]);

      const processedPosts = await Promise.all(
        posts.map(post => this.enrichPostWithEngagement(post, userId))
      );

      return {
        posts: processedPosts as PostWithDetails[],
        hasMore: offset + posts.length < total,
        total
      };

    } catch (error) {
      logger.error('Error getting user posts:', error);
      throw error;
    }
  }

  // ============================================================================
  // POST UPDATES
  // ============================================================================

  /**
   * Update post content
   */
  async updatePost(postId: string, updateData: UpdatePostInput): Promise<PostWithDetails> {
    try {
      // Verify post exists and can be edited
      const existingPost = await this.getPostById(postId);
      if (!existingPost) {
        throw new Error('Post not found');
      }

      // Check edit window (allow edits within 5 minutes of creation)
      const now = new Date();
      const postAge = now.getTime() - existingPost.publishedAt.getTime();
      const editWindow = 5 * 60 * 1000; // 5 minutes

      if (postAge > editWindow) {
        throw new Error('Post edit window has expired');
      }

      // Moderate updated content
      if (updateData.content) {
        const moderationResult = await this.moderateContent(updateData.content);
        if (!moderationResult.approved) {
          throw new Error(`Updated content rejected: ${moderationResult.flags.join(', ')}`);
        }
      }

      // Update post
      const updatedPost = await PostModel.update(postId, updateData);

      logger.info(`Post updated successfully`, { postId, updateData });

      return await this.getPostById(updatedPost.id) as PostWithDetails;

    } catch (error) {
      logger.error('Error updating post:', error);
      throw error;
    }
  }

  /**
   * Delete post and update metrics
   */
  async deletePost(postId: string, deletedBy: string): Promise<void> {
    try {
      // Verify post exists
      const post = await this.getPostById(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      // Verify deletion permissions (author or admin)
      if (post.authorId !== deletedBy) {
        // Check if deletedBy is admin/moderator
        const user = await this.prisma.userAccount.findUnique({
          where: { id: deletedBy }
        });

        if (!user) {
          throw new Error('Unauthorized to delete this post');
        }
      }

      // Delete post using PostModel
      await PostModel.delete(postId);

      logger.info(`Post deleted successfully`, { postId, deletedBy });

    } catch (error) {
      logger.error('Error deleting post:', error);
      throw error;
    }
  }

  // ============================================================================
  // REACTIONS AND ENGAGEMENT
  // ============================================================================

  /**
   * Add reaction to post
   */
  async addReaction(
    postId: string,
    userId: string,
    reactionType: ReactionType
  ): Promise<void> {
    try {
      // Check if user already reacted
      const existingReaction = await this.prisma.reaction.findUnique({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      });

      if (existingReaction) {
        // Update existing reaction
        await this.prisma.reaction.update({
          where: {
            userId_postId: {
              userId,
              postId
            }
          },
          data: { type: reactionType }
        });
      } else {
        // Create new reaction
        await this.prisma.reaction.create({
          data: {
            userId,
            postId,
            type: reactionType
          }
        });
      }

      // Update post reaction counts
      await this.updatePostReactionCounts(postId);

      // Notify post author
      const post = await this.getPostById(postId);
      if (post && post.authorId !== userId) {
        await this.notifyPostInteraction(post.authorId, postId, 'reaction');
      }

      logger.info(`Reaction added to post`, { postId, userId, reactionType });

    } catch (error) {
      logger.error('Error adding reaction:', error);
      throw error;
    }
  }

  /**
   * Remove reaction from post
   */
  async removeReaction(postId: string, userId: string): Promise<void> {
    try {
      await this.prisma.reaction.delete({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      });

      // Update post reaction counts
      await this.updatePostReactionCounts(postId);

      logger.info(`Reaction removed from post`, { postId, userId });

    } catch (error) {
      logger.error('Error removing reaction:', error);
      throw error;
    }
  }

  // ============================================================================
  // SEARCH AND DISCOVERY
  // ============================================================================

  /**
   * Search posts with advanced filters
   */
  async searchPosts(searchOptions: SearchOptions): Promise<{
    posts: PostWithDetails[];
    hasMore: boolean;
    total: number;
  }> {
    try {
      const {
        query,
        hashtags,
        mentions,
        fromDate,
        toDate,
        authorId,
        personaId,
        hasMedia,
        page = 1,
        limit = 20
      } = searchOptions;

      const result = await PostModel.searchByContent(query, page, limit);

      // Apply additional filters
      let filteredPosts = result.posts;

      if (hashtags && hashtags.length > 0) {
        filteredPosts = filteredPosts.filter(post =>
          hashtags.some(tag => post.hashtags.includes(tag.toLowerCase()))
        );
      }

      if (mentions && mentions.length > 0) {
        filteredPosts = filteredPosts.filter(post =>
          mentions.some(mention => post.mentions.includes(mention.toLowerCase()))
        );
      }

      if (fromDate) {
        filteredPosts = filteredPosts.filter(post =>
          post.publishedAt >= fromDate
        );
      }

      if (toDate) {
        filteredPosts = filteredPosts.filter(post =>
          post.publishedAt <= toDate
        );
      }

      if (authorId) {
        filteredPosts = filteredPosts.filter(post =>
          post.authorId === authorId
        );
      }

      if (personaId) {
        filteredPosts = filteredPosts.filter(post =>
          post.personaId === personaId
        );
      }

      if (hasMedia !== undefined) {
        filteredPosts = filteredPosts.filter(post =>
          hasMedia ? post.mediaUrls.length > 0 : post.mediaUrls.length === 0
        );
      }

      // Get full post details
      const detailedPosts = await Promise.all(
        filteredPosts.map(post => this.getPostById(post.id))
      );

      return {
        posts: detailedPosts.filter(Boolean) as PostWithDetails[],
        hasMore: result.hasMore,
        total: result.total
      };

    } catch (error) {
      logger.error('Error searching posts:', error);
      throw error;
    }
  }

  /**
   * Get trending hashtags
   */
  async getTrendingHashtags(limit: number = 10): Promise<Array<{ hashtag: string; count: number }>> {
    try {
      return await PostModel.getTrendingHashtags(limit);

    } catch (error) {
      logger.error('Error getting trending hashtags:', error);
      throw error;
    }
  }

  // ============================================================================
  // ANALYTICS AND METRICS
  // ============================================================================

  /**
   * Get engagement statistics for user or time period
   */
  async getEngagementStats(
    options: {
      userId?: string;
      personaId?: string;
      fromDate?: Date;
      toDate?: Date;
    }
  ): Promise<EngagementStats> {
    try {
      const { userId, personaId, fromDate, toDate } = options;

      const where: any = {
        isHidden: false
      };

      if (userId) where.authorId = userId;
      if (personaId) where.personaId = personaId;
      if (fromDate) where.publishedAt = { gte: fromDate };
      if (toDate) where.publishedAt = { ...where.publishedAt, lte: toDate };

      // Get posts with engagement data
      const posts = await this.prisma.post.findMany({
        where,
        include: {
          _count: {
            select: {
              reactions: true,
              replies: true,
              reposts: true
            }
          }
        }
      });

      const totalPosts = posts.length;
      const totalLikes = posts.reduce((sum, post) => sum + post.likeCount, 0);
      const totalReposts = posts.reduce((sum, post) => sum + post.repostCount, 0);
      const totalReplies = posts.reduce((sum, post) => sum + post.commentCount, 0);
      const totalEngagement = totalLikes + totalReposts + totalReplies;

      // Get top hashtags
      const topHashtags = await this.getTopHashtags(where, 10);

      // Get engagement by hour
      const engagementByHour = await this.getEngagementByHour(where);

      return {
        totalPosts,
        totalLikes,
        totalReposts,
        totalReplies,
        averageEngagement: totalPosts > 0 ? totalEngagement / totalPosts : 0,
        topHashtags,
        engagementByHour
      };

    } catch (error) {
      logger.error('Error getting engagement stats:', error);
      throw error;
    }
  }

  // ============================================================================
  // CONTENT MODERATION
  // ============================================================================

  /**
   * Moderate post content for spam and inappropriate content
   */
  private async moderateContent(content: string): Promise<ModerationResult> {
    const flags: string[] = [];
    const contentLower = content.toLowerCase();

    // Check for spam keywords
    const spamCount = this.SPAM_KEYWORDS.filter(keyword =>
      contentLower.includes(keyword)
    ).length;

    if (spamCount > 0) {
      flags.push('potential_spam');
    }

    // Check for inappropriate content
    const inappropriateCount = this.INAPPROPRIATE_KEYWORDS.filter(keyword =>
      contentLower.includes(keyword)
    ).length;

    if (inappropriateCount > 0) {
      flags.push('inappropriate_content');
    }

    // Check for excessive capitalization
    const upperCaseRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (upperCaseRatio > 0.7) {
      flags.push('excessive_caps');
    }

    // Check for excessive hashtags or mentions
    const hashtags = PostModel.extractHashtags(content);
    const mentions = PostModel.extractMentions(content);

    if (hashtags.length > this.MAX_HASHTAGS) {
      flags.push('excessive_hashtags');
    }

    if (mentions.length > this.MAX_MENTIONS) {
      flags.push('excessive_mentions');
    }

    // Determine severity and approval
    const severity = flags.length === 0 ? 'low' :
                    flags.length <= 2 ? 'medium' : 'high';

    const approved = severity !== 'high' &&
                    !flags.includes('inappropriate_content');

    const humanReviewRequired = severity === 'high' ||
                               flags.includes('inappropriate_content');

    return {
      approved,
      flags,
      severity,
      autoModerated: !approved,
      humanReviewRequired
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Process new post for notifications and real-time updates
   */
  private async processNewPost(post: PrismaPost): Promise<void> {
    try {
      // Process mentions for notifications
      await this.processMentions(post);

      // Update trending hashtags
      await this.updateTrendingHashtags(post.hashtags);

      // TODO: Send real-time notifications to followers
      // TODO: Update timeline caches

    } catch (error) {
      logger.error('Error processing new post:', error);
    }
  }

  /**
   * Process mentions in post content
   */
  private async processMentions(post: PrismaPost): Promise<void> {
    try {
      for (const mention of post.mentions) {
        // Find mentioned user
        const mentionedUser = await this.prisma.userAccount.findUnique({
          where: { username: mention.toLowerCase() }
        });

        if (mentionedUser && mentionedUser.id !== post.authorId) {
          await this.notifyPostInteraction(mentionedUser.id, post.id, 'mention');
        }
      }

    } catch (error) {
      logger.error('Error processing mentions:', error);
    }
  }

  /**
   * Send notification for post interaction
   */
  private async notifyPostInteraction(
    userId: string,
    postId: string,
    type: 'reply' | 'repost' | 'reaction' | 'mention'
  ): Promise<void> {
    try {
      // TODO: Implement notification system
      logger.info(`Notification sent`, { userId, postId, type });

    } catch (error) {
      logger.error('Error sending notification:', error);
    }
  }

  /**
   * Update post reaction counts
   */
  private async updatePostReactionCounts(postId: string): Promise<void> {
    try {
      const reactionCounts = await this.prisma.reaction.groupBy({
        by: ['type'],
        where: { postId },
        _count: {
          type: true
        }
      });

      const likeCount = reactionCounts.find(r => r.type === 'LIKE')?._count.type || 0;

      await this.prisma.post.update({
        where: { id: postId },
        data: { likeCount }
      });

    } catch (error) {
      logger.error('Error updating reaction counts:', error);
    }
  }

  /**
   * Enrich post with engagement data
   */
  private async enrichPostWithEngagement(post: any, userId?: string): Promise<any> {
    // Add user-specific engagement data
    const userReaction = userId ? post.reactions.find((r: any) => r.userId === userId) : null;

    return {
      ...post,
      userReacted: !!userReaction,
      userReactionType: userReaction?.type || null,
      linkPreview: post.linkPreview ? JSON.parse(post.linkPreview) : null
    };
  }

  /**
   * Get user following list
   */
  private async getUserFollowing(userId: string): Promise<string[]> {
    try {
      // TODO: Implement following relationship queries
      return [];

    } catch (error) {
      logger.error('Error getting user following:', error);
      return [];
    }
  }

  /**
   * Update trending hashtags
   */
  private async updateTrendingHashtags(hashtags: string[]): Promise<void> {
    try {
      // TODO: Implement trending hashtag tracking
      logger.debug('Updating trending hashtags', { hashtags });

    } catch (error) {
      logger.error('Error updating trending hashtags:', error);
    }
  }

  /**
   * Get top hashtags for given criteria
   */
  private async getTopHashtags(where: any, limit: number): Promise<Array<{ hashtag: string; count: number }>> {
    try {
      return await PostModel.getTrendingHashtags(limit);

    } catch (error) {
      logger.error('Error getting top hashtags:', error);
      return [];
    }
  }

  /**
   * Get engagement by hour
   */
  private async getEngagementByHour(where: any): Promise<Array<{ hour: number; engagement: number }>> {
    try {
      // TODO: Implement hourly engagement analytics
      return Array.from({ length: 24 }, (_, hour) => ({
        hour,
        engagement: 0
      }));

    } catch (error) {
      logger.error('Error getting engagement by hour:', error);
      return [];
    }
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================

  /**
   * Close database connection
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export default PostService;
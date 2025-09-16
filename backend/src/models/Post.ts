// Post model with content processing and validation
// Implements data-model.md:184-236 specifications

import { z } from 'zod';
import { PrismaClient, Post as PrismaPost, Prisma } from '../generated/prisma';

const prisma = new PrismaClient();

// LinkPreview interface as specified in data-model.md:230-236
export interface LinkPreview {
  url: string;
  title: string;
  description: string;
  imageUrl: string | null;
  siteName: string;
}

// Validation schemas
export const CreatePostSchema = z.object({
  content: z.string().min(1).max(280, 'Content must be 1-280 characters'),
  authorId: z.string().uuid('Invalid author ID'),
  personaId: z.string().uuid('Invalid persona ID').optional(),
  mediaUrls: z.array(z.string().url()).max(4, 'Maximum 4 media items allowed').optional(),
  parentPostId: z.string().uuid().optional(),
  repostOfId: z.string().uuid().optional(),
  newsItemId: z.string().uuid().optional(),
  newsContext: z.string().max(500).optional(),
  contentWarning: z.string().max(100).optional(),
});

export const UpdatePostSchema = z.object({
  content: z.string().min(1).max(280).optional(),
  contentWarning: z.string().max(100).optional(),
  isHidden: z.boolean().optional(),
});

export type CreatePostData = z.infer<typeof CreatePostSchema>;
export type UpdatePostData = z.infer<typeof UpdatePostSchema>;

export class PostModel {
  /**
   * Create a new post with content processing
   */
  static async create(data: CreatePostData): Promise<PrismaPost> {
    // Validate input data
    const validatedData = CreatePostSchema.parse(data);

    // Extract hashtags and mentions from content
    const hashtags = this.extractHashtags(validatedData.content);
    const mentions = this.extractMentions(validatedData.content);

    // Validate hashtag and mention limits (data-model.md:239-244)
    if (hashtags.length > 10) {
      throw new Error('Maximum 10 hashtags allowed per post');
    }
    if (mentions.length > 10) {
      throw new Error('Maximum 10 mentions allowed per post');
    }

    // Determine thread ID
    let threadId: string;
    let newThreadId: string | null = null;

    if (!validatedData.parentPostId) {
      // For new threads, we'll create the thread first with a temporary originalPostId
      const tempThread = await prisma.thread.create({
        data: {
          originalPostId: 'temp', // Will be updated after post creation
          title: validatedData.content.substring(0, 100) || null,
          participantCount: 1,
          postCount: 1,
          maxDepth: 0,
        },
      });
      threadId = tempThread.id;
      newThreadId = tempThread.id;
    } else {
      // Get parent post's thread
      const parentPost = await prisma.post.findUnique({
        where: { id: validatedData.parentPostId },
        select: { threadId: true },
      });

      if (!parentPost) {
        throw new Error('Parent post not found');
      }

      threadId = parentPost.threadId;
    }

    // Generate link preview if URL detected
    const linkPreview = await this.generateLinkPreview(validatedData.content);

    // Create post
    const post = await prisma.post.create({
      data: {
        content: validatedData.content,
        authorId: validatedData.authorId,
        personaId: validatedData.personaId,
        mediaUrls: validatedData.mediaUrls || [],
        linkPreview: linkPreview ? JSON.stringify(linkPreview) : null,
        threadId,
        parentPostId: validatedData.parentPostId,
        repostOfId: validatedData.repostOfId,
        isAIGenerated: !!validatedData.personaId,
        hashtags,
        mentions,
        newsItemId: validatedData.newsItemId,
        newsContext: validatedData.newsContext,
        contentWarning: validatedData.contentWarning,
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        persona: true,
        thread: true,
        parentPost: true,
        repostOf: true,
        newsItem: true,
      },
    });

    // Update thread originalPostId if this is the first post
    if (newThreadId) {
      await prisma.thread.update({
        where: { id: newThreadId },
        data: { originalPostId: post.id },
      });
    }

    // Update thread metrics for replies
    if (validatedData.parentPostId) {
      await this.updateThreadMetrics(threadId);
    }

    // Update user profile post count
    await prisma.userProfile.update({
      where: { userId: validatedData.authorId },
      data: {
        postCount: {
          increment: 1,
        },
      },
    });

    return post;
  }

  /**
   * Extract hashtags from post content
   */
  static extractHashtags(content: string): string[] {
    const hashtagRegex = /#[\w\u0590-\u05ff]+/gi;
    const matches = content.match(hashtagRegex) || [];
    return Array.from(new Set(matches.map(tag => tag.slice(1).toLowerCase()))); // Remove # and deduplicate
  }

  /**
   * Extract mentions from post content
   */
  static extractMentions(content: string): string[] {
    const mentionRegex = /@([a-zA-Z0-9_]{1,15})/g;
    const matches = content.match(mentionRegex) || [];
    return Array.from(new Set(matches.map(mention => mention.slice(1).toLowerCase()))); // Remove @ and deduplicate
  }

  /**
   * Generate link preview for URLs in content
   */
  static async generateLinkPreview(content: string): Promise<LinkPreview | null> {
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const urlMatch = content.match(urlRegex);

    if (!urlMatch || urlMatch.length === 0) {
      return null;
    }

    const url = urlMatch[0];

    try {
      // In a real implementation, this would fetch metadata from the URL
      // For now, we'll return a placeholder structure
      return {
        url,
        title: 'Link Preview',
        description: 'Generated link preview',
        imageUrl: null,
        siteName: new URL(url).hostname,
      };
    } catch (error) {
      // Invalid URL, return null
      return null;
    }
  }

  /**
   * Update thread metrics after adding a reply
   */
  static async updateThreadMetrics(threadId: string): Promise<void> {
    const threadData = await prisma.post.groupBy({
      by: ['threadId'],
      where: { threadId },
      _count: {
        id: true,
      },
    });

    const postCount = threadData[0]?._count.id || 0;

    // Count unique participants
    const participants = await prisma.post.findMany({
      where: { threadId },
      select: { authorId: true },
      distinct: ['authorId'],
    });

    // Calculate max depth (simplified - count levels)
    const posts = await prisma.post.findMany({
      where: { threadId },
      select: { id: true, parentPostId: true },
    });

    let maxDepth = 0;
    for (const post of posts) {
      if (post.parentPostId) {
        const depth = await this.calculatePostDepth(post.id, posts);
        maxDepth = Math.max(maxDepth, depth);
      }
    }

    await prisma.thread.update({
      where: { id: threadId },
      data: {
        postCount,
        participantCount: participants.length,
        maxDepth,
        lastActivityAt: new Date(),
      },
    });
  }

  /**
   * Calculate the depth of a post in the thread
   */
  private static calculatePostDepth(
    postId: string,
    posts: Array<{ id: string; parentPostId: string | null }>
  ): number {
    let depth = 0;
    let currentPostId: string | null = postId;

    while (currentPostId) {
      const post = posts.find(p => p.id === currentPostId);
      if (!post?.parentPostId) break;
      depth++;
      currentPostId = post.parentPostId;
    }

    return depth;
  }

  /**
   * Get posts for timeline with pagination
   */
  static async getTimeline(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ posts: PrismaPost[]; hasMore: boolean; total: number }> {
    const offset = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          isHidden: false,
          // Add following logic here when user relationships are implemented
        },
        include: {
          author: {
            include: {
              profile: true,
            },
          },
          persona: true,
          parentPost: {
            include: {
              author: {
                include: {
                  profile: true,
                },
              },
            },
          },
          repostOf: {
            include: {
              author: {
                include: {
                  profile: true,
                },
              },
            },
          },
          reactions: {
            where: { userId },
            select: { type: true },
          },
          _count: {
            select: {
              reactions: true,
              replies: true,
              reposts: true,
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        skip: offset,
        take: limit,
      }),
      prisma.post.count({
        where: {
          isHidden: false,
        },
      }),
    ]);

    return {
      posts,
      hasMore: offset + posts.length < total,
      total,
    };
  }

  /**
   * Get post by ID with full details
   */
  static async getById(id: string): Promise<PrismaPost | null> {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        persona: true,
        thread: true,
        parentPost: {
          include: {
            author: {
              include: {
                profile: true,
              },
            },
          },
        },
        repostOf: {
          include: {
            author: {
              include: {
                profile: true,
              },
            },
          },
        },
        replies: {
          include: {
            author: {
              include: {
                profile: true,
              },
            },
            persona: true,
            _count: {
              select: {
                reactions: true,
                replies: true,
                reposts: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        reactions: true,
        newsItem: true,
      },
    });
  }

  /**
   * Update post content (limited editing)
   */
  static async update(id: string, data: UpdatePostData): Promise<PrismaPost> {
    const validatedData = UpdatePostSchema.parse(data);

    // If content is being updated, re-extract hashtags and mentions
    let updateData: any = { ...validatedData };

    if (validatedData.content) {
      updateData.hashtags = this.extractHashtags(validatedData.content);
      updateData.mentions = this.extractMentions(validatedData.content);
      updateData.editedAt = new Date();

      // Validate hashtag and mention limits
      if (updateData.hashtags.length > 10) {
        throw new Error('Maximum 10 hashtags allowed per post');
      }
      if (updateData.mentions.length > 10) {
        throw new Error('Maximum 10 mentions allowed per post');
      }
    }

    return prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        persona: true,
        thread: true,
      },
    });
  }

  /**
   * Delete a post and update metrics
   */
  static async delete(id: string): Promise<void> {
    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true, threadId: true },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Delete the post (cascade will handle reactions)
    await prisma.post.delete({
      where: { id },
    });

    // Update user profile post count
    await prisma.userProfile.update({
      where: { userId: post.authorId },
      data: {
        postCount: {
          decrement: 1,
        },
      },
    });

    // Update thread metrics
    await this.updateThreadMetrics(post.threadId);
  }

  /**
   * Search posts by content using full-text search
   */
  static async searchByContent(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ posts: PrismaPost[]; hasMore: boolean; total: number }> {
    const offset = (page - 1) * limit;

    // Use PostgreSQL full-text search
    const posts = await prisma.$queryRaw<PrismaPost[]>`
      SELECT p.*,
             ts_rank(to_tsvector('english', p.content), plainto_tsquery('english', ${query})) as rank
      FROM posts p
      WHERE to_tsvector('english', p.content) @@ plainto_tsquery('english', ${query})
        AND p.is_hidden = false
      ORDER BY rank DESC, p.published_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const totalResult = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count
      FROM posts p
      WHERE to_tsvector('english', p.content) @@ plainto_tsquery('english', ${query})
        AND p.is_hidden = false
    `;

    const total = Number(totalResult[0].count);

    return {
      posts,
      hasMore: offset + posts.length < total,
      total,
    };
  }

  /**
   * Get trending hashtags
   */
  static async getTrendingHashtags(limit: number = 10): Promise<Array<{ hashtag: string; count: number }>> {
    const result = await prisma.$queryRaw<Array<{ hashtag: string; count: bigint }>>`
      SELECT unnest(hashtags) as hashtag, COUNT(*) as count
      FROM posts
      WHERE published_at >= NOW() - INTERVAL '24 hours'
        AND is_hidden = false
        AND array_length(hashtags, 1) > 0
      GROUP BY hashtag
      ORDER BY count DESC
      LIMIT ${limit}
    `;

    return result.map(item => ({
      hashtag: item.hashtag,
      count: Number(item.count),
    }));
  }
}

export default PostModel;
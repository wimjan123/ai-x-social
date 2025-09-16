// Thread model for conversation management and threading
// Implements data-model.md:314-341 specifications

import { z } from 'zod';
import { PrismaClient, Thread as PrismaThread, Post, Prisma } from '../generated/prisma';

const prisma = new PrismaClient();

// Validation schemas
export const CreateThreadSchema = z.object({
  originalPostId: z.string().uuid('Invalid original post ID'),
  title: z.string().max(100, 'Title must be maximum 100 characters').optional(),
});

export const UpdateThreadSchema = z.object({
  title: z.string().max(100).optional(),
  isLocked: z.boolean().optional(),
  isHidden: z.boolean().optional(),
});

export type CreateThreadData = z.infer<typeof CreateThreadSchema>;
export type UpdateThreadData = z.infer<typeof UpdateThreadSchema>;

export interface ThreadWithPosts extends PrismaThread {
  posts: Post[];
}

export interface ThreadStats {
  participantCount: number;
  postCount: number;
  maxDepth: number;
  totalEngagement: number;
  avgEngagementPerPost: number;
  activityHours: number;
}

export class ThreadModel {
  /**
   * Create a new thread
   */
  static async create(data: CreateThreadData): Promise<PrismaThread> {
    const validatedData = CreateThreadSchema.parse(data);

    // Verify the original post exists
    const originalPost = await prisma.post.findUnique({
      where: { id: validatedData.originalPostId },
    });

    if (!originalPost) {
      throw new Error('Original post not found');
    }

    // Check if thread already exists for this post
    const existingThread = await prisma.thread.findUnique({
      where: { originalPostId: validatedData.originalPostId },
    });

    if (existingThread) {
      throw new Error('Thread already exists for this post');
    }

    const thread = await prisma.thread.create({
      data: {
        originalPostId: validatedData.originalPostId,
        title: validatedData.title,
        participantCount: 1,
        postCount: 1,
        maxDepth: 0,
        totalLikes: originalPost.likeCount,
        totalReshares: originalPost.repostCount,
        lastActivityAt: originalPost.publishedAt,
      },
    });

    return thread;
  }

  /**
   * Get thread by ID with all posts in conversation order
   */
  static async getById(id: string, includeHidden: boolean = false): Promise<ThreadWithPosts | null> {
    const thread = await prisma.thread.findUnique({
      where: { id },
      include: {
        posts: {
          where: includeHidden ? {} : { isHidden: false },
          include: {
            author: {
              include: {
                profile: true,
              },
            },
            persona: true,
            parentPost: {
              select: {
                id: true,
                content: true,
                authorId: true,
                author: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
            reactions: true,
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
      },
    });

    if (!thread) {
      return null;
    }

    // Sort posts to show conversation flow
    const sortedPosts = this.sortPostsForConversation(thread.posts);

    return {
      ...thread,
      posts: sortedPosts,
    };
  }

  /**
   * Get thread by original post ID
   */
  static async getByOriginalPostId(originalPostId: string): Promise<ThreadWithPosts | null> {
    const thread = await prisma.thread.findUnique({
      where: { originalPostId },
      include: {
        posts: {
          where: { isHidden: false },
          include: {
            author: {
              include: {
                profile: true,
              },
            },
            persona: true,
            parentPost: {
              select: {
                id: true,
                content: true,
                author: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
            reactions: true,
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
      },
    });

    if (!thread) {
      return null;
    }

    return {
      ...thread,
      posts: this.sortPostsForConversation(thread.posts),
    };
  }

  /**
   * Update thread metadata
   */
  static async update(id: string, data: UpdateThreadData): Promise<PrismaThread> {
    const validatedData = UpdateThreadSchema.parse(data);

    return prisma.thread.update({
      where: { id },
      data: validatedData,
    });
  }

  /**
   * Recalculate and update thread metrics
   */
  static async updateMetrics(threadId: string): Promise<ThreadStats> {
    const posts = await prisma.post.findMany({
      where: { threadId },
      select: {
        id: true,
        authorId: true,
        parentPostId: true,
        likeCount: true,
        repostCount: true,
        commentCount: true,
        createdAt: true,
        publishedAt: true,
      },
    });

    // Calculate metrics
    const postCount = posts.length;
    const uniqueAuthors = new Set(posts.map(p => p.authorId));
    const participantCount = uniqueAuthors.size;

    // Calculate max depth
    const maxDepth = this.calculateMaxDepth(posts);

    // Calculate total engagement
    const totalLikes = posts.reduce((sum, post) => sum + post.likeCount, 0);
    const totalReposts = posts.reduce((sum, post) => sum + post.repostCount, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.commentCount, 0);
    const totalEngagement = totalLikes + totalReposts + totalComments;

    // Calculate activity duration
    const timestamps = posts.map(p => p.publishedAt);
    const earliestTime = new Date(Math.min(...timestamps.map(t => t.getTime())));
    const latestTime = new Date(Math.max(...timestamps.map(t => t.getTime())));
    const activityHours = Math.max(1, Math.round((latestTime.getTime() - earliestTime.getTime()) / (1000 * 60 * 60)));

    // Update thread in database
    await prisma.thread.update({
      where: { id: threadId },
      data: {
        participantCount,
        postCount,
        maxDepth,
        totalLikes,
        totalReshares: totalReposts,
        lastActivityAt: latestTime,
      },
    });

    return {
      participantCount,
      postCount,
      maxDepth,
      totalEngagement,
      avgEngagementPerPost: postCount > 0 ? totalEngagement / postCount : 0,
      activityHours,
    };
  }

  /**
   * Calculate maximum depth in thread
   */
  private static calculateMaxDepth(posts: Array<{ id: string; parentPostId: string | null }>): number {
    const postMap = new Map(posts.map(p => [p.id, p]));
    let maxDepth = 0;

    for (const post of posts) {
      if (post.parentPostId) {
        const depth = this.getPostDepth(post.id, postMap);
        maxDepth = Math.max(maxDepth, depth);
      }
    }

    return maxDepth;
  }

  /**
   * Get depth of a specific post in the thread
   */
  private static getPostDepth(
    postId: string,
    postMap: Map<string, { id: string; parentPostId: string | null }>
  ): number {
    let depth = 0;
    let currentPostId: string | null = postId;

    while (currentPostId) {
      const post = postMap.get(currentPostId);
      if (!post?.parentPostId) break;
      depth++;
      currentPostId = post.parentPostId;
    }

    return depth;
  }

  /**
   * Sort posts for conversation flow display
   */
  private static sortPostsForConversation(posts: any[]): any[] {
    // Create a map for quick lookups
    const postMap = new Map(posts.map(p => [p.id, p]));
    const result: any[] = [];
    const processed = new Set<string>();

    // Find the root post (no parent)
    const rootPost = posts.find(p => !p.parentPostId);
    if (!rootPost) return posts; // Fallback to original order

    // Recursive function to add posts in conversation order
    const addPostAndReplies = (post: any, depth: number = 0) => {
      if (processed.has(post.id)) return;

      post.depth = depth;
      result.push(post);
      processed.add(post.id);

      // Find direct replies and sort by creation time
      const replies = posts
        .filter(p => p.parentPostId === post.id)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      // Add replies recursively
      for (const reply of replies) {
        addPostAndReplies(reply, depth + 1);
      }
    };

    addPostAndReplies(rootPost);

    return result;
  }

  /**
   * Get active threads (recent activity)
   */
  static async getActiveThreads(
    limit: number = 20,
    hoursBack: number = 24
  ): Promise<ThreadWithPosts[]> {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hoursBack);

    const threads = await prisma.thread.findMany({
      where: {
        lastActivityAt: {
          gte: cutoffTime,
        },
        isHidden: false,
      },
      include: {
        posts: {
          where: { isHidden: false },
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
          take: 5, // Limit posts per thread for performance
        },
      },
      orderBy: {
        lastActivityAt: 'desc',
      },
      take: limit,
    });

    return threads.map(thread => ({
      ...thread,
      posts: this.sortPostsForConversation(thread.posts),
    }));
  }

  /**
   * Get trending threads (high engagement)
   */
  static async getTrendingThreads(
    limit: number = 10,
    hoursBack: number = 24
  ): Promise<ThreadWithPosts[]> {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hoursBack);

    const threads = await prisma.thread.findMany({
      where: {
        lastActivityAt: {
          gte: cutoffTime,
        },
        isHidden: false,
        isLocked: false,
      },
      include: {
        posts: {
          where: { isHidden: false },
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
          take: 10,
        },
      },
      orderBy: [
        { totalLikes: 'desc' },
        { totalReshares: 'desc' },
        { postCount: 'desc' },
        { lastActivityAt: 'desc' },
      ],
      take: limit,
    });

    return threads.map(thread => ({
      ...thread,
      posts: this.sortPostsForConversation(thread.posts),
    }));
  }

  /**
   * Lock thread (prevent new replies)
   */
  static async lockThread(threadId: string, reason?: string): Promise<PrismaThread> {
    return prisma.thread.update({
      where: { id: threadId },
      data: {
        isLocked: true,
        // In a real implementation, you might want to store the lock reason
      },
    });
  }

  /**
   * Hide thread (moderation)
   */
  static async hideThread(threadId: string): Promise<PrismaThread> {
    return prisma.thread.update({
      where: { id: threadId },
      data: {
        isHidden: true,
      },
    });
  }

  /**
   * Get thread participants with their contribution stats
   */
  static async getThreadParticipants(threadId: string): Promise<Array<{
    userId: string;
    username: string;
    displayName: string;
    postCount: number;
    totalLikes: number;
    totalReplies: number;
    firstPostAt: Date;
    lastPostAt: Date;
  }>> {
    const participants = await prisma.post.groupBy({
      by: ['authorId'],
      where: {
        threadId,
        isHidden: false,
      },
      _count: {
        id: true,
      },
      _sum: {
        likeCount: true,
        commentCount: true,
      },
      _min: {
        publishedAt: true,
      },
      _max: {
        publishedAt: true,
      },
    });

    // Get user details
    const userIds = participants.map(p => p.authorId);
    const users = await prisma.userAccount.findMany({
      where: { id: { in: userIds } },
      include: {
        profile: true,
      },
    });

    const userMap = new Map(users.map(u => [u.id, u]));

    return participants.map(participant => {
      const user = userMap.get(participant.authorId);
      return {
        userId: participant.authorId,
        username: user?.username || 'Unknown',
        displayName: user?.profile?.displayName || 'Unknown User',
        postCount: participant._count.id,
        totalLikes: participant._sum.likeCount || 0,
        totalReplies: participant._sum.commentCount || 0,
        firstPostAt: participant._min.publishedAt!,
        lastPostAt: participant._max.publishedAt!,
      };
    }).sort((a, b) => b.postCount - a.postCount);
  }

  /**
   * Delete thread and all associated posts
   */
  static async delete(threadId: string): Promise<void> {
    // Delete all posts in thread (cascade will handle reactions)
    await prisma.post.deleteMany({
      where: { threadId },
    });

    // Delete the thread
    await prisma.thread.delete({
      where: { id: threadId },
    });
  }

  /**
   * Search threads by content
   */
  static async searchThreads(
    query: string,
    limit: number = 20
  ): Promise<ThreadWithPosts[]> {
    // Use PostgreSQL full-text search on associated posts
    const threadIds = await prisma.$queryRaw<Array<{ thread_id: string }>>`
      SELECT DISTINCT p.thread_id
      FROM posts p
      WHERE to_tsvector('english', p.content) @@ plainto_tsquery('english', ${query})
        AND p.is_hidden = false
      ORDER BY ts_rank(to_tsvector('english', p.content), plainto_tsquery('english', ${query})) DESC
      LIMIT ${limit}
    `;

    if (threadIds.length === 0) {
      return [];
    }

    const threads = await prisma.thread.findMany({
      where: {
        id: { in: threadIds.map(t => t.thread_id) },
        isHidden: false,
      },
      include: {
        posts: {
          where: { isHidden: false },
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
      },
      orderBy: {
        lastActivityAt: 'desc',
      },
    });

    return threads.map(thread => ({
      ...thread,
      posts: this.sortPostsForConversation(thread.posts),
    }));
  }
}

export default ThreadModel;
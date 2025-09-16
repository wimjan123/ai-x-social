// Reaction model for user engagement with posts
// Implements data-model.md:344-364 specifications

import { z } from 'zod';
import { PrismaClient, Reaction as PrismaReaction, ReactionType, Prisma } from '../generated/prisma';

const prisma = new PrismaClient();

// Validation schemas
export const CreateReactionSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  postId: z.string().uuid('Invalid post ID'),
  type: z.nativeEnum(ReactionType),
});

export const UpdateReactionSchema = z.object({
  type: z.nativeEnum(ReactionType),
});

export type CreateReactionData = z.infer<typeof CreateReactionSchema>;
export type UpdateReactionData = z.infer<typeof UpdateReactionSchema>;

export interface ReactionStats {
  likeCount: number;
  repostCount: number;
  bookmarkCount: number;
  reportCount: number;
  totalEngagement: number;
}

export interface UserReactionSummary {
  userId: string;
  username: string;
  displayName: string;
  totalReactions: number;
  likeCount: number;
  repostCount: number;
  bookmarkCount: number;
  mostActiveHour: number;
  avgReactionsPerDay: number;
}

export class ReactionModel {
  /**
   * Create or update a reaction (toggle behavior)
   */
  static async createOrUpdate(data: CreateReactionData): Promise<PrismaReaction> {
    const validatedData = CreateReactionSchema.parse(data);

    // Verify user and post exist
    const [user, post] = await Promise.all([
      prisma.userAccount.findUnique({ where: { id: validatedData.userId } }),
      prisma.post.findUnique({ where: { id: validatedData.postId } }),
    ]);

    if (!user) {
      throw new Error('User not found');
    }

    if (!post) {
      throw new Error('Post not found');
    }

    // Check if reaction already exists
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        userId: validatedData.userId,
        postId: validatedData.postId,
        type: validatedData.type,
      },
    });

    if (existingReaction) {
      // Remove existing reaction (toggle off)
      await this.delete(existingReaction.id);
      await this.updatePostCounts(validatedData.postId);

      // Return a placeholder to indicate removal
      return {
        ...existingReaction,
        id: '', // Empty ID indicates removal
      };
    }

    // Remove any other reaction types from this user on this post
    // (e.g., if user liked and now wants to repost, remove the like)
    await prisma.reaction.deleteMany({
      where: {
        userId: validatedData.userId,
        postId: validatedData.postId,
        type: { not: validatedData.type },
      },
    });

    // Create new reaction
    const reaction = await prisma.reaction.create({
      data: {
        userId: validatedData.userId,
        postId: validatedData.postId,
        type: validatedData.type,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        post: {
          include: {
            author: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });

    // Update post engagement counts
    await this.updatePostCounts(validatedData.postId);

    // Get post to update thread counts
    const postForThread = await prisma.post.findUnique({
      where: { id: validatedData.postId },
      select: { threadId: true },
    });

    // Update thread engagement counts
    if (postForThread?.threadId) {
      await this.updateThreadCounts(postForThread.threadId);
    }

    return reaction;
  }

  /**
   * Get reaction by ID
   */
  static async getById(id: string): Promise<PrismaReaction | null> {
    return prisma.reaction.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        post: true,
      },
    });
  }

  /**
   * Get all reactions for a post
   */
  static async getByPostId(postId: string): Promise<PrismaReaction[]> {
    return prisma.reaction.findMany({
      where: { postId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get all reactions by a user
   */
  static async getByUserId(
    userId: string,
    type?: ReactionType,
    page: number = 1,
    limit: number = 20
  ): Promise<{ reactions: PrismaReaction[]; hasMore: boolean; total: number }> {
    const offset = (page - 1) * limit;

    const where: Prisma.ReactionWhereInput = { userId };
    if (type) {
      where.type = type;
    }

    const [reactions, total] = await Promise.all([
      prisma.reaction.findMany({
        where,
        include: {
          post: {
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
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: limit,
      }),
      prisma.reaction.count({ where }),
    ]);

    return {
      reactions,
      hasMore: offset + reactions.length < total,
      total,
    };
  }

  /**
   * Get user's reaction to a specific post
   */
  static async getUserReactionToPost(userId: string, postId: string): Promise<PrismaReaction | null> {
    return prisma.reaction.findFirst({
      where: {
        userId,
        postId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update reaction type
   */
  static async update(id: string, data: UpdateReactionData): Promise<PrismaReaction> {
    const validatedData = UpdateReactionSchema.parse(data);

    const reaction = await prisma.reaction.update({
      where: { id },
      data: validatedData,
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        post: true,
      },
    });

    // Update post counts
    await this.updatePostCounts(reaction.postId);

    return reaction;
  }

  /**
   * Delete a reaction
   */
  static async delete(id: string): Promise<void> {
    const reaction = await prisma.reaction.findUnique({
      where: { id },
      include: { post: true },
    });

    if (!reaction) {
      throw new Error('Reaction not found');
    }

    await prisma.reaction.delete({
      where: { id },
    });

    // Update post counts
    await this.updatePostCounts(reaction.postId);

    // Update thread counts
    if (reaction.post.threadId) {
      await this.updateThreadCounts(reaction.post.threadId);
    }
  }

  /**
   * Update denormalized reaction counts on post
   */
  private static async updatePostCounts(postId: string): Promise<void> {
    const reactionCounts = await prisma.reaction.groupBy({
      by: ['type'],
      where: { postId },
      _count: {
        id: true,
      },
    });

    const counts = {
      likeCount: 0,
      repostCount: 0,
      // bookmarkCount and reportCount are tracked but not public metrics
    };

    for (const count of reactionCounts) {
      switch (count.type) {
        case ReactionType.LIKE:
          counts.likeCount = count._count.id;
          break;
        case ReactionType.REPOST:
          counts.repostCount = count._count.id;
          break;
      }
    }

    await prisma.post.update({
      where: { id: postId },
      data: counts,
    });
  }

  /**
   * Update thread engagement counts
   */
  private static async updateThreadCounts(threadId: string): Promise<void> {
    const posts = await prisma.post.findMany({
      where: { threadId },
      select: {
        likeCount: true,
        repostCount: true,
      },
    });

    const totalLikes = posts.reduce((sum, post) => sum + post.likeCount, 0);
    const totalReshares = posts.reduce((sum, post) => sum + post.repostCount, 0);

    await prisma.thread.update({
      where: { id: threadId },
      data: {
        totalLikes,
        totalReshares,
        lastActivityAt: new Date(),
      },
    });
  }

  /**
   * Get reaction statistics for a post
   */
  static async getPostReactionStats(postId: string): Promise<ReactionStats> {
    const reactionCounts = await prisma.reaction.groupBy({
      by: ['type'],
      where: { postId },
      _count: {
        id: true,
      },
    });

    const stats: ReactionStats = {
      likeCount: 0,
      repostCount: 0,
      bookmarkCount: 0,
      reportCount: 0,
      totalEngagement: 0,
    };

    for (const count of reactionCounts) {
      const countValue = count._count.id;
      switch (count.type) {
        case ReactionType.LIKE:
          stats.likeCount = countValue;
          break;
        case ReactionType.REPOST:
          stats.repostCount = countValue;
          break;
        case ReactionType.BOOKMARK:
          stats.bookmarkCount = countValue;
          break;
        case ReactionType.REPORT:
          stats.reportCount = countValue;
          break;
      }
    }

    stats.totalEngagement = stats.likeCount + stats.repostCount;

    return stats;
  }

  /**
   * Get users who reacted to a post with specific reaction type
   */
  static async getPostReactors(
    postId: string,
    type: ReactionType,
    limit: number = 50
  ): Promise<Array<{
    user: {
      id: string;
      username: string;
      profile: {
        displayName: string;
        profileImageUrl: string | null;
      } | null;
    };
    reactedAt: Date;
  }>> {
    const reactions = await prisma.reaction.findMany({
      where: {
        postId,
        type,
      },
      include: {
        user: {
          include: {
            profile: {
              select: {
                displayName: true,
                profileImageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return reactions.map(reaction => ({
      user: {
        id: reaction.user.id,
        username: reaction.user.username,
        profile: reaction.user.profile,
      },
      reactedAt: reaction.createdAt,
    }));
  }

  /**
   * Get user engagement analytics
   */
  static async getUserEngagementSummary(
    userId: string,
    days: number = 30
  ): Promise<UserReactionSummary> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const user = await prisma.userAccount.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const reactions = await prisma.reaction.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Group by reaction type
    const reactionCounts = {
      [ReactionType.LIKE]: 0,
      [ReactionType.REPOST]: 0,
      [ReactionType.BOOKMARK]: 0,
      [ReactionType.REPORT]: 0,
    };

    const hourlyActivity = new Array(24).fill(0);

    for (const reaction of reactions) {
      reactionCounts[reaction.type]++;
      const hour = reaction.createdAt.getHours();
      hourlyActivity[hour]++;
    }

    // Find most active hour
    const mostActiveHour = hourlyActivity.indexOf(Math.max(...hourlyActivity));

    return {
      userId,
      username: user.username,
      displayName: user.profile?.displayName || user.username,
      totalReactions: reactions.length,
      likeCount: reactionCounts[ReactionType.LIKE],
      repostCount: reactionCounts[ReactionType.REPOST],
      bookmarkCount: reactionCounts[ReactionType.BOOKMARK],
      mostActiveHour,
      avgReactionsPerDay: reactions.length / days,
    };
  }

  /**
   * Get trending posts based on recent reaction velocity
   */
  static async getTrendingPosts(
    hoursBack: number = 6,
    limit: number = 20
  ): Promise<Array<{
    postId: string;
    reactionVelocity: number;
    totalReactions: number;
    recentReactions: number;
  }>> {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hoursBack);

    const trendingData = await prisma.$queryRaw<Array<{
      post_id: string;
      total_reactions: bigint;
      recent_reactions: bigint;
    }>>`
      SELECT
        r.post_id,
        COUNT(*) as total_reactions,
        COUNT(CASE WHEN r.created_at >= ${cutoffTime} THEN 1 END) as recent_reactions
      FROM reactions r
      INNER JOIN posts p ON r.post_id = p.id
      WHERE p.is_hidden = false
        AND r.type IN ('LIKE', 'REPOST')
        AND r.created_at >= NOW() - INTERVAL '24 hours'
      GROUP BY r.post_id
      HAVING COUNT(CASE WHEN r.created_at >= ${cutoffTime} THEN 1 END) > 0
      ORDER BY recent_reactions DESC, total_reactions DESC
      LIMIT ${limit}
    `;

    return trendingData.map(item => ({
      postId: item.post_id,
      reactionVelocity: Number(item.recent_reactions) / hoursBack,
      totalReactions: Number(item.total_reactions),
      recentReactions: Number(item.recent_reactions),
    }));
  }

  /**
   * Remove all reactions from a user (for account deletion)
   */
  static async removeAllUserReactions(userId: string): Promise<number> {
    const reactions = await prisma.reaction.findMany({
      where: { userId },
      select: { id: true, postId: true, post: { select: { threadId: true } } },
    });

    // Get unique post IDs and thread IDs for count updates
    const postIds = Array.from(new Set(reactions.map(r => r.postId)));
    const threadIds = Array.from(new Set(reactions.map(r => r.post.threadId).filter(Boolean) as string[]));

    // Delete all reactions
    const deleteResult = await prisma.reaction.deleteMany({
      where: { userId },
    });

    // Update post counts for affected posts
    for (const postId of postIds) {
      await this.updatePostCounts(postId);
    }

    // Update thread counts for affected threads
    for (const threadId of threadIds) {
      if (threadId) {
        await this.updateThreadCounts(threadId);
      }
    }

    return deleteResult.count;
  }

  /**
   * Bulk create reactions (for data migration or testing)
   */
  static async bulkCreate(reactions: CreateReactionData[]): Promise<number> {
    // Validate all reactions
    const validatedReactions = reactions.map(r => CreateReactionSchema.parse(r));

    // Remove duplicates based on userId, postId, type combination
    const uniqueReactions = validatedReactions.filter((reaction, index, self) =>
      index === self.findIndex(r =>
        r.userId === reaction.userId &&
        r.postId === reaction.postId &&
        r.type === reaction.type
      )
    );

    if (uniqueReactions.length === 0) {
      return 0;
    }

    // Bulk create
    const result = await prisma.reaction.createMany({
      data: uniqueReactions as any[], // Type assertion to handle Prisma types
      skipDuplicates: true,
    });

    // Update counts for affected posts
    const affectedPostIds = Array.from(new Set(uniqueReactions.map(r => r.postId)));
    for (const postId of affectedPostIds) {
      await this.updatePostCounts(postId);
    }

    return result.count;
  }
}

export default ReactionModel;
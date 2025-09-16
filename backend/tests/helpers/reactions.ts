import { v4 as uuidv4 } from 'uuid';

/**
 * Helper functions for creating test reactions in contract tests
 * These functions will initially fail as no implementation exists yet
 */

export interface TestReaction {
  id: string;
  userId: string;
  postId: string;
  type: ReactionType;
  createdAt: Date;
}

export type ReactionType = 'LIKE' | 'REPOST' | 'BOOKMARK' | 'REPORT';

export const createTestReaction = async (
  userId: string,
  postId: string,
  type: ReactionType,
  overrides: Partial<TestReaction> = {}
): Promise<TestReaction> => {
  const reactionId = uuidv4();
  const now = new Date();

  const defaultReaction: TestReaction = {
    id: reactionId,
    userId,
    postId,
    type,
    createdAt: now
  };

  const reactionData = { ...defaultReaction, ...overrides };

  // This will fail initially as no database/prisma implementation exists
  // The test should expect this failure and validate the API contract
  try {
    // In real implementation, this would be:
    // return await prisma.reaction.create({
    //   data: {
    //     id: reactionData.id,
    //     userId: reactionData.userId,
    //     postId: reactionData.postId,
    //     type: reactionData.type,
    //     createdAt: reactionData.createdAt
    //   }
    // });

    return reactionData;
  } catch (error) {
    throw new Error(`Failed to create test reaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const createLikeReaction = async (
  userId: string,
  postId: string,
  overrides: Partial<TestReaction> = {}
): Promise<TestReaction> => {
  return createTestReaction(userId, postId, 'LIKE', overrides);
};

export const createRepostReaction = async (
  userId: string,
  postId: string,
  overrides: Partial<TestReaction> = {}
): Promise<TestReaction> => {
  return createTestReaction(userId, postId, 'REPOST', overrides);
};

export const createBookmarkReaction = async (
  userId: string,
  postId: string,
  overrides: Partial<TestReaction> = {}
): Promise<TestReaction> => {
  return createTestReaction(userId, postId, 'BOOKMARK', overrides);
};

export const createReportReaction = async (
  userId: string,
  postId: string,
  overrides: Partial<TestReaction> = {}
): Promise<TestReaction> => {
  return createTestReaction(userId, postId, 'REPORT', overrides);
};

export const createMultipleReactions = async (
  userIds: string[],
  postId: string,
  type: ReactionType
): Promise<TestReaction[]> => {
  const reactions: TestReaction[] = [];

  for (const userId of userIds) {
    const reaction = await createTestReaction(userId, postId, type);
    reactions.push(reaction);
  }

  return reactions;
};

export const createAllReactionTypes = async (
  userId: string,
  postIds: string[]
): Promise<TestReaction[]> => {
  const reactions: TestReaction[] = [];
  const reactionTypes: ReactionType[] = ['LIKE', 'REPOST', 'BOOKMARK', 'REPORT'];

  for (let i = 0; i < postIds.length && i < reactionTypes.length; i++) {
    const reaction = await createTestReaction(userId, postIds[i], reactionTypes[i]);
    reactions.push(reaction);
  }

  return reactions;
};

export const validateReactionType = (type: string): type is ReactionType => {
  return ['LIKE', 'REPOST', 'BOOKMARK', 'REPORT'].includes(type);
};

export const getReactionsByUser = async (userId: string): Promise<TestReaction[]> => {
  // Mock implementation for contract testing
  // In real implementation, this would query the database
  try {
    // return await prisma.reaction.findMany({
    //   where: { userId },
    //   orderBy: { createdAt: 'desc' }
    // });

    return []; // Mock empty result
  } catch (error) {
    throw new Error(`Failed to get reactions by user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getReactionsByPost = async (postId: string): Promise<TestReaction[]> => {
  // Mock implementation for contract testing
  // In real implementation, this would query the database
  try {
    // return await prisma.reaction.findMany({
    //   where: { postId },
    //   orderBy: { createdAt: 'desc' }
    // });

    return []; // Mock empty result
  } catch (error) {
    throw new Error(`Failed to get reactions by post: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getReactionCounts = async (postId: string): Promise<Record<ReactionType, number>> => {
  // Mock implementation for contract testing
  // In real implementation, this would aggregate reaction counts
  try {
    // const counts = await prisma.reaction.groupBy({
    //   by: ['type'],
    //   where: { postId },
    //   _count: {
    //     type: true
    //   }
    // });

    // Return aggregated counts
    return {
      LIKE: 0,
      REPOST: 0,
      BOOKMARK: 0,
      REPORT: 0
    };
  } catch (error) {
    throw new Error(`Failed to get reaction counts: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const checkUserReaction = async (
  userId: string,
  postId: string,
  type: ReactionType
): Promise<TestReaction | null> => {
  // Mock implementation for contract testing
  // In real implementation, this would check if user has already reacted
  try {
    // return await prisma.reaction.findUnique({
    //   where: {
    //     userId_postId_type: {
    //       userId,
    //       postId,
    //       type
    //     }
    //   }
    // });

    return null; // Mock no existing reaction
  } catch (error) {
    throw new Error(`Failed to check user reaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const removeTestReaction = async (
  userId: string,
  postId: string,
  type: ReactionType
): Promise<boolean> => {
  // Mock implementation for contract testing
  // In real implementation, this would delete the reaction
  try {
    // const deleted = await prisma.reaction.deleteMany({
    //   where: {
    //     userId,
    //     postId,
    //     type
    //   }
    // });

    // return deleted.count > 0;
    return true; // Mock successful deletion
  } catch (error) {
    throw new Error(`Failed to remove reaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const createReactionBatch = async (
  reactions: Array<{
    userId: string;
    postId: string;
    type: ReactionType;
  }>
): Promise<TestReaction[]> => {
  const createdReactions: TestReaction[] = [];

  for (const reactionData of reactions) {
    const reaction = await createTestReaction(
      reactionData.userId,
      reactionData.postId,
      reactionData.type
    );
    createdReactions.push(reaction);
  }

  return createdReactions;
};

// Mock reaction data for consistent testing
export const MOCK_REACTIONS = {
  LIKE: {
    type: 'LIKE' as ReactionType
  },
  REPOST: {
    type: 'REPOST' as ReactionType
  },
  BOOKMARK: {
    type: 'BOOKMARK' as ReactionType
  },
  REPORT: {
    type: 'REPORT' as ReactionType
  }
} as const;

export const REACTION_TYPES: ReactionType[] = ['LIKE', 'REPOST', 'BOOKMARK', 'REPORT'];

export const INVALID_REACTION_TYPES = [
  'LOVE', 'DISLIKE', 'ANGRY', 'LAUGH', 'WOW', 'SAD',
  'like', 'repost', 'bookmark', 'report',
  'Like', 'Repost', 'Bookmark', 'Report',
  '', ' ', 'invalid_type', '123', null, undefined
];

export const generateReactionTestData = (userCount: number, postCount: number) => {
  const testData: Array<{
    userId: string;
    postId: string;
    type: ReactionType;
  }> = [];

  for (let u = 0; u < userCount; u++) {
    for (let p = 0; p < postCount; p++) {
      for (const type of REACTION_TYPES) {
        testData.push({
          userId: `user_${u}`,
          postId: `post_${p}`,
          type
        });
      }
    }
  }

  return testData;
};

export const simulateReactionTrends = (
  baseReactions: TestReaction[],
  trendingFactor: number = 2
): TestReaction[] => {
  // Simulate trending posts by duplicating popular reactions
  const trending: TestReaction[] = [...baseReactions];

  baseReactions
    .filter(r => r.type === 'LIKE')
    .slice(0, Math.floor(baseReactions.length / trendingFactor))
    .forEach(reaction => {
      for (let i = 0; i < trendingFactor; i++) {
        trending.push({
          ...reaction,
          id: uuidv4(),
          userId: `trending_user_${i}`,
          createdAt: new Date(Date.now() + i * 1000)
        });
      }
    });

  return trending;
};
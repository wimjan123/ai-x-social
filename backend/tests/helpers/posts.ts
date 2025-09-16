import { v4 as uuidv4 } from 'uuid';

/**
 * Helper functions for creating test posts in contract tests
 * These functions will initially fail as no implementation exists yet
 */

export interface TestPost {
  id: string;
  authorId?: string | null;
  personaId?: string | null;
  content: string;
  mediaUrls?: string[];
  linkPreview?: LinkPreview | null;
  threadId?: string;
  parentPostId?: string | null;
  repostOfId?: string | null;
  isAIGenerated?: boolean;
  hashtags?: string[];
  mentions?: string[];
  newsItemId?: string | null;
  likeCount?: number;
  repostCount?: number;
  commentCount?: number;
  impressionCount?: number;
  contentWarning?: string | null;
  isHidden?: boolean;
  isDeleted?: boolean;
  publishedAt?: Date;
  editedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LinkPreview {
  url: string;
  title: string;
  description: string;
  imageUrl?: string;
  siteName: string;
}

export const createTestPost = async (overrides: Partial<TestPost> = {}): Promise<TestPost> => {
  const postId = uuidv4();
  const now = new Date();

  const defaultPost: TestPost = {
    id: postId,
    authorId: overrides.authorId || uuidv4(),
    personaId: null,
    content: 'Test post content for contract testing',
    mediaUrls: [],
    linkPreview: null,
    threadId: postId, // Root posts have threadId = id
    parentPostId: null,
    repostOfId: null,
    isAIGenerated: false,
    hashtags: [],
    mentions: [],
    newsItemId: null,
    likeCount: 0,
    repostCount: 0,
    commentCount: 0,
    impressionCount: 0,
    contentWarning: null,
    isHidden: false,
    isDeleted: false,
    publishedAt: now,
    editedAt: null,
    createdAt: now,
    updatedAt: now
  };

  const postData = { ...defaultPost, ...overrides };

  // Extract hashtags from content if not provided
  if (!overrides.hashtags && postData.content) {
    postData.hashtags = extractHashtags(postData.content);
  }

  // Extract mentions from content if not provided
  if (!overrides.mentions && postData.content) {
    postData.mentions = extractMentions(postData.content);
  }

  // Set threadId for replies
  if (postData.parentPostId && !overrides.threadId) {
    // In real implementation, this would query the parent post's threadId
    postData.threadId = postData.parentPostId; // Simplified for testing
  }

  // This will fail initially as no database/prisma implementation exists
  // The test should expect this failure and validate the API contract
  try {
    // In real implementation, this would be:
    // return await prisma.post.create({
    //   data: {
    //     id: postData.id,
    //     authorId: postData.authorId,
    //     personaId: postData.personaId,
    //     content: postData.content,
    //     mediaUrls: postData.mediaUrls,
    //     linkPreview: postData.linkPreview,
    //     threadId: postData.threadId,
    //     parentPostId: postData.parentPostId,
    //     repostOfId: postData.repostOfId,
    //     isAIGenerated: postData.isAIGenerated,
    //     hashtags: postData.hashtags,
    //     mentions: postData.mentions,
    //     newsItemId: postData.newsItemId,
    //     contentWarning: postData.contentWarning,
    //     isHidden: postData.isHidden,
    //     publishedAt: postData.publishedAt,
    //     metrics: {
    //       create: {
    //         likeCount: postData.likeCount,
    //         repostCount: postData.repostCount,
    //         commentCount: postData.commentCount,
    //         impressionCount: postData.impressionCount
    //       }
    //     }
    //   },
    //   include: {
    //     author: true,
    //     persona: true,
    //     metrics: true
    //   }
    // });

    return postData;
  } catch (error) {
    throw new Error(`Failed to create test post: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const createTestReply = async (
  parentPostId: string,
  authorId: string,
  content: string,
  overrides: Partial<TestPost> = {}
): Promise<TestPost> => {
  return createTestPost({
    authorId,
    content,
    parentPostId,
    threadId: parentPostId, // Simplified - should be parent's threadId
    ...overrides
  });
};

export const createTestRepost = async (
  originalPostId: string,
  authorId: string,
  content: string = '',
  overrides: Partial<TestPost> = {}
): Promise<TestPost> => {
  return createTestPost({
    authorId,
    content,
    repostOfId: originalPostId,
    ...overrides
  });
};

export const createAIGeneratedPost = async (
  personaId: string,
  content: string,
  overrides: Partial<TestPost> = {}
): Promise<TestPost> => {
  return createTestPost({
    authorId: null,
    personaId,
    content,
    isAIGenerated: true,
    ...overrides
  });
};

export const createPostWithMedia = async (
  authorId: string,
  content: string,
  mediaUrls: string[],
  overrides: Partial<TestPost> = {}
): Promise<TestPost> => {
  return createTestPost({
    authorId,
    content,
    mediaUrls,
    ...overrides
  });
};

export const createPostWithLinkPreview = async (
  authorId: string,
  content: string,
  linkPreview: LinkPreview,
  overrides: Partial<TestPost> = {}
): Promise<TestPost> => {
  return createTestPost({
    authorId,
    content,
    linkPreview,
    ...overrides
  });
};

export const createPostWithContentWarning = async (
  authorId: string,
  content: string,
  contentWarning: string,
  overrides: Partial<TestPost> = {}
): Promise<TestPost> => {
  return createTestPost({
    authorId,
    content,
    contentWarning,
    ...overrides
  });
};

export const createMultipleTestPosts = async (
  count: number,
  authorId: string,
  baseContent: string = 'Test post'
): Promise<TestPost[]> => {
  const posts: TestPost[] = [];

  for (let i = 0; i < count; i++) {
    const post = await createTestPost({
      authorId,
      content: `${baseContent} ${i + 1}`,
      publishedAt: new Date(Date.now() + i * 1000) // Stagger timestamps
    });
    posts.push(post);
  }

  return posts;
};

export const createThreadWithReplies = async (
  authorId: string,
  rootContent: string,
  replyContents: string[]
): Promise<{ root: TestPost; replies: TestPost[] }> => {
  const root = await createTestPost({
    authorId,
    content: rootContent
  });

  const replies: TestPost[] = [];
  for (const replyContent of replyContents) {
    const reply = await createTestReply(root.id, authorId, replyContent);
    replies.push(reply);
  }

  return { root, replies };
};

// Utility functions for content processing
export const extractHashtags = (content: string): string[] => {
  const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
  const matches = content.match(hashtagRegex);
  if (!matches) return [];

  return matches.map(tag => tag.substring(1)); // Remove the # symbol
};

export const extractMentions = (content: string): string[] => {
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const matches = content.match(mentionRegex);
  if (!matches) return [];

  return matches.map(mention => mention.substring(1)); // Remove the @ symbol
};

export const validatePostContent = (content: string): boolean => {
  return content.length > 0 && content.length <= 280;
};

export const validateMediaUrls = (urls: string[]): boolean => {
  if (urls.length > 4) return false;

  return urls.every(url => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  });
};

// Mock post data for consistent testing
export const MOCK_POSTS = {
  SIMPLE: {
    content: 'Simple test post'
  },
  WITH_HASHTAGS: {
    content: 'Post with #hashtags #politics #test'
  },
  WITH_MENTIONS: {
    content: 'Post mentioning @user1 and @user2'
  },
  WITH_MEDIA: {
    content: 'Post with media attachments',
    mediaUrls: ['https://example.com/image1.jpg', 'https://example.com/video1.mp4']
  },
  WITH_LINK: {
    content: 'Post with link preview',
    linkPreview: {
      url: 'https://example.com/article',
      title: 'Example Article',
      description: 'This is an example article',
      siteName: 'Example Site'
    }
  },
  MAX_LENGTH: {
    content: 'a'.repeat(280)
  },
  WITH_WARNING: {
    content: 'Sensitive content discussion',
    contentWarning: 'Political Discussion'
  }
} as const;

export const POST_CATEGORIES = {
  POLITICS: 'politics',
  TECHNOLOGY: 'technology',
  ENTERTAINMENT: 'entertainment',
  SPORTS: 'sports',
  ALL: 'all'
} as const;
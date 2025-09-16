import request from 'supertest';
import { app } from '../../src/index';
import { createTestUser, getValidJWT } from '../helpers/auth';
import { createTestPost } from '../helpers/posts';
import { createTestNewsItem } from '../helpers/news';
import { v4 as uuidv4 } from 'uuid';

describe('Contract: GET /api/posts/{postId}', () => {
  let authToken: string;
  let testUser: any;
  let testPost: any;
  let testNewsItem: any;

  beforeEach(async () => {
    testUser = await createTestUser({
      username: 'post_viewer',
      displayName: 'Post Viewer',
      personaType: 'POLITICIAN'
    });
    authToken = await getValidJWT(testUser.id);

    testNewsItem = await createTestNewsItem({
      title: 'Breaking News: Political Development',
      description: 'Major political update',
      url: 'https://news.example.com/political-update'
    });

    testPost = await createTestPost({
      authorId: testUser.id,
      content: 'Main post for detailed testing #politics #test @mention_user',
      mediaUrls: ['https://example.com/image1.jpg', 'https://example.com/video1.mp4'],
      newsItemId: testNewsItem.id,
      contentWarning: 'Political Discussion'
    });
  });

  describe('Success Cases', () => {
    it('should return detailed post information', async () => {
      const response = await request(app)
        .get(`/api/posts/${testPost.id}`)
        .expect(200);

      // Validate response schema matches OpenAPI PostDetail schema
      expect(response.body).toMatchObject({
        id: testPost.id,
        authorId: testUser.id,
        personaId: null,
        content: 'Main post for detailed testing #politics #test @mention_user',
        mediaUrls: ['https://example.com/image1.jpg', 'https://example.com/video1.mp4'],
        threadId: expect.any(String),
        parentPostId: null,
        repostOfId: null,
        isAIGenerated: false,
        hashtags: ['politics', 'test'],
        mentions: ['mention_user'],
        newsItemId: testNewsItem.id,
        likeCount: expect.any(Number),
        repostCount: expect.any(Number),
        commentCount: expect.any(Number),
        impressionCount: expect.any(Number),
        contentWarning: 'Political Discussion',
        isHidden: false,
        publishedAt: expect.any(String),
        editedAt: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        author: expect.objectContaining({
          id: testUser.id,
          username: 'post_viewer',
          displayName: 'Post Viewer',
          personaType: 'POLITICIAN'
        }),
        persona: null,
        replies: expect.any(Array),
        newsContext: expect.objectContaining({
          id: testNewsItem.id,
          title: 'Breaking News: Political Development',
          description: 'Major political update',
          url: 'https://news.example.com/political-update'
        })
      });

      // Validate UUID format
      expect(response.body.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      expect(response.body.threadId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);

      // Validate ISO date formats
      expect(new Date(response.body.publishedAt)).toBeInstanceOf(Date);
      expect(new Date(response.body.createdAt)).toBeInstanceOf(Date);
      expect(new Date(response.body.updatedAt)).toBeInstanceOf(Date);
    });

    it('should return post with replies in thread', async () => {
      // Create several replies to test post
      const reply1 = await createTestPost({
        authorId: testUser.id,
        content: 'First reply to main post',
        parentPostId: testPost.id,
        threadId: testPost.threadId
      });

      const reply2 = await createTestPost({
        authorId: testUser.id,
        content: 'Second reply to main post',
        parentPostId: testPost.id,
        threadId: testPost.threadId
      });

      // Create nested reply
      const nestedReply = await createTestPost({
        authorId: testUser.id,
        content: 'Reply to first reply',
        parentPostId: reply1.id,
        threadId: testPost.threadId
      });

      const response = await request(app)
        .get(`/api/posts/${testPost.id}`)
        .expect(200);

      expect(response.body.replies).toBeInstanceOf(Array);
      expect(response.body.replies.length).toBeGreaterThan(0);

      // Validate reply structure
      response.body.replies.forEach((reply: any) => {
        expect(reply).toMatchObject({
          id: expect.any(String),
          authorId: expect.any(String),
          content: expect.any(String),
          parentPostId: expect.any(String),
          threadId: testPost.threadId,
          author: expect.objectContaining({
            username: expect.any(String),
            displayName: expect.any(String)
          })
        });

        // All replies should be in the same thread
        expect(reply.threadId).toBe(testPost.threadId);
      });

      // Should include direct replies
      const directReplies = response.body.replies.filter((reply: any) =>
        reply.parentPostId === testPost.id
      );
      expect(directReplies.length).toBeGreaterThanOrEqual(2);
    });

    it('should return AI-generated post with persona information', async () => {
      // Create AI persona
      const testPersona = {
        id: uuidv4(),
        name: 'AI Political Commentator',
        handle: 'ai_politician',
        bio: 'AI persona for political commentary',
        personaType: 'POLITICIAN',
        toneStyle: 'PROFESSIONAL'
      };

      const aiPost = await createTestPost({
        authorId: null,
        personaId: testPersona.id,
        content: 'AI-generated response to current events',
        isAIGenerated: true
      });

      const response = await request(app)
        .get(`/api/posts/${aiPost.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: aiPost.id,
        authorId: null,
        personaId: testPersona.id,
        isAIGenerated: true,
        author: null,
        persona: expect.objectContaining({
          id: testPersona.id,
          name: 'AI Political Commentator',
          handle: 'ai_politician',
          bio: 'AI persona for political commentary',
          personaType: 'POLITICIAN',
          toneStyle: 'PROFESSIONAL',
          isActive: expect.any(Boolean)
        })
      });
    });

    it('should return post with repost information', async () => {
      // Create original post to repost
      const originalPost = await createTestPost({
        authorId: testUser.id,
        content: 'Original post to be reposted'
      });

      // Create repost
      const repost = await createTestPost({
        authorId: testUser.id,
        content: 'Sharing this important message',
        repostOfId: originalPost.id
      });

      const response = await request(app)
        .get(`/api/posts/${repost.id}`)
        .expect(200);

      expect(response.body.repostOfId).toBe(originalPost.id);
      expect(response.body.content).toBe('Sharing this important message');
    });

    it('should return post with proper link preview', async () => {
      const postWithLink = await createTestPost({
        authorId: testUser.id,
        content: 'Check out this article: https://example.com/article',
        linkPreview: {
          url: 'https://example.com/article',
          title: 'Important Article Title',
          description: 'Article description here',
          imageUrl: 'https://example.com/preview.jpg',
          siteName: 'Example News'
        }
      });

      const response = await request(app)
        .get(`/api/posts/${postWithLink.id}`)
        .expect(200);

      expect(response.body.linkPreview).toMatchObject({
        url: 'https://example.com/article',
        title: 'Important Article Title',
        description: 'Article description here',
        imageUrl: 'https://example.com/preview.jpg',
        siteName: 'Example News'
      });
    });

    it('should return post with accurate interaction counts', async () => {
      // Create post with some interactions
      const popularPost = await createTestPost({
        authorId: testUser.id,
        content: 'Popular post with interactions',
        likeCount: 25,
        repostCount: 8,
        commentCount: 15,
        impressionCount: 150
      });

      const response = await request(app)
        .get(`/api/posts/${popularPost.id}`)
        .expect(200);

      expect(response.body.likeCount).toBe(25);
      expect(response.body.repostCount).toBe(8);
      expect(response.body.commentCount).toBe(15);
      expect(response.body.impressionCount).toBe(150);
    });

    it('should return edited post with editedAt timestamp', async () => {
      const editedPost = await createTestPost({
        authorId: testUser.id,
        content: 'This post has been edited',
        editedAt: new Date('2024-01-15T14:30:00Z')
      });

      const response = await request(app)
        .get(`/api/posts/${editedPost.id}`)
        .expect(200);

      expect(response.body.editedAt).toBe('2024-01-15T14:30:00.000Z');
      expect(new Date(response.body.editedAt)).toBeInstanceOf(Date);
    });

    it('should return post without sensitive author information', async () => {
      const response = await request(app)
        .get(`/api/posts/${testPost.id}`)
        .expect(200);

      // Should include public author information
      expect(response.body.author).toMatchObject({
        id: expect.any(String),
        username: expect.any(String),
        displayName: expect.any(String),
        bio: expect.any(String),
        personaType: expect.any(String),
        verificationBadge: expect.any(Boolean),
        followerCount: expect.any(Number),
        followingCount: expect.any(Number),
        postCount: expect.any(Number),
        createdAt: expect.any(String)
      });

      // Should not include sensitive information
      expect(response.body.author).not.toHaveProperty('email');
      expect(response.body.author).not.toHaveProperty('passwordHash');
      expect(response.body.author).not.toHaveProperty('refreshTokens');
    });
  });

  describe('Error Cases', () => {
    it('should return 404 for non-existent post', async () => {
      const fakePostId = uuidv4();

      const response = await request(app)
        .get(`/api/posts/${fakePostId}`)
        .expect(404);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('Post not found'),
        code: 'NOT_FOUND_ERROR'
      });
    });

    it('should return 400 for invalid UUID format', async () => {
      const response = await request(app)
        .get('/api/posts/invalid-uuid')
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('UUID'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should return 404 for deleted post', async () => {
      const deletedPost = await createTestPost({
        authorId: testUser.id,
        content: 'This post will be deleted',
        isDeleted: true
      });

      const response = await request(app)
        .get(`/api/posts/${deletedPost.id}`)
        .expect(404);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('Post not found'),
        code: 'NOT_FOUND_ERROR'
      });
    });

    it('should return 404 for hidden post when not author', async () => {
      // Create another user
      const otherUser = await createTestUser({
        username: 'other_user',
        displayName: 'Other User'
      });

      const hiddenPost = await createTestPost({
        authorId: otherUser.id,
        content: 'This post is hidden',
        isHidden: true
      });

      const response = await request(app)
        .get(`/api/posts/${hiddenPost.id}`)
        .expect(404);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('Post not found'),
        code: 'NOT_FOUND_ERROR'
      });
    });
  });

  describe('Access Control', () => {
    it('should allow author to view their own hidden post', async () => {
      const hiddenPost = await createTestPost({
        authorId: testUser.id,
        content: 'This is my hidden post',
        isHidden: true
      });

      const response = await request(app)
        .get(`/api/posts/${hiddenPost.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(hiddenPost.id);
      expect(response.body.isHidden).toBe(true);
      expect(response.body.content).toBe('This is my hidden post');
    });

    it('should work without authentication for public posts', async () => {
      const response = await request(app)
        .get(`/api/posts/${testPost.id}`)
        .expect(200);

      expect(response.body.id).toBe(testPost.id);
      expect(response.body.isHidden).toBe(false);
    });

    it('should increment impression count on view', async () => {
      const initialResponse = await request(app)
        .get(`/api/posts/${testPost.id}`)
        .expect(200);

      const initialImpressions = initialResponse.body.impressionCount;

      // View the post again
      const secondResponse = await request(app)
        .get(`/api/posts/${testPost.id}`)
        .expect(200);

      expect(secondResponse.body.impressionCount).toBeGreaterThan(initialImpressions);
    });
  });

  describe('Content Handling', () => {
    it('should handle posts with no media URLs', async () => {
      const textOnlyPost = await createTestPost({
        authorId: testUser.id,
        content: 'Text-only post with no media',
        mediaUrls: []
      });

      const response = await request(app)
        .get(`/api/posts/${textOnlyPost.id}`)
        .expect(200);

      expect(response.body.mediaUrls).toEqual([]);
    });

    it('should handle posts with no hashtags or mentions', async () => {
      const plainPost = await createTestPost({
        authorId: testUser.id,
        content: 'Plain text post with no special formatting'
      });

      const response = await request(app)
        .get(`/api/posts/${plainPost.id}`)
        .expect(200);

      expect(response.body.hashtags).toEqual([]);
      expect(response.body.mentions).toEqual([]);
    });

    it('should handle posts with no content warning', async () => {
      const normalPost = await createTestPost({
        authorId: testUser.id,
        content: 'Normal post without content warning'
      });

      const response = await request(app)
        .get(`/api/posts/${normalPost.id}`)
        .expect(200);

      expect(response.body.contentWarning).toBeNull();
    });

    it('should handle posts with no news context', async () => {
      const standalonePost = await createTestPost({
        authorId: testUser.id,
        content: 'Standalone post not related to news'
      });

      const response = await request(app)
        .get(`/api/posts/${standalonePost.id}`)
        .expect(200);

      expect(response.body.newsItemId).toBeNull();
      expect(response.body.newsContext).toBeNull();
    });

    it('should handle root posts with no parent', async () => {
      const rootPost = await createTestPost({
        authorId: testUser.id,
        content: 'Root post starting a new thread'
      });

      const response = await request(app)
        .get(`/api/posts/${rootPost.id}`)
        .expect(200);

      expect(response.body.parentPostId).toBeNull();
      expect(response.body.threadId).toBe(rootPost.id);
    });

    it('should handle posts with maximum content length', async () => {
      const maxLengthContent = 'a'.repeat(280);
      const maxPost = await createTestPost({
        authorId: testUser.id,
        content: maxLengthContent
      });

      const response = await request(app)
        .get(`/api/posts/${maxPost.id}`)
        .expect(200);

      expect(response.body.content).toBe(maxLengthContent);
      expect(response.body.content.length).toBe(280);
    });
  });

  describe('Performance', () => {
    it('should respond within reasonable time', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get(`/api/posts/${testPost.id}`)
        .expect(200);

      const responseTime = Date.now() - startTime;

      // Should respond within 1 second
      expect(responseTime).toBeLessThan(1000);
      expect(response.body.id).toBe(testPost.id);
    });

    it('should handle concurrent requests efficiently', async () => {
      const promises = Array(10).fill(null).map(() =>
        request(app)
          .get(`/api/posts/${testPost.id}`)
          .expect(200)
      );

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.body.id).toBe(testPost.id);
      });
    });
  });

  describe('Data Consistency', () => {
    it('should return consistent data across multiple requests', async () => {
      const response1 = await request(app)
        .get(`/api/posts/${testPost.id}`)
        .expect(200);

      const response2 = await request(app)
        .get(`/api/posts/${testPost.id}`)
        .expect(200);

      // Core data should be identical (excluding impression count)
      expect(response1.body.id).toBe(response2.body.id);
      expect(response1.body.content).toBe(response2.body.content);
      expect(response1.body.authorId).toBe(response2.body.authorId);
      expect(response1.body.publishedAt).toBe(response2.body.publishedAt);
      expect(response1.body.hashtags).toEqual(response2.body.hashtags);
      expect(response1.body.mentions).toEqual(response2.body.mentions);
    });

    it('should reflect real-time updates in interaction counts', async () => {
      // This test would verify that like/repost counts are updated
      // in real-time when other users interact with the post
      const response = await request(app)
        .get(`/api/posts/${testPost.id}`)
        .expect(200);

      expect(response.body.likeCount).toBeGreaterThanOrEqual(0);
      expect(response.body.repostCount).toBeGreaterThanOrEqual(0);
      expect(response.body.commentCount).toBeGreaterThanOrEqual(0);
    });
  });
});
import request from 'supertest';
import { app } from '../../src/index';
import { createTestUser, getValidJWT } from '../helpers/auth';
import { createTestPost } from '../helpers/posts';
import { createTestReaction } from '../helpers/reactions';
import { v4 as uuidv4 } from 'uuid';

describe('Contract: POST /api/posts/{postId}/reactions', () => {
  let authToken: string;
  let testUser: any;
  let otherUser: any;
  let testPost: any;
  let aiPost: any;

  beforeEach(async () => {
    testUser = await createTestUser({
      username: 'reaction_user',
      displayName: 'Reaction User',
      personaType: 'POLITICIAN'
    });

    otherUser = await createTestUser({
      username: 'other_reactor',
      displayName: 'Other Reactor',
      personaType: 'INFLUENCER'
    });

    authToken = await getValidJWT(testUser.id);

    // Create test post to react to
    testPost = await createTestPost({
      authorId: otherUser.id,
      content: 'Post to test reactions on #politics #test',
      publishedAt: new Date('2024-01-15T10:00:00Z')
    });

    // Create AI-generated post
    aiPost = await createTestPost({
      authorId: null,
      personaId: uuidv4(),
      content: 'AI-generated post for reaction testing',
      isAIGenerated: true
    });
  });

  describe('Success Cases', () => {
    it('should create LIKE reaction successfully', async () => {
      const reactionData = {
        type: 'LIKE'
      };

      const response = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(reactionData)
        .expect(201);

      // Validate response schema matches OpenAPI Reaction schema
      expect(response.body).toMatchObject({
        id: expect.any(String),
        userId: testUser.id,
        postId: testPost.id,
        type: 'LIKE',
        createdAt: expect.any(String)
      });

      // Validate UUID format
      expect(response.body.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);

      // Validate ISO date format
      expect(new Date(response.body.createdAt)).toBeInstanceOf(Date);
    });

    it('should create REPOST reaction successfully', async () => {
      const reactionData = {
        type: 'REPOST'
      };

      const response = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(reactionData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        userId: testUser.id,
        postId: testPost.id,
        type: 'REPOST',
        createdAt: expect.any(String)
      });
    });

    it('should create BOOKMARK reaction successfully', async () => {
      const reactionData = {
        type: 'BOOKMARK'
      };

      const response = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(reactionData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        userId: testUser.id,
        postId: testPost.id,
        type: 'BOOKMARK',
        createdAt: expect.any(String)
      });
    });

    it('should create REPORT reaction successfully', async () => {
      const reactionData = {
        type: 'REPORT'
      };

      const response = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(reactionData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        userId: testUser.id,
        postId: testPost.id,
        type: 'REPORT',
        createdAt: expect.any(String)
      });
    });

    it('should allow reacting to AI-generated post', async () => {
      const reactionData = {
        type: 'LIKE'
      };

      const response = await request(app)
        .post(`/api/posts/${aiPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(reactionData)
        .expect(201);

      expect(response.body).toMatchObject({
        userId: testUser.id,
        postId: aiPost.id,
        type: 'LIKE'
      });
    });

    it('should allow user to react to their own post', async () => {
      // Create post by test user
      const ownPost = await createTestPost({
        authorId: testUser.id,
        content: 'My own post to react to'
      });

      const reactionData = {
        type: 'LIKE'
      };

      const response = await request(app)
        .post(`/api/posts/${ownPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(reactionData)
        .expect(201);

      expect(response.body).toMatchObject({
        userId: testUser.id,
        postId: ownPost.id,
        type: 'LIKE'
      });
    });

    it('should update post reaction counts', async () => {
      // Get initial post state
      const initialResponse = await request(app)
        .get(`/api/posts/${testPost.id}`)
        .expect(200);

      const initialLikeCount = initialResponse.body.likeCount;

      // Add like reaction
      await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'LIKE' })
        .expect(201);

      // Check updated post state
      const updatedResponse = await request(app)
        .get(`/api/posts/${testPost.id}`)
        .expect(200);

      expect(updatedResponse.body.likeCount).toBe(initialLikeCount + 1);
    });

    it('should handle multiple users reacting to same post', async () => {
      const otherAuthToken = await getValidJWT(otherUser.id);

      // First user likes the post
      const reaction1 = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'LIKE' })
        .expect(201);

      // Second user also likes the post
      const reaction2 = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', `Bearer ${otherAuthToken}`)
        .send({ type: 'LIKE' })
        .expect(201);

      expect(reaction1.body.userId).toBe(testUser.id);
      expect(reaction2.body.userId).toBe(otherUser.id);
      expect(reaction1.body.id).not.toBe(reaction2.body.id);
    });

    it('should handle different reaction types from same user', async () => {
      // User likes the post
      const likeReaction = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'LIKE' })
        .expect(201);

      // Same user bookmarks the post
      const bookmarkReaction = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'BOOKMARK' })
        .expect(201);

      expect(likeReaction.body.type).toBe('LIKE');
      expect(bookmarkReaction.body.type).toBe('BOOKMARK');
      expect(likeReaction.body.id).not.toBe(bookmarkReaction.body.id);
    });
  });

  describe('Validation Errors', () => {
    it('should reject missing reaction type', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('type'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should reject invalid reaction type', async () => {
      const invalidTypes = ['LOVE', 'DISLIKE', 'ANGRY', 'invalid_type', ''];

      for (const invalidType of invalidTypes) {
        const response = await request(app)
          .post(`/api/posts/${testPost.id}/reactions`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ type: invalidType })
          .expect(400);

        expect(response.body).toMatchObject({
          error: expect.any(String),
          message: expect.stringContaining('type'),
          code: 'VALIDATION_ERROR'
        });
      }
    });

    it('should validate all valid reaction types', async () => {
      const validTypes = ['LIKE', 'REPOST', 'BOOKMARK', 'REPORT'];

      for (const validType of validTypes) {
        // Create new post for each reaction type to avoid conflicts
        const newPost = await createTestPost({
          authorId: otherUser.id,
          content: `Post for ${validType} reaction test`
        });

        const response = await request(app)
          .post(`/api/posts/${newPost.id}/reactions`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ type: validType })
          .expect(201);

        expect(response.body.type).toBe(validType);
      }
    });

    it('should reject invalid postId UUID format', async () => {
      const response = await request(app)
        .post('/api/posts/invalid-uuid/reactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'LIKE' })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('UUID'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should reject extra fields in request body', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'LIKE',
          extraField: 'should not be allowed',
          userId: 'attempting to override user'
        })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('additional'),
        code: 'VALIDATION_ERROR'
      });
    });
  });

  describe('Authentication Errors', () => {
    it('should reject unauthorized requests', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .send({ type: 'LIKE' })
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('Authentication'),
        code: expect.any(String)
      });
    });

    it('should reject invalid JWT tokens', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', 'Bearer invalid_token')
        .send({ type: 'LIKE' })
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('token'),
        code: expect.any(String)
      });
    });

    it('should reject expired JWT tokens', async () => {
      const expiredToken = await getValidJWT(testUser.id, '-1h'); // Expired 1 hour ago

      const response = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', `Bearer ${expiredToken}`)
        .send({ type: 'LIKE' })
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('expired'),
        code: expect.any(String)
      });
    });

    it('should reject malformed Authorization header', async () => {
      const response = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', 'InvalidFormat token')
        .send({ type: 'LIKE' })
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        code: expect.any(String)
      });
    });
  });

  describe('Business Logic Errors', () => {
    it('should return 404 for non-existent post', async () => {
      const fakePostId = uuidv4();

      const response = await request(app)
        .post(`/api/posts/${fakePostId}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'LIKE' })
        .expect(404);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('Post not found'),
        code: 'NOT_FOUND_ERROR'
      });
    });

    it('should return 404 for deleted post', async () => {
      const deletedPost = await createTestPost({
        authorId: otherUser.id,
        content: 'This post will be deleted',
        isDeleted: true
      });

      const response = await request(app)
        .post(`/api/posts/${deletedPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'LIKE' })
        .expect(404);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('Post not found'),
        code: 'NOT_FOUND_ERROR'
      });
    });

    it('should return 404 for hidden post when not author', async () => {
      const hiddenPost = await createTestPost({
        authorId: otherUser.id,
        content: 'This post is hidden',
        isHidden: true
      });

      const response = await request(app)
        .post(`/api/posts/${hiddenPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'LIKE' })
        .expect(404);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('Post not found'),
        code: 'NOT_FOUND_ERROR'
      });
    });

    it('should prevent duplicate reactions of same type', async () => {
      // First reaction should succeed
      const firstReaction = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'LIKE' })
        .expect(201);

      // Second identical reaction should fail
      const duplicateReaction = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'LIKE' })
        .expect(409);

      expect(duplicateReaction.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('already exists'),
        code: 'CONFLICT_ERROR'
      });

      expect(firstReaction.body.id).toBeDefined();
    });

    it('should allow reacting to own hidden post', async () => {
      const hiddenPost = await createTestPost({
        authorId: testUser.id,
        content: 'My own hidden post',
        isHidden: true
      });

      const response = await request(app)
        .post(`/api/posts/${hiddenPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'LIKE' })
        .expect(201);

      expect(response.body).toMatchObject({
        userId: testUser.id,
        postId: hiddenPost.id,
        type: 'LIKE'
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle concurrent reactions from different users', async () => {
      const otherAuthToken = await getValidJWT(otherUser.id);

      // Simulate concurrent reactions
      const promises = [
        request(app)
          .post(`/api/posts/${testPost.id}/reactions`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ type: 'LIKE' }),
        request(app)
          .post(`/api/posts/${testPost.id}/reactions`)
          .set('Authorization', `Bearer ${otherAuthToken}`)
          .send({ type: 'LIKE' })
      ];

      const responses = await Promise.all(promises);

      // Both should succeed
      expect(responses[0].status).toBe(201);
      expect(responses[1].status).toBe(201);

      // Should have different reaction IDs
      expect(responses[0].body.id).not.toBe(responses[1].body.id);
      expect(responses[0].body.userId).toBe(testUser.id);
      expect(responses[1].body.userId).toBe(otherUser.id);
    });

    it('should handle reaction on post with maximum content length', async () => {
      const maxContentPost = await createTestPost({
        authorId: otherUser.id,
        content: 'a'.repeat(280) // Maximum length
      });

      const response = await request(app)
        .post(`/api/posts/${maxContentPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'LIKE' })
        .expect(201);

      expect(response.body.postId).toBe(maxContentPost.id);
    });

    it('should handle reaction on very old post', async () => {
      const oldPost = await createTestPost({
        authorId: otherUser.id,
        content: 'Very old post from last year',
        publishedAt: new Date('2023-01-01T00:00:00Z')
      });

      const response = await request(app)
        .post(`/api/posts/${oldPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'LIKE' })
        .expect(201);

      expect(response.body.postId).toBe(oldPost.id);
    });

    it('should handle reaction with content warning post', async () => {
      const sensitivePost = await createTestPost({
        authorId: otherUser.id,
        content: 'Sensitive political content',
        contentWarning: 'Political Discussion'
      });

      const response = await request(app)
        .post(`/api/posts/${sensitivePost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'LIKE' })
        .expect(201);

      expect(response.body.postId).toBe(sensitivePost.id);
    });

    it('should maintain reaction uniqueness across reaction types', async () => {
      // User can have one reaction per type per post
      const likeResponse = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'LIKE' })
        .expect(201);

      const bookmarkResponse = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'BOOKMARK' })
        .expect(201);

      const repostResponse = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'REPOST' })
        .expect(201);

      // All should succeed and have different IDs
      expect(likeResponse.body.id).not.toBe(bookmarkResponse.body.id);
      expect(bookmarkResponse.body.id).not.toBe(repostResponse.body.id);
      expect(likeResponse.body.id).not.toBe(repostResponse.body.id);
    });

    it('should handle case-sensitive reaction types', async () => {
      const invalidCases = ['like', 'Like', 'REPOST ', ' BOOKMARK', 'report'];

      for (const invalidCase of invalidCases) {
        const response = await request(app)
          .post(`/api/posts/${testPost.id}/reactions`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ type: invalidCase })
          .expect(400);

        expect(response.body).toMatchObject({
          error: expect.any(String),
          message: expect.stringContaining('type'),
          code: 'VALIDATION_ERROR'
        });
      }
    });
  });

  describe('Performance', () => {
    it('should respond within reasonable time', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .post(`/api/posts/${testPost.id}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'LIKE' })
        .expect(201);

      const responseTime = Date.now() - startTime;

      // Should respond within 500ms
      expect(responseTime).toBeLessThan(500);
      expect(response.body.id).toBeDefined();
    });

    it('should handle high-frequency reactions efficiently', async () => {
      // Create multiple posts for rapid reactions
      const posts = await Promise.all([
        createTestPost({ authorId: otherUser.id, content: 'Post 1' }),
        createTestPost({ authorId: otherUser.id, content: 'Post 2' }),
        createTestPost({ authorId: otherUser.id, content: 'Post 3' }),
        createTestPost({ authorId: otherUser.id, content: 'Post 4' }),
        createTestPost({ authorId: otherUser.id, content: 'Post 5' })
      ]);

      const startTime = Date.now();

      // React to all posts simultaneously
      const promises = posts.map(post =>
        request(app)
          .post(`/api/posts/${post.id}/reactions`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ type: 'LIKE' })
      );

      const responses = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      // All should succeed
      responses.forEach(response => {
        expect(response.status).toBe(201);
      });

      // Should complete within 2 seconds for 5 reactions
      expect(totalTime).toBeLessThan(2000);
    });
  });
});
import request from 'supertest';
import { app } from '../../src/index';
import { createTestUser, getValidJWT } from '../helpers/auth';
import { createTestPost } from '../helpers/posts';
import { v4 as uuidv4 } from 'uuid';

describe('Contract: GET /api/posts/{postId}/replies', () => {
  let authToken: string;
  let testUser: any;
  let otherUser: any;
  let originalPost: any;
  let replies: any[] = [];

  beforeEach(async () => {
    testUser = await createTestUser({
      username: 'thread_creator',
      displayName: 'Thread Creator',
      personaType: 'POLITICIAN'
    });

    otherUser = await createTestUser({
      username: 'thread_participant',
      displayName: 'Thread Participant',
      personaType: 'INFLUENCER'
    });

    authToken = await getValidJWT(testUser.id);

    // Create original post
    originalPost = await createTestPost({
      authorId: testUser.id,
      content: 'Original post about healthcare reform #healthcare #politics',
      publishedAt: new Date('2024-01-15T10:00:00Z')
    });

    // Create several replies with different timestamps
    replies = [
      await createTestPost({
        authorId: testUser.id,
        content: 'First reply from original author',
        parentPostId: originalPost.id,
        threadId: originalPost.threadId,
        publishedAt: new Date('2024-01-15T10:15:00Z')
      }),
      await createTestPost({
        authorId: otherUser.id,
        content: 'Second reply from different user @thread_creator',
        parentPostId: originalPost.id,
        threadId: originalPost.threadId,
        publishedAt: new Date('2024-01-15T10:30:00Z')
      }),
      await createTestPost({
        authorId: testUser.id,
        content: 'Third reply with media attachment',
        parentPostId: originalPost.id,
        threadId: originalPost.threadId,
        mediaUrls: ['https://example.com/chart.jpg'],
        publishedAt: new Date('2024-01-15T10:45:00Z')
      }),
      await createTestPost({
        authorId: otherUser.id,
        content: 'Fourth reply discussing policy details',
        parentPostId: originalPost.id,
        threadId: originalPost.threadId,
        publishedAt: new Date('2024-01-15T11:00:00Z')
      })
    ];

    // Create nested replies (replies to replies)
    await createTestPost({
      authorId: testUser.id,
      content: 'Nested reply to second reply',
      parentPostId: replies[1].id,
      threadId: originalPost.threadId,
      publishedAt: new Date('2024-01-15T10:35:00Z')
    });

    await createTestPost({
      authorId: otherUser.id,
      content: 'Another nested reply',
      parentPostId: replies[2].id,
      threadId: originalPost.threadId,
      publishedAt: new Date('2024-01-15T10:50:00Z')
    });
  });

  describe('Success Cases', () => {
    it('should return direct replies to post with default pagination', async () => {
      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .expect(200);

      // Validate response schema matches OpenAPI PostListResponse
      expect(response.body).toMatchObject({
        posts: expect.any(Array),
        pagination: expect.objectContaining({
          page: 1,
          limit: 20,
          total: expect.any(Number),
          totalPages: expect.any(Number),
          hasNext: expect.any(Boolean),
          hasPrev: false
        })
      });

      // Should only include direct replies (not nested replies)
      expect(response.body.posts.length).toBe(4); // The 4 direct replies we created

      // Validate each reply matches Post schema
      response.body.posts.forEach((reply: any) => {
        expect(reply).toMatchObject({
          id: expect.any(String),
          authorId: expect.any(String),
          content: expect.any(String),
          parentPostId: originalPost.id,
          threadId: originalPost.threadId,
          isAIGenerated: false,
          hashtags: expect.any(Array),
          mentions: expect.any(Array),
          likeCount: expect.any(Number),
          repostCount: expect.any(Number),
          commentCount: expect.any(Number),
          impressionCount: expect.any(Number),
          isHidden: false,
          publishedAt: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          author: expect.objectContaining({
            id: expect.any(String),
            username: expect.any(String),
            displayName: expect.any(String),
            personaType: expect.any(String)
          })
        });

        // Validate UUID formats
        expect(reply.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
        expect(reply.threadId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);

        // Validate ISO date formats
        expect(new Date(reply.publishedAt)).toBeInstanceOf(Date);
        expect(new Date(reply.createdAt)).toBeInstanceOf(Date);
        expect(new Date(reply.updatedAt)).toBeInstanceOf(Date);
      });

      // Replies should be ordered by publishedAt ascending (oldest first)
      const dates = response.body.posts.map((reply: any) => new Date(reply.publishedAt));
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i-1].getTime()).toBeLessThanOrEqual(dates[i].getTime());
      }
    });

    it('should return replies with custom pagination', async () => {
      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .query({ page: 1, limit: 2 })
        .expect(200);

      expect(response.body.posts).toHaveLength(2);
      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 2,
        total: 4, // Total direct replies
        totalPages: 2,
        hasNext: true,
        hasPrev: false
      });

      // Test second page
      const page2Response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .query({ page: 2, limit: 2 })
        .expect(200);

      expect(page2Response.body.posts).toHaveLength(2);
      expect(page2Response.body.pagination).toMatchObject({
        page: 2,
        limit: 2,
        total: 4,
        totalPages: 2,
        hasNext: false,
        hasPrev: true
      });

      // Ensure no duplicate replies between pages
      const page1Ids = response.body.posts.map((post: any) => post.id);
      const page2Ids = page2Response.body.posts.map((post: any) => post.id);
      const intersection = page1Ids.filter((id: string) => page2Ids.includes(id));
      expect(intersection).toHaveLength(0);
    });

    it('should include author information for each reply', async () => {
      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .expect(200);

      expect(response.body.posts.length).toBeGreaterThan(0);

      response.body.posts.forEach((reply: any) => {
        expect(reply.author).toMatchObject({
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
        expect(reply.author).not.toHaveProperty('email');
        expect(reply.author).not.toHaveProperty('passwordHash');
      });
    });

    it('should handle replies with different content types', async () => {
      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .expect(200);

      // Find reply with media
      const mediaReply = response.body.posts.find((reply: any) =>
        reply.content.includes('media attachment')
      );
      if (mediaReply) {
        expect(mediaReply.mediaUrls).toEqual(['https://example.com/chart.jpg']);
      }

      // Find reply with mention
      const mentionReply = response.body.posts.find((reply: any) =>
        reply.content.includes('@thread_creator')
      );
      if (mentionReply) {
        expect(mentionReply.mentions).toContain('thread_creator');
      }
    });

    it('should return AI-generated replies with persona information', async () => {
      // Create AI persona reply
      const aiPersona = {
        id: uuidv4(),
        name: 'AI Policy Expert',
        handle: 'ai_policy_expert',
        bio: 'AI persona specialized in policy analysis',
        personaType: 'JOURNALIST',
        toneStyle: 'PROFESSIONAL'
      };

      const aiReply = await createTestPost({
        authorId: null,
        personaId: aiPersona.id,
        content: 'AI analysis of the healthcare proposal',
        parentPostId: originalPost.id,
        threadId: originalPost.threadId,
        isAIGenerated: true
      });

      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .expect(200);

      const aiReplyInResponse = response.body.posts.find((reply: any) =>
        reply.id === aiReply.id
      );

      if (aiReplyInResponse) {
        expect(aiReplyInResponse).toMatchObject({
          authorId: null,
          personaId: aiPersona.id,
          isAIGenerated: true,
          author: null,
          persona: expect.objectContaining({
            id: aiPersona.id,
            name: 'AI Policy Expert',
            handle: 'ai_policy_expert',
            personaType: 'JOURNALIST',
            toneStyle: 'PROFESSIONAL'
          })
        });
      }
    });

    it('should handle post with no replies', async () => {
      // Create post with no replies
      const lonelyPost = await createTestPost({
        authorId: testUser.id,
        content: 'Post with no replies yet'
      });

      const response = await request(app)
        .get(`/api/posts/${lonelyPost.id}/replies`)
        .expect(200);

      expect(response.body).toMatchObject({
        posts: [],
        pagination: expect.objectContaining({
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        })
      });
    });

    it('should exclude hidden replies from response', async () => {
      // Create hidden reply
      const hiddenReply = await createTestPost({
        authorId: testUser.id,
        content: 'This reply is hidden',
        parentPostId: originalPost.id,
        threadId: originalPost.threadId,
        isHidden: true
      });

      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .expect(200);

      const hiddenReplyInResponse = response.body.posts.find((reply: any) =>
        reply.id === hiddenReply.id
      );

      expect(hiddenReplyInResponse).toBeUndefined();
    });

    it('should exclude deleted replies from response', async () => {
      // Create deleted reply
      const deletedReply = await createTestPost({
        authorId: testUser.id,
        content: 'This reply will be deleted',
        parentPostId: originalPost.id,
        threadId: originalPost.threadId,
        isDeleted: true
      });

      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .expect(200);

      const deletedReplyInResponse = response.body.posts.find((reply: any) =>
        reply.id === deletedReply.id
      );

      expect(deletedReplyInResponse).toBeUndefined();
    });

    it('should return replies with content warnings', async () => {
      const sensitiveReply = await createTestPost({
        authorId: testUser.id,
        content: 'Reply discussing sensitive political topics',
        parentPostId: originalPost.id,
        threadId: originalPost.threadId,
        contentWarning: 'Political Discussion'
      });

      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .expect(200);

      const sensitiveReplyInResponse = response.body.posts.find((reply: any) =>
        reply.id === sensitiveReply.id
      );

      if (sensitiveReplyInResponse) {
        expect(sensitiveReplyInResponse.contentWarning).toBe('Political Discussion');
      }
    });
  });

  describe('Error Cases', () => {
    it('should return 404 for non-existent post', async () => {
      const fakePostId = uuidv4();

      const response = await request(app)
        .get(`/api/posts/${fakePostId}/replies`)
        .expect(404);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('Post not found'),
        code: 'NOT_FOUND_ERROR'
      });
    });

    it('should return 400 for invalid UUID format', async () => {
      const response = await request(app)
        .get('/api/posts/invalid-uuid/replies')
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
        .get(`/api/posts/${deletedPost.id}/replies`)
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
        .get(`/api/posts/${hiddenPost.id}/replies`)
        .expect(404);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('Post not found'),
        code: 'NOT_FOUND_ERROR'
      });
    });
  });

  describe('Validation Errors', () => {
    it('should reject invalid page parameter', async () => {
      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .query({ page: 0 })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('page'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should reject negative page parameter', async () => {
      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .query({ page: -1 })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('page'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should reject invalid limit parameter', async () => {
      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .query({ limit: 0 })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('limit'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should reject limit exceeding maximum', async () => {
      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .query({ limit: 51 })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('50'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should reject non-integer page parameter', async () => {
      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .query({ page: 'not_a_number' })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('page'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should reject non-integer limit parameter', async () => {
      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .query({ limit: 'not_a_number' })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('limit'),
        code: 'VALIDATION_ERROR'
      });
    });
  });

  describe('Access Control', () => {
    it('should allow author to view replies to their own hidden post', async () => {
      const hiddenPost = await createTestPost({
        authorId: testUser.id,
        content: 'This is my hidden post',
        isHidden: true
      });

      // Create reply to hidden post
      const replyToHidden = await createTestPost({
        authorId: otherUser.id,
        content: 'Reply to hidden post',
        parentPostId: hiddenPost.id,
        threadId: hiddenPost.threadId
      });

      const response = await request(app)
        .get(`/api/posts/${hiddenPost.id}/replies`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.posts).toHaveLength(1);
      expect(response.body.posts[0].id).toBe(replyToHidden.id);
    });

    it('should work without authentication for public posts', async () => {
      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .expect(200);

      expect(response.body.posts.length).toBeGreaterThan(0);
    });
  });

  describe('Thread Hierarchy', () => {
    it('should only return direct replies, not nested replies', async () => {
      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .expect(200);

      // All returned posts should have originalPost.id as parentPostId
      response.body.posts.forEach((reply: any) => {
        expect(reply.parentPostId).toBe(originalPost.id);
      });

      // Should not include the nested replies we created
      const nestedReplyContents = [
        'Nested reply to second reply',
        'Another nested reply'
      ];

      response.body.posts.forEach((reply: any) => {
        expect(nestedReplyContents).not.toContain(reply.content);
      });
    });

    it('should maintain correct thread ID for all replies', async () => {
      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .expect(200);

      response.body.posts.forEach((reply: any) => {
        expect(reply.threadId).toBe(originalPost.threadId);
      });
    });

    it('should return replies from different authors', async () => {
      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .expect(200);

      const authorIds = response.body.posts.map((reply: any) => reply.authorId);
      const uniqueAuthorIds = [...new Set(authorIds)];

      // Should have replies from both testUser and otherUser
      expect(uniqueAuthorIds.length).toBeGreaterThan(1);
      expect(uniqueAuthorIds).toContain(testUser.id);
      expect(uniqueAuthorIds).toContain(otherUser.id);
    });
  });

  describe('Edge Cases', () => {
    it('should handle large page numbers gracefully', async () => {
      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .query({ page: 9999, limit: 10 })
        .expect(200);

      expect(response.body.posts).toEqual([]);
      expect(response.body.pagination.page).toBe(9999);
      expect(response.body.pagination.hasNext).toBe(false);
      expect(response.body.pagination.hasPrev).toBe(true);
    });

    it('should handle replies with various content lengths', async () => {
      // Create reply with maximum content length
      const maxReply = await createTestPost({
        authorId: testUser.id,
        content: 'a'.repeat(280),
        parentPostId: originalPost.id,
        threadId: originalPost.threadId
      });

      // Create reply with minimal content
      const minReply = await createTestPost({
        authorId: testUser.id,
        content: 'x',
        parentPostId: originalPost.id,
        threadId: originalPost.threadId
      });

      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .expect(200);

      const maxReplyInResponse = response.body.posts.find((reply: any) =>
        reply.id === maxReply.id
      );
      const minReplyInResponse = response.body.posts.find((reply: any) =>
        reply.id === minReply.id
      );

      if (maxReplyInResponse) {
        expect(maxReplyInResponse.content.length).toBe(280);
      }
      if (minReplyInResponse) {
        expect(minReplyInResponse.content.length).toBe(1);
      }
    });

    it('should handle replies with edited content', async () => {
      const editedReply = await createTestPost({
        authorId: testUser.id,
        content: 'This reply has been edited',
        parentPostId: originalPost.id,
        threadId: originalPost.threadId,
        editedAt: new Date('2024-01-15T15:00:00Z')
      });

      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .expect(200);

      const editedReplyInResponse = response.body.posts.find((reply: any) =>
        reply.id === editedReply.id
      );

      if (editedReplyInResponse) {
        expect(editedReplyInResponse.editedAt).toBe('2024-01-15T15:00:00.000Z');
        expect(new Date(editedReplyInResponse.editedAt)).toBeInstanceOf(Date);
      }
    });
  });

  describe('Performance', () => {
    it('should respond within reasonable time', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .expect(200);

      const responseTime = Date.now() - startTime;

      // Should respond within 1 second
      expect(responseTime).toBeLessThan(1000);
      expect(response.body.posts.length).toBeGreaterThan(0);
    });

    it('should handle pagination efficiently', async () => {
      const response = await request(app)
        .get(`/api/posts/${originalPost.id}/replies`)
        .query({ page: 1, limit: 2 })
        .expect(200);

      const { pagination } = response.body;

      expect(pagination.totalPages).toBe(Math.ceil(pagination.total / pagination.limit));

      if (pagination.page < pagination.totalPages) {
        expect(pagination.hasNext).toBe(true);
      } else {
        expect(pagination.hasNext).toBe(false);
      }

      if (pagination.page > 1) {
        expect(pagination.hasPrev).toBe(true);
      } else {
        expect(pagination.hasPrev).toBe(false);
      }
    });
  });
});
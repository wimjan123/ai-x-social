import request from 'supertest';
import { app } from '../../src/index';
import { createTestUser, getValidJWT } from '../helpers/auth';
import { createTestPost } from '../helpers/posts';
import { v4 as uuidv4 } from 'uuid';

describe('Contract: GET /api/posts', () => {
  let authToken: string;
  let testUser: any;
  let testPosts: any[] = [];

  beforeEach(async () => {
    testUser = await createTestUser({
      username: 'timeline_user',
      displayName: 'Timeline User',
      personaType: 'POLITICIAN'
    });
    authToken = await getValidJWT(testUser.id);

    // Create test posts with different categories and content
    testPosts = [
      await createTestPost({
        authorId: testUser.id,
        content: 'Political post about healthcare #healthcare #politics',
        category: 'politics',
        publishedAt: new Date('2024-01-15T10:00:00Z')
      }),
      await createTestPost({
        authorId: testUser.id,
        content: 'Technology discussion about AI #ai #technology',
        category: 'technology',
        publishedAt: new Date('2024-01-15T11:00:00Z')
      }),
      await createTestPost({
        authorId: testUser.id,
        content: 'Entertainment news about movies #movies #entertainment',
        category: 'entertainment',
        publishedAt: new Date('2024-01-15T12:00:00Z')
      }),
      await createTestPost({
        authorId: testUser.id,
        content: 'Sports update about football #football #sports',
        category: 'sports',
        publishedAt: new Date('2024-01-15T13:00:00Z')
      })
    ];
  });

  describe('Success Cases', () => {
    it('should return public timeline posts with default pagination', async () => {
      const response = await request(app)
        .get('/api/posts')
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

      // Validate each post matches Post schema
      response.body.posts.forEach((post: any) => {
        expect(post).toMatchObject({
          id: expect.any(String),
          authorId: expect.any(String),
          content: expect.any(String),
          mediaUrls: expect.any(Array),
          threadId: expect.any(String),
          parentPostId: expect.any(Boolean) ? null : expect.any(String),
          repostOfId: expect.any(Boolean) ? null : expect.any(String),
          isAIGenerated: expect.any(Boolean),
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
        expect(post.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
        expect(post.threadId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);

        // Validate ISO date formats
        expect(new Date(post.publishedAt)).toBeInstanceOf(Date);
        expect(new Date(post.createdAt)).toBeInstanceOf(Date);
        expect(new Date(post.updatedAt)).toBeInstanceOf(Date);
      });

      // Posts should be ordered by publishedAt descending (newest first)
      const dates = response.body.posts.map((post: any) => new Date(post.publishedAt));
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i-1]).toBeInstanceOf(Date);
        expect(dates[i]).toBeInstanceOf(Date);
        expect(dates[i-1].getTime()).toBeGreaterThanOrEqual(dates[i].getTime());
      }
    });

    it('should return posts with custom pagination', async () => {
      const response = await request(app)
        .get('/api/posts')
        .query({ page: 1, limit: 2 })
        .expect(200);

      expect(response.body.posts).toHaveLength(2);
      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 2,
        total: expect.any(Number),
        totalPages: expect.any(Number),
        hasNext: expect.any(Boolean),
        hasPrev: false
      });

      // Test second page
      const page2Response = await request(app)
        .get('/api/posts')
        .query({ page: 2, limit: 2 })
        .expect(200);

      expect(page2Response.body.pagination.page).toBe(2);
      expect(page2Response.body.pagination.hasPrev).toBe(true);

      // Ensure no duplicate posts between pages
      const page1Ids = response.body.posts.map((post: any) => post.id);
      const page2Ids = page2Response.body.posts.map((post: any) => post.id);
      const intersection = page1Ids.filter((id: string) => page2Ids.includes(id));
      expect(intersection).toHaveLength(0);
    });

    it('should filter posts by category', async () => {
      // Test politics category
      const politicsResponse = await request(app)
        .get('/api/posts')
        .query({ category: 'politics' })
        .expect(200);

      politicsResponse.body.posts.forEach((post: any) => {
        expect(post.content.toLowerCase()).toMatch(/(politics|political|healthcare)/);
      });

      // Test technology category
      const techResponse = await request(app)
        .get('/api/posts')
        .query({ category: 'technology' })
        .expect(200);

      techResponse.body.posts.forEach((post: any) => {
        expect(post.content.toLowerCase()).toMatch(/(technology|tech|ai)/);
      });

      // Test entertainment category
      const entertainmentResponse = await request(app)
        .get('/api/posts')
        .query({ category: 'entertainment' })
        .expect(200);

      entertainmentResponse.body.posts.forEach((post: any) => {
        expect(post.content.toLowerCase()).toMatch(/(entertainment|movies|films)/);
      });

      // Test sports category
      const sportsResponse = await request(app)
        .get('/api/posts')
        .query({ category: 'sports' })
        .expect(200);

      sportsResponse.body.posts.forEach((post: any) => {
        expect(post.content.toLowerCase()).toMatch(/(sports|football|game)/);
      });
    });

    it('should return all posts with category "all"', async () => {
      const allResponse = await request(app)
        .get('/api/posts')
        .query({ category: 'all' })
        .expect(200);

      const noCategoryResponse = await request(app)
        .get('/api/posts')
        .expect(200);

      // Should return same results as no category filter
      expect(allResponse.body.posts.length).toBe(noCategoryResponse.body.posts.length);
    });

    it('should include author information in posts', async () => {
      const response = await request(app)
        .get('/api/posts')
        .query({ limit: 1 })
        .expect(200);

      expect(response.body.posts).toHaveLength(1);
      const post = response.body.posts[0];

      expect(post.author).toMatchObject({
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
      expect(post.author).not.toHaveProperty('email');
      expect(post.author).not.toHaveProperty('passwordHash');
    });

    it('should include persona information when post is AI-generated', async () => {
      // Create AI-generated post
      const aiPost = await createTestPost({
        authorId: null,
        personaId: uuidv4(),
        content: 'AI-generated political commentary',
        isAIGenerated: true
      });

      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      const aiPostInResponse = response.body.posts.find((post: any) =>
        post.id === aiPost.id
      );

      if (aiPostInResponse) {
        expect(aiPostInResponse.isAIGenerated).toBe(true);
        expect(aiPostInResponse.persona).toMatchObject({
          id: expect.any(String),
          name: expect.any(String),
          handle: expect.any(String),
          bio: expect.any(String),
          personaType: expect.any(String),
          isActive: expect.any(Boolean)
        });
        expect(aiPostInResponse.authorId).toBeNull();
      }
    });

    it('should handle empty result set gracefully', async () => {
      // Clear all posts or filter by non-existent category
      const response = await request(app)
        .get('/api/posts')
        .query({ category: 'nonexistent' })
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

    it('should include content warning in posts', async () => {
      // Create post with content warning
      const sensitivePost = await createTestPost({
        authorId: testUser.id,
        content: 'Discussing sensitive political topics',
        contentWarning: 'Political Discussion'
      });

      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      const postWithWarning = response.body.posts.find((post: any) =>
        post.id === sensitivePost.id
      );

      if (postWithWarning) {
        expect(postWithWarning.contentWarning).toBe('Political Discussion');
      }
    });
  });

  describe('Validation Errors', () => {
    it('should reject invalid page parameter', async () => {
      const response = await request(app)
        .get('/api/posts')
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
        .get('/api/posts')
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
        .get('/api/posts')
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
        .get('/api/posts')
        .query({ limit: 51 })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('50'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should reject invalid category', async () => {
      const response = await request(app)
        .get('/api/posts')
        .query({ category: 'invalid_category' })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('category'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should reject non-integer page parameter', async () => {
      const response = await request(app)
        .get('/api/posts')
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
        .get('/api/posts')
        .query({ limit: 'not_a_number' })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('limit'),
        code: 'VALIDATION_ERROR'
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle large page numbers gracefully', async () => {
      const response = await request(app)
        .get('/api/posts')
        .query({ page: 9999, limit: 10 })
        .expect(200);

      expect(response.body.posts).toEqual([]);
      expect(response.body.pagination.page).toBe(9999);
      expect(response.body.pagination.hasNext).toBe(false);
      expect(response.body.pagination.hasPrev).toBe(true);
    });

    it('should handle posts with no hashtags or mentions', async () => {
      const plainPost = await createTestPost({
        authorId: testUser.id,
        content: 'Just a plain post with no special formatting'
      });

      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      const postInResponse = response.body.posts.find((post: any) =>
        post.id === plainPost.id
      );

      if (postInResponse) {
        expect(postInResponse.hashtags).toEqual([]);
        expect(postInResponse.mentions).toEqual([]);
      }
    });

    it('should handle posts with media URLs', async () => {
      const mediaPost = await createTestPost({
        authorId: testUser.id,
        content: 'Post with media attachments',
        mediaUrls: [
          'https://example.com/image1.jpg',
          'https://example.com/video1.mp4'
        ]
      });

      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      const postInResponse = response.body.posts.find((post: any) =>
        post.id === mediaPost.id
      );

      if (postInResponse) {
        expect(postInResponse.mediaUrls).toEqual([
          'https://example.com/image1.jpg',
          'https://example.com/video1.mp4'
        ]);
      }
    });

    it('should not include hidden posts in public timeline', async () => {
      const hiddenPost = await createTestPost({
        authorId: testUser.id,
        content: 'This post should be hidden',
        isHidden: true
      });

      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      const hiddenPostInResponse = response.body.posts.find((post: any) =>
        post.id === hiddenPost.id
      );

      expect(hiddenPostInResponse).toBeUndefined();
    });

    it('should handle posts with thread relationships', async () => {
      // Create original post
      const originalPost = await createTestPost({
        authorId: testUser.id,
        content: 'Original post for thread testing'
      });

      // Create reply
      const replyPost = await createTestPost({
        authorId: testUser.id,
        content: 'Reply to original post',
        parentPostId: originalPost.id,
        threadId: originalPost.threadId
      });

      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      const originalInResponse = response.body.posts.find((post: any) =>
        post.id === originalPost.id
      );
      const replyInResponse = response.body.posts.find((post: any) =>
        post.id === replyPost.id
      );

      if (originalInResponse) {
        expect(originalInResponse.parentPostId).toBeNull();
        expect(originalInResponse.threadId).toBe(originalPost.id);
      }

      if (replyInResponse) {
        expect(replyInResponse.parentPostId).toBe(originalPost.id);
        expect(replyInResponse.threadId).toBe(originalPost.threadId);
      }
    });
  });

  describe('Performance', () => {
    it('should respond within reasonable time for large datasets', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get('/api/posts')
        .query({ limit: 50 })
        .expect(200);

      const responseTime = Date.now() - startTime;

      // Should respond within 2 seconds
      expect(responseTime).toBeLessThan(2000);
      expect(response.body.posts.length).toBeLessThanOrEqual(50);
    });

    it('should include proper pagination metadata for navigation', async () => {
      const response = await request(app)
        .get('/api/posts')
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
import request from 'supertest';
import { app } from '../../src/index';
import { createTestUser, getValidJWT } from '../helpers/auth';
import { v4 as uuidv4 } from 'uuid';

describe('Contract: POST /api/posts', () => {
  let authToken: string;
  let testUser: any;
  let testNewsItem: any;

  beforeEach(async () => {
    testUser = await createTestUser({
      username: 'post_creator',
      displayName: 'Post Creator',
      personaType: 'POLITICIAN'
    });
    authToken = await getValidJWT(testUser.id);

    // Create test news item for reference
    testNewsItem = {
      id: uuidv4(),
      title: 'Breaking: Political Reform Bill Passes',
      description: 'New legislation approved',
      url: 'https://news.example.com/reform-bill'
    };
  });

  describe('Success Cases', () => {
    it('should create basic post with valid content', async () => {
      const postData = {
        content: 'This is a test post about political reform #reform #politics',
        mediaUrls: [],
        contentWarning: null
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)
        .expect(201);

      // Validate response schema matches OpenAPI Post schema
      expect(response.body).toMatchObject({
        id: expect.any(String),
        authorId: testUser.id,
        personaId: null,
        content: postData.content,
        mediaUrls: [],
        threadId: expect.any(String),
        parentPostId: null,
        repostOfId: null,
        isAIGenerated: false,
        hashtags: ['reform', 'politics'],
        mentions: [],
        newsItemId: null,
        likeCount: 0,
        repostCount: 0,
        commentCount: 0,
        impressionCount: 0,
        contentWarning: null,
        isHidden: false,
        publishedAt: expect.any(String),
        editedAt: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        author: expect.objectContaining({
          id: testUser.id,
          username: 'post_creator',
          displayName: 'Post Creator'
        }),
        persona: null
      });

      // Validate UUID format for IDs
      expect(response.body.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      expect(response.body.threadId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);

      // Validate ISO date formats
      expect(new Date(response.body.publishedAt)).toBeInstanceOf(Date);
      expect(new Date(response.body.createdAt)).toBeInstanceOf(Date);
      expect(new Date(response.body.updatedAt)).toBeInstanceOf(Date);
    });

    it('should create post with media URLs', async () => {
      const postData = {
        content: 'Check out these campaign photos!',
        mediaUrls: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.png',
          'https://example.com/video1.mp4'
        ]
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)
        .expect(201);

      expect(response.body.mediaUrls).toEqual(postData.mediaUrls);
      expect(response.body.mediaUrls).toHaveLength(3);
    });

    it('should create post with content warning', async () => {
      const postData = {
        content: 'Discussion about sensitive political topics',
        contentWarning: 'Political Discussion'
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)
        .expect(201);

      expect(response.body.contentWarning).toBe('Political Discussion');
    });

    it('should create reply post with parentPostId', async () => {
      // First create original post
      const originalResponse = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Original post about healthcare' })
        .expect(201);

      const replyData = {
        content: 'Great point about healthcare reform!',
        parentPostId: originalResponse.body.id
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(replyData)
        .expect(201);

      expect(response.body.parentPostId).toBe(originalResponse.body.id);
      expect(response.body.threadId).toBe(originalResponse.body.threadId);
    });

    it('should create repost with repostOfId', async () => {
      // First create original post
      const originalResponse = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Original post to be reposted' })
        .expect(201);

      const repostData = {
        content: 'Sharing this important message',
        repostOfId: originalResponse.body.id
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(repostData)
        .expect(201);

      expect(response.body.repostOfId).toBe(originalResponse.body.id);
    });

    it('should create post with news item reference', async () => {
      const postData = {
        content: 'My thoughts on this breaking news',
        newsItemId: testNewsItem.id
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)
        .expect(201);

      expect(response.body.newsItemId).toBe(testNewsItem.id);
    });
  });

  describe('Content Processing', () => {
    it('should extract hashtags from content', async () => {
      const testCases = [
        {
          content: 'Testing #politics #reform #democracy',
          expected: ['politics', 'reform', 'democracy']
        },
        {
          content: 'No hashtags here',
          expected: []
        },
        {
          content: '#SingleHashtag only',
          expected: ['SingleHashtag']
        },
        {
          content: 'Mixed #Content with #multiple #hashtags #everywhere',
          expected: ['Content', 'multiple', 'hashtags', 'everywhere']
        }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/posts')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ content: testCase.content })
          .expect(201);

        expect(response.body.hashtags).toEqual(testCase.expected);
      }
    });

    it('should extract mentions from content', async () => {
      const testCases = [
        {
          content: 'Hello @johndoe and @jane_smith!',
          expected: ['johndoe', 'jane_smith']
        },
        {
          content: 'No mentions here',
          expected: []
        },
        {
          content: '@single_mention only',
          expected: ['single_mention']
        },
        {
          content: 'Hey @user123, check this @another_user @third_user',
          expected: ['user123', 'another_user', 'third_user']
        }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/posts')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ content: testCase.content })
          .expect(201);

        expect(response.body.mentions).toEqual(testCase.expected);
      }
    });

    it('should handle mixed hashtags and mentions', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Great discussion @johndoe about #politics and #reform with @jane_doe'
        })
        .expect(201);

      expect(response.body.hashtags).toEqual(['politics', 'reform']);
      expect(response.body.mentions).toEqual(['johndoe', 'jane_doe']);
    });
  });

  describe('Validation Errors', () => {
    it('should reject empty content', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: '' })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('content'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should reject missing content field', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('content'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should enforce 280 character limit', async () => {
      const longContent = 'a'.repeat(281);

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: longContent })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('280'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should accept exactly 280 characters', async () => {
      const maxContent = 'a'.repeat(280);

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: maxContent })
        .expect(201);

      expect(response.body.content).toBe(maxContent);
    });

    it('should reject more than 4 media URLs', async () => {
      const tooManyUrls = [
        'https://example.com/1.jpg',
        'https://example.com/2.jpg',
        'https://example.com/3.jpg',
        'https://example.com/4.jpg',
        'https://example.com/5.jpg'
      ];

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Post with too many media URLs',
          mediaUrls: tooManyUrls
        })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('4'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should validate media URL format', async () => {
      const invalidUrls = [
        'not-a-url',
        'ftp://invalid-protocol.com/file.jpg',
        'javascript:alert("xss")'
      ];

      for (const invalidUrl of invalidUrls) {
        const response = await request(app)
          .post('/api/posts')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            content: 'Post with invalid URL',
            mediaUrls: [invalidUrl]
          })
          .expect(400);

        expect(response.body).toMatchObject({
          error: expect.any(String),
          message: expect.stringContaining('URL'),
          code: 'VALIDATION_ERROR'
        });
      }
    });

    it('should validate parentPostId is valid UUID', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Reply to invalid post',
          parentPostId: 'invalid-uuid'
        })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('UUID'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should validate repostOfId is valid UUID', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Repost of invalid post',
          repostOfId: 'invalid-uuid'
        })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('UUID'),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should validate newsItemId is valid UUID', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Comment on invalid news',
          newsItemId: 'invalid-uuid'
        })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('UUID'),
        code: 'VALIDATION_ERROR'
      });
    });
  });

  describe('Authentication', () => {
    it('should reject unauthorized requests', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({ content: 'Unauthorized post' })
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('Authentication'),
        code: expect.any(String)
      });
    });

    it('should reject invalid JWT tokens', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', 'Bearer invalid_token')
        .send({ content: 'Post with invalid token' })
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
        .post('/api/posts')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send({ content: 'Post with expired token' })
        .expect(401);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('expired'),
        code: expect.any(String)
      });
    });
  });

  describe('Business Logic', () => {
    it('should not allow reply to non-existent post', async () => {
      const fakePostId = uuidv4();

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Reply to non-existent post',
          parentPostId: fakePostId
        })
        .expect(404);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('Post not found'),
        code: 'NOT_FOUND_ERROR'
      });
    });

    it('should not allow repost of non-existent post', async () => {
      const fakePostId = uuidv4();

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Repost of non-existent post',
          repostOfId: fakePostId
        })
        .expect(404);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('Post not found'),
        code: 'NOT_FOUND_ERROR'
      });
    });

    it('should not allow reference to non-existent news item', async () => {
      const fakeNewsId = uuidv4();

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Comment on non-existent news',
          newsItemId: fakeNewsId
        })
        .expect(404);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.stringContaining('News item not found'),
        code: 'NOT_FOUND_ERROR'
      });
    });

    it('should set correct initial counts', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'New post for count testing' })
        .expect(201);

      expect(response.body.likeCount).toBe(0);
      expect(response.body.repostCount).toBe(0);
      expect(response.body.commentCount).toBe(0);
      expect(response.body.impressionCount).toBe(0);
    });

    it('should create unique threadId for root posts', async () => {
      const response1 = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'First root post' })
        .expect(201);

      const response2 = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Second root post' })
        .expect(201);

      expect(response1.body.threadId).not.toBe(response2.body.threadId);
      expect(response1.body.threadId).toBe(response1.body.id);
      expect(response2.body.threadId).toBe(response2.body.id);
    });
  });
});
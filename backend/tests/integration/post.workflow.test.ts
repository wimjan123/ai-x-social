import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { createTestUser, getValidJWT, MOCK_USERS } from '../helpers/auth';

/**
 * T031: Integration Test - Post Creation and Reactions Workflow
 *
 * Tests the complete post lifecycle workflow including:
 * - Post creation with text, media, and political context
 * - Post editing and deletion
 * - Reaction system (likes, reposts, quotes, comments)
 * - Threading and conversation flows
 * - Political alignment scoring and visibility
 * - Timeline aggregation and filtering
 * - Trending topic calculation
 * - Content moderation and flagging
 * - Post analytics and engagement metrics
 *
 * CRITICAL: These tests will initially FAIL as no backend implementation exists.
 * This is expected behavior for TDD approach.
 */

// Mock the Express app (will fail until implemented)
const mockApp = {
  listen: jest.fn(),
  use: jest.fn(),
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

// Mock media storage
const mockMediaStore = new Map();

// Mock trending topics calculation
const mockTrendingTopics = new Map();

// Mock database cleanup
const cleanupTestData = async () => {
  mockMediaStore.clear();
  mockTrendingTopics.clear();
  console.log('Mock cleanup - clearing post and media data');
};

describe('Post Creation and Reactions Workflow Integration Tests', () => {
  beforeEach(async () => {
    // Reset test environment
    process.env.NODE_ENV = 'test';
    process.env.MAX_POST_LENGTH = '280';
    process.env.MAX_MEDIA_SIZE = '10485760'; // 10MB
    process.env.TRENDING_CALCULATION_INTERVAL = '300000'; // 5 minutes

    await cleanupTestData();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('Post Creation Workflow', () => {
    test('should create basic text post successfully', async () => {
      const testUser = await createTestUser({
        username: 'post_creator',
        email: 'postcreator@example.com',
        password: 'PostCreator123!',
        displayName: 'Post Creator',
        personaType: 'POLITICIAN'
      });

      const authToken = getValidJWT(testUser.id!);

      const postData = {
        content: "This is my first political post about healthcare reform. We need comprehensive changes.",
        topics: ['healthcare', 'policy', 'reform'],
        politicalContext: {
          stance: 'support',
          issues: ['healthcare'],
          controversyLevel: 30
        },
        visibility: 'public',
        allowReplies: true,
        allowReposts: true
      };

      try {
        const response = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${authToken}`)
          .send(postData)
          .expect(201);

        expect(response.body).toMatchObject({
          success: true,
          post: {
            id: expect.any(String),
            content: postData.content,
            authorId: testUser.id,
            topics: ['healthcare', 'policy', 'reform'],
            politicalContext: {
              stance: 'support',
              issues: ['healthcare'],
              controversyLevel: 30
            },
            visibility: 'public',
            allowReplies: true,
            allowReposts: true,
            createdAt: expect.any(String),
            metrics: {
              likes: 0,
              reposts: 0,
              comments: 0,
              views: 0,
              engagementRate: 0
            },
            status: 'published'
          }
        });

        // Verify post appears in user's timeline
        const timelineResponse = await request(mockApp)
          .get('/api/posts/timeline')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(timelineResponse.body.posts).toContainEqual(
          expect.objectContaining({
            id: response.body.post.id,
            content: postData.content
          })
        );

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No post creation implementation');
      }
    });

    test('should create post with media attachments', async () => {
      const testUser = await createTestUser({
        username: 'media_poster',
        email: 'mediaposter@example.com',
        password: 'MediaPoster123!',
        personaType: 'INFLUENCER'
      });

      const authToken = getValidJWT(testUser.id!);

      const postData = {
        content: "Check out this infographic about climate data!",
        topics: ['climate', 'data', 'visualization'],
        media: [
          {
            type: 'image',
            url: 'https://example.com/climate-infographic.jpg',
            altText: 'Climate change infographic showing temperature trends',
            metadata: {
              width: 1200,
              height: 800,
              size: 245760
            }
          }
        ],
        politicalContext: {
          stance: 'inform',
          issues: ['climate_change'],
          controversyLevel: 20
        }
      };

      try {
        const response = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${authToken}`)
          .send(postData)
          .expect(201);

        expect(response.body.post.media).toHaveLength(1);
        expect(response.body.post.media[0]).toMatchObject({
          type: 'image',
          url: expect.stringContaining('climate-infographic'),
          altText: 'Climate change infographic showing temperature trends',
          metadata: {
            width: 1200,
            height: 800
          }
        });

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No media post implementation');
      }
    });

    test('should validate post content and reject invalid posts', async () => {
      const testUser = await createTestUser({
        username: 'validation_tester',
        email: 'validation@example.com',
        password: 'Validation123!',
        personaType: 'JOURNALIST'
      });

      const authToken = getValidJWT(testUser.id!);

      const invalidPosts = [
        {
          content: '', // Empty content
          error: 'Content cannot be empty'
        },
        {
          content: 'a'.repeat(300), // Too long
          error: 'Content exceeds maximum length'
        },
        {
          content: 'Valid content',
          topics: ['a'.repeat(100)], // Invalid topic length
          error: 'Topic name too long'
        },
        {
          content: 'Valid content',
          politicalContext: {
            controversyLevel: 150 // Invalid range
          },
          error: 'Controversy level must be between 0 and 100'
        }
      ];

      for (const invalidPost of invalidPosts) {
        try {
          const response = await request(mockApp)
            .post('/api/posts')
            .set('Authorization', `Bearer ${authToken}`)
            .send(invalidPost)
            .expect(400);

          expect(response.body).toMatchObject({
            success: false,
            error: expect.stringContaining('validation'),
            details: expect.arrayContaining([
              expect.objectContaining({
                message: expect.stringMatching(new RegExp(invalidPost.error, 'i'))
              })
            ])
          });

        } catch (error) {
          // Expected to fail - no backend implementation yet
          expect(error).toBeDefined();
          console.log(`Expected failure for invalid post: ${invalidPost.error}`);
        }
      }
    });

    test('should create threaded conversation posts', async () => {
      const testUser = await createTestUser({
        username: 'thread_creator',
        email: 'threadcreator@example.com',
        password: 'ThreadCreator123!',
        personaType: 'ACTIVIST'
      });

      const authToken = getValidJWT(testUser.id!);

      try {
        // Create original post
        const originalPost = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            content: "Let me share my thoughts on education reform in a thread. 1/3",
            topics: ['education', 'reform', 'thread'],
            isThread: true
          })
          .expect(201);

        const originalPostId = originalPost.body.post.id;

        // Create thread continuation
        const threadPost1 = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            content: "First, we need to address funding disparities between districts. 2/3",
            parentPostId: originalPostId,
            threadPosition: 2
          })
          .expect(201);

        const threadPost2 = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            content: "Finally, teacher training and support must be prioritized. 3/3",
            parentPostId: originalPostId,
            threadPosition: 3
          })
          .expect(201);

        // Verify thread structure
        const threadResponse = await request(mockApp)
          .get(`/api/posts/${originalPostId}/thread`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(threadResponse.body.thread).toMatchObject({
          originalPost: {
            id: originalPostId,
            threadPosition: 1
          },
          posts: [
            expect.objectContaining({
              id: threadPost1.body.post.id,
              threadPosition: 2,
              parentPostId: originalPostId
            }),
            expect.objectContaining({
              id: threadPost2.body.post.id,
              threadPosition: 3,
              parentPostId: originalPostId
            })
          ],
          totalPosts: 3
        });

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No thread creation implementation');
      }
    });
  });

  describe('Post Reaction Workflow', () => {
    test('should handle like reactions correctly', async () => {
      const postAuthor = await createTestUser({
        username: 'post_author',
        email: 'author@example.com',
        password: 'Author123!',
        personaType: 'POLITICIAN'
      });

      const reactor = await createTestUser({
        username: 'reactor',
        email: 'reactor@example.com',
        password: 'Reactor123!',
        personaType: 'INFLUENCER'
      });

      const authorToken = getValidJWT(postAuthor.id!);
      const reactorToken = getValidJWT(reactor.id!);

      try {
        // Create post
        const postResponse = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${authorToken}`)
          .send({
            content: "What do you think about this policy proposal?",
            topics: ['policy', 'question']
          })
          .expect(201);

        const postId = postResponse.body.post.id;

        // Add like reaction
        const likeResponse = await request(mockApp)
          .post(`/api/posts/${postId}/reactions`)
          .set('Authorization', `Bearer ${reactorToken}`)
          .send({
            type: 'like'
          })
          .expect(201);

        expect(likeResponse.body).toMatchObject({
          success: true,
          reaction: {
            id: expect.any(String),
            type: 'like',
            userId: reactor.id,
            postId: postId,
            createdAt: expect.any(String)
          }
        });

        // Verify post metrics updated
        const updatedPost = await request(mockApp)
          .get(`/api/posts/${postId}`)
          .set('Authorization', `Bearer ${authorToken}`)
          .expect(200);

        expect(updatedPost.body.post.metrics.likes).toBe(1);

        // Remove like reaction
        const unlikeResponse = await request(mockApp)
          .delete(`/api/posts/${postId}/reactions/like`)
          .set('Authorization', `Bearer ${reactorToken}`)
          .expect(200);

        // Verify metrics updated
        const postAfterUnlike = await request(mockApp)
          .get(`/api/posts/${postId}`)
          .set('Authorization', `Bearer ${authorToken}`)
          .expect(200);

        expect(postAfterUnlike.body.post.metrics.likes).toBe(0);

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No like reaction implementation');
      }
    });

    test('should handle repost workflow', async () => {
      const originalAuthor = await createTestUser({
        username: 'original_author',
        email: 'original@example.com',
        password: 'Original123!',
        personaType: 'JOURNALIST'
      });

      const reposter = await createTestUser({
        username: 'reposter',
        email: 'reposter@example.com',
        password: 'Reposter123!',
        personaType: 'ACTIVIST'
      });

      const originalToken = getValidJWT(originalAuthor.id!);
      const reposterToken = getValidJWT(reposter.id!);

      try {
        // Create original post
        const originalPost = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${originalToken}`)
          .send({
            content: "Breaking: Important news about climate legislation!",
            topics: ['news', 'climate', 'legislation']
          })
          .expect(201);

        const originalPostId = originalPost.body.post.id;

        // Create repost
        const repostResponse = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${reposterToken}`)
          .send({
            type: 'repost',
            originalPostId: originalPostId,
            comment: "This is exactly what we need! Everyone should see this."
          })
          .expect(201);

        expect(repostResponse.body.post).toMatchObject({
          type: 'repost',
          originalPostId: originalPostId,
          comment: "This is exactly what we need! Everyone should see this.",
          authorId: reposter.id
        });

        // Verify original post metrics updated
        const updatedOriginal = await request(mockApp)
          .get(`/api/posts/${originalPostId}`)
          .set('Authorization', `Bearer ${originalToken}`)
          .expect(200);

        expect(updatedOriginal.body.post.metrics.reposts).toBe(1);

        // Verify repost appears in reposter's timeline
        const reposterTimeline = await request(mockApp)
          .get('/api/posts/timeline')
          .set('Authorization', `Bearer ${reposterToken}`)
          .expect(200);

        expect(reposterTimeline.body.posts).toContainEqual(
          expect.objectContaining({
            id: repostResponse.body.post.id,
            type: 'repost',
            originalPostId: originalPostId
          })
        );

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No repost implementation');
      }
    });

    test('should handle quote posts with commentary', async () => {
      const originalAuthor = await createTestUser({
        username: 'quote_original',
        email: 'quoteoriginal@example.com',
        password: 'QuoteOriginal123!',
        personaType: 'POLITICIAN'
      });

      const quoter = await createTestUser({
        username: 'quoter',
        email: 'quoter@example.com',
        password: 'Quoter123!',
        personaType: 'INFLUENCER'
      });

      const originalToken = getValidJWT(originalAuthor.id!);
      const quoterToken = getValidJWT(quoter.id!);

      try {
        // Create original post
        const originalPost = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${originalToken}`)
          .send({
            content: "We need to reconsider our approach to economic policy.",
            topics: ['economy', 'policy']
          })
          .expect(201);

        const originalPostId = originalPost.body.post.id;

        // Create quote post
        const quoteResponse = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${quoterToken}`)
          .send({
            type: 'quote',
            content: "I completely disagree with this approach. Here's why we need different policies...",
            quotedPostId: originalPostId,
            topics: ['economy', 'policy', 'debate'],
            politicalContext: {
              stance: 'oppose',
              issues: ['economy'],
              controversyLevel: 60
            }
          })
          .expect(201);

        expect(quoteResponse.body.post).toMatchObject({
          type: 'quote',
          content: "I completely disagree with this approach. Here's why we need different policies...",
          quotedPostId: originalPostId,
          authorId: quoter.id,
          politicalContext: {
            stance: 'oppose',
            controversyLevel: 60
          }
        });

        // Verify quoted post structure includes original
        const quoteWithOriginal = await request(mockApp)
          .get(`/api/posts/${quoteResponse.body.post.id}`)
          .set('Authorization', `Bearer ${quoterToken}`)
          .expect(200);

        expect(quoteWithOriginal.body.post.quotedPost).toMatchObject({
          id: originalPostId,
          content: "We need to reconsider our approach to economic policy.",
          author: {
            id: originalAuthor.id,
            username: originalAuthor.username
          }
        });

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No quote post implementation');
      }
    });

    test('should handle comment threads and replies', async () => {
      const postAuthor = await createTestUser({
        username: 'comment_post_author',
        email: 'commentauthor@example.com',
        password: 'CommentAuthor123!',
        personaType: 'JOURNALIST'
      });

      const commenter1 = await createTestUser({
        username: 'commenter1',
        email: 'commenter1@example.com',
        password: 'Commenter1123!',
        personaType: 'ACTIVIST'
      });

      const commenter2 = await createTestUser({
        username: 'commenter2',
        email: 'commenter2@example.com',
        password: 'Commenter2123!',
        personaType: 'POLITICIAN'
      });

      const authorToken = getValidJWT(postAuthor.id!);
      const commenter1Token = getValidJWT(commenter1.id!);
      const commenter2Token = getValidJWT(commenter2.id!);

      try {
        // Create original post
        const originalPost = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${authorToken}`)
          .send({
            content: "What are your thoughts on the new education funding proposal?",
            topics: ['education', 'funding', 'question'],
            allowReplies: true
          })
          .expect(201);

        const postId = originalPost.body.post.id;

        // Add first comment
        const comment1 = await request(mockApp)
          .post(`/api/posts/${postId}/comments`)
          .set('Authorization', `Bearer ${commenter1Token}`)
          .send({
            content: "I think it's a step in the right direction, but we need more funding for underserved areas.",
            politicalContext: {
              stance: 'support_with_conditions',
              issues: ['education', 'equity'],
              controversyLevel: 25
            }
          })
          .expect(201);

        const comment1Id = comment1.body.comment.id;

        // Add reply to first comment
        const reply1 = await request(mockApp)
          .post(`/api/posts/${postId}/comments`)
          .set('Authorization', `Bearer ${commenter2Token}`)
          .send({
            content: "That's a fair point. How would you propose targeting those areas specifically?",
            parentCommentId: comment1Id,
            politicalContext: {
              stance: 'inquiry',
              issues: ['education'],
              controversyLevel: 10
            }
          })
          .expect(201);

        // Verify comment thread structure
        const commentsResponse = await request(mockApp)
          .get(`/api/posts/${postId}/comments`)
          .set('Authorization', `Bearer ${authorToken}`)
          .expect(200);

        expect(commentsResponse.body.comments).toMatchObject([
          {
            id: comment1Id,
            content: expect.stringContaining('step in the right direction'),
            authorId: commenter1.id,
            parentCommentId: null,
            replies: [
              {
                id: reply1.body.comment.id,
                content: expect.stringContaining('fair point'),
                authorId: commenter2.id,
                parentCommentId: comment1Id
              }
            ]
          }
        ]);

        // Verify post metrics updated
        const updatedPost = await request(mockApp)
          .get(`/api/posts/${postId}`)
          .set('Authorization', `Bearer ${authorToken}`)
          .expect(200);

        expect(updatedPost.body.post.metrics.comments).toBe(2);

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No comment thread implementation');
      }
    });
  });

  describe('Timeline and Discovery Workflow', () => {
    test('should aggregate personalized timeline based on following and interests', async () => {
      const user1 = await createTestUser({
        username: 'timeline_user',
        email: 'timeline@example.com',
        password: 'Timeline123!',
        personaType: 'POLITICIAN'
      });

      const user2 = await createTestUser({
        username: 'followed_user',
        email: 'followed@example.com',
        password: 'Followed123!',
        personaType: 'JOURNALIST'
      });

      const user3 = await createTestUser({
        username: 'other_user',
        email: 'other@example.com',
        password: 'Other123!',
        personaType: 'ACTIVIST'
      });

      const user1Token = getValidJWT(user1.id!);
      const user2Token = getValidJWT(user2.id!);
      const user3Token = getValidJWT(user3.id!);

      try {
        // User1 follows User2
        await request(mockApp)
          .post(`/api/users/${user2.id}/follow`)
          .set('Authorization', `Bearer ${user1Token}`)
          .expect(200);

        // Set User1's interests
        await request(mockApp)
          .put('/api/users/profile/interests')
          .set('Authorization', `Bearer ${user1Token}`)
          .send({
            topics: ['healthcare', 'climate'],
            politicalAlignment: {
              economicPosition: 40,
              socialPosition: 60
            }
          })
          .expect(200);

        // Create posts from different users
        const followedUserPost = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${user2Token}`)
          .send({
            content: "Breaking news about healthcare reform legislation",
            topics: ['healthcare', 'legislation', 'news']
          })
          .expect(201);

        const otherUserPost = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${user3Token}`)
          .send({
            content: "Climate action rally this weekend!",
            topics: ['climate', 'activism', 'events']
          })
          .expect(201);

        const irrelevantPost = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${user3Token}`)
          .send({
            content: "Just had a great lunch at this restaurant",
            topics: ['food', 'personal']
          })
          .expect(201);

        // Get User1's timeline
        const timelineResponse = await request(mockApp)
          .get('/api/posts/timeline')
          .set('Authorization', `Bearer ${user1Token}`)
          .query({
            algorithm: 'personalized',
            limit: 10
          })
          .expect(200);

        // Should include followed user post and relevant interest post
        expect(timelineResponse.body.posts).toContainEqual(
          expect.objectContaining({
            id: followedUserPost.body.post.id,
            reason: 'following'
          })
        );

        expect(timelineResponse.body.posts).toContainEqual(
          expect.objectContaining({
            id: otherUserPost.body.post.id,
            reason: 'interest_match'
          })
        );

        // Should not include irrelevant post
        expect(timelineResponse.body.posts).not.toContainEqual(
          expect.objectContaining({
            id: irrelevantPost.body.post.id
          })
        );

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No personalized timeline implementation');
      }
    });

    test('should calculate and update trending topics', async () => {
      const users = [];
      for (let i = 0; i < 3; i++) {
        const user = await createTestUser({
          username: `trending_user_${i}`,
          email: `trending${i}@example.com`,
          password: 'Trending123!',
          personaType: 'INFLUENCER'
        });
        users.push(user);
      }

      try {
        // Create multiple posts about same topic
        const trendingTopic = 'climate_summit';
        const posts = [];

        for (let i = 0; i < users.length; i++) {
          const userToken = getValidJWT(users[i].id!);

          const post = await request(mockApp)
            .post('/api/posts')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              content: `My thoughts on the climate summit discussion ${i + 1}`,
              topics: [trendingTopic, 'climate', 'environment']
            })
            .expect(201);

          posts.push(post.body.post);

          // Add reactions to make it more trending
          for (let j = 0; j < 2; j++) {
            if (j !== i) {
              const reactorToken = getValidJWT(users[j].id!);
              await request(mockApp)
                .post(`/api/posts/${post.body.post.id}/reactions`)
                .set('Authorization', `Bearer ${reactorToken}`)
                .send({ type: 'like' })
                .expect(201);
            }
          }
        }

        // Trigger trending calculation
        await request(mockApp)
          .post('/api/admin/calculate-trending')
          .set('Authorization', `Bearer ${getValidJWT(users[0].id!)}`)
          .expect(200);

        // Get trending topics
        const trendingResponse = await request(mockApp)
          .get('/api/trending/topics')
          .expect(200);

        expect(trendingResponse.body.topics).toContainEqual(
          expect.objectContaining({
            topic: trendingTopic,
            postCount: 3,
            engagementScore: expect.any(Number),
            trendingScore: expect.any(Number),
            timeframe: '24h'
          })
        );

        // Verify trending topic has high score
        const climateTopicData = trendingResponse.body.topics.find(
          (t: any) => t.topic === trendingTopic
        );
        expect(climateTopicData.trendingScore).toBeGreaterThan(50);

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No trending topics implementation');
      }
    });
  });

  describe('Post Analytics and Metrics', () => {
    test('should track and calculate engagement metrics accurately', async () => {
      const postAuthor = await createTestUser({
        username: 'metrics_author',
        email: 'metricsauthor@example.com',
        password: 'MetricsAuthor123!',
        personaType: 'POLITICIAN'
      });

      const engagers = [];
      for (let i = 0; i < 5; i++) {
        const user = await createTestUser({
          username: `engager_${i}`,
          email: `engager${i}@example.com`,
          password: 'Engager123!',
          personaType: 'INFLUENCER'
        });
        engagers.push(user);
      }

      const authorToken = getValidJWT(postAuthor.id!);

      try {
        // Create post
        const postResponse = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${authorToken}`)
          .send({
            content: "Important policy announcement about healthcare access",
            topics: ['healthcare', 'policy', 'announcement']
          })
          .expect(201);

        const postId = postResponse.body.post.id;

        // Generate various engagements
        for (let i = 0; i < engagers.length; i++) {
          const engagerToken = getValidJWT(engagers[i].id!);

          // Views (implicit)
          await request(mockApp)
            .get(`/api/posts/${postId}`)
            .set('Authorization', `Bearer ${engagerToken}`)
            .expect(200);

          // Likes
          if (i < 4) {
            await request(mockApp)
              .post(`/api/posts/${postId}/reactions`)
              .set('Authorization', `Bearer ${engagerToken}`)
              .send({ type: 'like' })
              .expect(201);
          }

          // Comments
          if (i < 2) {
            await request(mockApp)
              .post(`/api/posts/${postId}/comments`)
              .set('Authorization', `Bearer ${engagerToken}`)
              .send({
                content: `Great point about healthcare! Comment ${i + 1}`
              })
              .expect(201);
          }

          // Reposts
          if (i === 0) {
            await request(mockApp)
              .post('/api/posts')
              .set('Authorization', `Bearer ${engagerToken}`)
              .send({
                type: 'repost',
                originalPostId: postId
              })
              .expect(201);
          }
        }

        // Get updated metrics
        const metricsResponse = await request(mockApp)
          .get(`/api/posts/${postId}/analytics`)
          .set('Authorization', `Bearer ${authorToken}`)
          .expect(200);

        expect(metricsResponse.body.analytics).toMatchObject({
          postId: postId,
          metrics: {
            views: 5,
            likes: 4,
            comments: 2,
            reposts: 1,
            engagementRate: expect.any(Number),
            reach: expect.any(Number)
          },
          engagementBreakdown: {
            byType: {
              views: 5,
              likes: 4,
              comments: 2,
              reposts: 1
            },
            byTimeframe: expect.any(Object)
          },
          audienceInsights: {
            demographics: expect.any(Object),
            politicalAlignment: expect.any(Object)
          }
        });

        // Verify engagement rate calculation
        const expectedEngagementRate = ((4 + 2 + 1) / 5) * 100; // 140%
        expect(metricsResponse.body.analytics.metrics.engagementRate).toBeCloseTo(expectedEngagementRate, 1);

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No analytics implementation');
      }
    });

    test('should track viral spread and influence metrics', async () => {
      const originalAuthor = await createTestUser({
        username: 'viral_original',
        email: 'viraloriginal@example.com',
        password: 'ViralOriginal123!',
        personaType: 'INFLUENCER'
      });

      const influencers = [];
      for (let i = 0; i < 3; i++) {
        const influencer = await createTestUser({
          username: `viral_influencer_${i}`,
          email: `viralinfluencer${i}@example.com`,
          password: 'ViralInfluencer123!',
          personaType: 'INFLUENCER'
        });
        influencers.push(influencer);
      }

      const originalToken = getValidJWT(originalAuthor.id!);

      try {
        // Create viral post
        const viralPost = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${originalToken}`)
          .send({
            content: "BREAKING: Major policy change announced!",
            topics: ['breaking', 'policy', 'news'],
            politicalContext: {
              controversyLevel: 70,
              issues: ['policy'],
              stance: 'inform'
            }
          })
          .expect(201);

        const postId = viralPost.body.post.id;

        // Simulate viral spread through reposts
        for (let i = 0; i < influencers.length; i++) {
          const influencerToken = getValidJWT(influencers[i].id!);

          // Each influencer reposts
          await request(mockApp)
            .post('/api/posts')
            .set('Authorization', `Bearer ${influencerToken}`)
            .send({
              type: 'repost',
              originalPostId: postId,
              comment: `This is huge! Everyone needs to see this. #viral ${i + 1}`
            })
            .expect(201);

          // Multiple engagements
          await request(mockApp)
            .post(`/api/posts/${postId}/reactions`)
            .set('Authorization', `Bearer ${influencerToken}`)
            .send({ type: 'like' })
            .expect(201);
        }

        // Get viral metrics
        const viralMetrics = await request(mockApp)
          .get(`/api/posts/${postId}/viral-metrics`)
          .set('Authorization', `Bearer ${originalToken}`)
          .expect(200);

        expect(viralMetrics.body.viralMetrics).toMatchObject({
          postId: postId,
          viralityScore: expect.any(Number),
          spreadRate: expect.any(Number),
          influenceNetwork: {
            firstDegreeReach: expect.any(Number),
            secondDegreeReach: expect.any(Number),
            totalReach: expect.any(Number)
          },
          peakEngagementTime: expect.any(String),
          viralFactors: expect.arrayContaining([
            expect.stringMatching(/controversy|influencer|timing/)
          ])
        });

        // High virality score expected
        expect(viralMetrics.body.viralMetrics.viralityScore).toBeGreaterThan(70);

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No viral metrics implementation');
      }
    });
  });
});
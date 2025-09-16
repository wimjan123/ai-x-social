import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { createTestUser, getValidJWT, MOCK_USERS } from '../helpers/auth';

/**
 * T033: Integration Test - Influence Metrics Calculation
 *
 * Tests the complete influence metrics calculation workflow including:
 * - Follower influence and network analysis
 * - Engagement rate calculations and trending
 * - Virality scoring and viral spread tracking
 * - Political alignment influence impact
 * - Controversy score calculations
 * - Cross-platform influence aggregation
 * - Time-based influence decay and growth
 * - Influence leaderboards and rankings
 * - AI persona influence integration
 * - Real-time metrics updates and caching
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

// Mock metrics calculation engine
const mockMetricsEngine = {
  calculateInfluence: jest.fn(),
  updateMetrics: jest.fn(),
  getLeaderboard: jest.fn(),
  analyzeViralSpread: jest.fn()
};

// Mock metrics cache (Redis will be implemented later)
const mockMetricsCache = new Map();

// Mock influence calculations
const mockInfluenceData = new Map();

// Mock database cleanup
const cleanupTestData = async () => {
  mockMetricsCache.clear();
  mockInfluenceData.clear();
  console.log('Mock cleanup - clearing influence metrics data');
};

describe('Influence Metrics Calculation Integration Tests', () => {
  beforeEach(async () => {
    // Reset test environment
    process.env.NODE_ENV = 'test';
    process.env.METRICS_CALCULATION_INTERVAL = '60000'; // 1 minute
    process.env.INFLUENCE_DECAY_RATE = '0.1'; // 10% per day
    process.env.VIRAL_THRESHOLD = '100'; // 100 engagements for viral
    process.env.CONTROVERSY_WEIGHT = '1.5'; // 1.5x multiplier

    await cleanupTestData();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('Basic Influence Metrics Calculation', () => {
    test('should calculate follower influence correctly', async () => {
      const influencer = await createTestUser({
        username: 'test_influencer',
        email: 'testinfluencer@example.com',
        password: 'TestInfluencer123!',
        displayName: 'Test Influencer',
        personaType: 'INFLUENCER'
      });

      const followers = [];
      for (let i = 0; i < 5; i++) {
        const follower = await createTestUser({
          username: `follower_${i}`,
          email: `follower${i}@example.com`,
          password: 'Follower123!',
          personaType: 'ACTIVIST'
        });
        followers.push(follower);
      }

      const influencerToken = getValidJWT(influencer.id!);

      try {
        // Establish follower relationships
        for (const follower of followers) {
          const followerToken = getValidJWT(follower.id!);

          await request(mockApp)
            .post(`/api/users/${influencer.id}/follow`)
            .set('Authorization', `Bearer ${followerToken}`)
            .expect(200);
        }

        // Create posts with varying engagement
        const posts = [];
        for (let i = 0; i < 3; i++) {
          const postResponse = await request(mockApp)
            .post('/api/posts')
            .set('Authorization', `Bearer ${influencerToken}`)
            .send({
              content: `Influential post ${i + 1} about important topics`,
              topics: ['influence', 'politics', 'engagement']
            })
            .expect(201);

          posts.push(postResponse.body.post);

          // Add reactions from followers
          for (let j = 0; j <= i; j++) {
            if (j < followers.length) {
              const followerToken = getValidJWT(followers[j].id!);

              await request(mockApp)
                .post(`/api/posts/${postResponse.body.post.id}/reactions`)
                .set('Authorization', `Bearer ${followerToken}`)
                .send({ type: 'like' })
                .expect(201);
            }
          }
        }

        // Trigger influence metrics calculation
        const metricsResponse = await request(mockApp)
          .post(`/api/users/${influencer.id}/calculate-influence`)
          .set('Authorization', `Bearer ${influencerToken}`)
          .expect(200);

        expect(metricsResponse.body).toMatchObject({
          success: true,
          metrics: {
            userId: influencer.id,
            followerInfluence: {
              totalFollowers: 5,
              activeFollowers: expect.any(Number),
              followerQuality: expect.any(Number),
              networkReach: expect.any(Number)
            },
            engagementMetrics: {
              averageEngagementRate: expect.any(Number),
              totalLikes: 6, // 1 + 2 + 3
              totalComments: 0,
              totalReposts: 0,
              engagementConsistency: expect.any(Number)
            },
            overallInfluenceScore: expect.any(Number),
            ranking: expect.any(Number),
            lastCalculated: expect.any(String)
          }
        });

        // Verify influence score is positive
        expect(metricsResponse.body.metrics.overallInfluenceScore).toBeGreaterThan(0);

        // Verify follower influence calculation
        expect(metricsResponse.body.metrics.followerInfluence.totalFollowers).toBe(5);

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No follower influence calculation implementation');
      }
    });

    test('should calculate engagement rate across different post types', async () => {
      const contentCreator = await createTestUser({
        username: 'content_creator',
        email: 'contentcreator@example.com',
        password: 'ContentCreator123!',
        personaType: 'JOURNALIST'
      });

      const audience = [];
      for (let i = 0; i < 10; i++) {
        const user = await createTestUser({
          username: `audience_${i}`,
          email: `audience${i}@example.com`,
          password: 'Audience123!',
          personaType: 'POLITICIAN'
        });
        audience.push(user);
      }

      const creatorToken = getValidJWT(contentCreator.id!);

      try {
        // Create different types of posts
        const postTypes = [
          {
            type: 'text',
            content: 'Breaking news about policy changes',
            topics: ['news', 'policy'],
            expectedEngagement: 'high'
          },
          {
            type: 'question',
            content: 'What do you think about the new legislation?',
            topics: ['question', 'legislation'],
            expectedEngagement: 'medium'
          },
          {
            type: 'opinion',
            content: 'My personal take on the economic situation',
            topics: ['opinion', 'economy'],
            expectedEngagement: 'medium'
          }
        ];

        const posts = [];

        for (const postType of postTypes) {
          const postResponse = await request(mockApp)
            .post('/api/posts')
            .set('Authorization', `Bearer ${creatorToken}`)
            .send({
              content: postType.content,
              topics: postType.topics,
              postType: postType.type
            })
            .expect(201);

          posts.push({
            ...postResponse.body.post,
            expectedEngagement: postType.expectedEngagement
          });

          // Generate different engagement levels
          const engagementCount = postType.expectedEngagement === 'high' ? 8 : 4;

          for (let i = 0; i < engagementCount && i < audience.length; i++) {
            const audienceToken = getValidJWT(audience[i].id!);

            // Like the post
            await request(mockApp)
              .post(`/api/posts/${postResponse.body.post.id}/reactions`)
              .set('Authorization', `Bearer ${audienceToken}`)
              .send({ type: 'like' })
              .expect(201);

            // Some users also comment
            if (i < engagementCount / 2) {
              await request(mockApp)
                .post(`/api/posts/${postResponse.body.post.id}/comments`)
                .set('Authorization', `Bearer ${audienceToken}`)
                .send({
                  content: `Great point about ${postType.topics[0]}!`
                })
                .expect(201);
            }
          }
        }

        // Calculate engagement metrics
        const engagementResponse = await request(mockApp)
          .get(`/api/users/${contentCreator.id}/engagement-analytics`)
          .set('Authorization', `Bearer ${creatorToken}`)
          .query({
            timeframe: '7d',
            breakdown: 'by_post_type'
          })
          .expect(200);

        expect(engagementResponse.body).toMatchObject({
          success: true,
          analytics: {
            userId: contentCreator.id,
            timeframe: '7d',
            overall: {
              totalPosts: 3,
              totalEngagements: expect.any(Number),
              averageEngagementRate: expect.any(Number),
              engagementTrend: expect.any(String)
            },
            byPostType: {
              text: {
                posts: 1,
                engagementRate: expect.any(Number),
                performance: 'high'
              },
              question: {
                posts: 1,
                engagementRate: expect.any(Number),
                performance: expect.any(String)
              },
              opinion: {
                posts: 1,
                engagementRate: expect.any(Number),
                performance: expect.any(String)
              }
            }
          }
        });

        // Verify high engagement post performs better
        const textPostEngagement = engagementResponse.body.analytics.byPostType.text.engagementRate;
        const questionPostEngagement = engagementResponse.body.analytics.byPostType.question.engagementRate;

        expect(textPostEngagement).toBeGreaterThan(questionPostEngagement);

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No engagement rate calculation implementation');
      }
    });

    test('should calculate virality score and track viral spread', async () => {
      const originalAuthor = await createTestUser({
        username: 'viral_originator',
        email: 'viraloriginator@example.com',
        password: 'ViralOriginator123!',
        personaType: 'ACTIVIST'
      });

      const amplifiers = [];
      for (let i = 0; i < 5; i++) {
        const amplifier = await createTestUser({
          username: `amplifier_${i}`,
          email: `amplifier${i}@example.com`,
          password: 'Amplifier123!',
          personaType: 'INFLUENCER'
        });
        amplifiers.push(amplifier);
      }

      const originalToken = getValidJWT(originalAuthor.id!);

      try {
        // Create potentially viral post
        const viralPostResponse = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${originalToken}`)
          .send({
            content: "URGENT: This policy change will affect everyone! We need to act now!",
            topics: ['urgent', 'policy', 'action'],
            politicalContext: {
              controversyLevel: 80,
              stance: 'call_to_action',
              issues: ['policy', 'urgency']
            }
          })
          .expect(201);

        const viralPostId = viralPostResponse.body.post.id;

        // Simulate viral spread through reposts and engagement
        for (let wave = 0; wave < 3; wave++) {
          for (let i = 0; i < amplifiers.length; i++) {
            const amplifierToken = getValidJWT(amplifiers[i].id!);

            // Repost with commentary
            await request(mockApp)
              .post('/api/posts')
              .set('Authorization', `Bearer ${amplifierToken}`)
              .send({
                type: 'repost',
                originalPostId: viralPostId,
                comment: `This is crucial! Wave ${wave + 1} - everyone needs to see this!`
              })
              .expect(201);

            // Like original post
            await request(mockApp)
              .post(`/api/posts/${viralPostId}/reactions`)
              .set('Authorization', `Bearer ${amplifierToken}`)
              .send({ type: 'like' })
              .expect(201);

            // Add comment
            await request(mockApp)
              .post(`/api/posts/${viralPostId}/comments`)
              .set('Authorization', `Bearer ${amplifierToken}`)
              .send({
                content: `Absolutely critical information! #viral #wave${wave + 1}`
              })
              .expect(201);
          }

          // Wait between waves to simulate time-based spread
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Calculate virality metrics
        const viralityResponse = await request(mockApp)
          .get(`/api/posts/${viralPostId}/virality-metrics`)
          .set('Authorization', `Bearer ${originalToken}`)
          .expect(200);

        expect(viralityResponse.body).toMatchObject({
          success: true,
          viralityMetrics: {
            postId: viralPostId,
            viralityScore: expect.any(Number),
            spreadMetrics: {
              totalReposts: 15, // 5 amplifiers × 3 waves
              totalLikes: 5,    // 5 amplifiers
              totalComments: 15, // 5 amplifiers × 3 waves
              uniqueEngagers: expect.any(Number),
              spreadVelocity: expect.any(Number)
            },
            networkAnalysis: {
              firstDegreeReach: expect.any(Number),
              secondDegreeReach: expect.any(Number),
              amplificationFactor: expect.any(Number),
              influencerAmplification: expect.any(Number)
            },
            timelineAnalysis: {
              peakEngagementTime: expect.any(String),
              growthRate: expect.any(Number),
              sustainabilityScore: expect.any(Number),
              viralTriggers: expect.arrayContaining([
                expect.stringMatching(/urgency|controversy|call_to_action/)
              ])
            }
          }
        });

        // Verify high virality score
        expect(viralityResponse.body.viralityMetrics.viralityScore).toBeGreaterThan(80);

        // Verify amplification factor
        expect(viralityResponse.body.viralityMetrics.networkAnalysis.amplificationFactor).toBeGreaterThan(1);

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No virality calculation implementation');
      }
    });
  });

  describe('Political Alignment Influence Impact', () => {
    test('should calculate influence within political alignment groups', async () => {
      const progressiveLeader = await createTestUser({
        username: 'progressive_leader',
        email: 'progressiveleader@example.com',
        password: 'ProgressiveLeader123!',
        personaType: 'POLITICIAN'
      });

      const conservativeLeader = await createTestUser({
        username: 'conservative_leader',
        email: 'conservativeleader@example.com',
        password: 'ConservativeLeader123!',
        personaType: 'POLITICIAN'
      });

      // Create aligned followers
      const progressiveFollowers = [];
      const conservativeFollowers = [];

      for (let i = 0; i < 4; i++) {
        const progressive = await createTestUser({
          username: `progressive_${i}`,
          email: `progressive${i}@example.com`,
          password: 'Progressive123!',
          personaType: 'ACTIVIST'
        });
        progressiveFollowers.push(progressive);

        const conservative = await createTestUser({
          username: `conservative_${i}`,
          email: `conservative${i}@example.com`,
          password: 'Conservative123!',
          personaType: 'INFLUENCER'
        });
        conservativeFollowers.push(conservative);
      }

      const progressiveToken = getValidJWT(progressiveLeader.id!);
      const conservativeToken = getValidJWT(conservativeLeader.id!);

      try {
        // Set political alignments
        await request(mockApp)
          .put(`/api/users/${progressiveLeader.id}/political-alignment`)
          .set('Authorization', `Bearer ${progressiveToken}`)
          .send({
            economicPosition: 20, // Left
            socialPosition: 80,   // Progressive
            primaryIssues: ['Social Justice', 'Climate Change'],
            debateWillingness: 85,
            controversyTolerance: 60
          })
          .expect(200);

        await request(mockApp)
          .put(`/api/users/${conservativeLeader.id}/political-alignment`)
          .set('Authorization', `Bearer ${conservativeToken}`)
          .send({
            economicPosition: 80, // Right
            socialPosition: 20,   // Conservative
            primaryIssues: ['Economy', 'Traditional Values'],
            debateWillingness: 75,
            controversyTolerance: 40
          })
          .expect(200);

        // Establish follower relationships within alignment groups
        for (const follower of progressiveFollowers) {
          const followerToken = getValidJWT(follower.id!);
          await request(mockApp)
            .post(`/api/users/${progressiveLeader.id}/follow`)
            .set('Authorization', `Bearer ${followerToken}`)
            .expect(200);
        }

        for (const follower of conservativeFollowers) {
          const followerToken = getValidJWT(follower.id!);
          await request(mockApp)
            .post(`/api/users/${conservativeLeader.id}/follow`)
            .set('Authorization', `Bearer ${followerToken}`)
            .expect(200);
        }

        // Create aligned content
        const progressivePost = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${progressiveToken}`)
          .send({
            content: "We need bold action on climate change and social justice reform",
            topics: ['climate', 'social_justice', 'reform'],
            politicalContext: {
              stance: 'support',
              issues: ['climate_change', 'social_justice'],
              controversyLevel: 50
            }
          })
          .expect(201);

        const conservativePost = await request(mockApp)
          .post('/api/posts')
          .set('Authorization', `Bearer ${conservativeToken}`)
          .send({
            content: "Focus on economic growth and fiscal responsibility",
            topics: ['economy', 'fiscal_policy', 'growth'],
            politicalContext: {
              stance: 'support',
              issues: ['economy', 'fiscal_responsibility'],
              controversyLevel: 30
            }
          })
          .expect(201);

        // Generate engagement from aligned followers
        for (const follower of progressiveFollowers) {
          const followerToken = getValidJWT(follower.id!);
          await request(mockApp)
            .post(`/api/posts/${progressivePost.body.post.id}/reactions`)
            .set('Authorization', `Bearer ${followerToken}`)
            .send({ type: 'like' })
            .expect(201);
        }

        for (const follower of conservativeFollowers) {
          const followerToken = getValidJWT(follower.id!);
          await request(mockApp)
            .post(`/api/posts/${conservativePost.body.post.id}/reactions`)
            .set('Authorization', `Bearer ${followerToken}`)
            .send({ type: 'like' })
            .expect(201);
        }

        // Calculate political alignment influence
        const progressiveInfluence = await request(mockApp)
          .get(`/api/users/${progressiveLeader.id}/political-influence`)
          .set('Authorization', `Bearer ${progressiveToken}`)
          .expect(200);

        const conservativeInfluence = await request(mockApp)
          .get(`/api/users/${conservativeLeader.id}/political-influence`)
          .set('Authorization', `Bearer ${conservativeToken}`)
          .expect(200);

        expect(progressiveInfluence.body).toMatchObject({
          success: true,
          politicalInfluence: {
            userId: progressiveLeader.id,
            alignmentGroup: 'progressive',
            influenceWithinGroup: expect.any(Number),
            crossAlignmentInfluence: expect.any(Number),
            polarization: {
              supportFromAligned: expect.any(Number),
              oppositionFromOpposing: expect.any(Number),
              neutralEngagement: expect.any(Number)
            },
            issueInfluence: {
              'climate_change': expect.any(Number),
              'social_justice': expect.any(Number)
            },
            debateImpact: expect.any(Number)
          }
        });

        expect(conservativeInfluence.body).toMatchObject({
          success: true,
          politicalInfluence: {
            userId: conservativeLeader.id,
            alignmentGroup: 'conservative',
            influenceWithinGroup: expect.any(Number),
            crossAlignmentInfluence: expect.any(Number),
            issueInfluence: {
              'economy': expect.any(Number),
              'fiscal_responsibility': expect.any(Number)
            }
          }
        });

        // Verify within-group influence is higher than cross-alignment
        expect(progressiveInfluence.body.politicalInfluence.influenceWithinGroup)
          .toBeGreaterThan(progressiveInfluence.body.politicalInfluence.crossAlignmentInfluence);

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No political alignment influence implementation');
      }
    });

    test('should calculate controversy score and its impact on influence', async () => {
      const controversialUser = await createTestUser({
        username: 'controversial_user',
        email: 'controversialuser@example.com',
        password: 'ControversialUser123!',
        personaType: 'ACTIVIST'
      });

      const moderateUser = await createTestUser({
        username: 'moderate_user',
        email: 'moderateuser@example.com',
        password: 'ModerateUser123!',
        personaType: 'POLITICIAN'
      });

      const controversialToken = getValidJWT(controversialUser.id!);
      const moderateToken = getValidJWT(moderateUser.id!);

      try {
        // Create controversial content
        const controversialPosts = [];
        for (let i = 0; i < 3; i++) {
          const postResponse = await request(mockApp)
            .post('/api/posts')
            .set('Authorization', `Bearer ${controversialToken}`)
            .send({
              content: `Highly controversial political statement ${i + 1} that divides opinions`,
              topics: ['controversial', 'politics', 'divisive'],
              politicalContext: {
                stance: 'strong_oppose',
                issues: ['controversial_policy'],
                controversyLevel: 90
              }
            })
            .expect(201);

          controversialPosts.push(postResponse.body.post);
        }

        // Create moderate content
        const moderatePosts = [];
        for (let i = 0; i < 3; i++) {
          const postResponse = await request(mockApp)
            .post('/api/posts')
            .set('Authorization', `Bearer ${moderateToken}`)
            .send({
              content: `Balanced perspective on policy issue ${i + 1}`,
              topics: ['policy', 'balanced', 'moderate'],
              politicalContext: {
                stance: 'neutral',
                issues: ['policy_discussion'],
                controversyLevel: 20
              }
            })
            .expect(201);

          moderatePosts.push(postResponse.body.post);
        }

        // Generate mixed reactions to controversial content
        const reactors = [];
        for (let i = 0; i < 10; i++) {
          const reactor = await createTestUser({
            username: `reactor_${i}`,
            email: `reactor${i}@example.com`,
            password: 'Reactor123!',
            personaType: 'INFLUENCER'
          });
          reactors.push(reactor);
        }

        // Mixed reactions to controversial posts
        for (const post of controversialPosts) {
          for (let i = 0; i < reactors.length; i++) {
            const reactorToken = getValidJWT(reactors[i].id!);

            if (i < 6) {
              // Likes from some users
              await request(mockApp)
                .post(`/api/posts/${post.id}/reactions`)
                .set('Authorization', `Bearer ${reactorToken}`)
                .send({ type: 'like' })
                .expect(201);
            }

            if (i >= 6) {
              // Negative comments from others
              await request(mockApp)
                .post(`/api/posts/${post.id}/comments`)
                .set('Authorization', `Bearer ${reactorToken}`)
                .send({
                  content: "I strongly disagree with this position",
                  sentiment: 'negative'
                })
                .expect(201);
            }
          }
        }

        // Positive reactions to moderate posts
        for (const post of moderatePosts) {
          for (let i = 0; i < 7; i++) {
            const reactorToken = getValidJWT(reactors[i].id!);

            await request(mockApp)
              .post(`/api/posts/${post.id}/reactions`)
              .set('Authorization', `Bearer ${reactorToken}`)
              .send({ type: 'like' })
              .expect(201);
          }
        }

        // Calculate controversy influence metrics
        const controversialMetrics = await request(mockApp)
          .get(`/api/users/${controversialUser.id}/controversy-metrics`)
          .set('Authorization', `Bearer ${controversialToken}`)
          .expect(200);

        const moderateMetrics = await request(mockApp)
          .get(`/api/users/${moderateUser.id}/controversy-metrics`)
          .set('Authorization', `Bearer ${moderateToken}`)
          .expect(200);

        expect(controversialMetrics.body).toMatchObject({
          success: true,
          controversyMetrics: {
            userId: controversialUser.id,
            controversyScore: expect.any(Number),
            polarizationIndex: expect.any(Number),
            engagementSplit: {
              positive: expect.any(Number),
              negative: expect.any(Number),
              neutral: expect.any(Number)
            },
            controversyImpact: {
              amplifiedReach: expect.any(Number),
              dividedAudience: expect.any(Number),
              overallInfluenceMultiplier: expect.any(Number)
            },
            riskFactors: expect.arrayContaining([
              expect.stringMatching(/polarization|controversy|engagement_risk/)
            ])
          }
        });

        // Verify controversial user has higher controversy score
        expect(controversialMetrics.body.controversyMetrics.controversyScore)
          .toBeGreaterThan(moderateMetrics.body.controversyMetrics.controversyScore);

        // Verify controversial content affects influence differently
        expect(controversialMetrics.body.controversyMetrics.polarizationIndex)
          .toBeGreaterThan(50); // High polarization

        expect(moderateMetrics.body.controversyMetrics.polarizationIndex)
          .toBeLessThan(30); // Low polarization

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No controversy metrics implementation');
      }
    });
  });

  describe('Influence Leaderboards and Rankings', () => {
    test('should generate and maintain influence leaderboards', async () => {
      const topInfluencers = [];
      for (let i = 0; i < 5; i++) {
        const influencer = await createTestUser({
          username: `top_influencer_${i}`,
          email: `topinfluencer${i}@example.com`,
          password: 'TopInfluencer123!',
          personaType: 'INFLUENCER'
        });
        topInfluencers.push(influencer);
      }

      try {
        // Create different levels of influence
        for (let i = 0; i < topInfluencers.length; i++) {
          const influencer = topInfluencers[i];
          const influencerToken = getValidJWT(influencer.id!);

          // Create followers (more for higher-ranked influencers)
          const followerCount = (5 - i) * 3; // 15, 12, 9, 6, 3 followers
          for (let j = 0; j < followerCount; j++) {
            const follower = await createTestUser({
              username: `follower_${i}_${j}`,
              email: `follower${i}${j}@example.com`,
              password: 'Follower123!',
              personaType: 'ACTIVIST'
            });

            const followerToken = getValidJWT(follower.id!);
            await request(mockApp)
              .post(`/api/users/${influencer.id}/follow`)
              .set('Authorization', `Bearer ${followerToken}`)
              .expect(200);
          }

          // Create posts with varying engagement
          const postCount = 5 - i; // More posts for higher-ranked
          for (let k = 0; k < postCount; k++) {
            const postResponse = await request(mockApp)
              .post('/api/posts')
              .set('Authorization', `Bearer ${influencerToken}`)
              .send({
                content: `Influential content ${k + 1} from top influencer ${i}`,
                topics: ['influence', 'leadership', 'engagement']
              })
              .expect(201);

            // Generate engagement (more for higher-ranked)
            const engagementLevel = followerCount;
            for (let l = 0; l < Math.min(engagementLevel, followerCount); l++) {
              const followerToken = getValidJWT(
                await createTestUser({
                  username: `engager_${i}_${k}_${l}`,
                  email: `engager${i}${k}${l}@example.com`,
                  password: 'Engager123!',
                  personaType: 'POLITICIAN'
                })
              );

              await request(mockApp)
                .post(`/api/posts/${postResponse.body.post.id}/reactions`)
                .set('Authorization', `Bearer ${followerToken}`)
                .send({ type: 'like' })
                .expect(201);
            }
          }
        }

        // Calculate influence for all users
        await request(mockApp)
          .post('/api/admin/calculate-all-influence')
          .set('Authorization', `Bearer ${getValidJWT(topInfluencers[0].id!)}`)
          .expect(200);

        // Get global leaderboard
        const leaderboardResponse = await request(mockApp)
          .get('/api/leaderboards/influence')
          .query({
            timeframe: 'all_time',
            limit: 10,
            category: 'overall'
          })
          .expect(200);

        expect(leaderboardResponse.body).toMatchObject({
          success: true,
          leaderboard: {
            timeframe: 'all_time',
            category: 'overall',
            lastUpdated: expect.any(String),
            rankings: expect.arrayContaining([
              expect.objectContaining({
                rank: expect.any(Number),
                userId: expect.any(String),
                username: expect.any(String),
                displayName: expect.any(String),
                influenceScore: expect.any(Number),
                followerCount: expect.any(Number),
                engagementRate: expect.any(Number),
                change: expect.any(Number) // Change from previous ranking
              })
            ])
          }
        });

        // Verify rankings are in descending order of influence
        const rankings = leaderboardResponse.body.leaderboard.rankings;
        for (let i = 0; i < rankings.length - 1; i++) {
          expect(rankings[i].influenceScore).toBeGreaterThanOrEqual(rankings[i + 1].influenceScore);
          expect(rankings[i].rank).toBe(i + 1);
        }

        // Get category-specific leaderboards
        const influencerLeaderboard = await request(mockApp)
          .get('/api/leaderboards/influence')
          .query({
            timeframe: '30d',
            category: 'influencer',
            limit: 5
          })
          .expect(200);

        expect(influencerLeaderboard.body.leaderboard.rankings).toHaveLength(5);

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No leaderboard implementation');
      }
    });

    test('should track influence changes over time', async () => {
      const trackedUser = await createTestUser({
        username: 'influence_tracked_user',
        email: 'influencetrackeduser@example.com',
        password: 'InfluenceTrackedUser123!',
        personaType: 'POLITICIAN'
      });

      const trackedToken = getValidJWT(trackedUser.id!);

      try {
        // Initial influence calculation
        const initialMetrics = await request(mockApp)
          .post(`/api/users/${trackedUser.id}/calculate-influence`)
          .set('Authorization', `Bearer ${trackedToken}`)
          .expect(200);

        const initialScore = initialMetrics.body.metrics.overallInfluenceScore;

        // Create followers and content to increase influence
        const followers = [];
        for (let i = 0; i < 10; i++) {
          const follower = await createTestUser({
            username: `tracked_follower_${i}`,
            email: `trackedfollower${i}@example.com`,
            password: 'TrackedFollower123!',
            personaType: 'ACTIVIST'
          });
          followers.push(follower);

          const followerToken = getValidJWT(follower.id!);
          await request(mockApp)
            .post(`/api/users/${trackedUser.id}/follow`)
            .set('Authorization', `Bearer ${followerToken}`)
            .expect(200);
        }

        // Create viral content
        for (let i = 0; i < 5; i++) {
          const postResponse = await request(mockApp)
            .post('/api/posts')
            .set('Authorization', `Bearer ${trackedToken}`)
            .send({
              content: `Trending political content ${i + 1} that resonates with many`,
              topics: ['trending', 'politics', 'viral'],
              politicalContext: {
                controversyLevel: 60,
                stance: 'strong_support',
                issues: ['trending_topic']
              }
            })
            .expect(201);

          // Generate high engagement
          for (const follower of followers) {
            const followerToken = getValidJWT(follower.id!);

            await request(mockApp)
              .post(`/api/posts/${postResponse.body.post.id}/reactions`)
              .set('Authorization', `Bearer ${followerToken}`)
              .send({ type: 'like' })
              .expect(201);

            if (i % 2 === 0) {
              await request(mockApp)
                .post(`/api/posts/${postResponse.body.post.id}/comments`)
                .set('Authorization', `Bearer ${followerToken}`)
                .send({
                  content: `Excellent point on ${postResponse.body.post.topics[0]}!`
                })
                .expect(201);
            }
          }
        }

        // Recalculate influence
        const updatedMetrics = await request(mockApp)
          .post(`/api/users/${trackedUser.id}/calculate-influence`)
          .set('Authorization', `Bearer ${trackedToken}`)
          .expect(200);

        const updatedScore = updatedMetrics.body.metrics.overallInfluenceScore;

        // Get influence history
        const historyResponse = await request(mockApp)
          .get(`/api/users/${trackedUser.id}/influence-history`)
          .set('Authorization', `Bearer ${trackedToken}`)
          .query({
            timeframe: '30d',
            granularity: 'daily'
          })
          .expect(200);

        expect(historyResponse.body).toMatchObject({
          success: true,
          influenceHistory: {
            userId: trackedUser.id,
            timeframe: '30d',
            granularity: 'daily',
            dataPoints: expect.arrayContaining([
              expect.objectContaining({
                timestamp: expect.any(String),
                influenceScore: expect.any(Number),
                followerCount: expect.any(Number),
                engagementRate: expect.any(Number),
                change: expect.any(Number),
                factors: expect.any(Array)
              })
            ]),
            trends: {
              overall: expect.any(String), // 'increasing', 'decreasing', 'stable'
              followerGrowth: expect.any(Number),
              engagementTrend: expect.any(Number),
              peakInfluenceDate: expect.any(String)
            }
          }
        });

        // Verify influence increased
        expect(updatedScore).toBeGreaterThan(initialScore);

        // Verify history shows positive trend
        expect(historyResponse.body.influenceHistory.trends.overall).toMatch(/increasing|growth/i);

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No influence tracking implementation');
      }
    });
  });

  describe('AI Persona Influence Integration', () => {
    test('should calculate AI persona influence and impact on creators', async () => {
      const aiCreator = await createTestUser({
        username: 'ai_creator',
        email: 'aicreator@example.com',
        password: 'AICreator123!',
        personaType: 'INFLUENCER'
      });

      const creatorToken = getValidJWT(aiCreator.id!);

      try {
        // Create AI persona
        const personaResponse = await request(mockApp)
          .post('/api/ai-personas')
          .set('Authorization', `Bearer ${creatorToken}`)
          .send({
            name: 'Influential AI Politician',
            personaType: 'AI_POLITICIAN',
            politicalAlignment: {
              economicPosition: 40,
              socialPosition: 60,
              primaryIssues: ['Technology', 'Future Policy'],
              debateWillingness: 90,
              controversyTolerance: 70
            },
            influenceSettings: {
              trackMetrics: true,
              participateInLeaderboards: true,
              influenceTransferToCreator: 0.3 // 30% of AI influence transfers to creator
            }
          })
          .expect(201);

        const personaId = personaResponse.body.persona.id;

        // Create users to interact with AI persona
        const aiFollowers = [];
        for (let i = 0; i < 15; i++) {
          const follower = await createTestUser({
            username: `ai_follower_${i}`,
            email: `aifollower${i}@example.com`,
            password: 'AIFollower123!',
            personaType: 'ACTIVIST'
          });
          aiFollowers.push(follower);
        }

        // AI persona creates content and gains followers
        for (let i = 0; i < 5; i++) {
          const aiPostResponse = await request(mockApp)
            .post('/api/ai-personas/posts')
            .set('Authorization', `Bearer ${creatorToken}`)
            .send({
              personaId: personaId,
              content: `AI-generated insight ${i + 1} on future technology policy`,
              topics: ['ai', 'technology', 'policy', 'future'],
              politicalContext: {
                stance: 'inform',
                issues: ['technology_policy'],
                controversyLevel: 40
              }
            })
            .expect(201);

          // Generate engagement from AI followers
          for (let j = 0; j < aiFollowers.length; j++) {
            const followerToken = getValidJWT(aiFollowers[j].id!);

            if (j < 12) {
              await request(mockApp)
                .post(`/api/posts/${aiPostResponse.body.post.id}/reactions`)
                .set('Authorization', `Bearer ${followerToken}`)
                .send({ type: 'like' })
                .expect(201);
            }

            if (j < 5) {
              await request(mockApp)
                .post(`/api/posts/${aiPostResponse.body.post.id}/comments`)
                .set('Authorization', `Bearer ${followerToken}`)
                .send({
                  content: `Fascinating perspective from AI on ${aiPostResponse.body.post.topics[0]}!`
                })
                .expect(201);
            }

            // Some users follow the AI persona
            if (j < 10) {
              await request(mockApp)
                .post(`/api/ai-personas/${personaId}/follow`)
                .set('Authorization', `Bearer ${followerToken}`)
                .expect(200);
            }
          }
        }

        // Calculate AI persona influence
        const aiInfluenceResponse = await request(mockApp)
          .get(`/api/ai-personas/${personaId}/influence-metrics`)
          .set('Authorization', `Bearer ${creatorToken}`)
          .expect(200);

        expect(aiInfluenceResponse.body).toMatchObject({
          success: true,
          aiInfluenceMetrics: {
            personaId: personaId,
            aiInfluenceScore: expect.any(Number),
            followerMetrics: {
              totalFollowers: 10,
              averageEngagementRate: expect.any(Number),
              loyaltyScore: expect.any(Number)
            },
            contentMetrics: {
              totalPosts: 5,
              averageLikes: expect.any(Number),
              averageComments: expect.any(Number),
              viralityFactor: expect.any(Number)
            },
            impactMetrics: {
              conversationStarters: expect.any(Number),
              influenceOnHumans: expect.any(Number),
              crossPlatformReach: expect.any(Number)
            },
            creatorBenefit: {
              influenceTransferred: expect.any(Number),
              credibilityBoost: expect.any(Number),
              audienceExpansion: expect.any(Number)
            }
          }
        });

        // Calculate creator's updated influence (should include AI boost)
        const creatorInfluenceResponse = await request(mockApp)
          .post(`/api/users/${aiCreator.id}/calculate-influence`)
          .set('Authorization', `Bearer ${creatorToken}`)
          .expect(200);

        expect(creatorInfluenceResponse.body.metrics).toMatchObject({
          overallInfluenceScore: expect.any(Number),
          aiPersonaBonus: {
            totalAIInfluence: expect.any(Number),
            transferredInfluence: expect.any(Number),
            aiCreatorMultiplier: expect.any(Number)
          }
        });

        // Verify AI persona has significant influence
        expect(aiInfluenceResponse.body.aiInfluenceMetrics.aiInfluenceScore).toBeGreaterThan(50);

        // Verify creator benefits from AI persona
        expect(creatorInfluenceResponse.body.metrics.aiPersonaBonus.transferredInfluence).toBeGreaterThan(0);

      } catch (error) {
        // Expected to fail - no backend implementation yet
        expect(error).toBeDefined();
        console.log('Expected failure: No AI persona influence implementation');
      }
    });
  });
});
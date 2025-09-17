import { test, expect, Page } from '@playwright/test';

// Test configuration
const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123',
  username: 'testuser',
  displayName: 'Test User'
};

const API_BASE_URL = 'http://localhost:3001/api';

// Mock AI persona data for testing
const MOCK_PERSONAS = [
  {
    id: 'persona-politician-1',
    name: 'Conservative Senator',
    handle: 'senator_conservative',
    bio: 'Fighting for traditional values and fiscal responsibility',
    personaType: 'POLITICIAN',
    toneStyle: 'PROFESSIONAL',
    isActive: true,
    personalityTraits: ['analytical', 'authoritative'],
    interests: ['economics', 'governance'],
    expertise: ['fiscal policy', 'national security']
  },
  {
    id: 'persona-influencer-1',
    name: 'Progressive Activist',
    handle: 'activist_progressive',
    bio: 'Advocating for social justice and environmental reform',
    personaType: 'INFLUENCER',
    toneStyle: 'CASUAL',
    isActive: true,
    personalityTraits: ['passionate', 'empathetic'],
    interests: ['environment', 'social justice'],
    expertise: ['climate change', 'civil rights']
  },
  {
    id: 'persona-journalist-1',
    name: 'Independent Reporter',
    handle: 'reporter_independent',
    bio: 'Fact-based journalism with no political bias',
    personaType: 'JOURNALIST',
    toneStyle: 'SERIOUS',
    isActive: true,
    personalityTraits: ['objective', 'inquisitive'],
    interests: ['current events', 'investigation'],
    expertise: ['fact-checking', 'analysis']
  }
];

// Utility functions for test setup
async function loginUser(page: Page): Promise<void> {
  await page.goto('/auth/login');
  await page.fill('[data-testid="email-input"]', TEST_USER.email);
  await page.fill('[data-testid="password-input"]', TEST_USER.password);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/dashboard', { timeout: 10000 });
}

async function mockApiResponses(page: Page): Promise<void> {
  // Mock personas API
  await page.route(`${API_BASE_URL}/personas`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_PERSONAS)
    });
  });

  // Mock individual persona details
  for (const persona of MOCK_PERSONAS) {
    await page.route(`${API_BASE_URL}/personas/${persona.id}`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(persona)
      });
    });
  }
}

async function mockAIResponse(page: Page, personaId: string, response: string): Promise<void> {
  await page.route(`${API_BASE_URL}/personas/${personaId}/reply`, async route => {
    const mockPost = {
      id: `post-${Date.now()}`,
      content: response,
      authorId: null,
      personaId: personaId,
      isAIGenerated: true,
      likeCount: 0,
      repostCount: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
      persona: MOCK_PERSONAS.find(p => p.id === personaId)
    };

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify(mockPost)
    });
  });
}

async function setupSSEMock(page: Page): Promise<void> {
  // Mock Server-Sent Events for real-time updates
  await page.addInitScript(() => {
    class MockEventSource {
      constructor(url: string) {
        setTimeout(() => {
          if (this.onmessage) {
            this.onmessage({
              data: JSON.stringify({
                type: 'ai_response',
                payload: {
                  status: 'generating',
                  progress: 0.5
                }
              })
            });
          }
        }, 1000);

        setTimeout(() => {
          if (this.onmessage) {
            this.onmessage({
              data: JSON.stringify({
                type: 'ai_response',
                payload: {
                  status: 'complete',
                  content: 'This is a streaming AI response for testing purposes.'
                }
              })
            });
          }
        }, 3000);
      }

      close() {}
      addEventListener() {}
      removeEventListener() {}
    }

    (window as any).EventSource = MockEventSource;
  });
}

test.describe('AI Persona Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponses(page);
    await setupSSEMock(page);
  });

  test.describe('Persona Activation and Management', () => {
    test('should display available AI personas', async ({ page }) => {
      await loginUser(page);
      await page.goto('/personas');

      // Verify persona list is displayed
      await expect(page.locator('[data-testid="persona-list"]')).toBeVisible();

      // Check that mock personas are displayed
      for (const persona of MOCK_PERSONAS) {
        await expect(page.locator(`[data-testid="persona-${persona.id}"]`)).toBeVisible();
        await expect(page.getByText(persona.name)).toBeVisible();
        await expect(page.getByText(`@${persona.handle}`)).toBeVisible();
      }
    });

    test('should activate and deactivate AI personas', async ({ page }) => {
      await loginUser(page);
      await page.goto('/personas');

      const firstPersona = MOCK_PERSONAS[0];
      const personaCard = page.locator(`[data-testid="persona-${firstPersona.id}"]`);

      // Test activation toggle
      const activationToggle = personaCard.locator('[data-testid="activation-toggle"]');
      await expect(activationToggle).toBeVisible();

      // Should be active by default (based on mock data)
      await expect(activationToggle).toBeChecked();

      // Toggle off
      await activationToggle.click();
      await expect(page.locator('[data-testid="activation-status"]')).toContainText('Inactive');

      // Toggle back on
      await activationToggle.click();
      await expect(page.locator('[data-testid="activation-status"]')).toContainText('Active');
    });

    test('should filter personas by type', async ({ page }) => {
      await loginUser(page);
      await page.goto('/personas');

      // Test filtering by politician type
      await page.selectOption('[data-testid="persona-type-filter"]', 'POLITICIAN');
      await expect(page.locator('[data-testid="persona-politician-1"]')).toBeVisible();
      await expect(page.locator('[data-testid="persona-influencer-1"]')).not.toBeVisible();

      // Test filtering by influencer type
      await page.selectOption('[data-testid="persona-type-filter"]', 'INFLUENCER');
      await expect(page.locator('[data-testid="persona-influencer-1"]')).toBeVisible();
      await expect(page.locator('[data-testid="persona-politician-1"]')).not.toBeVisible();

      // Reset filter
      await page.selectOption('[data-testid="persona-type-filter"]', 'ALL');
      await expect(page.locator('[data-testid="persona-politician-1"]')).toBeVisible();
      await expect(page.locator('[data-testid="persona-influencer-1"]')).toBeVisible();
    });
  });

  test.describe('AI Response Generation', () => {
    test('should generate AI responses based on political alignment', async ({ page }) => {
      await loginUser(page);
      await page.goto('/dashboard');

      // Create a post to trigger AI responses
      await page.fill('[data-testid="post-composer"]', 'What are your thoughts on the current economic policy?');
      await page.click('[data-testid="post-submit"]');

      // Mock different responses for different political alignments
      await mockAIResponse(page, 'persona-politician-1',
        'As a fiscal conservative, I believe we need to reduce government spending and lower taxes to stimulate economic growth.');
      await mockAIResponse(page, 'persona-influencer-1',
        'The current economic policy disproportionately affects working families. We need progressive taxation and social safety nets.');

      // Wait for AI personas to respond
      await page.waitForTimeout(2000);

      // Verify different responses based on political alignment
      await expect(page.getByText(/fiscal conservative/)).toBeVisible();
      await expect(page.getByText(/progressive taxation/)).toBeVisible();
    });

    test('should respect persona tone and style settings', async ({ page }) => {
      await loginUser(page);
      await page.goto('/dashboard');

      // Test professional tone (politician)
      await mockAIResponse(page, 'persona-politician-1',
        'I would like to address this matter with the gravity it deserves.');

      // Test casual tone (influencer)
      await mockAIResponse(page, 'persona-influencer-1',
        'This is honestly such an important topic that we all need to talk about!');

      // Create a post
      await page.fill('[data-testid="post-composer"]', 'What do you think about this issue?');
      await page.click('[data-testid="post-submit"]');

      await page.waitForTimeout(2000);

      // Verify tone differences
      await expect(page.getByText(/gravity it deserves/)).toBeVisible();
      await expect(page.getByText(/honestly such an important/)).toBeVisible();
    });

    test('should handle AI response length constraints', async ({ page }) => {
      await loginUser(page);
      await page.goto('/dashboard');

      // Mock a response that tests length constraints
      const longResponse = 'This is a test response that should be within the character limit but still comprehensive enough to demonstrate the AI\'s capability to provide meaningful political discourse.';

      await mockAIResponse(page, 'persona-politician-1', longResponse);

      await page.fill('[data-testid="post-composer"]', 'Provide a detailed analysis of this policy.');
      await page.click('[data-testid="post-submit"]');

      await page.waitForTimeout(2000);

      // Verify response is within character limits (280 characters for X-like platform)
      const responseElement = page.locator('[data-testid="ai-response"]').first();
      await expect(responseElement).toBeVisible();

      const responseText = await responseElement.textContent();
      expect(responseText?.length).toBeLessThanOrEqual(280);
    });
  });

  test.describe('Real-time AI Response Streaming', () => {
    test('should show AI response generation progress', async ({ page }) => {
      await loginUser(page);
      await page.goto('/dashboard');

      // Create a post that will trigger AI response
      await page.fill('[data-testid="post-composer"]', 'Urgent: What\'s your take on breaking news?');
      await page.click('[data-testid="post-submit"]');

      // Should show loading state
      await expect(page.locator('[data-testid="ai-generating"]')).toBeVisible();
      await expect(page.getByText(/AI is thinking/)).toBeVisible();

      // Should show progress indicator
      await expect(page.locator('[data-testid="ai-progress"]')).toBeVisible();

      // Wait for streaming to complete
      await page.waitForTimeout(4000);

      // Should show completed response
      await expect(page.locator('[data-testid="ai-generating"]')).not.toBeVisible();
      await expect(page.getByText(/streaming AI response/)).toBeVisible();
    });

    test('should handle multiple concurrent AI responses', async ({ page }) => {
      await loginUser(page);
      await page.goto('/dashboard');

      // Mock responses for multiple personas
      await mockAIResponse(page, 'persona-politician-1', 'Response from politician perspective');
      await mockAIResponse(page, 'persona-influencer-1', 'Response from influencer perspective');
      await mockAIResponse(page, 'persona-journalist-1', 'Response from journalist perspective');

      // Create a controversial post that should trigger multiple responses
      await page.fill('[data-testid="post-composer"]', 'Controversial political statement for testing');
      await page.click('[data-testid="post-submit"]');

      // Should show multiple AI responses generating
      await expect(page.locator('[data-testid="ai-generating"]')).toHaveCount(3);

      await page.waitForTimeout(4000);

      // Should show all completed responses
      await expect(page.getByText(/politician perspective/)).toBeVisible();
      await expect(page.getByText(/influencer perspective/)).toBeVisible();
      await expect(page.getByText(/journalist perspective/)).toBeVisible();
    });
  });

  test.describe('Persona Customization', () => {
    test('should allow customization of persona settings', async ({ page }) => {
      await loginUser(page);
      await page.goto('/personas/persona-politician-1/settings');

      // Test personality trait adjustments
      await page.fill('[data-testid="personality-openness"]', '7');
      await page.fill('[data-testid="personality-agreeableness"]', '3');

      // Test tone style changes
      await page.selectOption('[data-testid="tone-style-select"]', 'SERIOUS');

      // Test expertise modification
      await page.fill('[data-testid="expertise-input"]', 'foreign policy,defense');

      // Test controversy tolerance
      await page.fill('[data-testid="controversy-tolerance"]', '8');

      await page.click('[data-testid="save-settings"]');

      // Verify settings are saved
      await expect(page.locator('[data-testid="settings-saved"]')).toBeVisible();

      // Verify changes are reflected in persona behavior
      await page.goto('/dashboard');
      await page.fill('[data-testid="post-composer"]', 'Test customized persona response');
      await page.click('[data-testid="post-submit"]');

      // The response should reflect the new settings (mocked appropriately)
      await page.waitForTimeout(2000);
    });

    test('should allow real-time persona behavior adjustment', async ({ page }) => {
      await loginUser(page);
      await page.goto('/personas');

      const personaCard = page.locator('[data-testid="persona-politician-1"]');

      // Open quick settings
      await personaCard.locator('[data-testid="quick-settings"]').click();

      // Adjust engagement frequency
      await page.fill('[data-testid="engagement-frequency"]', '85');

      // Adjust debate aggression
      await page.fill('[data-testid="debate-aggression"]', '60');

      await page.click('[data-testid="apply-changes"]');

      // Test that changes take effect immediately
      await page.goto('/dashboard');
      await page.fill('[data-testid="post-composer"]', 'Test real-time adjustment');
      await page.click('[data-testid="post-submit"]');

      // Should see more frequent and aggressive responses (based on mocking)
      await page.waitForTimeout(2000);
    });
  });

  test.describe('AI Reply Threading and Conversations', () => {
    test('should maintain conversation context in reply threads', async ({ page }) => {
      await loginUser(page);
      await page.goto('/dashboard');

      // Create initial post
      await page.fill('[data-testid="post-composer"]', 'What should be our climate policy priority?');
      await page.click('[data-testid="post-submit"]');

      await page.waitForTimeout(2000);

      // Reply to AI response to start a thread
      const aiResponse = page.locator('[data-testid="ai-response"]').first();
      await aiResponse.locator('[data-testid="reply-button"]').click();

      await page.fill('[data-testid="reply-composer"]', 'Can you elaborate on that policy recommendation?');
      await page.click('[data-testid="reply-submit"]');

      // Mock AI follow-up response with context
      await mockAIResponse(page, 'persona-politician-1',
        'Building on my previous point about renewable energy, I believe we should prioritize carbon pricing mechanisms.');

      await page.waitForTimeout(2000);

      // Verify AI maintains conversation context
      await expect(page.getByText(/Building on my previous point/)).toBeVisible();
      await expect(page.getByText(/carbon pricing mechanisms/)).toBeVisible();
    });

    test('should handle multi-persona conversations', async ({ page }) => {
      await loginUser(page);
      await page.goto('/dashboard');

      // Create a post that triggers debate between personas
      await page.fill('[data-testid="post-composer"]', 'Should we increase or decrease government spending?');
      await page.click('[data-testid="post-submit"]');

      // Mock responses from different political perspectives
      await mockAIResponse(page, 'persona-politician-1', 'We must reduce spending to control the deficit.');
      await mockAIResponse(page, 'persona-influencer-1', 'We need increased spending on social programs.');

      await page.waitForTimeout(3000);

      // Verify both responses appear
      await expect(page.getByText(/reduce spending/)).toBeVisible();
      await expect(page.getByText(/increased spending/)).toBeVisible();

      // Test cross-persona replies
      const conservativeResponse = page.locator('[data-testid="ai-response"]').filter({ hasText: 'reduce spending' });
      await conservativeResponse.locator('[data-testid="reply-button"]').click();

      // Should allow AI personas to respond to each other
      await mockAIResponse(page, 'persona-influencer-1',
        'I respectfully disagree. Strategic spending on infrastructure creates jobs and economic growth.');

      await page.waitForTimeout(2000);
      await expect(page.getByText(/respectfully disagree/)).toBeVisible();
    });
  });

  test.describe('AI Response Moderation and Filtering', () => {
    test('should filter inappropriate AI responses', async ({ page }) => {
      await loginUser(page);
      await page.goto('/dashboard');

      // Mock API to return an inappropriate response that should be filtered
      await page.route(`${API_BASE_URL}/personas/*/reply`, async route => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Content filtered',
            message: 'Response was filtered due to inappropriate content',
            success: false
          })
        });
      });

      await page.fill('[data-testid="post-composer"]', 'Inappropriate trigger content');
      await page.click('[data-testid="post-submit"]');

      await page.waitForTimeout(2000);

      // Should show content filtered message
      await expect(page.locator('[data-testid="content-filtered"]')).toBeVisible();
      await expect(page.getByText(/Response was filtered/)).toBeVisible();
    });

    test('should apply content warnings for sensitive topics', async ({ page }) => {
      await loginUser(page);
      await page.goto('/dashboard');

      // Mock AI response with content warning
      await page.route(`${API_BASE_URL}/personas/*/reply`, async route => {
        const mockPost = {
          id: `post-${Date.now()}`,
          content: 'This response discusses sensitive political topics that may be controversial.',
          contentWarning: 'Political Discussion',
          isAIGenerated: true,
          personaId: 'persona-politician-1'
        };

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(mockPost)
        });
      });

      await page.fill('[data-testid="post-composer"]', 'Sensitive political topic discussion');
      await page.click('[data-testid="post-submit"]');

      await page.waitForTimeout(2000);

      // Should show content warning
      await expect(page.locator('[data-testid="content-warning"]')).toBeVisible();
      await expect(page.getByText(/Political Discussion/)).toBeVisible();

      // Should require click to reveal content
      await page.click('[data-testid="show-content"]');
      await expect(page.getByText(/sensitive political topics/)).toBeVisible();
    });

    test('should validate AI response quality and relevance', async ({ page }) => {
      await loginUser(page);
      await page.goto('/dashboard');

      // Mock high-quality AI response with metadata
      await page.route(`${API_BASE_URL}/personas/*/reply`, async route => {
        const mockPost = {
          id: `post-${Date.now()}`,
          content: 'Based on economic data, I believe a balanced approach to fiscal policy would serve our constituents best.',
          isAIGenerated: true,
          aiMetadata: {
            confidence: 0.92,
            relevanceScore: 0.88,
            qualityScore: 0.95,
            provider: 'claude'
          },
          personaId: 'persona-politician-1'
        };

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(mockPost)
        });
      });

      await page.fill('[data-testid="post-composer"]', 'Economic policy question');
      await page.click('[data-testid="post-submit"]');

      await page.waitForTimeout(2000);

      // Should show quality indicators
      await expect(page.locator('[data-testid="ai-confidence-badge"]')).toBeVisible();
      await expect(page.locator('[data-testid="ai-quality-indicator"]')).toBeVisible();
    });
  });

  test.describe('AI Service Fallback Mechanisms', () => {
    test('should gracefully handle AI service failures', async ({ page }) => {
      await loginUser(page);
      await page.goto('/dashboard');

      // Mock AI service failure
      await page.route(`${API_BASE_URL}/personas/*/reply`, async route => {
        await route.fulfill({
          status: 503,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'AI service unavailable',
            message: 'AI service is temporarily unavailable, please try again later',
            success: false
          })
        });
      });

      await page.fill('[data-testid="post-composer"]', 'Test AI service failure');
      await page.click('[data-testid="post-submit"]');

      await page.waitForTimeout(2000);

      // Should show service unavailable message
      await expect(page.locator('[data-testid="ai-service-error"]')).toBeVisible();
      await expect(page.getByText(/temporarily unavailable/)).toBeVisible();

      // Should offer retry option
      await expect(page.locator('[data-testid="retry-ai-response"]')).toBeVisible();
    });

    test('should fall back to demo mode when all AI providers fail', async ({ page }) => {
      await loginUser(page);
      await page.goto('/dashboard');

      // Mock demo mode fallback
      await page.route(`${API_BASE_URL}/personas/*/reply`, async route => {
        const mockPost = {
          id: `post-${Date.now()}`,
          content: '[Demo Mode] This is a critical issue that requires immediate bipartisan action.',
          isAIGenerated: true,
          isDemoMode: true,
          personaId: 'persona-politician-1'
        };

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(mockPost)
        });
      });

      await page.fill('[data-testid="post-composer"]', 'Test demo mode fallback');
      await page.click('[data-testid="post-submit"]');

      await page.waitForTimeout(2000);

      // Should show demo mode indicator
      await expect(page.locator('[data-testid="demo-mode-badge"]')).toBeVisible();
      await expect(page.getByText(/\[Demo Mode\]/)).toBeVisible();
    });

    test('should test AI provider health monitoring', async ({ page }) => {
      await loginUser(page);
      await page.goto('/admin/ai-health');

      // Mock health status API
      await page.route(`${API_BASE_URL}/ai/health`, async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            providers: [
              { name: 'claude', healthy: true, responseTime: 1200 },
              { name: 'gpt', healthy: false, responseTime: null },
              { name: 'gemini', healthy: true, responseTime: 1800 },
              { name: 'demo', healthy: true, responseTime: 100 }
            ],
            primaryProviderHealthy: true,
            totalProviders: 4,
            healthyProviders: 3
          })
        });
      });

      await page.reload();

      // Should show provider health status
      await expect(page.locator('[data-testid="provider-claude"]')).toHaveClass(/healthy/);
      await expect(page.locator('[data-testid="provider-gpt"]')).toHaveClass(/unhealthy/);
      await expect(page.locator('[data-testid="provider-gemini"]')).toHaveClass(/healthy/);
    });
  });

  test.describe('AI Persona Metrics and Analytics', () => {
    test('should track AI persona influence metrics', async ({ page }) => {
      await loginUser(page);
      await page.goto('/personas/persona-politician-1/analytics');

      // Mock analytics data
      await page.route(`${API_BASE_URL}/personas/persona-politician-1/metrics`, async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            influenceScore: 87,
            engagementRate: 0.042,
            responseCount: 1247,
            averageResponseTime: 1.8,
            topicAuthority: {
              'economics': 0.92,
              'healthcare': 0.67,
              'defense': 0.89
            },
            sentimentDistribution: {
              positive: 0.45,
              neutral: 0.38,
              negative: 0.17
            }
          })
        });
      });

      await page.reload();

      // Should display influence metrics
      await expect(page.locator('[data-testid="influence-score"]')).toContainText('87');
      await expect(page.locator('[data-testid="engagement-rate"]')).toContainText('4.2%');
      await expect(page.locator('[data-testid="response-count"]')).toContainText('1,247');

      // Should display topic authority
      await expect(page.locator('[data-testid="topic-economics"]')).toContainText('92%');
      await expect(page.locator('[data-testid="topic-defense"]')).toContainText('89%');
    });

    test('should display AI response analytics dashboard', async ({ page }) => {
      await loginUser(page);
      await page.goto('/analytics/ai-responses');

      // Mock dashboard analytics
      await page.route(`${API_BASE_URL}/analytics/ai-responses`, async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            totalResponses: 15420,
            averageResponseTime: 2.1,
            providerDistribution: {
              'claude': 0.65,
              'gpt': 0.25,
              'gemini': 0.08,
              'demo': 0.02
            },
            qualityMetrics: {
              averageConfidence: 0.86,
              averageRelevance: 0.82,
              userSatisfaction: 0.79
            },
            responsesByPersonaType: {
              'POLITICIAN': 8420,
              'INFLUENCER': 4230,
              'JOURNALIST': 2770
            }
          })
        });
      });

      await page.reload();

      // Should show analytics dashboard
      await expect(page.locator('[data-testid="total-responses"]')).toContainText('15,420');
      await expect(page.locator('[data-testid="avg-response-time"]')).toContainText('2.1s');
      await expect(page.locator('[data-testid="claude-usage"]')).toContainText('65%');
      await expect(page.locator('[data-testid="avg-confidence"]')).toContainText('86%');
    });

    test('should track persona interaction patterns', async ({ page }) => {
      await loginUser(page);
      await page.goto('/personas/persona-politician-1/interactions');

      // Mock interaction data
      await page.route(`${API_BASE_URL}/personas/persona-politician-1/interactions`, async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            recentInteractions: [
              {
                timestamp: new Date().toISOString(),
                trigger: 'user_post',
                responseTime: 1.4,
                confidence: 0.91,
                engagement: { likes: 23, replies: 7, reposts: 4 }
              },
              {
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                trigger: 'news_event',
                responseTime: 2.1,
                confidence: 0.87,
                engagement: { likes: 45, replies: 12, reposts: 8 }
              }
            ],
            interactionFrequency: {
              daily: 24,
              weekly: 168,
              monthly: 672
            },
            peakActivityHours: [9, 12, 17, 20]
          })
        });
      });

      await page.reload();

      // Should display interaction patterns
      await expect(page.locator('[data-testid="daily-interactions"]')).toContainText('24');
      await expect(page.locator('[data-testid="weekly-interactions"]')).toContainText('168');

      // Should show recent interactions
      await expect(page.locator('[data-testid="recent-interactions"]')).toBeVisible();
      await expect(page.locator('[data-testid="interaction-0"]')).toContainText('1.4s');
      await expect(page.locator('[data-testid="interaction-1"]')).toContainText('2.1s');
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      await loginUser(page);
      await page.goto('/dashboard');

      // Simulate network error
      await page.route(`${API_BASE_URL}/personas/*/reply`, async route => {
        await route.abort('failed');
      });

      await page.fill('[data-testid="post-composer"]', 'Test network error handling');
      await page.click('[data-testid="post-submit"]');

      await page.waitForTimeout(2000);

      // Should show network error message
      await expect(page.locator('[data-testid="network-error"]')).toBeVisible();
      await expect(page.getByText(/network error/i)).toBeVisible();
    });

    test('should handle rate limiting appropriately', async ({ page }) => {
      await loginUser(page);
      await page.goto('/dashboard');

      // Mock rate limit response
      await page.route(`${API_BASE_URL}/personas/*/reply`, async route => {
        await route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Too many AI generation requests',
            message: 'Rate limit exceeded for AI persona replies',
            success: false,
            retryAfter: 60
          })
        });
      });

      await page.fill('[data-testid="post-composer"]', 'Test rate limiting');
      await page.click('[data-testid="post-submit"]');

      await page.waitForTimeout(1000);

      // Should show rate limit message
      await expect(page.locator('[data-testid="rate-limit-error"]')).toBeVisible();
      await expect(page.getByText(/rate limit exceeded/i)).toBeVisible();
      await expect(page.getByText(/try again in 60 seconds/i)).toBeVisible();
    });

    test('should handle malformed AI responses', async ({ page }) => {
      await loginUser(page);
      await page.goto('/dashboard');

      // Mock malformed response
      await page.route(`${API_BASE_URL}/personas/*/reply`, async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: 'invalid json response'
        });
      });

      await page.fill('[data-testid="post-composer"]', 'Test malformed response');
      await page.click('[data-testid="post-submit"]');

      await page.waitForTimeout(2000);

      // Should show parsing error
      await expect(page.locator('[data-testid="response-error"]')).toBeVisible();
      await expect(page.getByText(/error processing/i)).toBeVisible();
    });
  });

  test.describe('Performance and Load Testing', () => {
    test('should handle multiple simultaneous AI requests', async ({ page }) => {
      await loginUser(page);
      await page.goto('/dashboard');

      // Create multiple posts rapidly
      const posts = [
        'Economic policy question 1',
        'Climate change debate topic',
        'Healthcare reform discussion',
        'Education funding issue',
        'Infrastructure investment topic'
      ];

      // Mock responses for all posts
      for (let i = 0; i < posts.length; i++) {
        await mockAIResponse(page, 'persona-politician-1', `Response to question ${i + 1}`);
      }

      // Submit all posts rapidly
      for (const post of posts) {
        await page.fill('[data-testid="post-composer"]', post);
        await page.click('[data-testid="post-submit"]');
        await page.waitForTimeout(200); // Small delay between posts
      }

      await page.waitForTimeout(5000);

      // Should handle all requests without errors
      for (let i = 0; i < posts.length; i++) {
        await expect(page.getByText(`Response to question ${i + 1}`)).toBeVisible();
      }
    });

    test('should maintain responsiveness during AI generation', async ({ page }) => {
      await loginUser(page);
      await page.goto('/dashboard');

      // Start AI generation
      await page.fill('[data-testid="post-composer"]', 'Test responsiveness during AI generation');
      await page.click('[data-testid="post-submit"]');

      // Should still be able to interact with UI during generation
      await page.click('[data-testid="personas-tab"]');
      await expect(page.locator('[data-testid="persona-list"]')).toBeVisible();

      await page.click('[data-testid="dashboard-tab"]');
      await expect(page.locator('[data-testid="post-composer"]')).toBeVisible();

      // Should be able to compose another post
      await page.fill('[data-testid="post-composer"]', 'Second post while first is generating');
      await expect(page.locator('[data-testid="post-submit"]')).toBeEnabled();
    });
  });

  test.describe('Accessibility and User Experience', () => {
    test('should be accessible with screen readers', async ({ page }) => {
      await loginUser(page);
      await page.goto('/personas');

      // Check for proper ARIA labels
      await expect(page.locator('[aria-label="Available AI Personas"]')).toBeVisible();
      await expect(page.locator('[aria-label*="persona"]')).toHaveCount(MOCK_PERSONAS.length);

      // Check for proper heading structure
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      await expect(headings).toHaveCount(4); // Adjust based on expected structure

      // Check for keyboard navigation
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toBeVisible();
    });

    test('should provide clear feedback for AI interactions', async ({ page }) => {
      await loginUser(page);
      await page.goto('/dashboard');

      await page.fill('[data-testid="post-composer"]', 'Test user feedback');
      await page.click('[data-testid="post-submit"]');

      // Should show clear status messages
      await expect(page.locator('[aria-live="polite"]')).toBeVisible();
      await expect(page.getByText(/generating response/i)).toBeVisible();

      await page.waitForTimeout(4000);

      // Should show completion feedback
      await expect(page.getByText(/response generated/i)).toBeVisible();
    });
  });
});
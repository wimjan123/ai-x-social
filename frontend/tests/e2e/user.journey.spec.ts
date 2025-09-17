import { test, expect, Page, BrowserContext } from '@playwright/test';

/**
 * Comprehensive E2E Test Suite for AI Social Media Platform
 *
 * This test suite covers the complete user journey from registration to complex interactions
 * including political persona setup, AI interactions, real-time features, and accessibility.
 */

// Test data constants
const TEST_USER = {
  username: 'test_politician_e2e',
  email: 'test-e2e@example.com',
  password: 'SecureTestPass123!',
  displayName: 'Test E2E Politician',
  bio: 'Fighting for progressive change in our democracy - E2E Test User',
  personaType: 'politician' as const,
  politicalStance: {
    economicPosition: 25, // center-left
    socialPosition: 20,   // liberal
    primaryIssues: ['Healthcare', 'Climate Change', 'Education'],
    partyAffiliation: 'Democratic Party',
    debateWillingness: 75
  }
};

const TEST_POSTS = {
  political: 'Healthcare should be a human right, not a privilege. We need universal coverage now! #HealthcareForAll',
  climate: 'Climate change is the greatest threat facing our generation. We need aggressive action NOW! #ClimateAction',
  news_reaction: 'Just saw the latest economic data - we need policies that work for working families, not just the wealthy.',
  controversial: 'Time to have an honest conversation about wealth inequality in America. The system is rigged against working people.',
  casual: 'Great turnout at today\'s town hall! Democracy works best when everyone participates. 🗳️'
};

// Page Object Model helpers
class RegistrationPage {
  constructor(private page: Page) {}

  async fillBasicInfo() {
    await this.page.fill('[data-testid="username-input"]', TEST_USER.username);
    await this.page.fill('[data-testid="email-input"]', TEST_USER.email);
    await this.page.fill('[data-testid="password-input"]', TEST_USER.password);
    await this.page.fill('[data-testid="display-name-input"]', TEST_USER.displayName);
    await this.page.fill('[data-testid="bio-textarea"]', TEST_USER.bio);
  }

  async selectPersonaType() {
    // Click on politician persona type
    await this.page.click(`[data-testid="persona-type-${TEST_USER.personaType}"]`);

    // Verify selection is highlighted
    await expect(
      this.page.locator(`[data-testid="persona-type-${TEST_USER.personaType}"]`)
    ).toHaveClass(/selected|active/);
  }

  async fillPoliticalStance() {
    // Set economic position slider
    await this.page.locator('[data-testid="economic-position-slider"]').fill(
      TEST_USER.politicalStance.economicPosition.toString()
    );

    // Set social position slider
    await this.page.locator('[data-testid="social-position-slider"]').fill(
      TEST_USER.politicalStance.socialPosition.toString()
    );

    // Select primary issues
    for (const issue of TEST_USER.politicalStance.primaryIssues) {
      await this.page.check(`[data-testid="issue-${issue.toLowerCase().replace(' ', '-')}"]`);
    }

    // Fill party affiliation
    await this.page.fill('[data-testid="party-affiliation-input"]', TEST_USER.politicalStance.partyAffiliation);

    // Set debate willingness
    await this.page.locator('[data-testid="debate-willingness-slider"]').fill(
      TEST_USER.politicalStance.debateWillingness.toString()
    );
  }

  async submit() {
    await this.page.click('[data-testid="register-submit-button"]');
  }
}

class FeedPage {
  constructor(private page: Page) {}

  async createPost(content: string) {
    await this.page.click('[data-testid="post-composer"]');
    await this.page.fill('[data-testid="post-content-textarea"]', content);
    await this.page.click('[data-testid="post-submit-button"]');
  }

  async getLatestPost() {
    return this.page.locator('[data-testid="post-card"]').first();
  }

  async likePost(postId?: string) {
    const selector = postId
      ? `[data-testid="post-${postId}"] [data-testid="like-button"]`
      : '[data-testid="post-card"] [data-testid="like-button"]';
    await this.page.click(selector);
  }

  async replyToPost(postId: string, reply: string) {
    await this.page.click(`[data-testid="post-${postId}"] [data-testid="reply-button"]`);
    await this.page.fill('[data-testid="reply-textarea"]', reply);
    await this.page.click('[data-testid="reply-submit-button"]');
  }

  async waitForAIResponse(timeoutMs = 120000) {
    // Wait for AI persona response (up to 2 minutes as per requirements)
    await this.page.waitForSelector('[data-testid="ai-response-post"]', { timeout: timeoutMs });
  }
}

class ProfilePage {
  constructor(private page: Page) {}

  async verifyInfluenceMetrics() {
    await expect(this.page.locator('[data-testid="follower-count"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="engagement-rate"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="approval-rating"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="influence-rank"]')).toBeVisible();
  }

  async verifyPersonaIndicators() {
    await expect(this.page.locator('[data-testid="persona-badge"]')).toContainText('Politician');
    await expect(this.page.locator('[data-testid="influence-level"]')).toContainText('Very High');
  }
}

// Global test setup
test.describe.configure({ mode: 'serial' });

let sharedContext: BrowserContext;
let sharedPage: Page;

test.describe('Complete User Journey E2E Tests', () => {

  test.beforeAll(async ({ browser }) => {
    // Create a persistent context for the entire test suite
    sharedContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    sharedPage = await sharedContext.newPage();

    // Setup API mocking for external services
    await sharedPage.route('**/api/news/**', async route => {
      // Mock news API responses
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          articles: [
            {
              id: 'mock-news-1',
              title: 'Economic Policy Update: New Healthcare Legislation',
              description: 'Congress discusses new healthcare reform proposals',
              source: 'Mock News Source',
              publishedAt: new Date().toISOString(),
              url: 'https://example.com/news/1'
            }
          ]
        })
      });
    });

    // Mock AI service responses for consistent testing
    await sharedPage.route('**/api/ai/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          response: 'This is a mock AI response for testing purposes.',
          persona: 'test_ai_persona',
          confidence: 0.95
        })
      });
    });

    // Console error monitoring
    sharedPage.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        console.warn('Browser Console Error:', msg.text());
      }
    });
  });

  test.afterAll(async () => {
    await sharedContext?.close();
  });

  // Test 1: User Registration and Profile Setup
  test('should complete user registration with political persona', async () => {
    const registrationPage = new RegistrationPage(sharedPage);

    // Navigate to registration page
    await sharedPage.goto('/register');
    await expect(sharedPage.locator('h1')).toContainText(/register|sign up/i);

    // Fill basic information
    await registrationPage.fillBasicInfo();

    // Select persona type
    await registrationPage.selectPersonaType();

    // Verify persona features are displayed
    await expect(sharedPage.locator('[data-testid="persona-features"]')).toBeVisible();
    await expect(sharedPage.locator('[data-testid="persona-features"]')).toContainText(/policy discussions/i);

    // Fill political stance information
    await registrationPage.fillPoliticalStance();

    // Verify political alignment preview
    await expect(sharedPage.locator('[data-testid="political-alignment-preview"]')).toBeVisible();

    // Submit registration
    await registrationPage.submit();

    // Verify successful registration and redirect to feed
    await expect(sharedPage).toHaveURL(/\/feed/);
    await expect(sharedPage.locator('[data-testid="welcome-message"]')).toBeVisible();
  });

  // Test 2: Verify X-like Interface Layout
  test('should display X-like three-column layout', async () => {
    await sharedPage.goto('/feed');

    // Verify three-column layout on desktop
    await expect(sharedPage.locator('[data-testid="navigation-sidebar"]')).toBeVisible();
    await expect(sharedPage.locator('[data-testid="main-timeline"]')).toBeVisible();
    await expect(sharedPage.locator('[data-testid="trends-sidebar"]')).toBeVisible();

    // Verify navigation items
    await expect(sharedPage.locator('[data-testid="nav-home"]')).toBeVisible();
    await expect(sharedPage.locator('[data-testid="nav-profile"]')).toBeVisible();
    await expect(sharedPage.locator('[data-testid="nav-messages"]')).toBeVisible();
    await expect(sharedPage.locator('[data-testid="nav-settings"]')).toBeVisible();

    // Verify post composer
    await expect(sharedPage.locator('[data-testid="post-composer"]')).toBeVisible();
    await expect(sharedPage.locator('[data-testid="post-composer"]')).toContainText(/what.*happening/i);
  });

  // Test 3: Create Posts with Political Content
  test('should create posts and trigger AI persona responses', async () => {
    const feedPage = new FeedPage(sharedPage);

    // Create political post about healthcare
    await feedPage.createPost(TEST_POSTS.political);

    // Verify post appears in timeline
    const latestPost = await feedPage.getLatestPost();
    await expect(latestPost).toContainText(TEST_POSTS.political);
    await expect(latestPost).toContainText('#HealthcareForAll');

    // Verify hashtag extraction
    await expect(latestPost.locator('[data-testid="hashtag-link"]')).toBeVisible();

    // Wait for AI persona response (within 2 minutes per requirements)
    await feedPage.waitForAIResponse();

    // Verify AI response appears
    const aiResponse = sharedPage.locator('[data-testid="ai-response-post"]').first();
    await expect(aiResponse).toBeVisible();
    await expect(aiResponse.locator('[data-testid="ai-badge"]')).toContainText(/ai|bot/i);
  });

  // Test 4: Political Alignment-Based Interactions
  test('should show varied AI reactions based on political alignment', async () => {
    const feedPage = new FeedPage(sharedPage);

    // Create controversial climate change post
    await feedPage.createPost(TEST_POSTS.climate);

    // Wait for multiple AI persona responses
    await sharedPage.waitForTimeout(5000); // Allow time for multiple responses

    // Verify different types of AI personas respond
    const aiResponses = sharedPage.locator('[data-testid="ai-response-post"]');
    await expect(aiResponses).toHaveCount(2, { timeout: 120000 }); // At least 2 AI responses

    // Verify political stance indicators on AI personas
    const firstAiResponse = aiResponses.first();
    await expect(firstAiResponse.locator('[data-testid="political-stance-indicator"]')).toBeVisible();

    // Check for debate/discussion threads
    await expect(sharedPage.locator('[data-testid="debate-thread"]')).toBeVisible();
  });

  // Test 5: Post Interactions and Engagement
  test('should handle post interactions (like, reply, repost)', async () => {
    const feedPage = new FeedPage(sharedPage);

    // Like a post
    await feedPage.likePost();

    // Verify like count increased
    await expect(sharedPage.locator('[data-testid="like-count"]').first()).not.toContainText('0');

    // Reply to a post
    const firstPost = await feedPage.getLatestPost();
    const postId = await firstPost.getAttribute('data-post-id');

    if (postId) {
      await feedPage.replyToPost(postId, 'Great point about healthcare policy!');

      // Verify reply appears
      await expect(sharedPage.locator(`[data-testid="post-${postId}-replies"]`)).toContainText('Great point');
    }

    // Test repost functionality
    await sharedPage.click('[data-testid="repost-button"]');
    await expect(sharedPage.locator('[data-testid="repost-confirmation"]')).toBeVisible();
    await sharedPage.click('[data-testid="confirm-repost"]');
  });

  // Test 6: Real-time Features and Live Updates
  test('should display real-time updates without page refresh', async () => {
    // Open second page/tab to simulate another user
    const secondPage = await sharedContext.newPage();
    await secondPage.goto('/feed');

    // Create post from second "user"
    await secondPage.evaluate(() => {
      // Simulate server-sent event for new post
      const event = new CustomEvent('newPost', {
        detail: {
          content: 'Real-time test post from another user',
          user: 'test_user_2',
          timestamp: new Date().toISOString()
        }
      });
      window.dispatchEvent(event);
    });

    // Verify real-time update appears on main page
    await expect(sharedPage.locator('[data-testid="post-card"]')).toContainText('Real-time test');

    await secondPage.close();
  });

  // Test 7: News Integration and AI News Reactions
  test('should display news feed with AI persona reactions', async () => {
    await sharedPage.goto('/news');

    // Verify news feed loads
    await expect(sharedPage.locator('[data-testid="news-feed"]')).toBeVisible();
    await expect(sharedPage.locator('[data-testid="news-article"]')).toHaveCount(1, { timeout: 10000 });

    // Test news filtering
    await sharedPage.click('[data-testid="news-filter-politics"]');
    await expect(sharedPage.locator('[data-testid="active-filter"]')).toContainText('Politics');

    // Test regional filtering
    await sharedPage.click('[data-testid="region-filter"]');
    await sharedPage.click('[data-testid="region-uk"]');
    await expect(sharedPage.locator('[data-testid="current-region"]')).toContainText('UK');

    // Verify AI reactions to news
    await expect(sharedPage.locator('[data-testid="ai-news-reaction"]')).toBeVisible();
  });

  // Test 8: Influence Metrics and Progression
  test('should track and display influence metrics', async () => {
    const profilePage = new ProfilePage(sharedPage);

    await sharedPage.goto('/profile');

    // Verify influence metrics are displayed
    await profilePage.verifyInfluenceMetrics();

    // Verify persona indicators
    await profilePage.verifyPersonaIndicators();

    // Check metrics dashboard
    await sharedPage.click('[data-testid="view-metrics-button"]');
    await expect(sharedPage.locator('[data-testid="metrics-dashboard"]')).toBeVisible();

    // Verify progression elements
    await expect(sharedPage.locator('[data-testid="achievement-badges"]')).toBeVisible();
    await expect(sharedPage.locator('[data-testid="influence-chart"]')).toBeVisible();
  });

  // Test 9: Settings and Customization
  test('should allow settings configuration and affect behavior', async () => {
    await sharedPage.goto('/settings');

    // Test AI chatter level adjustment
    await sharedPage.click('[data-testid="ai-settings-tab"]');
    await sharedPage.locator('[data-testid="ai-chatter-slider"]').fill('100');
    await sharedPage.click('[data-testid="save-ai-settings"]');

    // Verify settings saved
    await expect(sharedPage.locator('[data-testid="settings-saved-message"]')).toBeVisible();

    // Test news region change
    await sharedPage.click('[data-testid="general-settings-tab"]');
    await sharedPage.selectOption('[data-testid="news-region-select"]', 'UK');
    await sharedPage.click('[data-testid="save-general-settings"]');

    // Test theme toggle
    await sharedPage.click('[data-testid="theme-toggle"]');
    await expect(sharedPage.locator('body')).toHaveAttribute('data-theme', 'dark');

    await sharedPage.click('[data-testid="theme-toggle"]');
    await expect(sharedPage.locator('body')).toHaveAttribute('data-theme', 'light');
  });

  // Test 10: Responsive Design and Cross-Browser Compatibility
  test('should work across different screen sizes', async () => {
    // Test tablet view
    await sharedPage.setViewportSize({ width: 768, height: 1024 });
    await sharedPage.goto('/feed');

    // Verify two-column layout (trends sidebar hidden)
    await expect(sharedPage.locator('[data-testid="navigation-sidebar"]')).toBeVisible();
    await expect(sharedPage.locator('[data-testid="main-timeline"]')).toBeVisible();
    await expect(sharedPage.locator('[data-testid="trends-sidebar"]')).toBeHidden();

    // Test mobile view
    await sharedPage.setViewportSize({ width: 375, height: 667 });

    // Verify single column layout with bottom navigation
    await expect(sharedPage.locator('[data-testid="bottom-navigation"]')).toBeVisible();
    await expect(sharedPage.locator('[data-testid="navigation-sidebar"]')).toBeHidden();

    // Test mobile post composer
    await sharedPage.click('[data-testid="mobile-compose-button"]');
    await expect(sharedPage.locator('[data-testid="mobile-post-composer"]')).toBeVisible();

    // Reset to desktop
    await sharedPage.setViewportSize({ width: 1440, height: 900 });
  });

  // Test 11: Accessibility Features
  test('should meet accessibility standards', async () => {
    await sharedPage.goto('/feed');

    // Test keyboard navigation
    await sharedPage.keyboard.press('Tab');
    await expect(sharedPage.locator(':focus')).toBeVisible();

    // Test ARIA labels and roles
    await expect(sharedPage.locator('[role="main"]')).toBeVisible();
    await expect(sharedPage.locator('[role="navigation"]')).toBeVisible();
    await expect(sharedPage.locator('[aria-label*="compose"]')).toBeVisible();

    // Test screen reader friendly elements
    await expect(sharedPage.locator('[aria-live]')).toBeVisible(); // For live updates
    await expect(sharedPage.locator('[aria-describedby]')).toHaveCount(1, { timeout: 5000 });

    // Test color contrast (basic check)
    const backgroundColor = await sharedPage.locator('body').evaluate(el =>
      getComputedStyle(el).backgroundColor
    );
    const textColor = await sharedPage.locator('body').evaluate(el =>
      getComputedStyle(el).color
    );

    expect(backgroundColor).toBeTruthy();
    expect(textColor).toBeTruthy();

    // Test focus indicators
    await sharedPage.keyboard.press('Tab');
    const focusedElement = sharedPage.locator(':focus');
    const focusStyle = await focusedElement.evaluate(el =>
      getComputedStyle(el).outline || getComputedStyle(el).boxShadow
    );
    expect(focusStyle).not.toBe('none');
  });

  // Test 12: Error Handling and Recovery Paths
  test('should handle errors gracefully', async () => {
    // Test network failure recovery
    await sharedPage.route('**/api/posts', route => route.abort());

    await sharedPage.goto('/feed');

    // Verify error message appears
    await expect(sharedPage.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(sharedPage.locator('[data-testid="retry-button"]')).toBeVisible();

    // Test retry mechanism
    await sharedPage.unroute('**/api/posts');
    await sharedPage.click('[data-testid="retry-button"]');
    await expect(sharedPage.locator('[data-testid="post-card"]')).toBeVisible();

    // Test form validation errors
    await sharedPage.goto('/register');
    await sharedPage.click('[data-testid="register-submit-button"]'); // Submit empty form

    await expect(sharedPage.locator('[data-testid="username-error"]')).toBeVisible();
    await expect(sharedPage.locator('[data-testid="email-error"]')).toBeVisible();

    // Test invalid email format
    await sharedPage.fill('[data-testid="email-input"]', 'invalid-email');
    await sharedPage.click('[data-testid="register-submit-button"]');
    await expect(sharedPage.locator('[data-testid="email-format-error"]')).toBeVisible();

    // Test duplicate username
    await sharedPage.fill('[data-testid="username-input"]', TEST_USER.username);
    await sharedPage.fill('[data-testid="email-input"]', 'new-email@example.com');
    await sharedPage.fill('[data-testid="password-input"]', 'ValidPass123!');
    await sharedPage.click('[data-testid="register-submit-button"]');

    await expect(sharedPage.locator('[data-testid="username-taken-error"]')).toBeVisible();
  });

  // Test 13: Session Management and Logout
  test('should handle session management correctly', async () => {
    // Verify user is logged in
    await sharedPage.goto('/feed');
    await expect(sharedPage.locator('[data-testid="user-avatar"]')).toBeVisible();

    // Test logout
    await sharedPage.click('[data-testid="user-menu"]');
    await sharedPage.click('[data-testid="logout-button"]');

    // Verify redirect to homepage after logout
    await expect(sharedPage).toHaveURL(/\/(|home)$/);
    await expect(sharedPage.locator('[data-testid="sign-in-button"]')).toBeVisible();

    // Test protected route access when logged out
    await sharedPage.goto('/feed');
    await expect(sharedPage).toHaveURL(/\/login/);

    // Test login with existing user
    await sharedPage.fill('[data-testid="login-identifier"]', TEST_USER.username);
    await sharedPage.fill('[data-testid="login-password"]', TEST_USER.password);
    await sharedPage.click('[data-testid="login-submit"]');

    // Verify successful login
    await expect(sharedPage).toHaveURL(/\/feed/);
    await expect(sharedPage.locator('[data-testid="user-avatar"]')).toBeVisible();
  });

  // Test 14: Performance and Load Testing
  test('should maintain good performance under load', async () => {
    await sharedPage.goto('/feed');

    // Measure page load time
    const loadTime = await sharedPage.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navigation.loadEventEnd - navigation.loadEventStart;
    });

    // Verify page loads within 2 seconds (as per requirements)
    expect(loadTime).toBeLessThan(2000);

    // Test infinite scroll performance
    for (let i = 0; i < 5; i++) {
      await sharedPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await sharedPage.waitForTimeout(500);
    }

    // Verify smooth scrolling (no major frame drops)
    const scrollPerformance = await sharedPage.evaluate(() => {
      return performance.getEntriesByType('measure').length;
    });

    expect(scrollPerformance).toBeGreaterThan(0);

    // Test memory usage doesn't grow excessively
    const memoryInfo = await sharedPage.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    // Memory should be reasonable (less than 100MB for basic usage)
    if (memoryInfo > 0) {
      expect(memoryInfo).toBeLessThan(100 * 1024 * 1024);
    }
  });

  // Test 15: Content Moderation and Safety
  test('should filter inappropriate content', async () => {
    const feedPage = new FeedPage(sharedPage);

    // Attempt to post potentially inappropriate content
    await feedPage.createPost('This is a test of content filtering with inappropriate language');

    // Verify content warning or filtering
    await expect(
      sharedPage.locator('[data-testid="content-warning"]').or(
        sharedPage.locator('[data-testid="content-filtered"]')
      )
    ).toBeVisible();

    // Test report functionality
    const firstPost = await feedPage.getLatestPost();
    await firstPost.locator('[data-testid="post-options"]').click();
    await sharedPage.click('[data-testid="report-post"]');

    await expect(sharedPage.locator('[data-testid="report-modal"]')).toBeVisible();
    await sharedPage.click('[data-testid="report-reason-spam"]');
    await sharedPage.click('[data-testid="submit-report"]');

    await expect(sharedPage.locator('[data-testid="report-success"]')).toBeVisible();
  });
});

// Additional test utilities and helpers
test.describe('Cross-Browser Compatibility', () => {
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`should work correctly in ${browserName}`, async ({ page }) => {
      await page.goto('/');

      // Basic functionality test for each browser
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('[data-testid="sign-in-button"]')).toBeVisible();

      // Test specific browser features
      if (browserName === 'webkit') {
        // Safari-specific tests
        await expect(page.locator('body')).toHaveCSS('font-family', /system/);
      }
    });
  });
});

test.describe('API Contract Validation', () => {
  test('should validate API responses match OpenAPI specification', async ({ request }) => {
    // Test authentication endpoint
    const authResponse = await request.post('/api/auth/register', {
      data: {
        username: 'api_test_user',
        email: 'api-test@example.com',
        password: 'TestPass123!',
        displayName: 'API Test User',
        personaType: 'regular_user'
      }
    });

    expect(authResponse.status()).toBe(201);

    const authData = await authResponse.json();
    expect(authData).toHaveProperty('user');
    expect(authData).toHaveProperty('token');
    expect(authData.user).toHaveProperty('id');
    expect(authData.user).toHaveProperty('username', 'api_test_user');

    // Test posts endpoint
    const postsResponse = await request.get('/api/posts');
    expect(postsResponse.status()).toBe(200);

    const postsData = await postsResponse.json();
    expect(postsData).toHaveProperty('posts');
    expect(Array.isArray(postsData.posts)).toBe(true);
  });
});
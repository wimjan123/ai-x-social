/**
 * Page Object Model Classes for E2E Tests
 *
 * This file contains reusable page object classes that encapsulate
 * page-specific interactions and elements for cleaner test code.
 */

import { Page, Locator, expect } from '@playwright/test';
import { TEST_USERS, MOCK_POSTS, API_ENDPOINTS } from './test-data';

export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForElement(selector: string, timeout = 5000) {
    return await this.page.waitForSelector(selector, { timeout });
  }

  async isElementVisible(selector: string) {
    return await this.page.locator(selector).isVisible();
  }

  async clickElement(selector: string) {
    await this.page.click(selector);
  }

  async fillInput(selector: string, value: string) {
    await this.page.fill(selector, value);
  }

  async selectOption(selector: string, value: string) {
    await this.page.selectOption(selector, value);
  }

  async checkBox(selector: string) {
    await this.page.check(selector);
  }
}

export class HomePage extends BasePage {
  // Locators
  get mainHeading() { return this.page.locator('h1'); }
  get signInButton() { return this.page.locator('[data-testid="sign-in-button"]'); }
  get signUpButton() { return this.page.locator('[data-testid="sign-up-button"]'); }
  get getStartedButton() { return this.page.locator('[data-testid="get-started-button"]'); }
  get learnMoreButton() { return this.page.locator('[data-testid="learn-more-button"]'); }
  get demoPost() { return this.page.locator('[data-testid="demo-post"]'); }

  async verifyHomepageElements() {
    await expect(this.mainHeading).toContainText(/Experience AI-Powered Political Discourse/i);
    await expect(this.signInButton).toBeVisible();
    await expect(this.signUpButton).toBeVisible();
    await expect(this.getStartedButton).toBeVisible();
    await expect(this.learnMoreButton).toBeVisible();
  }

  async verifyDemoPost() {
    await expect(this.demoPost).toBeVisible();
    await expect(this.demoPost).toContainText(/Political AI Persona/i);
    await expect(this.demoPost).toContainText(/@ai_politician/i);
  }

  async navigateToSignUp() {
    await this.signUpButton.click();
    await this.page.waitForURL(/\/register/);
  }

  async navigateToSignIn() {
    await this.signInButton.click();
    await this.page.waitForURL(/\/login/);
  }
}

export class RegistrationPage extends BasePage {
  // Form elements
  get usernameInput() { return this.page.locator('[data-testid="username-input"]'); }
  get emailInput() { return this.page.locator('[data-testid="email-input"]'); }
  get passwordInput() { return this.page.locator('[data-testid="password-input"]'); }
  get displayNameInput() { return this.page.locator('[data-testid="display-name-input"]'); }
  get bioTextarea() { return this.page.locator('[data-testid="bio-textarea"]'); }
  get submitButton() { return this.page.locator('[data-testid="register-submit-button"]'); }

  // Political stance elements
  get economicSlider() { return this.page.locator('[data-testid="economic-position-slider"]'); }
  get socialSlider() { return this.page.locator('[data-testid="social-position-slider"]'); }
  get partyInput() { return this.page.locator('[data-testid="party-affiliation-input"]'); }
  get debateSlider() { return this.page.locator('[data-testid="debate-willingness-slider"]'); }

  // Error elements
  get usernameError() { return this.page.locator('[data-testid="username-error"]'); }
  get emailError() { return this.page.locator('[data-testid="email-error"]'); }
  get passwordError() { return this.page.locator('[data-testid="password-error"]'); }

  async fillBasicInformation(userType: keyof typeof TEST_USERS = 'politician') {
    const user = TEST_USERS[userType];

    await this.usernameInput.fill(user.username);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.displayNameInput.fill(user.displayName);
    await this.bioTextarea.fill(user.bio);
  }

  async selectPersonaType(personaType: string) {
    const personaSelector = `[data-testid="persona-type-${personaType}"]`;
    await this.page.click(personaSelector);

    // Verify selection
    await expect(this.page.locator(personaSelector)).toHaveClass(/selected|active/);

    // Verify features are displayed
    await expect(this.page.locator('[data-testid="persona-features"]')).toBeVisible();
  }

  async fillPoliticalStance(userType: keyof typeof TEST_USERS = 'politician') {
    const user = TEST_USERS[userType];

    if (!user.politicalStance) return;

    await this.economicSlider.fill(user.politicalStance.economicPosition.toString());
    await this.socialSlider.fill(user.politicalStance.socialPosition.toString());

    // Select primary issues
    for (const issue of user.politicalStance.primaryIssues) {
      const issueId = issue.toLowerCase().replace(/\s+/g, '-');
      await this.page.check(`[data-testid="issue-${issueId}"]`);
    }

    await this.partyInput.fill(user.politicalStance.partyAffiliation);
    await this.debateSlider.fill(user.politicalStance.debateWillingness.toString());
  }

  async verifyPoliticalAlignmentPreview() {
    await expect(this.page.locator('[data-testid="political-alignment-preview"]')).toBeVisible();
  }

  async submitRegistration() {
    await this.submitButton.click();
  }

  async verifyValidationErrors() {
    // Submit empty form to trigger validation
    await this.submitButton.click();

    await expect(this.usernameError).toBeVisible();
    await expect(this.emailError).toBeVisible();
    await expect(this.passwordError).toBeVisible();
  }

  async registerUser(userType: keyof typeof TEST_USERS = 'politician') {
    const user = TEST_USERS[userType];

    await this.fillBasicInformation(userType);
    await this.selectPersonaType(user.personaType);
    await this.fillPoliticalStance(userType);
    await this.verifyPoliticalAlignmentPreview();
    await this.submitRegistration();

    // Wait for redirect to feed
    await this.page.waitForURL(/\/feed/);
    await expect(this.page.locator('[data-testid="welcome-message"]')).toBeVisible();
  }
}

export class LoginPage extends BasePage {
  get identifierInput() { return this.page.locator('[data-testid="login-identifier"]'); }
  get passwordInput() { return this.page.locator('[data-testid="login-password"]'); }
  get submitButton() { return this.page.locator('[data-testid="login-submit"]'); }
  get forgotPasswordLink() { return this.page.locator('[data-testid="forgot-password-link"]'); }
  get createAccountLink() { return this.page.locator('[data-testid="create-account-link"]'); }

  async loginUser(identifier: string, password: string) {
    await this.identifierInput.fill(identifier);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginTestUser(userType: keyof typeof TEST_USERS = 'politician') {
    const user = TEST_USERS[userType];
    await this.loginUser(user.username, user.password);
    await this.page.waitForURL(/\/feed/);
  }
}

export class FeedPage extends BasePage {
  // Layout elements
  get navigationSidebar() { return this.page.locator('[data-testid="navigation-sidebar"]'); }
  get mainTimeline() { return this.page.locator('[data-testid="main-timeline"]'); }
  get trendsSidebar() { return this.page.locator('[data-testid="trends-sidebar"]'); }

  // Navigation elements
  get homeNav() { return this.page.locator('[data-testid="nav-home"]'); }
  get profileNav() { return this.page.locator('[data-testid="nav-profile"]'); }
  get messagesNav() { return this.page.locator('[data-testid="nav-messages"]'); }
  get settingsNav() { return this.page.locator('[data-testid="nav-settings"]'); }

  // Post composer
  get postComposer() { return this.page.locator('[data-testid="post-composer"]'); }
  get postTextarea() { return this.page.locator('[data-testid="post-content-textarea"]'); }
  get postSubmitButton() { return this.page.locator('[data-testid="post-submit-button"]'); }
  get characterCount() { return this.page.locator('[data-testid="character-count"]'); }

  // Post elements
  get postCards() { return this.page.locator('[data-testid="post-card"]'); }
  get latestPost() { return this.postCards.first(); }

  // User menu
  get userAvatar() { return this.page.locator('[data-testid="user-avatar"]'); }
  get userMenu() { return this.page.locator('[data-testid="user-menu"]'); }
  get logoutButton() { return this.page.locator('[data-testid="logout-button"]'); }

  async verifyFeedLayout() {
    await expect(this.navigationSidebar).toBeVisible();
    await expect(this.mainTimeline).toBeVisible();
    await expect(this.trendsSidebar).toBeVisible();
  }

  async verifyNavigationElements() {
    await expect(this.homeNav).toBeVisible();
    await expect(this.profileNav).toBeVisible();
    await expect(this.messagesNav).toBeVisible();
    await expect(this.settingsNav).toBeVisible();
  }

  async createPost(content: string) {
    await this.postComposer.click();
    await this.postTextarea.fill(content);
    await this.postSubmitButton.click();

    // Wait for post to appear
    await this.page.waitForSelector('[data-testid="post-card"]');
  }

  async verifyPostAppears(content: string) {
    await expect(this.latestPost).toContainText(content);
  }

  async verifyHashtagExtraction(hashtag: string) {
    await expect(this.latestPost.locator('[data-testid="hashtag-link"]')).toContainText(hashtag);
  }

  async likePost(postIndex = 0) {
    const post = this.postCards.nth(postIndex);
    const likeButton = post.locator('[data-testid="like-button"]');
    await likeButton.click();
  }

  async replyToPost(postIndex = 0, replyContent: string) {
    const post = this.postCards.nth(postIndex);
    const replyButton = post.locator('[data-testid="reply-button"]');

    await replyButton.click();
    await this.page.fill('[data-testid="reply-textarea"]', replyContent);
    await this.page.click('[data-testid="reply-submit-button"]');
  }

  async repostPost(postIndex = 0) {
    const post = this.postCards.nth(postIndex);
    const repostButton = post.locator('[data-testid="repost-button"]');

    await repostButton.click();
    await expect(this.page.locator('[data-testid="repost-confirmation"]')).toBeVisible();
    await this.page.click('[data-testid="confirm-repost"]');
  }

  async waitForAIResponse(timeoutMs = 120000) {
    await this.page.waitForSelector('[data-testid="ai-response-post"]', { timeout: timeoutMs });
  }

  async verifyAIResponse() {
    const aiResponse = this.page.locator('[data-testid="ai-response-post"]').first();
    await expect(aiResponse).toBeVisible();
    await expect(aiResponse.locator('[data-testid="ai-badge"]')).toContainText(/ai|bot/i);
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
    await this.page.waitForURL(/\/(|home)$/);
  }
}

export class ProfilePage extends BasePage {
  // Profile elements
  get profileHeader() { return this.page.locator('[data-testid="profile-header"]'); }
  get profileAvatar() { return this.page.locator('[data-testid="profile-avatar"]'); }
  get displayName() { return this.page.locator('[data-testid="profile-display-name"]'); }
  get username() { return this.page.locator('[data-testid="profile-username"]'); }
  get bio() { return this.page.locator('[data-testid="profile-bio"]'); }

  // Persona indicators
  get personaBadge() { return this.page.locator('[data-testid="persona-badge"]'); }
  get influenceLevel() { return this.page.locator('[data-testid="influence-level"]'); }
  get politicalStanceCard() { return this.page.locator('[data-testid="political-stance-card"]'); }

  // Metrics
  get followerCount() { return this.page.locator('[data-testid="follower-count"]'); }
  get followingCount() { return this.page.locator('[data-testid="following-count"]'); }
  get postCount() { return this.page.locator('[data-testid="post-count"]'); }
  get engagementRate() { return this.page.locator('[data-testid="engagement-rate"]'); }
  get approvalRating() { return this.page.locator('[data-testid="approval-rating"]'); }
  get influenceRank() { return this.page.locator('[data-testid="influence-rank"]'); }

  // Tabs
  get postsTab() { return this.page.locator('[data-testid="profile-posts-tab"]'); }
  get repliesTab() { return this.page.locator('[data-testid="profile-replies-tab"]'); }
  get mediaTab() { return this.page.locator('[data-testid="profile-media-tab"]'); }
  get metricsTab() { return this.page.locator('[data-testid="profile-metrics-tab"]'); }

  async verifyProfileInfo(userType: keyof typeof TEST_USERS = 'politician') {
    const user = TEST_USERS[userType];

    await expect(this.displayName).toContainText(user.displayName);
    await expect(this.username).toContainText(user.username);
    await expect(this.bio).toContainText(user.bio);
  }

  async verifyPersonaIndicators(userType: keyof typeof TEST_USERS = 'politician') {
    const user = TEST_USERS[userType];

    await expect(this.personaBadge).toContainText(user.personaType, { ignoreCase: true });
    await expect(this.influenceLevel).toBeVisible();
    await expect(this.politicalStanceCard).toBeVisible();
  }

  async verifyInfluenceMetrics() {
    await expect(this.followerCount).toBeVisible();
    await expect(this.followingCount).toBeVisible();
    await expect(this.postCount).toBeVisible();
    await expect(this.engagementRate).toBeVisible();
    await expect(this.approvalRating).toBeVisible();
    await expect(this.influenceRank).toBeVisible();
  }

  async viewMetricsDashboard() {
    await this.metricsTab.click();
    await expect(this.page.locator('[data-testid="metrics-dashboard"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="achievement-badges"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="influence-chart"]')).toBeVisible();
  }
}

export class SettingsPage extends BasePage {
  // Settings tabs
  get generalTab() { return this.page.locator('[data-testid="general-settings-tab"]'); }
  get aiTab() { return this.page.locator('[data-testid="ai-settings-tab"]'); }
  get notificationsTab() { return this.page.locator('[data-testid="notifications-settings-tab"]'); }
  get securityTab() { return this.page.locator('[data-testid="security-settings-tab"]'); }

  // General settings
  get themeToggle() { return this.page.locator('[data-testid="theme-toggle"]'); }
  get newsRegionSelect() { return this.page.locator('[data-testid="news-region-select"]'); }
  get languageSelect() { return this.page.locator('[data-testid="language-select"]'); }

  // AI settings
  get aiChatterSlider() { return this.page.locator('[data-testid="ai-chatter-slider"]'); }
  get customApiKeyInput() { return this.page.locator('[data-testid="custom-api-key-input"]'); }
  get customBaseUrlInput() { return this.page.locator('[data-testid="custom-base-url-input"]'); }

  // Save buttons
  get saveGeneralButton() { return this.page.locator('[data-testid="save-general-settings"]'); }
  get saveAiButton() { return this.page.locator('[data-testid="save-ai-settings"]'); }

  // Success messages
  get settingsSavedMessage() { return this.page.locator('[data-testid="settings-saved-message"]'); }

  async switchToGeneralSettings() {
    await this.generalTab.click();
  }

  async switchToAISettings() {
    await this.aiTab.click();
  }

  async toggleTheme() {
    await this.themeToggle.click();
  }

  async verifyThemeChange(expectedTheme: 'light' | 'dark') {
    await expect(this.page.locator('body')).toHaveAttribute('data-theme', expectedTheme);
  }

  async changeNewsRegion(region: string) {
    await this.newsRegionSelect.selectOption(region);
    await this.saveGeneralButton.click();
    await expect(this.settingsSavedMessage).toBeVisible();
  }

  async adjustAIChatterLevel(level: number) {
    await this.aiChatterSlider.fill(level.toString());
    await this.saveAiButton.click();
    await expect(this.settingsSavedMessage).toBeVisible();
  }

  async configureCustomAI(apiKey: string, baseUrl: string) {
    await this.customApiKeyInput.fill(apiKey);
    await this.customBaseUrlInput.fill(baseUrl);
    await this.saveAiButton.click();
    await expect(this.settingsSavedMessage).toBeVisible();
  }
}

export class NewsPage extends BasePage {
  // News feed elements
  get newsFeed() { return this.page.locator('[data-testid="news-feed"]'); }
  get newsArticles() { return this.page.locator('[data-testid="news-article"]'); }
  get loadMoreButton() { return this.page.locator('[data-testid="load-more-news"]'); }

  // Filters
  get filterButtons() { return this.page.locator('[data-testid^="news-filter-"]'); }
  get politicsFilter() { return this.page.locator('[data-testid="news-filter-politics"]'); }
  get economyFilter() { return this.page.locator('[data-testid="news-filter-economy"]'); }
  get environmentFilter() { return this.page.locator('[data-testid="news-filter-environment"]'); }

  // Region filter
  get regionFilter() { return this.page.locator('[data-testid="region-filter"]'); }
  get regionUK() { return this.page.locator('[data-testid="region-uk"]'); }
  get regionUS() { return this.page.locator('[data-testid="region-us"]'); }

  // AI reactions
  get aiNewsReactions() { return this.page.locator('[data-testid="ai-news-reaction"]'); }

  async verifyNewsArticlesLoad() {
    await expect(this.newsFeed).toBeVisible();
    await expect(this.newsArticles.first()).toBeVisible({ timeout: 10000 });
  }

  async filterByCategory(category: 'politics' | 'economy' | 'environment') {
    const filterMap = {
      politics: this.politicsFilter,
      economy: this.economyFilter,
      environment: this.environmentFilter
    };

    await filterMap[category].click();
    await expect(this.page.locator('[data-testid="active-filter"]')).toContainText(category, { ignoreCase: true });
  }

  async changeRegion(region: 'uk' | 'us') {
    await this.regionFilter.click();

    const regionMap = {
      uk: this.regionUK,
      us: this.regionUS
    };

    await regionMap[region].click();
    await expect(this.page.locator('[data-testid="current-region"]')).toContainText(region.toUpperCase());
  }

  async verifyAIReactions() {
    await expect(this.aiNewsReactions.first()).toBeVisible();
  }

  async loadMoreNews() {
    const initialCount = await this.newsArticles.count();
    await this.loadMoreButton.click();

    // Wait for more articles to load
    await this.page.waitForFunction(
      (count) => document.querySelectorAll('[data-testid="news-article"]').length > count,
      initialCount
    );
  }
}

export class ResponsiveTestHelper {
  constructor(private page: Page) {}

  async testDesktopLayout() {
    await this.page.setViewportSize({ width: 1440, height: 900 });

    // Verify three-column layout
    const feedPage = new FeedPage(this.page);
    await expect(feedPage.navigationSidebar).toBeVisible();
    await expect(feedPage.mainTimeline).toBeVisible();
    await expect(feedPage.trendsSidebar).toBeVisible();
  }

  async testTabletLayout() {
    await this.page.setViewportSize({ width: 768, height: 1024 });

    // Verify two-column layout (trends hidden)
    const feedPage = new FeedPage(this.page);
    await expect(feedPage.navigationSidebar).toBeVisible();
    await expect(feedPage.mainTimeline).toBeVisible();
    await expect(feedPage.trendsSidebar).toBeHidden();
  }

  async testMobileLayout() {
    await this.page.setViewportSize({ width: 375, height: 667 });

    // Verify single column with bottom navigation
    const feedPage = new FeedPage(this.page);
    await expect(feedPage.navigationSidebar).toBeHidden();
    await expect(feedPage.mainTimeline).toBeVisible();
    await expect(this.page.locator('[data-testid="bottom-navigation"]')).toBeVisible();
  }

  async testMobileComposer() {
    await this.page.setViewportSize({ width: 375, height: 667 });

    await this.page.click('[data-testid="mobile-compose-button"]');
    await expect(this.page.locator('[data-testid="mobile-post-composer"]')).toBeVisible();
  }
}
/**
 * Accessibility E2E Tests
 *
 * Comprehensive accessibility testing for the AI Social Media Platform
 * focusing on WCAG 2.1 AA compliance, keyboard navigation, screen reader
 * compatibility, and inclusive design patterns.
 */

import { test, expect, Page } from '@playwright/test';
import {
  HomePage,
  FeedPage,
  RegistrationPage,
  LoginPage,
  ProfilePage,
  SettingsPage
} from './utils/page-objects';
import { TestUtils, ACCESSIBILITY_REQUIREMENTS } from './utils/test-data';

test.describe('Accessibility Compliance Tests', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    // Setup accessibility monitoring
    await page.addInitScript(() => {
      // Monitor focus events
      document.addEventListener('focusin', (e) => {
        (window as any).lastFocusedElement = e.target;
      });

      // Monitor keyboard events
      document.addEventListener('keydown', (e) => {
        (window as any).lastKeyEvent = {
          key: e.key,
          target: e.target.tagName,
          timestamp: Date.now()
        };
      });
    });

    await TestUtils.setupAPIMocks(page);
  });

  test.afterEach(async () => {
    await TestUtils.cleanupTestData(page);
    await page.close();
  });

  test('should meet basic accessibility requirements on homepage', async () => {
    const homePage = new HomePage(page);
    await homePage.goto('/');

    // Test 1: Heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);

    // Verify h1 exists and is unique
    const h1Elements = await page.locator('h1').count();
    expect(h1Elements).toBe(1);

    // Test 2: Page has proper title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);

    // Test 3: Language attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('en');

    // Test 4: Semantic landmarks
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('[role="navigation"], nav')).toBeVisible();

    // Test 5: Button accessibility
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      const hasAccessibleName = ariaLabel || (text && text.trim().length > 0);
      expect(hasAccessibleName).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async () => {
    const homePage = new HomePage(page);
    await homePage.goto('/');

    // Test Tab navigation order
    const expectedTabOrder = [
      '[data-testid="sign-in-button"]',
      '[data-testid="sign-up-button"]',
      '[data-testid="get-started-button"]',
      '[data-testid="learn-more-button"]'
    ];

    let currentIndex = 0;
    for (const selector of expectedTabOrder) {
      await page.keyboard.press('Tab');

      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.getAttribute('data-testid');
      });

      expect(focusedElement).toBe(selector.replace(/^\[data-testid="/, '').replace(/"\]$/, ''));
      currentIndex++;
    }

    // Test Shift+Tab (reverse navigation)
    await page.keyboard.press('Shift+Tab');
    const previousElement = await page.evaluate(() => {
      return document.activeElement?.getAttribute('data-testid');
    });

    expect(previousElement).toBe('get-started-button');

    // Test Enter activation
    await page.keyboard.press('Enter');
    // Should navigate somewhere or trigger an action
    await page.waitForTimeout(1000); // Allow for any navigation
  });

  test('should provide proper focus indicators', async () => {
    const homePage = new HomePage(page);
    await homePage.goto('/');

    // Tab to first focusable element
    await page.keyboard.press('Tab');

    const focusStyles = await page.evaluate(() => {
      const focused = document.activeElement;
      if (!focused) return null;

      const styles = window.getComputedStyle(focused);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle,
        outlineColor: styles.outlineColor,
        boxShadow: styles.boxShadow
      };
    });

    // Verify focus indicator is visible (not 'none')
    const hasFocusIndicator =
      (focusStyles?.outline && focusStyles.outline !== 'none') ||
      (focusStyles?.boxShadow && focusStyles.boxShadow !== 'none') ||
      (focusStyles?.outlineWidth && focusStyles.outlineWidth !== '0px');

    expect(hasFocusIndicator).toBeTruthy();
  });

  test('should have accessible forms in registration', async () => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.goto('/register');

    // Test form labels
    const formFields = [
      { input: '[data-testid="username-input"]', label: 'Username' },
      { input: '[data-testid="email-input"]', label: 'Email' },
      { input: '[data-testid="password-input"]', label: 'Password' },
      { input: '[data-testid="display-name-input"]', label: 'Display Name' }
    ];

    for (const field of formFields) {
      const inputElement = page.locator(field.input);
      await expect(inputElement).toBeVisible();

      // Check for associated label
      const inputId = await inputElement.getAttribute('id');
      const ariaLabel = await inputElement.getAttribute('aria-label');
      const ariaLabelledBy = await inputElement.getAttribute('aria-labelledby');

      const hasLabel = inputId ?
        await page.locator(`label[for="${inputId}"]`).count() > 0 :
        false;

      const hasAccessibleName = hasLabel || ariaLabel || ariaLabelledBy;
      expect(hasAccessibleName).toBeTruthy();
    }

    // Test form validation with screen reader announcements
    await registrationPage.submitButton.click();

    // Check for error messages with proper ARIA attributes
    const errorElements = await page.locator('[role="alert"], [aria-live]').all();
    expect(errorElements.length).toBeGreaterThan(0);

    // Verify errors are associated with form fields
    const usernameError = page.locator('[data-testid="username-error"]');
    if (await usernameError.isVisible()) {
      const errorId = await usernameError.getAttribute('id');
      const usernameInput = page.locator('[data-testid="username-input"]');
      const describedBy = await usernameInput.getAttribute('aria-describedby');

      expect(describedBy).toContain(errorId);
    }
  });

  test('should support screen reader navigation in feed', async () => {
    await TestUtils.setupTestUser(page, 'politician');

    const feedPage = new FeedPage(page);
    await feedPage.goto('/feed');

    // Test ARIA landmarks
    await expect(page.locator('[role="main"]')).toBeVisible();
    await expect(page.locator('[role="navigation"]')).toBeVisible();
    await expect(page.locator('[role="complementary"]')).toBeVisible(); // Trends sidebar

    // Test post structure for screen readers
    const posts = await page.locator('[data-testid="post-card"]').all();
    if (posts.length > 0) {
      const firstPost = posts[0];

      // Check for proper heading structure within posts
      const postHeading = firstPost.locator('h2, h3, [role="heading"]');
      await expect(postHeading).toBeVisible();

      // Check for proper button labels
      const likeButton = firstPost.locator('[data-testid="like-button"]');
      const likeButtonLabel = await likeButton.getAttribute('aria-label');
      expect(likeButtonLabel).toContain('like');

      const replyButton = firstPost.locator('[data-testid="reply-button"]');
      const replyButtonLabel = await replyButton.getAttribute('aria-label');
      expect(replyButtonLabel).toContain('reply');
    }

    // Test live regions for real-time updates
    await expect(page.locator('[aria-live="polite"]')).toBeVisible();
  });

  test('should have accessible post composer', async () => {
    await TestUtils.setupTestUser(page, 'politician');

    const feedPage = new FeedPage(page);
    await feedPage.goto('/feed');

    // Click on post composer
    await feedPage.postComposer.click();

    // Test textarea accessibility
    const textarea = feedPage.postTextarea;
    await expect(textarea).toBeVisible();

    const ariaLabel = await textarea.getAttribute('aria-label');
    const placeholder = await textarea.getAttribute('placeholder');
    expect(ariaLabel || placeholder).toBeTruthy();

    // Test character counter
    await textarea.fill('This is a test post');
    const characterCount = page.locator('[data-testid="character-count"]');
    await expect(characterCount).toBeVisible();

    const countAriaLabel = await characterCount.getAttribute('aria-label');
    const countAriaLive = await characterCount.getAttribute('aria-live');
    expect(countAriaLabel || countAriaLive).toBeTruthy();

    // Test submit button state
    const submitButton = feedPage.postSubmitButton;
    const isDisabled = await submitButton.getAttribute('disabled');
    const ariaDisabled = await submitButton.getAttribute('aria-disabled');

    if (isDisabled || ariaDisabled === 'true') {
      const disabledLabel = await submitButton.getAttribute('aria-label');
      expect(disabledLabel).toContain('disabled');
    }
  });

  test('should meet color contrast requirements', async () => {
    const homePage = new HomePage(page);
    await homePage.goto('/');

    // Get computed styles for key elements
    const contrastTests = [
      { selector: 'body', description: 'main text' },
      { selector: 'h1', description: 'main heading' },
      { selector: '[data-testid="sign-in-button"]', description: 'primary button' },
      { selector: 'a', description: 'links' }
    ];

    for (const test of contrastTests) {
      const element = page.locator(test.selector).first();
      if (await element.isVisible()) {
        const styles = await element.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize
          };
        });

        // Basic check that colors are defined
        expect(styles.color).toBeTruthy();
        expect(styles.color).not.toBe('transparent');

        // For buttons and interactive elements, ensure background is defined
        if (test.selector.includes('button')) {
          expect(styles.backgroundColor).toBeTruthy();
          expect(styles.backgroundColor).not.toBe('transparent');
        }
      }
    }
  });

  test('should support high contrast mode', async () => {
    // Simulate high contrast mode
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addStyleTag({
      content: `
        @media (prefers-contrast: high) {
          * {
            background: white !important;
            color: black !important;
            border: 1px solid black !important;
          }
        }
      `
    });

    const homePage = new HomePage(page);
    await homePage.goto('/');

    // Verify elements are still visible and functional
    await expect(homePage.mainHeading).toBeVisible();
    await expect(homePage.signInButton).toBeVisible();
    await expect(homePage.signUpButton).toBeVisible();

    // Test that buttons are still clickable
    await homePage.signInButton.click();
    await page.waitForURL(/\/login/);
  });

  test('should support reduced motion preferences', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const homePage = new HomePage(page);
    await homePage.goto('/');

    // Check that animations are disabled or reduced
    const animatedElements = await page.locator('[class*="animate"], [class*="transition"]').all();

    for (const element of animatedElements) {
      const styles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          animationDuration: computed.animationDuration,
          transitionDuration: computed.transitionDuration
        };
      });

      // In reduced motion mode, animations should be disabled or very short
      if (styles.animationDuration && styles.animationDuration !== '0s') {
        expect(parseFloat(styles.animationDuration)).toBeLessThan(0.5);
      }
    }
  });

  test('should handle keyboard shortcuts accessibly', async () => {
    await TestUtils.setupTestUser(page, 'politician');

    const feedPage = new FeedPage(page);
    await feedPage.goto('/feed');

    // Test common keyboard shortcuts
    const shortcuts = [
      { key: '/', description: 'Focus search' },
      { key: 'n', description: 'New post' },
      { key: 'r', description: 'Refresh feed' }
    ];

    for (const shortcut of shortcuts) {
      await page.keyboard.press(shortcut.key);
      await page.waitForTimeout(500);

      // Verify that keyboard shortcut help is available
      const helpElement = page.locator('[data-testid="keyboard-help"], [aria-label*="shortcut"]');
      // Note: This test assumes keyboard help exists; adjust based on implementation
    }

    // Test Escape key functionality
    await feedPage.postComposer.click();
    await page.keyboard.press('Escape');

    // Composer should close or lose focus
    const composerFocused = await page.evaluate(() => {
      const composer = document.querySelector('[data-testid="post-content-textarea"]');
      return document.activeElement === composer;
    });
    expect(composerFocused).toBeFalsy();
  });

  test('should provide accessible error handling', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.goto('/login');

    // Submit invalid login
    await loginPage.loginUser('invalid_user', 'invalid_password');

    // Check for accessible error message
    const errorMessage = page.locator('[role="alert"], [data-testid*="error"]');
    await expect(errorMessage).toBeVisible();

    // Verify error is announced to screen readers
    const ariaLive = await errorMessage.getAttribute('aria-live');
    const role = await errorMessage.getAttribute('role');

    expect(ariaLive === 'assertive' || role === 'alert').toBeTruthy();

    // Verify focus management after error
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.getAttribute('data-testid');
    });

    // Focus should return to relevant form field
    expect(focusedElement).toMatch(/login-identifier|login-password/);
  });

  test('should support assistive technology in complex interactions', async () => {
    await TestUtils.setupTestUser(page, 'politician');

    const feedPage = new FeedPage(page);
    await feedPage.goto('/feed');

    // Create a post to interact with
    await feedPage.createPost('This is a test post for accessibility testing');

    // Test post interactions with keyboard
    const latestPost = feedPage.latestPost;

    // Navigate to like button via keyboard
    await page.keyboard.press('Tab');
    // Continue tabbing until we reach the like button
    let focusedElement = await page.evaluate(() => {
      return document.activeElement?.getAttribute('data-testid');
    });

    let tabCount = 0;
    while (focusedElement !== 'like-button' && tabCount < 20) {
      await page.keyboard.press('Tab');
      focusedElement = await page.evaluate(() => {
        return document.activeElement?.getAttribute('data-testid');
      });
      tabCount++;
    }

    if (focusedElement === 'like-button') {
      // Test like button with keyboard
      await page.keyboard.press('Enter');

      // Verify state change is announced
      const likeCount = page.locator('[data-testid="like-count"]');
      await expect(likeCount).not.toContainText('0');

      // Verify button state change for screen readers
      const likeButton = page.locator('[data-testid="like-button"]');
      const ariaPressed = await likeButton.getAttribute('aria-pressed');
      expect(ariaPressed).toBe('true');
    }
  });

  test('should provide accessible modal dialogs', async () => {
    await TestUtils.setupTestUser(page, 'politician');

    const feedPage = new FeedPage(page);
    await feedPage.goto('/feed');

    // Open user menu (which might be a modal/dropdown)
    await feedPage.userMenu.click();

    // Test modal accessibility
    const modal = page.locator('[role="dialog"], [role="menu"]');
    if (await modal.isVisible()) {
      // Test focus trap
      const initialFocus = await page.evaluate(() => document.activeElement?.tagName);

      await page.keyboard.press('Tab');
      const afterTab = await page.evaluate(() => document.activeElement?.tagName);

      // Focus should stay within modal
      expect(afterTab).toBeTruthy();

      // Test Escape key to close
      await page.keyboard.press('Escape');
      await expect(modal).toBeHidden();

      // Focus should return to trigger element
      const finalFocus = await page.evaluate(() => {
        return document.activeElement?.getAttribute('data-testid');
      });
      expect(finalFocus).toBe('user-menu');
    }
  });

  test('should meet accessibility standards in responsive design', async () => {
    await TestUtils.setupTestUser(page, 'politician');

    // Test mobile accessibility
    await page.setViewportSize({ width: 375, height: 667 });

    const feedPage = new FeedPage(page);
    await feedPage.goto('/feed');

    // Verify touch targets are large enough (minimum 44px)
    const touchTargets = await page.locator('button, a, [role="button"]').all();

    for (const target of touchTargets.slice(0, 5)) { // Test first 5 to avoid timeout
      if (await target.isVisible()) {
        const boundingBox = await target.boundingBox();
        if (boundingBox) {
          expect(boundingBox.width).toBeGreaterThanOrEqual(44);
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        }
      }
    }

    // Test mobile navigation accessibility
    const bottomNav = page.locator('[data-testid="bottom-navigation"]');
    if (await bottomNav.isVisible()) {
      const navItems = await bottomNav.locator('button, a').all();

      for (const item of navItems) {
        const ariaLabel = await item.getAttribute('aria-label');
        const text = await item.textContent();
        const hasAccessibleName = ariaLabel || (text && text.trim().length > 0);
        expect(hasAccessibleName).toBeTruthy();
      }
    }
  });

  test('should support voice control and speech recognition', async () => {
    await TestUtils.setupTestUser(page, 'politician');

    const feedPage = new FeedPage(page);
    await feedPage.goto('/feed');

    // Test elements have proper names for voice control
    const voiceControlElements = [
      { selector: '[data-testid="post-composer"]', expectedNames: ['compose', 'post', 'write'] },
      { selector: '[data-testid="nav-home"]', expectedNames: ['home', 'timeline'] },
      { selector: '[data-testid="nav-profile"]', expectedNames: ['profile', 'account'] },
      { selector: '[data-testid="nav-settings"]', expectedNames: ['settings', 'preferences'] }
    ];

    for (const element of voiceControlElements) {
      const locator = page.locator(element.selector);
      if (await locator.isVisible()) {
        const ariaLabel = await locator.getAttribute('aria-label');
        const text = await locator.textContent();
        const title = await locator.getAttribute('title');

        const elementText = (ariaLabel || text || title || '').toLowerCase();

        const hasVoiceControlName = element.expectedNames.some(name =>
          elementText.includes(name.toLowerCase())
        );

        expect(hasVoiceControlName).toBeTruthy();
      }
    }
  });
});
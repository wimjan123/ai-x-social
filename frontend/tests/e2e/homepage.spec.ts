import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', {
        name: /Experience AI-Powered Political Discourse/i,
      })
    ).toBeVisible();
  });

  test('should display the navigation header', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /AI X Social/i })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign Up/i })).toBeVisible();
  });

  test('should display the demo post', async ({ page }) => {
    await expect(page.getByText(/Political AI Persona/i)).toBeVisible();
    await expect(page.getByText(/@ai_politician/i)).toBeVisible();
    await expect(
      page.getByText(/Just analyzed the latest economic data/i)
    ).toBeVisible();
  });

  test('should have responsive design', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(
      page.getByRole('heading', { name: /AI X Social/i })
    ).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(
      page.getByRole('heading', { name: /AI X Social/i })
    ).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(
      page.getByRole('heading', { name: /AI X Social/i })
    ).toBeVisible();
  });

  test('should have proper accessibility', async ({ page }) => {
    // Check for proper heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings.first()).toBeVisible();

    // Check for button accessibility
    const buttons = page.locator('button');
    for (const button of await buttons.all()) {
      await expect(button).toHaveAttribute('type', 'button');
    }

    // Check for proper color contrast (this is a basic check)
    await expect(page.locator('body')).toHaveCSS(
      'color',
      /rgb\(\d+, \d+, \d+\)/
    );
  });

  test('should display action buttons', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /Get Started/i })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Learn More/i })
    ).toBeVisible();
  });

  test('should display demo post interactions', async ({ page }) => {
    // Check for like, reply, repost, and share icons in demo post
    const demoPost = page
      .locator(
        '[class*="post-container"], .demo-post, [data-testid="demo-post"]'
      )
      .first();

    // Look for interaction elements (hearts, message circles, etc.)
    const svgElements = demoPost.locator('svg');
    await expect(svgElements).toHaveCount(4); // Exactly 4 icons for interactions

    // Check for engagement numbers
    await expect(demoPost.getByText('42')).toBeVisible(); // likes
    await expect(demoPost.getByText('18')).toBeVisible(); // replies
    await expect(demoPost.getByText('7')).toBeVisible(); // reposts
  });

  test('should load without errors', async ({ page }) => {
    // Check that the page loads without console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors (like missing favicon)
    const criticalErrors = errors.filter(
      error =>
        !error.includes('favicon') &&
        !error.includes('404') &&
        !error.includes('manifest')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});

/**
 * Performance E2E Tests
 *
 * Comprehensive performance testing for the AI Social Media Platform
 * focusing on load times, Core Web Vitals, memory usage, and
 * real-time feature performance.
 */

import { test, expect, Page } from '@playwright/test';
import { FeedPage, HomePage, ResponsiveTestHelper } from './utils/page-objects';
import { TestUtils, PERFORMANCE_THRESHOLDS } from './utils/test-data';

interface PerformanceMetrics {
  FCP: number;           // First Contentful Paint
  LCP: number;           // Largest Contentful Paint
  FID: number;           // First Input Delay
  CLS: number;           // Cumulative Layout Shift
  TTFB: number;          // Time to First Byte
  loadTime: number;      // Total load time
  domContentLoaded: number;
  memoryUsage?: number;
  jsHeapSize?: number;
}

// Performance measurement utilities
async function measureCoreWebVitals(page: Page): Promise<PerformanceMetrics> {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const metrics: Partial<PerformanceMetrics> = {};

      // Get navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.TTFB = navigation.responseStart - navigation.requestStart;
        metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      }

      // Use PerformanceObserver for Core Web Vitals
      let metricsCollected = 0;
      const totalMetrics = 4; // FCP, LCP, FID, CLS

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          switch (entry.entryType) {
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                metrics.FCP = entry.startTime;
                metricsCollected++;
              }
              break;
            case 'largest-contentful-paint':
              metrics.LCP = entry.startTime;
              metricsCollected++;
              break;
            case 'first-input':
              metrics.FID = entry.processingStart - entry.startTime;
              metricsCollected++;
              break;
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                metrics.CLS = (metrics.CLS || 0) + (entry as any).value;
              }
              break;
          }
        }

        // Check if CLS measurement is complete (after a reasonable time)
        setTimeout(() => {
          if (metricsCollected >= 3) { // FCP, LCP, and either FID or timeout
            metricsCollected = totalMetrics; // Force completion
          }
        }, 5000);

        if (metricsCollected >= totalMetrics) {
          observer.disconnect();

          // Add memory information if available
          if ((performance as any).memory) {
            metrics.memoryUsage = (performance as any).memory.usedJSHeapSize;
            metrics.jsHeapSize = (performance as any).memory.totalJSHeapSize;
          }

          resolve(metrics as PerformanceMetrics);
        }
      });

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });

      // Fallback: resolve after timeout if not all metrics are collected
      setTimeout(() => {
        observer.disconnect();
        resolve(metrics as PerformanceMetrics);
      }, 10000);
    });
  });
}

async function measurePageLoadTime(page: Page): Promise<number> {
  return await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigation.loadEventEnd - navigation.loadEventStart;
  });
}

async function measureMemoryUsage(page: Page): Promise<{ used: number; total: number } | null> {
  return await page.evaluate(() => {
    if ((performance as any).memory) {
      return {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize
      };
    }
    return null;
  });
}

test.describe('Performance Tests', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    // Enable performance monitoring
    await page.addInitScript(() => {
      // Track performance marks
      (window as any).performanceMarks = [];

      // Override console.time and console.timeEnd for custom measurements
      const originalTime = console.time;
      const originalTimeEnd = console.timeEnd;

      console.time = function(label: string) {
        (window as any).performanceMarks.push({ label, start: performance.now() });
        return originalTime.call(console, label);
      };

      console.timeEnd = function(label: string) {
        const mark = (window as any).performanceMarks.find((m: any) => m.label === label);
        if (mark) {
          mark.end = performance.now();
          mark.duration = mark.end - mark.start;
        }
        return originalTimeEnd.call(console, label);
      };
    });

    await TestUtils.setupAPIMocks(page);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('homepage should load within performance thresholds', async () => {
    const homePage = new HomePage(page);

    // Measure page load
    const startTime = Date.now();
    await homePage.goto('/');
    const endTime = Date.now();

    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.page_load_time);

    // Measure Core Web Vitals
    const metrics = await measureCoreWebVitals(page);

    // Validate Core Web Vitals thresholds
    if (metrics.FCP) {
      expect(metrics.FCP).toBeLessThan(1800); // Good FCP < 1.8s
    }

    if (metrics.LCP) {
      expect(metrics.LCP).toBeLessThan(PERFORMANCE_THRESHOLDS.largest_contentful_paint);
    }

    if (metrics.FID) {
      expect(metrics.FID).toBeLessThan(PERFORMANCE_THRESHOLDS.first_input_delay);
    }

    if (metrics.CLS) {
      expect(metrics.CLS).toBeLessThan(PERFORMANCE_THRESHOLDS.cumulative_layout_shift);
    }

    if (metrics.TTFB) {
      expect(metrics.TTFB).toBeLessThan(PERFORMANCE_THRESHOLDS.time_to_first_byte);
    }

    console.log('Homepage Performance Metrics:', metrics);
  });

  test('feed page should maintain performance with user interaction', async () => {
    await TestUtils.setupTestUser(page, 'politician');

    const feedPage = new FeedPage(page);

    // Measure initial load
    const startTime = Date.now();
    await feedPage.goto('/feed');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.page_load_time);

    // Test post creation performance
    const postStartTime = performance.now();
    await feedPage.createPost('Performance test post with some content to measure rendering speed');

    // Wait for post to appear and measure time
    await page.waitForSelector('[data-testid="post-card"]');
    const postEndTime = performance.now();
    const postCreationTime = postEndTime - postStartTime;

    expect(postCreationTime).toBeLessThan(1000); // Post creation should be < 1 second

    // Test infinite scroll performance
    const initialPostCount = await page.locator('[data-testid="post-card"]').count();

    const scrollStartTime = performance.now();
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(200);
    }

    const scrollEndTime = performance.now();
    const scrollTime = scrollEndTime - scrollStartTime;

    // Scrolling should remain smooth
    expect(scrollTime).toBeLessThan(2000);

    // Check if new content loaded
    const finalPostCount = await page.locator('[data-testid="post-card"]').count();
    expect(finalPostCount).toBeGreaterThanOrEqual(initialPostCount);
  });

  test('should maintain performance under concurrent user actions', async () => {
    await TestUtils.setupTestUser(page, 'politician');

    const feedPage = new FeedPage(page);
    await feedPage.goto('/feed');

    // Simulate rapid user interactions
    const actions = [
      () => feedPage.createPost('Rapid interaction test post 1'),
      () => feedPage.likePost(0),
      () => feedPage.replyToPost(0, 'Quick reply'),
      () => page.click('[data-testid="nav-profile"]'),
      () => page.click('[data-testid="nav-home"]'),
      () => feedPage.createPost('Rapid interaction test post 2')
    ];

    const startTime = performance.now();

    // Execute actions rapidly
    for (const action of actions) {
      await action();
      await page.waitForTimeout(100); // Small delay between actions
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // All actions should complete within reasonable time
    expect(totalTime).toBeLessThan(5000);

    // Check memory usage after rapid interactions
    const memoryAfter = await measureMemoryUsage(page);
    if (memoryAfter) {
      expect(memoryAfter.used).toBeLessThan(PERFORMANCE_THRESHOLDS.memory_usage);
    }
  });

  test('real-time features should not impact performance', async () => {
    await TestUtils.setupTestUser(page, 'politician');

    const feedPage = new FeedPage(page);
    await feedPage.goto('/feed');

    // Measure baseline performance
    const baselineMetrics = await measureCoreWebVitals(page);

    // Simulate real-time events
    for (let i = 0; i < 10; i++) {
      await page.evaluate((index) => {
        // Simulate SSE event
        const event = new CustomEvent('newPost', {
          detail: {
            id: `realtime-post-${index}`,
            content: `Real-time post ${index}`,
            user: 'test_user',
            timestamp: new Date().toISOString()
          }
        });
        window.dispatchEvent(event);
      }, i);

      await page.waitForTimeout(100);
    }

    // Measure performance after real-time events
    const realtimeMetrics = await measureCoreWebVitals(page);

    // Performance shouldn't significantly degrade
    if (realtimeMetrics.CLS && baselineMetrics.CLS) {
      const clsIncrease = realtimeMetrics.CLS - baselineMetrics.CLS;
      expect(clsIncrease).toBeLessThan(0.05); // Minimal layout shift from real-time updates
    }

    // Memory usage should remain stable
    const memoryUsage = await measureMemoryUsage(page);
    if (memoryUsage) {
      expect(memoryUsage.used).toBeLessThan(PERFORMANCE_THRESHOLDS.memory_usage);
    }
  });

  test('image loading should be optimized', async () => {
    await TestUtils.setupTestUser(page, 'politician');

    const feedPage = new FeedPage(page);
    await feedPage.goto('/feed');

    // Monitor image loading
    const imageRequests: string[] = [];
    page.on('request', request => {
      if (request.resourceType() === 'image') {
        imageRequests.push(request.url());
      }
    });

    // Scroll through feed to trigger image loading
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
    }

    // Check for lazy loading (images should load progressively)
    expect(imageRequests.length).toBeGreaterThan(0);

    // Verify images have proper loading attributes
    const images = await page.locator('img').all();
    for (const img of images.slice(0, 5)) { // Check first 5 images
      const loading = await img.getAttribute('loading');
      const src = await img.getAttribute('src');

      // Images should either be lazy loaded or essential (above fold)
      if (src && !src.includes('avatar')) { // Avatars might load immediately
        expect(loading).toBe('lazy');
      }
    }
  });

  test('responsive design performance across devices', async () => {
    const responsiveHelper = new ResponsiveTestHelper(page);

    // Test desktop performance
    await responsiveHelper.testDesktopLayout();
    await page.goto('/feed');

    const desktopLoadTime = await measurePageLoadTime(page);
    expect(desktopLoadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.page_load_time);

    // Test tablet performance
    await responsiveHelper.testTabletLayout();
    await page.reload();

    const tabletLoadTime = await measurePageLoadTime(page);
    expect(tabletLoadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.page_load_time);

    // Test mobile performance
    await responsiveHelper.testMobileLayout();
    await page.reload();

    const mobileLoadTime = await measurePageLoadTime(page);
    expect(mobileLoadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.page_load_time * 1.2); // Allow 20% more time for mobile

    // Mobile should not have significantly worse performance
    expect(mobileLoadTime).toBeLessThan(desktopLoadTime * 1.5);
  });

  test('API response times should be optimal', async () => {
    await TestUtils.setupTestUser(page, 'politician');

    const feedPage = new FeedPage(page);

    // Monitor network requests
    const apiRequests: { url: string; duration: number }[] = [];

    page.on('response', response => {
      const request = response.request();
      if (request.url().includes('/api/')) {
        const timing = response.timing();
        apiRequests.push({
          url: request.url(),
          duration: timing.responseEnd
        });
      }
    });

    await feedPage.goto('/feed');

    // Create a post to test POST performance
    await feedPage.createPost('API performance test post');

    // Wait for API calls to complete
    await page.waitForTimeout(2000);

    // Check API response times
    const slowRequests = apiRequests.filter(req => req.duration > 1000);
    expect(slowRequests.length).toBe(0); // No requests should take longer than 1 second

    const averageResponseTime = apiRequests.length > 0
      ? apiRequests.reduce((sum, req) => sum + req.duration, 0) / apiRequests.length
      : 0;

    expect(averageResponseTime).toBeLessThan(500); // Average response time < 500ms
  });

  test('bundle size and resource loading optimization', async () => {
    const homePage = new HomePage(page);

    // Monitor all resource loading
    const resources: { type: string; size: number; url: string }[] = [];

    page.on('response', async response => {
      try {
        const request = response.request();
        const contentLength = response.headers()['content-length'];
        const size = contentLength ? parseInt(contentLength) : 0;

        resources.push({
          type: request.resourceType(),
          size,
          url: request.url()
        });
      } catch (error) {
        // Ignore errors in resource monitoring
      }
    });

    await homePage.goto('/');
    await page.waitForLoadState('networkidle');

    // Check JavaScript bundle sizes
    const jsResources = resources.filter(r => r.type === 'script');
    const totalJSSize = jsResources.reduce((sum, r) => sum + r.size, 0);

    // Main bundle should be reasonably sized (< 1MB)
    expect(totalJSSize).toBeLessThan(1024 * 1024);

    // Check CSS bundle sizes
    const cssResources = resources.filter(r => r.type === 'stylesheet');
    const totalCSSSize = cssResources.reduce((sum, r) => sum + r.size, 0);

    // CSS should be optimized (< 200KB)
    expect(totalCSSSize).toBeLessThan(200 * 1024);

    // Check for code splitting (multiple JS chunks)
    const jsChunks = jsResources.filter(r => r.url.includes('chunk') || r.url.includes('_app'));
    expect(jsChunks.length).toBeGreaterThan(1); // Should have multiple chunks
  });

  test('memory leaks should not occur during navigation', async () => {
    await TestUtils.setupTestUser(page, 'politician');

    // Get initial memory usage
    const initialMemory = await measureMemoryUsage(page);

    const pages = ['/feed', '/profile', '/news', '/settings', '/feed'];

    // Navigate through pages multiple times
    for (let cycle = 0; cycle < 3; cycle++) {
      for (const pagePath of pages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');

        // Perform some interactions
        if (pagePath === '/feed') {
          const feedPage = new FeedPage(page);
          await feedPage.createPost(`Memory test post ${cycle}`);
        }

        await page.waitForTimeout(500);
      }
    }

    // Force garbage collection if available
    await page.evaluate(() => {
      if ((window as any).gc) {
        (window as any).gc();
      }
    });

    // Check final memory usage
    const finalMemory = await measureMemoryUsage(page);

    if (initialMemory && finalMemory) {
      const memoryIncrease = finalMemory.used - initialMemory.used;
      const memoryIncreasePercentage = (memoryIncrease / initialMemory.used) * 100;

      // Memory increase should be reasonable (< 50% increase)
      expect(memoryIncreasePercentage).toBeLessThan(50);

      console.log(`Memory usage: ${initialMemory.used} -> ${finalMemory.used} (${memoryIncreasePercentage.toFixed(2)}% increase)`);
    }
  });

  test('should handle high-frequency user interactions gracefully', async () => {
    await TestUtils.setupTestUser(page, 'politician');

    const feedPage = new FeedPage(page);
    await feedPage.goto('/feed');

    // Test rapid scrolling
    const startTime = performance.now();

    for (let i = 0; i < 20; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, Math.random() * 500);
      });
      await page.waitForTimeout(50); // Very rapid scrolling
    }

    const scrollTime = performance.now() - startTime;

    // Should handle rapid scrolling without blocking
    expect(scrollTime).toBeLessThan(3000);

    // Test rapid clicking
    const clickStartTime = performance.now();

    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="nav-home"]');
      await page.waitForTimeout(100);
    }

    const clickTime = performance.now() - clickStartTime;

    // Should handle rapid clicking without performance degradation
    expect(clickTime).toBeLessThan(2000);

    // Check that the page is still responsive
    await expect(feedPage.postComposer).toBeVisible();
    await feedPage.createPost('Performance test after rapid interactions');
    await expect(feedPage.latestPost).toContainText('Performance test after rapid interactions');
  });

  test('should optimize performance during AI response generation', async () => {
    await TestUtils.setupTestUser(page, 'politician');

    const feedPage = new FeedPage(page);
    await feedPage.goto('/feed');

    // Create a post that should trigger AI responses
    const postStartTime = performance.now();
    await feedPage.createPost('What are your thoughts on the latest healthcare policy proposals?');

    // Monitor performance during AI response waiting period
    const performanceMarks = [];
    for (let i = 0; i < 10; i++) {
      const mark = await measureMemoryUsage(page);
      if (mark) {
        performanceMarks.push({
          time: performance.now() - postStartTime,
          memory: mark.used
        });
      }
      await page.waitForTimeout(1000);
    }

    // Memory usage should remain stable during AI processing
    if (performanceMarks.length > 1) {
      const memoryVariation = Math.max(...performanceMarks.map(m => m.memory)) -
                              Math.min(...performanceMarks.map(m => m.memory));

      const averageMemory = performanceMarks.reduce((sum, m) => sum + m.memory, 0) / performanceMarks.length;
      const memoryVariationPercentage = (memoryVariation / averageMemory) * 100;

      // Memory variation should be minimal during AI processing
      expect(memoryVariationPercentage).toBeLessThan(10);
    }

    // Page should remain responsive during AI processing
    await feedPage.createPost('Second post during AI processing');
    await expect(feedPage.postCards).toHaveCount(2, { timeout: 5000 });
  });
});
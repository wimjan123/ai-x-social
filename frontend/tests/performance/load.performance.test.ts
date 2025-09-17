import { test, expect, Page, BrowserContext, chromium } from '@playwright/test';
import * as lighthouse from 'lighthouse';
import { launch } from 'puppeteer-core';

/**
 * Performance Tests for Initial Page Load
 * Requirements:
 * - Initial load: <2s for First Contentful Paint
 * - Lighthouse Performance Score: >90
 * - Bundle size: <500KB gzipped
 */

// Performance budgets
const PERFORMANCE_BUDGETS = {
  FCP: 2000, // First Contentful Paint < 2s
  LCP: 2500, // Largest Contentful Paint < 2.5s
  TBT: 300,  // Total Blocking Time < 300ms
  CLS: 0.1,  // Cumulative Layout Shift < 0.1
  TTI: 3500, // Time to Interactive < 3.5s
  SI: 3000,  // Speed Index < 3s
  LIGHTHOUSE_SCORE: 90, // Lighthouse performance score > 90
  BUNDLE_SIZE_KB: 500,   // Bundle size < 500KB gzipped
  JS_EXECUTION_TIME: 1500, // Main thread JS execution < 1.5s
  MEMORY_LEAK_THRESHOLD: 10, // Memory increase < 10MB after navigation
};

// Test configuration
test.describe.configure({ mode: 'serial' });
test.use({
  viewport: { width: 1920, height: 1080 },
  locale: 'en-US',
});

test.describe('Initial Page Load Performance', () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async () => {
    // Create a clean context with performance recording enabled
    context = await chromium.launchPersistentContext('', {
      headless: false,
      devtools: true,
      args: [
        '--enable-precise-memory-info',
        '--disable-blink-features=AutomationControlled',
      ],
    });
  });

  test.afterAll(async () => {
    await context?.close();
  });

  test('should meet First Contentful Paint target of <2s', async () => {
    page = await context.newPage();

    // Start performance monitoring
    await page.evaluateOnNewDocument(() => {
      window.performanceMetrics = {
        startTime: Date.now(),
        entries: [],
      };

      new PerformanceObserver((list) => {
        window.performanceMetrics.entries.push(...list.getEntries());
      }).observe({ entryTypes: ['paint', 'navigation', 'largest-contentful-paint'] });
    });

    // Navigate and measure
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paints = performance.getEntriesByType('paint');
      const fcp = paints.find(p => p.name === 'first-contentful-paint');

      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        loadComplete: navigation.loadEventEnd - navigation.fetchStart,
        fcp: fcp ? fcp.startTime : 0,
        navigationStart: navigation.fetchStart,
        responseEnd: navigation.responseEnd - navigation.fetchStart,
      };
    });

    console.log('Performance Metrics:', {
      ...metrics,
      totalLoadTime: loadTime,
    });

    // Assert FCP requirement
    expect(metrics.fcp).toBeLessThan(PERFORMANCE_BUDGETS.FCP);
    expect(metrics.domContentLoaded).toBeLessThan(PERFORMANCE_BUDGETS.FCP);
  });

  test('should achieve Lighthouse performance score >90', async () => {
    // Launch Puppeteer for Lighthouse
    const browser = await launch({
      executablePath: chromium.executablePath(),
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      // Run Lighthouse audit
      const result = await lighthouse('http://localhost:3000', {
        port: new URL(browser.wsEndpoint()).port,
        output: 'json',
        logLevel: 'error',
        throttling: {
          rttMs: 150,
          throughputKbps: 1638,
          cpuSlowdownMultiplier: 4,
        },
        onlyCategories: ['performance', 'accessibility', 'best-practices'],
      });

      const scores = {
        performance: result.lhr.categories.performance.score * 100,
        accessibility: result.lhr.categories.accessibility.score * 100,
        bestPractices: result.lhr.categories['best-practices'].score * 100,
      };

      const metrics = {
        FCP: result.lhr.audits['first-contentful-paint'].numericValue,
        LCP: result.lhr.audits['largest-contentful-paint'].numericValue,
        TBT: result.lhr.audits['total-blocking-time'].numericValue,
        CLS: result.lhr.audits['cumulative-layout-shift'].numericValue,
        SI: result.lhr.audits['speed-index'].numericValue,
      };

      console.log('Lighthouse Scores:', scores);
      console.log('Core Web Vitals:', metrics);

      // Generate detailed report for failures
      if (scores.performance < PERFORMANCE_BUDGETS.LIGHTHOUSE_SCORE) {
        const diagnostics = result.lhr.audits;
        console.log('Performance Diagnostics:');
        Object.keys(diagnostics).forEach(key => {
          const audit = diagnostics[key];
          if (audit.score < 0.9 && audit.details) {
            console.log(`- ${audit.title}: ${audit.displayValue || audit.description}`);
          }
        });
      }

      // Assertions
      expect(scores.performance).toBeGreaterThan(PERFORMANCE_BUDGETS.LIGHTHOUSE_SCORE);
      expect(metrics.FCP).toBeLessThan(PERFORMANCE_BUDGETS.FCP);
      expect(metrics.LCP).toBeLessThan(PERFORMANCE_BUDGETS.LCP);
      expect(metrics.TBT).toBeLessThan(PERFORMANCE_BUDGETS.TBT);
      expect(metrics.CLS).toBeLessThan(PERFORMANCE_BUDGETS.CLS);
      expect(metrics.SI).toBeLessThan(PERFORMANCE_BUDGETS.SI);

    } finally {
      await browser.close();
    }
  });

  test('should have optimized bundle size <500KB gzipped', async () => {
    page = page || await context.newPage();

    const resourceSizes = new Map<string, number>();
    const resourceTypes = new Map<string, string>();

    // Track network requests
    page.on('response', async (response) => {
      const url = response.url();
      const headers = response.headers();
      const size = headers['content-length'] ? parseInt(headers['content-length']) : 0;
      const encoding = headers['content-encoding'];
      const type = headers['content-type'] || '';

      if (url.includes('/_next/') || url.includes('/static/')) {
        const isGzipped = encoding === 'gzip' || encoding === 'br';
        resourceSizes.set(url, size);
        resourceTypes.set(url, `${type}${isGzipped ? ' (compressed)' : ''}`);
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    // Calculate bundle sizes
    let totalJSSize = 0;
    let totalCSSSize = 0;
    let totalSize = 0;

    resourceSizes.forEach((size, url) => {
      const type = resourceTypes.get(url) || '';
      if (url.endsWith('.js') || type.includes('javascript')) {
        totalJSSize += size;
      } else if (url.endsWith('.css') || type.includes('css')) {
        totalCSSSize += size;
      }
      totalSize += size;
    });

    const bundleSizeKB = totalSize / 1024;
    const jsSizeKB = totalJSSize / 1024;
    const cssSizeKB = totalCSSSize / 1024;

    console.log('Bundle Analysis:');
    console.log(`- Total Bundle Size: ${bundleSizeKB.toFixed(2)}KB`);
    console.log(`- JavaScript: ${jsSizeKB.toFixed(2)}KB`);
    console.log(`- CSS: ${cssSizeKB.toFixed(2)}KB`);
    console.log(`- Number of Resources: ${resourceSizes.size}`);

    // Log individual chunks if bundle is too large
    if (bundleSizeKB > PERFORMANCE_BUDGETS.BUNDLE_SIZE_KB) {
      console.log('\nLarge Resources:');
      resourceSizes.forEach((size, url) => {
        const sizeKB = size / 1024;
        if (sizeKB > 50) { // Log resources > 50KB
          console.log(`  - ${url.split('/').pop()}: ${sizeKB.toFixed(2)}KB`);
        }
      });
    }

    expect(bundleSizeKB).toBeLessThan(PERFORMANCE_BUDGETS.BUNDLE_SIZE_KB);
  });

  test('should optimize critical rendering path', async () => {
    page = page || await context.newPage();

    // Monitor critical resources
    const criticalResources: any[] = [];

    await page.evaluateOnNewDocument(() => {
      // Track render-blocking resources
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            window.criticalResources = window.criticalResources || [];
            window.criticalResources.push({
              name: resourceEntry.name,
              duration: resourceEntry.duration,
              transferSize: resourceEntry.transferSize,
              renderBlocking: resourceEntry.renderBlockingStatus,
              initiatorType: resourceEntry.initiatorType,
            });
          }
        }
      }).observe({ entryTypes: ['resource'] });
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const resources = await page.evaluate(() => window.criticalResources || []);

    // Analyze render-blocking resources
    const renderBlockingResources = resources.filter((r: any) => r.renderBlocking === 'blocking');
    const totalBlockingTime = renderBlockingResources.reduce((sum: number, r: any) => sum + r.duration, 0);

    console.log('Critical Rendering Path Analysis:');
    console.log(`- Render-blocking resources: ${renderBlockingResources.length}`);
    console.log(`- Total blocking time: ${totalBlockingTime.toFixed(2)}ms`);

    if (renderBlockingResources.length > 0) {
      console.log('Render-blocking resources:');
      renderBlockingResources.forEach((r: any) => {
        console.log(`  - ${r.name.split('/').pop()}: ${r.duration.toFixed(2)}ms`);
      });
    }

    // Check for font loading optimization
    const fonts = resources.filter((r: any) => r.initiatorType === 'css' && r.name.includes('font'));
    if (fonts.length > 0) {
      console.log(`- Font resources: ${fonts.length}`);
      const fontLoadTime = fonts.reduce((sum: number, f: any) => sum + f.duration, 0);
      console.log(`- Total font load time: ${fontLoadTime.toFixed(2)}ms`);
    }

    expect(renderBlockingResources.length).toBeLessThan(5);
    expect(totalBlockingTime).toBeLessThan(500);
  });

  test('should efficiently load and optimize images', async () => {
    page = page || await context.newPage();

    const imageMetrics: any[] = [];

    // Track image loading
    page.on('response', async (response) => {
      const url = response.url();
      const headers = response.headers();
      const contentType = headers['content-type'] || '';

      if (contentType.startsWith('image/')) {
        const size = headers['content-length'] ? parseInt(headers['content-length']) : 0;
        imageMetrics.push({
          url: url.split('/').pop(),
          size: size / 1024, // KB
          type: contentType,
          cached: headers['cache-control'] || headers['etag'] ? true : false,
        });
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    // Check for lazy loading
    const lazyLoadedImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return {
        total: images.length,
        lazy: images.filter(img => img.loading === 'lazy').length,
        eager: images.filter(img => img.loading === 'eager').length,
        withSrcset: images.filter(img => img.srcset).length,
        withWebP: images.filter(img => img.src.includes('.webp') || img.srcset?.includes('.webp')).length,
      };
    });

    const totalImageSize = imageMetrics.reduce((sum, img) => sum + img.size, 0);
    const avgImageSize = imageMetrics.length > 0 ? totalImageSize / imageMetrics.length : 0;

    console.log('Image Optimization Analysis:');
    console.log(`- Total images: ${lazyLoadedImages.total}`);
    console.log(`- Lazy loaded: ${lazyLoadedImages.lazy}`);
    console.log(`- Responsive images (srcset): ${lazyLoadedImages.withSrcset}`);
    console.log(`- WebP format: ${lazyLoadedImages.withWebP}`);
    console.log(`- Total image size: ${totalImageSize.toFixed(2)}KB`);
    console.log(`- Average image size: ${avgImageSize.toFixed(2)}KB`);

    // Check for oversized images
    const oversizedImages = imageMetrics.filter(img => img.size > 200); // Images > 200KB
    if (oversizedImages.length > 0) {
      console.log('\nOversized images (>200KB):');
      oversizedImages.forEach(img => {
        console.log(`  - ${img.url}: ${img.size.toFixed(2)}KB (${img.type})`);
      });
    }

    // Assertions
    expect(avgImageSize).toBeLessThan(150); // Average image < 150KB
    expect(lazyLoadedImages.lazy).toBeGreaterThan(0); // Some images should be lazy loaded
  });

  test('should optimize JavaScript execution time', async () => {
    page = page || await context.newPage();

    // Enable CPU throttling to simulate slower devices
    const client = await page.context().newCDPSession(page);
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

    // Start profiling
    await client.send('Profiler.enable');
    await client.send('Profiler.start');

    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });

    // Stop profiling
    const { profile } = await client.send('Profiler.stop');
    const loadTime = Date.now() - startTime;

    // Analyze JavaScript execution
    const jsMetrics = await page.evaluate(() => {
      const entries = performance.getEntriesByType('measure');
      const scripts = performance.getEntriesByType('resource')
        .filter((e: any) => e.initiatorType === 'script') as PerformanceResourceTiming[];

      const totalScriptTime = scripts.reduce((sum, s) => sum + s.duration, 0);

      // Get long tasks
      const longTasks = performance.getEntriesByType('longtask' as any) || [];

      return {
        scriptCount: scripts.length,
        totalScriptTime,
        longTaskCount: longTasks.length,
        totalLongTaskTime: longTasks.reduce((sum: number, t: any) => sum + t.duration, 0),
      };
    });

    console.log('JavaScript Execution Analysis:');
    console.log(`- Total load time: ${loadTime}ms`);
    console.log(`- Script count: ${jsMetrics.scriptCount}`);
    console.log(`- Total script time: ${jsMetrics.totalScriptTime.toFixed(2)}ms`);
    console.log(`- Long tasks: ${jsMetrics.longTaskCount}`);
    console.log(`- Long task time: ${jsMetrics.totalLongTaskTime.toFixed(2)}ms`);

    // Analyze profile for heavy functions
    if (profile && profile.nodes) {
      const heavyNodes = profile.nodes
        .filter((node: any) => node.hitCount > 100)
        .sort((a: any, b: any) => b.hitCount - a.hitCount)
        .slice(0, 5);

      if (heavyNodes.length > 0) {
        console.log('\nTop CPU-intensive functions:');
        heavyNodes.forEach((node: any) => {
          console.log(`  - ${node.callFrame.functionName || 'anonymous'}: ${node.hitCount} samples`);
        });
      }
    }

    expect(jsMetrics.totalScriptTime).toBeLessThan(PERFORMANCE_BUDGETS.JS_EXECUTION_TIME);
    expect(jsMetrics.longTaskCount).toBeLessThan(5);
  });

  test('should maintain performance on slow network connections', async () => {
    page = page || await context.newPage();

    // Simulate slow 3G connection
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (1.6 * 1024 * 1024) / 8, // 1.6 Mbps
      uploadThroughput: (750 * 1024) / 8, // 750 Kbps
      latency: 150, // 150ms RTT
    });

    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const dcl = Date.now() - startTime;

    // Measure interactivity
    const tti = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        if (document.readyState === 'complete') {
          resolve(performance.now());
        } else {
          window.addEventListener('load', () => {
            // Wait for main thread to be idle
            setTimeout(() => resolve(performance.now()), 100);
          });
        }
      });
    });

    console.log('Slow Network Performance:');
    console.log(`- DOM Content Loaded: ${dcl}ms`);
    console.log(`- Time to Interactive: ${tti.toFixed(2)}ms`);

    // Reset network conditions
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: -1,
      uploadThroughput: -1,
      latency: 0,
    });

    // Even on slow network, critical metrics should be acceptable
    expect(dcl).toBeLessThan(5000); // 5s for DCL on slow 3G
    expect(tti).toBeLessThan(10000); // 10s for TTI on slow 3G
  });

  test('should implement effective caching strategies', async () => {
    page = page || await context.newPage();

    const cacheMetrics = {
      cached: 0,
      total: 0,
      cacheableButNotCached: [] as string[],
    };

    // Track caching headers
    page.on('response', (response) => {
      const url = response.url();
      const headers = response.headers();

      if (url.includes('localhost:3000')) {
        cacheMetrics.total++;

        const cacheControl = headers['cache-control'];
        const etag = headers['etag'];
        const lastModified = headers['last-modified'];

        if (cacheControl || etag || lastModified) {
          cacheMetrics.cached++;
        } else if (url.match(/\.(js|css|jpg|jpeg|png|gif|svg|woff2?)$/)) {
          cacheMetrics.cacheableButNotCached.push(url.split('/').pop() || url);
        }
      }
    });

    // First load
    await page.goto('/', { waitUntil: 'networkidle' });

    // Second load to test cache
    const secondLoadMetrics = {
      fromCache: 0,
      fromNetwork: 0,
    };

    page.on('response', (response) => {
      if (response.fromCache()) {
        secondLoadMetrics.fromCache++;
      } else {
        secondLoadMetrics.fromNetwork++;
      }
    });

    await page.reload({ waitUntil: 'networkidle' });

    const cacheEfficiency = (secondLoadMetrics.fromCache / (secondLoadMetrics.fromCache + secondLoadMetrics.fromNetwork)) * 100;

    console.log('Caching Analysis:');
    console.log(`- Resources with cache headers: ${cacheMetrics.cached}/${cacheMetrics.total}`);
    console.log(`- Cache hit rate on reload: ${cacheEfficiency.toFixed(2)}%`);
    console.log(`- Cached resources: ${secondLoadMetrics.fromCache}`);
    console.log(`- Network resources: ${secondLoadMetrics.fromNetwork}`);

    if (cacheMetrics.cacheableButNotCached.length > 0) {
      console.log('\nResources that should be cached:');
      cacheMetrics.cacheableButNotCached.slice(0, 10).forEach(resource => {
        console.log(`  - ${resource}`);
      });
    }

    expect(cacheEfficiency).toBeGreaterThan(50); // At least 50% cache hit rate
  });

  test('should preload critical resources', async () => {
    page = page || await context.newPage();

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const resourceHints = await page.evaluate(() => {
      const preloadLinks = Array.from(document.querySelectorAll('link[rel="preload"]'));
      const prefetchLinks = Array.from(document.querySelectorAll('link[rel="prefetch"]'));
      const preconnectLinks = Array.from(document.querySelectorAll('link[rel="preconnect"]'));
      const dnsPrefetchLinks = Array.from(document.querySelectorAll('link[rel="dns-prefetch"]'));

      return {
        preload: preloadLinks.map(l => ({
          href: l.getAttribute('href'),
          as: l.getAttribute('as'),
        })),
        prefetch: prefetchLinks.map(l => l.getAttribute('href')),
        preconnect: preconnectLinks.map(l => l.getAttribute('href')),
        dnsPrefetch: dnsPrefetchLinks.map(l => l.getAttribute('href')),
      };
    });

    console.log('Resource Hints Analysis:');
    console.log(`- Preload: ${resourceHints.preload.length} resources`);
    console.log(`- Prefetch: ${resourceHints.prefetch.length} resources`);
    console.log(`- Preconnect: ${resourceHints.preconnect.length} origins`);
    console.log(`- DNS Prefetch: ${resourceHints.dnsPrefetch.length} domains`);

    if (resourceHints.preload.length > 0) {
      console.log('\nPreloaded resources:');
      resourceHints.preload.forEach(r => {
        console.log(`  - ${r.as}: ${r.href?.split('/').pop()}`);
      });
    }

    // Check if critical fonts are preloaded
    const hasPreloadedFonts = resourceHints.preload.some(r => r.as === 'font');
    const hasPreloadedCSS = resourceHints.preload.some(r => r.as === 'style');

    // Recommendations
    if (!hasPreloadedFonts) {
      console.log('\n⚠️ Consider preloading critical fonts');
    }
    if (!hasPreloadedCSS) {
      console.log('⚠️ Consider preloading critical CSS');
    }

    // At least some resource hints should be present
    const totalHints = resourceHints.preload.length + resourceHints.prefetch.length +
                      resourceHints.preconnect.length + resourceHints.dnsPrefetch.length;
    expect(totalHints).toBeGreaterThan(0);
  });
});

// Extend Window interface for custom properties
declare global {
  interface Window {
    performanceMetrics: any;
    criticalResources: any[];
  }
}
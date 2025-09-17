import { test, expect, Page, BrowserContext, chromium } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

/**
 * Runtime Performance Tests
 * Requirements:
 * - Smooth animations: 60fps consistently
 * - Memory: No memory leaks during navigation
 * - Real-time: Updates processed within 100ms
 * - Component rendering performance
 * - Accessibility performance
 */

// Performance thresholds
const RUNTIME_BUDGETS = {
  FPS_TARGET: 60,
  FPS_MIN: 55,
  ANIMATION_JANK_THRESHOLD: 5, // Max 5% frames dropped
  MEMORY_LEAK_THRESHOLD_MB: 10, // Max 10MB increase per navigation
  INTERACTION_DELAY_MS: 100, // Max 100ms for user interaction response
  SCROLL_FPS: 55, // Min FPS during scroll
  TYPING_DELAY_MS: 50, // Max delay for typing feedback
  RERENDER_TIME_MS: 16, // Target 16ms for 60fps
  COMPONENT_MOUNT_MS: 100, // Max time for component to mount
  SSE_UPDATE_DELAY_MS: 100, // Max delay for real-time updates
  WEBSOCKET_LATENCY_MS: 50, // Max WebSocket message latency
};

// Test configuration
test.describe.configure({ mode: 'serial' });
test.use({
  viewport: { width: 1920, height: 1080 },
  locale: 'en-US',
});

test.describe('Runtime Performance', () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async () => {
    context = await chromium.launchPersistentContext('', {
      headless: false,
      devtools: true,
      args: [
        '--enable-precise-memory-info',
        '--enable-gpu-rasterization',
        '--enable-zero-copy',
        '--disable-blink-features=AutomationControlled',
      ],
    });
    page = await context.newPage();
  });

  test.afterAll(async () => {
    await context?.close();
  });

  test('should maintain 60fps during animations', async () => {
    await page.goto('/');

    // Setup FPS monitoring
    await page.evaluateOnNewDocument(() => {
      let lastTime = performance.now();
      let frames = 0;
      let fps = 0;
      const fpsHistory: number[] = [];

      const measureFPS = () => {
        const currentTime = performance.now();
        frames++;

        if (currentTime >= lastTime + 1000) {
          fps = Math.round((frames * 1000) / (currentTime - lastTime));
          fpsHistory.push(fps);
          frames = 0;
          lastTime = currentTime;
        }

        requestAnimationFrame(measureFPS);
      };

      measureFPS();

      window.getFPSStats = () => {
        const avgFPS = fpsHistory.length > 0
          ? fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length
          : 0;
        const minFPS = Math.min(...fpsHistory);
        const droppedFrames = fpsHistory.filter(f => f < 55).length;

        return {
          current: fps,
          average: avgFPS,
          minimum: minFPS,
          history: fpsHistory,
          droppedFrameRate: (droppedFrames / fpsHistory.length) * 100,
        };
      };
    });

    // Trigger various animations
    const animationTests = [
      // Modal open/close animation
      async () => {
        const button = await page.$('[data-testid="compose-button"]');
        if (button) {
          await button.click();
          await page.waitForTimeout(500); // Wait for animation
          await page.keyboard.press('Escape');
          await page.waitForTimeout(500);
        }
      },
      // Sidebar navigation animation
      async () => {
        const menuButton = await page.$('[data-testid="menu-button"]');
        if (menuButton) {
          await menuButton.click();
          await page.waitForTimeout(500);
          await menuButton.click();
          await page.waitForTimeout(500);
        }
      },
      // Theme transition animation
      async () => {
        const themeToggle = await page.$('[data-testid="theme-toggle"]');
        if (themeToggle) {
          await themeToggle.click();
          await page.waitForTimeout(1000); // Theme transition
          await themeToggle.click();
          await page.waitForTimeout(1000);
        }
      },
    ];

    // Run animation tests
    for (const testAnimation of animationTests) {
      await testAnimation();
    }

    // Get FPS statistics
    const fpsStats = await page.evaluate(() => window.getFPSStats());

    console.log('Animation Performance:');
    console.log(`- Average FPS: ${fpsStats.average.toFixed(2)}`);
    console.log(`- Minimum FPS: ${fpsStats.minimum}`);
    console.log(`- Dropped frame rate: ${fpsStats.droppedFrameRate.toFixed(2)}%`);

    // Assertions
    expect(fpsStats.average).toBeGreaterThan(RUNTIME_BUDGETS.FPS_MIN);
    expect(fpsStats.minimum).toBeGreaterThan(45); // Minimum acceptable FPS
    expect(fpsStats.droppedFrameRate).toBeLessThan(RUNTIME_BUDGETS.ANIMATION_JANK_THRESHOLD);
  });

  test('should handle smooth scrolling at 60fps', async () => {
    await page.goto('/');

    // Add scroll performance monitoring
    await page.evaluate(() => {
      let scrollFPS = 60;
      let lastScrollTime = performance.now();
      let scrollFrames = 0;
      const scrollFPSHistory: number[] = [];

      const measureScrollFPS = () => {
        const currentTime = performance.now();
        scrollFrames++;

        if (currentTime >= lastScrollTime + 100) { // Measure every 100ms during scroll
          scrollFPS = Math.round((scrollFrames * 1000) / (currentTime - lastScrollTime));
          scrollFPSHistory.push(scrollFPS);
          scrollFrames = 0;
          lastScrollTime = currentTime;
        }
      };

      let scrollRAF: number;
      window.addEventListener('scroll', () => {
        if (scrollRAF) cancelAnimationFrame(scrollRAF);
        scrollRAF = requestAnimationFrame(measureScrollFPS);
      });

      window.getScrollFPSStats = () => {
        const avg = scrollFPSHistory.length > 0
          ? scrollFPSHistory.reduce((a, b) => a + b, 0) / scrollFPSHistory.length
          : 60;
        return {
          average: avg,
          minimum: Math.min(...scrollFPSHistory),
          history: scrollFPSHistory,
        };
      };
    });

    // Generate content to scroll
    await page.evaluate(() => {
      const container = document.querySelector('main') || document.body;
      for (let i = 0; i < 50; i++) {
        const div = document.createElement('div');
        div.style.height = '100px';
        div.style.margin = '20px';
        div.style.background = `hsl(${i * 7}, 70%, 50%)`;
        div.textContent = `Test content block ${i}`;
        container.appendChild(div);
      }
    });

    // Perform smooth scroll test
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await page.waitForTimeout(100);

    // Scroll down
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => {
        window.scrollBy({ top: 300, behavior: 'smooth' });
      });
      await page.waitForTimeout(200);
    }

    // Scroll back up
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);

    const scrollStats = await page.evaluate(() => window.getScrollFPSStats());

    console.log('Scroll Performance:');
    console.log(`- Average scroll FPS: ${scrollStats.average.toFixed(2)}`);
    console.log(`- Minimum scroll FPS: ${scrollStats.minimum}`);

    expect(scrollStats.average).toBeGreaterThan(RUNTIME_BUDGETS.SCROLL_FPS);
  });

  test('should detect and prevent memory leaks', async () => {
    await page.goto('/');

    const getMemoryUsage = async () => {
      return await page.evaluate(() => {
        if ('memory' in performance && (performance as any).memory) {
          const memory = (performance as any).memory;
          return {
            usedJSHeapSize: memory.usedJSHeapSize / (1024 * 1024), // MB
            totalJSHeapSize: memory.totalJSHeapSize / (1024 * 1024),
            limit: memory.jsHeapSizeLimit / (1024 * 1024),
          };
        }
        return null;
      });
    };

    // Initial memory snapshot
    await page.evaluate(() => {
      if (global.gc) {
        global.gc();
      }
    });
    await page.waitForTimeout(1000);
    const initialMemory = await getMemoryUsage();

    if (!initialMemory) {
      console.log('Memory profiling not available in this browser');
      return;
    }

    const memorySnapshots: any[] = [initialMemory];

    // Perform navigation cycles to detect leaks
    const navigationCycles = 5;
    for (let i = 0; i < navigationCycles; i++) {
      // Navigate to different pages
      await page.goto('/trending');
      await page.waitForTimeout(500);

      await page.goto('/explore');
      await page.waitForTimeout(500);

      await page.goto('/');
      await page.waitForTimeout(500);

      // Create and destroy components
      for (let j = 0; j < 10; j++) {
        await page.evaluate(() => {
          const div = document.createElement('div');
          div.innerHTML = '<button>Test</button>'.repeat(100);
          document.body.appendChild(div);
          setTimeout(() => div.remove(), 10);
        });
      }

      // Force garbage collection if available
      await page.evaluate(() => {
        if (global.gc) {
          global.gc();
        }
      });

      await page.waitForTimeout(1000);
      const memory = await getMemoryUsage();
      if (memory) {
        memorySnapshots.push(memory);
      }
    }

    // Analyze memory growth
    const memoryGrowth = memorySnapshots[memorySnapshots.length - 1].usedJSHeapSize - initialMemory.usedJSHeapSize;
    const avgMemoryPerCycle = memoryGrowth / navigationCycles;

    console.log('Memory Leak Detection:');
    console.log(`- Initial memory: ${initialMemory.usedJSHeapSize.toFixed(2)}MB`);
    console.log(`- Final memory: ${memorySnapshots[memorySnapshots.length - 1].usedJSHeapSize.toFixed(2)}MB`);
    console.log(`- Total growth: ${memoryGrowth.toFixed(2)}MB`);
    console.log(`- Average per cycle: ${avgMemoryPerCycle.toFixed(2)}MB`);

    // Log memory trend
    console.log('\nMemory trend:');
    memorySnapshots.forEach((snapshot, index) => {
      console.log(`  Cycle ${index}: ${snapshot.usedJSHeapSize.toFixed(2)}MB`);
    });

    // Assert no significant memory leak
    expect(memoryGrowth).toBeLessThan(RUNTIME_BUDGETS.MEMORY_LEAK_THRESHOLD_MB);
    expect(avgMemoryPerCycle).toBeLessThan(2); // Max 2MB per navigation cycle
  });

  test('should have responsive user interactions', async () => {
    await page.goto('/');

    // Measure interaction responsiveness
    const interactionMetrics = await page.evaluate(() => {
      const interactions: { type: string; delay: number }[] = [];

      // Track click interactions
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type: string, listener: any, options?: any) {
        if (type === 'click') {
          const wrappedListener = function(this: any, event: Event) {
            const start = performance.now();
            const result = listener.call(this, event);
            const delay = performance.now() - start;
            interactions.push({ type: 'click', delay });
            return result;
          };
          return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
      };

      window.getInteractionMetrics = () => {
        const avgDelay = interactions.length > 0
          ? interactions.reduce((sum, i) => sum + i.delay, 0) / interactions.length
          : 0;
        const maxDelay = interactions.length > 0
          ? Math.max(...interactions.map(i => i.delay))
          : 0;
        return {
          count: interactions.length,
          averageDelay: avgDelay,
          maxDelay,
          interactions: interactions.slice(-10), // Last 10 interactions
        };
      };

      return Promise.resolve();
    });

    // Test various interactions
    const testInteractions = [
      // Button clicks
      async () => {
        const buttons = await page.$$('button');
        for (const button of buttons.slice(0, 5)) {
          await button.click();
          await page.waitForTimeout(100);
        }
      },
      // Link navigation
      async () => {
        const links = await page.$$('a[href^="/"]');
        for (const link of links.slice(0, 3)) {
          const href = await link.getAttribute('href');
          if (href && !href.includes('logout')) {
            await link.click();
            await page.waitForTimeout(200);
            await page.goBack();
          }
        }
      },
      // Form inputs
      async () => {
        const inputs = await page.$$('input[type="text"], textarea');
        for (const input of inputs.slice(0, 3)) {
          await input.click();
          await input.type('Test input performance', { delay: 10 });
          await page.waitForTimeout(100);
        }
      },
    ];

    for (const interaction of testInteractions) {
      await interaction();
    }

    const metrics = await page.evaluate(() => window.getInteractionMetrics());

    console.log('Interaction Responsiveness:');
    console.log(`- Total interactions: ${metrics.count}`);
    console.log(`- Average delay: ${metrics.averageDelay.toFixed(2)}ms`);
    console.log(`- Maximum delay: ${metrics.maxDelay.toFixed(2)}ms`);

    if (metrics.interactions.length > 0) {
      console.log('\nRecent interactions:');
      metrics.interactions.forEach((i: any) => {
        console.log(`  - ${i.type}: ${i.delay.toFixed(2)}ms`);
      });
    }

    expect(metrics.averageDelay).toBeLessThan(RUNTIME_BUDGETS.INTERACTION_DELAY_MS);
    expect(metrics.maxDelay).toBeLessThan(RUNTIME_BUDGETS.INTERACTION_DELAY_MS * 2);
  });

  test('should efficiently render components', async () => {
    await page.goto('/');

    // Setup React DevTools profiling if available
    await page.evaluate(() => {
      window.componentRenderTimes = [];

      // Hook into React render cycle if React DevTools is available
      if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
        const originalOnCommitFiberRoot = hook.onCommitFiberRoot;

        hook.onCommitFiberRoot = function(id: any, root: any, priorityLevel: any) {
          const renderTime = root.memoizedInteractions?.size > 0
            ? Array.from(root.memoizedInteractions)[0].timestamp
            : performance.now();
          window.componentRenderTimes.push(renderTime);

          if (originalOnCommitFiberRoot) {
            originalOnCommitFiberRoot.call(this, id, root, priorityLevel);
          }
        };
      }

      // Measure component mount times
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            const renderTime = performance.now();
            window.componentRenderTimes.push(renderTime);
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      window.stopComponentProfiling = () => {
        observer.disconnect();
        const times = window.componentRenderTimes;
        const deltas = [];
        for (let i = 1; i < times.length; i++) {
          deltas.push(times[i] - times[i - 1]);
        }

        return {
          totalRenders: times.length,
          averageRenderTime: deltas.length > 0
            ? deltas.reduce((a, b) => a + b, 0) / deltas.length
            : 0,
          maxRenderTime: deltas.length > 0 ? Math.max(...deltas) : 0,
          renderTimes: deltas.slice(-20), // Last 20 renders
        };
      };
    });

    // Trigger component renders
    await page.evaluate(() => {
      // Trigger state changes
      const buttons = document.querySelectorAll('button');
      buttons.forEach(btn => {
        const event = new MouseEvent('click', { bubbles: true });
        btn.dispatchEvent(event);
      });
    });

    await page.waitForTimeout(2000);

    const renderMetrics = await page.evaluate(() => window.stopComponentProfiling());

    console.log('Component Render Performance:');
    console.log(`- Total renders: ${renderMetrics.totalRenders}`);
    console.log(`- Average render time: ${renderMetrics.averageRenderTime.toFixed(2)}ms`);
    console.log(`- Max render time: ${renderMetrics.maxRenderTime.toFixed(2)}ms`);

    if (renderMetrics.renderTimes.length > 0) {
      const over16ms = renderMetrics.renderTimes.filter((t: number) => t > 16).length;
      console.log(`- Renders over 16ms: ${over16ms}/${renderMetrics.renderTimes.length}`);
    }

    expect(renderMetrics.averageRenderTime).toBeLessThan(RUNTIME_BUDGETS.RERENDER_TIME_MS);
  });

  test('should handle real-time updates efficiently', async () => {
    await page.goto('/');

    // Setup SSE/WebSocket monitoring
    await page.evaluate(() => {
      const sseMetrics = {
        messages: 0,
        totalDelay: 0,
        maxDelay: 0,
        connections: 0,
      };

      const wsMetrics = {
        messages: 0,
        totalLatency: 0,
        maxLatency: 0,
        connections: 0,
      };

      // Monitor SSE
      const originalEventSource = window.EventSource;
      window.EventSource = class extends originalEventSource {
        constructor(url: string, config?: EventSourceInit) {
          super(url, config);
          sseMetrics.connections++;

          const originalAddEventListener = this.addEventListener;
          this.addEventListener = function(type: string, listener: any, options?: any) {
            const wrappedListener = (event: MessageEvent) => {
              const receiveTime = performance.now();
              const result = listener(event);
              const processTime = performance.now() - receiveTime;

              sseMetrics.messages++;
              sseMetrics.totalDelay += processTime;
              sseMetrics.maxDelay = Math.max(sseMetrics.maxDelay, processTime);

              return result;
            };
            return originalAddEventListener.call(this, type, wrappedListener, options);
          };
        }
      };

      // Monitor WebSocket
      const originalWebSocket = window.WebSocket;
      window.WebSocket = class extends originalWebSocket {
        constructor(url: string, protocols?: string | string[]) {
          super(url, protocols);
          wsMetrics.connections++;

          let sendTime = 0;
          const originalSend = this.send;
          this.send = function(data: any) {
            sendTime = performance.now();
            return originalSend.call(this, data);
          };

          this.addEventListener('message', (event) => {
            const latency = performance.now() - sendTime;
            wsMetrics.messages++;
            wsMetrics.totalLatency += latency;
            wsMetrics.maxLatency = Math.max(wsMetrics.maxLatency, latency);
          });
        }
      };

      window.getRealTimeMetrics = () => ({
        sse: {
          ...sseMetrics,
          averageDelay: sseMetrics.messages > 0
            ? sseMetrics.totalDelay / sseMetrics.messages
            : 0,
        },
        websocket: {
          ...wsMetrics,
          averageLatency: wsMetrics.messages > 0
            ? wsMetrics.totalLatency / wsMetrics.messages
            : 0,
        },
      });
    });

    // Simulate real-time activity
    await page.waitForTimeout(3000);

    // Trigger some real-time events if possible
    const composeButton = await page.$('[data-testid="compose-button"]');
    if (composeButton) {
      await composeButton.click();
      await page.fill('[data-testid="post-input"]', 'Test real-time performance');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
    }

    const rtMetrics = await page.evaluate(() => window.getRealTimeMetrics());

    console.log('Real-time Performance:');
    console.log('\nSSE Metrics:');
    console.log(`- Connections: ${rtMetrics.sse.connections}`);
    console.log(`- Messages: ${rtMetrics.sse.messages}`);
    console.log(`- Average delay: ${rtMetrics.sse.averageDelay.toFixed(2)}ms`);
    console.log(`- Max delay: ${rtMetrics.sse.maxDelay.toFixed(2)}ms`);

    console.log('\nWebSocket Metrics:');
    console.log(`- Connections: ${rtMetrics.websocket.connections}`);
    console.log(`- Messages: ${rtMetrics.websocket.messages}`);
    console.log(`- Average latency: ${rtMetrics.websocket.averageLatency.toFixed(2)}ms`);
    console.log(`- Max latency: ${rtMetrics.websocket.maxLatency.toFixed(2)}ms`);

    // Only assert if we have real-time connections
    if (rtMetrics.sse.messages > 0) {
      expect(rtMetrics.sse.averageDelay).toBeLessThan(RUNTIME_BUDGETS.SSE_UPDATE_DELAY_MS);
    }
    if (rtMetrics.websocket.messages > 0) {
      expect(rtMetrics.websocket.averageLatency).toBeLessThan(RUNTIME_BUDGETS.WEBSOCKET_LATENCY_MS);
    }
  });

  test('should maintain performance during heavy DOM operations', async () => {
    await page.goto('/');

    const domPerformance = await page.evaluate(() => {
      const metrics = {
        insertTime: 0,
        updateTime: 0,
        removeTime: 0,
        reflows: 0,
        repaints: 0,
      };

      // Track reflows and repaints
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift') {
            metrics.reflows++;
          } else if (entry.entryType === 'paint') {
            metrics.repaints++;
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift', 'paint'] });

      // Test DOM insertions
      const testInsert = () => {
        const start = performance.now();
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 1000; i++) {
          const div = document.createElement('div');
          div.className = 'test-element';
          div.textContent = `Element ${i}`;
          fragment.appendChild(div);
        }
        document.body.appendChild(fragment);
        metrics.insertTime = performance.now() - start;
      };

      // Test DOM updates
      const testUpdate = () => {
        const elements = document.querySelectorAll('.test-element');
        const start = performance.now();
        elements.forEach((el, i) => {
          el.textContent = `Updated ${i}`;
          (el as HTMLElement).style.color = `hsl(${i % 360}, 50%, 50%)`;
        });
        metrics.updateTime = performance.now() - start;
      };

      // Test DOM removals
      const testRemove = () => {
        const start = performance.now();
        const elements = document.querySelectorAll('.test-element');
        elements.forEach(el => el.remove());
        metrics.removeTime = performance.now() - start;
      };

      // Run tests
      testInsert();
      testUpdate();
      testRemove();

      observer.disconnect();
      return metrics;
    });

    console.log('DOM Operation Performance:');
    console.log(`- Insert 1000 elements: ${domPerformance.insertTime.toFixed(2)}ms`);
    console.log(`- Update 1000 elements: ${domPerformance.updateTime.toFixed(2)}ms`);
    console.log(`- Remove 1000 elements: ${domPerformance.removeTime.toFixed(2)}ms`);
    console.log(`- Layout shifts: ${domPerformance.reflows}`);
    console.log(`- Repaints: ${domPerformance.repaints}`);

    // Performance assertions
    expect(domPerformance.insertTime).toBeLessThan(100); // Insert in <100ms
    expect(domPerformance.updateTime).toBeLessThan(50);  // Update in <50ms
    expect(domPerformance.removeTime).toBeLessThan(50);  // Remove in <50ms
  });

  test('should have optimized input responsiveness', async () => {
    await page.goto('/');

    // Find or create a text input for testing
    await page.evaluate(() => {
      const input = document.createElement('textarea');
      input.id = 'perf-test-input';
      input.style.width = '100%';
      input.style.height = '200px';
      input.placeholder = 'Type here to test input performance...';
      document.body.appendChild(input);
    });

    const input = await page.$('#perf-test-input');
    if (!input) {
      console.log('Could not create test input');
      return;
    }

    // Measure typing performance
    const typingMetrics = await page.evaluate(() => {
      const input = document.getElementById('perf-test-input') as HTMLTextAreaElement;
      const delays: number[] = [];
      let lastKeyTime = 0;

      input.addEventListener('keydown', () => {
        lastKeyTime = performance.now();
      });

      input.addEventListener('input', () => {
        if (lastKeyTime > 0) {
          const delay = performance.now() - lastKeyTime;
          delays.push(delay);
          lastKeyTime = 0;
        }
      });

      window.getTypingMetrics = () => {
        const avgDelay = delays.length > 0
          ? delays.reduce((a, b) => a + b, 0) / delays.length
          : 0;
        return {
          averageDelay: avgDelay,
          maxDelay: delays.length > 0 ? Math.max(...delays) : 0,
          samples: delays.length,
        };
      };

      return Promise.resolve();
    });

    // Type a long text to measure performance
    await input.click();
    const testText = 'The quick brown fox jumps over the lazy dog. '.repeat(10);
    await input.type(testText, { delay: 20 }); // Type with slight delay to simulate real typing

    const metrics = await page.evaluate(() => window.getTypingMetrics());

    console.log('Input Responsiveness:');
    console.log(`- Average typing delay: ${metrics.averageDelay.toFixed(2)}ms`);
    console.log(`- Max typing delay: ${metrics.maxDelay.toFixed(2)}ms`);
    console.log(`- Total keystrokes: ${metrics.samples}`);

    expect(metrics.averageDelay).toBeLessThan(RUNTIME_BUDGETS.TYPING_DELAY_MS);
    expect(metrics.maxDelay).toBeLessThan(RUNTIME_BUDGETS.TYPING_DELAY_MS * 2);
  });

  test('should maintain accessibility performance', async () => {
    await page.goto('/');

    // Inject axe-core for accessibility testing
    await injectAxe(page);

    // Measure accessibility tree generation time
    const a11yPerformance = await page.evaluate(() => {
      const start = performance.now();

      // Force accessibility tree computation
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        // Access properties that trigger accessibility computation
        (el as any).ariaLabel;
        (el as any).ariaDescribedBy;
        el.getAttribute('role');
      });

      const computeTime = performance.now() - start;

      // Count ARIA elements
      const ariaElements = document.querySelectorAll('[aria-label], [aria-describedby], [role]');
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');

      return {
        computeTime,
        ariaElementCount: ariaElements.length,
        interactiveElementCount: interactiveElements.length,
        totalElements: elements.length,
      };
    });

    // Run accessibility audit
    const violations = await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    }).catch(err => {
      console.log('Accessibility violations found:', err);
      return err;
    });

    console.log('Accessibility Performance:');
    console.log(`- Tree computation time: ${a11yPerformance.computeTime.toFixed(2)}ms`);
    console.log(`- ARIA elements: ${a11yPerformance.ariaElementCount}`);
    console.log(`- Interactive elements: ${a11yPerformance.interactiveElementCount}`);
    console.log(`- Total DOM elements: ${a11yPerformance.totalElements}`);

    // Measure screen reader announcement performance
    const srPerformance = await page.evaluate(() => {
      // Create live region for testing
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      document.body.appendChild(liveRegion);

      // Measure announcement update time
      const measurements: number[] = [];
      for (let i = 0; i < 10; i++) {
        const start = performance.now();
        liveRegion.textContent = `Update ${i}`;
        measurements.push(performance.now() - start);
      }

      liveRegion.remove();

      return {
        averageUpdateTime: measurements.reduce((a, b) => a + b, 0) / measurements.length,
        maxUpdateTime: Math.max(...measurements),
      };
    });

    console.log('\nScreen Reader Performance:');
    console.log(`- Average update time: ${srPerformance.averageUpdateTime.toFixed(2)}ms`);
    console.log(`- Max update time: ${srPerformance.maxUpdateTime.toFixed(2)}ms`);

    // Assertions
    expect(a11yPerformance.computeTime).toBeLessThan(100); // Tree computation < 100ms
    expect(srPerformance.averageUpdateTime).toBeLessThan(10); // SR updates < 10ms
  });

  test('should handle network throttling gracefully', async () => {
    const client = await page.context().newCDPSession(page);

    // Test under different network conditions
    const networkProfiles = [
      { name: 'Fast 3G', download: 1.6 * 1024 * 1024 / 8, upload: 750 * 1024 / 8, latency: 150 },
      { name: 'Slow 3G', download: 400 * 1024 / 8, upload: 400 * 1024 / 8, latency: 400 },
      { name: 'Offline', offline: true },
    ];

    const results: any[] = [];

    for (const profile of networkProfiles) {
      console.log(`\nTesting with ${profile.name}...`);

      if (profile.offline) {
        await client.send('Network.emulateNetworkConditions', {
          offline: true,
          downloadThroughput: 0,
          uploadThroughput: 0,
          latency: 0,
        });
      } else {
        await client.send('Network.emulateNetworkConditions', {
          offline: false,
          downloadThroughput: profile.download,
          uploadThroughput: profile.upload,
          latency: profile.latency,
        });
      }

      const start = performance.now();

      try {
        await page.reload({ waitUntil: 'domcontentloaded', timeout: 10000 });
        const loadTime = performance.now() - start;

        const metrics = await page.evaluate(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          return {
            interactive: navigation.domInteractive - navigation.fetchStart,
            complete: navigation.loadEventEnd - navigation.fetchStart,
          };
        }).catch(() => ({ interactive: 0, complete: 0 }));

        results.push({
          profile: profile.name,
          loadTime,
          ...metrics,
        });

      } catch (error) {
        results.push({
          profile: profile.name,
          error: profile.offline ? 'Expected offline' : 'Timeout',
        });
      }
    }

    // Reset network conditions
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: -1,
      uploadThroughput: -1,
      latency: 0,
    });

    console.log('\nNetwork Throttling Results:');
    results.forEach(result => {
      if (result.error) {
        console.log(`- ${result.profile}: ${result.error}`);
      } else {
        console.log(`- ${result.profile}:`);
        console.log(`  Load time: ${result.loadTime.toFixed(0)}ms`);
        console.log(`  Interactive: ${result.interactive.toFixed(0)}ms`);
        console.log(`  Complete: ${result.complete.toFixed(0)}ms`);
      }
    });

    // Assertions for online conditions
    const fast3G = results.find(r => r.profile === 'Fast 3G');
    if (fast3G && !fast3G.error) {
      expect(fast3G.interactive).toBeLessThan(5000); // Interactive in <5s on Fast 3G
    }
  });
});

// Extend Window interface for custom metrics
declare global {
  interface Window {
    getFPSStats: () => any;
    getScrollFPSStats: () => any;
    getInteractionMetrics: () => any;
    componentRenderTimes: number[];
    stopComponentProfiling: () => any;
    getRealTimeMetrics: () => any;
    getTypingMetrics: () => any;
    criticalResources: any[];
    performanceMetrics: any;
  }
}
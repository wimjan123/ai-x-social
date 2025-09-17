import { defineConfig, devices } from '@playwright/test';

/**
 * Performance Testing Configuration for Playwright
 * Optimized for measuring performance metrics and ensuring 60fps/2s load requirements
 */
export default defineConfig({
  testDir: './tests/performance',

  // Performance tests should run serially for accurate measurements
  fullyParallel: false,
  workers: 1,

  // No retries for performance tests to get consistent measurements
  retries: 0,

  // Longer timeout for performance tests
  timeout: 60000,

  // Reporting configuration
  reporter: [
    ['html', { outputFolder: 'playwright-performance-report' }],
    ['json', { outputFile: 'performance-results.json' }],
    ['junit', { outputFile: 'performance-results.xml' }],
    ['list'],
  ],

  use: {
    // Base URL
    baseURL: 'http://localhost:3000',

    // Performance testing requires headed mode for accurate metrics
    headless: false,

    // Viewport for desktop testing
    viewport: { width: 1920, height: 1080 },

    // Enable video recording for performance analysis
    video: {
      mode: 'on',
      size: { width: 1920, height: 1080 },
    },

    // Enable tracing for performance debugging
    trace: 'on',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,

    // Custom context options for performance testing
    contextOptions: {
      // Enable precise memory info
      permissions: ['clipboard-read', 'clipboard-write'],
    },

    // Launch options for performance testing
    launchOptions: {
      args: [
        '--enable-precise-memory-info',
        '--enable-gpu-rasterization',
        '--enable-zero-copy',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process',
        '--enable-features=NetworkService,NetworkServiceInProcess',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--no-sandbox',
      ],
    },
  },

  // Test projects for different scenarios
  projects: [
    // Desktop Chrome - Primary performance testing browser
    {
      name: 'chromium-performance',
      use: {
        ...devices['Desktop Chrome'],
        // Chrome-specific performance flags
        launchOptions: {
          args: [
            '--enable-precise-memory-info',
            '--enable-gpu-rasterization',
            '--enable-zero-copy',
            '--disable-dev-shm-usage',
            '--disable-blink-features=AutomationControlled',
          ],
        },
      },
    },

    // Mobile performance testing
    {
      name: 'mobile-performance',
      use: {
        ...devices['Pixel 5'],
        // Mobile-specific settings
        viewport: { width: 393, height: 851 },
        deviceScaleFactor: 2.625,
        isMobile: true,
        hasTouch: true,
      },
    },

    // Slow network performance testing
    {
      name: 'slow-network',
      use: {
        ...devices['Desktop Chrome'],
        // Simulate slow 3G network
        offline: false,
        launchOptions: {
          args: [
            '--enable-precise-memory-info',
            '--throttling-method=provided',
          ],
        },
      },
    },

    // CPU throttled performance testing
    {
      name: 'throttled-cpu',
      use: {
        ...devices['Desktop Chrome'],
        // CPU throttling will be applied in tests
        launchOptions: {
          args: [
            '--enable-precise-memory-info',
            '--disable-gpu',
          ],
        },
      },
    },
  ],

  // Web server configuration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    // Environment variables for performance mode
    env: {
      NODE_ENV: 'production',
      NEXT_PUBLIC_PERFORMANCE_MODE: 'true',
    },
  },

  // Global setup for performance tests
  globalSetup: './tests/performance/global-setup.ts',

  // Global teardown
  globalTeardown: './tests/performance/global-teardown.ts',

  // Output folder for test results
  outputDir: './test-results/performance',

  // Preserve output for debugging
  preserveOutput: 'failures-only',
});
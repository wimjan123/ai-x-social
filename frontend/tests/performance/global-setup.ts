import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global setup for performance tests
 * Prepares the environment and baseline metrics
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Performance Test Suite');
  console.log('━'.repeat(50));

  // Create directories for reports
  const reportDirs = [
    'playwright-performance-report',
    'test-results/performance',
    'lighthouse-reports',
  ];

  reportDirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });

  // Set up performance baseline file
  const baselineFile = path.join(process.cwd(), 'performance-baseline.json');
  if (!fs.existsSync(baselineFile)) {
    const baseline = {
      timestamp: new Date().toISOString(),
      metrics: {
        FCP: 2000,
        LCP: 2500,
        TBT: 300,
        CLS: 0.1,
        TTI: 3500,
        SI: 3000,
        lighthouseScore: 90,
        bundleSize: 500,
        memoryUsage: 50,
        fps: 60,
      },
      thresholds: {
        regression: 0.1, // 10% regression allowed
        improvement: 0.05, // 5% improvement to update baseline
      },
    };
    fs.writeFileSync(baselineFile, JSON.stringify(baseline, null, 2));
    console.log('✅ Created performance baseline file');
  } else {
    console.log('📊 Using existing performance baseline');
  }

  // Log system information
  console.log('\n📍 Test Environment:');
  console.log(`  - Node Version: ${process.version}`);
  console.log(`  - Platform: ${process.platform}`);
  console.log(`  - Architecture: ${process.arch}`);
  console.log(`  - CPUs: ${require('os').cpus().length}`);
  console.log(`  - Total Memory: ${Math.round(require('os').totalmem() / 1024 / 1024 / 1024)}GB`);
  console.log(`  - Free Memory: ${Math.round(require('os').freemem() / 1024 / 1024 / 1024)}GB`);

  // Check if the application is running
  try {
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      console.log('\n✅ Application is running at http://localhost:3000');
    } else {
      console.log('\n⚠️ Application returned status:', response.status);
    }
  } catch (error) {
    console.log('\n❌ Application is not running. Starting...');
    // The webServer config in playwright.config.ts will handle starting the server
  }

  // Set environment variables for performance testing
  process.env.PERFORMANCE_TEST = 'true';
  process.env.NODE_ENV = 'production';

  console.log('\n🎯 Performance Targets:');
  console.log('  - First Contentful Paint: <2000ms');
  console.log('  - Lighthouse Score: >90');
  console.log('  - Frame Rate: 60fps');
  console.log('  - Bundle Size: <500KB gzipped');
  console.log('  - Memory Leaks: <10MB per navigation');
  console.log('━'.repeat(50));
  console.log('');

  return async () => {
    // Teardown function will be called by global-teardown.ts
  };
}

export default globalSetup;
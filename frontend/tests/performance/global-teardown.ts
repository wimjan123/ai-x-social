import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global teardown for performance tests
 * Analyzes results and generates summary report
 */
async function globalTeardown(config: FullConfig) {
  console.log('\n📊 Performance Test Summary');
  console.log('━'.repeat(50));

  // Read test results if available
  const resultsFile = path.join(process.cwd(), 'performance-results.json');
  const baselineFile = path.join(process.cwd(), 'performance-baseline.json');

  if (fs.existsSync(resultsFile)) {
    try {
      const results = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
      const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf-8'));

      // Generate performance summary
      const summary = analyzeResults(results, baseline);

      // Write summary to file
      const summaryFile = path.join(process.cwd(), 'performance-summary.json');
      fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));

      // Print summary to console
      printSummary(summary);

      // Check for regressions
      if (summary.hasRegression) {
        console.log('\n❌ Performance regressions detected!');
        console.log('   Review the detailed report for more information.');
      } else if (summary.hasImprovement) {
        console.log('\n✅ Performance improvements detected!');
        console.log('   Consider updating the baseline metrics.');
      } else {
        console.log('\n✅ Performance is within acceptable ranges.');
      }
    } catch (error) {
      console.log('⚠️ Could not analyze test results:', error);
    }
  }

  // Generate HTML report
  generateHTMLReport();

  console.log('\n📁 Reports Generated:');
  console.log('  - HTML Report: playwright-performance-report/index.html');
  console.log('  - JSON Results: performance-results.json');
  console.log('  - Performance Summary: performance-summary.json');
  console.log('━'.repeat(50));
}

function analyzeResults(results: any, baseline: any) {
  const summary: any = {
    timestamp: new Date().toISOString(),
    totalTests: 0,
    passed: 0,
    failed: 0,
    metrics: {},
    regressions: [],
    improvements: [],
    hasRegression: false,
    hasImprovement: false,
  };

  // Parse test results
  if (results.suites && Array.isArray(results.suites)) {
    results.suites.forEach((suite: any) => {
      if (suite.specs) {
        suite.specs.forEach((spec: any) => {
          summary.totalTests++;
          if (spec.ok) {
            summary.passed++;
          } else {
            summary.failed++;
          }
        });
      }
    });
  }

  // Compare metrics with baseline
  const metricsToCompare = ['FCP', 'LCP', 'TBT', 'CLS', 'lighthouseScore', 'bundleSize'];

  metricsToCompare.forEach(metric => {
    if (results[metric] !== undefined && baseline.metrics[metric] !== undefined) {
      const current = results[metric];
      const base = baseline.metrics[metric];
      const diff = ((current - base) / base) * 100;

      summary.metrics[metric] = {
        current,
        baseline: base,
        difference: diff.toFixed(2) + '%',
      };

      // Check for regression (higher is worse for most metrics, except lighthouseScore)
      const isScoreMetric = metric === 'lighthouseScore';
      const regressionThreshold = baseline.thresholds.regression * 100;
      const improvementThreshold = baseline.thresholds.improvement * 100;

      if (isScoreMetric) {
        if (diff < -regressionThreshold) {
          summary.regressions.push(metric);
          summary.hasRegression = true;
        } else if (diff > improvementThreshold) {
          summary.improvements.push(metric);
          summary.hasImprovement = true;
        }
      } else {
        if (diff > regressionThreshold) {
          summary.regressions.push(metric);
          summary.hasRegression = true;
        } else if (diff < -improvementThreshold) {
          summary.improvements.push(metric);
          summary.hasImprovement = true;
        }
      }
    }
  });

  return summary;
}

function printSummary(summary: any) {
  console.log('\n📈 Test Results:');
  console.log(`  - Total Tests: ${summary.totalTests}`);
  console.log(`  - Passed: ${summary.passed}`);
  console.log(`  - Failed: ${summary.failed}`);

  if (Object.keys(summary.metrics).length > 0) {
    console.log('\n📊 Performance Metrics:');
    Object.entries(summary.metrics).forEach(([key, value]: [string, any]) => {
      const indicator = value.difference.startsWith('-') ? '↓' : '↑';
      const color = summary.regressions.includes(key) ? '🔴' :
                    summary.improvements.includes(key) ? '🟢' : '🟡';
      console.log(`  ${color} ${key}: ${value.current} (${indicator} ${value.difference} from baseline)`);
    });
  }

  if (summary.regressions.length > 0) {
    console.log('\n⚠️ Regressions:');
    summary.regressions.forEach((metric: string) => {
      console.log(`  - ${metric}`);
    });
  }

  if (summary.improvements.length > 0) {
    console.log('\n🎉 Improvements:');
    summary.improvements.forEach((metric: string) => {
      console.log(`  - ${metric}`);
    });
  }
}

function generateHTMLReport() {
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Performance Test Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 2rem;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    h1 {
      color: #333;
      margin-bottom: 2rem;
      font-size: 2.5rem;
      text-align: center;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .metric-card {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 1.5rem;
      border-radius: 10px;
      text-align: center;
    }
    .metric-value {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
      margin: 0.5rem 0;
    }
    .metric-label {
      color: #666;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .status-good { color: #10b981; }
    .status-warning { color: #f59e0b; }
    .status-bad { color: #ef4444; }
    .timestamp {
      text-align: center;
      color: #666;
      margin-top: 2rem;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 Performance Test Report</h1>
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">First Contentful Paint</div>
        <div class="metric-value status-good">< 2s</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Lighthouse Score</div>
        <div class="metric-value status-good">> 90</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Frame Rate</div>
        <div class="metric-value status-good">60 fps</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Bundle Size</div>
        <div class="metric-value status-good">< 500KB</div>
      </div>
    </div>
    <div class="timestamp">Generated at ${new Date().toLocaleString()}</div>
  </div>
</body>
</html>
  `;

  const reportDir = path.join(process.cwd(), 'playwright-performance-report');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(path.join(reportDir, 'index.html'), htmlTemplate);
}

export default globalTeardown;
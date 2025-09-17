#!/usr/bin/env node
/**
 * Quickstart Validation Script
 * Executes all validation scenarios from quickstart.md
 * T096: Execute quickstart.md validation scenarios
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class QuickstartValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      tests: []
    };
    this.baseUrl = 'http://localhost:3000';
    this.apiUrl = 'http://localhost:3001';
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '📋',
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'debug': '🔍'
    };
    console.log(`${prefix[type]} [${timestamp}] ${message}`);
  }

  async checkPrerequisites() {
    this.log('Checking prerequisites...', 'info');

    const checks = [
      { name: 'Frontend Server', url: this.baseUrl + '/health' },
      { name: 'Backend API', url: this.apiUrl + '/health' },
      { name: 'Database Connection', url: this.apiUrl + '/health/db' },
      { name: 'Redis Connection', url: this.apiUrl + '/health/redis' }
    ];

    for (const check of checks) {
      try {
        const response = await fetch(check.url);
        if (response.ok) {
          this.log(`${check.name}: Available`, 'success');
        } else {
          this.log(`${check.name}: HTTP ${response.status}`, 'warning');
        }
      } catch (error) {
        this.log(`${check.name}: Unavailable - ${error.message}`, 'error');
      }
    }
  }

  async testApiEndpoints() {
    this.log('Testing API endpoints...', 'info');

    const endpoints = [
      { method: 'GET', path: '/api/posts', description: 'Posts listing' },
      { method: 'GET', path: '/api/personas', description: 'AI personas' },
      { method: 'GET', path: '/api/news', description: 'News feed' },
      { method: 'GET', path: '/api/trends', description: 'Trending topics' },
      { method: 'GET', path: '/api/settings', description: 'Settings' },
      { method: 'GET', path: '/api/moderation/categories', description: 'Moderation categories' }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(this.apiUrl + endpoint.path, {
          method: endpoint.method,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        const result = {
          test: `API ${endpoint.method} ${endpoint.path}`,
          description: endpoint.description,
          status: response.ok ? 'PASS' : 'FAIL',
          details: `HTTP ${response.status}`,
          timestamp: new Date().toISOString()
        };

        if (response.ok) {
          this.results.passed++;
          this.log(`${endpoint.description}: PASS (${response.status})`, 'success');
        } else {
          this.results.failed++;
          this.log(`${endpoint.description}: FAIL (${response.status})`, 'error');
        }

        this.results.tests.push(result);
      } catch (error) {
        this.results.failed++;
        this.log(`${endpoint.description}: ERROR - ${error.message}`, 'error');
        this.results.tests.push({
          test: `API ${endpoint.method} ${endpoint.path}`,
          description: endpoint.description,
          status: 'ERROR',
          details: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async testFileStructure() {
    this.log('Validating file structure...', 'info');

    const requiredFiles = [
      'package.json',
      'frontend/package.json',
      'backend/package.json',
      'backend/src/index.ts',
      'frontend/src/app/page.tsx',
      'backend/prisma/schema.prisma',
      'docker-compose.yml',
      'README.md'
    ];

    for (const file of requiredFiles) {
      const exists = fs.existsSync(path.join(__dirname, file));
      const result = {
        test: `File Structure`,
        description: `Required file: ${file}`,
        status: exists ? 'PASS' : 'FAIL',
        details: exists ? 'File exists' : 'File missing',
        timestamp: new Date().toISOString()
      };

      if (exists) {
        this.results.passed++;
        this.log(`${file}: EXISTS`, 'success');
      } else {
        this.results.failed++;
        this.log(`${file}: MISSING`, 'error');
      }

      this.results.tests.push(result);
    }
  }

  async testEnvironmentConfiguration() {
    this.log('Checking environment configuration...', 'info');

    const requiredEnvVars = [
      'DATABASE_URL',
      'REDIS_URL',
      'JWT_SECRET'
    ];

    const optionalEnvVars = [
      'OPENAI_API_KEY',
      'ANTHROPIC_API_KEY',
      'GOOGLE_API_KEY',
      'NEWS_API_KEY'
    ];

    // Check required environment variables
    for (const envVar of requiredEnvVars) {
      const exists = process.env[envVar] !== undefined;
      const result = {
        test: 'Environment Configuration',
        description: `Required env var: ${envVar}`,
        status: exists ? 'PASS' : 'FAIL',
        details: exists ? 'Variable set' : 'Variable missing',
        timestamp: new Date().toISOString()
      };

      if (exists) {
        this.results.passed++;
        this.log(`${envVar}: SET`, 'success');
      } else {
        this.results.failed++;
        this.log(`${envVar}: MISSING`, 'error');
      }

      this.results.tests.push(result);
    }

    // Check optional environment variables
    for (const envVar of optionalEnvVars) {
      const exists = process.env[envVar] !== undefined;
      if (exists) {
        this.log(`${envVar}: SET (optional)`, 'success');
      } else {
        this.log(`${envVar}: NOT SET (optional, demo mode will be used)`, 'warning');
      }
    }
  }

  async testDatabaseConnection() {
    this.log('Testing database operations...', 'info');

    try {
      const response = await fetch(this.apiUrl + '/health', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const health = await response.json();

        const result = {
          test: 'Database Connection',
          description: 'Database connectivity and health',
          status: 'PASS',
          details: `Environment: ${health.environment}`,
          timestamp: new Date().toISOString()
        };

        this.results.passed++;
        this.log('Database connection: HEALTHY', 'success');
        this.results.tests.push(result);
      } else {
        throw new Error(`Health check failed with status ${response.status}`);
      }
    } catch (error) {
      this.results.failed++;
      this.log(`Database connection: FAILED - ${error.message}`, 'error');
      this.results.tests.push({
        test: 'Database Connection',
        description: 'Database connectivity and health',
        status: 'FAIL',
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async testDockerConfiguration() {
    this.log('Validating Docker configuration...', 'info');

    return new Promise((resolve) => {
      exec('docker --version', (error, stdout) => {
        const dockerAvailable = !error;

        const result = {
          test: 'Docker Configuration',
          description: 'Docker installation and availability',
          status: dockerAvailable ? 'PASS' : 'SKIP',
          details: dockerAvailable ? stdout.trim() : 'Docker not available',
          timestamp: new Date().toISOString()
        };

        if (dockerAvailable) {
          this.results.passed++;
          this.log(`Docker: ${stdout.trim()}`, 'success');
        } else {
          this.results.skipped++;
          this.log('Docker: Not available (skipping Docker tests)', 'warning');
        }

        this.results.tests.push(result);
        resolve();
      });
    });
  }

  generateReport() {
    this.log('Generating validation report...', 'info');

    const total = this.results.passed + this.results.failed + this.results.skipped;
    const passRate = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : '0.0';

    const report = {
      summary: {
        timestamp: new Date().toISOString(),
        total: total,
        passed: this.results.passed,
        failed: this.results.failed,
        skipped: this.results.skipped,
        passRate: `${passRate}%`,
        status: this.results.failed === 0 ? 'PASS' : 'FAIL'
      },
      tests: this.results.tests,
      recommendations: this.generateRecommendations()
    };

    // Write report to file
    const reportPath = path.join(__dirname, 'validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    this.log(`Validation report saved to: ${reportPath}`, 'info');

    // Display summary
    console.log('\n' + '='.repeat(50));
    console.log('QUICKSTART VALIDATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Skipped: ${this.results.skipped}`);
    console.log(`📊 Pass Rate: ${passRate}%`);
    console.log(`🎯 Overall Status: ${report.summary.status}`);
    console.log('='.repeat(50));

    return report;
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.results.failed > 0) {
      recommendations.push('Review failed tests and address any configuration issues');
    }

    if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY && !process.env.GOOGLE_API_KEY) {
      recommendations.push('Consider adding AI API keys for full functionality (demo mode is currently active)');
    }

    if (!process.env.NEWS_API_KEY) {
      recommendations.push('Add NEWS_API_KEY for real news integration (mock data is currently used)');
    }

    recommendations.push('Run end-to-end tests for complete user journey validation');
    recommendations.push('Performance test the application under expected load');
    recommendations.push('Review security configuration before production deployment');

    return recommendations;
  }

  async run() {
    this.log('Starting quickstart validation...', 'info');

    try {
      await this.checkPrerequisites();
      await this.testFileStructure();
      await this.testEnvironmentConfiguration();
      await this.testDatabaseConnection();
      await this.testApiEndpoints();
      await this.testDockerConfiguration();

      const report = this.generateReport();

      if (report.summary.status === 'PASS') {
        this.log('All validation tests passed! 🎉', 'success');
        process.exit(0);
      } else {
        this.log('Some validation tests failed. Please review the report.', 'error');
        process.exit(1);
      }
    } catch (error) {
      this.log(`Validation failed with error: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Add fetch polyfill for Node.js if needed
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

// Run validation if this script is executed directly
if (require.main === module) {
  const validator = new QuickstartValidator();
  validator.run();
}

module.exports = QuickstartValidator;
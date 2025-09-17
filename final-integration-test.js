#!/usr/bin/env node
/**
 * Final Integration Testing Script
 * T097: Final integration testing and bug fixes
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class FinalIntegrationTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: [],
      issues: []
    };
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

  async runCommand(command, description) {
    return new Promise((resolve) => {
      this.log(`Running: ${description}`, 'info');

      exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
        const result = {
          test: description,
          command: command,
          status: error ? 'FAIL' : 'PASS',
          stdout: stdout,
          stderr: stderr,
          error: error ? error.message : null,
          timestamp: new Date().toISOString()
        };

        if (error) {
          this.results.failed++;
          this.log(`${description}: FAILED - ${error.message}`, 'error');
          this.results.issues.push({
            type: 'error',
            description: description,
            details: error.message,
            stdout: stdout,
            stderr: stderr
          });
        } else {
          this.results.passed++;
          this.log(`${description}: PASSED`, 'success');
        }

        this.results.tests.push(result);
        resolve(result);
      });
    });
  }

  async testLinting() {
    this.log('Running code quality checks...', 'info');

    // Check if lint scripts exist and run them
    const backendPackage = path.join(__dirname, 'backend/package.json');
    const frontendPackage = path.join(__dirname, 'frontend/package.json');

    if (fs.existsSync(backendPackage)) {
      const pkg = JSON.parse(fs.readFileSync(backendPackage, 'utf8'));
      if (pkg.scripts && pkg.scripts.lint) {
        await this.runCommand('cd backend && npm run lint', 'Backend code linting');
      } else {
        this.log('Backend lint script not found, running manual check', 'warning');
        await this.runCommand('cd backend && find src -name "*.ts" | head -5', 'Backend TypeScript files check');
      }
    }

    if (fs.existsSync(frontendPackage)) {
      const pkg = JSON.parse(fs.readFileSync(frontendPackage, 'utf8'));
      if (pkg.scripts && pkg.scripts.lint) {
        await this.runCommand('cd frontend && npm run lint', 'Frontend code linting');
      } else {
        this.log('Frontend lint script not found, running manual check', 'warning');
        await this.runCommand('cd frontend && find src -name "*.tsx" -o -name "*.ts" | head -5', 'Frontend TypeScript files check');
      }
    }
  }

  async testTypeChecking() {
    this.log('Running TypeScript type checking...', 'info');

    // Backend type checking
    if (fs.existsSync(path.join(__dirname, 'backend/tsconfig.json'))) {
      await this.runCommand('cd backend && npx tsc --noEmit --skipLibCheck', 'Backend TypeScript compilation');
    }

    // Frontend type checking
    if (fs.existsSync(path.join(__dirname, 'frontend/tsconfig.json'))) {
      await this.runCommand('cd frontend && npx tsc --noEmit --skipLibCheck', 'Frontend TypeScript compilation');
    }
  }

  async testUnitTests() {
    this.log('Running unit tests...', 'info');

    // Backend unit tests
    if (fs.existsSync(path.join(__dirname, 'backend/tests'))) {
      const backendPackage = path.join(__dirname, 'backend/package.json');
      if (fs.existsSync(backendPackage)) {
        const pkg = JSON.parse(fs.readFileSync(backendPackage, 'utf8'));
        if (pkg.scripts && pkg.scripts.test) {
          await this.runCommand('cd backend && npm test', 'Backend unit tests');
        } else {
          await this.runCommand('cd backend && npx jest --testPathPattern=tests/unit --passWithNoTests', 'Backend unit tests (manual)');
        }
      }
    }

    // Frontend unit tests
    if (fs.existsSync(path.join(__dirname, 'frontend/tests'))) {
      const frontendPackage = path.join(__dirname, 'frontend/package.json');
      if (fs.existsSync(frontendPackage)) {
        const pkg = JSON.parse(fs.readFileSync(frontendPackage, 'utf8'));
        if (pkg.scripts && pkg.scripts.test) {
          await this.runCommand('cd frontend && npm test -- --watchAll=false', 'Frontend unit tests');
        } else {
          await this.runCommand('cd frontend && npx jest --testPathPattern=tests/unit --passWithNoTests', 'Frontend unit tests (manual)');
        }
      }
    }
  }

  async testBuildProcess() {
    this.log('Testing build processes...', 'info');

    // Backend build
    const backendPackage = path.join(__dirname, 'backend/package.json');
    if (fs.existsSync(backendPackage)) {
      const pkg = JSON.parse(fs.readFileSync(backendPackage, 'utf8'));
      if (pkg.scripts && pkg.scripts.build) {
        await this.runCommand('cd backend && npm run build', 'Backend build process');
      } else {
        await this.runCommand('cd backend && npx tsc --build', 'Backend TypeScript build');
      }
    }

    // Frontend build
    const frontendPackage = path.join(__dirname, 'frontend/package.json');
    if (fs.existsSync(frontendPackage)) {
      const pkg = JSON.parse(fs.readFileSync(frontendPackage, 'utf8'));
      if (pkg.scripts && pkg.scripts.build) {
        await this.runCommand('cd frontend && npm run build', 'Frontend build process');
      }
    }
  }

  async testDockerConfiguration() {
    this.log('Testing Docker configuration...', 'info');

    // Check Docker availability
    await this.runCommand('docker --version', 'Docker installation check');
    await this.runCommand('docker-compose --version', 'Docker Compose check');

    // Validate Docker Compose files
    if (fs.existsSync(path.join(__dirname, 'docker-compose.yml'))) {
      await this.runCommand('docker-compose config', 'Docker Compose configuration validation');
    }

    // Test Dockerfile syntax
    if (fs.existsSync(path.join(__dirname, 'backend/Dockerfile'))) {
      await this.runCommand('docker build --no-cache -t ai-social-backend -f backend/Dockerfile .', 'Backend Docker build test');
    }

    if (fs.existsSync(path.join(__dirname, 'frontend/Dockerfile'))) {
      await this.runCommand('docker build --no-cache -t ai-social-frontend -f frontend/Dockerfile .', 'Frontend Docker build test');
    }
  }

  async testDependencies() {
    this.log('Checking dependencies...', 'info');

    // Check for security vulnerabilities
    if (fs.existsSync(path.join(__dirname, 'backend/package.json'))) {
      await this.runCommand('cd backend && npm audit --audit-level moderate', 'Backend security audit');
    }

    if (fs.existsSync(path.join(__dirname, 'frontend/package.json'))) {
      await this.runCommand('cd frontend && npm audit --audit-level moderate', 'Frontend security audit');
    }

    // Check for outdated packages
    if (fs.existsSync(path.join(__dirname, 'backend/package.json'))) {
      await this.runCommand('cd backend && npm outdated', 'Backend outdated packages check');
    }

    if (fs.existsSync(path.join(__dirname, 'frontend/package.json'))) {
      await this.runCommand('cd frontend && npm outdated', 'Frontend outdated packages check');
    }
  }

  async testFileStructure() {
    this.log('Validating project structure...', 'info');

    const criticalPaths = [
      'backend/src/index.ts',
      'backend/src/services',
      'backend/src/api',
      'backend/src/lib',
      'backend/tests',
      'frontend/src/app',
      'frontend/src/components',
      'frontend/src/services',
      'frontend/tests',
      'docker-compose.yml',
      'package.json',
      'README.md'
    ];

    for (const filePath of criticalPaths) {
      const exists = fs.existsSync(path.join(__dirname, filePath));
      const result = {
        test: 'File Structure Validation',
        description: `Required path: ${filePath}`,
        status: exists ? 'PASS' : 'FAIL',
        details: exists ? 'Path exists' : 'Path missing',
        timestamp: new Date().toISOString()
      };

      if (exists) {
        this.results.passed++;
        this.log(`${filePath}: EXISTS`, 'success');
      } else {
        this.results.failed++;
        this.log(`${filePath}: MISSING`, 'error');
        this.results.issues.push({
          type: 'missing_file',
          description: `Missing critical path: ${filePath}`,
          details: 'Required for proper application functionality'
        });
      }

      this.results.tests.push(result);
    }
  }

  async analyzeCodeQuality() {
    this.log('Analyzing code quality metrics...', 'info');

    // Count lines of code
    await this.runCommand('find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -E "(src/|tests/)" | wc -l', 'Count TypeScript/JavaScript files');

    // Check for TODO/FIXME comments
    await this.runCommand('grep -r "TODO\\|FIXME\\|XXX" backend/src frontend/src || echo "No TODO/FIXME comments found"', 'Check for TODO/FIXME comments');

    // Check for console.log statements (potential debug code)
    await this.runCommand('grep -r "console.log" backend/src frontend/src || echo "No console.log statements found"', 'Check for debug console statements');

    // Check for proper error handling
    await this.runCommand('grep -r "try {" backend/src | wc -l', 'Count try-catch blocks in backend');
  }

  generateIssueReport() {
    this.log('Analyzing issues and generating recommendations...', 'info');

    const criticalIssues = this.results.issues.filter(issue => issue.type === 'error');
    const warnings = this.results.issues.filter(issue => issue.type === 'warning' || issue.type === 'missing_file');

    const recommendations = [];

    if (criticalIssues.length > 0) {
      recommendations.push('🚨 Critical issues found that must be resolved before deployment');
      criticalIssues.forEach(issue => {
        recommendations.push(`   - ${issue.description}: ${issue.details}`);
      });
    }

    if (warnings.length > 0) {
      recommendations.push('⚠️ Warnings that should be addressed:');
      warnings.forEach(warning => {
        recommendations.push(`   - ${warning.description}: ${warning.details}`);
      });
    }

    // Add general recommendations
    recommendations.push('🔍 Additional recommendations:');
    recommendations.push('   - Run performance tests before production deployment');
    recommendations.push('   - Verify all environment variables are properly configured');
    recommendations.push('   - Test real-time features under load');
    recommendations.push('   - Validate AI service integrations with actual API keys');
    recommendations.push('   - Perform security penetration testing');
    recommendations.push('   - Set up monitoring and logging for production');

    return {
      criticalIssues: criticalIssues.length,
      warnings: warnings.length,
      recommendations: recommendations
    };
  }

  generateFinalReport() {
    this.log('Generating final integration report...', 'info');

    const total = this.results.passed + this.results.failed;
    const passRate = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : '0.0';
    const issueAnalysis = this.generateIssueReport();

    const report = {
      summary: {
        timestamp: new Date().toISOString(),
        total: total,
        passed: this.results.passed,
        failed: this.results.failed,
        warnings: this.results.warnings,
        passRate: `${passRate}%`,
        status: this.results.failed === 0 ? 'READY_FOR_DEPLOYMENT' : 'NEEDS_FIXES',
        criticalIssues: issueAnalysis.criticalIssues,
        totalWarnings: issueAnalysis.warnings
      },
      tests: this.results.tests,
      issues: this.results.issues,
      recommendations: issueAnalysis.recommendations,
      nextSteps: [
        'Review all failed tests and resolve issues',
        'Address security vulnerabilities if any',
        'Test with real API keys and production data',
        'Perform load testing with expected user volumes',
        'Set up production monitoring and alerting',
        'Create production deployment checklist',
        'Document operational procedures'
      ]
    };

    // Write comprehensive report
    const reportPath = path.join(__dirname, 'final-integration-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    this.log(`Final integration report saved to: ${reportPath}`, 'info');

    return report;
  }

  displaySummary(report) {
    console.log('\n' + '='.repeat(60));
    console.log('FINAL INTEGRATION TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`🕐 Timestamp: ${report.summary.timestamp}`);
    console.log(`📊 Total Tests: ${report.summary.total}`);
    console.log(`✅ Passed: ${report.summary.passed}`);
    console.log(`❌ Failed: ${report.summary.failed}`);
    console.log(`⚠️  Warnings: ${report.summary.warnings}`);
    console.log(`📈 Pass Rate: ${report.summary.passRate}`);
    console.log(`🎯 Status: ${report.summary.status}`);
    console.log(`🚨 Critical Issues: ${report.summary.criticalIssues}`);
    console.log('='.repeat(60));

    if (report.recommendations && report.recommendations.length > 0) {
      console.log('\n📋 RECOMMENDATIONS:');
      report.recommendations.forEach(rec => console.log(rec));
    }

    console.log('\n📄 Detailed report saved to: final-integration-report.json');
    console.log('='.repeat(60));
  }

  async run() {
    this.log('Starting final integration testing...', 'info');

    try {
      // Run all test suites
      await this.testFileStructure();
      await this.testLinting();
      await this.testTypeChecking();
      await this.testBuildProcess();
      await this.testUnitTests();
      await this.testDependencies();
      await this.testDockerConfiguration();
      await this.analyzeCodeQuality();

      // Generate and display final report
      const report = this.generateFinalReport();
      this.displaySummary(report);

      // Exit with appropriate code
      if (report.summary.status === 'READY_FOR_DEPLOYMENT') {
        this.log('🎉 Integration testing completed successfully! Application is ready for deployment.', 'success');
        process.exit(0);
      } else {
        this.log('❌ Integration testing found issues that need to be resolved.', 'error');
        process.exit(1);
      }

    } catch (error) {
      this.log(`Integration testing failed with error: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Run integration tests if this script is executed directly
if (require.main === module) {
  const tester = new FinalIntegrationTester();
  tester.run();
}

module.exports = FinalIntegrationTester;
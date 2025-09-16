/**
 * Health Monitor Implementation
 *
 * Monitors AI provider health and performance metrics.
 * Part of T049e: Health monitoring and automatic switching
 */

import { IAIProvider, HealthStatus, ProviderHealthReport } from '../interfaces/IAIProvider';
import { CircuitBreaker } from './CircuitBreaker';

export class HealthMonitor {
  private providers: IAIProvider[];
  private circuitBreaker?: CircuitBreaker;
  private monitoring: boolean = false;
  private healthHistory: Map<string, HealthHistoryEntry[]> = new Map();
  private config: HealthMonitorConfig;
  private intervalId?: NodeJS.Timeout;

  constructor(providers: IAIProvider[], circuitBreaker?: CircuitBreaker, config?: Partial<HealthMonitorConfig>) {
    this.providers = providers;
    this.circuitBreaker = circuitBreaker;
    this.config = {
      checkInterval: config?.checkInterval || 30000, // 30 seconds
      historyRetention: config?.historyRetention || 3600000, // 1 hour
      healthThreshold: config?.healthThreshold || 0.8,
      performanceWindow: config?.performanceWindow || 300000, // 5 minutes
      maxHistoryEntries: config?.maxHistoryEntries || 120, // 2 hours worth at 1 min intervals
      alertThresholds: {
        responseTime: config?.alertThresholds?.responseTime || 5000, // 5 seconds
        errorRate: config?.alertThresholds?.errorRate || 0.5, // 50%
        consecutiveFailures: config?.alertThresholds?.consecutiveFailures || 3,
        ...config?.alertThresholds
      },
      ...config
    };

    // Initialize health history for all providers
    this.providers.forEach(provider => {
      this.healthHistory.set(provider.name, []);
    });
  }

  // ============================================================================
  // MONITORING CONTROL
  // ============================================================================

  startMonitoring(): void {
    if (this.monitoring) {
      console.warn('Health monitoring is already running');
      return;
    }

    this.monitoring = true;
    console.log(`Starting health monitoring with ${this.config.checkInterval}ms interval`);

    // Initial health check
    this.performHealthChecks();

    // Schedule periodic health checks
    this.intervalId = setInterval(() => {
      this.performHealthChecks();
    }, this.config.checkInterval);
  }

  stopMonitoring(): void {
    if (!this.monitoring) {
      return;
    }

    this.monitoring = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    console.log('Health monitoring stopped');
  }

  isMonitoring(): boolean {
    return this.monitoring;
  }

  // ============================================================================
  // HEALTH CHECKING
  // ============================================================================

  private async performHealthChecks(): Promise<void> {
    const checkPromises = this.providers.map(provider => this.checkProviderHealth(provider));

    try {
      await Promise.allSettled(checkPromises);
      this.cleanupOldHistory();
    } catch (error) {
      console.error('Error during health checks:', error);
    }
  }

  private async checkProviderHealth(provider: IAIProvider): Promise<void> {
    const startTime = Date.now();
    let healthStatus: HealthStatus;

    try {
      healthStatus = await provider.checkHealth();
    } catch (error) {
      console.warn(`Health check failed for ${provider.name}:`, error);
      healthStatus = {
        isHealthy: false,
        responseTime: Date.now() - startTime,
        errorRate: 1.0,
        lastChecked: new Date(),
        consecutiveFailures: 999
      };
    }

    // Record health history
    this.recordHealthStatus(provider.name, healthStatus);

    // Check for alerts
    this.checkForAlerts(provider.name, healthStatus);

    // Update circuit breaker if available
    if (this.circuitBreaker) {
      if (healthStatus.isHealthy) {
        this.circuitBreaker.recordSuccess(provider.name);
      } else {
        this.circuitBreaker.recordFailure(provider.name, new Error('Health check failed'));
      }
    }
  }

  async checkProviderHealthOnDemand(providerName: string): Promise<HealthStatus | null> {
    const provider = this.providers.find(p => p.name === providerName);
    if (!provider) {
      return null;
    }

    try {
      const healthStatus = await provider.checkHealth();
      this.recordHealthStatus(provider.name, healthStatus);
      return healthStatus;
    } catch (error) {
      console.warn(`On-demand health check failed for ${providerName}:`, error);
      return {
        isHealthy: false,
        responseTime: 0,
        errorRate: 1.0,
        lastChecked: new Date(),
        consecutiveFailures: 999
      };
    }
  }

  // ============================================================================
  // HEALTH HISTORY MANAGEMENT
  // ============================================================================

  private recordHealthStatus(providerName: string, status: HealthStatus): void {
    const history = this.healthHistory.get(providerName) || [];

    const entry: HealthHistoryEntry = {
      timestamp: Date.now(),
      isHealthy: status.isHealthy,
      responseTime: status.responseTime,
      errorRate: status.errorRate,
      consecutiveFailures: status.consecutiveFailures
    };

    history.push(entry);

    // Limit history size
    if (history.length > this.config.maxHistoryEntries) {
      history.splice(0, history.length - this.config.maxHistoryEntries);
    }

    this.healthHistory.set(providerName, history);
  }

  private cleanupOldHistory(): void {
    const cutoffTime = Date.now() - this.config.historyRetention;

    this.healthHistory.forEach((history, providerName) => {
      const filteredHistory = history.filter(entry => entry.timestamp > cutoffTime);
      this.healthHistory.set(providerName, filteredHistory);
    });
  }

  // ============================================================================
  // HEALTH REPORTING
  // ============================================================================

  async getProviderHealthReports(): Promise<ProviderHealthReport[]> {
    const reports: ProviderHealthReport[] = [];

    for (const provider of this.providers) {
      try {
        const health = await provider.checkHealth();
        const capabilities = provider.getCapabilities();
        const circuitBreakerState = this.circuitBreaker?.getStateInfo(provider.name) || {
          state: 'CLOSED',
          consecutiveFailures: 0,
          lastFailure: 0
        };

        const report: ProviderHealthReport = {
          name: provider.name,
          priority: provider.priority,
          health,
          circuitBreakerState,
          capabilities,
          lastResponse: this.getLastResponseInfo(provider.name)
        };

        reports.push(report);
      } catch (error) {
        console.warn(`Failed to generate health report for ${provider.name}:`, error);
      }
    }

    return reports.sort((a, b) => a.priority - b.priority);
  }

  getHealthHistory(providerName: string, timeWindow?: number): HealthHistoryEntry[] {
    const history = this.healthHistory.get(providerName) || [];

    if (!timeWindow) {
      return [...history];
    }

    const cutoffTime = Date.now() - timeWindow;
    return history.filter(entry => entry.timestamp > cutoffTime);
  }

  getAllHealthHistory(timeWindow?: number): Map<string, HealthHistoryEntry[]> {
    const result = new Map<string, HealthHistoryEntry[]>();

    this.healthHistory.forEach((history, providerName) => {
      result.set(providerName, this.getHealthHistory(providerName, timeWindow));
    });

    return result;
  }

  private getLastResponseInfo(providerName: string): ProviderHealthReport['lastResponse'] {
    const history = this.healthHistory.get(providerName) || [];
    const lastEntry = history[history.length - 1];

    if (!lastEntry) {
      return undefined;
    }

    return {
      timestamp: new Date(lastEntry.timestamp),
      responseTime: lastEntry.responseTime,
      success: lastEntry.isHealthy
    };
  }

  // ============================================================================
  // PERFORMANCE ANALYTICS
  // ============================================================================

  getPerformanceMetrics(providerName: string, timeWindow?: number): ProviderPerformanceMetrics {
    const window = timeWindow || this.config.performanceWindow;
    const history = this.getHealthHistory(providerName, window);

    if (history.length === 0) {
      return {
        providerName,
        timeWindow: window,
        totalChecks: 0,
        successfulChecks: 0,
        healthRate: 0,
        averageResponseTime: 0,
        medianResponseTime: 0,
        p95ResponseTime: 0,
        averageErrorRate: 0,
        uptimePercentage: 0
      };
    }

    const successfulChecks = history.filter(entry => entry.isHealthy).length;
    const responseTimes = history.map(entry => entry.responseTime).sort((a, b) => a - b);
    const errorRates = history.map(entry => entry.errorRate);

    return {
      providerName,
      timeWindow: window,
      totalChecks: history.length,
      successfulChecks,
      healthRate: successfulChecks / history.length,
      averageResponseTime: responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length,
      medianResponseTime: responseTimes[Math.floor(responseTimes.length / 2)] || 0,
      p95ResponseTime: responseTimes[Math.floor(responseTimes.length * 0.95)] || 0,
      averageErrorRate: errorRates.reduce((sum, rate) => sum + rate, 0) / errorRates.length,
      uptimePercentage: (successfulChecks / history.length) * 100
    };
  }

  getAllPerformanceMetrics(timeWindow?: number): ProviderPerformanceMetrics[] {
    return this.providers.map(provider => this.getPerformanceMetrics(provider.name, timeWindow));
  }

  // ============================================================================
  // ALERTING
  // ============================================================================

  private checkForAlerts(providerName: string, status: HealthStatus): void {
    const alerts: HealthAlert[] = [];

    // Response time alert
    if (status.responseTime > this.config.alertThresholds.responseTime) {
      alerts.push({
        type: 'HIGH_RESPONSE_TIME',
        providerName,
        message: `Response time ${status.responseTime}ms exceeds threshold ${this.config.alertThresholds.responseTime}ms`,
        severity: 'WARNING',
        timestamp: Date.now(),
        value: status.responseTime,
        threshold: this.config.alertThresholds.responseTime
      });
    }

    // Error rate alert
    if (status.errorRate > this.config.alertThresholds.errorRate) {
      alerts.push({
        type: 'HIGH_ERROR_RATE',
        providerName,
        message: `Error rate ${(status.errorRate * 100).toFixed(1)}% exceeds threshold ${(this.config.alertThresholds.errorRate * 100).toFixed(1)}%`,
        severity: 'ERROR',
        timestamp: Date.now(),
        value: status.errorRate,
        threshold: this.config.alertThresholds.errorRate
      });
    }

    // Consecutive failures alert
    if (status.consecutiveFailures > this.config.alertThresholds.consecutiveFailures) {
      alerts.push({
        type: 'CONSECUTIVE_FAILURES',
        providerName,
        message: `${status.consecutiveFailures} consecutive failures exceeds threshold ${this.config.alertThresholds.consecutiveFailures}`,
        severity: 'CRITICAL',
        timestamp: Date.now(),
        value: status.consecutiveFailures,
        threshold: this.config.alertThresholds.consecutiveFailures
      });
    }

    // General health alert
    if (!status.isHealthy) {
      alerts.push({
        type: 'PROVIDER_UNHEALTHY',
        providerName,
        message: `Provider ${providerName} is reporting unhealthy status`,
        severity: 'ERROR',
        timestamp: Date.now(),
        value: 0,
        threshold: 1
      });
    }

    // Emit alerts (in a real system, this would integrate with alerting infrastructure)
    alerts.forEach(alert => this.emitAlert(alert));
  }

  private emitAlert(alert: HealthAlert): void {
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.warn(`HEALTH ALERT [${alert.severity}] ${alert.providerName}: ${alert.message}`);
    }

    // In production, this would integrate with:
    // - Slack/Discord notifications
    // - PagerDuty/Opsgenie
    // - Email alerts
    // - Metrics systems (Prometheus, DataDog, etc.)
  }

  // ============================================================================
  // CONFIGURATION & UTILITIES
  // ============================================================================

  updateConfiguration(config: Partial<HealthMonitorConfig>): void {
    this.config = { ...this.config, ...config };

    if (this.monitoring && config.checkInterval) {
      // Restart monitoring with new interval
      this.stopMonitoring();
      this.startMonitoring();
    }
  }

  getConfiguration(): HealthMonitorConfig {
    return { ...this.config };
  }

  addProvider(provider: IAIProvider): void {
    this.providers.push(provider);
    this.healthHistory.set(provider.name, []);
  }

  removeProvider(providerName: string): void {
    this.providers = this.providers.filter(p => p.name !== providerName);
    this.healthHistory.delete(providerName);
  }

  getOverallSystemHealth(): SystemHealthSummary {
    const reports = this.providers.map(provider => {
      const history = this.getHealthHistory(provider.name, this.config.performanceWindow);
      const recentHealth = history.length > 0 ? history[history.length - 1] : null;

      return {
        name: provider.name,
        priority: provider.priority,
        isHealthy: recentHealth?.isHealthy ?? false,
        responseTime: recentHealth?.responseTime ?? 0
      };
    });

    const healthyProviders = reports.filter(r => r.isHealthy).length;
    const totalProviders = reports.length;

    return {
      totalProviders,
      healthyProviders,
      unhealthyProviders: totalProviders - healthyProviders,
      overallHealthPercentage: totalProviders > 0 ? (healthyProviders / totalProviders) * 100 : 100,
      primaryProviderHealthy: reports.find(r => r.priority === 1)?.isHealthy ?? false,
      averageResponseTime: reports.reduce((sum, r) => sum + r.responseTime, 0) / Math.max(reports.length, 1),
      lastUpdated: new Date()
    };
  }

  cleanup(): void {
    this.stopMonitoring();
    this.healthHistory.clear();
  }
}

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface HealthMonitorConfig {
  checkInterval: number;
  historyRetention: number;
  healthThreshold: number;
  performanceWindow: number;
  maxHistoryEntries: number;
  alertThresholds: {
    responseTime: number;
    errorRate: number;
    consecutiveFailures: number;
  };
}

interface HealthHistoryEntry {
  timestamp: number;
  isHealthy: boolean;
  responseTime: number;
  errorRate: number;
  consecutiveFailures: number;
}

interface ProviderPerformanceMetrics {
  providerName: string;
  timeWindow: number;
  totalChecks: number;
  successfulChecks: number;
  healthRate: number;
  averageResponseTime: number;
  medianResponseTime: number;
  p95ResponseTime: number;
  averageErrorRate: number;
  uptimePercentage: number;
}

interface HealthAlert {
  type: 'HIGH_RESPONSE_TIME' | 'HIGH_ERROR_RATE' | 'CONSECUTIVE_FAILURES' | 'PROVIDER_UNHEALTHY';
  providerName: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  timestamp: number;
  value: number;
  threshold: number;
}

interface SystemHealthSummary {
  totalProviders: number;
  healthyProviders: number;
  unhealthyProviders: number;
  overallHealthPercentage: number;
  primaryProviderHealthy: boolean;
  averageResponseTime: number;
  lastUpdated: Date;
}
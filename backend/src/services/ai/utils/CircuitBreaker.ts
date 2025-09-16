/**
 * Circuit Breaker Implementation
 *
 * Implements circuit breaker pattern for AI provider failover management.
 * Part of T049e: Health monitoring and automatic switching
 */

import { CircuitBreakerState } from '../interfaces/IAIProvider';

export class CircuitBreaker {
  private states: Map<string, CircuitState> = new Map();
  private config: CircuitBreakerConfig;

  constructor(config?: Partial<CircuitBreakerConfig>) {
    this.config = {
      failureThreshold: config?.failureThreshold || 5,
      recoveryTimeout: config?.recoveryTimeout || 30000, // 30 seconds
      monitoringPeriod: config?.monitoringPeriod || 60000, // 1 minute
      halfOpenMaxCalls: config?.halfOpenMaxCalls || 3,
      ...config
    };
  }

  // ============================================================================
  // CORE CIRCUIT BREAKER LOGIC
  // ============================================================================

  canExecute(providerName: string): boolean {
    const state = this.getState(providerName);

    switch (state.state) {
      case 'CLOSED':
        return true;

      case 'HALF_OPEN':
        return state.halfOpenCalls < this.config.halfOpenMaxCalls;

      case 'OPEN':
        // Check if recovery timeout has passed
        if (Date.now() - state.lastFailure >= this.config.recoveryTimeout) {
          this.transitionToHalfOpen(providerName);
          return true;
        }
        return false;

      default:
        return false;
    }
  }

  recordSuccess(providerName: string): void {
    const state = this.getState(providerName);

    switch (state.state) {
      case 'CLOSED':
        // Reset failure count on success
        state.consecutiveFailures = 0;
        state.lastSuccess = Date.now();
        break;

      case 'HALF_OPEN':
        state.halfOpenCalls++;
        state.halfOpenSuccesses++;
        state.lastSuccess = Date.now();

        // If we've had enough successful calls, transition to closed
        if (state.halfOpenSuccesses >= Math.ceil(this.config.halfOpenMaxCalls / 2)) {
          this.transitionToClosed(providerName);
        }
        break;

      case 'OPEN':
        // This shouldn't happen, but handle gracefully
        console.warn(`Received success for ${providerName} while circuit is OPEN`);
        break;
    }

    this.states.set(providerName, state);
    this.logStateChange(providerName, 'SUCCESS', state);
  }

  recordFailure(providerName: string, error?: Error): void {
    const state = this.getState(providerName);
    const now = Date.now();

    state.consecutiveFailures++;
    state.lastFailure = now;

    // Store error information
    if (error) {
      state.lastError = {
        message: error.message,
        timestamp: now,
        type: error.constructor.name
      };
    }

    switch (state.state) {
      case 'CLOSED':
        if (state.consecutiveFailures >= this.config.failureThreshold) {
          this.transitionToOpen(providerName);
        }
        break;

      case 'HALF_OPEN':
        state.halfOpenCalls++;
        // Any failure in half-open immediately returns to open
        this.transitionToOpen(providerName);
        break;

      case 'OPEN':
        // Already open, just update metrics
        break;
    }

    this.states.set(providerName, state);
    this.logStateChange(providerName, 'FAILURE', state);
  }

  // ============================================================================
  // STATE TRANSITIONS
  // ============================================================================

  private transitionToClosed(providerName: string): void {
    const state = this.getState(providerName);
    const previousState = state.state;

    state.state = 'CLOSED';
    state.consecutiveFailures = 0;
    state.halfOpenCalls = 0;
    state.halfOpenSuccesses = 0;
    state.transitionTime = Date.now();

    this.states.set(providerName, state);
    this.logStateTransition(providerName, previousState, 'CLOSED');
  }

  private transitionToOpen(providerName: string): void {
    const state = this.getState(providerName);
    const previousState = state.state;

    state.state = 'OPEN';
    state.transitionTime = Date.now();
    state.nextRetryTime = Date.now() + this.config.recoveryTimeout;
    state.halfOpenCalls = 0;
    state.halfOpenSuccesses = 0;

    this.states.set(providerName, state);
    this.logStateTransition(providerName, previousState, 'OPEN');
  }

  private transitionToHalfOpen(providerName: string): void {
    const state = this.getState(providerName);
    const previousState = state.state;

    state.state = 'HALF_OPEN';
    state.transitionTime = Date.now();
    state.halfOpenCalls = 0;
    state.halfOpenSuccesses = 0;

    this.states.set(providerName, state);
    this.logStateTransition(providerName, previousState, 'HALF_OPEN');
  }

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  getState(providerName: string): CircuitState {
    if (!this.states.has(providerName)) {
      const initialState: CircuitState = {
        state: 'CLOSED',
        consecutiveFailures: 0,
        lastFailure: 0,
        lastSuccess: Date.now(),
        transitionTime: Date.now(),
        halfOpenCalls: 0,
        halfOpenSuccesses: 0
      };
      this.states.set(providerName, initialState);
    }

    return this.states.get(providerName)!;
  }

  getStateInfo(providerName: string): CircuitBreakerState {
    const state = this.getState(providerName);

    return {
      state: state.state,
      consecutiveFailures: state.consecutiveFailures,
      lastFailure: state.lastFailure,
      nextRetryTime: state.nextRetryTime
    };
  }

  getAllStates(): Map<string, CircuitBreakerState> {
    const result = new Map<string, CircuitBreakerState>();

    this.states.forEach((state, providerName) => {
      result.set(providerName, {
        state: state.state,
        consecutiveFailures: state.consecutiveFailures,
        lastFailure: state.lastFailure,
        nextRetryTime: state.nextRetryTime
      });
    });

    return result;
  }

  // ============================================================================
  // METRICS & MONITORING
  // ============================================================================

  getMetrics(providerName: string): CircuitBreakerMetrics {
    const state = this.getState(providerName);
    const now = Date.now();

    return {
      providerName,
      currentState: state.state,
      consecutiveFailures: state.consecutiveFailures,
      lastFailureTime: state.lastFailure,
      lastSuccessTime: state.lastSuccess,
      timeInCurrentState: now - (state.transitionTime || now),
      halfOpenCalls: state.halfOpenCalls,
      halfOpenSuccesses: state.halfOpenSuccesses,
      nextRetryTime: state.nextRetryTime,
      lastError: state.lastError
    };
  }

  getAllMetrics(): CircuitBreakerMetrics[] {
    return Array.from(this.states.keys()).map(provider => this.getMetrics(provider));
  }

  // ============================================================================
  // CONFIGURATION & CONTROL
  // ============================================================================

  updateConfiguration(config: Partial<CircuitBreakerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfiguration(): CircuitBreakerConfig {
    return { ...this.config };
  }

  resetProvider(providerName: string): void {
    if (this.states.has(providerName)) {
      this.transitionToClosed(providerName);
      console.log(`Circuit breaker for ${providerName} has been manually reset`);
    }
  }

  resetAllProviders(): void {
    this.states.forEach((_, providerName) => {
      this.transitionToClosed(providerName);
    });
    console.log('All circuit breakers have been manually reset');
  }

  // ============================================================================
  // ADVANCED FEATURES
  // ============================================================================

  getFailureRate(providerName: string, timeWindow: number = 300000): number {
    const state = this.getState(providerName);
    const now = Date.now();

    // Simple failure rate calculation based on consecutive failures and time
    if (state.consecutiveFailures === 0) return 0;

    const timeSinceLastFailure = now - state.lastFailure;
    if (timeSinceLastFailure > timeWindow) return 0;

    // Calculate failure rate as percentage within time window
    return Math.min((state.consecutiveFailures / this.config.failureThreshold) * 100, 100);
  }

  isRecovering(providerName: string): boolean {
    const state = this.getState(providerName);
    return state.state === 'HALF_OPEN';
  }

  getTimeUntilRetry(providerName: string): number {
    const state = this.getState(providerName);

    if (state.state !== 'OPEN' || !state.nextRetryTime) {
      return 0;
    }

    return Math.max(0, state.nextRetryTime - Date.now());
  }

  // ============================================================================
  // LOGGING & DEBUGGING
  // ============================================================================

  private logStateChange(providerName: string, event: string, state: CircuitState): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`CircuitBreaker [${providerName}] ${event}: ${state.state} (failures: ${state.consecutiveFailures})`);
    }
  }

  private logStateTransition(providerName: string, from: string, to: string): void {
    console.log(`CircuitBreaker [${providerName}] State transition: ${from} -> ${to}`);
  }

  // ============================================================================
  // CLEANUP & MAINTENANCE
  // ============================================================================

  cleanup(): void {
    const now = Date.now();
    const staleThreshold = this.config.monitoringPeriod * 10; // 10 monitoring periods

    this.states.forEach((state, providerName) => {
      const lastActivity = Math.max(state.lastFailure, state.lastSuccess || 0);
      if (now - lastActivity > staleThreshold) {
        this.states.delete(providerName);
        console.log(`Cleaned up stale circuit breaker state for ${providerName}`);
      }
    });
  }

  getHealthSummary(): CircuitBreakerHealthSummary {
    const metrics = this.getAllMetrics();

    return {
      totalProviders: metrics.length,
      healthyProviders: metrics.filter(m => m.currentState === 'CLOSED').length,
      failedProviders: metrics.filter(m => m.currentState === 'OPEN').length,
      recoveringProviders: metrics.filter(m => m.currentState === 'HALF_OPEN').length,
      overallHealth: metrics.length > 0
        ? metrics.filter(m => m.currentState === 'CLOSED').length / metrics.length
        : 1.0
    };
  }
}

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeout: number;
  monitoringPeriod: number;
  halfOpenMaxCalls: number;
}

interface CircuitState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  consecutiveFailures: number;
  lastFailure: number;
  lastSuccess?: number;
  transitionTime?: number;
  halfOpenCalls: number;
  halfOpenSuccesses: number;
  nextRetryTime?: number;
  lastError?: {
    message: string;
    timestamp: number;
    type: string;
  };
}

interface CircuitBreakerMetrics {
  providerName: string;
  currentState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  consecutiveFailures: number;
  lastFailureTime: number;
  lastSuccessTime?: number;
  timeInCurrentState: number;
  halfOpenCalls: number;
  halfOpenSuccesses: number;
  nextRetryTime?: number;
  lastError?: {
    message: string;
    timestamp: number;
    type: string;
  };
}

interface CircuitBreakerHealthSummary {
  totalProviders: number;
  healthyProviders: number;
  failedProviders: number;
  recoveringProviders: number;
  overallHealth: number; // 0-1
}
/**
 * AuthService - JWT authentication and session management service
 *
 * Handles user authentication, token generation/validation, session management,
 * and security features including rate limiting and CSRF protection.
 * Integrates with NextAuth.js v5 and Redis for session storage.
 */

import { PrismaClient } from '../generated/prisma';
import { sign, verify, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { createClient, RedisClientType } from 'redis';
import * as bcrypt from 'bcryptjs';
import { randomBytes, createHash, timingSafeEqual } from 'crypto';
import { config } from '../lib/config';
import { logger } from '../lib/logger';
import UserService from './UserService';

export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface Session {
  id: string;
  userId: string;
  username: string;
  email: string;
  createdAt: Date;
  lastAccessedAt: Date;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

export interface LoginResult {
  user: any;
  accessToken: string;
  refreshToken: string;
  session: Session;
  csrfToken: string;
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
  session: Session;
}

export interface AuthContext {
  user: any;
  session: Session;
  isAuthenticated: boolean;
}

export interface LoginAttempt {
  identifier: string;
  ipAddress: string;
  timestamp: Date;
  success: boolean;
}

export interface RateLimitInfo {
  attempts: number;
  resetTime: Date;
  blocked: boolean;
}

export class AuthService {
  private prisma: PrismaClient;
  private redis: RedisClientType;
  private userService: UserService;

  // Rate limiting configuration
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOGIN_ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes
  private readonly ACCOUNT_LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

  // Token configuration
  private readonly ACCESS_TOKEN_EXPIRY = '15m';
  private readonly REFRESH_TOKEN_EXPIRY = '7d';
  private readonly SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = createClient({ url: config.redisUrl });
    this.userService = new UserService();

    // Only initialize Redis in non-test environments or if explicitly enabled
    if (process.env.NODE_ENV !== 'test' || process.env.ENABLE_REDIS_IN_TESTS === 'true') {
      this.initializeRedis();
    } else {
      // Mock Redis for tests
      this.mockRedisForTests();
    }
  }

  private async initializeRedis(): Promise<void> {
    try {
      await this.redis.connect();
      logger.info('Redis connected for auth service');
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw new Error('Redis connection failed');
    }
  }

  private mockRedisForTests(): void {
    // Mock Redis client for testing
    const mockRedis = {
      connect: () => Promise.resolve(),
      disconnect: () => Promise.resolve(),
      setEx: () => Promise.resolve('OK'),
      get: () => Promise.resolve(null),
      del: () => Promise.resolve(1),
      incr: () => Promise.resolve(1),
      expire: () => Promise.resolve(true),
      ttl: () => Promise.resolve(-1),
      keys: () => Promise.resolve([])
    };

    // Replace Redis client with mock
    this.redis = mockRedis as any;
    logger.info('Redis mocked for testing');
  }

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================

  /**
   * Authenticate user login with rate limiting and security checks
   */
  async login(
    identifier: string,
    password: string,
    options: {
      ipAddress?: string;
      userAgent?: string;
      rememberMe?: boolean;
    } = {}
  ): Promise<LoginResult> {
    const { ipAddress = 'unknown', userAgent = 'unknown', rememberMe = false } = options;

    try {
      // Check rate limiting
      await this.checkRateLimit(identifier, ipAddress);

      // Authenticate user
      const user = await this.userService.authenticateUser({
        identifier,
        password
      });

      // Record successful login attempt
      await this.recordLoginAttempt(identifier, ipAddress, true);

      // Generate session
      const session = await this.createSession(user, { ipAddress, userAgent, rememberMe });

      // Generate tokens
      const { accessToken, refreshToken } = await this.generateTokens(user, session.id);

      // Generate CSRF token
      const csrfToken = this.generateCSRFToken();
      await this.storeCSRFToken(session.id, csrfToken);

      logger.info(`User logged in successfully: ${user.username}`, {
        userId: user.id,
        sessionId: session.id,
        ipAddress
      });

      return {
        user,
        accessToken,
        refreshToken,
        session,
        csrfToken
      };

    } catch (error) {
      // Record failed login attempt
      await this.recordLoginAttempt(identifier, ipAddress, false);

      if (error instanceof Error) {
        logger.warn(`Login failed for ${identifier}:`, {
          error: error.message,
          ipAddress
        });
        throw error;
      }

      throw new Error('Authentication failed');
    }
  }

  /**
   * Logout user and invalidate session
   */
  async logout(sessionId: string): Promise<void> {
    try {
      // Invalidate session in Redis
      await this.redis.del(`session:${sessionId}`);

      // Invalidate refresh token
      await this.redis.del(`refresh:${sessionId}`);

      // Remove CSRF token
      await this.redis.del(`csrf:${sessionId}`);

      logger.info(`User logged out successfully`, { sessionId });

    } catch (error) {
      logger.error('Error during logout:', error);
      throw new Error('Logout failed');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<RefreshResult> {
    try {
      // Verify refresh token
      const payload = this.verifyJWT(refreshToken) as JWTPayload;

      // Check if refresh token exists in Redis
      const storedToken = await this.redis.get(`refresh:${payload.sessionId}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      // Get session
      const session = await this.getSession(payload.sessionId);
      if (!session || !session.isActive) {
        throw new Error('Session not found or expired');
      }

      // Get user details
      const user = await this.userService.getUserById(payload.userId);

      // Generate new tokens
      const tokens = await this.generateTokens(user, session.id);

      // Update session last accessed time
      await this.updateSessionAccess(session.id);

      logger.info(`Tokens refreshed successfully`, {
        userId: user.id,
        sessionId: session.id
      });

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        session
      };

    } catch (error) {
      logger.error('Error refreshing token:', error);
      throw new Error('Token refresh failed');
    }
  }

  // ============================================================================
  // TOKEN MANAGEMENT
  // ============================================================================

  /**
   * Generate JWT access and refresh tokens
   */
  private async generateTokens(user: any, sessionId: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload: JWTPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      sessionId
    };

    const accessTokenOptions: SignOptions = {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
      issuer: 'ai-x-social',
      audience: 'ai-x-social-app'
    };

    const refreshTokenOptions: SignOptions = {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
      issuer: 'ai-x-social',
      audience: 'ai-x-social-app'
    };

    const accessToken = sign(payload, config.jwtSecret, accessTokenOptions);
    const refreshToken = sign(payload, config.jwtSecret, refreshTokenOptions);

    // Store refresh token in Redis with expiration
    await this.redis.setEx(
      `refresh:${sessionId}`,
      7 * 24 * 60 * 60, // 7 days
      refreshToken
    );

    return { accessToken, refreshToken };
  }

  /**
   * Verify JWT token
   */
  verifyJWT(token: string): JWTPayload | null {
    try {
      const options: VerifyOptions = {
        issuer: 'ai-x-social',
        audience: 'ai-x-social-app'
      };

      const payload = verify(token, config.jwtSecret, options) as JWTPayload;
      return payload;

    } catch (error) {
      logger.debug('JWT verification failed:', error);
      return null;
    }
  }

  /**
   * Validate access token and return auth context
   */
  async validateToken(token: string): Promise<AuthContext | null> {
    try {
      const payload = this.verifyJWT(token);
      if (!payload) {
        return null;
      }

      // Get session
      const session = await this.getSession(payload.sessionId);
      if (!session || !session.isActive) {
        return null;
      }

      // Get user details
      const user = await this.userService.getUserById(payload.userId);

      // Update session last accessed time
      await this.updateSessionAccess(session.id);

      return {
        user,
        session,
        isAuthenticated: true
      };

    } catch (error) {
      logger.debug('Token validation failed:', error);
      return null;
    }
  }

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  /**
   * Create new user session
   */
  private async createSession(
    user: any,
    options: {
      ipAddress?: string;
      userAgent?: string;
      rememberMe?: boolean;
    }
  ): Promise<Session> {
    const sessionId = this.generateSessionId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.SESSION_EXPIRY);

    const session: Session = {
      id: sessionId,
      userId: user.id,
      username: user.username,
      email: user.email,
      createdAt: now,
      lastAccessedAt: now,
      expiresAt,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      isActive: true
    };

    // Store session in Redis
    await this.redis.setEx(
      `session:${sessionId}`,
      Math.floor(this.SESSION_EXPIRY / 1000),
      JSON.stringify(session)
    );

    return session;
  }

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<Session | null> {
    try {
      const sessionData = await this.redis.get(`session:${sessionId}`);
      if (!sessionData) {
        return null;
      }

      const session: Session = JSON.parse(sessionData);

      // Check if session is expired
      if (new Date() > new Date(session.expiresAt)) {
        await this.redis.del(`session:${sessionId}`);
        return null;
      }

      return session;

    } catch (error) {
      logger.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Update session last accessed time
   */
  private async updateSessionAccess(sessionId: string): Promise<void> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) {
        return;
      }

      session.lastAccessedAt = new Date();

      await this.redis.setEx(
        `session:${sessionId}`,
        Math.floor(this.SESSION_EXPIRY / 1000),
        JSON.stringify(session)
      );

    } catch (error) {
      logger.error('Error updating session access:', error);
    }
  }

  /**
   * Get all active sessions for a user
   */
  async getUserSessions(userId: string): Promise<Session[]> {
    try {
      const keys = await this.redis.keys('session:*');
      const sessions: Session[] = [];

      for (const key of keys) {
        const sessionData = await this.redis.get(key);
        if (sessionData) {
          const session: Session = JSON.parse(sessionData);
          if (session.userId === userId && session.isActive) {
            sessions.push(session);
          }
        }
      }

      return sessions.sort((a, b) =>
        new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
      );

    } catch (error) {
      logger.error('Error getting user sessions:', error);
      return [];
    }
  }

  /**
   * Invalidate all sessions for a user
   */
  async invalidateUserSessions(userId: string): Promise<void> {
    try {
      const sessions = await this.getUserSessions(userId);

      for (const session of sessions) {
        await this.redis.del(`session:${session.id}`);
        await this.redis.del(`refresh:${session.id}`);
        await this.redis.del(`csrf:${session.id}`);
      }

      logger.info(`Invalidated all sessions for user ${userId}`);

    } catch (error) {
      logger.error('Error invalidating user sessions:', error);
    }
  }

  // ============================================================================
  // CSRF PROTECTION
  // ============================================================================

  /**
   * Generate CSRF token
   */
  private generateCSRFToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Store CSRF token for session
   */
  private async storeCSRFToken(sessionId: string, csrfToken: string): Promise<void> {
    await this.redis.setEx(
      `csrf:${sessionId}`,
      Math.floor(this.SESSION_EXPIRY / 1000),
      csrfToken
    );
  }

  /**
   * Validate CSRF token
   */
  async validateCSRFToken(sessionId: string, csrfToken: string): Promise<boolean> {
    try {
      const storedToken = await this.redis.get(`csrf:${sessionId}`);
      if (!storedToken || storedToken.length !== csrfToken.length) {
        return false;
      }

      // Use timing-safe comparison
      const storedBuffer = Buffer.from(storedToken, 'hex');
      const providedBuffer = Buffer.from(csrfToken, 'hex');

      return timingSafeEqual(storedBuffer, providedBuffer);

    } catch (error) {
      logger.error('Error validating CSRF token:', error);
      return false;
    }
  }

  // ============================================================================
  // RATE LIMITING
  // ============================================================================

  /**
   * Check rate limiting for login attempts
   */
  private async checkRateLimit(identifier: string, ipAddress: string): Promise<void> {
    const identifierKey = `rate_limit:login:${identifier}`;
    const ipKey = `rate_limit:login:ip:${ipAddress}`;

    const [identifierAttempts, ipAttempts] = await Promise.all([
      this.redis.get(identifierKey),
      this.redis.get(ipKey)
    ]);

    const identifierCount = identifierAttempts ? parseInt(identifierAttempts) : 0;
    const ipCount = ipAttempts ? parseInt(ipAttempts) : 0;

    if (identifierCount >= this.MAX_LOGIN_ATTEMPTS) {
      throw new Error('Too many login attempts for this account. Please try again later.');
    }

    if (ipCount >= this.MAX_LOGIN_ATTEMPTS * 3) { // Higher limit for IP
      throw new Error('Too many login attempts from this IP address. Please try again later.');
    }
  }

  /**
   * Record login attempt for rate limiting
   */
  private async recordLoginAttempt(identifier: string, ipAddress: string, success: boolean): Promise<void> {
    const identifierKey = `rate_limit:login:${identifier}`;
    const ipKey = `rate_limit:login:ip:${ipAddress}`;
    const windowSeconds = Math.floor(this.LOGIN_ATTEMPT_WINDOW / 1000);

    if (success) {
      // Clear rate limiting on successful login
      await Promise.all([
        this.redis.del(identifierKey),
        this.redis.del(ipKey)
      ]);
    } else {
      // Increment failed attempts
      await Promise.all([
        this.redis.incr(identifierKey),
        this.redis.incr(ipKey)
      ]);

      // Set expiration
      await Promise.all([
        this.redis.expire(identifierKey, windowSeconds),
        this.redis.expire(ipKey, windowSeconds)
      ]);
    }

    // Store login attempt record
    const attemptKey = `login_attempt:${Date.now()}:${randomBytes(8).toString('hex')}`;
    const attempt: LoginAttempt = {
      identifier,
      ipAddress,
      timestamp: new Date(),
      success
    };

    await this.redis.setEx(attemptKey, 24 * 60 * 60, JSON.stringify(attempt)); // Keep for 24 hours
  }

  /**
   * Get rate limit info for identifier
   */
  async getRateLimitInfo(identifier: string): Promise<RateLimitInfo> {
    try {
      const key = `rate_limit:login:${identifier}`;
      const attempts = await this.redis.get(key);
      const ttl = await this.redis.ttl(key);

      const attemptCount = attempts ? parseInt(attempts) : 0;
      const resetTime = new Date(Date.now() + (ttl > 0 ? ttl * 1000 : 0));
      const blocked = attemptCount >= this.MAX_LOGIN_ATTEMPTS;

      return {
        attempts: attemptCount,
        resetTime,
        blocked
      };

    } catch (error) {
      logger.error('Error getting rate limit info:', error);
      return {
        attempts: 0,
        resetTime: new Date(),
        blocked: false
      };
    }
  }

  // ============================================================================
  // PASSWORD MANAGEMENT
  // ============================================================================

  /**
   * Change user password with verification
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      // Get user
      const user = await this.prisma.userAccount.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Validate new password
      const passwordValidation = this.validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.error || 'Password does not meet requirements');
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 12);

      // Update password
      await this.prisma.userAccount.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash }
      });

      // Invalidate all sessions except current one to force re-authentication
      await this.invalidateUserSessions(userId);

      logger.info(`Password changed successfully for user ${userId}`);

    } catch (error) {
      logger.error('Error changing password:', error);
      throw error;
    }
  }

  /**
   * Validate password strength
   */
  private validatePassword(password: string): { isValid: boolean; error?: string } {
    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters long' };
    }

    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one lowercase letter' };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one uppercase letter' };
    }

    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one number' };
    }

    return { isValid: true };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Hash string using SHA-256
   */
  private hashString(input: string): string {
    return createHash('sha256').update(input).digest('hex');
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================

  /**
   * Close connections
   */
  async disconnect(): Promise<void> {
    await Promise.all([
      this.prisma.$disconnect(),
      this.redis.disconnect(),
      this.userService.disconnect()
    ]);
  }
}

export default AuthService;
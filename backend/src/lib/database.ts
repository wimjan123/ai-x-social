import { PrismaClient } from '../generated/prisma';
import { logger } from './logger';

interface DatabaseConfig {
  connectionLimit: number;
  connectionTimeoutMs: number;
  queryTimeoutMs: number;
  statementTimeoutMs: number;
  maxWait: number;
  retryAttempts: number;
  retryDelay: number;
}

class Database {
  private static instance: Database;
  private prisma: PrismaClient;
  private config: DatabaseConfig;

  private constructor() {
    this.config = {
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
      connectionTimeoutMs: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000'),
      queryTimeoutMs: parseInt(process.env.DB_QUERY_TIMEOUT || '20000'),
      statementTimeoutMs: parseInt(process.env.DB_STATEMENT_TIMEOUT || '30000'),
      maxWait: parseInt(process.env.DB_MAX_WAIT || '20000'),
      retryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS || '3'),
      retryDelay: parseInt(process.env.DB_RETRY_DELAY || '1000'),
    };

    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: this.buildConnectionString(),
        },
      },
      log: [
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'info' },
      ],
      errorFormat: 'pretty',
    });

    this.setupEventListeners();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public get client(): PrismaClient {
    return this.prisma;
  }

  private buildConnectionString(): string {
    const baseUrl = process.env.DATABASE_URL;
    if (!baseUrl) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    const url = new URL(baseUrl);

    // Add connection pooling parameters
    url.searchParams.set('connection_limit', this.config.connectionLimit.toString());
    url.searchParams.set('pool_timeout', Math.floor(this.config.connectionTimeoutMs / 1000).toString());
    url.searchParams.set('statement_timeout', `${this.config.statementTimeoutMs}ms`);
    url.searchParams.set('lock_timeout', '10000ms');
    url.searchParams.set('idle_in_transaction_session_timeout', '30000ms');

    // Performance optimizations for PostgreSQL 16
    url.searchParams.set('prepared_statement_cache_queries', '100');
    url.searchParams.set('application_name', 'ai_x_social');

    return url.toString();
  }

  private setupEventListeners(): void {
    this.prisma.$on('error', (e) => {
      logger.error('Database error:', {
        message: e.message,
        target: e.target,
        timestamp: e.timestamp,
      });
    });

    this.prisma.$on('warn', (e) => {
      logger.warn('Database warning:', {
        message: e.message,
        target: e.target,
        timestamp: e.timestamp,
      });
    });

    this.prisma.$on('info', (e) => {
      logger.info('Database info:', {
        message: e.message,
        target: e.target,
        timestamp: e.timestamp,
      });
    });

    // Graceful shutdown handling
    process.on('beforeExit', async () => {
      await this.disconnect();
    });

    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  public async connect(): Promise<void> {
    let attempts = 0;

    while (attempts < this.config.retryAttempts) {
      try {
        logger.info(`Attempting database connection (attempt ${attempts + 1}/${this.config.retryAttempts})`);

        await this.prisma.$connect();

        // Test connection with a simple query
        await this.prisma.$queryRaw`SELECT 1 as test`;

        logger.info('Database connected successfully', {
          connectionLimit: this.config.connectionLimit,
          nodeEnv: process.env.NODE_ENV,
        });

        return;
      } catch (error) {
        attempts++;
        logger.error(`Database connection attempt ${attempts} failed:`, error);

        if (attempts >= this.config.retryAttempts) {
          throw new Error(`Failed to connect to database after ${this.config.retryAttempts} attempts`);
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempts));
      }
    }
  }

  public async disconnect(): Promise<void> {
    try {
      logger.info('Disconnecting from database...');
      await this.prisma.$disconnect();
      logger.info('Database disconnected successfully');
    } catch (error) {
      logger.error('Error disconnecting from database:', error);
    }
  }

  public async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    latency: number;
    version: string;
    connections: number;
  }> {
    const startTime = Date.now();

    try {
      // Test basic connectivity
      const result = await this.prisma.$queryRaw`
        SELECT
          version() as version,
          (SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()) as connections
      ` as Array<{ version: string; connections: bigint }>;

      const latency = Date.now() - startTime;

      return {
        status: 'healthy',
        latency,
        version: result[0].version,
        connections: Number(result[0].connections),
      };
    } catch (error) {
      logger.error('Database health check failed:', error);
      return {
        status: 'unhealthy',
        latency: Date.now() - startTime,
        version: 'unknown',
        connections: 0,
      };
    }
  }

  public async executeTransaction<T>(
    fn: (tx: PrismaClient) => Promise<T>,
    options?: {
      timeout?: number;
      isolationLevel?: 'ReadUncommitted' | 'ReadCommitted' | 'RepeatableRead' | 'Serializable';
    }
  ): Promise<T> {
    const timeout = options?.timeout || this.config.queryTimeoutMs;

    return Promise.race([
      this.prisma.$transaction(fn, {
        timeout,
        isolationLevel: options?.isolationLevel,
      }),
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Transaction timeout after ${timeout}ms`));
        }, timeout);
      }),
    ]);
  }

  public async getConnectionStats(): Promise<{
    activeConnections: number;
    idleConnections: number;
    maxConnections: number;
    totalConnections: number;
  }> {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT
          count(*) FILTER (WHERE state = 'active') as active_connections,
          count(*) FILTER (WHERE state = 'idle') as idle_connections,
          (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_connections,
          count(*) as total_connections
        FROM pg_stat_activity
        WHERE datname = current_database()
      ` as Array<{
        active_connections: bigint;
        idle_connections: bigint;
        max_connections: number;
        total_connections: bigint;
      }>;

      return {
        activeConnections: Number(result[0].active_connections),
        idleConnections: Number(result[0].idle_connections),
        maxConnections: result[0].max_connections,
        totalConnections: Number(result[0].total_connections),
      };
    } catch (error) {
      logger.error('Failed to get connection stats:', error);
      throw error;
    }
  }

  public async clearAllData(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clear data in production environment');
    }

    logger.warn('Clearing all database data...');

    try {
      await this.executeTransaction(async (tx) => {
        // Delete in dependency order to avoid foreign key violations
        await tx.reaction.deleteMany();
        await tx.post.deleteMany();
        await tx.thread.deleteMany();
        await tx.persona.deleteMany();
        await tx.trend.deleteMany();
        await tx.newsItem.deleteMany();
        await tx.settings.deleteMany();
        await tx.influenceMetrics.deleteMany();
        await tx.politicalAlignment.deleteMany();
        await tx.userProfile.deleteMany();
        await tx.userAccount.deleteMany();
      });

      logger.info('All database data cleared successfully');
    } catch (error) {
      logger.error('Failed to clear database data:', error);
      throw error;
    }
  }
}

// Export the singleton instance
export const database = Database.getInstance();
export const prisma = database.client;

// Export types for use in other modules
export type { DatabaseConfig };
export { Database };
#!/usr/bin/env node

import { database } from '../lib/database';
import { logger } from '../lib/logger';

async function initializeDatabase() {
  try {
    logger.info('Starting database initialization...');

    // Connect to the database
    await database.connect();

    // Run health check
    const health = await database.healthCheck();
    logger.info('Database health check:', health);

    if (health.status === 'unhealthy') {
      throw new Error('Database health check failed');
    }

    // Get connection stats
    const stats = await database.getConnectionStats();
    logger.info('Database connection stats:', stats);

    // Validate that we can perform basic operations
    const testResult = await database.client.$queryRaw`
      SELECT
        current_database() as database_name,
        current_user as user_name,
        version() as version,
        now() as current_time
    ` as Array<{
      database_name: string;
      user_name: string;
      version: string;
      current_time: Date;
    }>;

    logger.info('Database test query successful:', {
      database: testResult[0].database_name,
      user: testResult[0].user_name,
      version: testResult[0].version.split(' ').slice(0, 2).join(' '),
      timestamp: testResult[0].current_time,
    });

    // Test Prisma models by checking schema
    const tableCount = await database.client.$queryRaw`
      SELECT COUNT(*) as table_count
      FROM information_schema.tables
      WHERE table_schema = 'public'
    ` as Array<{ table_count: bigint }>;

    logger.info(`Database schema validation: ${tableCount[0].table_count} tables found`);

    if (Number(tableCount[0].table_count) === 0) {
      logger.warn('No tables found in database. Run "npx prisma db push" to create schema.');
    }

    logger.info('Database initialization completed successfully');

  } catch (error) {
    logger.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    await database.disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase().catch((error) => {
    logger.error('Unhandled error during database initialization:', error);
    process.exit(1);
  });
}

export { initializeDatabase };
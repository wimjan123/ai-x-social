import { z } from 'zod';

const configSchema = z.object({
  // Server
  port: z.coerce.number().default(3001),
  nodeEnv: z.enum(['development', 'test', 'production']).default('development'),
  corsOrigin: z.string().default('http://localhost:3000'),

  // Database
  databaseUrl: z.string(),

  // Redis
  redisUrl: z.string().default('redis://localhost:6379'),

  // JWT
  jwtSecret: z.string(),
  jwtExpiresIn: z.string().default('7d'),

  // Rate Limiting
  rateLimitWindowMs: z.coerce.number().default(15 * 60 * 1000), // 15 minutes
  rateLimitMax: z.coerce.number().default(100),

  // File Upload
  maxFileSize: z.coerce.number().default(5 * 1024 * 1024), // 5MB
  uploadPath: z.string().default('uploads/'),

  // Logging
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // AI API Keys
  openaiApiKey: z.string().optional(),
  anthropicApiKey: z.string().optional(),
  googleApiKey: z.string().optional(),

  // News API Keys
  newsApiKey: z.string().optional(),
  guardianApiKey: z.string().optional(),
  gnewsApiKey: z.string().optional(),
});

export type Config = z.infer<typeof configSchema>;

const rawConfig = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  corsOrigin: process.env.CORS_ORIGIN,
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS,
  rateLimitMax: process.env.RATE_LIMIT_MAX,
  maxFileSize: process.env.MAX_FILE_SIZE,
  uploadPath: process.env.UPLOAD_PATH,
  logLevel: process.env.LOG_LEVEL,
  openaiApiKey: process.env.OPENAI_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  googleApiKey: process.env.GOOGLE_API_KEY,
  newsApiKey: process.env.NEWS_API_KEY,
  guardianApiKey: process.env.GUARDIAN_API_KEY,
  gnewsApiKey: process.env.GNEWS_API_KEY,
};

export const config = configSchema.parse(rawConfig);
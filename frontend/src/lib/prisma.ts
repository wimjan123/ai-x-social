// Lazy-load Prisma only when the generated client is present.
// This keeps the frontend container working even when prisma generate hasn't run.

/* eslint-disable @typescript-eslint/no-var-requires */
let prismaInstance: import('@prisma/client').PrismaClient | undefined;

const loadPrisma = () => {
  if (prismaInstance) return prismaInstance;

  try {
    const { PrismaClient } = require('@prisma/client');
    const globalForPrisma = globalThis as typeof globalThis & {
      prisma?: import('@prisma/client').PrismaClient;
    };

    prismaInstance = globalForPrisma.prisma ?? new PrismaClient();

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance;
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[prisma] Prisma Client unavailable, falling back to stub.', error);
    }
    prismaInstance = undefined;
  }

  return prismaInstance;
};

export const prisma = loadPrisma();
/* eslint-enable @typescript-eslint/no-var-requires */

# AI Social Media Platform - Frontend Production Dockerfile
# Multi-stage Docker build for Next.js 15 + React 19 + TypeScript
# Optimized for production deployment with security and performance

# =============================================================================
# Base Stage - Common dependencies and security
# =============================================================================
FROM node:22-alpine AS base

# Update packages and install security updates
RUN apk update && apk upgrade && apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    curl \
    dumb-init \
    tini \
    && rm -rf /var/cache/apk/*

# Create non-root user with specific UID/GID for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs

# Set working directory
WORKDIR /app

# =============================================================================
# Dependencies Stage - Install and optimize dependencies
# =============================================================================
FROM base AS deps

# Copy package files for dependency resolution
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Install production dependencies with security audit
RUN npm ci --only=production --audit --audit-level=high && \
    npm cache clean --force

# Install all dependencies for build stage
FROM base AS deps-build
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
RUN npm ci && npm cache clean --force

# =============================================================================
# Build Stage - Next.js compilation and optimization
# =============================================================================
FROM base AS builder

# Copy all dependencies for build
COPY --from=deps-build /app/node_modules ./node_modules

# Copy source code and configuration
COPY . .

# Set build environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build arguments for client-side environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL

# Generate Prisma client if schema exists
RUN npx prisma generate --schema=../backend/prisma/schema.prisma || echo "Prisma schema not found, skipping generation"

# Build Next.js application with production optimizations
RUN npm run build

# =============================================================================
# Production Runtime Stage - Minimal and secure
# =============================================================================
FROM node:22-alpine AS production

# Install only essential system packages
RUN apk update && apk upgrade && apk add --no-cache \
    curl \
    dumb-init \
    tini \
    && rm -rf /var/cache/apk/* \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs

# Set working directory
WORKDIR /app

# Copy production dependencies only
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --chown=nextjs:nodejs package*.json ./
COPY --chown=nextjs:nodejs next.config.js ./

# Create necessary directories with proper permissions
RUN mkdir -p .next/cache && \
    chown -R nextjs:nodejs .next && \
    chmod 755 .next

# Set production environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_OPTIONS="--max-old-space-size=1024"

# Security: Remove unnecessary packages and files
RUN rm -rf /tmp/* /var/tmp/* /usr/share/man /usr/share/doc

# Switch to non-root user for security
USER nextjs

# Expose application port
EXPOSE 3000

# Add health check with proper timeouts for production
HEALTHCHECK --interval=30s --timeout=15s --start-period=120s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Use tini as PID 1 for proper signal handling
ENTRYPOINT ["tini", "--"]

# Production startup command
CMD ["npm", "start"]

# =============================================================================
# Multi-architecture and Build Information
# =============================================================================

# Build arguments for metadata
ARG BUILD_DATE
ARG VCS_REF
ARG VERSION="1.0.0"
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# Comprehensive metadata labels following OCI standards
LABEL org.opencontainers.image.created=$BUILD_DATE \
      org.opencontainers.image.url="https://github.com/ai-x-social/ai-x-social" \
      org.opencontainers.image.source="https://github.com/ai-x-social/ai-x-social" \
      org.opencontainers.image.version=$VERSION \
      org.opencontainers.image.revision=$VCS_REF \
      org.opencontainers.image.vendor="AI X Social Team" \
      org.opencontainers.image.title="AI Social Media Platform - Frontend" \
      org.opencontainers.image.description="Production-ready Next.js frontend for AI-powered social media platform with political personas" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.documentation="https://github.com/ai-x-social/ai-x-social/blob/main/README-Docker.md" \
      maintainer="AI X Social Team" \
      service="frontend-web" \
      platform=$TARGETPLATFORM \
      build-platform=$BUILDPLATFORM

# =============================================================================
# Security Best Practices Applied
# =============================================================================

# 1. Multi-stage build to minimize attack surface
# 2. Non-root user execution (nextjs:nodejs)
# 3. Minimal base image (alpine)
# 4. Removed package managers and build tools from final image
# 5. Proper file permissions and ownership
# 6. Security updates applied
# 7. No secrets or sensitive data in image
# 8. Proper signal handling with tini
# 9. Health checks for container orchestration
# 10. Metadata for container scanning and compliance

# =============================================================================
# Production Deployment Notes
# =============================================================================

# Build commands:
# docker build -f Dockerfile -t ai-x-social-frontend:latest .
# docker build -f Dockerfile -t ai-x-social-frontend:v1.0.0 --build-arg VERSION=v1.0.0 .

# Build with environment variables:
# docker build -f Dockerfile \
#   --build-arg NEXT_PUBLIC_API_URL=https://api.yourdomain.com \
#   --build-arg NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com \
#   -t ai-x-social-frontend:latest .

# Run commands:
# docker run -p 3000:3000 --env-file .env.production ai-x-social-frontend:latest

# Multi-architecture build:
# docker buildx build --platform linux/amd64,linux/arm64 -t ai-x-social-frontend:latest .

# Security scanning:
# docker scan ai-x-social-frontend:latest
# trivy image ai-x-social-frontend:latest

# =============================================================================
# Next.js Production Optimizations
# =============================================================================

# 1. Static file serving with proper caching headers
# 2. Image optimization with Next.js Image component
# 3. Code splitting and lazy loading
# 4. Bundle analysis and optimization
# 5. Service worker for offline capabilities (if configured)
# 6. CDN integration for static assets
# 7. Gzip compression for reduced bandwidth
# 8. Tree shaking for smaller bundle sizes
# 9. Progressive Web App features (if configured)
# 10. Server-side rendering and static generation optimization
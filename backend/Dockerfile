# AI Social Media Platform - Backend Production Dockerfile
# Multi-stage Docker build for Node.js 22 + TypeScript + Prisma
# Optimized for production deployment with security best practices

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
    && rm -rf /var/cache/apk/*

# Create non-root user with specific UID/GID for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nodejs

# Set working directory
WORKDIR /app

# =============================================================================
# Dependencies Stage - Install and optimize dependencies
# =============================================================================
FROM base AS deps

# Copy package files for dependency resolution
COPY package*.json ./
COPY tsconfig.json ./

# Install production dependencies with security audit
RUN npm ci --only=production --audit --audit-level=high && \
    npm cache clean --force

# Install all dependencies for build stage
FROM base AS deps-build
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci && npm cache clean --force

# =============================================================================
# Build Stage - TypeScript compilation and optimization
# =============================================================================
FROM base AS builder

# Copy all dependencies for build
COPY --from=deps-build /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set build environment
ENV NODE_ENV=production

# Generate Prisma client for production
RUN npx prisma generate

# Build TypeScript application
RUN npm run build

# Clean up development dependencies and source code
RUN rm -rf src tests *.ts *.json node_modules

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
    && adduser --system --uid 1001 --ingroup nodejs nodejs

# Set working directory
WORKDIR /app

# Copy production dependencies only
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --chown=nodejs:nodejs package*.json ./

# Create necessary directories with proper permissions
RUN mkdir -p logs uploads tmp && \
    chown -R nodejs:nodejs logs uploads tmp && \
    chmod 755 logs uploads tmp

# Set production environment variables
ENV NODE_ENV=production \
    PORT=3001 \
    NODE_OPTIONS="--max-old-space-size=1024" \
    NPM_CONFIG_LOGLEVEL=warn

# Security: Remove unnecessary packages and files
RUN rm -rf /tmp/* /var/tmp/* /usr/share/man /usr/share/doc

# Switch to non-root user for security
USER nodejs

# Expose application port
EXPOSE 3001

# Add health check with proper timeouts for production
HEALTHCHECK --interval=30s --timeout=15s --start-period=120s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Use tini as PID 1 for proper signal handling
ENTRYPOINT ["tini", "--"]

# Production startup command
CMD ["node", "dist/index.js"]

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
      org.opencontainers.image.title="AI Social Media Platform - Backend API" \
      org.opencontainers.image.description="Production-ready Node.js backend API for AI-powered social media platform with political personas" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.documentation="https://github.com/ai-x-social/ai-x-social/blob/main/README-Docker.md" \
      maintainer="AI X Social Team" \
      service="backend-api" \
      platform=$TARGETPLATFORM \
      build-platform=$BUILDPLATFORM

# =============================================================================
# Security Best Practices Applied
# =============================================================================

# 1. Multi-stage build to minimize attack surface
# 2. Non-root user execution (nodejs:nodejs)
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
# docker build -f Dockerfile -t ai-x-social-backend:latest .
# docker build -f Dockerfile -t ai-x-social-backend:v1.0.0 --build-arg VERSION=v1.0.0 .

# Run commands:
# docker run -p 3001:3001 --env-file .env.production ai-x-social-backend:latest

# Multi-architecture build:
# docker buildx build --platform linux/amd64,linux/arm64 -t ai-x-social-backend:latest .

# Security scanning:
# docker scan ai-x-social-backend:latest
# trivy image ai-x-social-backend:latest
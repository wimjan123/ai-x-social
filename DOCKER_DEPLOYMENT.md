# Docker Production Deployment Guide

Complete guide for deploying the AI Social Media Platform using Docker with production-ready configurations, security best practices, and zero-downtime deployment strategies.

## 📋 Overview

This deployment setup provides:

- **Multi-stage builds** for optimal image size and security
- **Security hardening** with non-root users and minimal attack surface
- **Performance optimization** with layer caching and compression
- **Zero-downtime deployments** with health checks and rollback capabilities
- **Monitoring and observability** with Prometheus and Grafana
- **Multi-architecture support** for AMD64 and ARM64 platforms

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │────│   Nginx Proxy   │────│   Application   │
│   (Optional)    │    │   (Security +    │    │   (Frontend +   │
│                 │    │   Compression)   │    │   Backend)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                        ┌───────┴───────┐
                        │               │
                  ┌─────────────┐ ┌─────────────┐
                  │ PostgreSQL  │ │   Redis     │
                  │ Database    │ │   Cache     │
                  └─────────────┘ └─────────────┘
```

## 🐳 Docker Images

### Available Images and Targets

1. **Backend Image** (`Dockerfile.backend`)
   - `production` - Full production image with all features
   - `minimal` - Ultra-minimal image for smallest footprint
   - `development` - Development image with hot reload

2. **Frontend Image** (`Dockerfile.frontend`)
   - `production` - Full Next.js production image
   - `minimal` - Minimal production image
   - `static` - Static export for CDN deployment
   - `development` - Development image with hot reload

3. **Full-Stack Image** (`Dockerfile.full`)
   - `production` - Combined frontend + backend in single container

### Image Size Comparison

| Image Type | Size | Use Case |
|------------|------|----------|
| Backend Production | ~200MB | Full-featured production |
| Backend Minimal | ~150MB | Resource-constrained environments |
| Frontend Production | ~180MB | Full Next.js with SSR |
| Frontend Minimal | ~120MB | Optimized production deployment |
| Frontend Static | ~50MB | CDN/static hosting |
| Full-Stack | ~350MB | Single-container deployment |

## 🚀 Quick Start

### Prerequisites

- Docker 20.10+ with BuildKit enabled
- Docker Compose 2.0+
- 4GB+ available RAM
- 10GB+ available disk space

### Environment Setup

1. **Create environment file**:
```bash
cp .env.example .env.production
```

2. **Configure required variables**:
```bash
# Database
POSTGRES_PASSWORD=your-secure-password-here
POSTGRES_USER=aisocial
POSTGRES_DB=aisocial

# Security
JWT_SECRET=your-jwt-secret-32-chars-minimum
NEXTAUTH_SECRET=your-nextauth-secret-32-chars-minimum

# AI Providers (optional)
ANTHROPIC_API_KEY=your-anthropic-key
OPENAI_API_KEY=your-openai-key
GOOGLE_AI_API_KEY=your-google-ai-key

# News APIs (optional)
NEWS_API_KEY=your-news-api-key
GUARDIAN_API_KEY=your-guardian-api-key
```

### Quick Deployment

```bash
# Navigate to production directory
cd docker/production

# Build images
./build.sh

# Deploy application
./deploy.sh deploy

# Check status
./deploy.sh status
```

## 🔧 Build Process

### Building Production Images

```bash
# Build all production images
./docker/production/build.sh

# Build specific variants
./docker/production/build.sh minimal        # Minimal images
./docker/production/build.sh fullstack      # Full-stack image
./docker/production/build.sh multi-arch     # Multi-architecture
./docker/production/build.sh all           # All variants
```

### Build Script Options

| Command | Description |
|---------|-------------|
| `build` | Build standard production images |
| `test` | Build and run image tests |
| `minimal` | Build minimal production images |
| `fullstack` | Build combined full-stack image |
| `multi-arch` | Build for multiple architectures |
| `all` | Build all variants with multi-arch |
| `clean` | Clean up Docker resources |

### Build Environment Variables

```bash
# Custom build configuration
export VERSION="1.0.0"                    # Custom version tag
export DOCKER_REGISTRY="your-registry"    # Custom registry
export MULTI_ARCH=true                    # Enable multi-arch builds
export BUILD_MINIMAL=true                 # Build minimal images
export BUILD_FULLSTACK=true               # Build full-stack image
export SKIP_TESTS=false                   # Skip image testing
```

## 🚢 Deployment

### Production Deployment

```bash
# Standard deployment
./docker/production/deploy.sh deploy

# Check deployment status
./docker/production/deploy.sh status

# View logs
./docker/production/deploy.sh logs
./docker/production/deploy.sh logs backend    # Specific service
./docker/production/deploy.sh logs frontend
```

### Deployment Features

- **Zero-downtime deployment** with rolling updates
- **Automatic health checks** for all services
- **Database migration** handling
- **Automatic backup** before deployment
- **Rollback capability** to previous version

### Rollback Process

```bash
# Rollback to previous version
./docker/production/deploy.sh rollback

# Check rollback status
./docker/production/deploy.sh status
```

## 🔒 Security Features

### Container Security

- **Non-root users** in all containers
- **Minimal base images** (Alpine Linux)
- **Security scanning** with Trivy (optional)
- **Read-only root filesystems** where possible
- **Capability dropping** and security contexts

### Network Security

- **Internal networks** for service communication
- **Nginx reverse proxy** with security headers
- **Rate limiting** on API endpoints
- **CORS configuration** for frontend
- **SSL/TLS termination** support

### Application Security

- **Environment variable** protection
- **Secret management** best practices
- **JWT token** security
- **CSRF protection** in Next.js
- **Content Security Policy** headers

## 📊 Monitoring

### Health Checks

All services include comprehensive health checks:

```bash
# Manual health check
curl http://localhost/health

# Backend API health
curl http://localhost/api/health

# Service-specific checks
docker-compose exec backend curl localhost:3001/health
docker-compose exec frontend curl localhost:3000/api/health
```

### Prometheus Monitoring

Enable monitoring stack:

```bash
# Deploy with monitoring
docker-compose --profile monitoring up -d

# Access Prometheus
open http://localhost:9090

# Access Grafana
open http://localhost:3000  # Default: admin/admin
```

### Available Metrics

- **Application metrics**: Request rates, response times, error rates
- **System metrics**: CPU, memory, disk usage
- **Database metrics**: Connection pools, query performance
- **Cache metrics**: Redis hit rates, memory usage
- **Infrastructure metrics**: Container health, network traffic

## 🔧 Configuration

### Docker Compose Profiles

```bash
# Production deployment (default)
docker-compose up -d

# With monitoring stack
docker-compose --profile monitoring up -d

# Development mode
docker-compose -f docker-compose.dev.yml up -d
```

### Service Configuration

#### PostgreSQL
- **Version**: PostgreSQL 16 Alpine
- **Memory**: 512MB limit, 256MB reservation
- **Storage**: Persistent volume with backup support
- **Security**: Non-root user, custom configuration

#### Redis
- **Version**: Redis 7 Alpine
- **Memory**: 256MB limit with LRU eviction
- **Persistence**: AOF enabled with optimized settings
- **Security**: No external access, internal network only

#### Nginx
- **Features**: Reverse proxy, SSL termination, compression
- **Security**: Security headers, rate limiting, CORS
- **Performance**: HTTP/2, gzip/brotli compression
- **Monitoring**: Status endpoint, access logs

## 🎯 Performance Optimization

### Build Optimization

- **Multi-stage builds** minimize final image size
- **Layer caching** optimizes build times
- **Dependency optimization** removes unnecessary files
- **Static asset compression** with gzip/brotli

### Runtime Optimization

- **Resource limits** prevent resource exhaustion
- **Connection pooling** for database and cache
- **HTTP/2 and compression** for faster transfers
- **CDN-ready static assets** with proper caching headers

### Database Optimization

- **Connection pooling** with Prisma
- **Query optimization** with proper indexes
- **Backup and restore** procedures
- **Performance monitoring** with metrics

## 🛠️ Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear Docker cache
docker builder prune -f

# Rebuild without cache
./docker/production/build.sh clean
./docker/production/build.sh
```

#### Service Health Check Failures
```bash
# Check service logs
./docker/production/deploy.sh logs backend
./docker/production/deploy.sh logs frontend

# Manual health check
docker-compose exec backend curl localhost:3001/health
```

#### Database Connection Issues
```bash
# Check database status
docker-compose exec postgres pg_isready

# View database logs
./docker/production/deploy.sh logs postgres

# Test connection
docker-compose exec backend npx prisma migrate status
```

#### Memory Issues
```bash
# Check resource usage
docker stats

# Adjust memory limits in docker-compose.prod.yml
# Restart services
./docker/production/deploy.sh deploy
```

### Debug Mode

```bash
# Enable debug logging
export NODE_ENV=development
export DEBUG=*

# Run with debug output
./docker/production/deploy.sh deploy
```

### Log Collection

```bash
# Collect all logs
mkdir -p ./logs
docker-compose logs > ./logs/all-services.log

# Service-specific logs
docker-compose logs backend > ./logs/backend.log
docker-compose logs frontend > ./logs/frontend.log
docker-compose logs postgres > ./logs/postgres.log
```

## 📋 Maintenance

### Regular Maintenance Tasks

```bash
# Update images (weekly)
./docker/production/build.sh
./docker/production/deploy.sh deploy

# Clean up resources (weekly)
./docker/production/deploy.sh cleanup

# Database backup (daily)
./scripts/backup-database.sh

# Security updates (monthly)
docker-compose pull
./docker/production/deploy.sh deploy
```

### Backup Procedures

```bash
# Automatic backup before deployment
# (included in deploy.sh)

# Manual backup
mkdir -p ./backups
docker-compose exec postgres pg_dump -U aisocial aisocial > ./backups/manual-$(date +%Y%m%d).sql

# Restore from backup
docker-compose exec -T postgres psql -U aisocial -d aisocial < ./backups/backup.sql
```

### Scaling

#### Horizontal Scaling
```bash
# Scale specific services
docker-compose up -d --scale backend=3 --scale frontend=2

# Load balancer configuration required for multiple instances
```

#### Vertical Scaling
```bash
# Adjust resource limits in docker-compose.prod.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '2.0'
```

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production](https://www.prisma.io/docs/guides/deployment)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [PostgreSQL Performance](https://www.postgresql.org/docs/current/performance-tips.html)

## 🆘 Support

For deployment issues and questions:

1. Check the [troubleshooting section](#🛠️-troubleshooting)
2. Review service logs: `./docker/production/deploy.sh logs`
3. Verify configuration: `./docker/production/deploy.sh status`
4. Check resource usage: `docker stats`
5. Create an issue with deployment logs and configuration details
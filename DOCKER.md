# Docker Configuration for AI Social Media Platform

This document describes the Docker setup for the AI social media platform with political personas simulation.

## Overview

The Docker configuration includes:
- **Multi-stage builds** for optimized image sizes (60% reduction)
- **Development and production** environments
- **Node.js 22** base images with Alpine Linux
- **Health checks** for all services
- **Security hardening** with non-root users
- **Volume mounts** for development hot-reload

## Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   Next.js 15.4  │    │   Node.js 22    │
│   Port: 3000    │────│   Port: 3001    │
└─────────────────┘    └─────────────────┘
         │                        │
         └──────────┬─────────────┘
                    │
    ┌─────────────────┐    ┌─────────────────┐
    │   PostgreSQL    │    │     Redis       │
    │   Port: 5432    │    │   Port: 6379    │
    └─────────────────┘    └─────────────────┘
```

## Quick Start

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- 4GB+ available RAM

### Development Setup

1. **Clone and configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

2. **Start development environment:**
   ```bash
   ./scripts/docker-dev.sh start
   ```

3. **Setup database:**
   ```bash
   ./scripts/docker-dev.sh setup-db
   ```

4. **Access applications:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Health: http://localhost:3001/health

### Alternative Commands

```bash
# Traditional docker-compose
docker-compose up -d

# With development tools (pgadmin, redis-commander)
docker-compose --profile tools up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## File Structure

```
├── docker-compose.yml          # Main development configuration
├── docker-compose.prod.yml     # Production overrides
├── Dockerfile.backend          # Backend multi-stage build
├── Dockerfile.frontend         # Frontend multi-stage build
├── .dockerignore              # Build context optimization
├── .env.example               # Environment variables template
└── scripts/
    └── docker-dev.sh          # Development convenience script
```

## Multi-Stage Build Targets

### Backend (Dockerfile.backend)

- **development**: Full dev dependencies, hot reload
- **production**: Optimized for runtime, security hardened
- **minimal**: Smallest possible image for production

```bash
# Development build
docker build --target development -f Dockerfile.backend .

# Production build
docker build --target production -f Dockerfile.backend .

# Minimal build (smallest size)
docker build --target minimal -f Dockerfile.backend .
```

### Frontend (Dockerfile.frontend)

- **development**: Next.js dev server with hot reload
- **production**: Optimized Next.js standalone output
- **minimal**: Smallest production build
- **static**: Static export for CDN deployment

```bash
# Development build
docker build --target development -f Dockerfile.frontend .

# Production build
docker build --target production -f Dockerfile.frontend .

# Static build for CDN
docker build --target static -f Dockerfile.frontend .
```

## Environment Variables

### Required Variables
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/ai_social
REDIS_URL=redis://redis:6379

# Authentication
JWT_SECRET=your_jwt_secret_minimum_32_characters
NEXTAUTH_SECRET=your_nextauth_secret_minimum_32_characters

# AI Services (at least one required)
AI_CLAUDE_API_KEY=your_claude_api_key
AI_OPENAI_API_KEY=your_openai_api_key
AI_GEMINI_API_KEY=your_gemini_api_key

# News APIs (optional but recommended)
NEWS_API_KEY=your_newsapi_key
GUARDIAN_API_KEY=your_guardian_api_key
GNEWS_API_KEY=your_gnews_api_key
```

### Optional Variables
```env
# Application Configuration
NODE_ENV=development
PORT=3001
LOG_LEVEL=info

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## Production Deployment

### Single-Server Deployment

1. **Set production environment:**
   ```bash
   cp .env.example .env.production
   # Edit with production values
   ```

2. **Deploy with production configuration:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

3. **Or use the convenience script:**
   ```bash
   ./scripts/docker-dev.sh deploy-prod
   ```

### Image Size Optimization

The multi-stage builds achieve significant size reductions:

| Stage | Backend Size | Frontend Size |
|-------|-------------|---------------|
| Development | ~800MB | ~1.2GB |
| Production | ~300MB | ~400MB |
| Minimal | ~150MB | ~200MB |

**Total reduction: ~60% from development to minimal builds**

## Development Tools

### Database Administration
- **PgAdmin**: http://localhost:5050
- **Credentials**: admin@ai-social.dev / admin

### Redis Management
- **Redis Commander**: http://localhost:8081

### Enable Tools
```bash
# Start with tools
docker-compose --profile tools up -d

# Or use script
./scripts/docker-dev.sh start-tools
```

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check what's using the ports
   lsof -i :3000 -i :3001 -i :5432 -i :6379

   # Stop conflicting services or change ports in docker-compose.yml
   ```

2. **Memory issues:**
   ```bash
   # Check Docker memory usage
   docker stats

   # Increase Docker Desktop memory allocation to 4GB+
   ```

3. **Database connection errors:**
   ```bash
   # Check database health
   docker-compose exec postgres pg_isready -U postgres -d ai_social

   # Reset database if needed
   ./scripts/docker-dev.sh reset-db
   ```

4. **Build cache issues:**
   ```bash
   # Clear build cache
   docker builder prune -f

   # Rebuild without cache
   docker-compose build --no-cache
   ```

### Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# View health check logs
docker inspect ai_social_backend | grep Health -A 10
```

### Performance Monitoring

```bash
# Monitor resource usage
docker stats

# View service logs
docker-compose logs -f backend frontend

# Check database performance
docker-compose exec postgres pg_stat_activity
```

## Security Considerations

1. **Non-root users**: All containers run as non-root users (nodejs:1001, nextjs:1001)
2. **Minimal base images**: Alpine Linux for smaller attack surface
3. **Production secrets**: Use Docker secrets or external secret management
4. **Network isolation**: Services communicate via internal Docker network
5. **Port binding**: Production config binds to localhost only

### Production Security Checklist

- [ ] Change default passwords in .env
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Configure proper firewall rules
- [ ] Enable Docker content trust
- [ ] Regular security updates for base images
- [ ] Monitor container logs for security events

## Maintenance

### Regular Tasks

```bash
# Update base images
docker pull node:22-alpine
docker pull postgres:16-alpine
docker pull redis:7-alpine

# Rebuild with latest base images
docker-compose build --pull

# Clean up unused resources
docker system prune -f

# Backup volumes
docker run --rm -v ai_social_postgres_data:/data alpine tar czf - /data > backup.tar.gz
```

### Log Management

```bash
# Configure log rotation
echo '{"log-driver":"json-file","log-opts":{"max-size":"10m","max-file":"3"}}' > /etc/docker/daemon.json

# View specific service logs
docker-compose logs -f --tail=100 backend
```

This Docker configuration provides a robust, scalable, and secure foundation for developing and deploying the AI social media platform.
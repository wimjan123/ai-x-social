# AI Social Media Platform - Docker Setup Guide

Complete Docker containerization setup for the AI-powered social media platform with political personas simulation.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Environment](#development-environment)
- [Production Deployment](#production-deployment)
- [Configuration](#configuration)
- [Services](#services)
- [Networking](#networking)
- [Volumes and Persistence](#volumes-and-persistence)
- [Monitoring and Logging](#monitoring-and-logging)
- [Security](#security)
- [Backup and Recovery](#backup-and-recovery)
- [Troubleshooting](#troubleshooting)
- [Performance Tuning](#performance-tuning)

## 🎯 Overview

This Docker setup provides a complete containerized environment for the AI Social Media Platform, including:

- **Multi-service architecture**: PostgreSQL 16, Redis 7, Backend API (Node.js 22), Frontend (Next.js 15)
- **Development optimization**: Hot reloading, debugging support, development tools
- **Production ready**: Security hardening, performance optimization, monitoring
- **Scalability**: Load balancing, horizontal scaling support
- **Reliability**: Health checks, automatic restarts, backup automation

## 📚 Prerequisites

### System Requirements

- **Docker**: Version 20.10+ with Docker Compose V2
- **RAM**: Minimum 4GB (8GB+ recommended for production)
- **Storage**: Minimum 10GB free space
- **CPU**: 2+ cores recommended

### Development Tools

```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose V2
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd ai_x_social

# Copy environment file and configure
cp .env.docker .env.docker.local
# Edit .env.docker.local with your API keys and settings
```

### 2. Development Environment

```bash
# Start all services in development mode
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### 3. Access Applications

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **PgAdmin** (optional): http://localhost:5050
- **Redis Commander** (optional): http://localhost:8081

## 🛠 Development Environment

### Starting Development Services

```bash
# Start core services (database, cache, API, frontend)
docker compose up -d

# Start with development tools (pgadmin, redis-commander)
docker compose --profile tools up -d

# Start specific service
docker compose up -d postgres redis

# Rebuild and start
docker compose up -d --build
```

### Development Workflows

#### Hot Reloading

Both frontend and backend support hot reloading in development:

```bash
# Backend hot reloading with tsx
docker compose exec backend npm run dev

# Frontend hot reloading with Next.js Fast Refresh
docker compose exec frontend npm run dev
```

#### Database Operations

```bash
# Run Prisma migrations
docker compose exec backend npx prisma migrate dev

# Seed database
docker compose exec backend npm run prisma:seed

# Open Prisma Studio
docker compose exec backend npx prisma studio

# Database shell access
docker compose exec postgres psql -U ai_social_user -d ai_social_db
```

#### Debugging

```bash
# View service logs
docker compose logs -f backend
docker compose logs -f frontend

# Execute commands in containers
docker compose exec backend bash
docker compose exec frontend bash

# Debug with Node.js inspector
docker compose exec backend node --inspect=0.0.0.0:9229 dist/index.js
```

### Development Tools

Enable development tools with profiles:

```bash
# Start with all development tools
docker compose --profile tools up -d

# Access PgAdmin
open http://localhost:5050
# Email: admin@ai-social.dev
# Password: admin

# Access Redis Commander
open http://localhost:8081
```

## 🏭 Production Deployment

### Production Configuration

```bash
# Copy production environment file
cp .env.docker .env.production

# Edit production settings
nano .env.production
```

**Critical Production Settings:**

```bash
# Security
JWT_SECRET=your-super-long-random-jwt-secret-here
NEXTAUTH_SECRET=your-super-long-random-nextauth-secret-here
POSTGRES_PASSWORD=your-strong-database-password
REDIS_PASSWORD=your-strong-redis-password

# URLs
NEXTAUTH_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Performance
LOG_LEVEL=info
ENABLE_API_DOCS=false
MAX_REQUESTS_PER_MINUTE=100

# SSL (if using nginx)
SSL_CERT_PATH=/etc/ssl/certs/certificate.crt
SSL_KEY_PATH=/etc/ssl/private/private.key
```

### Production Deployment Commands

```bash
# Deploy with production configuration
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Build production images
docker compose -f docker-compose.yml -f docker-compose.prod.yml build

# Scale services for high availability
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --scale backend=2 --scale frontend=2

# Enable backup service
docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile backup up -d
```

### SSL/TLS Setup

For production HTTPS, place SSL certificates in `docker/nginx/ssl/`:

```bash
mkdir -p docker/nginx/ssl
# Copy your SSL certificates
cp certificate.crt docker/nginx/ssl/
cp private.key docker/nginx/ssl/
cp ca.crt docker/nginx/ssl/
```

## ⚙️ Configuration

### Environment Variables

#### Core Configuration (`.env.docker`)

```bash
# Database
POSTGRES_DB=ai_social_db
POSTGRES_USER=ai_social_user
POSTGRES_PASSWORD=ai_social_dev_password

# Redis
REDIS_PORT=6379
REDIS_PASSWORD=

# Application
JWT_SECRET=dev-jwt-secret-change-in-production
NEXTAUTH_SECRET=dev-nextauth-secret-change-in-production
CORS_ORIGIN=http://localhost:3000

# API Keys
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
GOOGLE_AI_API_KEY=your_google_key
NEWS_API_KEY=your_news_api_key
```

#### Production Overrides (`.env.production`)

```bash
# Override development settings for production
NODE_ENV=production
LOG_LEVEL=info
ENABLE_API_DOCS=false

# Production URLs
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Strong passwords and secrets
POSTGRES_PASSWORD=super-strong-password
REDIS_PASSWORD=super-strong-redis-password
JWT_SECRET=very-long-random-string-for-jwt
```

### Service Configuration Files

- `docker/database/postgresql.conf` - PostgreSQL development settings
- `docker/database/postgresql-prod.conf` - PostgreSQL production settings
- `docker/redis/redis.conf` - Redis development settings
- `docker/redis/redis-prod.conf` - Redis production settings
- `docker/nginx/nginx.conf` - Nginx reverse proxy configuration

## 🏗 Services

### Service Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Backend   │    │    Nginx    │
│  (Next.js)  │    │  (Node.js)  │    │ (Reverse    │
│    :3000    │    │    :3001    │    │  Proxy)     │
└─────────────┘    └─────────────┘    └─────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ PostgreSQL  │    │    Redis    │    │  Dev Tools  │
│   :5432     │    │    :6379    │    │  (Optional) │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Service Details

#### PostgreSQL 16 Database

**Development Configuration:**
- Port: 5432
- Database: ai_social_db
- User: ai_social_user
- Memory: 256MB shared_buffers
- Persistence: Named volume `postgres_data`

**Production Configuration:**
- Enhanced security (no exposed ports)
- Optimized memory settings (2GB shared_buffers)
- Backup automation
- Performance monitoring

#### Redis 7 Cache

**Development Configuration:**
- Port: 6379
- Memory limit: 512MB
- Persistence: AOF + RDB
- Database allocation:
  - DB 0: Sessions
  - DB 1: Cache
  - DB 2: Real-time data
  - DB 3: AI processing
  - DB 4: News cache

**Production Configuration:**
- Authentication enabled
- Memory limit: 2GB
- Enhanced persistence settings
- Security hardening

#### Backend API (Node.js 22)

**Features:**
- TypeScript compilation
- Prisma ORM integration
- Multi-provider AI support
- Real-time WebSocket connections
- Rate limiting and security

**Development:**
- Hot reloading with tsx
- Debug port: 9229
- Volume mounting for live editing

**Production:**
- Multi-stage Docker build
- Security hardening
- Performance optimization
- Health checks

#### Frontend (Next.js 15)

**Features:**
- React 19 with Server Components
- Chakra UI + Tailwind CSS
- TypeScript support
- Image optimization
- Static file serving

**Development:**
- Fast Refresh
- Volume mounting
- File watching optimization

**Production:**
- Static optimization
- Image optimization
- Bundle splitting
- Performance optimization

### Service Commands

```bash
# Individual service management
docker compose up -d postgres          # Database only
docker compose up -d postgres redis    # Database and cache
docker compose restart backend          # Restart API
docker compose logs -f frontend        # Follow frontend logs

# Service scaling (production)
docker compose up -d --scale backend=3
docker compose up -d --scale frontend=2

# Service health checks
docker compose ps
docker inspect <container-name>
```

## 🌐 Networking

### Network Configuration

**Development Network:**
- Name: `ai-social-network`
- Driver: bridge
- Subnet: 172.20.0.0/16

**Production Network:**
- Name: `ai-social-prod-network`
- Driver: bridge
- Subnet: 172.21.0.0/16
- Enhanced security settings

### Service Communication

```bash
# Internal service URLs (container-to-container)
DATABASE_URL=postgresql://ai_social_user:password@postgres:5432/ai_social_db
REDIS_URL=redis://redis:6379

# External access (host-to-container)
Frontend: http://localhost:3000
Backend: http://localhost:3001
Database: postgresql://localhost:5432/ai_social_db
Redis: redis://localhost:6379
```

### Port Mapping

| Service | Internal Port | External Port | Protocol |
|---------|---------------|---------------|----------|
| Frontend | 3000 | 3000 | HTTP |
| Backend | 3001 | 3001 | HTTP/WS |
| PostgreSQL | 5432 | 5432 | TCP |
| Redis | 6379 | 6379 | TCP |
| Nginx | 80/443 | 80/443 | HTTP/HTTPS |
| PgAdmin | 80 | 5050 | HTTP |
| Redis Commander | 8081 | 8081 | HTTP |

## 💾 Volumes and Persistence

### Volume Configuration

```yaml
volumes:
  # Development volumes
  postgres_data:        # PostgreSQL data persistence
  redis_data:          # Redis data persistence

  # Production volumes
  postgres_prod_data:  # Production PostgreSQL data
  redis_prod_data:     # Production Redis data
  postgres_backups:    # Automated database backups
  backend_logs:        # Application logs
  backend_uploads:     # User uploaded files
  nginx_logs:          # Nginx access/error logs
```

### Backup Strategy

#### Automated Backups

```bash
# Enable backup service
docker compose --profile backup up -d

# Manual backup
docker compose exec db-backup /backup.sh backup

# List available backups
docker compose exec db-backup /backup.sh list

# Restore from backup
docker compose exec db-backup /backup.sh restore /backups/backup_file.sql.gz
```

#### Backup Configuration

```bash
# Environment variables for backup service
BACKUP_SCHEDULE=0 2 * * *    # Daily at 2 AM
RETENTION_DAYS=30            # Keep backups for 30 days
BACKUP_DIR=/backups          # Backup directory
```

### Data Management

```bash
# Volume inspection
docker volume ls
docker volume inspect ai-social-postgres-data

# Volume backup (manual)
docker run --rm -v ai-social-postgres-data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz /data

# Volume restore (manual)
docker run --rm -v ai-social-postgres-data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres-backup.tar.gz -C /
```

## 📊 Monitoring and Logging

### Log Management

```bash
# View all service logs
docker compose logs

# Follow specific service logs
docker compose logs -f backend
docker compose logs -f frontend

# View logs with timestamps
docker compose logs -t

# Limit log output
docker compose logs --tail=100 backend
```

### Log Configuration

All services are configured with structured logging:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"    # Development
    max-size: "50m"    # Production
    max-file: "3"      # Development
    max-file: "5"      # Production
```

### Health Monitoring

#### Service Health Checks

```bash
# Check service health
docker compose ps

# Individual health check
docker inspect <container-name> | grep Health -A 10

# Manual health check
curl http://localhost:3000/api/health  # Frontend
curl http://localhost:3001/health      # Backend
```

#### Performance Monitoring

```bash
# Resource usage
docker stats

# Container resource limits
docker inspect <container-name> | grep -A 10 Resources

# Database performance
docker compose exec postgres pg_stat_activity

# Redis performance
docker compose exec redis redis-cli info stats
```

### Production Monitoring (Optional)

Enable monitoring stack with Prometheus and Grafana:

```bash
# Start monitoring services
docker compose --profile monitoring up -d

# Access Prometheus: http://localhost:9090
# Access Grafana: http://localhost:3002
```

## 🔒 Security

### Development Security

- Non-root user execution in containers
- Network isolation
- Basic authentication for admin tools
- No exposed production ports

### Production Security

#### Container Security

- Multi-stage builds minimize attack surface
- Security updates applied to base images
- No package managers in production images
- Read-only file systems where possible
- Non-root user execution

#### Network Security

```bash
# Production network isolation
networks:
  ai-social-prod-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.21.0.0/16
```

#### Secret Management

```bash
# Use Docker secrets for production
echo "super-secret-password" | docker secret create postgres_password -
echo "jwt-secret-key" | docker secret create jwt_secret -

# Reference in compose file
secrets:
  - postgres_password
  - jwt_secret
```

#### SSL/TLS Configuration

```nginx
# SSL settings in nginx.conf
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256;
ssl_prefer_server_ciphers on;
```

### Security Checklist

- [ ] Change all default passwords
- [ ] Set strong JWT secrets
- [ ] Enable SSL/TLS in production
- [ ] Configure firewall rules
- [ ] Set up log monitoring
- [ ] Enable automated security updates
- [ ] Regular security scanning
- [ ] Backup encryption
- [ ] Network segmentation
- [ ] Access logging

## 🔧 Backup and Recovery

### Automated Backup System

The platform includes a comprehensive backup system for PostgreSQL:

#### Backup Service Configuration

```yaml
db-backup:
  image: postgres:16-alpine
  environment:
    POSTGRES_DB: ${POSTGRES_DB}
    POSTGRES_USER: ${POSTGRES_USER}
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    BACKUP_SCHEDULE: ${BACKUP_SCHEDULE:-0 2 * * *}
  volumes:
    - postgres_backups:/backups
    - ./docker/scripts/backup.sh:/backup.sh:ro
```

#### Backup Operations

```bash
# Enable backup service
docker compose --profile backup up -d

# Perform manual backup
docker compose exec db-backup /backup.sh backup

# List all available backups
docker compose exec db-backup /backup.sh list

# Check backup system health
docker compose exec db-backup /backup.sh health

# Restore from specific backup
docker compose exec db-backup /backup.sh restore /backups/ai_social_backup_20231201_120000.sql.gz
```

#### Backup Features

- **Automated scheduling**: Daily backups via cron
- **Compression**: gzip compression for storage efficiency
- **Retention**: Configurable retention period (default: 30 days)
- **Verification**: Automatic backup integrity checks
- **Health monitoring**: System health checks before backup
- **Logging**: Detailed backup operation logs

### Disaster Recovery

#### Complete System Recovery

```bash
# 1. Stop all services
docker compose down

# 2. Remove volumes (if needed for clean restore)
docker volume rm ai-social-postgres-data

# 3. Recreate volumes
docker volume create ai-social-postgres-data

# 4. Start database service only
docker compose up -d postgres

# 5. Wait for database to be ready
docker compose exec postgres pg_isready

# 6. Restore from backup
docker compose exec db-backup /backup.sh restore /backups/latest_backup.sql.gz

# 7. Start all services
docker compose up -d
```

#### Data Migration

```bash
# Export data from source
docker compose exec postgres pg_dump -U ai_social_user ai_social_db > migration_export.sql

# Import data to target
docker compose exec -T postgres psql -U ai_social_user ai_social_db < migration_export.sql
```

## 🐛 Troubleshooting

### Common Issues

#### Service Won't Start

```bash
# Check service status
docker compose ps

# View service logs
docker compose logs <service-name>

# Check port conflicts
netstat -tulpn | grep <port>

# Restart specific service
docker compose restart <service-name>
```

#### Database Connection Issues

```bash
# Check database health
docker compose exec postgres pg_isready -U ai_social_user -d ai_social_db

# Test connection
docker compose exec backend npm run db:health

# Check database logs
docker compose logs postgres

# Reset database (development only)
docker compose down
docker volume rm ai-social-postgres-data
docker compose up -d postgres
docker compose exec backend npx prisma migrate dev
```

#### Redis Connection Issues

```bash
# Check Redis health
docker compose exec redis redis-cli ping

# Test Redis connection
docker compose exec backend npm run redis:health

# Check Redis logs
docker compose logs redis

# Clear Redis data (development only)
docker compose exec redis redis-cli FLUSHALL
```

#### Frontend Build Issues

```bash
# Clear Next.js cache
docker compose exec frontend rm -rf .next

# Rebuild frontend
docker compose build frontend

# Check Node.js version
docker compose exec frontend node --version

# Check npm dependencies
docker compose exec frontend npm list
```

#### Performance Issues

```bash
# Check resource usage
docker stats

# Check container limits
docker inspect <container-name> | grep -A 5 Resources

# Database performance
docker compose exec postgres psql -U ai_social_user -d ai_social_db -c "SELECT * FROM pg_stat_activity;"

# Redis performance
docker compose exec redis redis-cli info stats
```

### Debug Mode

Enable debug mode for detailed logging:

```bash
# Set debug environment
export DEBUG=*
export LOG_LEVEL=debug

# Start with debug logging
docker compose up -d

# View debug logs
docker compose logs -f
```

### Service-Specific Debugging

#### Backend API Debugging

```bash
# Enable Node.js inspector
docker compose exec backend node --inspect=0.0.0.0:9229 dist/index.js

# Connect debugger
# Chrome: chrome://inspect
# VS Code: Attach to process on localhost:9229

# Check API health
curl http://localhost:3001/health

# Test database connection
curl http://localhost:3001/api/health/database

# Test Redis connection
curl http://localhost:3001/api/health/redis
```

#### Frontend Debugging

```bash
# Check Next.js build
docker compose exec frontend npm run build

# Check environment variables
docker compose exec frontend env | grep NEXT_PUBLIC

# Test frontend health
curl http://localhost:3000/api/health
```

## ⚡ Performance Tuning

### Development Performance

#### Hot Reloading Optimization

```yaml
# Optimize file watching for development
environment:
  WATCHPACK_POLLING: true
  CHOKIDAR_USEPOLLING: true
volumes:
  - ./frontend:/app
  - /app/node_modules  # Exclude node_modules from sync
  - /app/.next         # Exclude .next from sync
```

#### Database Performance

```bash
# Optimize PostgreSQL for development
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
```

### Production Performance

#### Container Resource Limits

```yaml
deploy:
  resources:
    limits:
      memory: 2G
      cpus: '1.0'
    reservations:
      memory: 1G
      cpus: '0.5'
```

#### Database Optimization

```bash
# Production PostgreSQL settings
shared_buffers = 2GB
effective_cache_size = 6GB
work_mem = 16MB
maintenance_work_mem = 512MB
max_connections = 200
```

#### Redis Optimization

```bash
# Production Redis settings
maxmemory = 2gb
maxmemory-policy = allkeys-lru
save = 900 1 300 10 60 10000
```

#### Nginx Optimization

```nginx
# Performance optimizations
worker_processes auto;
worker_connections 1024;
sendfile on;
tcp_nopush on;
tcp_nodelay on;
gzip on;
```

### Scaling Strategies

#### Horizontal Scaling

```bash
# Scale backend services
docker compose up -d --scale backend=3

# Scale frontend services
docker compose up -d --scale frontend=2

# Load balancing via nginx upstream
upstream backend {
    least_conn;
    server backend:3001;
    server backend-2:3001;
    server backend-3:3001;
}
```

#### Database Scaling

```bash
# Read replicas (future implementation)
postgres-replica:
  image: postgres:16-alpine
  environment:
    PGUSER: replica_user
  command: |
    bash -c "
    echo 'standby_mode = on' >> /var/lib/postgresql/data/recovery.conf
    echo 'primary_conninfo = host=postgres port=5432 user=replica_user' >> /var/lib/postgresql/data/recovery.conf
    postgres
    "
```

### Performance Monitoring

```bash
# Container performance
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"

# Database performance queries
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;

# Redis performance monitoring
redis-cli info stats | grep instantaneous
```

---

## 📄 Additional Resources

### File Structure

```
ai_x_social/
├── docker-compose.yml              # Main development configuration
├── docker-compose.prod.yml         # Production overrides
├── .env.docker                     # Environment template
├── README-Docker.md                # This documentation
├── docker/
│   ├── database/
│   │   ├── init.sql                # Database initialization
│   │   ├── postgresql.conf         # Development config
│   │   └── postgresql-prod.conf    # Production config
│   ├── redis/
│   │   ├── redis.conf              # Development config
│   │   └── redis-prod.conf         # Production config
│   ├── nginx/
│   │   ├── nginx.conf              # Reverse proxy config
│   │   └── ssl/                    # SSL certificates
│   └── scripts/
│       └── backup.sh               # Database backup script
├── backend/
│   ├── Dockerfile                  # Production Dockerfile
│   └── Dockerfile.dev              # Development Dockerfile
└── frontend/
    ├── Dockerfile                  # Production Dockerfile
    └── Dockerfile.dev              # Development Dockerfile
```

### Useful Commands Reference

```bash
# Development
docker compose up -d                 # Start all services
docker compose --profile tools up -d # Start with dev tools
docker compose down                  # Stop all services
docker compose build                # Rebuild all images
docker compose pull                 # Pull latest base images

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile backup up -d

# Maintenance
docker system prune                 # Clean up unused containers/images
docker volume prune                 # Clean up unused volumes
docker compose logs -f              # Follow all logs
docker stats                        # Monitor resource usage
```

### Environment Examples

Create these files based on your environment:

- `.env.docker.local` - Your local development settings
- `.env.docker.staging` - Staging environment settings
- `.env.docker.production` - Production environment settings

### Support and Contributing

For issues, feature requests, or contributions, please refer to the main project documentation and repository guidelines.

---

**Last Updated**: 2025-09-17
**Version**: 1.0.0
**Maintainer**: AI X Social Team
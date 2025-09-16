#!/bin/bash

# AI Social Media Platform - Docker Development Script
# Provides convenient commands for Docker-based development

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.yml"
COMPOSE_PROD_FILE="docker-compose.prod.yml"
ENV_FILE=".env"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
}

# Check if Docker and Docker Compose are installed
check_dependencies() {
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Check if .env file exists
check_env() {
    if [[ ! -f "$ENV_FILE" ]]; then
        warn ".env file not found. Creating from .env.example..."
        if [[ -f ".env.example" ]]; then
            cp .env.example .env
            log "Created .env file from .env.example. Please edit it with your configuration."
        else
            error ".env.example file not found. Please create .env file manually."
            exit 1
        fi
    fi
}

# Build images
build() {
    log "Building Docker images..."

    case "${1:-all}" in
        "frontend")
            docker-compose build frontend
            ;;
        "backend")
            docker-compose build backend
            ;;
        "all"|*)
            docker-compose build
            ;;
    esac

    log "Build completed successfully!"
}

# Start development environment
start() {
    log "Starting AI Social development environment..."

    check_env

    # Start core services first
    log "Starting database and cache services..."
    docker-compose up -d postgres redis

    # Wait for services to be healthy
    log "Waiting for services to be ready..."
    docker-compose exec postgres pg_isready -U postgres -d ai_social || sleep 5

    # Start application services
    log "Starting application services..."
    docker-compose up -d backend frontend

    # Show status
    status

    log "Development environment started!"
    log "Frontend: http://localhost:3000"
    log "Backend API: http://localhost:3001"
    log "PgAdmin: http://localhost:5050 (with --tools)"
    log "Redis Commander: http://localhost:8081 (with --tools)"
}

# Start with development tools
start_with_tools() {
    log "Starting with development tools..."
    COMPOSE_PROFILES=tools start
}

# Stop all services
stop() {
    log "Stopping all services..."
    docker-compose down
    log "All services stopped."
}

# Restart services
restart() {
    log "Restarting services..."
    stop
    start
}

# Show service status
status() {
    log "Service status:"
    docker-compose ps

    echo ""
    log "Service health:"
    docker-compose exec postgres pg_isready -U postgres -d ai_social 2>/dev/null && \
        echo -e "${GREEN}✓ PostgreSQL: Ready${NC}" || \
        echo -e "${RED}✗ PostgreSQL: Not ready${NC}"

    docker-compose exec redis redis-cli ping 2>/dev/null | grep -q PONG && \
        echo -e "${GREEN}✓ Redis: Ready${NC}" || \
        echo -e "${RED}✗ Redis: Not ready${NC}"

    curl -sf http://localhost:3001/health >/dev/null 2>&1 && \
        echo -e "${GREEN}✓ Backend: Ready${NC}" || \
        echo -e "${RED}✗ Backend: Not ready${NC}"

    curl -sf http://localhost:3000 >/dev/null 2>&1 && \
        echo -e "${GREEN}✓ Frontend: Ready${NC}" || \
        echo -e "${RED}✗ Frontend: Not ready${NC}"
}

# View logs
logs() {
    local service="${1:-}"

    if [[ -n "$service" ]]; then
        log "Showing logs for $service..."
        docker-compose logs -f "$service"
    else
        log "Showing logs for all services..."
        docker-compose logs -f
    fi
}

# Clean up development environment
clean() {
    warn "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response

    if [[ "$response" =~ ^[Yy]$ ]]; then
        log "Cleaning up..."
        docker-compose down -v --rmi all
        docker system prune -f
        log "Cleanup completed!"
    else
        log "Cleanup cancelled."
    fi
}

# Setup database
setup_db() {
    log "Setting up database..."

    # Wait for postgres to be ready
    docker-compose exec postgres pg_isready -U postgres -d ai_social

    # Run Prisma migrations
    docker-compose exec backend npx prisma db push
    docker-compose exec backend npx prisma generate
    docker-compose exec backend npm run seed 2>/dev/null || log "No seed script found, skipping..."

    log "Database setup completed!"
}

# Reset database
reset_db() {
    warn "This will reset the database and all data will be lost. Are you sure? (y/N)"
    read -r response

    if [[ "$response" =~ ^[Yy]$ ]]; then
        log "Resetting database..."
        docker-compose exec backend npx prisma db reset --force
        log "Database reset completed!"
    else
        log "Database reset cancelled."
    fi
}

# Production deployment
deploy_prod() {
    log "Deploying to production..."

    # Build production images
    docker-compose -f "$COMPOSE_FILE" -f "$COMPOSE_PROD_FILE" build

    # Start production services
    docker-compose -f "$COMPOSE_FILE" -f "$COMPOSE_PROD_FILE" up -d

    log "Production deployment completed!"
}

# Show help
show_help() {
    cat << EOF
AI Social Media Platform - Docker Development Script

Usage: $0 [COMMAND]

Commands:
    start              Start development environment
    start-tools        Start with development tools (pgadmin, redis-commander)
    stop               Stop all services
    restart            Restart all services
    status             Show service status and health
    logs [service]     Show logs (optionally for specific service)
    build [service]    Build images (frontend, backend, or all)
    clean              Clean up all containers, volumes, and images
    setup-db           Setup database with migrations and seeds
    reset-db           Reset database (WARNING: destroys all data)
    deploy-prod        Deploy to production
    help               Show this help message

Examples:
    $0 start           # Start development environment
    $0 logs backend    # Show backend logs
    $0 build frontend  # Build only frontend image
    $0 clean           # Clean up everything

For more information, see the project documentation.
EOF
}

# Main script logic
main() {
    check_dependencies

    case "${1:-help}" in
        "start")
            start
            ;;
        "start-tools")
            start_with_tools
            ;;
        "stop")
            stop
            ;;
        "restart")
            restart
            ;;
        "status")
            status
            ;;
        "logs")
            logs "${2:-}"
            ;;
        "build")
            build "${2:-all}"
            ;;
        "clean")
            clean
            ;;
        "setup-db")
            setup_db
            ;;
        "reset-db")
            reset_db
            ;;
        "deploy-prod")
            deploy_prod
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
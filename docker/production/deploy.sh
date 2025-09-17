#!/bin/bash
# Production Deployment Script for AI Social Media Platform
# Handles zero-downtime deployments with health checks and rollback capabilities

set -euo pipefail

# Configuration
PROJECT_NAME="ai-social"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"
BACKUP_DIR="./backups"
HEALTH_CHECK_TIMEOUT=300
HEALTH_CHECK_INTERVAL=10

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking deployment prerequisites..."

    # Check if running as root or with sudo
    if [[ $EUID -eq 0 ]]; then
        log_warning "Running as root. Consider using a non-root user with docker group membership."
    fi

    # Check required files
    if [[ ! -f "$COMPOSE_FILE" ]]; then
        log_error "Docker Compose file not found: $COMPOSE_FILE"
        exit 1
    fi

    if [[ ! -f "$ENV_FILE" ]]; then
        log_warning "Environment file not found: $ENV_FILE"
        log_info "Please create $ENV_FILE with required environment variables"
        exit 1
    fi

    # Check Docker and Docker Compose
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi

    # Check disk space (require at least 2GB free)
    available_space=$(df . | tail -1 | awk '{print $4}')
    required_space=2097152  # 2GB in KB
    if [[ $available_space -lt $required_space ]]; then
        log_error "Insufficient disk space. Required: 2GB, Available: $(($available_space / 1024 / 1024))GB"
        exit 1
    fi

    log_success "Prerequisites check passed"
}

# Validate environment configuration
validate_environment() {
    log_info "Validating environment configuration..."

    # Source environment file
    set -a  # automatically export all variables
    source "$ENV_FILE"
    set +a

    # Check required variables
    required_vars=(
        "POSTGRES_PASSWORD"
        "JWT_SECRET"
        "NEXTAUTH_SECRET"
    )

    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            log_error "Required environment variable $var is not set"
            exit 1
        fi
    done

    # Validate JWT_SECRET length (should be at least 32 characters)
    if [[ ${#JWT_SECRET} -lt 32 ]]; then
        log_error "JWT_SECRET must be at least 32 characters long"
        exit 1
    fi

    # Validate NEXTAUTH_SECRET length
    if [[ ${#NEXTAUTH_SECRET} -lt 32 ]]; then
        log_error "NEXTAUTH_SECRET must be at least 32 characters long"
        exit 1
    fi

    log_success "Environment validation passed"
}

# Create backup of current deployment
create_backup() {
    log_info "Creating backup of current deployment..."

    local backup_timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_path="$BACKUP_DIR/backup_$backup_timestamp"

    mkdir -p "$backup_path"

    # Backup database
    if docker-compose -f "$COMPOSE_FILE" ps postgres | grep -q "Up"; then
        log_info "Backing up database..."
        docker-compose -f "$COMPOSE_FILE" exec -T postgres pg_dump \
            -U "${POSTGRES_USER:-aisocial}" \
            -d "${POSTGRES_DB:-aisocial}" \
            --no-owner --no-acl > "$backup_path/database.sql" || {
            log_warning "Database backup failed, but continuing..."
        }
    fi

    # Backup environment file
    cp "$ENV_FILE" "$backup_path/" 2>/dev/null || true

    # Backup docker-compose configuration
    cp "$COMPOSE_FILE" "$backup_path/" 2>/dev/null || true

    # Store current image tags
    docker-compose -f "$COMPOSE_FILE" config | grep "image:" > "$backup_path/image_tags.txt" 2>/dev/null || true

    log_success "Backup created at $backup_path"
    echo "$backup_path" > ".last_backup"
}

# Health check function
health_check() {
    local service_url=$1
    local service_name=$2
    local timeout=${3:-$HEALTH_CHECK_TIMEOUT}
    local interval=${4:-$HEALTH_CHECK_INTERVAL}

    log_info "Performing health check for $service_name..."

    local elapsed=0
    while [[ $elapsed -lt $timeout ]]; do
        if curl -f -s --max-time 5 "$service_url" >/dev/null 2>&1; then
            log_success "$service_name health check passed"
            return 0
        fi

        sleep $interval
        elapsed=$((elapsed + interval))
        log_info "Health check for $service_name... ($elapsed/${timeout}s)"
    done

    log_error "$service_name health check failed after ${timeout}s"
    return 1
}

# Wait for services to be healthy
wait_for_services() {
    log_info "Waiting for services to become healthy..."

    # Wait for database
    if ! health_check "http://localhost:5432" "PostgreSQL" 120 5; then
        # Alternative check using docker-compose
        local retries=0
        while [[ $retries -lt 24 ]]; do  # 2 minutes with 5s intervals
            if docker-compose -f "$COMPOSE_FILE" exec postgres pg_isready -U "${POSTGRES_USER:-aisocial}" >/dev/null 2>&1; then
                log_success "PostgreSQL is ready"
                break
            fi
            sleep 5
            retries=$((retries + 1))
            log_info "Waiting for PostgreSQL... (${retries}/24)"
        done

        if [[ $retries -eq 24 ]]; then
            log_error "PostgreSQL failed to become ready"
            return 1
        fi
    fi

    # Wait for Redis
    local retries=0
    while [[ $retries -lt 12 ]]; do  # 1 minute with 5s intervals
        if docker-compose -f "$COMPOSE_FILE" exec redis redis-cli ping >/dev/null 2>&1; then
            log_success "Redis is ready"
            break
        fi
        sleep 5
        retries=$((retries + 1))
        log_info "Waiting for Redis... (${retries}/12)"
    done

    if [[ $retries -eq 12 ]]; then
        log_error "Redis failed to become ready"
        return 1
    fi

    # Wait for backend
    if ! health_check "http://localhost/api/health" "Backend API" 180 10; then
        return 1
    fi

    # Wait for frontend
    if ! health_check "http://localhost/" "Frontend" 120 10; then
        return 1
    fi

    log_success "All services are healthy"
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."

    # Check if backend container is running
    if ! docker-compose -f "$COMPOSE_FILE" ps backend | grep -q "Up"; then
        log_error "Backend container is not running"
        return 1
    fi

    # Run Prisma migrations
    if docker-compose -f "$COMPOSE_FILE" exec backend npx prisma migrate deploy; then
        log_success "Database migrations completed successfully"
    else
        log_error "Database migrations failed"
        return 1
    fi
}

# Deploy application
deploy() {
    log_info "Starting deployment..."

    # Pull latest images
    log_info "Pulling latest images..."
    if ! docker-compose -f "$COMPOSE_FILE" pull; then
        log_error "Failed to pull images"
        return 1
    fi

    # Start services with rolling update
    log_info "Starting services..."
    if ! docker-compose -f "$COMPOSE_FILE" up -d --remove-orphans; then
        log_error "Failed to start services"
        return 1
    fi

    # Wait for services to be healthy
    if ! wait_for_services; then
        log_error "Services failed to become healthy"
        return 1
    fi

    # Run database migrations
    if ! run_migrations; then
        log_error "Database migrations failed"
        return 1
    fi

    log_success "Deployment completed successfully"
}

# Rollback to previous version
rollback() {
    log_warning "Starting rollback procedure..."

    if [[ ! -f ".last_backup" ]]; then
        log_error "No backup found for rollback"
        exit 1
    fi

    local backup_path=$(cat ".last_backup")
    if [[ ! -d "$backup_path" ]]; then
        log_error "Backup directory not found: $backup_path"
        exit 1
    fi

    # Stop current services
    log_info "Stopping current services..."
    docker-compose -f "$COMPOSE_FILE" down

    # Restore database if backup exists
    if [[ -f "$backup_path/database.sql" ]]; then
        log_info "Restoring database..."
        # Start only postgres for restore
        docker-compose -f "$COMPOSE_FILE" up -d postgres
        sleep 10

        # Wait for postgres to be ready
        local retries=0
        while [[ $retries -lt 12 ]]; do
            if docker-compose -f "$COMPOSE_FILE" exec postgres pg_isready -U "${POSTGRES_USER:-aisocial}" >/dev/null 2>&1; then
                break
            fi
            sleep 5
            retries=$((retries + 1))
        done

        # Restore database
        docker-compose -f "$COMPOSE_FILE" exec -T postgres psql \
            -U "${POSTGRES_USER:-aisocial}" \
            -d "${POSTGRES_DB:-aisocial}" \
            < "$backup_path/database.sql" || {
            log_warning "Database restore failed"
        }
    fi

    # Restore configurations
    if [[ -f "$backup_path/$ENV_FILE" ]]; then
        cp "$backup_path/$ENV_FILE" .
        log_info "Environment configuration restored"
    fi

    if [[ -f "$backup_path/$COMPOSE_FILE" ]]; then
        cp "$backup_path/$COMPOSE_FILE" .
        log_info "Docker Compose configuration restored"
    fi

    # Start services
    log_info "Starting services..."
    docker-compose -f "$COMPOSE_FILE" up -d

    # Health check
    if wait_for_services; then
        log_success "Rollback completed successfully"
    else
        log_error "Rollback failed - services are not healthy"
        exit 1
    fi
}

# Show deployment status
status() {
    log_info "Deployment Status"
    echo "===================="

    # Service status
    docker-compose -f "$COMPOSE_FILE" ps

    echo ""
    log_info "Service Health Checks"
    echo "====================="

    # Health checks
    services=(
        "http://localhost/health:Nginx"
        "http://localhost/api/health:Backend"
        "http://localhost/:Frontend"
    )

    for service in "${services[@]}"; do
        IFS=':' read -r url name <<< "$service"
        if curl -f -s --max-time 5 "$url" >/dev/null 2>&1; then
            echo -e "${GREEN}✓${NC} $name is healthy"
        else
            echo -e "${RED}✗${NC} $name is not responding"
        fi
    done

    echo ""
    log_info "Resource Usage"
    echo "=============="
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.PIDs}}" $(docker-compose -f "$COMPOSE_FILE" ps -q) 2>/dev/null || echo "No containers running"
}

# Clean up old resources
cleanup() {
    log_info "Cleaning up old resources..."

    # Remove unused images
    docker image prune -f >/dev/null 2>&1 || true

    # Remove unused volumes (be careful with this)
    if [[ "${CLEAN_VOLUMES:-false}" == "true" ]]; then
        log_warning "Cleaning unused volumes..."
        docker volume prune -f >/dev/null 2>&1 || true
    fi

    # Remove old backups (keep last 5)
    if [[ -d "$BACKUP_DIR" ]]; then
        find "$BACKUP_DIR" -type d -name "backup_*" | sort -r | tail -n +6 | xargs rm -rf 2>/dev/null || true
    fi

    log_success "Cleanup completed"
}

# Show logs
logs() {
    local service=${1:-""}
    if [[ -n "$service" ]]; then
        docker-compose -f "$COMPOSE_FILE" logs -f "$service"
    else
        docker-compose -f "$COMPOSE_FILE" logs -f
    fi
}

# Main execution
main() {
    case "${1:-deploy}" in
        "deploy")
            check_prerequisites
            validate_environment
            create_backup
            deploy
            ;;
        "rollback")
            rollback
            ;;
        "status")
            status
            ;;
        "logs")
            logs "${2:-}"
            ;;
        "cleanup")
            cleanup
            ;;
        "health")
            wait_for_services
            ;;
        *)
            echo "AI Social Media Platform - Production Deployment Script"
            echo ""
            echo "Usage: $0 [command] [options]"
            echo ""
            echo "Commands:"
            echo "  deploy    - Deploy the application (default)"
            echo "  rollback  - Rollback to previous version"
            echo "  status    - Show deployment status and health"
            echo "  logs      - Show logs (optional: service name)"
            echo "  cleanup   - Clean up old resources"
            echo "  health    - Run health checks"
            echo ""
            echo "Environment variables:"
            echo "  CLEAN_VOLUMES - Clean unused volumes during cleanup (default: false)"
            echo ""
            echo "Examples:"
            echo "  $0 deploy"
            echo "  $0 logs backend"
            echo "  $0 status"
            echo "  CLEAN_VOLUMES=true $0 cleanup"
            exit 1
            ;;
    esac
}

# Handle script arguments
main "$@"
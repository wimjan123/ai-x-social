#!/bin/bash
# Production Build Script for AI Social Media Platform
# Builds optimized Docker images with security scanning and multi-architecture support

set -euo pipefail

# Configuration
PROJECT_NAME="ai-social"
REGISTRY="${DOCKER_REGISTRY:-localhost:5000}"
VERSION="${VERSION:-$(date +%Y%m%d-%H%M%S)}"
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
VCS_REF=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi

    # Check if buildx is available for multi-architecture builds
    if docker buildx version &> /dev/null; then
        BUILDX_AVAILABLE=true
        log_info "Docker Buildx available for multi-architecture builds"
    else
        BUILDX_AVAILABLE=false
        log_warning "Docker Buildx not available, building for current architecture only"
    fi

    log_success "Prerequisites check passed"
}

# Security scanning function
security_scan() {
    local image=$1
    log_info "Running security scan on $image..."

    # Check if Trivy is available
    if command -v trivy &> /dev/null; then
        trivy image --severity HIGH,CRITICAL --no-progress $image
        local scan_result=$?
        if [ $scan_result -eq 0 ]; then
            log_success "Security scan passed for $image"
        else
            log_warning "Security vulnerabilities found in $image"
        fi
    else
        log_warning "Trivy not available, skipping security scan"
    fi
}

# Build function with multi-architecture support
build_image() {
    local dockerfile=$1
    local context=$2
    local image_name=$3
    local target=${4:-production}

    log_info "Building $image_name..."

    # Build arguments
    local build_args=(
        --build-arg NODE_VERSION=22.12
        --build-arg ALPINE_VERSION=3.20
        --build-arg BUILD_DATE="$BUILD_DATE"
        --build-arg VCS_REF="$VCS_REF"
        --build-arg VERSION="$VERSION"
        --target "$target"
        --tag "$image_name:$VERSION"
        --tag "$image_name:latest"
    )

    if [ "$BUILDX_AVAILABLE" = true ] && [ "${MULTI_ARCH:-false}" = "true" ]; then
        # Multi-architecture build
        docker buildx build \
            "${build_args[@]}" \
            --platform linux/amd64,linux/arm64 \
            --push \
            -f "$dockerfile" \
            "$context"
    else
        # Single architecture build
        docker build \
            "${build_args[@]}" \
            -f "$dockerfile" \
            "$context"

        # Security scan
        security_scan "$image_name:$VERSION"
    fi

    log_success "Built $image_name successfully"
}

# Build all images
build_all() {
    log_info "Starting build process for version $VERSION..."

    # Change to project root directory
    cd "$(dirname "$0")/../.."

    # Backend image
    build_image "Dockerfile.backend" "." "${REGISTRY}/${PROJECT_NAME}-backend"

    # Frontend image
    build_image "Dockerfile.frontend" "." "${REGISTRY}/${PROJECT_NAME}-frontend"

    # Full-stack image (optional)
    if [ "${BUILD_FULLSTACK:-false}" = "true" ]; then
        build_image "Dockerfile.full" "." "${REGISTRY}/${PROJECT_NAME}-fullstack"
    fi

    # Minimal production images
    if [ "${BUILD_MINIMAL:-false}" = "true" ]; then
        log_info "Building minimal production images..."
        build_image "Dockerfile.backend" "." "${REGISTRY}/${PROJECT_NAME}-backend-minimal" "minimal"
        build_image "Dockerfile.frontend" "." "${REGISTRY}/${PROJECT_NAME}-frontend-minimal" "minimal"
    fi
}

# Generate deployment manifests
generate_manifests() {
    log_info "Generating deployment manifests..."

    # Create manifests directory
    mkdir -p ./docker/production/manifests

    # Generate docker-compose with correct image tags
    envsubst < ./docker/production/docker-compose.prod.yml.template > ./docker/production/manifests/docker-compose-${VERSION}.yml 2>/dev/null || \
    sed "s|image: .*backend.*|image: ${REGISTRY}/${PROJECT_NAME}-backend:${VERSION}|g; s|image: .*frontend.*|image: ${REGISTRY}/${PROJECT_NAME}-frontend:${VERSION}|g" \
        ./docker/production/docker-compose.prod.yml > ./docker/production/manifests/docker-compose-${VERSION}.yml

    log_success "Generated deployment manifests in ./docker/production/manifests/"
}

# Test built images
test_images() {
    log_info "Testing built images..."

    # Test backend health check
    log_info "Testing backend image..."
    docker run --rm -d --name test-backend -p 3001:3001 \
        -e NODE_ENV=production \
        -e DATABASE_URL=postgresql://test:test@localhost:5432/test \
        -e REDIS_URL=redis://localhost:6379 \
        "${REGISTRY}/${PROJECT_NAME}-backend:${VERSION}" || true

    sleep 10

    if curl -f http://localhost:3001/health &>/dev/null; then
        log_success "Backend health check passed"
    else
        log_warning "Backend health check failed"
    fi

    docker stop test-backend &>/dev/null || true

    # Test frontend health check
    log_info "Testing frontend image..."
    docker run --rm -d --name test-frontend -p 3000:3000 \
        -e NODE_ENV=production \
        "${REGISTRY}/${PROJECT_NAME}-frontend:${VERSION}" || true

    sleep 10

    if curl -f http://localhost:3000 &>/dev/null; then
        log_success "Frontend health check passed"
    else
        log_warning "Frontend health check failed"
    fi

    docker stop test-frontend &>/dev/null || true
}

# Cleanup function
cleanup() {
    log_info "Cleaning up..."
    docker container prune -f &>/dev/null || true
    docker image prune -f &>/dev/null || true
    docker system prune -f --volumes &>/dev/null || true
    log_success "Cleanup completed"
}

# Main execution
main() {
    log_info "AI Social Media Platform - Production Build Script"
    log_info "Version: $VERSION"
    log_info "Registry: $REGISTRY"
    log_info "VCS Ref: $VCS_REF"

    check_prerequisites
    build_all

    if [ "${SKIP_TESTS:-false}" != "true" ]; then
        test_images
    fi

    if [ "${GENERATE_MANIFESTS:-true}" = "true" ]; then
        generate_manifests
    fi

    if [ "${CLEANUP:-true}" = "true" ]; then
        cleanup
    fi

    log_success "Build process completed successfully!"
    log_info "Images built:"
    log_info "  - ${REGISTRY}/${PROJECT_NAME}-backend:${VERSION}"
    log_info "  - ${REGISTRY}/${PROJECT_NAME}-frontend:${VERSION}"

    if [ "${BUILD_FULLSTACK:-false}" = "true" ]; then
        log_info "  - ${REGISTRY}/${PROJECT_NAME}-fullstack:${VERSION}"
    fi

    if [ "${BUILD_MINIMAL:-false}" = "true" ]; then
        log_info "  - ${REGISTRY}/${PROJECT_NAME}-backend-minimal:${VERSION}"
        log_info "  - ${REGISTRY}/${PROJECT_NAME}-frontend-minimal:${VERSION}"
    fi
}

# Handle script arguments
case "${1:-build}" in
    "build")
        main
        ;;
    "test")
        SKIP_TESTS=false
        main
        ;;
    "minimal")
        BUILD_MINIMAL=true
        main
        ;;
    "fullstack")
        BUILD_FULLSTACK=true
        main
        ;;
    "multi-arch")
        MULTI_ARCH=true
        main
        ;;
    "all")
        BUILD_MINIMAL=true
        BUILD_FULLSTACK=true
        MULTI_ARCH=true
        main
        ;;
    "clean")
        cleanup
        ;;
    *)
        echo "Usage: $0 [build|test|minimal|fullstack|multi-arch|all|clean]"
        echo ""
        echo "Commands:"
        echo "  build     - Build production images (default)"
        echo "  test      - Build and test images"
        echo "  minimal   - Build minimal production images"
        echo "  fullstack - Build full-stack single container image"
        echo "  multi-arch- Build multi-architecture images"
        echo "  all       - Build all variants with multi-arch support"
        echo "  clean     - Clean up Docker resources"
        echo ""
        echo "Environment variables:"
        echo "  VERSION         - Build version (default: timestamp)"
        echo "  DOCKER_REGISTRY - Docker registry (default: localhost:5000)"
        echo "  MULTI_ARCH      - Enable multi-architecture builds (default: false)"
        echo "  BUILD_MINIMAL   - Build minimal images (default: false)"
        echo "  BUILD_FULLSTACK - Build fullstack image (default: false)"
        echo "  SKIP_TESTS      - Skip image testing (default: false)"
        echo "  CLEANUP         - Run cleanup after build (default: true)"
        exit 1
        ;;
esac
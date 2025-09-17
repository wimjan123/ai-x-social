#!/bin/bash

# AI Social Media Platform - Database Backup Script
# Production PostgreSQL backup automation
# This script runs inside the db-backup container

set -euo pipefail

# Configuration
POSTGRES_HOST="${POSTGRES_HOST:-postgres}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_DB="${POSTGRES_DB:-ai_social_db}"
POSTGRES_USER="${POSTGRES_USER:-ai_social_user}"
BACKUP_DIR="${BACKUP_DIR:-/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Error handling
handle_error() {
    log "ERROR: Backup failed on line $1"
    exit 1
}

trap 'handle_error $LINENO' ERR

# Main backup function
perform_backup() {
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local backup_file="${BACKUP_DIR}/ai_social_backup_${timestamp}.sql"
    local compressed_file="${backup_file}.gz"

    log "Starting database backup..."
    log "Host: ${POSTGRES_HOST}:${POSTGRES_PORT}"
    log "Database: ${POSTGRES_DB}"
    log "Backup file: ${compressed_file}"

    # Create backup directory if it doesn't exist
    mkdir -p "${BACKUP_DIR}"

    # Perform database dump
    log "Creating database dump..."
    PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump \
        --host="${POSTGRES_HOST}" \
        --port="${POSTGRES_PORT}" \
        --username="${POSTGRES_USER}" \
        --dbname="${POSTGRES_DB}" \
        --verbose \
        --clean \
        --create \
        --if-exists \
        --format=plain \
        --no-owner \
        --no-privileges \
        > "${backup_file}"

    # Compress backup
    log "Compressing backup..."
    gzip "${backup_file}"

    # Verify backup
    log "Verifying backup integrity..."
    if ! gzip -t "${compressed_file}"; then
        log "ERROR: Backup file is corrupted"
        rm -f "${compressed_file}"
        exit 1
    fi

    # Get backup size
    local backup_size=$(du -h "${compressed_file}" | cut -f1)
    log "Backup completed successfully: ${compressed_file} (${backup_size})"

    # Clean up old backups
    cleanup_old_backups

    log "Backup process finished"
}

# Cleanup old backups
cleanup_old_backups() {
    log "Cleaning up backups older than ${RETENTION_DAYS} days..."

    find "${BACKUP_DIR}" \
        -name "ai_social_backup_*.sql.gz" \
        -type f \
        -mtime +${RETENTION_DAYS} \
        -exec rm -f {} \;

    local remaining_count=$(find "${BACKUP_DIR}" -name "ai_social_backup_*.sql.gz" -type f | wc -l)
    log "Cleanup completed. ${remaining_count} backup files remaining."
}

# Restore function (for manual restore operations)
restore_backup() {
    local backup_file="$1"

    if [[ ! -f "${backup_file}" ]]; then
        log "ERROR: Backup file ${backup_file} not found"
        exit 1
    fi

    log "WARNING: This will replace the current database with the backup"
    log "Backup file: ${backup_file}"

    # Decompress if needed
    if [[ "${backup_file}" == *.gz ]]; then
        log "Decompressing backup..."
        gunzip -c "${backup_file}" | PGPASSWORD="${POSTGRES_PASSWORD}" psql \
            --host="${POSTGRES_HOST}" \
            --port="${POSTGRES_PORT}" \
            --username="${POSTGRES_USER}" \
            --dbname="${POSTGRES_DB}"
    else
        log "Restoring from uncompressed backup..."
        PGPASSWORD="${POSTGRES_PASSWORD}" psql \
            --host="${POSTGRES_HOST}" \
            --port="${POSTGRES_PORT}" \
            --username="${POSTGRES_USER}" \
            --dbname="${POSTGRES_DB}" \
            < "${backup_file}"
    fi

    log "Restore completed"
}

# List available backups
list_backups() {
    log "Available backups in ${BACKUP_DIR}:"
    find "${BACKUP_DIR}" -name "ai_social_backup_*.sql.gz" -type f -exec ls -lh {} \; | sort
}

# Health check for backup system
health_check() {
    log "Performing backup system health check..."

    # Check if backup directory is accessible
    if [[ ! -d "${BACKUP_DIR}" ]]; then
        log "ERROR: Backup directory ${BACKUP_DIR} is not accessible"
        exit 1
    fi

    # Check if we can connect to database
    if ! PGPASSWORD="${POSTGRES_PASSWORD}" pg_isready \
        --host="${POSTGRES_HOST}" \
        --port="${POSTGRES_PORT}" \
        --username="${POSTGRES_USER}" \
        --dbname="${POSTGRES_DB}" > /dev/null 2>&1; then
        log "ERROR: Cannot connect to database"
        exit 1
    fi

    # Check available disk space (warn if less than 1GB)
    local available_space=$(df "${BACKUP_DIR}" | awk 'NR==2 {print $4}')
    if [[ ${available_space} -lt 1048576 ]]; then # 1GB in KB
        log "WARNING: Less than 1GB of disk space available for backups"
    fi

    log "Health check completed successfully"
}

# Scheduled backup function (runs via cron)
scheduled_backup() {
    log "Starting scheduled backup process..."

    # Perform health check first
    if ! health_check > /dev/null 2>&1; then
        log "ERROR: Health check failed, skipping backup"
        exit 1
    fi

    # Perform backup
    perform_backup
}

# Main script logic
main() {
    case "${1:-backup}" in
        "backup")
            perform_backup
            ;;
        "scheduled")
            scheduled_backup
            ;;
        "restore")
            if [[ -z "${2:-}" ]]; then
                log "ERROR: Please specify backup file to restore"
                log "Usage: $0 restore <backup_file>"
                exit 1
            fi
            restore_backup "$2"
            ;;
        "list")
            list_backups
            ;;
        "health")
            health_check
            ;;
        "help"|"-h"|"--help")
            echo "AI Social Media Platform - Database Backup Tool"
            echo
            echo "Usage: $0 [command] [options]"
            echo
            echo "Commands:"
            echo "  backup     - Perform immediate backup (default)"
            echo "  scheduled  - Perform scheduled backup with health check"
            echo "  restore    - Restore from backup file"
            echo "  list       - List available backups"
            echo "  health     - Check backup system health"
            echo "  help       - Show this help message"
            echo
            echo "Environment Variables:"
            echo "  POSTGRES_HOST      - Database host (default: postgres)"
            echo "  POSTGRES_PORT      - Database port (default: 5432)"
            echo "  POSTGRES_DB        - Database name"
            echo "  POSTGRES_USER      - Database user"
            echo "  POSTGRES_PASSWORD  - Database password"
            echo "  BACKUP_DIR         - Backup directory (default: /backups)"
            echo "  RETENTION_DAYS     - Backup retention in days (default: 30)"
            echo
            echo "Examples:"
            echo "  $0 backup"
            echo "  $0 restore /backups/ai_social_backup_20231201_120000.sql.gz"
            echo "  $0 list"
            ;;
        *)
            log "ERROR: Unknown command: $1"
            log "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
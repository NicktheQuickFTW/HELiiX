#!/bin/bash

# Git automation script with multiple modes
# Usage: ./git-automation.sh [mode] [options]
# Modes: watch, cron, quick, smart

MODE=${1:-smart}
WATCH_INTERVAL=${2:-300} # Default 5 minutes for watch mode

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Functions
status() { echo -e "${GREEN}[GIT-AUTO]${NC} $1"; }
info() { echo -e "${BLUE}[INFO]${NC} $1"; }
warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Smart commit message generator
generate_commit_message() {
    local changed_files=$(git diff --staged --name-only | wc -l)
    local file_types=$(git diff --staged --name-only | sed 's/.*\.//' | sort | uniq | tr '\n' ', ' | sed 's/,$//')
    local main_changes=$(git diff --staged --name-status | head -5)
    
    echo "Auto-update: $changed_files files changed

Types: $file_types
Main changes:
$main_changes

🤖 Automated commit at $(date '+%Y-%m-%d %H:%M:%S')"
}

# Check if in git repo
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        error "Not in a git repository!"
        exit 1
    fi
}

# Auto commit and push function
auto_commit_push() {
    check_git_repo
    
    # Check for changes
    if [[ -z $(git status -s) ]]; then
        info "No changes to commit"
        return 0
    fi
    
    # Add all changes
    git add -A
    
    # Generate and apply commit
    local commit_msg=$(generate_commit_message)
    git commit -m "$commit_msg"
    
    # Push with retry logic
    local retry=0
    while [ $retry -lt 3 ]; do
        if git push; then
            status "Successfully pushed to remote!"
            break
        else
            ((retry++))
            if [ $retry -lt 3 ]; then
                warning "Push failed, retrying in 5 seconds... (attempt $retry/3)"
                sleep 5
                git pull --rebase
            else
                error "Failed to push after 3 attempts"
                return 1
            fi
        fi
    done
}

# Quick commit with custom message
quick_commit() {
    local message="${2:-Quick update}"
    check_git_repo
    
    git add -A
    git commit -m "$message

🤖 Generated with git-automation script"
    git push
}

# Watch mode - commit when files change
watch_mode() {
    status "Starting watch mode (checking every $WATCH_INTERVAL seconds)"
    info "Press Ctrl+C to stop"
    
    while true; do
        if [[ -n $(git status -s) ]]; then
            status "Changes detected!"
            auto_commit_push
        fi
        sleep $WATCH_INTERVAL
    done
}

# Setup cron job
setup_cron() {
    local script_path=$(realpath "$0")
    local cron_schedule="${2:-*/30 * * * *}" # Default: every 30 minutes
    
    # Add to crontab
    (crontab -l 2>/dev/null; echo "$cron_schedule cd $(pwd) && $script_path smart > /dev/null 2>&1") | crontab -
    
    status "Cron job added: $cron_schedule"
    info "View with: crontab -l"
    info "Remove with: crontab -e"
}

# Main logic
case $MODE in
    watch)
        watch_mode
        ;;
    cron)
        setup_cron "$@"
        ;;
    quick)
        quick_commit "$@"
        ;;
    smart|auto)
        auto_commit_push
        ;;
    help|--help|-h)
        echo "Git Automation Script"
        echo "Usage: $0 [mode] [options]"
        echo ""
        echo "Modes:"
        echo "  smart    - Smart auto-commit and push (default)"
        echo "  watch    - Watch for changes and auto-commit"
        echo "  cron     - Setup cron job for periodic commits"
        echo "  quick    - Quick commit with message"
        echo ""
        echo "Examples:"
        echo "  $0                    # Smart commit and push"
        echo "  $0 watch 60          # Watch mode, check every 60 seconds"
        echo "  $0 cron '0 * * * *' # Cron job every hour"
        echo "  $0 quick 'Fix bug'  # Quick commit with message"
        ;;
    *)
        error "Unknown mode: $MODE"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
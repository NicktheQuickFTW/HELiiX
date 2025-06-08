#!/bin/bash

# Auto commit and push script for HELiiX

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display status
status() {
    echo -e "${GREEN}[AUTO-GIT]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    error "Not in a git repository!"
    exit 1
fi

# Check for changes
if [[ -z $(git status -s) ]]; then
    status "No changes to commit"
    exit 0
fi

# Show current status
status "Current git status:"
git status -s

# Add all changes
status "Staging all changes..."
git add -A

# Generate commit message with timestamp
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
COMMIT_MSG="Auto-commit: $TIMESTAMP

Changes:
$(git diff --staged --name-status | head -20)

🤖 Automated commit"

# Commit changes
status "Committing changes..."
git commit -m "$COMMIT_MSG"

# Push to remote
status "Pushing to remote..."
if git push; then
    status "Successfully pushed to remote!"
else
    error "Failed to push. You may need to pull first or resolve conflicts."
    exit 1
fi

status "Auto-commit completed successfully!"
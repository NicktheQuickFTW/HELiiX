---
name: pushall
description: FlexTime Push All Command
---

# FlexTime Push All Command

**Usage:** `pushall [commit_message]`  
**Purpose:** Commits and pushes all project changes with optional custom message

## Command Overview

### 🚀 FlexTime - Commit and Push All Changes

**Features:**
- Validates git repository status
- Checks for uncommitted changes
- Shows current git status
- Accepts custom commit messages
- Uses default Claude Code commit format
- Performs git add, commit, and push operations

## Usage Examples

### Basic Usage (Default Message)
```bash
pushall
```

### Custom Commit Message
```bash
pushall "feat: implement new basketball scheduling algorithm"
```

## Default Commit Message Format

When no custom message is provided, uses:

```
feat: update FlexTime project files

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Operation Flow

1. **Repository Validation**
   - Checks if current directory is a git repository
   - Exits with error if not in git repo

2. **Change Detection**
   - Checks for uncommitted changes using `git status --porcelain`
   - Exits successfully if no changes found

3. **Status Display**
   - Shows current git status with `git status --short`
   - Displays the commit message to be used

4. **Git Operations**
   - `git add .` - Stages all changes
   - `git commit -m "message"` - Commits with provided/default message
   - `git push` - Pushes to remote repository

5. **Error Handling**
   - Validates each git operation
   - Provides clear success/failure messages
   - Exits with appropriate error codes

## Exit Codes

- `0` - Success (no changes or successful push)
- `1` - Error (not in git repo, commit failed, or push failed)

## Implementation Features

- **Safety Checks**: Validates git repository and change status
- **Flexible Messaging**: Supports custom commit messages
- **Clear Feedback**: Provides step-by-step operation status
- **Error Handling**: Graceful failure with descriptive messages
- **Claude Code Integration**: Default commit message follows Claude Code standards

This command streamlines the git workflow for FlexTime development, ensuring consistent commit formatting and efficient change deployment.
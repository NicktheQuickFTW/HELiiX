#!/bin/bash

# Agent OS Global Installation Script
# This script installs Agent OS globally for system-wide access

set -e  # Exit on error

# Check if running with appropriate permissions
if [[ $EUID -ne 0 ]] && [[ "$1" != "--user-global" ]]; then
   echo "⚠️  This script needs to be run with sudo for system-wide installation"
   echo ""
   echo "Options:"
   echo "  sudo $0              - Install system-wide to /usr/local/share/agent-os"
   echo "  $0 --user-global     - Install to user's global config directory"
   echo ""
   exit 1
fi

echo "🚀 Agent OS Global Installation"
echo "==============================="
echo ""

# Determine installation directory
if [[ "$1" == "--user-global" ]]; then
    # User-global installation (no sudo required)
    INSTALL_BASE="$HOME/.config/agent-os"
    CLAUDE_BASE="$HOME/.config/claude"
    echo "📍 Installing to user-global directories:"
    echo "   $INSTALL_BASE"
    echo "   $CLAUDE_BASE"
else
    # System-wide installation
    INSTALL_BASE="/usr/local/share/agent-os"
    CLAUDE_BASE="/usr/local/share/claude"
    echo "📍 Installing system-wide to:"
    echo "   $INSTALL_BASE"
    echo "   $CLAUDE_BASE"
fi

# Base URL for raw GitHub content
BASE_URL="https://raw.githubusercontent.com/buildermethods/agent-os/main"

# Create directories
echo ""
echo "📁 Creating directories..."
mkdir -p "$INSTALL_BASE/standards/code-style"
mkdir -p "$INSTALL_BASE/instructions"
mkdir -p "$CLAUDE_BASE/commands"
mkdir -p "$CLAUDE_BASE/agents"

# Function to download with progress
download_file() {
    local url=$1
    local dest=$2
    local name=$(basename "$dest")
    
    echo -n "  Downloading $name... "
    if curl -s -o "$dest" "$url"; then
        echo "✓"
    else
        echo "✗ Failed"
        return 1
    fi
}

# Download standards files
echo ""
echo "📥 Downloading standards files..."
download_file "${BASE_URL}/standards/tech-stack.md" "$INSTALL_BASE/standards/tech-stack.md"
download_file "${BASE_URL}/standards/code-style.md" "$INSTALL_BASE/standards/code-style.md"
download_file "${BASE_URL}/standards/best-practices.md" "$INSTALL_BASE/standards/best-practices.md"

# Download code-style files
echo ""
echo "📥 Downloading code style files..."
for style in css-style html-style javascript-style; do
    download_file "${BASE_URL}/standards/code-style/${style}.md" "$INSTALL_BASE/standards/code-style/${style}.md"
done

# Download instruction files
echo ""
echo "📥 Downloading instruction files..."
for inst in plan-product create-spec execute-tasks execute-task analyze-product; do
    download_file "${BASE_URL}/instructions/${inst}.md" "$INSTALL_BASE/instructions/${inst}.md"
done

# Download Claude Code commands
echo ""
echo "📥 Downloading Claude Code commands..."
for cmd in plan-product create-spec execute-tasks analyze-product; do
    download_file "${BASE_URL}/commands/${cmd}.md" "$CLAUDE_BASE/commands/${cmd}.md"
done

# Download Claude Code agents
echo ""
echo "📥 Downloading Claude Code agents..."
for agent in test-runner context-fetcher git-workflow file-creator; do
    download_file "${BASE_URL}/claude-code/agents/${agent}.md" "$CLAUDE_BASE/agents/${agent}.md"
done

# Download Claude configuration
echo ""
echo "📥 Downloading Claude configuration..."
download_file "${BASE_URL}/claude-code/user/CLAUDE.md" "$CLAUDE_BASE/CLAUDE.md"

# Create symlinks in user's home directory
echo ""
echo "🔗 Creating symlinks for user access..."

# Function to create symlink with backup
create_symlink() {
    local source=$1
    local target=$2
    
    if [ -e "$target" ] || [ -L "$target" ]; then
        if [ -L "$target" ]; then
            echo "  ⚠️  Removing existing symlink: $target"
            rm "$target"
        else
            echo "  ⚠️  Backing up existing file: $target"
            mv "$target" "${target}.backup-$(date +%Y%m%d-%H%M%S)"
        fi
    fi
    
    ln -s "$source" "$target"
    echo "  ✓ Linked: $target → $source"
}

# Create symlinks for Agent OS
if [ ! -d "$HOME/.agent-os" ]; then
    create_symlink "$INSTALL_BASE" "$HOME/.agent-os"
else
    echo "  ⚠️  ~/.agent-os exists - creating individual symlinks"
    
    # Symlink subdirectories
    create_symlink "$INSTALL_BASE/standards" "$HOME/.agent-os/standards"
    create_symlink "$INSTALL_BASE/instructions" "$HOME/.agent-os/instructions"
fi

# Create symlinks for Claude
if [ ! -d "$HOME/.claude" ]; then
    create_symlink "$CLAUDE_BASE" "$HOME/.claude"
else
    echo "  ⚠️  ~/.claude exists - creating individual symlinks"
    
    # Symlink subdirectories
    create_symlink "$CLAUDE_BASE/commands" "$HOME/.claude/commands"
    create_symlink "$CLAUDE_BASE/agents" "$HOME/.claude/agents"
    
    # Special handling for CLAUDE.md
    if [ -f "$HOME/.claude/CLAUDE.md" ]; then
        echo ""
        echo "  ⚠️  Found existing ~/.claude/CLAUDE.md"
        echo "     The global CLAUDE.md is available at: $CLAUDE_BASE/CLAUDE.md"
        echo "     To use it, manually merge or replace your existing file"
    else
        create_symlink "$CLAUDE_BASE/CLAUDE.md" "$HOME/.claude/CLAUDE.md"
    fi
fi

# Create environment setup script
echo ""
echo "📝 Creating environment setup script..."

ENV_SCRIPT="$INSTALL_BASE/agent-os-env.sh"
cat > "$ENV_SCRIPT" << 'EOF'
#!/bin/bash
# Agent OS Environment Setup

export AGENT_OS_HOME="${AGENT_OS_HOME:-$INSTALL_BASE}"
export CLAUDE_HOME="${CLAUDE_HOME:-$CLAUDE_BASE}"

# Function to access Agent OS files globally
agent_os() {
    case "$1" in
        path)
            echo "$AGENT_OS_HOME"
            ;;
        claude)
            echo "$CLAUDE_HOME"
            ;;
        *)
            echo "Agent OS is installed at: $AGENT_OS_HOME"
            echo "Claude configs are at: $CLAUDE_HOME"
            ;;
    esac
}

# Alias for quick access
alias aos='agent_os'
EOF

# Replace variables in the script
sed -i.bak "s|\$INSTALL_BASE|$INSTALL_BASE|g" "$ENV_SCRIPT" && rm "${ENV_SCRIPT}.bak"
sed -i.bak "s|\$CLAUDE_BASE|$CLAUDE_BASE|g" "$ENV_SCRIPT" && rm "${ENV_SCRIPT}.bak"

chmod +x "$ENV_SCRIPT"

# Set appropriate permissions
echo ""
echo "🔒 Setting permissions..."
if [[ "$1" != "--user-global" ]]; then
    # Make files readable by all users
    chmod -R 755 "$INSTALL_BASE"
    chmod -R 755 "$CLAUDE_BASE"
fi

echo ""
echo "✅ Agent OS global installation complete!"
echo ""
echo "📍 Installation locations:"
echo "   Agent OS: $INSTALL_BASE"
echo "   Claude:   $CLAUDE_BASE"
echo ""
echo "🔗 User symlinks created:"
echo "   ~/.agent-os → $INSTALL_BASE"
echo "   ~/.claude → $CLAUDE_BASE"
echo ""

if [[ "$1" == "--user-global" ]]; then
    echo "💡 To add Agent OS to your shell environment, add this to your ~/.bashrc or ~/.zshrc:"
    echo ""
    echo "   source $ENV_SCRIPT"
else
    echo "💡 For system-wide access, add this to /etc/profile.d/agent-os.sh:"
    echo ""
    echo "   sudo cp $ENV_SCRIPT /etc/profile.d/agent-os.sh"
    echo ""
    echo "Or for individual users, add to ~/.bashrc or ~/.zshrc:"
    echo ""
    echo "   source $ENV_SCRIPT"
fi

echo ""
echo "This will provide:"
echo "  - agent_os command for quick access to paths"
echo "  - aos alias for agent_os"
echo "  - Environment variables AGENT_OS_HOME and CLAUDE_HOME"
echo ""
echo "🎯 Agent OS Commands now available:"
echo "  /plan-product     - Plan a new product"
echo "  /analyze-product  - Analyze existing codebase"
echo "  /create-spec      - Create feature specifications"
echo "  /execute-task     - Execute development tasks"
echo ""
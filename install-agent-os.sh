#!/bin/bash

# Agent OS Base Installation Script
# This script installs the base Agent OS files needed before Claude Code setup

set -e  # Exit on error

echo "🚀 Agent OS Base Installation"
echo "============================="
echo ""

# Base URL for raw GitHub content
BASE_URL="https://raw.githubusercontent.com/buildermethods/agent-os/main"

# Create directories
echo "📁 Creating Agent OS directories..."
mkdir -p "$HOME/.agent-os/instructions"
mkdir -p "$HOME/.agent-os/standards"
mkdir -p "$HOME/.agent-os/standards/code-style"
mkdir -p "$HOME/.agent-os/product"

# Download instruction files
echo ""
echo "📥 Downloading instruction files..."

instructions=("analyze-product" "create-spec" "execute-task" "execute-tasks" "plan-product")
for inst in "${instructions[@]}"; do
    echo "  Downloading ${inst}.md..."
    curl -s -o "$HOME/.agent-os/instructions/${inst}.md" "${BASE_URL}/instructions/${inst}.md"
    echo "  ✓ ~/.agent-os/instructions/${inst}.md"
done

# Download standards files
echo ""
echo "📥 Downloading standards files..."

standards=("best-practices" "code-style" "tech-stack")
for std in "${standards[@]}"; do
    echo "  Downloading ${std}.md..."
    curl -s -o "$HOME/.agent-os/standards/${std}.md" "${BASE_URL}/standards/${std}.md"
    echo "  ✓ ~/.agent-os/standards/${std}.md"
done

# Download code style files
echo ""
echo "📥 Downloading code style files..."

codestyles=("css-style" "js-style" "python-style" "ruby-style" "general-style")
for style in "${codestyles[@]}"; do
    if curl -s --head "${BASE_URL}/standards/code-style/${style}.md" | head -n 1 | grep -q "200"; then
        echo "  Downloading ${style}.md..."
        curl -s -o "$HOME/.agent-os/standards/code-style/${style}.md" "${BASE_URL}/standards/code-style/${style}.md"
        echo "  ✓ ~/.agent-os/standards/code-style/${style}.md"
    fi
done

echo ""
echo "✅ Agent OS base installation complete!"
echo ""
echo "📍 Base files installed to:"
echo "   ~/.agent-os/instructions/  - Core workflow instructions"
echo "   ~/.agent-os/standards/     - Development standards"
echo "   ~/.agent-os/product/       - Product documentation (to be added)"
echo ""
echo "Next step: Run the Claude Code setup script"
echo ""

# Now run the Claude Code setup
echo "🚀 Agent OS Claude Code Setup"
echo "============================="
echo ""

# Create Claude directories
echo "📁 Creating Claude directories..."
mkdir -p "$HOME/.claude/commands"
mkdir -p "$HOME/.claude/agents"

# Download command files for Claude Code
echo ""
echo "📥 Downloading Claude Code command files..."

for cmd in plan-product create-spec execute-tasks analyze-product; do
    if [ -f "$HOME/.claude/commands/${cmd}.md" ]; then
        echo "  ⚠️  ~/.claude/commands/${cmd}.md already exists - skipping"
    else
        curl -s -o "$HOME/.claude/commands/${cmd}.md" "${BASE_URL}/commands/${cmd}.md"
        echo "  ✓ ~/.claude/commands/${cmd}.md"
    fi
done

# Download Claude Code user CLAUDE.md
echo ""
echo "📥 Downloading Claude Code configuration..."

if [ -f "$HOME/.claude/CLAUDE.md" ]; then
    echo "  ⚠️  ~/.claude/CLAUDE.md already exists - backing up"
    mv "$HOME/.claude/CLAUDE.md" "$HOME/.claude/CLAUDE.md.backup"
fi

curl -s -o "$HOME/.claude/CLAUDE.md" "${BASE_URL}/claude-code/user/CLAUDE.md"
echo "  ✓ ~/.claude/CLAUDE.md"

# Download Claude Code agents
echo ""
echo "📥 Downloading Claude Code subagents..."

agents=("test-runner" "context-fetcher" "git-workflow" "file-creator")
for agent in "${agents[@]}"; do
    if [ -f "$HOME/.claude/agents/${agent}.md" ]; then
        echo "  ⚠️  ~/.claude/agents/${agent}.md already exists - skipping"
    else
        curl -s -o "$HOME/.claude/agents/${agent}.md" "${BASE_URL}/claude-code/agents/${agent}.md"
        echo "  ✓ ~/.claude/agents/${agent}.md"
    fi
done

echo ""
echo "✅ Agent OS Claude Code installation complete!"
echo ""
echo "📍 Files installed:"
echo "   ~/.agent-os/              - Base Agent OS files"
echo "   ~/.claude/commands/       - Claude Code commands"
echo "   ~/.claude/agents/         - Claude Code specialized subagents"
echo "   ~/.claude/CLAUDE.md       - Claude Code configuration"
echo ""
echo "🎯 Next steps:"
echo ""
echo "1. In a new product codebase:"
echo "   /plan-product"
echo ""
echo "2. In an existing codebase:"
echo "   /analyze-product"
echo ""
echo "3. Create a new feature:"
echo "   /create-spec (or ask 'what's next?')"
echo ""
echo "4. Execute tasks:"
echo "   /execute-task"
echo ""
echo "Learn more at https://buildermethods.com/agent-os"
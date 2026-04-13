#!/bin/bash
# Automatic code formatting hook for PostToolUse
# Runs after Write|Edit operations

# Read JSON from stdin
INPUT=$(cat)

# Extract file path from the tool result
# PostToolUse receives: {"tool_name": "...", "tool_input": {...}, "tool_result": {...}}
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty' 2>/dev/null)

if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
    exit 0
fi

# Get file extension
EXT="${FILE_PATH##*.}"

# Format based on file type
case "$EXT" in
    js|jsx|ts|tsx|json|md|css|scss|html)
        # Use prettier for web files
        npx prettier --write "$FILE_PATH" 2>/dev/null || true
        ;;
    py)
        # Use black for Python (if available)
        black "$FILE_PATH" 2>/dev/null || true
        ;;
esac

exit 0

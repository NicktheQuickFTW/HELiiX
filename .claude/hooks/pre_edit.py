#!/usr/bin/env python3
"""
Pre-Edit Hook for FlexTime
Validates files and creates backups before editing
"""

import json
import sys
import os
from pathlib import Path
from datetime import datetime
from typing import Any, Dict
import shutil


def ensure_backup_dir() -> Path:
    """Ensure backup directory exists"""
    backup_dir = Path(".claude/backups")
    backup_dir.mkdir(parents=True, exist_ok=True)
    return backup_dir


def create_backup(file_path: str) -> str:
    """Create backup of file before editing"""
    if not os.path.exists(file_path):
        return ""

    backup_dir = ensure_backup_dir()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_name = Path(file_path).name
    backup_name = f"{file_name}.{timestamp}.bak"
    backup_path = backup_dir / backup_name

    try:
        shutil.copy2(file_path, backup_path)
        return str(backup_path)
    except Exception as e:
        print(f"Backup failed: {e}", file=sys.stderr)
        return ""


def check_file_conflicts(file_path: str) -> bool:
    """Check if file has git merge conflicts"""
    if not os.path.exists(file_path):
        return False

    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            return '<<<<<<< ' in content or '=======' in content or '>>>>>>> ' in content
    except Exception:
        return False


def is_critical_file(file_path: str) -> bool:
    """Check if file is critical (env, config, etc.)"""
    critical_patterns = ['.env', 'config', 'settings', 'secrets', 'credentials']
    file_lower = file_path.lower()
    return any(pattern in file_lower for pattern in critical_patterns)


def main():
    """Main hook execution"""
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        file_path = input_data.get("file", "")

        warnings = []
        backup_path = ""

        # Create backup for critical files
        if file_path and is_critical_file(file_path):
            backup_path = create_backup(file_path)
            if backup_path:
                warnings.append(f"Critical file - backup created: {backup_path}")

        # Check for merge conflicts
        has_conflicts = check_file_conflicts(file_path)
        if has_conflicts:
            warnings.append("⚠️ File contains merge conflict markers")

        # Always allow edit to continue
        output = {
            "continue": True,
            "file": file_path,
            "backupCreated": bool(backup_path),
            "backupPath": backup_path,
            "hasConflicts": has_conflicts,
            "warnings": warnings
        }

        print(json.dumps(output))

    except Exception as e:
        print(f"Hook error: {e}", file=sys.stderr)
        # Always allow edit even on hook failure
        print(json.dumps({"continue": True}))


if __name__ == "__main__":
    main()

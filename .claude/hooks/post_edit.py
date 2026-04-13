#!/usr/bin/env python3
"""
Post-Edit Hook for FlexTime
Formats code and runs linting after file edits
"""

import json
import sys
import os
import subprocess
from pathlib import Path
from typing import Any, Dict, List, Optional


def get_file_extension(file_path: str) -> str:
    """Get file extension"""
    return Path(file_path).suffix.lower()


def format_javascript(file_path: str) -> tuple[bool, str]:
    """Format JavaScript/TypeScript files with Prettier"""
    try:
        result = subprocess.run(
            ["npx", "prettier", "--write", file_path],
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.returncode == 0, "prettier"
    except Exception as e:
        return False, f"prettier (error: {e})"


def format_python(file_path: str) -> tuple[bool, str]:
    """Format Python files with Black"""
    try:
        result = subprocess.run(
            ["black", file_path],
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.returncode == 0, "black"
    except FileNotFoundError:
        # Black not installed, skip
        return True, "none (black not installed)"
    except Exception as e:
        return False, f"black (error: {e})"


def run_eslint(file_path: str) -> tuple[bool, List[str]]:
    """Run ESLint on JavaScript/TypeScript files"""
    try:
        result = subprocess.run(
            ["npx", "eslint", "--fix", file_path],
            capture_output=True,
            text=True,
            timeout=30
        )
        warnings = []
        if result.stdout:
            warnings.append(result.stdout.strip())
        return result.returncode == 0, warnings
    except Exception as e:
        return True, [f"ESLint error: {e}"]


def auto_format_file(file_path: str) -> Dict[str, Any]:
    """Auto-format file based on extension"""
    ext = get_file_extension(file_path)

    # JavaScript/TypeScript
    if ext in ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']:
        formatted, formatter = format_javascript(file_path)
        lint_passed, warnings = run_eslint(file_path)
        return {
            "formatted": formatted,
            "formatter": formatter,
            "lintPassed": lint_passed,
            "warnings": warnings
        }

    # Python
    elif ext == '.py':
        formatted, formatter = format_python(file_path)
        return {
            "formatted": formatted,
            "formatter": formatter,
            "lintPassed": True,
            "warnings": []
        }

    # JSON
    elif ext == '.json':
        formatted, formatter = format_javascript(file_path)
        return {
            "formatted": formatted,
            "formatter": formatter,
            "lintPassed": True,
            "warnings": []
        }

    # Unsupported type
    else:
        return {
            "formatted": False,
            "formatter": "none (unsupported file type)",
            "lintPassed": True,
            "warnings": []
        }


def count_file_changes(file_path: str) -> Dict[str, int]:
    """Count lines changed (simplified)"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
            return {
                "totalLines": len(lines),
                "fileSize": os.path.getsize(file_path)
            }
    except Exception:
        return {"totalLines": 0, "fileSize": 0}


def main():
    """Main hook execution"""
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        file_path = input_data.get("file", "")

        if not file_path or not os.path.exists(file_path):
            print(json.dumps({"formatted": False, "error": "File not found"}))
            return

        # Auto-format the file
        format_result = auto_format_file(file_path)

        # Count changes
        stats = count_file_changes(file_path)

        # Build output
        output = {
            "file": file_path,
            "formatted": format_result.get("formatted", False),
            "formatterUsed": format_result.get("formatter", "none"),
            "lintPassed": format_result.get("lintPassed", True),
            "warnings": format_result.get("warnings", []),
            "stats": stats
        }

        print(json.dumps(output))

    except Exception as e:
        print(f"Hook error: {e}", file=sys.stderr)
        print(json.dumps({"formatted": False, "error": str(e)}))


if __name__ == "__main__":
    main()

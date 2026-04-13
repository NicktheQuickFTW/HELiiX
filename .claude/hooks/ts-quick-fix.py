#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "pydantic>=1.10,<2.0",
# ]
# ///
"""
TypeScript Quick Fix Hook for FlexTime
Quickly fixes common TypeScript patterns and errors
"""

import json
import sys
import os
import subprocess
import re
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional, List

from pydantic import BaseModel, Field


class TSQuickFixInput(BaseModel):
    """Input schema for TypeScript Quick Fix hook"""
    file_path: Optional[str] = Field(None, description="Specific file to fix")
    fix_type: Optional[str] = Field(None, description="Type of fix to apply")
    session_id: Optional[str] = Field(None, description="Session ID")


class HookDecision(BaseModel):
    """Decision output for hook"""
    decision: Optional[str] = Field(None, description="block or undefined")
    reason: Optional[str] = Field(None, description="Reason for decision")
    continue_: bool = Field(True, alias="continue")
    suppressOutput: bool = False


class TypeScriptFixer:
    """TypeScript quick fix utility"""
    
    def __init__(self):
        self.project_root = Path("/Users/nickw/Documents/GitHub/Flextime")
        self.frontend_root = self.project_root / "web"
        self.log_file = self.project_root / "logs" / "ts-quick-fix.json"
        self.ensure_log_dir()
    
    def ensure_log_dir(self) -> None:
        """Ensure log directory exists"""
        self.log_file.parent.mkdir(parents=True, exist_ok=True)
    
    def log(self, message: str, level: str = "info") -> None:
        """Log message to JSON file"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": level,
            "message": message,
            "hook": "ts-quick-fix"
        }
        
        logs = []
        if self.log_file.exists():
            try:
                with open(self.log_file, 'r') as f:
                    content = f.read().strip()
                    if content:
                        logs = json.loads(content)
            except (json.JSONDecodeError, IOError):
                pass
        
        logs.append(log_entry)
        
        # Keep only last 100 entries
        if len(logs) > 100:
            logs = logs[-100:]
        
        with open(self.log_file, 'w') as f:
            json.dump(logs, f, indent=2)
    
    def find_ts_files(self, directory: Path) -> List[Path]:
        """Find all TypeScript files in directory"""
        files = []
        for ext in ["*.ts", "*.tsx"]:
            files.extend(directory.glob(f"**/{ext}"))
        return files
    
    def fix_violations_array(self, file_path: Path) -> int:
        """Fix untyped violations arrays"""
        fixes_count = 0
        
        try:
            content = file_path.read_text()
            original_content = content
            
            # Safety check: don't apply if already has typing
            if 'any[]' in content or 'string[]' in content or 'number[]' in content:
                return 0
            
            # Fix violations array typing
            patterns = [
                (r'const violations = \[\]', 'const violations: any[] = []'),
                (r'const errors = \[\]', 'const errors: any[] = []'),
                (r'const warnings = \[\]', 'const warnings: any[] = []'),
                (r'const results = \[\]', 'const results: any[] = []'),
            ]
            
            for pattern, replacement in patterns:
                # Check if pattern already exists before applying
                if not re.search(replacement.replace('[]', r'\[\]'), content):
                    new_content = re.sub(pattern, replacement, content)
                    if new_content != content:
                        fixes_count += len(re.findall(pattern, content))
                        content = new_content
            
            if content != original_content and fixes_count > 0:
                file_path.write_text(content)
                self.log(f"Fixed {fixes_count} violations array issues in {file_path}")
            
        except Exception as e:
            self.log(f"Error fixing violations in {file_path}: {e}", "error")
        
        return fixes_count
    
    def fix_never_types(self, file_path: Path) -> int:
        """Fix never type errors"""
        fixes_count = 0
        
        try:
            content = file_path.read_text()
            original_content = content
            
            # Safety check: don't apply if already has typing or React.FC patterns
            if ': any[]' in content or ': React.FC' in content:
                return 0
            
            # Fix common never type patterns - be more selective
            patterns = [
                (r'const ([a-z][a-zA-Z0-9_]*) = \[\]', r'const \1: any[] = []'),  # Only lowercase vars
                (r'let ([a-z][a-zA-Z0-9_]*) = \[\]', r'let \1: any[] = []'),      # Only lowercase vars
            ]
            
            for pattern, replacement in patterns:
                # Find matches first
                matches = re.findall(pattern, content)
                if matches:
                    # Check each match to avoid applying to React components
                    for match in matches:
                        if not match[0].isupper():  # Skip capitalized (likely components)
                            specific_pattern = pattern.replace(r'([a-z][a-zA-Z0-9_]*)', re.escape(match))
                            specific_replacement = replacement.replace(r'\1', match)
                            content = re.sub(specific_pattern, specific_replacement, content, count=1)
                            fixes_count += 1
            
            if content != original_content and fixes_count > 0:
                file_path.write_text(content)
                self.log(f"Fixed {fixes_count} never type issues in {file_path}")
            
        except Exception as e:
            self.log(f"Error fixing never types in {file_path}: {e}", "error")
        
        return fixes_count
    
    def fix_react_imports(self, file_path: Path) -> int:
        """Fix missing React imports"""
        fixes_count = 0
        
        try:
            if file_path.suffix != '.tsx':
                return 0
            
            content = file_path.read_text()
            
            # Check if React is used but not imported
            if (re.search(r'JSX\.|React\.', content) or '<' in content) and not re.search(r'import.*React', content):
                # Add React import at the top
                lines = content.split('\n')
                import_line = "import React from 'react';"
                
                # Find the right place to insert (after other imports or at the top)
                insert_index = 0
                for i, line in enumerate(lines):
                    if line.strip().startswith('import ') or line.strip().startswith('//'):
                        insert_index = i + 1
                    elif line.strip() and not line.strip().startswith('import '):
                        break
                
                lines.insert(insert_index, import_line)
                file_path.write_text('\n'.join(lines))
                fixes_count = 1
                self.log(f"Added React import to {file_path}")
        
        except Exception as e:
            self.log(f"Error fixing React imports in {file_path}: {e}", "error")
        
        return fixes_count
    
    def run_type_check(self) -> Dict[str, Any]:
        """Run TypeScript type check"""
        try:
            os.chdir(self.frontend_root)
            result = subprocess.run(
                ['pnpm', 'exec', 'tsc', '--noEmit', '--pretty'],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            return {
                "success": result.returncode == 0,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "returncode": result.returncode
            }
        except subprocess.TimeoutExpired:
            return {"success": False, "error": "Type check timed out"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def fix_file(self, file_path: Path, fix_type: Optional[str] = None) -> Dict[str, int]:
        """Fix a specific file"""
        fixes = {"violations": 0, "never_types": 0, "react_imports": 0}
        
        if not file_path.exists() or file_path.suffix not in ['.ts', '.tsx']:
            return fixes
        
        if fix_type == "violations" or fix_type is None:
            fixes["violations"] = self.fix_violations_array(file_path)
        
        if fix_type == "never" or fix_type is None:
            fixes["never_types"] = self.fix_never_types(file_path)
        
        if fix_type == "react" or fix_type is None:
            fixes["react_imports"] = self.fix_react_imports(file_path)
        
        return fixes
    
    def fix_all_files(self, fix_type: Optional[str] = None) -> Dict[str, Any]:
        """Fix all TypeScript files in the project"""
        total_fixes = {"violations": 0, "never_types": 0, "react_imports": 0}
        files_processed = 0
        
        self.log(f"Starting TypeScript fixes (type: {fix_type or 'all'})")
        
        ts_files = self.find_ts_files(self.frontend_root)
        
        for file_path in ts_files:
            fixes = self.fix_file(file_path, fix_type)
            files_processed += 1
            
            for key, value in fixes.items():
                total_fixes[key] += value
        
        # Run type check after fixes
        type_check = self.run_type_check()
        
        result = {
            "files_processed": files_processed,
            "total_fixes": total_fixes,
            "type_check": type_check
        }
        
        self.log(f"Completed fixes: {result}")
        return result


def main():
    """Main hook execution"""
    try:
        # Read input from stdin if available
        input_data = {}
        if not sys.stdin.isatty():
            try:
                input_data = json.loads(sys.stdin.read())
            except:
                pass
        
        # Parse command line arguments
        fix_type = None
        file_path = None
        
        if "--violations" in sys.argv:
            fix_type = "violations"
        elif "--never" in sys.argv:
            fix_type = "never"
        elif "--react" in sys.argv:
            fix_type = "react"
        elif "--check" in sys.argv:
            fix_type = "check"
        
        # Look for file path in args
        for arg in sys.argv[1:]:
            if not arg.startswith("--") and (arg.endswith(".ts") or arg.endswith(".tsx")):
                file_path = Path(arg)
                break
        
        # Initialize fixer
        fixer = TypeScriptFixer()
        
        if fix_type == "check":
            # Just run type check
            result = fixer.run_type_check()
            print(f"Type check: {'✅ Passed' if result['success'] else '❌ Failed'}")
            if not result['success']:
                print(result.get('stdout', ''))
        elif file_path:
            # Fix specific file
            result = fixer.fix_file(file_path, fix_type)
            total = sum(result.values())
            print(f"Applied {total} fixes to {file_path}")
        else:
            # Fix all files
            result = fixer.fix_all_files(fix_type)
            total = sum(result["total_fixes"].values())
            print(f"✅ Applied {total} fixes across {result['files_processed']} files")
            
            if result["type_check"]["success"]:
                print("✅ Type check passed!")
            else:
                print("❌ Type check failed - some issues remain")
        
        # Return hook decision
        output = HookDecision()
        print(json.dumps(output.dict(by_alias=True)))
        
    except Exception as e:
        print(f"Hook error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
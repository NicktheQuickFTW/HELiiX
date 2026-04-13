#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "pydantic>=1.10,<2.0",
# ]
# ///
"""
TypeScript Error Auto-Fixer Hook for FlexTime
Automatically fixes common TypeScript errors in the codebase
Usage: typescript-error-fixer [file_path] [error_message]
"""

import json
import sys
import os
import subprocess
import re
import shutil
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional, List, Tuple

from pydantic import BaseModel, Field


class TypeScriptErrorFixerInput(BaseModel):
    """Input schema for TypeScript Error Fixer hook"""
    file_path: Optional[str] = Field(None, description="File to fix")
    error_message: Optional[str] = Field(None, description="Error message to fix")
    session_id: Optional[str] = Field(None, description="Session ID")


class HookDecision(BaseModel):
    """Decision output for hook"""
    decision: Optional[str] = Field(None, description="block or undefined")
    reason: Optional[str] = Field(None, description="Reason for decision")
    continue_: bool = Field(True, alias="continue")
    suppressOutput: bool = False


class TypeScriptErrorFixer:
    """Advanced TypeScript error auto-fixer"""
    
    def __init__(self):
        self.project_root = Path("/Users/nickw/Documents/GitHub/Flextime")
        self.frontend_root = self.project_root / "web"  # Updated to new structure
        self.log_file = self.project_root / "logs" / "typescript-error-fixer.json"
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
            "hook": "typescript-error-fixer"
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
        
        # Keep only last 200 entries
        if len(logs) > 200:
            logs = logs[-200:]
        
        with open(self.log_file, 'w') as f:
            json.dump(logs, f, indent=2)
    
    def cleanup_old_backups(self, file_path: Path, keep_recent: int = 5) -> None:
        """Clean up old backup files, keeping only the most recent ones"""
        try:
            # Find all backup files for this file
            backup_pattern = f"{file_path.stem}*.backup.*"
            backup_files = list(file_path.parent.glob(backup_pattern))
            
            if len(backup_files) > keep_recent:
                # Sort by modification time (oldest first)
                backup_files.sort(key=lambda x: x.stat().st_mtime)
                
                # Remove all but the most recent backups
                files_to_remove = backup_files[:-keep_recent]
                for old_backup in files_to_remove:
                    try:
                        old_backup.unlink()
                        self.log(f"Removed old backup: {old_backup.name}")
                    except Exception as e:
                        self.log(f"Failed to remove backup {old_backup.name}: {e}", "warning")
        except Exception as e:
            self.log(f"Error during backup cleanup: {e}", "warning")
    
    def create_backup(self, file_path: Path) -> Path:
        """Create backup of file before modifying and clean up old backups"""
        timestamp = int(datetime.now().timestamp())
        backup_path = file_path.with_suffix(f"{file_path.suffix}.backup.{timestamp}")
        shutil.copy2(file_path, backup_path)
        self.log(f"Created backup: {backup_path}")
        
        # Clean up old backups
        self.cleanup_old_backups(file_path)
        
        return backup_path
    
    def fix_violations_array_typing(self, file_path: Path) -> int:
        """Fix violations array typing issues"""
        fixes_count = 0
        
        try:
            content = file_path.read_text()
            original_content = content
            
            patterns = [
                (r'const violations = \[\]', 'const violations: any[] = []'),
                (r'const errors = \[\]', 'const errors: any[] = []'),
                (r'const warnings = \[\]', 'const warnings: any[] = []'),
                (r'const results = \[\]', 'const results: any[] = []'),
                (r'const items = \[\]', 'const items: any[] = []'),
                (r'const data = \[\]', 'const data: any[] = []'),
                (r'const list = \[\]', 'const list: any[] = []'),
            ]
            
            for pattern, replacement in patterns:
                matches = re.findall(pattern, content)
                if matches:
                    content = re.sub(pattern, replacement, content)
                    fixes_count += len(matches)
            
            if content != original_content:
                file_path.write_text(content)
                self.log(f"Fixed {fixes_count} violations array typing issues in {file_path}")
            
        except Exception as e:
            self.log(f"Error fixing violations array typing in {file_path}: {e}", "error")
        
        return fixes_count
    
    def fix_never_type_errors(self, file_path: Path) -> int:
        """Fix never type errors"""
        fixes_count = 0
        
        try:
            content = file_path.read_text()
            original_content = content
            
            # Fix never type assignments
            patterns = [
                (r'const ([a-zA-Z_][a-zA-Z0-9_]*) = \[\]', r'const \1: any[] = []'),
                (r'let ([a-zA-Z_][a-zA-Z0-9_]*) = \[\]', r'let \1: any[] = []'),
                (r'var ([a-zA-Z_][a-zA-Z0-9_]*) = \[\]', r'var \1: any[] = []'),
            ]
            
            for pattern, replacement in patterns:
                matches = re.findall(pattern, content)
                if matches:
                    content = re.sub(pattern, replacement, content)
                    fixes_count += len(matches)
            
            if content != original_content:
                file_path.write_text(content)
                self.log(f"Fixed {fixes_count} never type errors in {file_path}")
            
        except Exception as e:
            self.log(f"Error fixing never type errors in {file_path}: {e}", "error")
        
        return fixes_count
    
    def fix_missing_return_types(self, file_path: Path) -> int:
        """Add missing return types to functions"""
        fixes_count = 0
        
        try:
            content = file_path.read_text()
            original_content = content
            
            # Fix async functions without return types
            async_pattern = r'async function ([^(]*)\('
            async_matches = re.findall(async_pattern, content)
            if async_matches:
                content = re.sub(
                    r'async function ([^(]*)\(',
                    r'async function \1(): Promise<any>(',
                    content
                )
                fixes_count += len(async_matches)
            
            # Fix regular functions without return types (be more selective)
            func_pattern = r'function ([^(]*)\(\s*\)\s*{'
            func_matches = re.findall(func_pattern, content)
            if func_matches:
                content = re.sub(
                    r'function ([^(]*)\(\s*\)\s*{',
                    r'function \1(): any {',
                    content
                )
                fixes_count += len(func_matches)
            
            if content != original_content:
                file_path.write_text(content)
                self.log(f"Fixed {fixes_count} missing return types in {file_path}")
            
        except Exception as e:
            self.log(f"Error fixing missing return types in {file_path}: {e}", "error")
        
        return fixes_count
    
    def fix_react_component_types(self, file_path: Path) -> int:
        """Fix React component return types"""
        fixes_count = 0
        
        try:
            if file_path.suffix != '.tsx':
                return 0
            
            content = file_path.read_text()
            original_content = content
            
            # Fix default export functions
            export_pattern = r'export default function ([^(]*)\('
            export_matches = re.findall(export_pattern, content)
            if export_matches:
                content = re.sub(
                    r'export default function ([^(]*)\(',
                    r'export default function \1(): JSX.Element {',
                    content
                )
                fixes_count += len(export_matches)
            
            # Fix React.FC patterns - only for component functions (capitalized)
            fc_pattern = r'const ([A-Z][a-zA-Z0-9_]*) = \([^)]*\) => \s*<'
            fc_matches = re.findall(fc_pattern, content)
            if fc_matches and 'React' in content:
                # Only apply React.FC to components that return JSX (contain <)
                for match in fc_matches:
                    if not f': React.FC' in content:  # Don't apply if already has React.FC
                        content = re.sub(
                            rf'const {match} = \(',
                            rf'const {match}: React.FC = (',
                            content,
                            count=1
                        )
                fixes_count += len(fc_matches)
            
            if content != original_content:
                file_path.write_text(content)
                self.log(f"Fixed {fixes_count} React component types in {file_path}")
            
        except Exception as e:
            self.log(f"Error fixing React component types in {file_path}: {e}", "error")
        
        return fixes_count
    
    def fix_property_access_errors(self, file_path: Path) -> int:
        """Fix property access errors"""
        fixes_count = 0
        
        try:
            content = file_path.read_text()
            original_content = content
            
            # Fix optional chaining for array access
            array_pattern = r'\.([a-zA-Z_][a-zA-Z0-9_]*)\[\]'
            array_matches = re.findall(array_pattern, content)
            if array_matches:
                content = re.sub(
                    r'\.([a-zA-Z_][a-zA-Z0-9_]*)\[\]',
                    r'.\1?[]',
                    content
                )
                fixes_count += len(array_matches)
            
            if content != original_content:
                file_path.write_text(content)
                self.log(f"Fixed {fixes_count} property access errors in {file_path}")
            
        except Exception as e:
            self.log(f"Error fixing property access errors in {file_path}: {e}", "error")
        
        return fixes_count
    
    def fix_import_errors(self, file_path: Path) -> int:
        """Fix import errors"""
        fixes_count = 0
        
        try:
            content = file_path.read_text()
            original_content = content
            
            # Add missing React import for TSX files
            if file_path.suffix == '.tsx':
                if (re.search(r'JSX\.|React\.', content) or '<' in content) and not re.search(r'import.*React', content):
                    lines = content.split('\n')
                    
                    # Find insertion point after other imports
                    insert_index = 0
                    for i, line in enumerate(lines):
                        if line.strip().startswith('import '):
                            insert_index = i + 1
                        elif line.strip() and not line.strip().startswith('import '):
                            break
                    
                    lines.insert(insert_index, "import React from 'react';")
                    content = '\n'.join(lines)
                    fixes_count += 1
            
            if content != original_content:
                file_path.write_text(content)
                self.log(f"Fixed {fixes_count} import errors in {file_path}")
            
        except Exception as e:
            self.log(f"Error fixing import errors in {file_path}: {e}", "error")
        
        return fixes_count
    
    def fix_any_type_issues(self, file_path: Path) -> int:
        """Fix any type issues"""
        fixes_count = 0
        
        try:
            content = file_path.read_text()
            original_content = content
            
            patterns = [
                (r'parameters: any', 'parameters: Record<string, any>'),
                (r'options: any', 'options: Record<string, any>'),
                (r'config: any', 'config: Record<string, any>'),
                (r'props: any', 'props: Record<string, any>'),
            ]
            
            for pattern, replacement in patterns:
                matches = re.findall(pattern, content)
                if matches:
                    content = re.sub(pattern, replacement, content)
                    fixes_count += len(matches)
            
            if content != original_content:
                file_path.write_text(content)
                self.log(f"Fixed {fixes_count} any type issues in {file_path}")
            
        except Exception as e:
            self.log(f"Error fixing any type issues in {file_path}: {e}", "error")
        
        return fixes_count
    
    def analyze_error_message(self, error_message: str) -> List[str]:
        """Analyze error message and return applicable fix types"""
        fixes = []
        
        error_lower = error_message.lower()
        
        if "not assignable to parameter of type 'never'" in error_lower:
            fixes.extend(["violations_array", "never_types"])
        
        if "missing return type" in error_lower:
            fixes.append("return_types")
        
        if "jsx element" in error_lower:
            fixes.append("react_components")
        
        if "property" in error_lower and "does not exist" in error_lower:
            fixes.append("property_access")
        
        if "cannot find module" in error_lower or "was not found" in error_lower:
            fixes.append("imports")
        
        # Always include general fixes
        fixes.append("any_types")
        
        return list(set(fixes))  # Remove duplicates
    
    def fix_typescript_errors(self, file_path: Path, error_message: str = "") -> Dict[str, int]:
        """Fix TypeScript errors in a specific file"""
        if not file_path.exists():
            self.log(f"File does not exist: {file_path}", "error")
            return {}
        
        self.log(f"Analyzing TypeScript errors in {file_path}")
        self.log(f"Error message: {error_message}")
        
        # Create backup
        backup_path = self.create_backup(file_path)
        
        # Determine which fixes to apply
        if error_message:
            fix_types = self.analyze_error_message(error_message)
        else:
            fix_types = ["violations_array", "never_types", "return_types", "react_components", "property_access", "imports", "any_types"]
        
        fixes_applied = {}
        
        # Apply fixes based on error patterns
        if "violations_array" in fix_types:
            fixes_applied["violations_array"] = self.fix_violations_array_typing(file_path)
        
        if "never_types" in fix_types:
            fixes_applied["never_types"] = self.fix_never_type_errors(file_path)
        
        if "return_types" in fix_types:
            fixes_applied["return_types"] = self.fix_missing_return_types(file_path)
        
        if "react_components" in fix_types:
            fixes_applied["react_components"] = self.fix_react_component_types(file_path)
        
        if "property_access" in fix_types:
            fixes_applied["property_access"] = self.fix_property_access_errors(file_path)
        
        if "imports" in fix_types:
            fixes_applied["imports"] = self.fix_import_errors(file_path)
        
        if "any_types" in fix_types:
            fixes_applied["any_types"] = self.fix_any_type_issues(file_path)
        
        total_fixes = sum(fixes_applied.values())
        self.log(f"Applied {total_fixes} fixes to {file_path}")
        
        return fixes_applied
    
    def auto_fix_all_errors(self) -> Dict[str, Any]:
        """Auto-detect and fix all TypeScript errors in project"""
        self.log(f"Auto-detecting and fixing TypeScript errors in {self.frontend_root}")
        
        total_fixes = 0
        files_processed = 0
        
        try:
            os.chdir(self.frontend_root)
            
            # Run TypeScript compiler to detect errors
            result = subprocess.run(
                ['pnpm', 'exec', 'tsc', '--noEmit', '--pretty=false'],
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.stderr:
                # Parse TypeScript errors
                error_pattern = r'^([^(]+)\((\d+),(\d+)\):\s*error\s*.*?:\s*(.*)$'
                
                for line in result.stderr.split('\n'):
                    match = re.match(error_pattern, line.strip())
                    if match:
                        file_path = Path(match.group(1))
                        error_msg = match.group(4)
                        
                        if file_path.exists() and file_path.suffix in ['.ts', '.tsx']:
                            self.log(f"Found error in {file_path}: {error_msg}")
                            fixes = self.fix_typescript_errors(file_path, error_msg)
                            total_fixes += sum(fixes.values())
                            files_processed += 1
            
            # Fallback: fix common patterns in all files
            if total_fixes == 0:
                self.log("No specific errors found, applying general fixes")
                for file_path in self.frontend_root.rglob("*.ts"):
                    if file_path.is_file():
                        fixes = self.fix_typescript_errors(file_path)
                        total_fixes += sum(fixes.values())
                        if sum(fixes.values()) > 0:
                            files_processed += 1
                
                for file_path in self.frontend_root.rglob("*.tsx"):
                    if file_path.is_file():
                        fixes = self.fix_typescript_errors(file_path)
                        total_fixes += sum(fixes.values())
                        if sum(fixes.values()) > 0:
                            files_processed += 1
            
        except subprocess.TimeoutExpired:
            self.log("TypeScript check timed out, applying general fixes", "warning")
        except Exception as e:
            self.log(f"Error during auto-fix: {e}", "error")
        
        self.log(f"Completed auto-fix: {total_fixes} fixes across {files_processed} files")
        
        return {
            "total_fixes": total_fixes,
            "files_processed": files_processed
        }
    
    def validate_fixes(self) -> Dict[str, Any]:
        """Validate fixes by running build"""
        self.log("Validating TypeScript fixes...")
        
        try:
            os.chdir(self.frontend_root)
            result = subprocess.run(
                ['pnpm', 'run', 'build'],
                capture_output=True,
                text=True,
                timeout=120
            )
            
            success = result.returncode == 0
            message = "✅ Build successful - all TypeScript errors fixed!" if success else "❌ Build failed - some errors remain"
            
            self.log(message)
            
            return {
                "success": success,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "returncode": result.returncode
            }
        
        except subprocess.TimeoutExpired:
            self.log("Build validation timed out", "warning")
            return {"success": False, "error": "Build timed out"}
        except Exception as e:
            self.log(f"Error during validation: {e}", "error")
            return {"success": False, "error": str(e)}


def main():
    """Main hook execution"""
    try:
        # Read input from stdin if available
        input_data = {}
        if not sys.stdin.isatty():
            try:
                input_data = json.loads(sys.stdin.read())
                hook_input = TypeScriptErrorFixerInput(**input_data)
            except:
                hook_input = TypeScriptErrorFixerInput()
        else:
            hook_input = TypeScriptErrorFixerInput()
        
        # Initialize fixer
        fixer = TypeScriptErrorFixer()
        
        # Determine operation mode
        if len(sys.argv) == 1:
            # Auto-fix mode
            result = fixer.auto_fix_all_errors()
            validation = fixer.validate_fixes()
            
            print(f"✅ Applied {result['total_fixes']} fixes across {result['files_processed']} files")
            print(f"Build validation: {'✅ Passed' if validation['success'] else '❌ Failed'}")
            
        elif len(sys.argv) == 2:
            # Fix specific file
            file_path = Path(sys.argv[1])
            fixes = fixer.fix_typescript_errors(file_path)
            total = sum(fixes.values())
            print(f"Applied {total} fixes to {file_path}")
            
        elif len(sys.argv) == 3:
            # Fix specific file with error message
            file_path = Path(sys.argv[1])
            error_message = sys.argv[2]
            fixes = fixer.fix_typescript_errors(file_path, error_message)
            total = sum(fixes.values())
            print(f"Applied {total} fixes to {file_path} for error: {error_message}")
            
        else:
            print("Usage: typescript-error-fixer [file_path] [error_message]")
            print("       typescript-error-fixer                    # Auto-fix all errors")
            print("       typescript-error-fixer file.ts            # Fix specific file")
            print("       typescript-error-fixer file.ts 'error'    # Fix specific error")
            sys.exit(1)
        
        # Return hook decision
        output = HookDecision()
        print(json.dumps(output.dict(by_alias=True)))
        
    except Exception as e:
        print(f"Hook error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
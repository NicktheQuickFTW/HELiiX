#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "pydantic>=1.10,<2.0",
# ]
# ///
"""
UserPromptSubmit Hook for FlexTime
Logs all prompts and adds FlexTime-specific context
"""

import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class UserPromptSubmitInput(BaseModel):
    """Input schema for UserPromptSubmit hook"""
    prompt: str = Field(..., description="User's prompt text")
    session_id: str = Field(..., description="Current session ID")
    timestamp: Optional[str] = Field(None, description="ISO timestamp")


class HookOutput(BaseModel):
    """Output schema for hook responses"""
    continue_: bool = Field(True, alias="continue")
    stopReason: Optional[str] = None
    suppressOutput: bool = False


def ensure_log_dir() -> Path:
    """Ensure log directory exists"""
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    return log_dir


def log_prompt(data: Dict[str, Any]) -> None:
    """Log prompt to JSON file"""
    log_file = ensure_log_dir() / "user_prompt_submit.json"
    
    # Create or append to log file
    logs = []
    if log_file.exists():
        try:
            with open(log_file, 'r') as f:
                content = f.read().strip()
                if content:
                    logs = json.loads(content)
        except (json.JSONDecodeError, IOError):
            pass
    
    # Add new log entry
    log_entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "session_id": data.get("session_id", "unknown"),
        "prompt": data.get("prompt", ""),
        "hook": "UserPromptSubmit"
    }
    logs.append(log_entry)
    
    # Write updated logs
    with open(log_file, 'w') as f:
        json.dump(logs, f, indent=2)


def add_flextime_context(prompt: str) -> str:
    """Add FlexTime-specific context to prompts"""
    context_keywords = {
        "schedule": "FlexTime 3-Phase Scheduling (WHO→WHEN→DELIVERY)",
        "basketball": "Big 12 Basketball (16 teams) - Note: M/WBB excluded from FlexTime due to network complexities",
        "football": "Big 12 Football - Note: Excluded from FlexTime due to ESPN/Fox Sports requirements",
        "constraint": "FlexTime supports 150+ sport-specific constraints",
        "travel": "Travel partner optimization for Big 12 Conference",
        "byu": "BYU Sunday restrictions (no competition)",
        "dashboard": "FlexTime Dashboard at http://localhost:3003/dashboard",
        "agent": "FlexTime Autonomous Agent System with MCP integration"
    }
    
    # Check if prompt mentions any context keywords
    prompt_lower = prompt.lower()
    relevant_context = []
    
    for keyword, context in context_keywords.items():
        if keyword in prompt_lower:
            relevant_context.append(f"[Context: {context}]")
    
    # Add context if relevant
    if relevant_context:
        context_str = "\n".join(relevant_context)
        print(f"\n{context_str}\n", file=sys.stdout)
    
    return prompt


def validate_prompt(prompt: str) -> Optional[str]:
    """Validate prompt for security issues"""
    # Check for dangerous patterns
    dangerous_patterns = [
        "rm -rf /",
        "delete all",
        "drop database",
        "truncate table"
    ]
    
    prompt_lower = prompt.lower()
    for pattern in dangerous_patterns:
        if pattern in prompt_lower:
            return f"Potentially dangerous command detected: {pattern}"
    
    return None


def main():
    """Main hook execution"""
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        
        # Parse and validate input
        try:
            hook_input = UserPromptSubmitInput(**input_data)
        except Exception as e:
            print(f"Invalid input: {e}", file=sys.stderr)
            sys.exit(1)
        
        # Log the prompt
        log_prompt(input_data)
        
        # Add FlexTime context if relevant
        add_flextime_context(hook_input.prompt)
        
        # Check for --validate flag
        if "--validate" in sys.argv:
            # Validate prompt
            error = validate_prompt(hook_input.prompt)
            if error:
                print(f"VALIDATION ERROR: {error}", file=sys.stderr)
                sys.exit(2)  # Block the prompt
        
        # Success - continue normally
        output = HookOutput()
        print(json.dumps(output.dict(by_alias=True)))
        
    except Exception as e:
        print(f"Hook error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
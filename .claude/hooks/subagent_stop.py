#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "pydantic>=1.10,<2.0",
# ]
# ///
"""
SubagentStop Hook for FlexTime
Logs when subagents complete their tasks
"""

import json
import sys
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional
import subprocess

from pydantic import BaseModel, Field


class SubagentStopInput(BaseModel):
    """Input schema for SubagentStop hook"""
    stop_hook_active: bool = Field(..., description="Whether stop hook is active")
    session_id: str = Field(..., description="Current session ID")
    subagent_name: Optional[str] = Field(None, description="Name of the subagent")
    timestamp: Optional[str] = Field(None, description="ISO timestamp")


class HookDecision(BaseModel):
    """Decision output for SubagentStop hook"""
    decision: Optional[str] = Field(None, description="block or undefined")
    reason: Optional[str] = Field(None, description="Reason for decision")
    continue_: bool = Field(True, alias="continue")
    suppressOutput: bool = False


def ensure_log_dir() -> Path:
    """Ensure log directory exists"""
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    return log_dir


def log_subagent_stop(data: Dict[str, Any]) -> None:
    """Log subagent stop event to JSON file"""
    log_file = ensure_log_dir() / "subagent_stop.json"
    
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
        "stop_hook_active": data.get("stop_hook_active", False),
        "subagent_name": data.get("subagent_name", "unknown"),
        "hook": "SubagentStop"
    }
    logs.append(log_entry)
    
    # Write updated logs
    with open(log_file, 'w') as f:
        json.dump(logs, f, indent=2)


def play_tts(text: str) -> None:
    """Play text-to-speech alert"""
    try:
        # Try macOS say command first
        if sys.platform == "darwin":
            subprocess.run(["say", text], check=True)
            return
        
        # Try espeak for Linux
        try:
            subprocess.run(["espeak", text], check=True)
            return
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass
        
        # Try Windows SAPI
        if sys.platform == "win32":
            import win32com.client
            speaker = win32com.client.Dispatch("SAPI.SpVoice")
            speaker.Speak(text)
            return
            
    except Exception as e:
        print(f"TTS failed: {e}", file=sys.stderr)


def extract_subagent_context() -> Optional[str]:
    """Extract context about which subagent completed"""
    try:
        # Check recent pre_tool_use logs for Task tool calls
        pre_tool_log = Path("logs/pre_tool_use.json")
        if not pre_tool_log.exists():
            return None
        
        with open(pre_tool_log, 'r') as f:
            logs = json.load(f)
        
        # Look for recent Task tool calls
        recent_logs = logs[-10:] if len(logs) > 10 else logs
        for log in reversed(recent_logs):
            if log.get("tool_name") == "Task":
                tool_input = log.get("tool_input", {})
                description = tool_input.get("description", "")
                subagent_type = tool_input.get("subagent_type", "")
                
                if description:
                    return f"{description} complete"
                elif subagent_type:
                    return f"{subagent_type} agent complete"
        
    except Exception:
        pass
    
    return None


def get_flextime_specific_message(subagent_name: Optional[str]) -> str:
    """Get FlexTime-specific completion message based on subagent"""
    if not subagent_name:
        return "Subagent complete"
    
    # FlexTime-specific agent completions
    agent_messages = {
        "schedule": "Schedule agent complete",
        "data": "Data collection agent complete",
        "mcp": "MCP builder agent complete",
        "analysis": "Analysis agent complete",
        "validation": "Validation agent complete",
        "research": "Research agent complete",
        "test": "Test runner agent complete",
        "deploy": "Deployment agent complete"
    }
    
    # Check if subagent name contains any of our known types
    name_lower = subagent_name.lower()
    for key, message in agent_messages.items():
        if key in name_lower:
            return message
    
    # Check for autonomous agent patterns
    if "autonomous" in name_lower:
        return "Autonomous agent complete"
    elif "flextime" in name_lower:
        return "FlexTime agent complete"
    
    return f"{subagent_name} complete"


def main():
    """Main hook execution"""
    try:
        # Check for --notify flag
        enable_tts = "--notify" in sys.argv
        
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        
        # Parse and validate input
        try:
            hook_input = SubagentStopInput(**input_data)
        except Exception as e:
            print(f"Invalid input: {e}", file=sys.stderr)
            sys.exit(1)
        
        # Log the subagent stop event
        log_subagent_stop(input_data)
        
        # Extract context-aware message
        context_message = extract_subagent_context()
        
        # Get FlexTime-specific message
        if context_message:
            message = context_message
        else:
            message = get_flextime_specific_message(hook_input.subagent_name)
        
        # Play TTS if --notify flag is present
        if enable_tts:
            play_tts(message)
        
        # Log the completion message
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "session_id": input_data.get("session_id", "unknown"),
            "completion_message": message,
            "subagent_name": hook_input.subagent_name,
            "hook": "SubagentStop"
        }
        
        # Append to logs
        log_file = ensure_log_dir() / "subagent_stop.json"
        logs = []
        if log_file.exists():
            try:
                with open(log_file, 'r') as f:
                    content = f.read().strip()
                    if content:
                        logs = json.loads(content)
            except (json.JSONDecodeError, IOError):
                pass
        
        logs.append(log_entry)
        
        with open(log_file, 'w') as f:
            json.dump(logs, f, indent=2)
        
        # Allow normal flow
        output = HookDecision()
        print(json.dumps(output.dict(by_alias=True)))
        
    except Exception as e:
        print(f"Hook error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
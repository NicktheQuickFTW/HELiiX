#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "pydantic>=1.10,<2.0",
# ]
# ///
"""
Stop Hook for FlexTime
AI-generated completion messages with TTS playback
"""

import json
import sys
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional
import subprocess
import random

from pydantic import BaseModel, Field


class StopInput(BaseModel):
    """Input schema for Stop hook"""
    stop_hook_active: bool = Field(..., description="Whether stop hook is active")
    session_id: str = Field(..., description="Current session ID")
    timestamp: Optional[str] = Field(None, description="ISO timestamp")


class HookDecision(BaseModel):
    """Decision output for Stop hook"""
    continue_: bool = Field(True, alias="continue")
    suppressOutput: bool = False


def ensure_log_dir() -> Path:
    """Ensure log directory exists"""
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    return log_dir


def log_stop_event(data: Dict[str, Any]) -> None:
    """Log stop event to JSON file"""
    log_file = ensure_log_dir() / "stop.json"
    
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
        "hook": "Stop"
    }
    logs.append(log_entry)
    
    # Write updated logs
    with open(log_file, 'w') as f:
        json.dump(logs, f, indent=2)


def get_engineer_name() -> str:
    """Get engineer name from environment"""
    # Check for custom name first, then fallback to "Nick" for this user
    custom_name = os.environ.get("FLEXTIME_ENGINEER")
    if custom_name:
        return custom_name
    
    # Default to "Nick Flash" for this specific user
    user = os.environ.get("USER", "")
    if user == "Nick Flash":
        return "Nick Flash"
    
    return user


def get_completion_message() -> str:
    """Generate AI-style completion message"""
    messages = [
        "Task completed successfully.",
        "All operations finished.",
        "Process complete.",
        "Work finished successfully.",
        "Operations completed.",
        "Task execution complete.",
        "All done here.",
        "Finished processing.",
        "Work complete.",
        "Operations finished successfully."
    ]
    
    # 30% chance to include name
    if random.random() < 0.3:
        name = get_engineer_name()
        if name:
            messages.extend([
                f"{name}, your task is complete.",
                f"All done, {name}.",
                f"Task finished, {name}.",
                f"{name}, operations complete.",
                f"Work finished, {name}."
            ])
    
    return random.choice(messages)


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




def main():
    """Main hook execution"""
    try:
        # Check for --chat flag
        enable_chat = "--chat" in sys.argv
        
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        session_id = input_data.get("session_id", "unknown")
        
        # Generate completion message
        message = get_completion_message()
        
        # Play TTS with --chat flag
        if enable_chat:
            play_tts(message)
        
        # Log the stop event
        log_stop_event({
            "session_id": session_id,
            "stop_hook_active": True,
            "message": message if enable_chat else "Hook completed silently"
        })
        
        # Allow normal stopping
        output = HookDecision()
        print(json.dumps(output.model_dump(by_alias=True, exclude_none=True)))
        
    except Exception as e:
        print(f"Hook error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
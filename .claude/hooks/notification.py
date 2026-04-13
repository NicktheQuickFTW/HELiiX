#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "pydantic>=1.10,<2.0",
# ]
# ///
"""
Notification Hook for FlexTime
Logs Claude Code notifications with optional TTS alerts
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


class NotificationInput(BaseModel):
    """Input schema for Notification hook"""
    message: str = Field(..., description="Notification message")
    session_id: str = Field(..., description="Current session ID")
    timestamp: Optional[str] = Field(None, description="ISO timestamp")


class HookDecision(BaseModel):
    """Decision output for Notification hook"""
    continue_: bool = Field(True, alias="continue")
    suppressOutput: bool = False


def ensure_log_dir() -> Path:
    """Ensure log directory exists"""
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    return log_dir


def log_notification(data: Dict[str, Any]) -> None:
    """Log notification to JSON file"""
    log_file = ensure_log_dir() / "notification.json"
    
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
        "message": data.get("message", ""),
        "hook": "Notification"
    }
    logs.append(log_entry)
    
    # Write updated logs
    with open(log_file, 'w') as f:
        json.dump(logs, f, indent=2)


def get_engineer_name() -> str:
    """Get engineer name from environment"""
    return os.environ.get("FLEXTIME_ENGINEER", os.environ.get("USER", ""))


def should_include_name() -> bool:
    """30% chance to include engineer name"""
    return random.random() < 0.3


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


def process_notification(message: str, enable_tts: bool) -> None:
    """Process notification with optional TTS"""
    # FlexTime-specific notifications
    if "scheduling" in message.lower():
        print("[FlexTime: Scheduling operation notification]", file=sys.stdout)
    
    if "agent" in message.lower():
        print("[FlexTime: Agent activity notification]", file=sys.stdout)
    
    if "dashboard" in message.lower():
        print("[FlexTime: Dashboard update notification]", file=sys.stdout)
    
    # TTS notifications
    if enable_tts:
        if "waiting" in message.lower() or "input" in message.lower():
            tts_message = "Your agent needs your input"
            
            # Add name with 30% probability
            if should_include_name():
                name = ("Nick")
                if name:
                    tts_message = f"{name}, your agent needs your input"
            
            play_tts(tts_message)
        
        elif "error" in message.lower():
            play_tts("Error detected in agent operation")
        
        elif "complete" in message.lower() or "done" in message.lower():
            play_tts("Task completed")


def main():
    """Main hook execution"""
    try:
        # Check for --notify flag
        enable_tts = "--notify" in sys.argv
        
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        
        # Parse and validate input
        try:
            hook_input = NotificationInput(**input_data)
        except Exception as e:
            print(f"Invalid input: {e}", file=sys.stderr)
            sys.exit(1)
        
        # Log the notification
        log_notification(input_data)
        
        # Process notification
        process_notification(hook_input.message, enable_tts)
        
        # Always continue (notifications are informational only)
        output = HookDecision()
        print(json.dumps(output.dict(by_alias=True)))
        
    except Exception as e:
        print(f"Hook error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
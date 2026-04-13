#!/usr/bin/env python3
"""
Pre-Tool Use Hook - Validates tool invocations before execution.

Inspired by Claude Agent SDK's PreToolUse hook pattern.
Intercepts tool invocations before execution for policy enforcement.

Features:
- Stage-based tool allowlists (FSM enforcement)
- Sport-specific locks (guardrail rules)
- Dangerous operation detection
- Rate limiting
"""

import json
import sys
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

# =============================================================================
# Configuration
# =============================================================================

PROJECT_ROOT = Path("/Users/nickw/Documents/GitHub/Flextime")
LOG_FILE = PROJECT_ROOT / ".claude" / "logs" / "pre_tool_use.json"

# Stage tool allowlists (mirrors STAGE_TOOL_ALLOWLIST in AgentOptions.ts)
STAGE_TOOL_ALLOWLIST: dict[str, list[str]] = {
    "preflight": [
        "initialize_schedule",
        "load_rotation_history",
        "set_objectives",
        "preflight_validate",
        "complexity_estimate",
    ],
    "matrix": [
        "generate_phase1_variant",
        "approve_matrix",
        "export_matrix_csv",
        "check_matrix_conflicts",
        "rescore_matrix",
        "edit_matrix",
        "batch_variants",
        "select_variant",
    ],
    "sequencing": [
        "generate_phase2_sequence",
        "approve_sequence",
        "link_two_year_cycle",
        "score_two_year_cycle",
        "edit_sequence",
        "generate_2yr_cycle",
        "generate_yr2_followup",
    ],
    "polish": [
        "polish_apply",
        "tv_window_optimize",
        "get_quality_breakdown",
    ],
    "review": [
        "diff_generate",
        "review_packet_generate",
        "approval_submit",
        "approve_certification",
    ],
    "published": [
        "export_schedule",
        "publish_schedule",
        "export_download",
    ],
    "archived": [
        "archive_schedule",
        "get_archive_status",
    ],
}

# Universal tools allowed in any stage
UNIVERSAL_TOOLS: list[str] = [
    "rollback_to_phase",
    "get_schedule_status",
    "get_quality_scores",
    "Read",
    "Glob",
    "Grep",
    "LS",
    "WebFetch",
    "WebSearch",
    "AskUserQuestion",
]

# Sport locks - sports where certain operations are locked
SPORT_LOCKS: dict[str, list[str]] = {
    "basketball-mens": ["edit_matrix", "generate_phase1_variant"],
    "basketball-womens": ["edit_matrix", "generate_phase1_variant"],
    "football": ["edit_matrix", "generate_phase1_variant", "edit_sequence"],
}

# Dangerous tools requiring extra caution
DANGEROUS_TOOLS: list[str] = [
    "publish_schedule",
    "archive_schedule",
    "rollback_to_phase",
]

# =============================================================================
# Validation Functions
# =============================================================================

def validate_stage_allowlist(tool_name: str, stage: Optional[str]) -> tuple[bool, Optional[str]]:
    """Check if tool is allowed in the current stage."""
    if not stage:
        return True, None  # No stage context, allow

    if tool_name in UNIVERSAL_TOOLS:
        return True, None

    allowed_tools = STAGE_TOOL_ALLOWLIST.get(stage, [])
    if tool_name in allowed_tools:
        return True, None

    return False, f"Tool '{tool_name}' is not allowed in stage '{stage}'. Allowed tools: {', '.join(allowed_tools[:5])}..."


def validate_sport_lock(tool_name: str, sport: Optional[str]) -> tuple[bool, Optional[str]]:
    """Check if tool is locked for this sport."""
    if not sport:
        return True, None

    locked_tools = SPORT_LOCKS.get(sport, [])
    if tool_name in locked_tools:
        return False, f"Tool '{tool_name}' is locked for sport '{sport}'"

    return True, None


def validate_dangerous_tool(tool_name: str, args: dict[str, Any]) -> tuple[bool, Optional[str]]:
    """Warn about dangerous tools (but don't block by default)."""
    if tool_name in DANGEROUS_TOOLS:
        # Log warning but don't block
        log_event({
            "type": "dangerous_tool_warning",
            "tool": tool_name,
            "args": args,
            "timestamp": datetime.now().isoformat(),
        })
    return True, None


def extract_context(input_data: dict[str, Any]) -> dict[str, Any]:
    """Extract relevant context from hook input."""
    tool_input = input_data.get("tool_input", {})

    # Try to extract stage/sport from tool args or session context
    stage = tool_input.get("stage") or tool_input.get("current_stage")
    sport = tool_input.get("sport") or tool_input.get("sport_code")
    schedule_id = tool_input.get("schedule_id") or tool_input.get("scheduleId")

    return {
        "stage": stage,
        "sport": sport,
        "schedule_id": schedule_id,
    }


# =============================================================================
# Logging
# =============================================================================

def log_event(event: dict[str, Any]) -> None:
    """Append event to log file."""
    try:
        LOG_FILE.parent.mkdir(parents=True, exist_ok=True)

        logs: list[dict[str, Any]] = []
        if LOG_FILE.exists():
            try:
                with open(LOG_FILE, "r") as f:
                    logs = json.load(f)
            except (json.JSONDecodeError, IOError):
                logs = []

        logs.append(event)

        # Keep only last 500 entries
        if len(logs) > 500:
            logs = logs[-500:]

        with open(LOG_FILE, "w") as f:
            json.dump(logs, f, indent=2)
    except Exception:
        pass  # Silent fail for logging


# =============================================================================
# Main Hook Logic
# =============================================================================

def validate_tool_use(input_data: dict[str, Any]) -> dict[str, Any]:
    """
    Main validation logic for pre-tool-use hook.

    Returns:
        {"block": False} to allow
        {"block": True, "reason": "..."} to block
    """
    tool_name = input_data.get("tool_name", "")
    tool_input = input_data.get("tool_input", {})

    # Extract context
    context = extract_context(input_data)
    stage = context.get("stage")
    sport = context.get("sport")

    # Run validations
    validations = [
        ("stage_allowlist", validate_stage_allowlist(tool_name, stage)),
        ("sport_lock", validate_sport_lock(tool_name, sport)),
        ("dangerous_tool", validate_dangerous_tool(tool_name, tool_input)),
    ]

    # Check for any blocking validations
    for validation_name, (allowed, reason) in validations:
        if not allowed:
            log_event({
                "type": "tool_blocked",
                "tool": tool_name,
                "validation": validation_name,
                "reason": reason,
                "context": context,
                "timestamp": datetime.now().isoformat(),
            })
            return {"block": True, "reason": reason}

    # All validations passed
    log_event({
        "type": "tool_allowed",
        "tool": tool_name,
        "context": context,
        "timestamp": datetime.now().isoformat(),
    })

    return {"block": False}


def main() -> str:
    """Entry point for hook."""
    try:
        raw_input = sys.stdin.read()
        if not raw_input.strip():
            return json.dumps({"block": False})

        input_data = json.loads(raw_input)
        result = validate_tool_use(input_data)
        return json.dumps(result)
    except json.JSONDecodeError as e:
        log_event({
            "type": "parse_error",
            "error": str(e),
            "timestamp": datetime.now().isoformat(),
        })
        return json.dumps({"block": False})
    except Exception as e:
        log_event({
            "type": "unexpected_error",
            "error": str(e),
            "timestamp": datetime.now().isoformat(),
        })
        return json.dumps({"block": False})


if __name__ == "__main__":
    print(main())

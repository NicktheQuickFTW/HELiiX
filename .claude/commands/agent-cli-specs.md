---
name: agent-cli-specs
description: Claude Agent CLI Interface Specifications - MVP Focus
---

# Claude Agent CLI Interface Specifications - MVP Focus

**Context Engineering Document - Created: 2025-01-30 00:35:00**

## Overview

Basic CLI interface for managing simple Claude agents within FlexTime. Start with essential functionality before building complex autonomous systems.

**MVP Priority:** Focus on basic agent creation and simple task execution first.

## Core CLI Commands

### Agent Lifecycle Management

```bash
# Agent creation and initialization
claude-agent create <agent-type> [options]
  --name <agent-name>           # Custom agent name
  --capabilities <cap1,cap2>    # Comma-separated capabilities
  --config <config-file>        # JSON configuration file
  --memory-config <config>      # Memory persistence settings
  --auto-start                  # Start agent immediately after creation

# Agent control
claude-agent start <agent-id>
claude-agent stop <agent-id>
claude-agent restart <agent-id>
claude-agent pause <agent-id>
claude-agent resume <agent-id>

# Agent information
claude-agent list [--status <status>] [--type <type>]
claude-agent info <agent-id>
claude-agent health <agent-id>
claude-agent logs <agent-id> [--tail <lines>] [--follow]
```

### Agent Registry Operations

```bash
# Service discovery
claude-agent discover <capability> [options]
  --min-health <score>          # Minimum health score (0.0-1.0)
  --status <status>             # Filter by status (ready, working, error)
  --location <location>         # Geographic or logical location filter

# Agent registration
claude-agent register <agent-id> [options]
  --endpoint <url>              # Agent endpoint URL
  --capabilities <cap1,cap2>    # Agent capabilities
  --metadata <key=value>        # Additional metadata

# Load balancing and routing
claude-agent route <capability> <request-data>
  --strategy <strategy>         # round-robin, least-connections, weighted
  --prefer-local               # Prefer local agents
```

### Task and Workflow Management

```bash
# Task execution
claude-agent task create <task-definition> [options]
  --agent-id <id>              # Specific agent to execute task
  --auto-assign               # Auto-assign based on capabilities
  --priority <level>           # Task priority (low, medium, high)
  --deadline <timestamp>       # Task deadline
  --context <context-file>     # JSON context file

# Task monitoring
claude-agent task list [--status <status>] [--agent <id>]
claude-agent task info <task-id>
claude-agent task cancel <task-id>
claude-agent task retry <task-id>

# Workflow orchestration
claude-agent workflow create <workflow-file>
claude-agent workflow start <workflow-id> [--context <context>]
claude-agent workflow status <workflow-id>
claude-agent workflow stop <workflow-id>
```

### Memory and Context Management

```bash
# Memory operations
claude-agent memory store <agent-id> <content> [options]
  --type <memory-type>         # working, episodic, semantic, procedural
  --priority <level>           # Memory priority
  --tags <tag1,tag2>          # Memory tags
  --context <context-data>     # Associated context

claude-agent memory retrieve <agent-id> <query> [options]
  --limit <count>              # Maximum results
  --similarity <threshold>     # Similarity threshold (0.0-1.0)
  --types <type1,type2>       # Memory types to search

claude-agent memory consolidate <agent-id>
claude-agent memory cleanup <agent-id> [--older-than <days>]
```

### Circuit Breaker and Health Management

```bash
# Circuit breaker control
claude-agent circuit-breaker status <agent-id>
claude-agent circuit-breaker reset <agent-id>
claude-agent circuit-breaker force-open <agent-id>
claude-agent circuit-breaker force-close <agent-id>

# Health monitoring
claude-agent health-check <agent-id>
claude-agent health-score <agent-id>
claude-agent health-history <agent-id> [--days <count>]
```

### Configuration and Tools

```bash
# Configuration management
claude-agent config get <agent-id> [<key>]
claude-agent config set <agent-id> <key> <value>
claude-agent config export <agent-id> [--file <output-file>]
claude-agent config import <agent-id> <config-file>

# Tool management
claude-agent tools list <agent-id>
claude-agent tools register <agent-id> <tool-name> <tool-config>
claude-agent tools unregister <agent-id> <tool-name>
claude-agent tools test <agent-id> <tool-name> [<test-params>]
```

## Agent Type Templates

### Research Agent
```bash
claude-agent create research_agent \
  --name "basketball-research-agent" \
  --capabilities "research,data_collection,historical_analysis" \
  --config ./configs/research-agent.json \
  --auto-start
```

### Analysis Agent
```bash
claude-agent create analysis_agent \
  --name "schedule-analysis-agent" \
  --capabilities "analysis,quality_scoring,conflict_detection" \
  --config ./configs/analysis-agent.json
```

### Scheduling Agent
```bash
claude-agent create scheduling_agent \
  --name "basketball-scheduler" \
  --capabilities "scheduling,optimization,constraint_solving" \
  --config ./configs/scheduling-agent.json
```

## Global Command Options

```bash
# Global flags available for all commands
--verbose, -v                 # Verbose output
--quiet, -q                   # Quiet mode (minimal output)
--format <format>             # Output format: json, yaml, table, plain
--config <config-file>        # Global configuration file
--api-endpoint <url>          # Agent orchestrator API endpoint
--timeout <seconds>           # Command timeout
--no-color                    # Disable colored output
```

## Configuration Files

### Agent Configuration Template
```json
{
  "agentType": "research_agent",
  "capabilities": ["research", "data_collection", "analysis"],
  "memoryConfig": {
    "vectorDimensions": 1536,
    "maxMemoryItems": 10000,
    "memoryRetention": 2592000000,
    "semanticThreshold": 0.8
  },
  "circuitBreaker": {
    "failureThreshold": 5,
    "resetTimeout": 60000
  },
  "toolConfig": {
    "timeout": 30000,
    "retryAttempts": 3,
    "retryDelay": 1000
  },
  "contextConfig": {
    "sportContext": true,
    "big12Context": true,
    "constraintContext": true,
    "historicalContext": true
  }
}
```

### Workflow Definition Template
```json
{
  "name": "Basketball Schedule Analysis",
  "description": "Comprehensive analysis of basketball scheduling requirements",
  "steps": [
    {
      "name": "historical_research",
      "capability": "research",
      "params": {
        "sport": "basketball",
        "focus": "travel_patterns",
        "years": 3
      },
      "required": true,
      "timeout": 300000
    },
    {
      "name": "constraint_analysis",
      "capability": "analysis",
      "params": {
        "type": "constraint_validation",
        "byu_restrictions": true,
        "venue_conflicts": true
      },
      "required": true,
      "dependsOn": ["historical_research"]
    }
  ],
  "context": {
    "conference": "Big 12",
    "sport": "Basketball",
    "season": "2024-25"
  }
}
```

## Command Integration Patterns

### FlexTime-Specific Commands
```bash
# Big 12 Conference operations
claude-agent big12 validate-schedule <sport> <schedule-file>
claude-agent big12 check-byu-compliance <schedule-data>
claude-agent big12 optimize-travel <teams> <venues>

# Sports-specific operations
claude-agent sports list-constraints <sport>
claude-agent sports validate-rules <sport> <schedule>
claude-agent sports generate-schedule <sport> [options]

# Integration with existing FlexTime systems
claude-agent flextime sync-competition-schema
claude-agent flextime update-agent-hq
claude-agent flextime deploy-to-dashboard
```

### MCP Integration Commands
```bash
# Model Context Protocol operations
claude-agent mcp list-servers
claude-agent mcp connect <server-id>
claude-agent mcp resources <server-id>
claude-agent mcp tools <server-id>
claude-agent mcp execute <server-id> <tool-name> <params>
```

## Error Handling and Output Formats

### Exit Codes
- `0`: Success
- `1`: General error
- `2`: Invalid arguments
- `3`: Agent not found
- `4`: Agent unavailable (circuit breaker open)
- `5`: Task execution failed
- `6`: Configuration error
- `7`: Network/connection error
- `8`: Authentication/authorization error

### Output Formats

#### Table Format (Default)
```
AGENT ID                             TYPE             STATUS    HEALTH  CAPABILITIES
basketball-research-001              research_agent   ready     0.95    research,data_collection
schedule-analyzer-002                analysis_agent   working   0.87    analysis,quality_scoring
```

#### JSON Format
```json
{
  "agents": [
    {
      "id": "basketball-research-001",
      "type": "research_agent",
      "status": "ready",
      "healthScore": 0.95,
      "capabilities": ["research", "data_collection"],
      "circuitBreakerState": "CLOSED",
      "lastActivity": "2025-01-30T00:30:00Z"
    }
  ]
}
```

## Security and Authentication

### Access Control
```bash
# Authentication commands
claude-agent auth login [--token <token>]
claude-agent auth logout
claude-agent auth status
claude-agent auth refresh

# Permission management
claude-agent permissions list <user>
claude-agent permissions grant <user> <permission>
claude-agent permissions revoke <user> <permission>
```

### Audit and Logging
```bash
# Audit trail
claude-agent audit list [--user <user>] [--action <action>]
claude-agent audit export [--format <format>] [--filter <filter>]

# Security monitoring
claude-agent security alerts
claude-agent security scan <agent-id>
```

## Integration with Existing FlexTime Infrastructure

### Supabase Integration
- All agent metadata stored in Supabase competition schema
- Memory persistence uses Supabase vector database
- Real-time updates via Supabase subscriptions

### Docker Environment Integration
- CLI commands work within Docker development environment
- Agent containers managed through Docker Compose
- Configuration mounted as volumes

### Claude Hooks Integration
- CLI commands trigger appropriate hooks
- Automated validation and quality checks
- Integration with existing hook system

## Command Completion and Help

### Bash Completion
```bash
# Enable bash completion
source <(claude-agent completion bash)

# Or add to .bashrc
echo 'source <(claude-agent completion bash)' >> ~/.bashrc
```

### Help System
```bash
# General help
claude-agent help
claude-agent --help

# Command-specific help
claude-agent create --help
claude-agent task create --help

# Examples and tutorials
claude-agent examples
claude-agent tutorial <topic>
```

## Implementation Architecture

### CLI Tool Structure
```
cli/
├── cmd/
│   ├── agent.go              # Main agent command
│   ├── task.go               # Task management commands
│   ├── workflow.go           # Workflow commands
│   ├── memory.go             # Memory management
│   └── config.go             # Configuration commands
├── pkg/
│   ├── client/               # API client for orchestrator
│   ├── config/               # Configuration management
│   ├── output/               # Output formatting
│   └── auth/                 # Authentication handling
└── internal/
    ├── commands/             # Command implementations
    ├── completion/           # Shell completion
    └── validation/           # Input validation
```

### API Client Integration
- RESTful API client for AutonomousAgentOrchestrator
- WebSocket support for real-time operations
- Circuit breaker implementation for CLI resilience
- Automatic retry logic with exponential backoff

This CLI specification provides comprehensive management capabilities for autonomous Claude agents while integrating seamlessly with FlexTime's existing infrastructure and following established patterns from the BaseAutonomousAgent and AgentRegistrySystem components.
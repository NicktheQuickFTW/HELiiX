---
name: update-docs
description: FlexTime Documentation Update Command - Continuous State Tracking (CST)
---

# FlexTime Documentation Update Command - Continuous State Tracking (CST)

**Usage:** `update-docs [component]`  
**Purpose:** Primary documentation workflow following Continuous State Tracking protocol from `docs/general/CONTINUOUS_STATE_TRACKING.md`

## Command Overview

### 📋 FlexTime CST Documentation Update System

**Core Principle:** Follow the State Tracking Protocol - **ALWAYS** update state documentation after ANY major change to prevent "starting over from square one" situations.

## Available Components

### Components to Update (CST Priority Order)
- **`state`** - **PRIORITY**: Update CLAUDE.md "Session Status" + PROJECT_STATE.md status indicators (CST Protocol Step 1)
- **`sportlogic`** - Regenerate SportLogic snapshot in `docs/scheduling/SportLogic.md` if rules/policies changed
- **`claude`** - Update CLAUDE.md "Recent Major Changes" section with timestamps
- **`project-state`** - Update PROJECT_STATE.md health indicators and session summaries
- **`readme`** - Update README.md with current project status and timestamp  
- **`api`** - Update API documentation with current endpoints
- **`architecture`** - Update architecture documentation with system changes
- **`all`** - Execute full CST protocol: state → sportlogic → claude → project-state → readme → others

## Usage Examples

```bash
# CST Protocol - PRIORITY after any major change
update-docs state          # Updates CLAUDE.md Session Status + PROJECT_STATE.md

# Full CST Protocol
update-docs all            # Complete CST workflow

# Specific components  
update-docs sportlogic     # Regenerate SportLogic snapshot if rules changed
update-docs claude         # Update CLAUDE.md Recent Major Changes
update-docs project-state  # Update PROJECT_STATE.md indicators
update-docs readme         # Update README.md with current status

# Legacy components
update-docs api
update-docs architecture

# Show available options
update-docs
```

## Component Details

### 🚨 **PRIORITY 1: State Update (`state`)**

**Target Files:** `CLAUDE.md` "Session Status" + `PROJECT_STATE.md` status indicators  
**CST Protocol:** Step 1 - Always update after ANY major change

**Updates Include:**
- CLAUDE.md: Session Status (what's done, what's next, blockers)  
- PROJECT_STATE.md: Health indicators, timestamps, session summaries
- Clean-as-you-go: Remove orphaned files/dirs, fix imports after moves
- Document current state to prevent "starting over from square one"

**Critical Actions:**
```markdown
After ANY major change, update:
✅ CLAUDE.md "Session Status" section
✅ PROJECT_STATE.md status indicators  
✅ Update timestamps and session summaries
✅ If rules/policies changed, note SportLogic snapshot needed
```

### 2. **SportLogic Snapshot (`sportlogic`)**

**Target Files:** `docs/scheduling/SportLogic.md`  
**When:** If relevant to rules/policies/constraints/parameters/conflicts

**Updates Include:**

- Auto-generated snapshot from `competition.sportlogic_v` (canonical source)
- Current sport scheduling rules and parameters
- Policy changes and constraint updates
- Maintains single source of truth documentation

### 3. **CLAUDE.md Update (`claude`)**

**Target Files:** `CLAUDE.md` "Recent Major Changes"

**Updates Include:**

- Timestamp: `Recent Major Changes - Updated: [YYYY-MM-DD HH:MM:SS]`
- Document completed work and architectural decisions
- Update context engineering patterns and development guidelines
- Current system architecture patterns and Big 12 operational updates

### 4. **PROJECT_STATE.md Update (`project-state`)**  

**Target Files:** `PROJECT_STATE.md`

**Updates Include:**

- Health check indicators (✅ Green/⚠️ Yellow/🚨 Red)
- Session completion summaries with timestamps
- Component status updates (FT Builder, Frontend, Backend, AI/ML)
- Architecture evolution tracking

### 5. **README Update (`readme`)**

**Target Files:** `README.md`, `frontend/README.md`, `scheduling/README.md`

**Updates Include:**

- Timestamp: `Last Updated: [YYYY-MM-DD HH:MM:SS]`
- Current project status and health dashboard
- Development environment setup instructions
- Available scripts and commands  
- Recent changes and implementations
- Performance benchmarks and metrics

**Header Format:**
```markdown
# FlexTime - AI-Powered Sports Scheduling Platform
*Last Updated: 2025-01-16 14:30:00*
*Status: Production Ready | Health: 95% | Demo Ready: ✅*

## Current Status Dashboard
- ✅ 3-Phase AI-Enhanced Scheduling Implementation Complete
- ✅ Database Architecture Migration Complete  
- ✅ Frontend Component Migration Complete
- ✅ HELiiX Hybrid Architecture Production Ready
- ✅ All 12 Sport Schedulers Operational
- ✅ Case Sensitivity Issues Resolved
- ✅ Build System Optimized
```

### 6. **Legacy API Documentation Update (`api`)**

**Target Files:** `api/README.md`, `docs/api/*.md`  
**Priority:** Lower - not part of core CST protocol

**Updates Include:**

- Current API endpoints and versions
- Authentication updates and OAuth changes
- Rate limiting and performance metrics
- New endpoint implementations
- Deprecation notices with timelines

### 7. **Legacy Architecture Documentation Update (`architecture`)**

**Target Files:** `docs/architecture/*.md`  
**Priority:** Lower - not part of core CST protocol

**Updates Include:**

- System architecture diagrams and changes
- Database schema updates
- Integration patterns and new services
- Performance optimizations implemented
- Security updates and compliance changes

**Header Format:**
```markdown
# FlexTime AI Context Engineering Rules
*Context Engineering Rules - Updated: 2025-01-16 14:30:00*
*System Version: HELiiX Hybrid Architecture v2.1*

**Context is King** - Always provide comprehensive context including documentation, examples, rules, patterns, and validation loops rather than iterating through multiple conversations.

## 🎯 Enhanced Context Engineering Framework - Updated
```

### 3. Planning Documentation Update (`planning`)

**Target Files:** `PLANNING.md`, `docs/planning/*.md`

**Updates Include:**

- Current development phase and milestones
- Completed features with timestamps
- Upcoming development priorities
- Known issues and their status
- Performance metrics and benchmarks
- Testing status and coverage

**Format:**
```markdown
# FlexTime Development Planning
*Planning Status - Updated: 2025-01-16 14:30:00*
*Current Phase: Production Optimization*

## Recently Completed (Last 7 Days)
- ✅ 2025-01-16 14:00:00 - Case sensitivity issues resolved across frontend
- ✅ 2025-01-16 13:30:00 - Build system optimized for production
- ✅ 2025-01-16 12:00:00 - Component migration completed
```

### 4. API Documentation Update (`api`)

**Target Files:** `api/README.md`, `docs/api/*.md`

**Updates Include:**

- Current API endpoints and versions
- Authentication updates and OAuth changes
- Rate limiting and performance metrics
- New endpoint implementations
- Deprecation notices with timelines

### 5. Architecture Documentation Update (`architecture`)

**Target Files:** `docs/architecture/*.md`

**Updates Include:**

- System architecture diagrams and changes
- Database schema updates
- Integration patterns and new services
- Performance optimizations implemented
- Security updates and compliance changes

## Implementation Features

### Automatic Timestamping

- **UTC Timestamps**: All updates use UTC format `YYYY-MM-DD HH:MM:SS`
- **Multiple Formats**: Supports both datetime stamps and relative timestamps
- **Consistent Format**: Standardized timestamp format across all documentation

### Context Engineering Integration

- **Comprehensive Context**: Each update includes full system context
- **Progressive Enhancement**: Documents current state and next steps
- **Validation Loops**: Includes quality gates and validation requirements
- **Implementation Blueprints**: Provides complete implementation guidance

### Update Tracking

- **Change Log**: Maintains chronological log of all documentation updates
- **Version Control**: Integrates with git for complete change tracking
- **Status Dashboard**: Real-time project health and completion status
- **Metric Tracking**: Performance benchmarks and system metrics

## Safety Features

### Non-Destructive Updates

- **Backup Creation**: Creates backup before major updates
- **Incremental Updates**: Only modifies sections that need updating
- **Validation**: Checks existing content before modification
- **Rollback Support**: Maintains previous versions for rollback

### Quality Assurance

- **Link Validation**: Checks all internal and external links
- **Format Consistency**: Ensures consistent markdown formatting
- **Content Validation**: Verifies technical accuracy of updates
- **Spell Check**: Automated spell checking for documentation

## Timestamp Formats

### Standard Format
```markdown
*Last Updated: 2025-01-16 14:30:00*
*Status: Production Ready | Health: 95% | Demo Ready: ✅*
```

### Detailed Format
```markdown
*Documentation Update Log:*
- *Updated: 2025-01-16 14:30:00*
- *By: Claude Code Assistant*
- *Version: HELiiX Hybrid Architecture v2.1*
- *Changes: Case sensitivity fixes, build optimization*
```

### Component-Specific Format
```markdown
*Frontend Documentation - Updated: 2025-01-16 14:30:00*
*Backend Documentation - Updated: 2025-01-16 14:25:00*
*API Documentation - Updated: 2025-01-16 14:20:00*
```

## 🔄 CST Workflow Implementation

### **After Major Changes - ALWAYS Execute:**

```bash
# STEP 1: Immediate state update (prevents "starting over")
update-docs state

# STEP 2: If rules/policies changed
update-docs sportlogic  

# STEP 3: Complete CST protocol  
update-docs all
```

### **CST Protocol Execution Order:**

1. **STATE** → Update CLAUDE.md Session Status + PROJECT_STATE.md
2. **SPORTLOGIC** → Regenerate snapshot if rules/policies changed  
3. **CLAUDE** → Update Recent Major Changes section
4. **PROJECT-STATE** → Update health indicators and session summaries
5. **README** → Update current project status
6. **Legacy components** → API/Architecture docs if needed

### **Clean-As-You-Go Integration:**

```markdown
During documentation updates:
✅ Delete orphaned files immediately
✅ Remove empty directories after moves  
✅ Clean up temp files after operations
✅ Update import paths when restructuring
❌ Never leave "TODO: cleanup later" items
```

## Session Handoff Protocol

### **Before Taking Breaks:**

```bash
# Always execute before breaks/handoffs
update-docs state
```

**Documents:**

- What was just completed
- Current state of work  
- Next logical steps
- Any known issues
- Pending SportLogic updates if rules changed

### **After Returning:**

1. Read CLAUDE.md "Session Status"  
2. Check PROJECT_STATE.md health indicators
3. Verify no cleanup needed
4. Continue from documented next steps

## Success Metrics

**CST Protocol Success Indicators:**
✅ Can return to development immediately after breaks  
✅ Clear understanding of current architecture  
✅ No time spent "figuring out" current state  
✅ Consistent file organization  
✅ Working import paths  
✅ No "starting over from square one" situations

## Impact

This command implements FlexTime's **Continuous State Tracking (CST)** protocol - the primary documentation workflow that prevents technical debt accumulation and ensures seamless development continuity across sessions.

**Result:** FlexTime CST Documentation Update Complete - living documentation that reflects current reality with comprehensive state tracking implemented.
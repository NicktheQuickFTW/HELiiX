# Prime Context Command

**Purpose**: Load core FlexTime documentation into context and establish documentation maintenance protocol

**When to use**: At the start of EVERY coding session, before ANY task execution

---

## Step 1: Load Core Documentation (MANDATORY)

Read these files in order to understand FlexTime's architecture, conventions, and current state:

1. **[FLEXTIME-SSOT.md](../../docs/FLEXTIME-SSOT.md)** - The One Doc to Rule Them All™
   - Single entry point to all FlexTime artifacts
   - Emergency exits, quick wins, navigation hub
   - Project context snapshot + tech stack
   - Anti-patterns (what NOT to do)

2. **[README.md](../../README.md)** - Project overview
   - High-level architecture
   - Getting started instructions
   - Key features and capabilities

3. **[AGENTS.md](../../AGENTS.md)** - Agent directory
   - Available agents and their specializations
   - Agent coordination patterns
   - When to use which agent

4. **[CLAUDE.md](../../CLAUDE.md)** - Coding agent guide
   - Day-to-day operational playbook
   - Schedule-first ground rules
   - Solver defaults and coding flow
   - Testing expectations

---

## Step 2: Understand Current Context

After reading core docs, check:

- **Project Status** (from FLEXTIME-SSOT.md TL;DR)
  - Schedule-first identifiers (TEXT `schedule_id`)
  - Supabase MCP mandatory for all data access
  - SchedulingOrchestrator is unified path
  - Phase 2 is final (no Phase 3)
  - HELiiX branding (never "Helix" or "helix")

- **Tech Stack** (from FLEXTIME-SSOT.md)
  - Node.js 22+, pnpm 10.20, Next.js 15
  - Supabase Postgres, Redis, ClickHouse
  - GPT-5.1 orchestration

- **Anti-Patterns to Avoid** (from FLEXTIME-SSOT.md)
  - ❌ Writing code without gathering context from Supabase MCP first
  - ❌ Reinventing UI components (use 21st.dev MCP + Once UI when appropriate)
  - ❌ Manual research instead of using Perplexity MCP
  - ❌ Skipping CodeRabbit review (mandatory)

- **MCP Tools to Use** (from FLEXTIME-SSOT.md)
  - 🔍 Supabase MCP: Gather DB context before coding (fallback: Supabase CLI + `.env.local`)
  - 🌐 Perplexity MCP: Web search, deep research, populate DB tables
  - 🎨 21st.dev MCP: New components, design inspiration

---

## Step 3: Documentation Maintenance Protocol

**During task execution, you MUST update these docs when:**

### Update FLEXTIME-SSOT.md when:
- [ ] Adding new architecture artifacts (add to Navigation Hub)
- [ ] Creating new flowcharts/diagrams (add to Visual Architecture)
- [ ] Adding new operational runbooks (add to Operations & CLI)
- [ ] Deprecating features/patterns (add to Deprecation Log)
- [ ] Completing major milestones (add to Recently Updated)

**Update checklist** (from FLEXTIME-SSOT.md maintenance section):
- [ ] Add/adjust link in Navigation Hub table
- [ ] Include "Use When..." context for the link
- [ ] Verify target file has status banner with date + next steps
- [ ] Ensure cross-links point back to SSOT
- [ ] Update "Recently Updated" section

---

### Update README.md when:
- [ ] Changing project structure or architecture
- [ ] Adding new features or capabilities
- [ ] Updating installation/setup instructions
- [ ] Modifying key dependencies or tech stack

---

### Update AGENTS.md when:
- [ ] Creating new agents or specialized workers
- [ ] Changing agent responsibilities or capabilities
- [ ] Deprecating agents or merging agent types
- [ ] Adding new agent coordination patterns

---

### Update CLAUDE.md when:
- [ ] Changing operational workflows or processes
- [ ] Adding new solver defaults or configuration
- [ ] Updating testing expectations or coverage targets
- [ ] Adding new tools, scripts, or CLI commands
- [ ] Changing coding standards or conventions

---

## Step 4: Pre-Flight Checklist

Before starting ANY task, verify:

- ✅ I have read all 4 core docs (FLEXTIME-SSOT, README, AGENTS, CLAUDE)
- ✅ I understand the schedule-first architecture
- ✅ I know which Supabase MCP tools to use
- ✅ I know the anti-patterns to avoid
- ✅ I know which docs need updates for my task
- ✅ I will update docs BEFORE marking task complete

---

## Step 5: Post-Task Checklist

After completing ANY task, verify:

- ✅ All relevant docs updated (FLEXTIME-SSOT, README, AGENTS, CLAUDE)
- ✅ FLEXTIME-SSOT.md "Recently Updated" section includes my changes
- ✅ Cross-references are bidirectional (new doc ↔ SSOT)
- ✅ CodeRabbit review completed (`coderabbit review --plain`)
- ✅ Tests passing (`pnpm test`)
- ✅ Lints clean (`pnpm lint`)

---

## Example Workflow

```bash
# 1. Prime context (read all core docs)
# → Read FLEXTIME-SSOT.md, README.md, AGENTS.md, CLAUDE.md

# 2. Identify task scope
# → "Add new Phase 1 solver variant using pattern library"

# 3. Determine which docs need updates
# → FLEXTIME-SSOT.md (add to Recently Updated)
# → CLAUDE.md (update solver defaults section)

# 4. Execute task
# → Implement feature with TDD
# → Run tests and lints

# 5. Update documentation
# → Update FLEXTIME-SSOT.md Recently Updated
# → Update CLAUDE.md solver defaults
# → Ensure cross-references exist

# 6. CodeRabbit review
# → coderabbit review --plain
# → Apply feedback
# → Re-review until clean

# 7. Mark task complete
```

---

## Emergency Shortcuts

If you're **ON FIRE** and need immediate guidance:

1. **Production broken?** → [FT Lab Runbook](../../docs/operations/runbooks/FT_LAB_RUNBOOK.md)
2. **Solver failing?** → [Phase 1 Solver](../../docs/architecture/diagrams/phase1-solver.md) + [Phase 2 Solver](../../docs/architecture/diagrams/phase2-solver.md)
3. **What is this agent?** → [Agent Hierarchy](../../docs/architecture/diagrams/agent-hierarchy.md)
4. **Supabase query failing?** → [Data Architecture](../../docs/architecture/data-architecture.md)

---

## Success Criteria

You have successfully primed context when:

- ✅ All 4 core docs loaded into context
- ✅ Current project status understood
- ✅ Anti-patterns identified and avoided
- ✅ Documentation maintenance protocol established
- ✅ Pre-flight and post-task checklists reviewed

**Remember**: Documentation is not an afterthought. It's part of the task. If the docs aren't updated, the task isn't done.

---

## Usage

```bash
# Run this command at start of EVERY session
/prime-context

# Or invoke via Claude commands UI
# Commands → prime-context
```

**Output**: Agent confirms context loaded + lists which docs need updates for current task

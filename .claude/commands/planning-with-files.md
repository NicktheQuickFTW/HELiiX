# Planning With Files

**Command**: `/planning-with-files`
**Category**: Agent Workflow
**Last Updated**: 2026-01-07

> **IMPORTANT**: This is a registered Claude Code slash command. The `**Command**: /planning-with-files` line is required for command discovery.

---

## Purpose

Enable the Planning With Files workflow so complex tasks use persistent markdown files for planning, notes, and deliverables.

---

## Source Skill

- `.claude/skills/planning-with-files/SKILL.md`

---

## Quick Start

```bash
/planning-with-files "Plan and implement feature X"
```

---

## Workflow

1. Create `task_plan.md` in the working directory.
2. Define phases and status using the template from the source skill.
3. Create `notes.md` for research and findings.
4. Create the final deliverable file when execution is complete.
5. Re-read `task_plan.md` before major decisions and update it after each phase.

---

## When to Use

- Multi-step tasks (3+ steps)
- Research or analysis tasks
- Any work that benefits from structured progress tracking

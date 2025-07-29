# Project Context Command

Read all project documentation to get up to speed with the HELiiX-OS platform.

## Command: /project-context

### Files to Read (in order):

1. **Project Overview**
   - `/Users/nickw/Documents/XII-Ops/HELiiX/README.md`
   - `/Users/nickw/Documents/XII-Ops/HELiiX/CLAUDE.md`
   - `/Users/nickw/Documents/XII-Ops/HELiiX/.claude/PROJECT_CONTEXT.md`

2. **Planning & Architecture**
   - `/Users/nickw/Documents/XII-Ops/HELiiX/PLANNING.md`
   - `/Users/nickw/Documents/XII-Ops/HELiiX/INITIAL.md` (if exists)

3. **Current Tasks**
   - `/Users/nickw/Documents/XII-Ops/HELiiX/TASK.md` (if exists)

4. **Configuration**
   - `/Users/nickw/Documents/XII-Ops/HELiiX/package.json` (dependencies and scripts)
   - `/Users/nickw/Documents/XII-Ops/HELiiX/.claude/settings.local.json` (permissions)

### Quick Summary After Reading:

**HELiiX-OS** is an AI-powered operations platform for the Big 12 Conference that:

- Manages real-time logistics across 16 member institutions
- Handles financial operations ($126.2M+ distributions)
- Integrates with FlexTime for sports scheduling (2,437+ games, 94% efficiency)
- Tracks 1,250+ award items and 147 policy documents

**Tech Stack:**

- Next.js 15 with TypeScript
- Custom Tailwind CSS components (NO external UI libraries)
- Supabase PostgreSQL (competition & public schemas)
- Multi-provider AI (Claude, GPT-4, Gemini, Perplexity)
- Pinecone for vector search
- pnpm package manager (required)

**Key Guidelines:**

- Components in `/src/components/ui/` using class-variance-authority
- Keep components under 300 lines
- Access competition schema through public views only
- Run `pnpm run lint` and `pnpm run type-check` before committing
- AI response time target: < 3ms

**Development:**

```bash
pnpm run dev          # Start dev server (port 3002)
pnpm run lint         # Check code quality
pnpm run type-check   # TypeScript checking
```

### Usage:

```
/project-context
```

This command will read all documentation and provide a comprehensive understanding of the HELiiX-OS platform, its architecture, and development guidelines.

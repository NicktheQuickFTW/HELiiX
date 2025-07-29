# Update Documentation Command

Update all project documentation to ensure consistency and accuracy across the HELiiX-OS platform.

## Command: /update-docs

### Files to Update:

1. **Core Documentation**
   - `/Users/nickw/Documents/XII-Ops/HELiiX/README.md`
   - `/Users/nickw/Documents/XII-Ops/HELiiX/CLAUDE.md`
   - `/Users/nickw/Documents/XII-Ops/HELiiX/.claude/PROJECT_CONTEXT.md`

2. **Planning & Architecture**
   - `/Users/nickw/Documents/XII-Ops/HELiiX/PLANNING.md`
   - `/Users/nickw/Documents/XII-Ops/HELiiX/INITIAL.md` (if exists)
   - `/Users/nickw/Documents/XII-Ops/HELiiX/TASK.md` (if exists)

3. **Configuration Files**
   - `/Users/nickw/Documents/XII-Ops/HELiiX/package.json` (scripts and metadata)
   - `/Users/nickw/Documents/XII-Ops/HELiiX/.claude/settings.local.json` (permissions)

4. **Claude Commands**
   - `/Users/nickw/Documents/XII-Ops/HELiiX/.claude/commands/project-context.md`
   - `/Users/nickw/Documents/XII-Ops/HELiiX/.claude/commands/update-docs.md` (this file)

### Update Checklist:

When updating documentation, ensure:

1. **Naming Consistency**
   - Project name: HELiiX-OS
   - Platform references are consistent
   - SEO metadata uses HELiiX-OS

2. **Technical Accuracy**
   - Tech stack: Custom Tailwind CSS components (NO external UI libraries)
   - Package manager: pnpm (required)
   - Ports: dev (3002), turbo (3000), production (4000)
   - Database: Supabase PostgreSQL (competition & public schemas)

3. **Component Architecture**
   - Components in `/src/components/ui/`
   - Using class-variance-authority for variants
   - Pure Tailwind CSS classes
   - Components under 300 lines

4. **Current Statistics** (update if changed)
   - 16 Big 12 member institutions
   - 2,437+ games managed
   - 94% scheduling efficiency
   - 1,250+ award items tracked
   - $126.2M+ distributions managed
   - 147 policy documents
   - 2.3ms AI response time

5. **Development Commands**

   ```bash
   pnpm run dev          # Start dev server (port 3002)
   pnpm run lint         # ESLint checking
   pnpm run type-check   # TypeScript checking
   pnpm run format       # Prettier formatting
   ```

6. **Remove Outdated References**
   - Once UI mentions
   - shadcn/ui references
   - Deprecated scripts (analyze:shadcn, migrate:once-ui)

### Usage:

```
/update-docs
```

This command will systematically update all documentation files to ensure they reflect the current state of the HELiiX-OS platform.

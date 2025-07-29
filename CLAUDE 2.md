# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🔄 Project Awareness & Context

- **Always read `PLANNING.md`** at the start of a new conversation to understand the project's architecture, goals, style, and constraints
- **Check `TASK.md`** before starting work to see active tasks and mark completed items
- **Review `INITIAL.md`** for feature-specific context and requirements
- **Use PRPs (Project Requirement Prompts)** in `/PRPs/` for structured implementation

## Project Overview

HELiiX is a comprehensive AI-powered operations platform for the Big 12 Conference, managing real-time logistics, financial oversight, and operational intelligence across all 16 member institutions. The platform integrates with FlexTime for sports scheduling with 94% efficiency across 2,437+ games.

## Development Commands

```bash
# Development
pnpm run dev          # Start dev server (port 3002)
pnpm run dev:turbo    # Start with Turbopack (port 3000)
pnpm run build        # Production build
pnpm run start        # Start production server (port 4000)

# Code Quality
pnpm run lint         # Run ESLint
pnpm run lint:fix     # Fix ESLint issues
pnpm run type-check   # TypeScript type checking
pnpm run format       # Format with Prettier
pnpm run format:check # Check formatting

# Database
pnpm run db:migrate   # Run Supabase migrations
pnpm run db:reset     # Reset database schema
pnpm run db:seed      # Seed initial data

# Maintenance
pnpm run clean        # Clean build artifacts
pnpm run analyze:shadcn # Analyze shadcn usage (deprecated)
pnpm run migrate:once-ui # Migrate to Once UI
```

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 15 with App Router and TypeScript
- **Database**: Supabase PostgreSQL with real-time subscriptions
  - **Schemas**: Uses both `competition` and `public` schemas
  - Competition schema accessed via public views and triggers (see FlexTime integration)
- **AI**: Multi-provider support via Vercel AI SDK (OpenAI, Anthropic, Google, Perplexity)
- **UI**: Once UI (@once-ui-system/core) - DO NOT use shadcn/ui or other UI libraries
- **Styling**: Tailwind CSS v4 with Once UI design tokens
- **Vector Search**: Pinecone for semantic document retrieval
- **Package Manager**: pnpm (required)

### Directory Structure

```
src/
├── app/              # Next.js App Router pages and API routes
│   ├── api/         # REST API endpoints (organized by feature)
│   └── (pages)/     # Application pages
├── components/       # React components (Once UI only)
├── lib/             # Core utilities and services
│   ├── db/          # Database schemas and connections
│   ├── ai-providers.ts # AI provider configurations
│   └── supabase/    # Supabase client and schemas
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── resources/       # Once UI configuration
└── scripts/         # Build and migration scripts
```

### API Route Organization

- `/api/ai/*` - AI services (chat, search, categorization)
- `/api/auth/*` - Authentication endpoints
- `/api/awards/*` - Awards management
- `/api/basketball/*` - Basketball analytics
- `/api/invoices/*` - Invoice processing
- `/api/policies/*` - Policy management
- `/api/sports/*` - Sports data and social sentiment
- `/api/notion/*` - Notion integration
- `/api/x/*` - X (Twitter) integration

## Key Implementation Guidelines

### UI Components - Pure Tailwind + Custom Components

```tsx
// Use simple, custom components with Tailwind CSS
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

// Component structure:
// - Simple, focused components
// - Tailwind classes for styling
// - TypeScript interfaces for props
// - No external UI library dependencies
```

### Component Guidelines

- Keep components simple and single-purpose
- Use Tailwind classes directly
- Create variants with TypeScript discriminated unions
- Ensure accessibility with proper ARIA attributes
- Test components in isolation

### Database Schema Access

- Primary schema: `competition` (accessed via public views)
- Public views created for all competition tables (schools, teams, venues, games, etc.)
- Use public schema views when querying from JavaScript client
- Row Level Security (RLS) enabled on all tables

### Environment Configuration

- Environment variables stored in `.env.local`
- Global environment variables in `~/.env/`
- Never modify `.env` files directly
- Required keys: SUPABASE_URL, SUPABASE_ANON_KEY, AI provider keys, PINECONE_API_KEY

### AI Integration Patterns

- Multi-provider AI with 2.3ms average processing
- Use appropriate provider based on task:
  - Claude: Complex reasoning, code generation
  - GPT-4: General purpose, structured data
  - Gemini: Multimodal tasks
  - Perplexity: Real-time web search
- Semantic search via Pinecone for policy documents

### Performance Standards

- AI Processing: < 3ms response time
- API Uptime: > 99.9% availability
- System Health: > 95% operational status
- Build ignores TypeScript/ESLint errors (fix in development)

### Big 12 Conference Context

- 16 member schools with specific sport participation
- 23 different sports tracked
- Financial tracking aligned with Big 12 account codes (e.g., 4105 for Awards)
- Class codes: S-050 (Regular Season), S-060 (Championship)

## Common Development Tasks

### Adding New API Endpoints

1. Create route in `src/app/api/[feature]/route.ts`
2. Use consistent REST patterns
3. Implement proper error handling
4. Add TypeScript types in `src/types/`

### Working with Supabase

```typescript
// Always use the public views for competition schema
const { data } = await supabase
  .from('teams') // This accesses public.teams view
  .select('*')
  .eq('school_id', schoolId);
```

### SEO Metadata Pattern

```typescript
import { Meta } from '@/components/modules';
import { baseURL, meta } from '@/resources/once-ui.config';

export const metadata = Meta.generate({
  title: meta.page.title,
  description: meta.page.description,
  baseURL,
  path: '/route',
});
```

## PRP Methodology

### Creating PRPs

1. **Context is King**: Include ALL necessary documentation, examples, and gotchas
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance

### Executing PRPs

1. **Load PRP**: Read and understand all context and requirements
2. **Plan**: Create comprehensive task breakdown
3. **Execute**: Implement following the blueprint
4. **Validate**: Run each validation command, fix failures
5. **Complete**: Ensure all checklist items done

### PRP Structure

- **Goal**: Specific end state
- **Why**: Business value and impact
- **What**: User-visible behavior
- **Context**: Documentation, examples, gotchas
- **Blueprint**: Task list with pseudocode
- **Validation**: Executable test commands

## Code Structure & Modularity

- **Never create files > 500 lines** - split into modules if approaching limit
- **Organize by feature**: Group related functionality together
- **Use clear imports**: Prefer relative imports within packages
- **Component structure**: Keep under 300 lines, split complex components

## Testing & Reliability

- **Always create tests** for new features
- **Update existing tests** when logic changes
- **Test structure**: Mirror main app in `/tests` folder
- **Coverage**: Expected use + edge case + failure case
- **Run validation loops**: Never skip the PRP validation steps

## Task Management

- **Mark tasks complete** in TASK.md immediately after finishing
- **Add discovered tasks** under "Discovered During Work" section
- **Update PRPs** if requirements change during implementation

## Critical Reminders

- Use pure Tailwind CSS with custom components
- Keep components simple and focused
- Access competition schema through public views only
- Run lint and type-check before committing
- Follow existing patterns in codebase
- Keep AI response times under 3ms
- Document Big 12 specific logic clearly
- Always use PRPs for feature implementation
- Never skip validation loops

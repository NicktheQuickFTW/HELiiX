# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Last Updated: 2025-01-31

## 🚀 Agent OS Integration

HELiiX-OS now implements Agent OS for enhanced structured development workflows while maintaining our existing PRP methodology.

### Agent OS Structure

- **Global Configuration**: `~/.heliix-agent-os/` - Shared standards and templates
- **Project Integration**: `.heliix/agent-os/` - Project-specific specs and agents
- **Shared Agents**: `heliix-context-fetcher`, `big12-validator`, `award-tracker-agent`

### Using Agent OS

1. **For New Features**: Use `@~/.agent-os/instructions/create-spec.md` workflow
2. **For Context**: Deploy `@agent:heliix-context-fetcher` for conditional loading
3. **For Validation**: Use `@agent:big12-validator` for conference compliance
4. **Keep PRPs**: Continue using PRPs for complex implementations

## 🔄 Project Awareness & Context

- **Always read `PLANNING.md`** at the start of a new conversation to understand the project's architecture, goals, style, and constraints
- **Check `TASK.md`** before starting work to see active tasks and mark completed items
- **Review `INITIAL.md`** for feature-specific context and requirements
- **Use PRPs (Project Requirement Prompts)** in `/PRPs/` for structured implementation
- **Check Agent OS specs** in `.heliix/agent-os/specs/` for feature specifications

## Project Overview

HELiiX-OS is a dual-purpose platform:

1. **Public Website**: HELiiX AI Solutions corporate marketing site showcasing AI services for collegiate athletics
2. **Internal Platform**: Comprehensive AI-powered operations platform for the Big 12 Conference, managing real-time logistics, financial oversight, and operational intelligence across all 16 member institutions

The platform integrates with FlexTime for sports scheduling with 94% efficiency across 2,437+ games.

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
pnpm run analyze:components # Analyze component usage
pnpm run check:types  # TypeScript type checking
```

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 15 with App Router and TypeScript
- **Database**: Supabase PostgreSQL with real-time subscriptions
  - **Schemas**: Uses both `competition` and `public` schemas
  - Competition schema accessed via public views and triggers (see FlexTime integration)
- **AI**: Multi-provider support via Vercel AI SDK (OpenAI, Anthropic, Google, Perplexity)
- **UI**: Custom Tailwind CSS components with class-variance-authority
- **Styling**: Tailwind CSS v4 with custom design system
- **Vector Search**: Pinecone for semantic document retrieval
- **Package Manager**: pnpm (required)

### Directory Structure

```
src/
├── app/              # Next.js App Router pages and API routes
│   ├── api/         # REST API endpoints (organized by feature)
│   └── (pages)/     # Application pages
├── components/       # React components
│   └── ui/          # Custom Tailwind components
├── lib/             # Core utilities and services
│   ├── db/          # Database schemas and connections
│   ├── ai-providers.ts # AI provider configurations
│   └── supabase/    # Supabase client and schemas
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
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
export const metadata = {
  title: 'Page Title | HELiiX-OS',
  description: 'Page description for the specific page',
  keywords: ['Big 12', 'Athletics', 'Operations'],
  robots: { index: false, follow: false }, // for internal pages
};
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

- Use custom Tailwind CSS components from `/src/components/ui/`
- **AVOID Once UI components** - they overcomplicate UI development
- Keep components simple and focused (under 300 lines)
- Use class-variance-authority for component variants
- Access competition schema through public views only
- Run lint and type-check before committing
- Follow existing patterns in codebase
- Keep AI response times under 3ms
- Document Big 12 specific logic clearly
- Always use PRPs for feature implementation
- Never skip validation loops

# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.

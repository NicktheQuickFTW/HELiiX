# HELiiX Platform - AI Agent Instructions

## Quick Start for AI Agents

You are assisting with the HELiiX platform, a comprehensive operations system for the Big 12 Conference. This document provides essential context for understanding and working with the codebase.

## 🎯 Platform Overview

HELiiX is a Next.js 15+ application built with React 19, TypeScript, and Supabase. It manages:

- Awards programs and championships
- Financial operations and invoicing
- Team and venue management
- AI-powered analytics and assistance
- Real-time sports scheduling

## 🚨 Critical Rules

### 1. UI Components - ONLY Use Once UI

```tsx
// ✅ CORRECT - Import from Once UI
import { Button, Column, Row, Text } from '@once-ui-system/core';

// ❌ WRONG - Never use these
import { Button } from '@/components/ui/button'; // NO shadcn
import { Box } from '@mui/material'; // NO Material UI
import * as RadixUI from '@radix-ui/react-*'; // NO direct Radix
```

### 2. File Operations

- **NEVER** create new files unless explicitly requested
- **ALWAYS** prefer editing existing files
- **NEVER** create README.md or documentation files proactively
- **ALWAYS** check if a component/utility already exists before creating

### 3. Code Style

- **NO COMMENTS** unless specifically requested
- Follow existing patterns in neighboring files
- Use existing utilities and helpers (check `/src/lib/utils/`)
- Maintain TypeScript type safety

## 📁 Project Structure

```
src/
├── app/              # Pages and API routes
├── components/       # Reusable components
├── lib/             # Core utilities
│   ├── db/          # Database schemas
│   ├── supabase/    # Supabase client
│   └── utils/       # Shared utilities
└── resources/       # Config files
```

## 🔧 Common Tasks

### Working with Database

```typescript
// Always use the Supabase client
import { createClient } from '@/lib/supabase/server';

// Check existing schemas in src/lib/db/
// Main tables: awards, teams, championships, invoices
```

### Creating UI Components

```tsx
// Always use Once UI components
import { Column, Row, Card, Button } from '@once-ui-system/core';

// Check existing components first:
// - src/components/big12/ for conference-specific
// - src/components/ui/ for base components
// - src/components/charts/ for visualizations
```

### API Routes

```typescript
// Location: src/app/api/[feature]/route.ts
// Use Next.js 15 route handlers
// Check rate limiting and auth
```

### AI Integration

```typescript
// Multi-provider setup in src/app/api/ai/
// Providers: OpenAI, Anthropic, Google, Perplexity
// Use existing AI components in src/components/ai/
```

## 🏈 Big 12 Context

- **16 Member Schools**: Arizona, Arizona State, Baylor, BYU, UCF, Cincinnati, Colorado, Houston, Iowa State, Kansas, K-State, Oklahoma State, TCU, Texas Tech, Utah, West Virginia
- **25 Sports** with varying participation
- **Key Roles**: admin, finance, operations, marketing, viewer

## 🛠️ Development Commands

```bash
# Development
pnpm dev          # Standard dev server (port 3002)
pnpm turbo        # Turbopack dev (port 3000)

# Database
pnpm db:reset     # Reset database
pnpm db:migrate   # Run migrations

# Quality
pnpm lint         # Run ESLint
pnpm typecheck    # Check TypeScript
```

## 🔐 Environment Variables

Required in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- AI provider keys (OPENAI_API_KEY, etc.)

## 📋 Common Patterns

### Data Fetching

```typescript
// Use React Query hooks from existing implementations
// Check src/app/[feature]/page.tsx for examples
```

### Authentication

```typescript
// Always check auth using Supabase
const user = await getAuthUser();
if (!user) redirect('/auth/signin');
```

### Styling

```tsx
// Use Once UI design tokens
// Configure in resources/once-ui.config.js
// Dark mode is default
```

## ⚠️ Common Pitfalls

1. **Don't import from `@/components/ui/`** - these are old shadcn components
2. **Don't create new database tables** - use existing schema
3. **Don't add comments** to code unless asked
4. **Don't assume libraries exist** - check package.json first
5. **Don't create test files** unless explicitly requested

## 🎯 When Working on Features

1. **Search first** - Most patterns already exist
2. **Check similar features** - Follow established conventions
3. **Use existing utilities** - Don't reinvent the wheel
4. **Maintain consistency** - Match the codebase style

Remember: The codebase is well-structured with established patterns. When in doubt, look for similar implementations before creating something new.

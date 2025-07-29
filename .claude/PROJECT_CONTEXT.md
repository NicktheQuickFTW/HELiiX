# Project Context for HELiiX-OS

Last Updated: 2025-01-29

## Platform Overview

HELiiX-OS is a dual-purpose platform:
1. **Public Website**: Professional marketing site for HELiiX AI Solutions at `/`
2. **Internal Platform**: AI-powered operations system for Big 12 Conference

## UI Component Architecture

HELiiX-OS uses custom Tailwind CSS components for maximum simplicity and maintainability. NO external UI libraries are used.

### Component Guidelines

- All UI components located in `/src/components/ui/`
- Pure Tailwind CSS classes for styling
- Variants managed with class-variance-authority (cva)
- Full TypeScript support with proper interfaces
- Components kept under 300 lines for maintainability

### Example Component Pattern

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
```

### Styling Approach

- Direct Tailwind utility classes
- No complex prop abstractions
- Clear, readable variant definitions
- Consistent spacing and design tokens

### Performance Considerations

- Minimal runtime overhead
- Tree-shakeable components
- Optimized bundle size
- No external UI library dependencies

## Development Hooks

### Git Hooks (Husky)

Located in `.husky/` - automatically run during Git operations:

1. **pre-commit**: Runs `pnpm lint-staged` to format and lint staged files
2. **commit-msg**: Validates commit message format (conventional commits)
3. **pre-push**: Runs type checking, linting, and build before pushing

### Claude Hooks

Located in `.claude/hooks/` - enhance AI-assisted development:

1. **pre-commit**: Type checking, linting, console.log detection, component size validation
2. **post-commit**: Updates timestamps, generates commit summary, checks for TODOs
3. **pre-edit**: File size warnings, component/API/database-specific reminders
4. **pre-run**: Command safety checks, environment validations, helpful reminders

### Conventional Commit Format

```
type(scope?): subject

Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
Example: feat(auth): add login functionality
```

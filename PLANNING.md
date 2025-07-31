# PLANNING.md

## Project Architecture

HELiiX-OS is a comprehensive AI-powered operations platform for the Big 12 Conference with dual purposes:

1. **Public-facing corporate website** - Marketing HELiiX AI Solutions' services
2. **Internal operations platform** - Managing conference logistics, finances, and analytics

### Tech Stack

- **Framework**: Next.js 15 with App Router and TypeScript
- **UI Library**: Custom Tailwind CSS components with class-variance-authority
- **Database**: Supabase PostgreSQL (competition & public schemas)
- **AI**: Multi-provider support via Vercel AI SDK
- **Styling**: Tailwind CSS v4 with custom design system
- **Package Manager**: pnpm (required)

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (landing)/         # Public corporate website
│   ├── (platform)/        # Internal operations platform
│   └── api/               # API routes
├── components/            # React components
│   └── ui/               # Custom Tailwind components
├── lib/                   # Core utilities and services
├── PRPs/                  # Project Requirement Prompts
└── docs/                  # Context engineering docs
```

### Naming Conventions

- **Components**: PascalCase (e.g., `HeroSection.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **API Routes**: kebab-case (e.g., `api/auth/login`)
- **Database Tables**: snake_case (e.g., `award_recipients`)

### Architecture Patterns

- **Component Pattern**: Modular, reusable custom Tailwind components
- **Data Fetching**: Server Components with Suspense boundaries
- **State Management**: React Context + Zustand for complex state
- **Error Handling**: Error boundaries with fallback UI
- **Authentication**: Supabase Auth with RLS

### Development Workflow

1. Read PLANNING.md and TASK.md before starting
2. Create/update PRPs for new features
3. Follow validation loops in PRPs
4. Update documentation as you go
5. Use Agent OS for structured development workflows

### Style Guidelines

- Use Tailwind CSS utility classes directly
- Maintain consistent spacing with Tailwind's design system
- Use class-variance-authority for component variants
- Follow mobile-first responsive design
- Use semantic HTML elements
- Implement proper accessibility (ARIA labels, keyboard navigation)

### Constraints

- NO external UI libraries (including Once UI) - custom Tailwind components only
- Keep components under 300 lines
- Maintain 95%+ TypeScript coverage
- All API responses must include proper error handling
- Follow Big 12 Conference branding guidelines
- Avoid Once UI components as they overcomplicate UI development

## Goals

### Phase 1: Corporate Website (Completed ✅)

- Implement HELiiX AI Solutions marketing site
- Showcase AI services for collegiate athletics
- Professional black/white design theme
- Smooth animations and interactions
- All 8 sections implemented with responsive design

### Phase 2: Platform Integration

- Seamless transition from public to authenticated platform
- Maintain consistent branding
- Preserve all existing platform functionality
- Enhanced AI assistant integration

### Phase 3: Extended Features

- Advanced analytics dashboards
- Real-time collaboration tools
- Mobile application
- API marketplace for third-party integrations

Last Updated: 2025-01-31

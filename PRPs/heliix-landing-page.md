name: "HELiiX AI Solutions Landing Page Implementation"
description: |

## Purpose

Convert the existing React/shadcn design to a Next.js 15 implementation using pure Tailwind CSS with custom components for the HELiiX AI Solutions corporate website, maintaining the professional black/white theme and all interactive features.

## Core Principles

1. **Context is King**: All design references and component mappings included
2. **Validation Loops**: Type checking, responsive testing, performance metrics
3. **Information Dense**: Complete component conversion guide provided
4. **Progressive Success**: Section-by-section implementation with testing

---

## Goal

Create a professional marketing website for HELiiX AI Solutions that showcases AI services for collegiate athletics, replacing the current operations-focused landing page while preserving the internal platform functionality.

## Why

- **Business Value**: Establish HELiiX as a leader in AI solutions for collegiate athletics
- **User Impact**: Clear value proposition for conference administrators and athletic directors
- **Integration**: Seamless path from marketing site to operational platform
- **Problems Solved**: Currently no public-facing presence for the company behind the platform

## What

A single-page marketing website with:

- Hero section with animated logo and CTAs
- About section highlighting AI capabilities
- Solutions showcase (6 core services)
- Technology stack with compliance badges
- Big 12 Conference case study
- Leadership team profiles
- Contact form with partnership inquiries
- Professional footer with links

### Success Criteria

- [ ] All 8 sections implemented with Tailwind CSS custom components
- [ ] Smooth scrolling navigation working
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] All animations performing at 60fps
- [ ] Contact form submitting to Supabase
- [ ] Lighthouse score > 90 on all metrics

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- file: /Users/nickw/Downloads/HELiiX AI Web App/App.jsx
  why: Complete React implementation to convert

- file: /Users/nickw/Downloads/HELiiX AI Web App/App.css
  why: Custom styles and animations to adapt

- doc: https://tailwindcss.com/docs
  why: Tailwind CSS documentation for styling

- file: /src/app/page.tsx
  why: Current implementation to replace

- doc: https://nextjs.org/docs/app/building-your-application/rendering/server-components
  section: Server Components
  critical: Default rendering mode in Next.js 15

- docfile: INITIAL.md
  why: Feature requirements and constraints
```

### Current Codebase Structure

```bash
src/
├── app/
│   ├── page.tsx          # Current landing (to replace)
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles
│   └── api/              # API routes (preserve)
├── components/
│   └── ui/               # Custom Tailwind components
└── lib/
    └── supabase/         # Database client
```

### Desired Structure with New Files

```bash
src/
├── app/
│   ├── page.tsx          # New corporate landing
│   ├── (landing)/        # Landing page components
│   │   ├── hero-section.tsx
│   │   ├── about-section.tsx
│   │   ├── solutions-section.tsx
│   │   ├── tech-stack-section.tsx
│   │   ├── case-study-section.tsx
│   │   ├── team-section.tsx
│   │   ├── contact-section.tsx
│   │   └── footer-section.tsx
│   └── landing.css       # Landing-specific styles
├── components/
│   └── landing/
│       ├── navigation.tsx
│       └── contact-form.tsx
└── public/
    └── logos/            # HELiiX logo variants
```

### Component Mapping Guide

```typescript
// shadcn/ui → Custom Tailwind conversions
Button → Custom Button with cva variants
Card, CardContent, CardHeader → Custom Card components
Input → Custom Input with Tailwind classes
Textarea → Custom Textarea with Tailwind classes
Badge → Custom Badge with cva variants
Icons (lucide) → lucide-react icons directly

// Animation mappings
Custom CSS animations → Framer Motion or CSS keyframes
Tailwind transitions → Tailwind transition utilities
Hover effects → Tailwind hover: utilities
```

### Known Gotchas

```typescript
// CRITICAL: Use cn() utility for conditional classes
// Combines clsx and tailwind-merge for proper class merging

// CRITICAL: Server Components can't use useState/useEffect
// Mark interactive components with 'use client'

// CRITICAL: Keep animations performant
// Use transform and opacity for best performance

// CRITICAL: Test responsive design thoroughly
// Use Tailwind responsive prefixes (sm:, md:, lg:, xl:)
```

## Implementation Blueprint

### Task 1: Set up landing page structure

```yaml
CREATE app/(landing)/layout.tsx:
  - Client component wrapper for landing sections
  - Import custom landing.css
  - Set up smooth scroll behavior

CREATE app/landing.css:
  - Port animations from App.css
  - Define gradient variables
  - Custom hover effects
```

### Task 2: Copy and optimize logo assets

```bash
# Copy logo files
cp "/Users/nickw/Downloads/HELiiX AI Web App/HELiiX-*.svg" public/logos/

# Verify files copied
ls -la public/logos/
```

### Task 3: Implement Navigation component

```typescript
// components/landing/navigation.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll handler for transparency effect
  // Section navigation with smooth scroll
  // Mobile menu toggle
}
```

### Task 4: Hero Section with animations

```typescript
// app/(landing)/hero-section.tsx
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Logo reveal animation
// Gradient text effects
// CTA buttons with hover states
// Stats ticker component
```

### Task 5-11: Implement remaining sections

[About, Solutions, Tech Stack, Case Study, Team, Contact, Footer]

### Task 12: Contact form with Supabase integration

```typescript
// components/landing/contact-form.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

// Form validation
// Supabase submission
// Success/error states
```

### Integration Points

```yaml
ROUTING:
  - Keep all existing routes intact
  - Landing page at root "/"
  - Platform access via "/login" and "/dashboard"

DATABASE:
  - Table: contact_inquiries
  - Columns: name, email, organization, message, created_at

STYLES:
  - Update globals.css with new color variables
  - Add landing-specific animations
  - Ensure Once UI theme compatibility
```

## Validation Loop

### Level 1: TypeScript & Linting

```bash
# Type checking
pnpm run type-check

# Linting
pnpm run lint

# Fix any errors before proceeding
```

### Level 2: Component Testing

```bash
# Start dev server
pnpm run dev

# Manual testing checklist:
# - [ ] All sections render correctly
# - [ ] Navigation scrolls to sections
# - [ ] Animations trigger on scroll
# - [ ] Forms validate properly
# - [ ] Responsive at all breakpoints
```

### Level 3: Performance Testing

```bash
# Build and analyze
pnpm run build

# Lighthouse CLI
npx lighthouse http://localhost:3000 --view

# Expected scores:
# Performance: > 90
# Accessibility: > 95
# Best Practices: 100
# SEO: 100
```

### Level 4: Cross-browser Testing

```yaml
Desktop:
  - Chrome (latest)
  - Firefox (latest)
  - Safari (latest)
  - Edge (latest)

Mobile:
  - iOS Safari
  - Chrome Android

Test:
  - Smooth scrolling
  - Animation performance
  - Form functionality
  - Responsive layout
```

## Final Validation Checklist

- [ ] All TypeScript errors resolved
- [ ] No console errors or warnings
- [ ] All sections implemented and styled
- [ ] Smooth scrolling working on all browsers
- [ ] Contact form submitting successfully
- [ ] Mobile responsive design verified
- [ ] Performance metrics meet targets
- [ ] Accessibility scan passing
- [ ] SEO metadata properly configured
- [ ] Original platform routes still functional

---

## Anti-Patterns to Avoid

- ❌ Don't use external UI libraries - custom Tailwind components only
- ❌ Don't break existing platform functionality
- ❌ Don't use client components unnecessarily
- ❌ Don't ignore TypeScript errors
- ❌ Don't skip responsive testing
- ❌ Don't hardcode colors - use CSS variables

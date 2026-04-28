---
name: vibe-coding
description: Rapidly prototype and build modern web applications from scratch with creative, experimental approach. Use when prototyping new apps, building in creative flow, or experimenting with modern frameworks locally without hosted builder constraints.
---

<objective>
Rapidly prototype and build modern, responsive web applications from scratch using current frameworks, libraries, and best practices. Handle everything from initial project setup to implementing features, styling, and basic deployment configuration with focus on creative flow and quick iteration.
</objective>

<when_to_use>
Use this skill when you want to:
- **Rapidly prototype** a new web application idea
- Work in **creative flow** and build something quickly without context switching
- Use **modern frameworks** like React, Next.js, Vue, Svelte, or similar
- Prefer **local development** with full control rather than hosted builder environments
- **Experiment and iterate fast** on designs and features
</when_to_use>

<key_capabilities>
Unlike hosted vibe-coding tools (Lovable, Bolt, v0):
- **Runs locally**: All code lives on your machine, not in a hosted environment
- **No infrastructure lock-in**: You control deployment, hosting, and infrastructure choices
- **Framework flexibility**: Not limited to a specific tech stack; can use any modern framework
- **Full backend support**: Can integrate with any backend, run local servers, use databases, etc.
- **Version control native**: Built with git workflows in mind from the start
- **No runtime environment required**: Build from scratch locally, not dependent on their infrastructure
</key_capabilities>

<required_inputs>
- **Application description**: Purpose, key features, and target users
- **Technology preferences**: Desired frameworks (React/Next.js/Vue/Svelte), styling approach (Tailwind/CSS-in-JS/CSS Modules), and any specific libraries
- **Feature requirements**: Core functionality, user flows, and data models
- **Design direction**: Style preferences, color schemes, or reference sites
- **Deployment target**: Where you plan to host (Vercel, Netlify, AWS, self-hosted, etc.)
</required_inputs>

<out_of_scope>
- Managing production infrastructure or cloud provider accounts
- Creating complex backend microservices architecture (use service-integration skill instead)
- Mobile native app development (iOS/Android)
</out_of_scope>

<conventions>
## Framework Selection
- **Always search for the most current documentation** from official sources before implementing
- Example: Search https://nextjs.org/docs for Next.js, https://react.dev for React, etc.
- **Never hardcode outdated commands or patterns** – always verify current best practices

## Project Initialization
1. Search official docs for the latest initialization command (e.g., `npx create-next-app@latest`)
2. Use TypeScript by default for type safety
3. Set up ESLint and Prettier for code quality
4. Initialize git repository from the start

## Architecture Patterns
- **Component-based**: Break UI into small, reusable components
- **Type-safe**: Use TypeScript throughout for better developer experience
- **Responsive by default**: Mobile-first design approach
- **Accessibility first**: Semantic HTML, ARIA labels, keyboard navigation
- **Performance-conscious**: Code splitting, lazy loading, optimized images

## Styling Approach
- Use modern CSS frameworks (Tailwind CSS recommended for rapid development)
- Implement consistent design system with reusable tokens for colors, spacing, typography
- Support light/dark mode when appropriate
- Ensure proper contrast ratios and accessibility

## State and Data
- Choose appropriate state management (React Context, Zustand, Redux) based on complexity
- Use modern data fetching patterns (React Query, SWR, or framework built-ins like Next.js App Router)
- Implement proper loading, error, and empty states

## Backend Integration
- If backend is needed, set up API routes or server components appropriately
- For databases, use type-safe ORMs (Prisma, Drizzle) when possible
- Implement proper error handling and validation
</conventions>

<process>
## Implementation Steps

1. **Research current best practices**: Before any implementation, search for and reference the latest official documentation
2. **Initialize properly**: Set up project with all necessary tooling, configs, and directory structure
3. **Implement features incrementally**: Build and test features one at a time
4. **Write clean, maintainable code**: Follow framework conventions and best practices
5. **Handle edge cases**: Loading states, errors, empty states, validation
6. **Ensure accessibility**: Proper semantic HTML, ARIA labels, keyboard navigation
7. **Test critical paths**: Write tests for core functionality
8. **Document setup and usage**: README with setup instructions, environment variables, and deployment notes
</process>

<required_artifacts>
- Fully initialized project with all configuration files
- Clean, well-organized component and page structure
- Styling implementation (Tailwind config, CSS modules, or chosen approach)
- **Tests** for critical user flows and business logic
- **README.md** with:
  - Project description and features
  - Setup instructions
  - Development commands
  - Environment variables needed
  - Deployment guidance
- **.gitignore** properly configured
- **Package.json** with clear scripts and dependencies
</required_artifacts>

<verification>
Run the following commands (adjust based on package manager and setup):

```bash
# Install dependencies
npm install

# Type checking
npm run type-check   # or tsc --noEmit

# Linting
npm run lint

# Tests
npm test

# Build verification
npm run build

# Run locally
npm run dev
```
</verification>

<success_criteria>
The skill is complete when:
- All commands run successfully without errors
- The application builds and runs in development mode
- Core features work as specified across different screen sizes
- Accessibility checks pass (use browser dev tools or axe extension)
- Tests cover critical user paths
- Documentation is clear and complete
</success_criteria>

<safety_and_escalation>
- **External dependencies**: Always verify package security and maintenance status before adding dependencies
- **Environment secrets**: Never commit API keys, secrets, or credentials. Use `.env.local` and document in README
- **Framework limitations**: If requirements exceed framework capabilities, suggest alternatives or clarify constraints
- **Performance concerns**: If the app requires complex state or data handling, consider suggesting more robust solutions
</safety_and_escalation>

<documentation_references>
Always search for and reference the most current documentation:
- **React**: https://react.dev
- **Next.js**: https://nextjs.org/docs
- **Vue**: https://vuejs.org/guide
- **Svelte**: https://svelte.dev/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Vite**: https://vitejs.dev/guide

Before implementing any feature, search these docs to ensure you're using current APIs and best practices.
</documentation_references>

<seo_and_web_vitals>
For public-facing applications, automatically implement:
- **Meta tags**: Title, description, Open Graph, Twitter cards
- **Structured data**: JSON-LD for rich search results
- **Performance**: Image optimization, code splitting, lazy loading
- **Core Web Vitals**: Optimize LCP, FID, CLS metrics
- **Sitemap**: Generate sitemap.xml for better indexing
- **Robots.txt**: Configure crawler behavior
</seo_and_web_vitals>

<integration>
This skill can be combined with:
- **Service integration**: When the web app needs to call existing backend services
- **Internal tools**: When building internal admin panels or dashboards
- **Internal data querying**: When the app needs to display analytics or reports
</integration>

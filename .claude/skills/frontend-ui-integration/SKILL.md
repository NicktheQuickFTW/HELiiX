---
name: frontend-ui-integration
description: Implement typed, tested frontend workflows against existing backend APIs in enterprise React/TypeScript codebases. Use when building UI/UX changes backed by existing APIs, following design system conventions, and testing requirements.
---

<objective>
Implement or extend user-facing workflows in the primary web application, integrating with existing backend APIs and following established design system, routing, and testing conventions.
</objective>

<when_to_use>
Use this skill when:
- The feature is primarily a **UI/UX change** backed by one or more existing APIs
- The backend contracts, auth model, and core business rules **already exist**
- The change affects **only** the web frontend (no schema or service ownership changes)
</when_to_use>

<required_inputs>
- **Feature description**: Short narrative of the user flow and outcomes
- **Relevant APIs**: Endpoints, request/response types, and links to source definitions
- **Target routes/components**: Paths, component names, or feature modules
- **Design references**: Figma links or existing screens to mirror
- **Guardrails**: Performance limits, accessibility requirements, and security constraints
</required_inputs>

<out_of_scope>
- Creating new backend services or changing persistent data models
- Modifying authentication/authorization flows
- Introducing new frontend frameworks or design systems
</out_of_scope>

<conventions>
## Stack Standards
- **Framework**: React with TypeScript
- **Routing**: Use the existing router and route layout patterns
- **Styling**: Use the in-house design system components (Buttons, Inputs, Modals, Toasts, etc.)
- **State management**: Prefer the existing state libraries (e.g., React Query, Redux, Zustand) and follow established patterns
</conventions>

<process>
## Implementation Steps

1. **Locate feature module** and existing components
2. **Confirm backend APIs** and types, updating shared TypeScript types if needed
3. **Implement the UI**, wiring in API calls via the existing data layer
4. **Add or update tests** to cover the new behavior and edge cases
5. **Run validation commands** (see verification section)
</process>

<required_behavior>
- Implement the UI changes with **strong typing** for all props and API responses
- Handle loading, empty, error, and success states using existing primitives
- Ensure the UI is **keyboard accessible** and screen-reader friendly
- Respect feature flags and rollout mechanisms where applicable
</required_behavior>

<required_artifacts>
- Updated components and hooks in the appropriate feature module
- **Unit tests** for core presentation logic
- **Integration or component tests** for the new flow (e.g., React Testing Library, Cypress, Playwright) where the repo already uses them
- Minimal **CHANGELOG or PR description text** summarizing the behavior change
</required_artifacts>

<verification>
Run the following (adjust commands to match the project):
- `pnpm lint`
- `pnpm test -- --runInBand --watch=false`
- `pnpm typecheck` (if configured separately)
</verification>

<success_criteria>
The skill is complete when:
- All tests, linters, and type checks pass
- The new UI behaves as specified across normal, error, and boundary cases
- No unrelated files or modules are modified
</success_criteria>

<safety_and_escalation>
- If the requested change requires backend contract changes, **stop** and request a backend-focused task instead
- If design references conflict with existing accessibility standards, favor accessibility and highlight the discrepancy in the PR description
</safety_and_escalation>

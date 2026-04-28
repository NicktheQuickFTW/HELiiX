---
name: service-integration
description: Extend existing services and wire integrations in complex enterprise codebases. Use when adding backend APIs, jobs, or events in shared monorepos with clear ownership and domain boundaries.
---

<objective>
Extend or integrate with existing services in the main backend codebase while preserving ownership boundaries, reliability standards, and observability requirements.
</objective>

<when_to_use>
Use this skill when:
- The change requires adding or modifying a backend API, job, or event
- The service lives in a **shared monorepo** with clear ownership and domain boundaries
- The work may require coordination with other teams, but the main implementation happens in our services
</when_to_use>

<required_inputs>
- **Business requirement**: Short description of the user or system behavior change
- **Primary service(s)**: Names/paths of the services and domains involved
- **Existing contracts**: Relevant API schemas, events, or message formats
- **Non-functional requirements**: Latency, error budget, data retention, and throughput expectations
- **Change management**: Rollout strategy, feature flags, or migration plan
</required_inputs>

<out_of_scope>
- Greenfield systems that require new infrastructure or data stores
- Cross-region or cross-cloud replication design
- Changes that conflict with established ownership boundaries without prior approval
</out_of_scope>

<conventions>
## Standards
- Follow the **domain boundaries** and module layout described in `AGENTS.md` and internal architecture docs
- Use existing **configuration, logging, metrics, and tracing** patterns
- Reuse established **error handling** and **retry/backoff** utilities
</conventions>

<process>
## Implementation Steps

1. **Identify ownership** and confirm which service(s) should change
2. **Map data and control flow** across services and dependencies
3. **Design the integration surface** (API, event, or job) and validate it against existing conventions
4. **Implement the change**, keeping related files and modules co-located
5. **Add or update tests** at the appropriate layers (unit, integration, contract)
6. **Ensure observability** - logs/metrics/traces make the new behavior debuggable in production
7. **Wire in feature flags** or configuration for safe rollout if necessary
</process>

<required_behavior>
- Introduce new APIs, jobs, or events using existing framework patterns
- Maintain backwards compatibility wherever possible; if breaking changes are required, document migration steps
- Ensure all new behavior is observable via logs, metrics, and/or traces
- Respect existing security and privacy requirements (authN/Z, PII handling, data residency)
</required_behavior>

<required_artifacts>
- Code changes in the relevant service(s) and domain modules
- **Unit tests** for core logic and boundary conditions
- **Integration or contract tests** for new or modified interfaces, where harnesses exist
- Updated **runbooks or design docs** only if required by your team's process (link from the PR description instead of duplicating here)
</required_artifacts>

<verification>
Run the service-level validation commands, for example:
- `pnpm test --filter <service>` or `pytest` in the service directory
- `pnpm lint` or equivalent linter for the language in use
- Any existing **contract or integration test suites** referenced from `AGENTS.md` or service docs
</verification>

<success_criteria>
The skill is complete when:
- All relevant tests and linters pass
- The new integration behaves correctly in local or staging environments
- Observability signals (logs, metrics, traces) show the expected behavior without noisy regressions
</success_criteria>

<safety_and_escalation>
- If the change touches **shared schemas, core auth logic, billing, or compliance-critical data**, stop and request explicit human approval and design review
- If dependencies owned by other teams need changes, create or update their tickets and clearly document assumptions and contract expectations in the PR
</safety_and_escalation>

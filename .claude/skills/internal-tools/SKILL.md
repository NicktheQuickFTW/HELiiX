---
name: internal-tools
description: Build and extend internal tools for engineers, operators, and support teams. Use when creating admin panels, support consoles, operational dashboards, or engineering utilities where reliability and safety matter more than polish.
---

<objective>
Design, implement, or extend internal tools that help employees operate the system safely and efficiently, while respecting access controls and audit requirements.
</objective>

<when_to_use>
Use this skill when:
- The audience is **internal staff** (engineers, SREs, support, operations, finance, etc.)
- The tool interacts with **production-adjacent systems** (feature flags, incidents, customer data, billing, etc.)
- The change is scoped to internal workflows and does not directly alter customer-facing UX
</when_to_use>

<required_inputs>
- **User personas** and teams who will use the tool
- **Workflows** to support (create/update actions, approvals, review flows)
- **Systems touched**: Services, queues, flags, and data stores
- **Risk classification**: What can go wrong if the tool misbehaves or is misused
</required_inputs>

<out_of_scope>
- Tools that require new identity providers or SSO integrations
- Changes that bypass existing approval or change-management processes
- Direct manual-write tooling for core financial or compliance systems without explicit approval
</out_of_scope>

<conventions>
## Stack Standards
- Use the **standard stack** for internal tools (framework, component library, backend pattern) already used in the repo
- Apply **role-based access control** and logging patterns consistently
- Prefer **read-only views and guarded actions** (confirmation dialogs, requiring justification text, etc.) for high-risk operations
</conventions>

<process>
## Implementation Steps

1. **Clarify workflow boundaries** and risk level with stakeholders
2. **Identify existing components**, endpoints, and patterns to reuse
3. **Implement the UI**, backend handlers, and data access using established abstractions
4. **Add safeguards**: confirmations, rate limiting, or approvals depending on risk
5. **Wire up logging and metrics** so usage and failures are visible
6. **Add or update tests** and any required runbook entries
</process>

<required_behavior>
- Implement flows that make the happy path fast while making destructive actions clearly intentional
- Ensure all state changes are logged with **who**, **what**, and **when**, and link to existing audit/logging infrastructure
- Provide clear feedback on success, errors, and partial failures
- Design for operational debugging: include ids, timestamps, and links to related systems
</required_behavior>

<required_artifacts>
- Frontend and backend changes in the appropriate internal-tools modules
- **Automated tests** for critical operations (at least unit tests; integration tests where harnesses exist)
- Baseline **operational runbook entry** or link explaining how to use the tool and what to do when it fails, if required by your team
</required_artifacts>

<verification>
Run the standard validation commands for the relevant apps/services (tests, lint, type checks). In addition:
- Exercise both **happy paths and failure modes** in a safe environment
- Confirm that audit logs and metrics reflect actions accurately
</verification>

<success_criteria>
The skill is complete when:
- Validation commands pass
- Flows behave correctly in staging or an equivalent environment
- Stakeholders can perform their target workflows without manual DB access or unsafe workarounds
</success_criteria>

<safety_and_escalation>
- If an operation could cause **irreversible data loss or external customer impact**, require higher-level approvals and consider additional controls (dual control, time-boxed access, or break-glass procedures)
- If you discover that existing internal tools bypass critical controls, document this clearly and escalate through the appropriate risk or security channel
</safety_and_escalation>

# Big 12 Comms Agents

Prompt-native agent architecture for Big 12 Conference Communications. Two agents, one shared MCP server, three system prompts.

Built to the design in `~/.claude/plans/mighty-knitting-star.md`.
Maps to HELiiX plan Phase A pilots (`~/.claude/plans/delegated-puzzling-church.md` §3A, §3B).

---

## What's here

```
agents/
├── big12-comms-mcp/          # MCP server — primitive tools (read/write/comms/audit)
├── prompts/
│   ├── core-comms-workspace.md    # Cowork (Opus) — Rachael Lewis's workspace
│   ├── award-pipeline.md          # Managed Agent (Sonnet) — headless pipeline
│   └── adversarial-review.md      # Subagent (Sonnet) — red-flag reviewer
├── configs/
│   └── award-pipeline.yaml        # Managed Agent YAML config
└── README.md                 # this file
```

---

## Two agents, one server

| Agent | Surface | Model | When it runs |
|---|---|---|---|
| Core Comms Workspace | Claude Cowork | Opus | Rachael opens it; human-in-loop |
| Award Pipeline | Claude Managed Agent | Sonnet | Cron/webhook on `WINNER_CONFIRMED` |
| Adversarial Review | Subagent | Sonnet | Invoked from inside the two above |

All three consume the same MCP server (`big12-comms`) so they share data contracts and one audit trail.

---

## MCP server (`big12-comms-mcp/`)

Pure primitive tools per the agent-native-architecture skill. No business logic in tools — the agent decides HOW from the prompt.

**Tools registered** (19 primitives):

| Group | Tools |
|---|---|
| Press archive | `read_press_release`, `list_press_releases`, `search_press_releases`, `store_press_release`, `update_press_release` |
| Awards | `read_award_record`, `list_award_records`, `store_award_record`, `update_award_record` |
| FlexTime facts | `read_sport_roster`, `read_standings`, `read_sport_results` |
| External (draft-only) | `send_email`, `send_teams_message`, `call_vendor_api` |
| Style | `read_style_guide` |
| Memory | `recall_memory`, `store_memory` |
| Audit | `log_audit_event` |

**What's explicitly NOT here** (prompt-native discipline):
- ❌ `draft_press_release` — agent composes from primitives
- ❌ `approve_release` — approval is a `update_press_release(status=...)` state change owned by humans
- ❌ `generate_award_order` — pipeline composes via `store_award_record`
- ❌ `notify_sr_dir` — agent picks channel via `send_teams_message`
- ❌ `check_confidence_score` — confidence is agent judgment, defined in prompt

### Setup

```bash
cd big12-comms-mcp
npm install
# Create ~/.env/big12-comms-mcp.env with:
#   SUPABASE_URL=https://<project>.supabase.co
#   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
#   BIG12_COMMS_LIVE_SEND=false   # keep draft-only until Open Q6 resolves
source ~/.env/big12-comms-mcp.env
npm run typecheck
npm run test
npm run dev  # starts via tsx; for prod: npm run build && npm start
```

### Prerequisites (separate offline tasks)

Before the server is usable, three data-ingestion jobs must run:

1. **Schema creation** — Supabase migrations for `communications` schema:
   - `press_releases` — full-text index on `headline` + `body`; pgvector column for semantic search (TODO)
   - `awards` — mirrored from `~/Downloads/XII Awards Tracking Sheet v7.csv` columns
   - `style_guide` — section/summary/body
   - `audit_log` — event, actor, resource, context, occurred_at
   - `memory` — (namespace, key) primary key, value JSONB
   - Views in `competition` schema: `roster_v`, `standings_v`, `results_v` (FlexTime-side work)

2. **Press archive ingest** — bulk-load 3+ years of Big 12 press releases into `press_releases`. Source TBD (ask Rachael — the HELiiX plan §3B assumes it's queryable but doesn't specify where).

3. **Award registry seed** — load `~/Downloads/XII Awards Tracking Sheet v7.csv` and sport-specific order files into `awards`. Also load `~/Downloads/Big 12 Awards Shipping Contacts(ATHLETICS).csv` into a `ship_to_contacts` lookup that `recall_memory` can pull from.

Once these exist, the MCP server is functional.

---

## Deploying the Core Comms Workspace (Cowork)

1. Log into Anthropic Cowork, create a new Project workspace.
2. Model: Opus.
3. System prompt: paste the contents of `prompts/core-comms-workspace.md`.
4. MCP: connect the `big12-comms` server (stdio transport; command: `node path/to/big12-comms-mcp/dist/server.js` with the Supabase env vars set).
5. Preload files: Big 12 style guide, current season schedules, Phase A pilot scorecard template.
6. Owner: Rachael Lewis. Backup: Nick Williams. Approver: Rachael.

Iterate by editing `prompts/core-comms-workspace.md`. No code changes needed — prose only.

---

## Deploying the Award Pipeline (Managed Agent)

1. Start `big12-comms-mcp` (stdio), accessible from the Managed Agent runtime.
2. Register `configs/award-pipeline.yaml` with Claude Managed Agents (via dashboard or SDK — TBD on Anthropic workflow).
3. Wire the trigger. Options:
   - **Supabase Edge Function** on `UPDATE` of `awards` where `NEW.status = 'WINNER_CONFIRMED'` → POST to the Managed Agent endpoint with `{ award_id: NEW.id }`.
   - **Cron poll** (simpler, higher-latency): every 5 min, `SELECT id FROM communications.awards WHERE status = 'WINNER_CONFIRMED' AND last_processed_at IS NULL`, process each.
4. First-ship: women's soccer POTW (most-mature FlexTime sport per plan §3B).

---

## Deploying the Adversarial Review Subagent

Invoked from inside the two main agents. Two integration options:

1. **Cowork Projects subagent feature** (preferred when available) — point at `prompts/adversarial-review.md`.
2. **SDK subagent call** — if Cowork doesn't support named subagents yet, the Core Comms Workspace can invoke it via `Agent` tool call with the prompt inlined.

---

## Phase A → Phase B migration notes

When Open Question #6 resolves (Nick Bowes IT approval on M365 Graph):

- **Flip `BIG12_COMMS_LIVE_SEND=true`** in the MCP server env. That's it. `send_email` and `send_teams_message` stop returning `[DRAFT_ONLY_M365_NOT_WIRED]` and start calling Microsoft Graph.
- **Implement the Graph calls** in `src/tools/comms.ts` (TODO markers in place). Use the Graph SDK with the approved tenant scopes.
- **No prompt changes required.** The agents already know to call `send_email` — the behavior switches invisibly.

When Open Question (vendor API) resolves:
- **Same pattern.** `call_vendor_api` is already a primitive; just flip the draft-only flag and confirm the vendor's PO endpoint.

---

## Governance checkpoints

Per HELiiX plan §2A:

- [x] Every write tool calls `recordAudit` — unified audit trail
- [x] Draft-only default on all external primitives (Phase A safety)
- [x] No tool bypasses approval gates (status transitions to PUBLISHED / SHIPPED / ORDERED are data operations, but the prompts forbid agents from making them)
- [x] Sensitive/regulated data classes called out in Rachael's prompt; agent refuses synthesis from memory
- [ ] RBAC on the MCP server (TODO — currently relies on service role key; once Cowork/Managed Agents have per-user auth, add role-based tool filtering)
- [ ] Retrieval trace surfacing in UI (TODO — `log_audit_event` is written but no Cowork UI reads it yet; interim workaround: Rachael can pull via `list` tool)

---

## Verification (per plan §Verification)

```bash
# Unit tests (mocked Supabase)
cd big12-comms-mcp
npm test

# Integration tests (requires dev Supabase with seed data)
INTEGRATION=1 SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm test

# Voice test (manual, once press archive is indexed)
# See plan §Verification for the 3-sport comparison protocol.
```

---

## Open questions blocking full deployment

From `~/.claude/plans/delegated-puzzling-church.md`:

- **#1 IP/commercial arrangement** — blocks Phase B announcement
- **#5 Anthropic partnership terms** — shapes Managed Agents commercial tier
- **#6 M365 IT approval** — blocks live send / Outlook integration
- **Press archive location** — not specified in the plan; need Rachael to confirm where 3 years of releases live

---

## Related files

- Plan: `~/.claude/plans/mighty-knitting-star.md` (this architecture)
- Parent plan: `~/.claude/plans/delegated-puzzling-church.md` (full HELiiX plan)
- Audit workbook: `~/Desktop/big12-dept-workflow-audit.xlsx` (Communications tab — Step 1 of `/dept-ai-audit`)
- Staff directory: `~/.claude/reference/big12-classes.md`

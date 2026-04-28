# @heliix/big12-comms-mcp

MCP server of primitive tools for Big 12 Communications agents. Shared by the Core Comms Workspace (Cowork) and the Award Pipeline (Managed Agent).

See `~/HELiiX/agents/README.md` for the full agent architecture. This README covers just the server.

## Install

```bash
npm install
```

## Configure

Required env vars:

```bash
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
# Optional. Defaults to draft-only mode.
# Set to "true" only after HELiiX plan Open Question #6 resolves.
BIG12_COMMS_LIVE_SEND=false
```

Put these in `~/.env/big12-comms-mcp.env` and `source` before running. Never commit real values.

## Run

```bash
npm run dev        # tsx (no build step)
# or
npm run build && npm start
```

The server speaks stdio — standard MCP transport. Connect from Cowork / Managed Agents by pointing at `node dist/server.js`.

## Test

```bash
npm test                                    # unit (mocked Supabase)
INTEGRATION=1 npm test test/integration     # requires live dev Supabase
```

## Tools exposed

See `src/server.ts` for the full registry. 19 primitives across 7 groups:

- Press archive: read / list / search / store / update
- Awards: read / list / store / update
- FlexTime facts (read-only view): roster / standings / results
- External comms (draft-only): email / teams / vendor API
- Style guide: read
- Memory: recall / store
- Audit: log_audit_event

Every write goes through `src/lib/audit.ts` which writes to `communications.audit_log`.

## Prompt-native discipline

Tools are primitives. They store, retrieve, and format. They do NOT:

- Decide whether a draft is ready
- Classify inquiries
- Pick vendor SKUs
- Compose engraving text
- Rank comparables

Those decisions live in the agent prompts (`~/HELiiX/agents/prompts/`). If you're tempted to add `draft_press_release()` as a tool, stop — read `~/.claude/plugins/cache/every-marketplace/compound-engineering/2.13.0/skills/agent-native-architecture/references/mcp-tool-design.md` first.

## Changelog

- `0.1.0` — initial scaffold (releases, awards, flextime, comms, style, memory, audit)

/**
 * User-facing audit-event logger.
 *
 * Distinct from the internal `lib/audit.ts` recorder. This tool lets the agent
 * explicitly log its own reasoning — e.g., "classified this inquiry as
 * sensitive because X", "chose comparable release Y because voice matched Z".
 *
 * Writes land in the same communications.audit_log table with event prefix
 * 'agent_note.*' so they're filterable.
 */

import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { recordAudit } from "../lib/audit.js";

const ok = (text: string) => ({ content: [{ type: "text" as const, text }] });

export const logAuditEvent = tool(
  "log_audit_event",
  "Record a reasoning trace or decision note to the audit log. Use this to make your judgment visible to reviewers.",
  {
    event: z.string().describe("Short event label, e.g. 'classified_as_sensitive' or 'comparable_chosen'"),
    actor: z.string().describe("Agent or workspace id"),
    resource: z.string().describe("What this note is about, e.g. 'press_release:abc123' or 'media_inquiry:2026-04-14-001'"),
    context: z.record(z.string(), z.any()).optional().describe("Free-form structured context — any JSON"),
  },
  async ({ event, actor, resource, context }) => {
    const id = await recordAudit({ event: `agent_note.${event}`, actor, resource, context });
    return ok(`Audit event ${id} recorded.`);
  }
);

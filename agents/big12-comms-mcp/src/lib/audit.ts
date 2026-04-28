/**
 * Internal audit logger. Every write tool calls this.
 *
 * Governance (HELiiX plan §2A): "full prompt/retrieval/output audit" for Sensitive
 * and Regulated data classes. Logs land in communications.audit_log.
 *
 * Not exposed as a user-facing tool — that's `log_audit_event` in src/tools/audit.ts,
 * which is thin and lets agents explicitly record their own reasoning trace.
 */

import { getSupabase } from "./supabase.js";
import type { AuditEvent } from "../schema/types.js";

export async function recordAudit(event: AuditEvent): Promise<string> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .schema("communications")
    .from("audit_log")
    .insert({
      event: event.event,
      actor: event.actor,
      resource: event.resource,
      context: event.context ?? {},
      occurred_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    // Audit failures are loud — we do not silently drop them.
    // eslint-disable-next-line no-console
    console.error("[big12-comms] audit write failed", error);
    throw new Error(`audit log write failed: ${error.message}`);
  }
  return String(data.id);
}

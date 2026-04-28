/**
 * Award record primitives.
 *
 * Same shape as releases.ts — primitives only. The Award Pipeline agent decides
 * what to put in engraving, which SKU matches the award type, and when to flag
 * needs_human. The tool just stores and retrieves.
 */

import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { getSupabase } from "../lib/supabase.js";
import { recordAudit } from "../lib/audit.js";
import { AwardRecord, AwardStatus } from "../schema/types.js";

const ok = (text: string) => ({ content: [{ type: "text" as const, text }] });
const err = (text: string) => ({
  content: [{ type: "text" as const, text }],
  isError: true,
});

// -----------------------------------------------------------------------------
export const readAwardRecord = tool(
  "read_award_record",
  "Read a single award record by id.",
  { id: z.string() },
  async ({ id }) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .schema("communications")
      .from("awards")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) return err(`read_award_record failed: ${error.message}`);
    if (!data) return err(`award not found: ${id}`);
    return ok(JSON.stringify(data, null, 2));
  }
);

// -----------------------------------------------------------------------------
export const listAwardRecords = tool(
  "list_award_records",
  "List award records with optional filters.",
  {
    sport: z.string().optional(),
    season: z.string().optional(),
    status: AwardStatus.optional(),
    award_type: z.string().optional(),
    limit: z.number().int().positive().max(200).default(50),
  },
  async ({ sport, season, status, award_type, limit }) => {
    const supabase = getSupabase();
    let q = supabase
      .schema("communications")
      .from("awards")
      .select("id, sport, season, award_type, recipient_name, recipient_school, status")
      .limit(limit)
      .order("created_at", { ascending: false });

    if (sport) q = q.eq("sport", sport);
    if (season) q = q.eq("season", season);
    if (status) q = q.eq("status", status);
    if (award_type) q = q.eq("award_type", award_type);

    const { data, error } = await q;
    if (error) return err(`list_award_records failed: ${error.message}`);
    return ok(`Found ${data.length} awards:\n${JSON.stringify(data, null, 2)}`);
  }
);

// -----------------------------------------------------------------------------
export const storeAwardRecord = tool(
  "store_award_record",
  "Create a new award record. Emits an audit event.",
  { record: AwardRecord, actor: z.string() },
  async ({ record, actor }) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .schema("communications")
      .from("awards")
      .insert({
        ...record,
        created_at: record.created_at ?? new Date().toISOString(),
      })
      .select("id, status")
      .single();

    if (error) return err(`store_award_record failed: ${error.message}`);

    await recordAudit({
      event: "award.created",
      actor,
      resource: `award:${data.id}`,
      context: {
        sport: record.sport,
        award_type: record.award_type,
        recipient: record.recipient_name,
        status: data.status,
      },
    });

    return ok(`Stored award ${data.id} with status ${data.status}.`);
  }
);

// -----------------------------------------------------------------------------
export const updateAwardRecord = tool(
  "update_award_record",
  "Update fields on an existing award record. Status transitions through approval gates are logged. Moves to ORDERED or SHIPPED require a human — don't do it unless explicitly told.",
  {
    id: z.string(),
    fields: z.record(z.string(), z.any()),
    actor: z.string(),
  },
  async ({ id, fields, actor }) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .schema("communications")
      .from("awards")
      .update(fields)
      .eq("id", id)
      .select("id, status")
      .maybeSingle();

    if (error) return err(`update_award_record failed: ${error.message}`);
    if (!data) return err(`award not found: ${id}`);

    await recordAudit({
      event: "award.updated",
      actor,
      resource: `award:${id}`,
      context: { fields: Object.keys(fields), status: data.status },
    });

    return ok(`Updated award ${id}. Status now: ${data.status}.`);
  }
);

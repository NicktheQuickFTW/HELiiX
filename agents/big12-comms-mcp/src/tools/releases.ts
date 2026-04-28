/**
 * Press release primitives.
 *
 * These are primitives, not workflows. The agent decides when to draft, what
 * voice to use, and whether to escalate. These tools just read and write
 * the release registry.
 */

import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { getSupabase } from "../lib/supabase.js";
import { recordAudit } from "../lib/audit.js";
import { PressReleaseRecord, ReleaseStatus } from "../schema/types.js";

const ok = (text: string) => ({ content: [{ type: "text" as const, text }] });
const err = (text: string) => ({
  content: [{ type: "text" as const, text }],
  isError: true,
});

// -----------------------------------------------------------------------------
// read_press_release
// -----------------------------------------------------------------------------
export const readPressRelease = tool(
  "read_press_release",
  "Read a single press release by id. Returns the full record, including body and metadata.",
  { id: z.string().describe("Press release id") },
  async ({ id }) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .schema("communications")
      .from("press_releases")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) return err(`read_press_release failed: ${error.message}`);
    if (!data) return err(`press release not found: ${id}`);
    return ok(JSON.stringify(data, null, 2));
  }
);

// -----------------------------------------------------------------------------
// list_press_releases
// -----------------------------------------------------------------------------
export const listPressReleases = tool(
  "list_press_releases",
  "List press releases with optional filters. Use this to browse by sport/award type/date. For voice retrieval, prefer search_press_releases.",
  {
    sport: z.string().optional().describe("Sport name, e.g. 'Football'"),
    award_type: z.string().optional().describe("Award type, e.g. 'Player of the Week'"),
    season: z.string().optional().describe("Season, e.g. '2025-26'"),
    date_from: z.string().optional().describe("ISO date inclusive lower bound on published_at"),
    date_to: z.string().optional().describe("ISO date inclusive upper bound on published_at"),
    status: ReleaseStatus.optional(),
    limit: z.number().int().positive().max(200).default(50),
  },
  async ({ sport, award_type, season, date_from, date_to, status, limit }) => {
    const supabase = getSupabase();
    let q = supabase
      .schema("communications")
      .from("press_releases")
      .select("id, sport, season, award_type, winner_name, headline, status, published_at")
      .limit(limit)
      .order("published_at", { ascending: false });

    if (sport) q = q.eq("sport", sport);
    if (award_type) q = q.eq("award_type", award_type);
    if (season) q = q.eq("season", season);
    if (status) q = q.eq("status", status);
    if (date_from) q = q.gte("published_at", date_from);
    if (date_to) q = q.lte("published_at", date_to);

    const { data, error } = await q;
    if (error) return err(`list_press_releases failed: ${error.message}`);
    return ok(`Found ${data.length} releases:\n${JSON.stringify(data, null, 2)}`);
  }
);

// -----------------------------------------------------------------------------
// search_press_releases
// -----------------------------------------------------------------------------
export const searchPressReleases = tool(
  "search_press_releases",
  "Semantic search over the press release archive. Use this to pull voice comparables when drafting. Returns ranked matches with headline + excerpt.",
  {
    query: z.string().describe("Free text query describing what you want to find"),
    sport: z.string().optional().describe("Optional sport filter"),
    award_type: z.string().optional().describe("Optional award type filter"),
    limit: z.number().int().positive().max(50).default(10),
  },
  async ({ query, sport, award_type, limit }) => {
    const supabase = getSupabase();

    // TODO: swap to pgvector match_press_releases RPC when the embedding pipeline is live.
    // For now, fall back to full-text ilike over headline + body. The interface is stable;
    // only the SQL changes when we wire embeddings.
    let q = supabase
      .schema("communications")
      .from("press_releases")
      .select("id, sport, season, award_type, winner_name, headline, body, published_at")
      .or(`headline.ilike.%${query}%,body.ilike.%${query}%`)
      .limit(limit)
      .order("published_at", { ascending: false });

    if (sport) q = q.eq("sport", sport);
    if (award_type) q = q.eq("award_type", award_type);

    const { data, error } = await q;
    if (error) return err(`search_press_releases failed: ${error.message}`);

    const trimmed = data.map((r: any) => ({
      id: r.id,
      sport: r.sport,
      season: r.season,
      award_type: r.award_type,
      winner_name: r.winner_name,
      headline: r.headline,
      excerpt: r.body?.slice(0, 400) ?? "",
      published_at: r.published_at,
    }));

    return ok(`Top ${trimmed.length} comparables for query:\n${JSON.stringify(trimmed, null, 2)}`);
  }
);

// -----------------------------------------------------------------------------
// store_press_release
// -----------------------------------------------------------------------------
export const storePressRelease = tool(
  "store_press_release",
  "Create a new press release record. Status defaults to DRAFT. Always emits an audit event.",
  { record: PressReleaseRecord, actor: z.string().describe("Who is storing this — e.g. 'rachael.lewis' or 'award-pipeline'") },
  async ({ record, actor }) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .schema("communications")
      .from("press_releases")
      .insert({
        ...record,
        created_at: record.created_at ?? new Date().toISOString(),
      })
      .select("id, status")
      .single();

    if (error) return err(`store_press_release failed: ${error.message}`);

    await recordAudit({
      event: "press_release.created",
      actor,
      resource: `press_release:${data.id}`,
      context: { sport: record.sport, award_type: record.award_type, status: data.status },
    });

    return ok(`Stored press release ${data.id} with status ${data.status}.`);
  }
);

// -----------------------------------------------------------------------------
// update_press_release
// -----------------------------------------------------------------------------
export const updatePressRelease = tool(
  "update_press_release",
  "Update fields on an existing press release. Status transitions are logged. Never bypass an approval gate — that's a human-only state change to PUBLISHED.",
  {
    id: z.string(),
    fields: z.record(z.string(), z.any()).describe("Partial field updates — e.g. { status: 'PENDING_COMMS_APPROVAL', body: '...' }"),
    actor: z.string(),
  },
  async ({ id, fields, actor }) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .schema("communications")
      .from("press_releases")
      .update(fields)
      .eq("id", id)
      .select("id, status")
      .maybeSingle();

    if (error) return err(`update_press_release failed: ${error.message}`);
    if (!data) return err(`press release not found: ${id}`);

    await recordAudit({
      event: "press_release.updated",
      actor,
      resource: `press_release:${id}`,
      context: { fields: Object.keys(fields), status: data.status },
    });

    return ok(`Updated ${id}. Status now: ${data.status}.`);
  }
);

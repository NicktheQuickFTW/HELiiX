/**
 * Thin wrappers over FlexTime's competition schema — read-only.
 *
 * Big 12 FlexTime owns rosters, standings, and results. This server exposes
 * a narrow, whitelisted read surface so comms agents can pull facts without
 * the agent inventing them. Pattern ported from Flextime supabaseReadTool.
 */

import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { getSupabase } from "../lib/supabase.js";

const ok = (text: string) => ({ content: [{ type: "text" as const, text }] });
const err = (text: string) => ({
  content: [{ type: "text" as const, text }],
  isError: true,
});

// -----------------------------------------------------------------------------
export const readSportRoster = tool(
  "read_sport_roster",
  "Read the roster for a given sport and season. Returns player names, classes, hometowns, positions. Use this to verify facts in drafts — never invent a player's year or hometown.",
  {
    sport: z.string().describe("Sport name, e.g. 'Soccer-W' or 'Football'"),
    season: z.string(),
    school: z.string().optional().describe("Optional school filter"),
  },
  async ({ sport, season, school }) => {
    const supabase = getSupabase();

    // TODO: confirm the real table name — FlexTime exposes 'teams' + 'schools' but
    // does not currently surface player-level rosters in the read whitelist.
    // This stub queries a view we will need to build: competition.roster_v
    let q = supabase
      .schema("competition")
      .from("roster_v")
      .select("player_name, class, hometown, position, school, sport, season")
      .eq("sport", sport)
      .eq("season", season)
      .limit(200);

    if (school) q = q.eq("school", school);

    const { data, error } = await q;
    if (error) {
      return err(
        `read_sport_roster failed: ${error.message}. ` +
          `(If the error mentions missing view 'competition.roster_v', see agents/README.md — it's the offline prerequisite.)`
      );
    }
    return ok(JSON.stringify(data, null, 2));
  }
);

// -----------------------------------------------------------------------------
export const readStandings = tool(
  "read_standings",
  "Read current conference standings for a given sport and season.",
  {
    sport: z.string(),
    season: z.string(),
    as_of: z.string().optional().describe("ISO date — defaults to latest"),
  },
  async ({ sport, season, as_of }) => {
    const supabase = getSupabase();
    let q = supabase
      .schema("competition")
      .from("standings_v")
      .select("*")
      .eq("sport", sport)
      .eq("season", season)
      .order("rank", { ascending: true });

    if (as_of) q = q.lte("computed_at", as_of);

    const { data, error } = await q;
    if (error) return err(`read_standings failed: ${error.message}`);
    return ok(JSON.stringify(data, null, 2));
  }
);

// -----------------------------------------------------------------------------
export const readSportResults = tool(
  "read_sport_results",
  "Read game or match results for a sport in a date window.",
  {
    sport: z.string(),
    season: z.string(),
    date_from: z.string().optional(),
    date_to: z.string().optional(),
    school: z.string().optional(),
    limit: z.number().int().positive().max(500).default(100),
  },
  async ({ sport, season, date_from, date_to, school, limit }) => {
    const supabase = getSupabase();
    let q = supabase
      .schema("competition")
      .from("results_v")
      .select("*")
      .eq("sport", sport)
      .eq("season", season)
      .limit(limit)
      .order("game_date", { ascending: false });

    if (date_from) q = q.gte("game_date", date_from);
    if (date_to) q = q.lte("game_date", date_to);
    if (school) q = q.or(`home_school.eq.${school},away_school.eq.${school}`);

    const { data, error } = await q;
    if (error) return err(`read_sport_results failed: ${error.message}`);
    return ok(JSON.stringify(data, null, 2));
  }
);

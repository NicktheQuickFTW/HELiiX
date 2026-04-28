/**
 * Style guide reader. One tool, one job.
 *
 * The Big 12 editorial style guide lives in communications.style_guide, keyed
 * by section name ("headlines", "names_and_titles", "ap_deviations", etc.).
 */

import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { getSupabase } from "../lib/supabase.js";

const ok = (text: string) => ({ content: [{ type: "text" as const, text }] });
const err = (text: string) => ({
  content: [{ type: "text" as const, text }],
  isError: true,
});

export const readStyleGuide = tool(
  "read_style_guide",
  "Read the Big 12 editorial style guide. Pass a section name for one section, or omit to get the table of contents.",
  {
    section: z.string().optional().describe("Section key, e.g. 'headlines'. Omit for TOC."),
  },
  async ({ section }) => {
    const supabase = getSupabase();

    if (!section) {
      const { data, error } = await supabase
        .schema("communications")
        .from("style_guide")
        .select("section, summary")
        .order("section");
      if (error) return err(`read_style_guide (toc) failed: ${error.message}`);
      return ok(
        `Style guide sections:\n` +
          data.map((r: any) => `- ${r.section}: ${r.summary ?? ""}`).join("\n")
      );
    }

    const { data, error } = await supabase
      .schema("communications")
      .from("style_guide")
      .select("section, summary, body, updated_at")
      .eq("section", section)
      .maybeSingle();

    if (error) return err(`read_style_guide failed: ${error.message}`);
    if (!data) return err(`style guide section not found: ${section}`);
    return ok(JSON.stringify(data, null, 2));
  }
);

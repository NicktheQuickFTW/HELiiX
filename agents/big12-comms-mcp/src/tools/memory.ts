/**
 * Agent-scoped key/value memory. Primitive storage. Agent decides schema.
 *
 * Use case: the Award Pipeline agent may want to remember "last-run timestamp
 * per sport" or "low-confidence flags from last POTW draft" across invocations.
 * Rachael's workspace may stash "reporter preferences" or "active crisis
 * monitoring threads". The tool doesn't care — it just reads and writes.
 */

import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { getSupabase } from "../lib/supabase.js";

const ok = (text: string) => ({ content: [{ type: "text" as const, text }] });
const err = (text: string) => ({
  content: [{ type: "text" as const, text }],
  isError: true,
});

export const recallMemory = tool(
  "recall_memory",
  "Read a memory value by key. Returns the stored JSON value or not-found.",
  {
    namespace: z.string().describe("Agent or workspace id, e.g. 'award-pipeline' or 'rachael-comms'"),
    key: z.string(),
  },
  async ({ namespace, key }) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .schema("communications")
      .from("memory")
      .select("value, updated_at")
      .eq("namespace", namespace)
      .eq("key", key)
      .maybeSingle();

    if (error) return err(`recall_memory failed: ${error.message}`);
    if (!data) return err(`not-found: ${namespace}/${key}`);
    return ok(JSON.stringify(data.value, null, 2));
  }
);

export const storeMemory = tool(
  "store_memory",
  "Write a memory value. Upserts by (namespace, key).",
  {
    namespace: z.string(),
    key: z.string(),
    value: z.any(),
  },
  async ({ namespace, key, value }) => {
    const supabase = getSupabase();
    const { error } = await supabase
      .schema("communications")
      .from("memory")
      .upsert(
        { namespace, key, value, updated_at: new Date().toISOString() },
        { onConflict: "namespace,key" }
      );

    if (error) return err(`store_memory failed: ${error.message}`);
    return ok(`Stored ${namespace}/${key}.`);
  }
);

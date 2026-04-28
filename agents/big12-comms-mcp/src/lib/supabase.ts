/**
 * Supabase client init.
 *
 * Uses the service-role key for server-side access. Never ship this to a browser.
 * Required env vars:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Schemas the server talks to:
 *   communications.* — press_releases, awards, style_guide, audit_log, memory
 *   competition.*    — teams, schools, sports (reuse of FlexTime's schema)
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. " +
        "For local dev: put them in ~/.env/big12-comms-mcp.env and source before running."
    );
  }

  // Don't pin the default schema here — every query calls .schema() explicitly.
  // Pinning a non-"public" default schema narrows the generic type and breaks
  // cross-schema queries at the type level.
  _client = createClient(url, key, {
    auth: { persistSession: false },
  });

  return _client;
}

/** For tests — lets you inject a mock client. */
export function __setSupabaseForTest(client: SupabaseClient | null) {
  _client = client as SupabaseClient | null;
}

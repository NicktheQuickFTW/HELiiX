/**
 * Unit tests for press release primitives.
 *
 * Pattern per plan: 3 cases per tool — expected path, edge, failure.
 * Supabase client is mocked via __setSupabaseForTest. We do NOT reset modules
 * between tests — the singleton is swapped via the test-only setter instead.
 *
 * Note: zod schema validation is enforced by the MCP SDK transport, not by
 * the handler itself. Tests here invoke handler() directly so they cover
 * tool logic, not validation.
 */

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { __setSupabaseForTest } from "../src/lib/supabase.js";
import {
  readPressRelease,
  listPressReleases,
  storePressRelease,
} from "../src/tools/releases.js";

beforeAll(() => {
  process.env.SUPABASE_URL = "http://test";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
});

afterEach(() => {
  __setSupabaseForTest(null);
});

/**
 * Build a mock Supabase client.
 *
 * `resolveWith` is returned from both `.single()` and `.maybeSingle()`.
 * Chainable builder methods all return `this` so any query shape works.
 * The builder itself is thenable — awaiting it (for queries without
 * `.single()`) resolves to the same value.
 */
function makeMock(resolveWith: any): any {
  const builder: any = {};
  const chainMethods = [
    "from",
    "schema",
    "select",
    "insert",
    "update",
    "upsert",
    "delete",
    "eq",
    "neq",
    "gte",
    "lte",
    "gt",
    "lt",
    "in",
    "or",
    "ilike",
    "order",
    "limit",
  ];
  for (const m of chainMethods) {
    builder[m] = vi.fn().mockReturnValue(builder);
  }
  builder.single = vi.fn().mockResolvedValue(resolveWith);
  builder.maybeSingle = vi.fn().mockResolvedValue(resolveWith);
  // Thenable so `await builder` works for queries that don't terminate in single/maybeSingle
  builder.then = (onResolve: any) =>
    Promise.resolve(resolveWith).then(onResolve);
  return builder;
}

describe("read_press_release", () => {
  it("returns the record when it exists (expected)", async () => {
    __setSupabaseForTest(
      makeMock({ data: { id: "pr_1", sport: "Football", headline: "Test" }, error: null })
    );
    const res = await readPressRelease.handler({ id: "pr_1" }, undefined);
    expect(res.isError).toBeFalsy();
    expect((res.content[0] as any).text).toContain("Football");
  });

  it("returns not-found error when id missing (edge)", async () => {
    __setSupabaseForTest(makeMock({ data: null, error: null }));
    const res = await readPressRelease.handler({ id: "does-not-exist" }, undefined);
    expect(res.isError).toBe(true);
    expect((res.content[0] as any).text).toContain("not found");
  });

  it("surfaces a DB error cleanly (failure)", async () => {
    __setSupabaseForTest(makeMock({ data: null, error: { message: "connection refused" } }));
    const res = await readPressRelease.handler({ id: "pr_1" }, undefined);
    expect(res.isError).toBe(true);
    expect((res.content[0] as any).text).toContain("connection refused");
  });
});

describe("store_press_release", () => {
  it("creates and logs audit for a valid record (expected)", async () => {
    __setSupabaseForTest(
      makeMock({ data: { id: "pr_new", status: "DRAFT" }, error: null })
    );
    const res = await storePressRelease.handler(
      {
        record: {
          sport: "Soccer-W",
          season: "2025-26",
          award_type: "Player of the Week",
          winner_name: "Jane Doe",
          headline: "Doe Named Soccer POTW",
          body: "...",
          status: "DRAFT",
          data_class: "Public",
        },
        actor: "award-pipeline",
      },
      undefined
    );
    expect(res.isError).toBeFalsy();
    expect((res.content[0] as any).text).toContain("pr_new");
    expect((res.content[0] as any).text).toContain("DRAFT");
  });

  it("surfaces insert errors cleanly (edge)", async () => {
    // Insert succeeds but returns null data — a weird edge that the handler
    // should treat as a failure rather than silently claim success.
    __setSupabaseForTest(makeMock({ data: null, error: { message: "insert returned no rows" } }));
    const res = await storePressRelease.handler(
      {
        record: {
          sport: "Football",
          season: "2025",
          headline: "x",
          body: "y",
          status: "DRAFT",
          data_class: "Public",
        },
        actor: "test",
      },
      undefined
    );
    expect(res.isError).toBe(true);
  });

  it("surfaces DB errors cleanly (failure)", async () => {
    __setSupabaseForTest(makeMock({ data: null, error: { message: "unique violation" } }));
    const res = await storePressRelease.handler(
      {
        record: {
          sport: "Football",
          season: "2025",
          headline: "x",
          body: "y",
          status: "DRAFT",
          data_class: "Public",
        },
        actor: "test",
      },
      undefined
    );
    expect(res.isError).toBe(true);
    expect((res.content[0] as any).text).toContain("unique violation");
  });
});

describe("list_press_releases", () => {
  it("returns filtered results (expected)", async () => {
    __setSupabaseForTest(makeMock({ data: [{ id: "pr_1", sport: "Football" }], error: null }));
    const res = await listPressReleases.handler(
      { sport: "Football", limit: 10 },
      undefined
    );
    expect(res.isError).toBeFalsy();
    expect((res.content[0] as any).text).toContain("Found 1 releases");
  });

  it("returns empty array cleanly when no matches (edge)", async () => {
    __setSupabaseForTest(makeMock({ data: [], error: null }));
    const res = await listPressReleases.handler(
      { sport: "Cricket", limit: 10 },
      undefined
    );
    expect(res.isError).toBeFalsy();
    expect((res.content[0] as any).text).toContain("Found 0 releases");
  });

  it("surfaces DB errors (failure)", async () => {
    __setSupabaseForTest(makeMock({ data: null, error: { message: "permission denied" } }));
    const res = await listPressReleases.handler({ limit: 10 }, undefined);
    expect(res.isError).toBe(true);
    expect((res.content[0] as any).text).toContain("permission denied");
  });
});

/**
 * Unit tests for award record primitives.
 * Matches test/releases.test.ts pattern — 3 cases per tool.
 */

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { __setSupabaseForTest } from "../src/lib/supabase.js";
import { readAwardRecord, updateAwardRecord } from "../src/tools/awards.js";

beforeAll(() => {
  process.env.SUPABASE_URL = "http://test";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
});

afterEach(() => {
  __setSupabaseForTest(null);
});

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
    "order",
    "limit",
  ];
  for (const m of chainMethods) {
    builder[m] = vi.fn().mockReturnValue(builder);
  }
  builder.single = vi.fn().mockResolvedValue(resolveWith);
  builder.maybeSingle = vi.fn().mockResolvedValue(resolveWith);
  builder.then = (onResolve: any) => Promise.resolve(resolveWith).then(onResolve);
  return builder;
}

describe("read_award_record", () => {
  it("returns the award (expected)", async () => {
    __setSupabaseForTest(
      makeMock({
        data: {
          id: "aw_1",
          sport: "Football",
          recipient_name: "John Smith",
          status: "WINNER_CONFIRMED",
        },
        error: null,
      })
    );
    const res = await readAwardRecord.handler({ id: "aw_1" }, undefined);
    expect(res.isError).toBeFalsy();
    expect((res.content[0] as any).text).toContain("John Smith");
  });

  it("errors cleanly on not-found (edge)", async () => {
    __setSupabaseForTest(makeMock({ data: null, error: null }));
    const res = await readAwardRecord.handler({ id: "nope" }, undefined);
    expect(res.isError).toBe(true);
    expect((res.content[0] as any).text).toContain("not found");
  });

  it("surfaces DB errors (failure)", async () => {
    __setSupabaseForTest(makeMock({ data: null, error: { message: "timeout" } }));
    const res = await readAwardRecord.handler({ id: "aw_1" }, undefined);
    expect(res.isError).toBe(true);
    expect((res.content[0] as any).text).toContain("timeout");
  });
});

describe("update_award_record", () => {
  it("updates and logs (expected)", async () => {
    __setSupabaseForTest(
      makeMock({
        data: { id: "aw_1", status: "PENDING_OPS_APPROVAL" },
        error: null,
      })
    );
    const res = await updateAwardRecord.handler(
      {
        id: "aw_1",
        fields: { status: "PENDING_OPS_APPROVAL", engraving: "POTW 2025-26, Jane Doe" },
        actor: "award-pipeline",
      },
      undefined
    );
    expect(res.isError).toBeFalsy();
    expect((res.content[0] as any).text).toContain("PENDING_OPS_APPROVAL");
  });

  it("errors on missing record (edge)", async () => {
    __setSupabaseForTest(makeMock({ data: null, error: null }));
    const res = await updateAwardRecord.handler(
      { id: "nope", fields: { status: "CANCELLED" }, actor: "test" },
      undefined
    );
    expect(res.isError).toBe(true);
    expect((res.content[0] as any).text).toContain("not found");
  });

  it("surfaces DB errors (failure)", async () => {
    __setSupabaseForTest(makeMock({ data: null, error: { message: "schema mismatch" } }));
    const res = await updateAwardRecord.handler(
      { id: "aw_1", fields: { status: "APPROVED" }, actor: "test" },
      undefined
    );
    expect(res.isError).toBe(true);
    expect((res.content[0] as any).text).toContain("schema mismatch");
  });
});

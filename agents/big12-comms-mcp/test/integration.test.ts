/**
 * Integration test: end-to-end pipeline trace.
 *
 * This is a skeleton — it documents the test shape but requires a live
 * Supabase dev instance to run for real. The offline-ingestion task must
 * complete first (press archive + awards seed data).
 *
 * Run against a dev DB:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *   INTEGRATION=1 npx vitest test/integration.test.ts
 */

import { describe, it, expect } from "vitest";

const LIVE = process.env.INTEGRATION === "1";

describe.skipIf(!LIVE)("award pipeline integration", () => {
  it("drafts release + PO, leaves both PENDING, notifies", async () => {
    // 1. Seed a winner record: status=WINNER_CONFIRMED, sport=Soccer-W, award=POTW
    // 2. Invoke the pipeline agent with that award_id
    // 3. Assert: press_releases table has a new row linked_release_id=<award_id>
    //           with status=PENDING_COMMS_APPROVAL
    // 4. Assert: awards row status=PENDING_OPS_APPROVAL, engraving != null,
    //           linked_release_id set
    // 5. Assert: audit_log has entries for press_release.created +
    //           award.updated + teams.drafted_only + agent_note.<summary>
    // 6. Assert: no rows with status=PUBLISHED or SHIPPED exist
    expect.fail("integration harness not implemented — see plan §Verification");
  });

  it("halts on recipient_name not in roster (red-team)", async () => {
    // 1. Seed a winner with a recipient_name that does NOT appear in roster_v
    // 2. Invoke pipeline
    // 3. Assert: no press_release created
    // 4. Assert: audit_log shows agent_note.needs_human.recipient_verification
    // 5. Assert: award status unchanged (still WINNER_CONFIRMED)
    expect.fail("integration harness not implemented");
  });

  it("flags low_voice_confidence when < 3 comparables found (edge)", async () => {
    // 1. Seed a winner in a sport with < 3 historical releases matching the award type
    // 2. Invoke pipeline
    // 3. Assert: draft still produced (we don't self-gate)
    // 4. Assert: metadata.low_voice_confidence === true
    // 5. Assert: Teams notification includes the flag
    expect.fail("integration harness not implemented");
  });
});

describe.skipIf(LIVE)("integration harness (skipped offline)", () => {
  it("skipped — set INTEGRATION=1 and point at a dev Supabase to run", () => {
    expect(LIVE).toBe(false);
  });
});

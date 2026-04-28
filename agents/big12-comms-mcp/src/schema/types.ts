import { z } from "zod";

// =====================================================================
// Status enums — shared across release + award lifecycles
// =====================================================================

export const ReleaseStatus = z.enum([
  "DRAFT",
  "PENDING_COMMS_APPROVAL",
  "APPROVED",
  "PUBLISHED",
  "ARCHIVED",
  "WITHDRAWN",
]);
export type ReleaseStatus = z.infer<typeof ReleaseStatus>;

export const AwardStatus = z.enum([
  "NOMINATED",
  "WINNER_CONFIRMED",
  "PENDING_OPS_APPROVAL",
  "APPROVED",
  "ORDERED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);
export type AwardStatus = z.infer<typeof AwardStatus>;

export const EvidenceTag = z.enum(["Confirmed", "Inferred", "Speculative"]);
export type EvidenceTag = z.infer<typeof EvidenceTag>;

export const DataClass = z.enum([
  "Public",
  "Internal",
  "Sensitive",
  "Regulated",
]);
export type DataClass = z.infer<typeof DataClass>;

// =====================================================================
// Records — domain shapes
// =====================================================================

export const PressReleaseRecord = z.object({
  id: z.string().optional(),
  sport: z.string(),
  season: z.string(),
  award_type: z.string().optional(),
  winner_name: z.string().optional(),
  winner_school: z.string().optional(),
  headline: z.string(),
  body: z.string(),
  status: ReleaseStatus.default("DRAFT"),
  data_class: DataClass.default("Public"),
  metadata: z.record(z.string(), z.any()).optional(),
  published_at: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
});
export type PressReleaseRecord = z.infer<typeof PressReleaseRecord>;

export const AwardRecord = z.object({
  id: z.string().optional(),
  sport: z.string(),
  season: z.string(),
  award_type: z.string(),
  recipient_name: z.string(),
  recipient_school: z.string().optional(),
  recipient_class: z.string().optional(),
  engraving: z.string().optional(),
  ship_to_contact: z.string().optional(),
  ship_to_address: z.string().optional(),
  sku: z.string().optional(),
  status: AwardStatus.default("NOMINATED"),
  linked_release_id: z.string().optional(),
  vendor_po_number: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  created_at: z.string().datetime().optional(),
});
export type AwardRecord = z.infer<typeof AwardRecord>;

// =====================================================================
// Filter shape — ported from Flextime supabaseReadTool pattern
// =====================================================================

export const FilterOp = z.enum(["eq", "ilike", "in", "gte", "lte"]);

export const Filter = z.object({
  col: z.string(),
  op: FilterOp,
  val: z.union([
    z.string(),
    z.number(),
    z.array(z.union([z.string(), z.number()])),
  ]),
});
export type Filter = z.infer<typeof Filter>;

// =====================================================================
// Audit event
// =====================================================================

export const AuditEvent = z.object({
  event: z.string(),
  actor: z.string(),
  resource: z.string(),
  context: z.record(z.string(), z.any()).optional(),
});
export type AuditEvent = z.infer<typeof AuditEvent>;

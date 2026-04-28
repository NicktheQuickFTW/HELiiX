/**
 * External communication primitives — DRAFT-ONLY in Phase A.
 *
 * Nothing here actually sends until HELiiX plan Open Question #6 resolves
 * (Nick Bowes IT approval on M365 Graph tenant access). Until then these
 * tools format the outbound message and return it; a human copies and sends.
 *
 * When the Graph MCP lands, flip `DRAFT_ONLY` to false in the server config
 * and no agent prompts need to change.
 */

import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { recordAudit } from "../lib/audit.js";

const DRAFT_ONLY = process.env.BIG12_COMMS_LIVE_SEND !== "true";

const ok = (text: string) => ({ content: [{ type: "text" as const, text }] });

// -----------------------------------------------------------------------------
export const sendEmail = tool(
  "send_email",
  "Format (and in Phase A, return as draft) an outbound email. Pass recipient addresses, subject, body, and optional attachment descriptors. Does NOT actually send until M365 Graph is wired.",
  {
    to: z.array(z.string()).min(1),
    cc: z.array(z.string()).optional(),
    bcc: z.array(z.string()).optional(),
    subject: z.string(),
    body: z.string().describe("Plaintext or markdown body"),
    attachments: z
      .array(
        z.object({
          filename: z.string(),
          content_base64: z.string().optional(),
          path: z.string().optional(),
        })
      )
      .optional(),
    actor: z.string(),
  },
  async ({ to, cc, bcc, subject, body, attachments, actor }) => {
    const envelope = { to, cc, bcc, subject, body, attachments: attachments ?? [] };

    await recordAudit({
      event: DRAFT_ONLY ? "email.drafted_only" : "email.sent",
      actor,
      resource: "email",
      context: { to, cc, bcc, subject, attachments_count: (attachments ?? []).length },
    });

    if (DRAFT_ONLY) {
      return ok(
        `[DRAFT_ONLY_M365_NOT_WIRED]\n` +
          `Formatted email envelope below. A human must copy this into Outlook and send.\n\n` +
          JSON.stringify(envelope, null, 2)
      );
    }

    // TODO: wire to Microsoft Graph /me/sendMail once Open Q6 resolves.
    return ok("Not reached — live send path not yet implemented.");
  }
);

// -----------------------------------------------------------------------------
export const sendTeamsMessage = tool(
  "send_teams_message",
  "Format (and in Phase A, return as draft) a Microsoft Teams channel message. Does NOT actually send until M365 Graph is wired.",
  {
    channel: z.string().describe("Channel name or id, e.g. '#big12-comms-approvals'"),
    content: z.string().describe("Markdown-friendly message body"),
    mentions: z.array(z.string()).optional().describe("User ids to @-mention"),
    actor: z.string(),
  },
  async ({ channel, content, mentions, actor }) => {
    await recordAudit({
      event: DRAFT_ONLY ? "teams.drafted_only" : "teams.sent",
      actor,
      resource: `teams:${channel}`,
      context: { mentions_count: (mentions ?? []).length, content_length: content.length },
    });

    if (DRAFT_ONLY) {
      return ok(
        `[DRAFT_ONLY_M365_NOT_WIRED]\n` +
          `Formatted Teams message for ${channel}:\n\n${content}\n\n` +
          `Mentions: ${(mentions ?? []).join(", ") || "(none)"}\n` +
          `A human must paste this into the channel.`
      );
    }
    return ok("Not reached — live send path not yet implemented.");
  }
);

// -----------------------------------------------------------------------------
export const callVendorApi = tool(
  "call_vendor_api",
  "Make an HTTP request to an award vendor API (trophy supplier PO submission). Generic — the agent composes the URL, method, and body. No vendor logic baked in.",
  {
    url: z.string().url(),
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]).default("POST"),
    headers: z.record(z.string(), z.string()).optional(),
    body: z.any().optional(),
    actor: z.string(),
  },
  async ({ url, method, headers, body, actor }) => {
    if (DRAFT_ONLY) {
      await recordAudit({
        event: "vendor_api.drafted_only",
        actor,
        resource: `vendor_api:${new URL(url).host}`,
        context: { method, url },
      });
      return ok(
        `[DRAFT_ONLY_VENDOR_API_NOT_WIRED]\n` +
          `Would call ${method} ${url}\n` +
          `Headers: ${JSON.stringify(headers ?? {}, null, 2)}\n` +
          `Body: ${JSON.stringify(body, null, 2)}\n` +
          `A human must execute this PO submit.`
      );
    }

    const resp = await fetch(url, {
      method,
      headers: headers ?? {},
      body: body != null ? JSON.stringify(body) : undefined,
    });
    const text = await resp.text();

    await recordAudit({
      event: "vendor_api.called",
      actor,
      resource: `vendor_api:${new URL(url).host}`,
      context: { method, url, status: resp.status },
    });

    return {
      content: [{ type: "text" as const, text: `${resp.status} ${resp.statusText}\n\n${text}` }],
      isError: !resp.ok,
    };
  }
);

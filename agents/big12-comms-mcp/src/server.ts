#!/usr/bin/env node
/**
 * big12-comms MCP server.
 *
 * Assembles all primitive tools and exposes them via stdio for Claude Managed
 * Agents and Cowork workspaces to consume.
 *
 * Run:
 *   source ~/.env/big12-comms-mcp.env   # SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   npm run dev                         # tsx src/server.ts
 *   # or production:
 *   npm run build && npm start
 */

import { createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";

import {
  readPressRelease,
  listPressReleases,
  searchPressReleases,
  storePressRelease,
  updatePressRelease,
} from "./tools/releases.js";

import {
  readAwardRecord,
  listAwardRecords,
  storeAwardRecord,
  updateAwardRecord,
} from "./tools/awards.js";

import {
  readSportRoster,
  readStandings,
  readSportResults,
} from "./tools/flextime.js";

import { sendEmail, sendTeamsMessage, callVendorApi } from "./tools/comms.js";
import { readStyleGuide } from "./tools/style.js";
import { recallMemory, storeMemory } from "./tools/memory.js";
import { logAuditEvent } from "./tools/audit.js";

export const big12CommsServer = createSdkMcpServer({
  name: "big12-comms",
  version: "0.1.0",
  tools: [
    // press archive + drafting
    readPressRelease,
    listPressReleases,
    searchPressReleases,
    storePressRelease,
    updatePressRelease,
    // awards
    readAwardRecord,
    listAwardRecords,
    storeAwardRecord,
    updateAwardRecord,
    // winner data (FlexTime competition schema)
    readSportRoster,
    readStandings,
    readSportResults,
    // external comms (draft-only in Phase A)
    sendEmail,
    sendTeamsMessage,
    callVendorApi,
    // style guide
    readStyleGuide,
    // memory
    recallMemory,
    storeMemory,
    // audit
    logAuditEvent,
  ],
});

// When invoked directly (not imported), the SDK wires stdio transport for us.
// Nothing else to do here.

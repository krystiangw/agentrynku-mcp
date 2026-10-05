#!/usr/bin/env node
// Local stdio bridge to the hosted Agent Rynku MCP server.
// For clients that can only launch a local command. Clients that support
// remote HTTP servers can connect to https://agentrynku.pl/api/mcp directly,
// without this package.
"use strict";

const { spawn } = require("node:child_process");
const { createInterface } = require("node:readline");

const URL = process.env.AGENTRYNKU_MCP_URL || "https://agentrynku.pl/api/mcp";
const key = (process.env.AGENTRYNKU_API_KEY || "").trim();
const DOCS = "https://github.com/krystiangw/agentrynku-mcp";

function fail(message) {
  process.stderr.write(`agentrynku-mcp: ${message}\nDocs: ${DOCS}\n`);
  process.exit(1);
}

const PUBLIC_TOOLS = new Set([
  "search_gpw_companies", "get_quarterly_kpis", "get_financial_ratios",
  "get_public_earnings_calendar", "get_public_dividends", "get_public_price_history",
]);
const endpoint = new global.URL(URL);
if (endpoint.protocol !== "https:" && !(endpoint.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(endpoint.hostname))) fail("use HTTPS, or HTTP on localhost for development");
if (/[\r\n]/.test(key)) fail("the API key contains an invalid line break");

// initialize and tools/list answer without a valid key, so a wrong key would
// only show up at the first tool call, where a 401 sends mcp-remote into an
// OAuth flow this server does not offer. Check the key once, up front.
async function checkKey() {
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name: "get_spot_price", arguments: { symbol: "WIG20" } },
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (res.status === 401) {
      fail("the API key was rejected (invalid or revoked). Generate a new one at https://agentrynku.pl/settings");
    }
  } catch {
    // Network trouble: let mcp-remote retry and report it in its own way.
  }
}

async function main() {
  if (key) await checkKey();
  const proxy = require.resolve("mcp-remote/dist/proxy.js");
  // The key stays out of the process arguments: mcp-remote expands
  // ${AGENTRYNKU_API_KEY} from the environment the child inherits.
  const child = spawn(
    process.execPath,
    [proxy, URL, "--transport", "http-only", ...(key ? ["--header", "Authorization:Bearer ${AGENTRYNKU_API_KEY}"] : [])],
    { stdio: ["pipe", "pipe", "inherit"], env: { ...process.env, AGENTRYNKU_API_KEY: key } },
  );

  createInterface({ input: child.stdout }).on("line", (line) => process.stdout.write(line + "\n"));
  child.stdin.on("error", () => {});
  const input = createInterface({ input: process.stdin });
  input.on("line", (line) => {
    let request;
    try { request = JSON.parse(line); } catch { child.stdin.write(line + "\n"); return; }
    // A stale client catalog must not turn a missing API key into an OAuth browser flow.
    const allowed = request && (request.method === "initialize" || request.method === "tools/list" || request.method === "ping" ||
      (typeof request.method === "string" && request.method.startsWith("notifications/")) || (request.method === "tools/call" && PUBLIC_TOOLS.has(request.params?.name)));
    if (!key && !allowed) {
      if (request?.id !== undefined) process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: request.id, error: {
        code: -32001, message: "This function requires an API key. Set AGENTRYNKU_API_KEY from https://agentrynku.pl/settings, then restart the bridge.",
      } }) + "\n");
      return;
    }
    child.stdin.write(line + "\n");
  });
  input.on("close", () => child.stdin.end());

  for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => child.kill(sig));
  child.on("exit", (code, signal) => {
    if (signal) {
      process.removeAllListeners(signal);
      process.kill(process.pid, signal);
    } else {
      process.exit(code ?? 0);
    }
  });
}

main();

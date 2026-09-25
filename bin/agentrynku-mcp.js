#!/usr/bin/env node
// Local stdio bridge to the hosted Agent Rynku MCP server.
// For clients that can only launch a local command. Clients that support
// remote HTTP servers can connect to https://agentrynku.pl/api/mcp directly,
// without this package.
"use strict";

const { spawn } = require("node:child_process");

const URL = process.env.AGENTRYNKU_MCP_URL || "https://agentrynku.pl/api/mcp";
const key = (process.env.AGENTRYNKU_API_KEY || "").trim();
const DOCS = "https://github.com/krystiangw/agentrynku-mcp";

function fail(message) {
  process.stderr.write(`agentrynku-mcp: ${message}\nDocs: ${DOCS}\n`);
  process.exit(1);
}

if (!key) {
  fail("set AGENTRYNKU_API_KEY. Create a key after signing in: https://agentrynku.pl/settings");
}

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
  await checkKey();
  const proxy = require.resolve("mcp-remote/dist/proxy.js");
  // The key stays out of the process arguments: mcp-remote expands
  // ${AGENTRYNKU_API_KEY} from the environment the child inherits.
  const child = spawn(
    process.execPath,
    [proxy, URL, "--transport", "http-only", "--header", "Authorization:Bearer ${AGENTRYNKU_API_KEY}"],
    { stdio: "inherit", env: { ...process.env, AGENTRYNKU_API_KEY: key } },
  );

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

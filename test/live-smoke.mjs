import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

// Read-only live smoke. Private calls have no key and must be rejected.
const endpoint = process.argv[2] ?? 'https://agentrynku.pl/api/mcp';
const proof = { endpoint, measuredAt: new Date().toISOString(), clients: [] };
for (const mode of ['http', 'stdio']) {
  const client = new Client({ name: 'agentrynku-live-smoke', version: '1.1.0' });
  const transport = mode === 'http'
    ? new StreamableHTTPClientTransport(new URL(endpoint))
    : new StdioClientTransport({ command: process.execPath, args: [fileURLToPath(new URL('../bin/agentrynku-mcp.js', import.meta.url))], env: { PATH: process.env.PATH, AGENTRYNKU_MCP_URL: endpoint }, stderr: 'pipe' });
  try {
    await client.connect(transport);
    const tools = (await client.listTools()).tools.map(t => t.name);
    assert.equal(tools.length, 5);
    const result = await client.callTool({ name: 'get_quarterly_kpis', arguments: { symbol: 'KGHM', quartersBack: 1 } });
    const data = JSON.parse(result.content[0].text);
    assert.equal(data.symbol, 'KGHM'); assert.equal(data.quarters.length, 1); assert.ok(data.coverage);
    const parallel = await Promise.allSettled([
      client.callTool({ name: 'get_quarterly_kpis', arguments: { symbol: 'KGHM', quartersBack: 8 } }),
      client.callTool({ name: 'modify_holdings', arguments: {} }),
    ]);
    assert.equal(parallel[0].status, 'fulfilled');
    const concurrentData = JSON.parse(parallel[0].value.content[0].text);
    assert.ok(concurrentData.quarters.length > 0 && concurrentData.quarters.length <= 8);
    assert.equal(parallel[1].status, 'rejected');
    const rejection = { code: parallel[1].reason.code, message: parallel[1].reason.message };
    assert.equal(rejection.code, mode === 'http' ? 401 : -32001);
    proof.clients.push({ mode, server: client.getServerVersion(), tools, data, concurrentQuarterCount: concurrentData.quarters.length, rejection });
  } finally { await client.close(); }
}
if (process.argv[3]) writeFileSync(process.argv[3], JSON.stringify(proof, null, 2) + '\n');
console.log('HTTP and stdio: public KGHM data read, private writes rejected without a key.');

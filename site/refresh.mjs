// Snapshots public tool schemas and example responses from the live server into site/data.
// Run: node site/refresh.mjs [endpoint]
import { mkdir, writeFile } from 'node:fs/promises';

const endpoint = process.argv[2] ?? 'https://agentrynku.pl/api/mcp';
const dataDir = new URL('./data/', import.meta.url);

export const exampleCalls = {
  search_gpw_companies: { query: 'KGHM', limit: 3 },
  get_quarterly_kpis: { symbol: 'KGHM', quartersBack: 1 },
  get_financial_ratios: { symbol: 'KGHM', quartersBack: 2 },
  get_public_earnings_calendar: { daysAhead: 30, limit: 3 },
  get_public_price_history: { symbol: 'KGHM', days: 7, limit: 3 },
  get_public_dividends: { symbol: 'AGO', limit: 1 },
};

async function rpc(method, params) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  if (!res.ok) throw new Error(`${method}: HTTP ${res.status}`);
  const body = await res.json();
  if (body.error) throw new Error(`${method}: ${body.error.message}`);
  return body.result;
}

// Keeps examples short enough to read on a page while staying valid JSON.
function trimArrays(value, maxItems = 2) {
  if (Array.isArray(value)) return value.slice(0, maxItems).map((v) => trimArrays(v, maxItems));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, trimArrays(v, maxItems)]));
  }
  return value;
}

await mkdir(new URL('./examples/', dataDir), { recursive: true });

const { tools } = await rpc('tools/list', {});
const schemas = tools.map(({ name, description, inputSchema }) => ({ name, description, inputSchema }));
await writeFile(new URL('./tools.json', dataDir), JSON.stringify(schemas, null, 2) + '\n');

for (const [name, args] of Object.entries(exampleCalls)) {
  const result = await rpc('tools/call', { name, arguments: args });
  if (result.isError) throw new Error(`${name}: ${result.content?.[0]?.text}`);
  const payload = result.structuredContent ?? JSON.parse(result.content[0].text);
  const example = { fetchedAt: new Date().toISOString(), arguments: args, response: trimArrays(payload) };
  await writeFile(new URL(`./examples/${name}.json`, dataDir), JSON.stringify(example, null, 2) + '\n');
  await new Promise((r) => setTimeout(r, 1000));
}

console.log(`Saved ${schemas.length} schemas and ${Object.keys(exampleCalls).length} examples from ${endpoint}`);

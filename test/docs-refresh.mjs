import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';

const run = promisify(execFile);
async function fixture(handler, check) {
  const dir = await mkdtemp(join(tmpdir(), 'ar-docs-refresh-'));
  await mkdir(join(dir, 'site'));
  await copyFile(new URL('../site/refresh.mjs', import.meta.url), join(dir, 'site/refresh.mjs'));
  const requests = [];
  const server = createServer(async (req, res) => {
    let text = '';
    for await (const chunk of req) text += chunk;
    const body = JSON.parse(text);
    requests.push({ probe: req.headers['x-ar-mcp-probe'], body });
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(handler(body)));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const endpoint = `http://127.0.0.1:${server.address().port}`;
    await check({ dir, requests, execute: () => run(process.execPath, [join(dir, 'site/refresh.mjs'), endpoint], { timeout: 20_000 }) });
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await rm(dir, { recursive: true, force: true });
  }
}

test('przykład zachowuje pełne tablice oraz liczniki, a odświeżanie oznacza sondy', async () => {
  const payload = { candleCount: 3, candles: [{ close: 1 }, { close: 2 }, { close: 3 }],
    quality: { withheld: ['pierwsze', 'drugie', 'trzecie'] } };
  await fixture((body) => ({ jsonrpc: '2.0', id: body.id,
    result: body.method === 'tools/list' ? { tools: [] }
      : { content: [{ type: 'text', text: JSON.stringify(payload) }] },
  }), async ({ dir, requests, execute }) => {
    await execute();
    const example = JSON.parse(await readFile(join(dir, 'site/data/examples/get_public_price_history.json'), 'utf8'));
    assert.deepEqual(example.response, payload);
    assert.equal(example.response.candleCount, example.response.candles.length);
    assert.equal(requests.length, 7);
    assert.ok(requests.every((r) => r.probe === '1'));
  });
});

test('błąd RPC przerywa odświeżanie i nie udaje prawidłowego przykładu', async () => {
  await fixture((body) => ({ jsonrpc: '2.0', id: body.id,
    error: { code: -32603, message: 'błąd źródła testowego' },
  }), async ({ dir, requests, execute }) => {
    await assert.rejects(execute, (error) => error.code === 1 && error.stderr.includes('błąd źródła testowego'));
    await assert.rejects(readFile(join(dir, 'site/data/tools.json')), { code: 'ENOENT' });
    assert.equal(requests.length, 1);
    assert.equal(requests[0].probe, '1');
  });
});

// Dokumentacja przeniesiona pod https://agentrynku.pl/docs (27.10.2026).
// GitHub Pages nie wysyła 301, więc każda dawna strona dostaje meta refresh
// i canonical na nowy adres. Google traktuje to jak przekierowanie.
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { pages, tools } from './content.mjs';

const out = new URL('../_site/', import.meta.url);
const NOWA = 'https://agentrynku.pl';
const cel = (slug) => (slug === 'en' ? `${NOWA}/en/mcp` : slug ? `${NOWA}/docs/${slug}` : `${NOWA}/docs`);

const strona = (url) => `<!doctype html>
<html lang="pl"><head><meta charset="utf-8">
<title>Dokumentacja przeniesiona</title>
<link rel="canonical" href="${url}">
<meta http-equiv="refresh" content="0; url=${url}">
<script>location.replace(${JSON.stringify(url)} + location.search + location.hash)</script>
</head><body><p>Dokumentacja Agent Rynku MCP jest teraz pod adresem <a href="${url}">${url}</a>.</p></body></html>
`;

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await writeFile(new URL('index.html', out), strona(cel('')));
for (const slug of [...tools.map((t) => t.slug), ...Object.values(pages).map((p) => p.slug)].filter(Boolean)) {
  const dir = new URL(`${slug}/`, out);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL('index.html', dir), strona(cel(slug)));
}
await writeFile(new URL('404.html', out), strona(cel('')));
await writeFile(new URL('robots.txt', out), 'User-agent: *\nAllow: /\n');
await writeFile(new URL('CNAME', out), 'docs.agentrynku.pl\n');

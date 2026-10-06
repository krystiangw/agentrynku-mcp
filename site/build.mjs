// Builds the static docs site (docs.agentrynku.pl) into _site/. No dependencies.
// Data comes from site/data (refresh with `node site/refresh.mjs`) and TOOLS.md.
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { ENDPOINT, MAIN, SITE, pages, tools } from './content.mjs';

const root = new URL('../', import.meta.url);
const out = new URL('../_site/', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

const schemas = JSON.parse(await read('site/data/tools.json'));
const examples = Object.fromEntries(
  await Promise.all(tools.map(async (t) => [t.name, JSON.parse(await read(`site/data/examples/${t.name}.json`))])),
);
const pkg = JSON.parse(await read('package.json'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const urlOf = (slug) => (slug ? `${SITE}/${slug}/` : `${SITE}/`);
const formatDate = (iso) => new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

const paramHelp = {
  symbol: 'Ticker, nazwa, alias albo ISIN spółki z GPW, np. <code>KGHM</code> lub <code>PLKGHM000017</code>.',
  query: 'Nazwa, ticker, alias albo ISIN.',
  quartersBack: 'Ile ostatnich kwartałów zwrócić.',
  limit: 'Maksymalna liczba pozycji w odpowiedzi.',
  days: 'Okno wstecz w dniach kalendarzowych.',
  daysAhead: 'Ile dni naprzód, licząc od dzisiaj.',
};

function layout({ slug, title, description, lang = 'pl', body, jsonLd = [], alternates, noindex = false }) {
  const en = lang === 'en';
  const nav = [
    [en ? pages.en.slug : '', en ? 'Introduction' : 'Wprowadzenie'],
    [pages.connect.slug, en ? pages.connect.navEn : pages.connect.nav],
    [pages.tasks.slug, en ? pages.tasks.navEn : pages.tasks.nav],
    ...tools.map((t) => [t.slug, en ? t.navEn : t.nav]),
    [pages.catalog.slug, en ? pages.catalog.navEn : pages.catalog.nav],
  ];
  // Only the introduction exists in English; the rest link to Polish pages and say so.
  const navHtml = nav
    .map(([s, label], i) => {
      const polishTarget = en && i > 0;
      return `<li><a href="/${s ? s + '/' : ''}"${s === slug ? ' aria-current="page"' : ''}${polishTarget ? ' hreflang="pl"' : ''}>${esc(label)}${polishTarget ? ' <span class="lang">PL</span>' : ''}</a></li>`;
    })
    .join('');
  const alt = alternates
    ? Object.entries(alternates).map(([l, href]) => `<link rel="alternate" hreflang="${l}" href="${href}">`).join('\n')
    : '';
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${urlOf(slug)}">`}
${alt}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Agent Rynku MCP">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${urlOf(slug)}">
<meta property="og:locale" content="${lang === 'pl' ? 'pl_PL' : 'en_US'}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/style.css">
${jsonLd.map((d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body>
<header class="top">
  <a class="brand" href="/">Agent Rynku <span>MCP</span></a>
  <nav class="top-links" aria-label="${en ? 'Site' : 'Serwis'}">
    <a href="${MAIN}${en ? '/en/mcp' : '/mcp'}">agentrynku.pl</a>
    <a href="https://github.com/krystiangw/agentrynku-mcp">GitHub</a>
    ${lang === 'pl' ? '<a href="/en/" hreflang="en">English</a>' : '<a href="/" hreflang="pl">Polski</a>'}
  </nav>
</header>
<div class="shell">
  <nav class="side" aria-label="${en ? 'Documentation' : 'Dokumentacja'}"><ul>${navHtml}</ul></nav>
  <main>${body}</main>
</div>
<footer>
  <p>${
    en
      ? `<a href="${MAIN}/en/mcp">Agent Rynku</a> MCP server, npm package <a href="https://www.npmjs.com/package/agentrynku-mcp">agentrynku-mcp</a> ${esc(pkg.version)}. Data is subject to the <a href="${MAIN}/regulamin">terms of service</a> (in Polish). The server does not place orders or give investment advice.`
      : `Serwer MCP <a href="${MAIN}/">Agenta Rynku</a>, paczka npm <a href="https://www.npmjs.com/package/agentrynku-mcp">agentrynku-mcp</a> ${esc(pkg.version)}. Dane podlegają <a href="${MAIN}/regulamin">regulaminowi</a>. Serwer nie składa zleceń i nie udziela porad inwestycyjnych.`
  }</p>
</footer>
</body>
</html>
`;
}

const code = (text, lang = '') => `<pre><code${lang ? ` class="lang-${lang}"` : ''}>${esc(text)}</code></pre>`;

const curlFor = (name, args) =>
  `curl -sS ${ENDPOINT} \\
  -H 'Content-Type: application/json' \\
  -H 'Accept: application/json, text/event-stream' \\
  -d '${JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } })}'`;

function paramTable(schema) {
  const { properties = {}, required = [] } = schema.inputSchema;
  const rows = Object.entries(properties).map(([key, p]) => {
    const range = p.minimum !== undefined ? `${p.minimum}-${p.maximum}` : p.maxLength ? `do ${p.maxLength} znaków` : '';
    return `<tr><td><code>${esc(key)}</code></td><td>${esc(p.type)}</td><td>${required.includes(key) ? 'tak' : 'nie'}</td><td>${p.default ?? ''}</td><td>${esc(range)}</td><td>${paramHelp[key] ?? ''}</td></tr>`;
  });
  return `<div class="table"><table><thead><tr><th>Parametr</th><th>Typ</th><th>Wymagany</th><th>Domyślnie</th><th>Zakres</th><th>Opis</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
}

const breadcrumb = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url })),
});

function toolPage(tool) {
  const schema = schemas.find((s) => s.name === tool.name);
  if (!schema) throw new Error(`${tool.name} missing from site/data/tools.json; run node site/refresh.mjs`);
  const example = examples[tool.name];
  const companyUrl = JSON.stringify(example.response).match(/https:\/\/agentrynku\.pl\/asset\/[A-Z0-9]+/)?.[0];
  const related = tools.filter((t) => t !== tool).map((t) => `<li><a href="/${t.slug}/">${esc(t.h1)}</a></li>`).join('');

  const body = `
<p class="eyebrow">Narzędzie publiczne · <code>${tool.name}</code></p>
<h1>${esc(tool.h1)}</h1>
<p class="lead">${tool.lead}</p>
<p>Działa bez konta i klucza API przez serwer MCP pod adresem <code>${ENDPOINT}</code>. <a href="/${pages.connect.slug}/">Jak podłączyć klienta</a>.</p>

<h2>Kiedy użyć</h2>
<ul>${tool.when.map((w) => `<li>${w}</li>`).join('')}</ul>

<h2>Parametry</h2>
${paramTable(schema)}

<h2>Przykładowe wywołanie</h2>
<p>Agent wywoła narzędzie sam, gdy zadasz pytanie. Te same dane pobierzesz bezpośrednio przez JSON-RPC:</p>
${code(curlFor(tool.name, example.arguments), 'bash')}

<h2>Przykładowa odpowiedź</h2>
<p class="note">Pełna odpowiedź serwera z ${formatDate(example.fetchedAt)} dla parametrów podanych wyżej. Mały limit zapytania utrzymuje przykład krótki.${companyUrl ? ` Kartę spółki znajdziesz na <a href="${companyUrl}">agentrynku.pl</a>.` : ''}</p>
${code(JSON.stringify(example.response, null, 2), 'json')}

<h2>Na co uważać</h2>
<ul>${tool.caveats.map((c) => `<li>${c}</li>`).join('')}</ul>

<h2>O co zapytać agenta</h2>
<ul class="prompts">${tool.prompts.map((p) => `<li>„${esc(p)}”</li>`).join('')}</ul>

<h2>Opis narzędzia dla modelu</h2>
<p>Tak serwer opisuje narzędzie w <code>tools/list</code>. Ten tekst czyta model, wybierając narzędzie:</p>
<blockquote lang="en">${esc(schema.description)}</blockquote>

<h2>Pozostałe publiczne narzędzia</h2>
<ul>${related}</ul>
<p>Portfel, alerty, prognozy i notowania w trakcie sesji są w <a href="/${pages.catalog.slug}/">pełnym katalogu</a> i wymagają <a href="${MAIN}/settings">klucza API</a>.</p>
`;
  return layout({
    slug: tool.slug,
    title: tool.title,
    description: tool.description,
    body,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: tool.h1,
        description: tool.description,
        inLanguage: 'pl',
        dateModified: example.fetchedAt.slice(0, 10),
        url: urlOf(tool.slug),
        publisher: { '@type': 'Organization', name: 'Agent Rynku', url: MAIN },
      },
      breadcrumb([['Dokumentacja', urlOf('')], [tool.h1, urlOf(tool.slug)]]),
    ],
  });
}

const httpConfig = JSON.stringify({ mcpServers: { agentrynku: { type: 'http', url: ENDPOINT } } }, null, 2);
const stdioConfig = JSON.stringify({ mcpServers: { agentrynku: { command: 'npx', args: ['-y', 'agentrynku-mcp'] } } }, null, 2);

function homePage(keyedToolCount) {
  const toolRows = tools
    .map((t) => `<tr><td><a href="/${t.slug}/">${esc(t.h1)}</a></td><td><code>${t.name}</code></td></tr>`)
    .join('');
  const body = `
<h1>Dane z polskiej giełdy dla agentów AI</h1>
<p class="lead">Agent Rynku udostępnia dane o spółkach z GPW przez <a href="https://modelcontextprotocol.io">Model Context Protocol</a>. Claude, Cursor albo własny agent dostaje wyniki kwartalne, wskaźniki, kalendarz raportów, dywidendy i historię cen, każdą liczbę ze źródłem i datą.</p>
<p>Sześć narzędzi działa bez konta i bez klucza. Wystarczy adres serwera:</p>
${code(ENDPOINT)}

<h2>Start w minutę</h2>
<p>W Claude Code:</p>
${code(`claude mcp add --transport http agentrynku ${ENDPOINT}`, 'bash')}
<p>W kliencie, który czyta konfigurację <code>mcpServers</code>:</p>
${code(httpConfig, 'json')}
<p>Potem zapytaj: „Znajdź KGHM i pokaż ostatni raport kwartalny ze źródłem”. Konfiguracja dla innych klientów: <a href="/${pages.connect.slug}/">podłączenie</a>.</p>

<h2>Publiczne narzędzia</h2>
<div class="table"><table><thead><tr><th>Co zwraca</th><th>Narzędzie</th></tr></thead><tbody>${toolRows}</tbody></table></div>
<p>Każda strona narzędzia zawiera parametry, prawdziwe wywołanie i odpowiedź z produkcji oraz ograniczenia danych.</p>

<h2>Skąd są dane</h2>
<p>Wyniki finansowe pochodzą z raportów okresowych emitentów i komunikatów GPW, dywidendy z komunikatów walnych zgromadzeń, ceny z zapisanej historii dziennej. Nie korzystamy z baz portali finansowych. Gdy liczby brakuje albo nie przeszła kontroli jakości, odpowiedź mówi to wprost zamiast podawać wartość zastępczą. Szczegóły: <a href="${MAIN}/metodologia">metodologia</a>.</p>

<h2>Limity i klucz API</h2>
<p>Wywołania bez klucza są bezpłatne i mają limit tempa. Odpowiedź HTTP 429 podaje nagłówek <code>Retry-After</code>. Pozostałe ${keyedToolCount} narzędzia, czyli portfel, alerty, prognozy i notowania w trakcie sesji, wymagają konta i <a href="${MAIN}/settings">klucza API</a>: 100 wywołań miesięcznie w planie FREE albo 10 000 w PRO (<a href="${MAIN}/cennik">cennik</a>). Przegląd wszystkich funkcji jest w <a href="/${pages.catalog.slug}/">katalogu</a>.</p>

<h2>Czego serwer nie robi</h2>
<ul>
<li>Nie składa zleceń i nie łączy się z rachunkiem maklerskim.</li>
<li>Nie udziela porad inwestycyjnych. Zwraca dane i wyliczenia.</li>
<li>Nie zgaduje. Pusty kalendarz albo brak dywidendy nie dowodzą, że zdarzenia nie ma.</li>
</ul>
`;
  return layout({
    slug: '',
    title: pages.home.title,
    description: pages.home.description,
    body,
    alternates: { pl: urlOf(''), en: urlOf(pages.en.slug), 'x-default': urlOf('') },
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Agent Rynku MCP', url: urlOf(''), inLanguage: 'pl' },
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Agent Rynku MCP',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        softwareVersion: pkg.version,
        description: pages.home.description,
        url: `${MAIN}/mcp`,
        downloadUrl: 'https://www.npmjs.com/package/agentrynku-mcp',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'PLN' },
        publisher: { '@type': 'Organization', name: 'Agent Rynku', url: MAIN },
      },
    ],
  });
}

function connectPage() {
  const body = `
<h1>Podłączenie do Claude, Cursora i innych klientów</h1>
<p class="lead">Serwer działa przez Streamable HTTP pod adresem <code>${ENDPOINT}</code>. Dane publiczne nie wymagają nagłówka <code>Authorization</code> ani zmiennych środowiskowych.</p>

<h2 id="claude-code">Claude Code</h2>
${code(`claude mcp add --transport http agentrynku ${ENDPOINT}`, 'bash')}
<p>Sprawdź połączenie poleceniem <code>/mcp</code> w sesji Claude Code.</p>

<h2 id="claude-desktop">Claude Desktop</h2>
<p>Claude Desktop uruchamia lokalne polecenie, więc użyj mostu z npm. Wklej do <code>claude_desktop_config.json</code> i uruchom aplikację ponownie:</p>
${code(stdioConfig, 'json')}
<p>Most wymaga Node 20.18.1 lub nowszego i przekazuje ruch do serwera HTTP przez <a href="https://www.npmjs.com/package/mcp-remote">mcp-remote</a>.</p>

<h2 id="cursor">Cursor</h2>
<p>Dodaj do <code>~/.cursor/mcp.json</code> albo do <code>.cursor/mcp.json</code> w projekcie:</p>
${code(httpConfig, 'json')}

<h2 id="http">Inne klienty i własny kod</h2>
<p>Każdy klient MCP obsługujący HTTP połączy się z samym adresem. Bez SDK wyślesz zwykłe JSON-RPC. Lista narzędzi:</p>
${code(`curl -sS ${ENDPOINT} \\
  -H 'Content-Type: application/json' \\
  -H 'Accept: application/json, text/event-stream' \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`, 'bash')}
<p>Wywołania konkretnych narzędzi są na ich stronach, np. <a href="/wyniki-kwartalne-gpw/">wyniki kwartalne</a>.</p>

<h2 id="klucz">Z kluczem API</h2>
<p>Klucz z <a href="${MAIN}/settings">ustawień konta</a> otwiera narzędzia zgodne z jego zakresami. W HTTP dodaj nagłówek <code>Authorization: Bearer TWOJ_KLUCZ</code>. W moście stdio dodaj do konfiguracji:</p>
${code(`"env": { "AGENTRYNKU_API_KEY": "TWOJ_KLUCZ" }`, 'json')}
<p>Zakresy klucza mogą obejmować także zapis, na przykład zmiany w portfelu. Sprawdź je, zanim przekażesz klucz agentowi.</p>
`;
  return layout({
    slug: pages.connect.slug,
    title: pages.connect.title,
    description: pages.connect.description,
    body,
    jsonLd: [breadcrumb([['Dokumentacja', urlOf('')], ['Podłączenie', urlOf(pages.connect.slug)]])],
  });
}

function tasksPage() {
  const body = `
<h1>Trzy zadania z danymi GPW dla agenta</h1>
<p class="lead">Podłącz <a href="/${pages.connect.slug}/">serwer MCP</a> pod adresem <code>${ENDPOINT}</code> i skopiuj jedno z poleceń. Te zadania korzystają z publicznych narzędzi, bez konta i klucza.</p>

<h2 id="marza">Marża netto KGHM z dwóch kwartałów</h2>
<blockquote>Znajdź KGHM i pobierz dwa ostatnie kwartały wyników oraz wskaźników. Pokaż przychody, zysk netto i marżę netto. Porównuj samodzielne kwartały, przy jednakowej walucie i zakresie raportu. Podaj walutę, jednostki i źródła. Braki zostaw jako brak danych. Przy sprzeczności wartości z notatką źródłową wstrzymaj obliczenie.</blockquote>
<p>Najpierw <a href="/wyszukiwarka-spolek-gpw/"><code>search_gpw_companies</code></a> z <code>query: "KGHM"</code>. Następnie <a href="/wyniki-kwartalne-gpw/"><code>get_quarterly_kpis</code></a> oraz <a href="/wskazniki-finansowe-gpw/"><code>get_financial_ratios</code></a> z kanonicznym symbolem i <code>quartersBack: 2</code>.</p>
${code(curlFor('get_quarterly_kpis', { symbol: 'KGHM', quartersBack: 2 }), 'bash')}
${code(curlFor('get_financial_ratios', { symbol: 'KGHM', quartersBack: 2 }), 'bash')}
<p>Wynik powinien mieć dwa wiersze, jeśli dane są dostępne, z okresem, zakresem, jednostkami, walutą i źródłami. Kwoty są w milionach waluty raportu, EPS na akcję. Marża netto to <code>100 * netIncomePLN / revenuePLN</code>. Sprawdź zgodność <code>currency</code> i <code>reportScope</code> obu wierszy, a także <code>values</code>, <code>withheld</code>, <code>dataQuality</code> i <code>oneOffNotes</code>. Zgodna arytmetyka nie rozstrzyga poprawności danych wejściowych.</p>

<h2 id="ceny">Zmiana ceny i obsunięcie KGHM</h2>
<blockquote>Pobierz dzienne ceny KGHM za ostatnie 365 dni, do 500 świec. Podaj faktyczny zakres, źródło, walutę i skalę cen. Przy znanej i jednorodnej skali oblicz zmianę pierwszego do ostatniego zamknięcia oraz największe obsunięcie zamknięć od wcześniejszego maksimum. Przy nieznanej lub mieszanej skali odmów obliczenia porównywalnej zmiany.</blockquote>
${code(curlFor('get_public_price_history', { symbol: 'KGHM', days: 365, limit: 500 }), 'bash')}
<p>Sprawdź <code>firstCandleAt</code>, <code>lastCandleAt</code>, <code>candleCount</code>, <code>truncated</code> i <code>priceScale</code> każdej świecy. Zmiana wynosi <code>100 * (ostatnie / pierwsze - 1)</code>. Obsunięcie w dniu t to <code>100 * (close[t] / max(close[0..t]) - 1)</code>; wybierz najbardziej ujemny wynik. Wartości zamknięć muszą być dodatnie i skończone.</p>
<p><code>currency: null</code> pozostaje nieznaną walutą. Odczyt opisuje historię z bazy, a nie kurs na żywo. Skorygowany szereg może się zmienić po działaniach korporacyjnych; zmiana zamknięć nie jest pełnym rozliczeniem stopy zwrotu inwestora. Więcej o metadanych: <a href="/historia-cen-gpw/">historia cen</a>.</p>

<h2 id="terminy">Terminy raportów i uchwała dywidendowa</h2>
<blockquote>Pobierz znane terminy raportów GPW na następne 30 dni, do 100 zdarzeń. Osobno pokaż do trzech ostatnich znanych uchwał dywidendowych AGORY. Podaj kwotę, walutę, status, daty i źródło. Oddziel terminy przyszłe od historycznych. Zaznacz braki oraz przycięcie listy.</blockquote>
${code(curlFor('get_public_earnings_calendar', { daysAhead: 30, limit: 100 }), 'bash')}
${code(curlFor('get_public_dividends', { symbol: 'AGORA', limit: 3 }), 'bash')}
<p>Kalendarz ma <code>source</code>, <code>fetchedAt</code> i <code>companyUrl</code>. Adres karty spółki nie jest adresem komunikatu źródłowego. Porównaj <code>returned</code> z <code>totalMatching</code> i sprawdź <code>truncated</code>. Uchwały WZA mają <code>sourceUrl</code>, status, <code>dateKind</code> oraz odrębne daty prawa, dnia bez prawa i wypłaty. Historyczna wypłata nie należy do przyszłego kalendarza. Brak znanego wpisu nie oznacza braku zdarzenia.</p>
<p>Szczegóły: <a href="/kalendarz-raportow-gpw/">kalendarz raportów</a> i <a href="/dywidendy-gpw/">dywidendy</a>.</p>

<h2 id="braki">Kontrola braków</h2>
<p>Dla nieistniejącego symbolu <code>get_quarterly_kpis</code> zwraca <code>emptyReason: "unknown_or_ambiguous_instrument"</code>. Nie przedstawiaj pustej listy jako zerowego wyniku finansowego. Dla symbolu z rynku USA, np. <code>CRM.US</code>, narzędzie <code>get_public_price_history</code> zwraca <code>emptyReason: "unsupported_market"</code>. Publiczna historia cen obejmuje akcje GPW.</p>
`;
  return layout({ slug: pages.tasks.slug, title: pages.tasks.title,
    description: pages.tasks.description, body,
    jsonLd: [breadcrumb([['Dokumentacja', urlOf('')], ['Zadania dla agenta', urlOf(pages.tasks.slug)]])] });
}

function parseCatalog(markdown) {
  const sections = [];
  for (const line of markdown.split('\n')) {
    const heading = line.match(/^## (.+)/);
    if (heading) sections.push({ title: heading[1], rows: [] });
    const row = line.match(/^\| `([a-z0-9_]+)` \| ([^|]+) \| (.+) \|$/);
    if (row && sections.length) sections.at(-1).rows.push({ name: row[1], access: row[2].trim(), text: row[3].trim() });
  }
  return sections;
}

function catalogPage(markdown) {
  const sections = parseCatalog(markdown);
  const total = sections.reduce((n, s) => n + s.rows.length, 0);
  const bySlug = Object.fromEntries(tools.map((t) => [t.name, t.slug]));
  const body = `
<h1>Katalog ${total} narzędzi</h1>
<p class="lead">Wszystkie funkcje serwera MCP Agenta Rynku. Sześć oznaczonych jako publiczne działa bez konta. Pozostałe wymagają <a href="${MAIN}/settings">klucza API</a> i są filtrowane według jego zakresów.</p>
<h2>Oryginalny raport emitenta do pobrania</h2>
<p>Wywołaj <code>get_report_event</code> z symbolem spółki i właściwym <code>quarter</code> (np. <code>2026-Q2</code>) albo konkretnym <code>eventId</code>. Narzędzie wymaga klucza API z zakresem <code>read:portfolio</code> i spółki w zakresie konta. Nie jest narzędziem publicznym bez klucza.</p>
<p><code>zdarzenie.zrodla[].zalaczniki</code> zawiera obiekty <code>{nazwa, url}</code> oryginalnych plików przypisanych do źródeł tego zdarzenia. Podaj użytkownikowi nazwy i linki. Pusta lista oznacza brak zapisanych poprawnych linków, a nie brak opublikowanych plików. Zawsze podaj także dostępny <code>zdarzenie.zrodla[].url</code> jako link do strony komunikatu: jeśli bezpośredni plik się nie otwiera, użytkownik może pobrać załącznik stamtąd. Kopiuj URL dokładnie, zachowując podkreślenia i parametry; przy <code>found: false</code> lub braku URL nie wymyślaj adresu. Linki emitenta nie są eksportem analizy Agenta Rynku do PDF lub Word.</p>
${sections
  .map(
    (s) => `<h2>${esc(s.title)}</h2>
<div class="table"><table><thead><tr><th>Narzędzie</th><th>Dostęp</th><th>Opis</th></tr></thead><tbody>${s.rows
      .map(
        (r) =>
          `<tr><td><code>${bySlug[r.name] ? `<a href="/${bySlug[r.name]}/">${r.name}</a>` : r.name}</code></td><td>${r.access === 'Public' ? '<span class="pub">publiczne</span>' : 'klucz API'}</td><td>${esc(r.text)}</td></tr>`,
      )
      .join('')}</tbody></table></div>`,
  )
  .join('\n')}
`;
  return { total, html: layout({ slug: pages.catalog.slug, title: pages.catalog.title, description: pages.catalog.description, body }) };
}

function enPage() {
  const body = `
<h1>Warsaw Stock Exchange data for AI agents</h1>
<p class="lead">Agent Rynku is a hosted MCP server with data on companies listed on the Warsaw Stock Exchange (GPW). Six tools work without an account or API key; every number comes with its report period, currency and source.</p>
${code(ENDPOINT)}
<h2>Connect</h2>
${code(`claude mcp add --transport http agentrynku ${ENDPOINT}`, 'bash')}
<p>Or, for clients that read <code>mcpServers</code>:</p>
${code(httpConfig, 'json')}
<p>For clients that launch a local command, use <code>npx -y agentrynku-mcp</code> (Node 20.18.1+).</p>
<h2>Public tools</h2>
<ul>
<li><a href="/wyszukiwarka-spolek-gpw/"><code>search_gpw_companies</code></a>: find GPW companies by name, ticker, alias or ISIN.</li>
<li><a href="/wyniki-kwartalne-gpw/"><code>get_quarterly_kpis</code></a>: quarterly revenue, EBITDA, net income, EPS, balance sheet and cash flow (monetary fields in millions).</li>
<li><a href="/wskazniki-finansowe-gpw/"><code>get_financial_ratios</code></a>: quarterly margins and equity/assets with formulas.</li>
<li><a href="/kalendarz-raportow-gpw/"><code>get_public_earnings_calendar</code></a>: known scheduled reports over the next 90 days.</li>
<li><a href="/historia-cen-gpw/"><code>get_public_price_history</code></a>: stored daily OHLCV, up to 500 candles.</li>
<li><a href="/dywidendy-gpw/"><code>get_public_dividends</code></a>: dividend resolutions from shareholder meeting announcements.</li>
</ul>
<p>Tool pages are in Polish; parameters, requests and JSON responses read the same in any language. The <a href="https://github.com/krystiangw/agentrynku-mcp#readme">README</a> and the <a href="${MAIN}/en/mcp">English setup guide</a> cover the rest. Portfolio, alerts, forecasts and intraday quotes need an <a href="${MAIN}/settings">API key</a>.</p>
<p>Missing data is explicit: an empty calendar or dividend list does not prove there is no event. The server does not place orders or give investment advice.</p>
`;
  return layout({
    slug: pages.en.slug,
    lang: 'en',
    title: pages.en.title,
    description: pages.en.description,
    body,
    alternates: { pl: urlOf(''), en: urlOf(pages.en.slug), 'x-default': urlOf('') },
  });
}

function notFoundPage() {
  return layout({
    slug: '404',
    title: 'Nie ma takiej strony - Agent Rynku MCP',
    description: 'Strona nie istnieje.',
    body: `<h1>Nie ma takiej strony</h1><p>Wróć do <a href="/">wprowadzenia</a> albo zobacz <a href="/${pages.catalog.slug}/">katalog narzędzi</a>.</p>`,
    noindex: true,
  });
}

const catalog = catalogPage(await read('TOOLS.md'));
const routes = [
  ['', homePage(catalog.total - tools.length)],
  [pages.connect.slug, connectPage()],
  [pages.tasks.slug, tasksPage()],
  ...tools.map((t) => [t.slug, toolPage(t)]),
  [pages.catalog.slug, catalog.html],
  [pages.en.slug, enPage()],
];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const [slug, html] of routes) {
  const dir = new URL(slug ? `${slug}/` : './', out);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL('index.html', dir), html);
}
await writeFile(new URL('404.html', out), notFoundPage());
await cp(new URL('site/static/', root), out, { recursive: true });

// Only tool pages have a content date we can trust; a build date on every URL teaches Google to ignore lastmod.
const lastmodBySlug = Object.fromEntries(tools.map((t) => [t.slug, examples[t.name].fetchedAt.slice(0, 10)]));
await writeFile(
  new URL('sitemap.xml', out),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(([slug]) => `  <url><loc>${urlOf(slug)}</loc>${lastmodBySlug[slug] ? `<lastmod>${lastmodBySlug[slug]}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`,
);
await writeFile(new URL('robots.txt', out), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
await writeFile(
  new URL('llms.txt', out),
  `# Agent Rynku MCP

> Hosted MCP server with Warsaw Stock Exchange (GPW) data: quarterly financials, ratios, earnings calendar, WZA dividends and daily prices. Endpoint ${ENDPOINT} (Streamable HTTP). Six public tools need no API key; ${catalog.total - tools.length} more need a key.

## Docs
- [Connect a client](${urlOf(pages.connect.slug)}): Claude Code, Claude Desktop, Cursor, raw JSON-RPC
- [Agent tasks](${urlOf(pages.tasks.slug)}): quarterly margins, daily-price change and drawdown, earnings dates and WZA dividends
${tools.map((t) => `- [${t.name}](${urlOf(t.slug)}): ${t.description}`).join('\n')}
- [Full catalog](${urlOf(pages.catalog.slug)}): all ${catalog.total} tools with access level

## Optional
- [Product page](${MAIN}/mcp)
- [Methodology](${MAIN}/metodologia)
- [Source and README](https://github.com/krystiangw/agentrynku-mcp)
`,
);
await writeFile(new URL('CNAME', out), new URL(SITE).host + '\n');

console.log(`Built ${routes.length} pages, catalog of ${catalog.total} tools, into _site/`);

# Agent Rynku MCP: Warsaw Stock Exchange data for agents

[![npm](https://img.shields.io/npm/v/agentrynku-mcp)](https://www.npmjs.com/package/agentrynku-mcp)
[![MCP Registry](https://img.shields.io/badge/MCP%20Registry-pl.agentrynku%2Fgpw-blue)](https://registry.modelcontextprotocol.io/v0.1/servers?search=pl.agentrynku%2Fgpw)

Use GPW company financials through a hosted MCP server, without creating an account. [Agent Rynku](https://agentrynku.pl/en/mcp) returns report periods, currency, sources and quality checks. Missing data is explicit.

Documentation with parameters and real responses for every public tool: [docs.agentrynku.pl](https://docs.agentrynku.pl/).

## Connect without an API key

The endpoint uses Streamable HTTP:

```text
https://agentrynku.pl/api/mcp
```

For clients that read this configuration format:

```json
{
  "mcpServers": {
    "agentrynku": {
      "type": "http",
      "url": "https://agentrynku.pl/api/mcp"
    }
  }
}
```

For clients that launch a local command, this package bridges stdio to the hosted server using [mcp-remote](https://www.npmjs.com/package/mcp-remote). Requires Node 20.18.1 or newer:

```json
{
  "mcpServers": {
    "agentrynku": {
      "command": "npx",
      "args": ["-y", "agentrynku-mcp"]
    }
  }
}
```

No Authorization header or environment variable is needed for public data.

## Public tools

| Tool | What it returns | Request limit |
|---|---|---|
| `search_gpw_companies` | GPW companies by name, ticker, alias or ISIN, with canonical symbols and company URLs | 20 results |
| `get_quarterly_kpis` | Quarterly financials, reporting scope, currency, units, sources and quality gates | 20 quarters |
| `get_financial_ratios` | Quarterly margins and equity/assets, with formulas and reasons for unavailable values | 20 quarters |
| `get_public_earnings_calendar` | Known scheduled reports across GPW, with source and fetch date | 90 days, 100 events |
| `get_public_price_history` | Stored daily GPW OHLCV with source, dates, scale and truncation; no supplier fetch on demand | 1-3650 calendar days, 500 candles |
| `get_public_dividends` | Known issuer WZA dividend resolutions: amount per share, currency, dates and source | 100 events |

Start with: "Find KGHM and show its latest quarterly results with report sources." Then ask for the EBITDA margin or the next 30 days of scheduled GPW reports.

A direct public call:

```bash
curl -sS https://agentrynku.pl/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_quarterly_kpis","arguments":{"symbol":"KGHM","quartersBack":1}}}'
```

Public calls are rate limited and have a response-size limit. HTTP 429 includes `Retry-After`. Coverage is incomplete: an empty calendar does not prove there are no reports, and an empty WZA response does not prove a company pays no dividend. Ratios are based on individual quarterly reports, with scope stated per row; they are not TTM or price-based valuation multiples. Financials cover issuer reports and GPW announcements; portal databases and portal-sourced fields are excluded. Stored daily GPW equity price history is public, excluding indices, ETFs and bonds; intraday and vendor dividend history are not public. Price responses include source, stored-series update time and actual candle dates. Per-candle scale and adjustments are preserved; unknown scale and null currency mean unrecorded metadata. Adjusted history may change after splits or dividends. Coverage can be shorter than the requested window, and truncation is explicit.

## Additional tools with a key

Portfolio, alerts, forecasts, intraday quotes and other functions require an account and API key from [settings](https://agentrynku.pl/settings). Anonymous `tools/list` returns the six public tools. Keyed discovery returns the tools permitted by that key's scopes. The [full catalog](TOOLS.md) contains the available functions and identifies the public subset.

For HTTP, add `Authorization: Bearer YOUR_KEY`. For the stdio bridge, add:

```json
"env": { "AGENTRYNKU_API_KEY": "YOUR_KEY" }
```

The bridge validates a supplied key with one data call on startup. That check can consume an account allowance. It does not validate a key when none is supplied. Keep keys private: scopes can permit both reads and related writes.

Public calls without a key do not consume an account allowance. Keyed calls use 100 calls/month on FREE or 10,000 on PRO. `query_companion` also consumes an AI message. See [pricing](https://agentrynku.pl/cennik) and [account usage](https://agentrynku.pl/usage).

The server does not place orders or connect to a brokerage account. Source reports and many tool descriptions are in Polish. [English setup guide](https://agentrynku.pl/en/mcp), [Polish guide](https://agentrynku.pl/mcp), [methodology](https://agentrynku.pl/metodologia), [issues](https://github.com/krystiangw/agentrynku-mcp/issues).

## Po polsku

Dane GPW dla agenta bez konta i klucza: wyszukiwanie spółek, wyniki kwartalne, marże, publiczny kalendarz raportów, znane uchwały dywidendowe WZA i dzienna historia cen z bazy. Podłącz klienta do `https://agentrynku.pl/api/mcp` bez nagłówka Authorization albo uruchom `npx -y agentrynku-mcp`.

Portfel, alerty, prognozy i notowania intraday wymagają klucza. Klucz może dawać także prawa zapisu. Brak liczby nie oznacza zera, a brak znanego terminu nie oznacza braku raportu lub dywidendy. [Instrukcja i katalog](https://agentrynku.pl/mcp).

## Verification

In this repository, after `npm ci`, run `npm run test:live` to check the live HTTP endpoint and the stdio bridge without a key. It reads public KGHM results and checks that a private write is rejected. To test a development endpoint: `npm run test:live -- http://localhost:3104/api/mcp`.

## License

The bridge code and documentation are MIT licensed. Data returned by the server is subject to the [Agent Rynku terms](https://agentrynku.pl/regulamin).


### 1.2.1: original report files

The keyed `get_report_event` response includes `zdarzenie.zrodla[].zalaczniki` with `{nazwa, url}` for original issuer attachments linked to that report event. An empty list means no valid attachment links are recorded; use the source `url` as a communication page when available. This is not a PDF/Word export of Agent Rynku analysis. The tool still requires an API key with `read:portfolio` and a company within the account's scope. Public access and transport are unchanged. See the [tool catalog](https://docs.agentrynku.pl/katalog/).

# Agent Rynku MCP: Warsaw Stock Exchange (GPW) data for your AI agent

[![npm](https://img.shields.io/npm/v/agentrynku-mcp)](https://www.npmjs.com/package/agentrynku-mcp)
[![MCP Registry](https://img.shields.io/badge/MCP%20Registry-pl.agentrynku%2Fgpw-blue)](https://registry.modelcontextprotocol.io/v0/servers?search=pl.agentrynku)

**[Agent Rynku](https://agentrynku.pl/mcp)** is a hosted [Model Context Protocol](https://modelcontextprotocol.io) server with 93 tools for the Polish stock market: live and historical quotes, ESPI/EBI filings with an assessment of each one, quarterly KPIs extracted from company documents, earnings forecasts with a track record, and portfolio analytics in PLN.

Connect it to Claude, Cursor, or any MCP client and ask things like:

- "What did KGHM report today, and how does it compare with the forecast?"
- "Show WIG20 companies after their latest results."
- "Which of my positions are above 20% concentration?"
- "How much tax will I owe on this year's sales?"

> Polski opis jest [niżej](#po-polsku).

## Quick start

**1. Get an API key.** Create a free account at [agentrynku.pl](https://agentrynku.pl/login) and generate a key in [settings](https://agentrynku.pl/settings). The free account covers unlimited data tool calls; only the LLM-backed companion queries are metered. The bridge below makes one check call per start to verify the key.

**2. Connect your client.** The server speaks Streamable HTTP at:

```
https://agentrynku.pl/api/mcp
```

with the header `Authorization: Bearer YOUR_KEY`.

### Claude Code

```bash
claude mcp add --transport http agentrynku https://agentrynku.pl/api/mcp \
  --header "Authorization: Bearer YOUR_KEY"
```

### Cursor and other clients with remote HTTP support

```json
{
  "mcpServers": {
    "agentrynku": {
      "type": "http",
      "url": "https://agentrynku.pl/api/mcp",
      "headers": { "Authorization": "Bearer YOUR_KEY" }
    }
  }
}
```

### Claude Desktop and other clients that only run local commands

This package is a small stdio bridge to the hosted server (it uses [`mcp-remote`](https://www.npmjs.com/package/mcp-remote)):

```json
{
  "mcpServers": {
    "agentrynku": {
      "command": "npx",
      "args": ["-y", "agentrynku-mcp"],
      "env": { "AGENTRYNKU_API_KEY": "YOUR_KEY" }
    }
  }
}
```

More configs in [`examples/`](examples).

**Try before signing up:** `initialize` and `tools/list` work without a key, so you can see the full catalogue first:

```bash
curl -s https://agentrynku.pl/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## What is inside

| Area | Tools | Examples |
|---|---|---|
| Quotes and market | 10 | `get_spot_price`, `get_intraday_quote`, `get_price_series`, `whats_moving_now`, `sector_pulse_pl` |
| Filings and reports | 10 | `get_news_history`, `get_report_event`, `get_quarterly_kpis`, `get_company_analysis`, `get_earnings_calendar` |
| Scores, screens and rankings | 10 | `get_stock_rankings`, `get_sygnal_score`, `find_opportunities`, `find_dip_candidates`, `run_predictive_scan` |
| Forecasts and drivers | 6 | `get_forecast`, `get_forecast_accuracy`, `get_drivers`, `get_factor_context` |
| Signals, alerts and events | 19 | `get_alerts`, `get_asset_signals`, `track_priced_event`, `create_decision_rule` |
| Portfolio and allocation | 15 | `get_portfolio_context`, `get_concentration_risk`, `recommend_position_size`, `modify_watchlist` |
| Transactions and tax | 5 | `get_realized_pnl`, `get_transaction_history`, `find_tlh_opportunities` |
| Market risk | 4 | `get_risk_regime`, `get_risk_dashboard`, `get_event_risks` |
| Catalyst bonds | 3 | `get_bond_series`, `get_bond_orderbook`, `calculate_early_redemption` |
| Account, brief and diagnostics | 11 | `get_daily_brief`, `query_companion`, `set_agent_prefs` |

Full list with descriptions: **[TOOLS.md](TOOLS.md)**. Portfolio tools read the portfolio you keep in your Agent Rynku account; key scopes decide which tools a key can see.

## Scope and limits

- **Polish equities only** (GPW main market and NewConnect), deliberately: filings are read in Polish, and extraction is built for the formats the GPW actually uses.
- Tool names are English. Tool descriptions, the server's instructions, the web app and the source material (filings, reports) are Polish.
- The server **does not place orders**, does not connect to a brokerage account and **does not give investment advice**. When data is missing it returns a refusal with a reason, never a substitute number.
- Intraday quotes come from a delayed GPW feed (typically around 25 minutes behind).

## Links

- Server page and full catalogue: [agentrynku.pl/mcp](https://agentrynku.pl/mcp) ([English](https://agentrynku.pl/en/mcp))
- Methodology of the assessments: [agentrynku.pl/metodologia](https://agentrynku.pl/metodologia)
- Issues and questions: [GitHub issues](https://github.com/krystiangw/agentrynku-mcp/issues)

## Po polsku

**Agent Rynku** to serwer MCP z danymi Giełdy Papierów Wartościowych w Warszawie: 93 narzędzia, przez które Twój agent czyta notowania i świece śróddzienne, raporty ESPI i EBI z oceną każdego komunikatu, dane kwartalne wyciągnięte z dokumentów spółek, prognozy wyników z rozliczeniem trafności oraz analitykę portfela w złotych.

1. Załóż darmowe konto na [agentrynku.pl](https://agentrynku.pl/login) i wygeneruj klucz API w [ustawieniach](https://agentrynku.pl/settings).
2. Podłącz klienta pod adres `https://agentrynku.pl/api/mcp` z nagłówkiem `Authorization: Bearer TWOJ_KLUCZ` (przykłady wyżej). Klient, który umie uruchomić tylko lokalne polecenie (np. Claude Desktop), użyje tej paczki: `npx -y agentrynku-mcp` ze zmienną `AGENTRYNKU_API_KEY`.

Serwer nie składa zleceń, nie łączy się z rachunkiem maklerskim i nie daje porady inwestycyjnej. Pełny katalog narzędzi po polsku: [agentrynku.pl/mcp](https://agentrynku.pl/mcp) i [TOOLS.md](TOOLS.md).

## License

The bridge code and this documentation are MIT licensed. Data returned by the server is subject to the [Agent Rynku terms](https://agentrynku.pl/regulamin).

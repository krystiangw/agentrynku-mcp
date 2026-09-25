# Tools / Narzędzia

93 tools, generated from `tools/list` of https://agentrynku.pl/api/mcp on 2026-09-25. Descriptions are the short Polish summaries the server returns without a key (the same as on https://agentrynku.pl/mcp). With an API key, `tools/list` returns full English descriptions with units and data caveats.

## Quotes and market / Notowania i rynek

Kursy bieżące, świece dzienne i śróddzienne, ruchy sesji, puls sektorów i anomalie wolumenu na GPW.

| Tool | Opis (PL) |
|---|---|
| `get_cross_market_peers` | Odpowiedniki spółki na drugim rynku, z korelacją i różnicą wyceny - do porównania GPW z USA. |
| `get_spot_price` | Bieżąca cena jednej spółki, z informacją, czy pochodzi z zamknięcia, czy z kwotowania w trakcie sesji. |
| `get_dividends` | Historia i znane przyszłe dywidendy spółki, z kwotą, datą, źródłem i świeżością. |
| `get_price_series` | Świece OHLC i zmienność zrealizowana - do stop-lossów i wielkości pozycji. |
| `get_intraday_candles` | Świece godzinowe z bieżącej i poprzednich sesji. |
| `get_intraday_quote` | Kwotowanie w trakcie sesji: cena, otwarcie, zakres dnia, zmiana wobec zamknięcia. |
| `get_market_anomalies` | Ruchy cen odstające od zwykłej zmienności spółki, wyłapane automatycznie. |
| `sector_pulse_pl` | Puls sektorów GPW: które radzą sobie dziś lepiej, a które gorzej. |
| `whats_moving_now` | Co się dziś rusza na rynku - największe zmiany sesji. |
| `compare_symbols` | Porównanie kilku spółek obok siebie. |

## Filings and reports / Raporty i komunikaty spółek

Raporty ESPI i EBI, dane kwartalne wyciągnięte z dokumentów, kalendarz publikacji, konferencje wynikowe i walne zgromadzenia.

| Tool | Opis (PL) |
|---|---|
| `get_company_analysis` | Analiza fundamentalna spółki przygotowana przez model. |
| `get_company_dossier` | Źródłowa pamięć decyzyjna: trwałe przewagi, słabości, otwarte ryzyka, potwierdzone wzorce i kontekst biznesowy. |
| `get_report_event` | Jeden raport kwartalny jako zdarzenie: co mówi, co rozliczył, co zmienił, co zostaje otwarte, z wiekiem i źródłem każdej liczby. |
| `get_conference_reminders` | Nadchodzące konferencje wynikowe spółek, które śledzisz. |
| `get_quarterly_kpis` | Wyniki kwartalne spółki: przychód, zysk, bilans i przepływy, wraz z oceną jakości każdego wiersza. |
| `get_conference_summary` | Streszczenie konferencji wynikowej: cytaty zarządu, prognozy i sygnały ostrzegawcze. |
| `get_earnings_deepdive` | Pogłębione omówienie raportu kwartalnego: co zaskoczyło, co niepokoi, co zapowiedział zarząd. |
| `get_wza_summary` | Streszczenie walnego zgromadzenia akcjonariuszy. |
| `get_news_history` | Historia depesz o spółce razem z ich oceną. |
| `get_earnings_calendar` | Kalendarz zbliżających się raportów okresowych. |

## Scores, screens and rankings / Oceny i rankingi

Ocena Agenta Rynku na sześciu wymiarach, rankingi całego rynku i skanery szukające konkretnych układów.

| Tool | Opis (PL) |
|---|---|
| `get_sygnal_score` | Ocena 0-100 dla spółki z GPW: siedem wymiarów z uzasadnieniem każdego. Do samej oceny wchodzą tylko wymiary z dowodem, najwyżej sześć: płynność pokazujemy osobno i nie punktujemy. |
| `get_top_opportunities` | Ta sama lista spółek spoza portfela co w kafelku Top okazje na pulpicie. |
| `find_opportunities` | Wyszukiwanie okazji według zadanych kryteriów. |
| `find_dip_candidates` | Spółki, które mocno spadły, ale fundamenty trzymają. |
| `find_overheat_candidates` | Spółki, które urosły szybciej, niż uzasadniają to wyniki. |
| `run_predictive_scan` | Skan spółek pod kątem zbliżających się raportów i przewidywanego zaskoczenia. |
| `get_ranking_performance` | Jak ranking sprawdzał się w przeszłości. |
| `get_stock_rankings` | Ranking spółek GPW według wybranego kryterium. |
| `rank_revenue_growth` | Ranking wzrostu przychodów. |
| `rank_thematic` | Ranking spółek w obrębie wybranego motywu inwestycyjnego. |

## Forecasts and drivers / Prognozy wyników

Prognozy przychodu i zysku na następny kwartał wraz z ich rozliczeniem po publikacji raportu oraz drivery makro.

| Tool | Opis (PL) |
|---|---|
| `get_forecast` | Prognoza wyników spółki na najbliższe kwartały wraz z wyceną modelową. |
| `get_forecast_accuracy` | Historyczna celność modeli prognostycznych i to, czy model przeszedł bramkę jakości. |
| `get_drivers` | Bieżące czynniki makro: surowce, waluty, stopy, nastroje na rynku amerykańskim. |
| `macro_attribution` | Co najprawdopodobniej stało za ostatnim ruchem WIG20. |
| `get_evaluation_outcomes` | Rozliczenie dawnych alertów po cenach: co się sprawdziło, a co nie, na tle indeksu. |
| `get_factor_context` | Deterministyczny kontekst jednej zmiany czynnika dla spółki, zakotwiczony w chwili asKnownAt. |

## Portfolio and allocation / Portfel i alokacja

Pozycje z wielu rachunków, stopa zwrotu, zmienność, koncentracja i rozjazd wobec docelowych wag.

| Tool | Opis (PL) |
|---|---|
| `get_portfolio_context` | Pełny obraz portfela użytkownika: pozycje, gotówka, watchlista i cele alokacji. |
| `get_portfolio_analytics` | Krzywa kapitału portfela dzień po dniu, ze stopą zwrotu, obsunięciem, zmiennością i porównaniem z WIG-iem lub S&P 500. |
| `get_total_portfolio_view` | Portfel zsumowany ze wszystkich rachunków maklerskich, przeliczony na jedną walutę. |
| `get_portfolio_value_history` | Historia wartości portfela w czasie. |
| `recommend_position_size` | Podpowiedź wielkości pozycji na podstawie relacji zysku do ryzyka, zmienności i koncentracji portfela. |
| `compare_portfolio_risk_reward` | Ranking pozycji i watchlisty według relacji zysku do ryzyka. |
| `analyze_thesis_exposure` | Rozkład portfela na ogniwa łańcucha wartości AI - gdzie masz ekspozycję, a gdzie dziurę. |
| `submit_portfolio_snapshot` | Wgranie stanu rachunku z zewnętrznego brokera. |
| `get_portfolio_stats` | Statystyki ryzyka i wyniku portfela liczone z historii transakcji. |
| `recommend_diversification` | Propozycje dywersyfikacji tam, gdzie portfel jest skupiony. |
| `suggest_order_size` | Wielkość zlecenia z uwzględnieniem dostępnej gotówki na konkretnym rachunku. |
| `get_concentration_risk` | Ile portfela stoi na jednej spółce, sektorze i rynku. |
| `modify_holdings` | Ręczna zmiana pozycji w portfelu. |
| `set_cash_balance` | Ustawienie salda gotówki na rachunku. |
| `modify_watchlist` | Dodanie lub usunięcie spółki z watchlisty. |

## Transactions and tax / Transakcje i podatki

Historia realizacji, zysk zrealizowany, jakość egzekucji wobec VWAP i wyszukiwanie strat do rozliczenia podatkowego.

| Tool | Opis (PL) |
|---|---|
| `submit_broker_transactions` | Wgranie historii transakcji do rozliczeń i podatków. |
| `get_realized_pnl` | Zrealizowany wynik od początku roku i okazje do rozliczenia strat podatkowych. |
| `get_transaction_history` | Historia transakcji użytkownika, od najnowszej. |
| `analyze_trade_outcome` | Rozliczenie pojedynczej transakcji: co wyszło, a co nie. |
| `find_tlh_opportunities` | Pozycje ze stratą, którą da się odliczyć od podatku w tym roku. |

## Signals, alerts and events / Sygnały, alerty i zdarzenia

Sygnały na spółkach z rozliczeniem trafności, alerty, zdarzenia wyceniane przez rynek i własne reguły decyzyjne.

| Tool | Opis (PL) |
|---|---|
| `get_alerts` | Alerty dostarczone temu użytkownikowi, z filtrami po spółce i klasyfikacji. |
| `list_webhook_events` | Zdarzenia z webhooka - do sprawdzenia, czy TradingView dochodzi do Agenta Rynku. |
| `get_asset_signals` | Szanse i ryzyka wykryte automatycznie dla spółki, każde z podpiętym dowodem w danych. |
| `get_signal_prediction_performance` | Celność liczbowych przewidywań ruchu ceny: trafienia, kierunek, średni błąd. |
| `submit_alert_feedback` | Ocena alertu - ten sam sygnał, co kciuki w Telegramie. |
| `get_alert_delivery_stats` | Statystyki dostarczania alertów: ile poszło, ile się nie udało. |
| `get_my_alert_performance` | Skuteczność alertów, które dostałeś: ile się sprawdziło. |
| `track_priced_event` | Zapisanie zdarzenia, którego wpływ na cenę chcesz rozliczyć później. |
| `get_priced_events` | Lista śledzonych zdarzeń wycenionych. |
| `historical_event_hit_rate` | Jak podobne zdarzenia wpływały na cenę w przeszłości. |
| `cancel_priced_event` | Odwołanie śledzonego zdarzenia. |
| `update_priced_event` | Zmiana szczegółów śledzonego zdarzenia. |
| `create_decision_rule` | Utworzenie reguły decyzyjnej, która ma pilnować warunku za Ciebie. |
| `list_decision_rules` | Lista Twoich reguł decyzyjnych. |
| `update_decision_rule` | Zmiana reguły decyzyjnej. |
| `delete_decision_rule` | Usunięcie reguły decyzyjnej. |
| `list_decision_rule_proposals` | Propozycje reguł decyzyjnych wynikające z Twojego zachowania. |
| `get_activity_feed` | Ostatnie zdarzenia na Twoim koncie. |
| `resolve_priced_event_now` | Natychmiastowe rozliczenie zdarzenia po bieżącej cenie. |

## Market risk / Ryzyko rynkowe

Reżim rynkowy, tematy ryzyka i zdarzenia mogące uderzyć w portfel.

| Tool | Opis (PL) |
|---|---|
| `get_risk_regime` | Reżim ryzyka na rynku: spokojny, podwyższony czy kryzysowy. |
| `get_risk_themes` | Motywy ryzyka aktywne w tej chwili. |
| `get_risk_dashboard` | Zbiorczy obraz ryzyka rynkowego: reżim i aktywne motywy razem. |
| `get_event_risks` | Kalendarz zdarzeń makro, które mogą poruszyć rynkiem. |

## Catalyst bonds / Obligacje Catalyst

Serie obligacji, arkusz zleceń i kalkulator wcześniejszego wykupu.

| Tool | Opis (PL) |
|---|---|
| `get_bond_series` | Wyszukiwanie serii obligacji z Catalyst po emitencie, marży i terminie wykupu. |
| `calculate_early_redemption` | Rachunek opłacalności wcześniejszego wykupu obligacji. |
| `get_bond_orderbook` | Arkusz zleceń dla obligacji - na razie niedostępny, zwraca informację o odroczeniu. |

## Account, brief and diagnostics / Konto, odprawa i diagnostyka

Dzienna odprawa rynkowa, rozmowa z asystentem, ustawienia agenta oraz stan potoku danych.

| Tool | Opis (PL) |
|---|---|
| `get_daily_brief` | Odprawa na dziś: co się zmieniło w Twoim portfelu i na watchliście. |
| `query_companion` | Zapytanie do asystenta Agenta Rynku w języku naturalnym. |
| `submit_feature_request` | Zgłoszenie błędu, pomysłu albo brakujących danych do zespołu Agenta Rynku. |
| `claim_feature_request` | Wzięcie zgłoszenia do pracy albo oddanie go do kolejki. |
| `modify_chat_settings` | Ustawienia powiadomień: próg istotności, kanały, wyciszone klasy alertów. |
| `get_pipeline_health` | Stan potoków danych: świeżość źródeł, opóźnienia, awarie. |
| `set_agent_prefs` | Ustawienia zachowania agenta. |
| `modify_profile` | Zmiana profilu inwestora. |
| `list_feature_requests` | Lista zgłoszeń i ich stan. |
| `get_codex_pipeline_stats` | Statystyki potoku ekstrakcji danych ze sprawozdań. |
| `get_outcome_settlement_health` | Stan rozliczania wyników alertów i prognoz. |

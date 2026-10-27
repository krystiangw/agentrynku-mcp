# Tools / Narzędzia

106 tools from the server registry on 2026-10-27. Short Polish summaries are shown below. Anonymous discovery returns only these public tools: `get_quarterly_kpis`, `search_gpw_companies`, `get_public_earnings_calendar`, `get_financial_ratios`, `get_public_dividends`, `get_public_price_history`. Additional tools require a key and are filtered by its scopes. Some descriptions and source reports are in Polish. The live catalogue is https://agentrynku.pl/docs/katalog; if this file and the live catalogue differ, the live catalogue is current.

## Notowania i rynek

| Tool | Access | Opis (PL) |
|---|---|---|
| `compare_symbols` | API key | Porównanie kilku spółek obok siebie. W PRO także opis P/E spółek GPW na tle własnej historii, bez prognozy kursu. |
| `get_cross_market_peers` | API key | Zagraniczne odpowiedniki są niedostępne w produkcie GPW-only. Narzędzie zwraca pustą listę i wyjaśnienie polityki rynku. |
| `get_dividends` | API key | Historia i znane przyszłe dywidendy spółki, z kwotą, datą, źródłem i świeżością. |
| `get_intraday_candles` | API key | Świece godzinowe z bieżącej i poprzednich sesji. |
| `get_intraday_quote` | API key | Kwotowanie w trakcie sesji: cena, otwarcie, zakres dnia, zmiana wobec zamknięcia. |
| `get_market_anomalies` | API key | Ruchy cen odstające od zwykłej zmienności spółki, wyłapane automatycznie. |
| `get_price_series` | API key | Świece OHLC i zmienność zrealizowana - do stop-lossów i wielkości pozycji. |
| `get_public_price_history` | Public | Dzienna historia cen GPW z bazy, do 500 świec, ze źródłem, datami, skalą cen i jawnym przycięciem. |
| `get_spot_price` | API key | Bieżąca cena jednej spółki, z informacją, czy pochodzi z zamknięcia, czy z kwotowania w trakcie sesji. |
| `search_gpw_companies` | Public | Wyszukiwanie spółek GPW po nazwie, tickerze, aliasie lub ISIN, bez konta i klucza. |
| `sector_pulse_pl` | API key | Puls sektorów GPW z datą sesji, pokryciem bieżącej lub ostatniej sesji i informacją o różnicy dat sektorów oraz indeksów. |
| `whats_moving_now` | API key | Co się dziś rusza na rynku - największe zmiany sesji. |

## Raporty i komunikaty spółek

| Tool | Access | Opis (PL) |
|---|---|---|
| `get_analysis_discounts` | API key | Narzędzie wycofane. Użyj get_forecast: opis P/E na tle własnej historii spółki dostępny w PRO, nie prognoza kursu. |
| `get_analyst_reports` | API key | Raporty analityczne PWPA o spółce z 90 dni: data, dom maklerski, źródło i odnośniki, bez rekomendacji i ceny docelowej. |
| `get_company_analysis` | API key | Podgląd analizy fundamentalnej spółki. Pełna treść jest dostępna w PRO. |
| `get_company_dossier` | API key | Źródłowa pamięć decyzyjna: trwałe przewagi, słabości, otwarte ryzyka, potwierdzone wzorce i kontekst biznesowy. |
| `get_conference_reminders` | API key | Konferencje wynikowe śledzonych spółek zapowiedziane w depeszach. |
| `get_conference_summary` | API key | Streszczenie konferencji wynikowej: cytaty zarządu, prognozy i sygnały ostrzegawcze. |
| `get_earnings_calendar` | API key | Kalendarz zbliżających się raportów okresowych. |
| `get_earnings_deepdive` | API key | Pogłębione omówienie raportu kwartalnego: co zaskoczyło, co niepokoi, co zapowiedział zarząd. |
| `get_espi_stream` | API key | Strumień komunikatów ESPI całego rynku albo obserwowanych spółek, z wyszukiwaniem i stronicowaniem. |
| `get_financial_ratios` | Public | Marże kwartalne i udział kapitału w aktywach, z formułą, okresem raportu i powodami braku wskaźnika. |
| `get_news_history` | API key | Historia depesz o spółce razem z ich oceną. |
| `get_public_dividends` | Public | Znane uchwały dywidendowe GPW z komunikatów WZA, z kwotą na akcję, walutą, terminami i źródłem. |
| `get_public_earnings_calendar` | Public | Publiczny kalendarz zapowiedzianych raportów GPW na najbliższe 90 dni, ze źródłem i datą pobrania. |
| `get_quarterly_kpis` | Public | Wyniki kwartalne spółki: przychód, zysk, bilans i przepływy, wraz z oceną jakości każdego wiersza. |
| `get_report_event` | API key | Jeden raport kwartalny jako zdarzenie: wyniki, rozliczenia, zmiany i otwarte tezy, z wiekiem i źródłem każdej liczby oraz nazwami i linkami oryginalnych załączników emitenta. |
| `get_wza_summary` | API key | Streszczenie walnego zgromadzenia akcjonariuszy. |

## Oceny i rankingi

| Tool | Access | Opis (PL) |
|---|---|---|
| `find_dip_candidates` | API key | Spadki kursu zestawione z wewnętrzną oceną, średnią z 200 sesji i zmiennością, bez potwierdzonej przewagi w wyborze momentu zakupu. |
| `find_opportunities` | API key | Narzędzie wycofane. Alternatywy: get_top_opportunities lub screen_stocks. |
| `find_overheat_candidates` | API key | Wzrosty kursu zestawione z wewnętrzną oceną, średnią z 200 sesji i zmiennością, bez potwierdzonej przewagi w wyborze momentu sprzedaży. |
| `get_ranking_performance` | API key | Jak ranking sprawdzał się w przeszłości. |
| `get_stock_rankings` | API key | Ranking spółek GPW według wybranego kryterium. |
| `get_sygnal_score` | API key | Ocena Agenta Rynku spółki z GPW: miejsce w rankingu ogólnym (jak na /rankings) albo powód, dla którego spółka jest poza rankingiem. Do tego wymiary z dowodami, w tym płynność pokazywana osobno. |
| `get_top_opportunities` | API key | Ta sama lista spółek spoza portfela co w kafelku Top okazje na pulpicie. |
| `rank_revenue_growth` | API key | Ranking wzrostu przychodów. |
| `rank_thematic` | API key | Ranking spółek w obrębie wybranego motywu inwestycyjnego. |
| `run_predictive_scan` | API key | Skan spółek pod kątem zbliżających się raportów i przewidywanego zaskoczenia. |
| `screen_stocks` | API key | Przesiew spółek GPW po kapitalizacji, dynamice EBITDA lub przychodów r/r, zakupach insiderów i wybiciu z maksimum na wolumenie; osobno brak danych i EBITDA nieadekwatna dla banków. |

## Prognozy wyników

| Tool | Access | Opis (PL) |
|---|---|---|
| `get_drivers` | API key | Bieżące czynniki makro: surowce, waluty, stopy, nastroje na rynku amerykańskim. |
| `get_evaluation_outcomes` | API key | Rozliczenie dawnych alertów po cenach: co się sprawdziło, a co nie, na tle indeksu. |
| `get_factor_context` | API key | Zmiana wybranego czynnika makro dla spółki z udokumentowanym źródłem i ekspozycją. |
| `get_forecast` | API key | Prognoza wyników spółki na najbliższe kwartały. W PRO także P/E na tle własnej historii spółki: opis wskaźnika, nie prognoza kursu. |
| `get_forecast_accuracy` | API key | Historyczna celność modeli prognostycznych i to, czy model przeszedł bramkę jakości. |
| `macro_attribution` | API key | Co najprawdopodobniej stało za ostatnim ruchem WIG20. |

## Portfel i alokacja

| Tool | Access | Opis (PL) |
|---|---|---|
| `analyze_thesis_exposure` | API key | Rozkład portfela na ogniwa łańcucha wartości AI - gdzie masz ekspozycję, a gdzie dziurę. |
| `compare_portfolio_risk_reward` | API key | Narzędzie wycofane. Użyj get_forecast: opis P/E na tle własnej historii spółki dostępny w PRO, nie prognoza kursu. |
| `confirm_thesis_review` | API key | Potwierdzenie tezy po raporcie bez zmian, jak „Tak, bez zmian” w aplikacji. |
| `get_concentration_risk` | API key | Ile portfela stoi na jednej spółce, sektorze i rynku. |
| `get_my_theses` | API key | Twoje tezy ze spółek z portfela i obserwowanych: stan, warunki, oś czasu i prośba o przegląd po raporcie. |
| `get_portfolio_analytics` | API key | Krzywa kapitału portfela dzień po dniu, ze stopą zwrotu, obsunięciem, zmiennością i porównaniem z WIG-iem lub S&P 500. |
| `get_portfolio_context` | API key | Obraz portfela użytkownika: pozycje, gotówka, watchlista z oceną analityka i powodem obserwacji, cele alokacji. Analiza i wycena wymagają PRO. |
| `get_portfolio_stats` | API key | Statystyki ryzyka i wyniku portfela liczone z historii transakcji. |
| `get_portfolio_value_history` | API key | Historia wartości portfela w czasie. |
| `get_total_portfolio_view` | API key | Portfel zsumowany ze wszystkich rachunków maklerskich, przeliczony na jedną walutę. |
| `modify_holdings` | API key | Ręczna zmiana pozycji w portfelu. |
| `modify_watchlist` | API key | Dodanie lub usunięcie spółki z watchlisty. |
| `recommend_diversification` | API key | Wagi sektorów portfela i sektory poniżej progu udziału. Dobór kandydatów wycofany. |
| `recommend_position_size` | API key | Kalkulator wielkości pozycji z budżetu ryzyka, gotówki, zmienności i limitu koncentracji. Bez prognozy zwrotu. |
| `set_cash_balance` | API key | Ustawienie salda gotówki na rachunku. |
| `set_thesis` | API key | Zapis albo usunięcie Twojej tezy spółki: rodzaj, zdanie i warunki, na tych samych zasadach co edytor w aplikacji. |
| `submit_portfolio_snapshot` | API key | Wgranie stanu rachunku z zewnętrznego brokera. |
| `suggest_order_size` | API key | Wielkość zlecenia z uwzględnieniem dostępnej gotówki na konkretnym rachunku. |

## Transakcje i podatki

| Tool | Access | Opis (PL) |
|---|---|---|
| `analyze_trade_outcome` | API key | Rozliczenie pojedynczej transakcji: co wyszło, a co nie. |
| `find_tlh_opportunities` | API key | Pozycje ze stratą, którą da się odliczyć od podatku w tym roku. |
| `get_realized_pnl` | API key | Zrealizowany wynik od początku roku i okazje do rozliczenia strat podatkowych. |
| `get_transaction_history` | API key | Historia transakcji użytkownika, od najnowszej. |
| `submit_broker_transactions` | API key | Wgranie historii transakcji do rozliczeń i podatków. |

## Sygnały, alerty i zdarzenia

| Tool | Access | Opis (PL) |
|---|---|---|
| `cancel_priced_event` | API key | Odwołanie śledzonego zdarzenia. |
| `create_decision_rule` | API key | Utworzenie reguły decyzyjnej, która ma pilnować warunku za Ciebie. |
| `delete_decision_rule` | API key | Usunięcie reguły decyzyjnej. |
| `get_activity_feed` | API key | Ostatnie zdarzenia na Twoim koncie. |
| `get_alert_delivery_stats` | API key | Statystyki dostarczania alertów: ile poszło, ile się nie udało. |
| `get_alerts` | API key | Alerty dostarczone temu użytkownikowi: depesze, tezy, reguły i alarmy cen, z filtrami po spółce, rodzaju, klasyfikacji i rynku. |
| `get_asset_signals` | API key | Szanse i ryzyka wykryte automatycznie dla spółki, każde z podpiętym dowodem w danych. |
| `get_dividend_settlement_history` | API key | Rozliczenie własnej śledzonej dywidendy: bieżąca wersja i wcześniejsze korekty. |
| `get_my_alert_performance` | API key | Skuteczność alertów, które dostałeś: ile się sprawdziło. |
| `get_priced_events` | API key | Lista śledzonych zdarzeń wycenionych. |
| `get_signal_prediction_performance` | API key | Celność liczbowych przewidywań ruchu ceny: trafienia, kierunek, średni błąd. |
| `historical_event_hit_rate` | API key | Jak podobne zdarzenia wpływały na cenę w przeszłości. |
| `list_decision_rule_proposals` | API key | Propozycje reguł decyzyjnych wynikające z Twojego zachowania. |
| `list_decision_rules` | API key | Lista Twoich reguł decyzyjnych. |
| `list_webhook_events` | API key | Zdarzenia z webhooka - do sprawdzenia, czy TradingView dochodzi do Agenta Rynku. |
| `resolve_priced_event_now` | API key | Natychmiastowe rozliczenie zdarzenia po bieżącej cenie. |
| `submit_alert_feedback` | API key | Ocena alertu - ten sam sygnał, co kciuki w Telegramie. |
| `track_priced_event` | API key | Zapisanie zdarzenia, którego wpływ na cenę chcesz rozliczyć później. |
| `update_decision_rule` | API key | Zmiana reguły decyzyjnej. |
| `update_priced_event` | API key | Zmiana szczegółów śledzonego zdarzenia. |

## Ryzyko rynkowe

| Tool | Access | Opis (PL) |
|---|---|---|
| `get_event_risks` | API key | Kalendarz zdarzeń makro, które mogą poruszyć rynkiem. |
| `get_risk_dashboard` | API key | Zbiorczy obraz ryzyka rynkowego: jego poziom i aktywne motywy razem. |
| `get_risk_regime` | API key | Ryzyko rynkowe: aktualna ocena pasma albo jawny brak używalnych danych. |
| `get_risk_themes` | API key | Motywy ryzyka aktywne w tej chwili. |

## Obligacje Catalyst

| Tool | Access | Opis (PL) |
|---|---|---|
| `calculate_early_redemption` | API key | Rachunek opłacalności wcześniejszego wykupu obligacji. |
| `get_bond_orderbook` | API key | Arkusz zleceń dla obligacji - na razie niedostępny, zwraca informację o odroczeniu. |
| `get_bond_series` | API key | Wyszukiwanie serii obligacji z Catalyst po emitencie, marży i terminie wykupu. |

## Konto, odprawa i diagnostyka

| Tool | Access | Opis (PL) |
|---|---|---|
| `claim_feature_request` | API key | Wzięcie zgłoszenia do pracy albo oddanie go do kolejki. |
| `get_codex_pipeline_stats` | API key | Statystyki potoku ekstrakcji danych ze sprawozdań. |
| `get_daily_brief` | API key | Odprawa na dziś: co się zmieniło w Twoim portfelu i na watchliście. |
| `get_outcome_settlement_health` | API key | Stan rozliczania wyników alertów i prognoz. |
| `get_pipeline_health` | API key | Stan potoków danych: świeżość źródeł, opóźnienia, awarie. |
| `list_feature_requests` | API key | Lista zgłoszeń i ich stan. |
| `modify_chat_settings` | API key | Ustawienia powiadomień: próg istotności, kanały, wyciszone klasy alertów. |
| `modify_profile` | API key | Zmiana profilu inwestora. |
| `query_companion` | API key | Zapytanie do asystenta Agenta Rynku w języku naturalnym. |
| `set_agent_prefs` | API key | Ustawienia zachowania agenta. |
| `submit_feature_request` | API key | Zgłoszenie błędu, pomysłu albo brakujących danych do zespołu Agenta Rynku. |


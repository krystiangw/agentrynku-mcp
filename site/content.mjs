export const SITE = 'https://docs.agentrynku.pl';
export const MAIN = 'https://agentrynku.pl';
export const ENDPOINT = 'https://agentrynku.pl/api/mcp';

export const tools = [
  {
    name: 'search_gpw_companies',
    slug: 'wyszukiwarka-spolek-gpw',
    nav: 'Wyszukiwarka spółek',
    title: 'Wyszukiwarka spółek GPW dla agenta AI: ticker, nazwa, ISIN',
    description:
      'Znajdź spółkę z GPW po nazwie, tickerze, aliasie albo ISIN przez serwer MCP Agenta Rynku. Bez konta i klucza API, do 20 wyników z kanonicznym symbolem.',
    h1: 'Wyszukiwarka spółek GPW',
    lead:
      'Pierwszy krok prawie każdej rozmowy z agentem o polskiej giełdzie. Zamienia „Orlen”, „PKN”, „KGH” albo numer ISIN na kanoniczny symbol, którego używają pozostałe narzędzia.',
    when: [
      'Użytkownik podaje potoczną nazwę spółki, a agent potrzebuje symbolu do kolejnego wywołania.',
      'Trzeba odróżnić dwie spółki o podobnych nazwach albo sprawdzić ISIN.',
      'Agent potrzebuje adresu karty spółki na agentrynku.pl, żeby podlinkować źródło.',
    ],
    caveats: [
      'Szuka tylko aktywnych spółek z GPW. Nie przeszukuje innych rynków.',
      'Wynik ma limit 20 pozycji. Pole <code>truncated</code> mówi wprost, że lista została ucięta.',
    ],
    prompts: ['Znajdź KGHM i podaj jego ISIN.', 'Jaki ticker ma Dino Polska na GPW?'],
  },
  {
    name: 'get_quarterly_kpis',
    slug: 'wyniki-kwartalne-gpw',
    nav: 'Wyniki kwartalne',
    title: 'Wyniki kwartalne spółek GPW przez MCP: przychody, zysk, przepływy',
    description:
      'Kwartalne wyniki finansowe spółek z GPW dla agenta AI: przychody, EBITDA, zysk netto, EPS, bilans i przepływy, ze źródłem raportu i oceną jakości każdego wiersza.',
    h1: 'Wyniki kwartalne spółek GPW',
    lead:
      'Przychody, EBITDA, zysk netto, EPS, aktywa, kapitał i przepływy z raportów okresowych emitentów, do 20 ostatnich kwartałów. Każda liczba ma okres, walutę, zakres raportu i link do źródła.',
    when: [
      'Agent ma porównać wyniki spółki kwartał do kwartału albo rok do roku.',
      'Potrzebujesz liczby razem z linkiem do komunikatu GPW lub raportu, z którego pochodzi.',
      'Budujesz własne wskaźniki i chcesz wiedzieć, które pola są puste, a które wstrzymane przez kontrolę jakości.',
    ],
    caveats: [
      'Kwoty w polach <code>…PLN</code> są w <strong>milionach</strong> waluty raportu. <code>revenuePLN: 12839</code> to 12,8 mld zł. EPS jest na akcję.',
      'Brak liczby (<code>null</code>) nie oznacza zera. Powód bywa w polach <code>withheld</code> i <code>dataQuality</code>.',
      'Pole <code>reportScope</code> mówi, czy wiersz pochodzi z raportu skonsolidowanego, czy jednostkowego. Nie porównuj ich ze sobą.',
      'Dane pochodzą wyłącznie z raportów emitentów i komunikatów GPW, bez baz portali finansowych.',
    ],
    prompts: [
      'Pokaż ostatni raport kwartalny KGHM ze źródłem.',
      'Jak zmieniały się przychody Allegro w ostatnich 8 kwartałach?',
    ],
  },
  {
    name: 'get_financial_ratios',
    slug: 'wskazniki-finansowe-gpw',
    nav: 'Wskaźniki i marże',
    title: 'Marże i wskaźniki finansowe spółek GPW przez MCP',
    description:
      'Marża EBITDA, operacyjna i netto oraz udział kapitału w aktywach dla spółek z GPW, liczone z raportów kwartalnych, z formułą i powodem, gdy wskaźnika nie da się policzyć.',
    h1: 'Marże i wskaźniki finansowe GPW',
    lead:
      'Wskaźniki policzone z tych samych raportów co wyniki kwartalne: marża EBITDA, operacyjna, netto (także bez zdarzeń jednorazowych) i kapitał własny do aktywów. Odpowiedź zawiera formułę każdego wskaźnika.',
    when: [
      'Agent ma porównać rentowność kilku spółek albo jej trend w czasie.',
      'Chcesz, żeby model nie liczył marż sam i nie mylił jednostek.',
    ],
    caveats: [
      'To wskaźniki z pojedynczego kwartału, a nie TTM. Nie ma tu mnożników cenowych (P/E, EV/EBITDA).',
      'Gdy wskaźnika nie da się policzyć, pole <code>unavailable</code> podaje powód, na przykład brak danych wejściowych albo ujemny mianownik.',
    ],
    prompts: ['Policz marżę netto KGHM z dwóch ostatnich kwartałów.', 'Która z tych spółek ma wyższą marżę EBITDA: Orlen czy PGE?'],
  },
  {
    name: 'get_public_earnings_calendar',
    slug: 'kalendarz-raportow-gpw',
    nav: 'Kalendarz raportów',
    title: 'Kalendarz publikacji raportów okresowych GPW dla agenta AI',
    description:
      'Zapowiedziane terminy raportów kwartalnych, półrocznych i rocznych spółek z GPW na najbliższe 90 dni, ze źródłem i datą pobrania. Publiczne narzędzie MCP bez klucza.',
    h1: 'Kalendarz raportów GPW',
    lead:
      'Znane terminy publikacji raportów okresowych spółek z GPW na 1 do 90 dni naprzód, licząc od dzisiaj w strefie czasu Warszawy. Terminy, po których wyniki już opublikowano, są usuwane.',
    when: [
      'Agent ma przygotować listę spółek, które raportują w tym tygodniu.',
      'Chcesz przypomnieć użytkownikowi o wynikach przed sesją.',
    ],
    caveats: [
      'Kalendarz zawiera tylko znane terminy. Pusty wynik nie znaczy, że nikt nie raportuje.',
      'Do 100 zdarzeń na zapytanie. Osobisty kalendarz dla watchlisty wymaga klucza (<code>get_earnings_calendar</code>).',
    ],
    prompts: ['Jakie spółki z GPW publikują raporty w ciągu 30 dni?', 'Kto raportuje w przyszłym tygodniu?'],
  },
  {
    name: 'get_public_price_history',
    slug: 'historia-cen-gpw',
    nav: 'Historia cen',
    title: 'Historia notowań akcji GPW (OHLCV) przez MCP, bez klucza API',
    description:
      'Dzienne notowania akcji z GPW: otwarcie, maksimum, minimum, zamknięcie i wolumen, do 500 świec i 10 lat wstecz. Ze źródłem, skalą cen i jawnym przycięciem. Bez konta.',
    h1: 'Historia cen akcji GPW',
    lead:
      'Zapisane dzienne świece OHLCV dla akcji z GPW, do 500 świec w oknie od 1 do 3650 dni. Odpowiedź podaje źródło, czas aktualizacji serii, faktyczne daty pierwszej i ostatniej świecy oraz skalę cen.',
    when: [
      'Agent ma policzyć stopę zwrotu, zmienność albo narysować wykres.',
      'Potrzebujesz kursu z konkretnego dnia razem z informacją, czy cena jest skorygowana.',
    ],
    caveats: [
      'Tylko akcje. Indeksy, ETF-y i obligacje nie są objęte.',
      'To historia z bazy, a nie bieżący kurs. Notowania w trakcie sesji wymagają klucza (<code>get_intraday_quote</code>).',
      'Historia skorygowana (<code>priceScale: adjusted</code>) może się zmienić po splicie albo dywidendzie.',
      'Gdy dane zaczynają się później niż żądane okno, odpowiedź to mówi. Nie dostaniesz dopełnionych świec.',
    ],
    prompts: ['Pokaż notowania KGHM z ostatniego tygodnia.', 'Ile zyskał CD Projekt przez ostatni rok?'],
  },
  {
    name: 'get_public_dividends',
    slug: 'dywidendy-gpw',
    nav: 'Dywidendy',
    title: 'Dywidendy spółek GPW z uchwał WZA dla agenta AI',
    description:
      'Uchwały dywidendowe spółek z GPW z komunikatów walnych zgromadzeń: kwota na akcję, waluta, dzień ustalenia prawa, dzień wypłaty i link do komunikatu. Bez klucza API.',
    h1: 'Dywidendy spółek GPW',
    lead:
      'Znane uchwały dywidendowe z komunikatów walnych zgromadzeń: kwota na akcję, waluta, status, dzień ustalenia prawa i wypłaty, a także link do komunikatu. Zachowujemy także odwołane uchwały.',
    when: [
      'Agent ma sprawdzić, ile spółka wypłaci na akcję i kiedy.',
      'Potrzebujesz źródła uchwały, a nie szacunku z portalu.',
    ],
    caveats: [
      'Źródłem są tylko komunikaty WZA. Pusty wynik nie znaczy, że spółka nie płaci dywidendy.',
      'Brak historii od dostawców danych i brak prognoz dywidend. Pełna historia wymaga klucza (<code>get_dividends</code>).',
    ],
    prompts: ['Pokaż znane uchwały dywidendowe Agory.', 'Kiedy PZU wypłaca dywidendę?'],
  },
];

export const pages = {
  home: {
    title: 'Agent Rynku MCP: dane z GPW dla agentów AI (dokumentacja)',
    description:
      'Dokumentacja serwera MCP Agenta Rynku: wyniki kwartalne, wskaźniki, kalendarz raportów, dywidendy i historia cen spółek z GPW dla Claude, Cursora i innych klientów MCP. Bez konta.',
  },
  connect: {
    slug: 'podlaczenie',
    nav: 'Podłączenie',
    title: 'Jak podłączyć dane z GPW do Claude, Cursora i innych klientów MCP',
    description:
      'Konfiguracja serwera MCP Agenta Rynku w Claude Code, Claude Desktop, Cursorze i dowolnym kliencie HTTP. Dane publiczne działają bez klucza API.',
  },
  catalog: {
    slug: 'katalog',
    nav: 'Katalog 99 narzędzi',
    title: 'Katalog narzędzi MCP Agenta Rynku: notowania, raporty, portfel',
    description:
      'Pełna lista narzędzi serwera MCP Agenta Rynku z opisem: notowania GPW, raporty spółek, prognozy, portfel, alerty, obligacje Catalyst. Które są publiczne, a które wymagają klucza.',
  },
  en: {
    slug: 'en',
    title: 'Agent Rynku MCP: Warsaw Stock Exchange (GPW) data for AI agents',
    description:
      'Hosted MCP server with Warsaw Stock Exchange data: quarterly financials, ratios, earnings calendar, dividends and daily prices for GPW companies. No account or API key needed.',
  },
};

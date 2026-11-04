# Firefox Add-ons (AMO) listing

Everything needed to fill in the form at https://addons.mozilla.org/developers/addon/submit/

## Basic info

- **Name:** Tracker Radar
- **Add-on URL (slug):** tracker-radar
- **Categories:** Privacy & Security
- **Tags:** privacy, tracker, tracking, ad blocker, analytics, security
- **License:** MIT
- **Homepage:** https://github.com/Vapson12/tracker-radar
- **Support site:** https://github.com/Vapson12/tracker-radar/issues
- **Screenshots:** `store/1-radar.png`, `store/2-block.png`, `store/3-stats.png` (1280×800)

## Summary — English (max 250 characters)

See, live, which companies the website you're on is sending your data to. A radar of ad networks, analytics and session recorders, a privacy grade for every page, one-click blocking and weekly stats. 100% local.

## Description — English

Every website you open quietly talks to dozens of other companies: ad networks, analytics tools, data brokers and even session recorders that capture your mouse movements. **Tracker Radar makes them visible.**

**What it does**
- 📡 **Live radar** of every tracking company on the current page, coloured by what it does: advertising, analytics, session recording or social.
- 🅰️ **Privacy grade A–F** for each website.
- 🛡️ **One-click blocking**: hit the shield next to a company to block its trackers on every website.
- 📊 **Statistics**: how many companies followed you in the last 7 or 30 days, who follows you the most and which websites are the worst.
- 📚 290+ known tracker domains from 160+ companies, including European and Polish ad tech.
- 🌍 English, Polish, German, Spanish, French and Ukrainian.

**Privacy first**
Tracker Radar has no servers and no analytics. Everything is analysed inside your browser and history is deleted automatically after 30 days. The code is open source: https://github.com/Vapson12/tracker-radar

**Why it needs these permissions**
- *Access your data for all websites / webRequest*: to see which third-party domains a page contacts. Request contents are never read or stored.
- *Block content on any page (declarativeNetRequest)*: only for the companies you choose to block.
- *Storage*: to keep your block list and local statistics.

## Summary — Polski (max 250 znaków)

Zobacz na żywo, do jakich firm strona wysyła Twoje dane. Radar sieci reklamowych, analityki i nagrywania sesji, ocena prywatności A–F, blokowanie jednym kliknięciem i statystyki. Wszystko lokalnie.

## Description — Polski

Każda strona, którą otwierasz, po cichu łączy się z dziesiątkami innych firm: sieciami reklamowymi, narzędziami analitycznymi, brokerami danych, a nawet usługami, które nagrywają ruchy Twojej myszki. **Tracker Radar pokazuje je wszystkie.**

**Co potrafi**
- 📡 **Radar na żywo** z każdą firmą śledzącą na stronie, w kolorze zależnym od tego, co robi: reklamy, analityka, nagrywanie sesji albo serwisy społecznościowe.
- 🅰️ **Ocena prywatności A–F** dla każdej strony.
- 🛡️ **Blokowanie jednym kliknięciem**: tarcza obok firmy blokuje jej trackery na wszystkich stronach.
- 📊 **Statystyki**: ile firm śledziło Cię w ostatnich 7 lub 30 dniach, kto robi to najczęściej i które strony są najgorsze.
- 📚 Ponad 290 domen trackerów od ponad 160 firm, w tym polskich (Gemius, AdOcean, RTB House, WP, SALESmanago).
- 🌍 Polski, angielski, niemiecki, hiszpański, francuski i ukraiński.

**Prywatność przede wszystkim**
Tracker Radar nie ma żadnych serwerów ani analityki. Wszystko jest analizowane w Twojej przeglądarce, a historia sama się usuwa po 30 dniach. Kod jest otwarty: https://github.com/Vapson12/tracker-radar

## Privacy policy

Not required: the add-on declares `data_collection_permissions: none` and sends no data anywhere. If the form asks anyway, use:

> Tracker Radar does not collect, transmit or sell any data. All analysis happens locally in the browser. The block list and up to 30 days of statistics are stored only in the browser's local extension storage and can be deleted at any time with "Clear history".

## Notes for reviewers

The add-on is plain, unminified JavaScript with no third-party libraries and no remote code. `dist/tracker-radar-firefox.zip` is produced by `python3 build.py`, which only copies the source files and writes a Firefox-specific `manifest.json` (background `scripts` instead of `service_worker`).

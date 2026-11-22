# Changelog

## 0.4.0 (2026-11-22)

- **Fingerprinting detection.** Tracker Radar now notices when a page reads canvas, WebGL (graphics card), audio or font details to recognise you without cookies, shows which script did it and lowers the page's privacy grade. Fingerprinting sites are marked 🧬 on the statistics page and included in the export.
- **Fingerprint protection** (optional, off by default): adds tiny noise to canvas and audio readings and hides the graphics card name. The noise is stable on one site and different on every other site, so trackers can't link your visits.
- **Hide IP from WebRTC** (optional, off by default, for VPN users): stops websites from discovering your real IP address through WebRTC. Asks for the "privacy" permission only when you turn it on.
- **New category: cryptomining.** 30 known in-browser miners (Coinhive, CryptoLoot, CoinImp, WebMinePool…). A new "Cryptominers" quick-protection profile is **on by default**, and the popup shows a warning when a site tries to mine.
- Interface translated into **51 languages** (was 6): added Czech, Slovak, Italian, Dutch, Portuguese (Brazil and Portugal), Russian, Bulgarian, Serbian, Croatian, Slovenian, Hungarian, Romanian, Greek, Turkish, Danish, Swedish, Norwegian, Finnish, Estonian, Latvian, Lithuanian, Catalan, Arabic, Hebrew, Persian, Hindi, Bengali, Tamil, Telugu, Malayalam, Marathi, Gujarati, Kannada, Japanese, Korean, Chinese (Simplified and Traditional), Thai, Vietnamese, Indonesian, Malay, Filipino, Swahili and Amharic. Right-to-left layout for Arabic, Hebrew and Persian.
- Tracker database: **1229 domains from 586 companies**, including 57 cryptominer domains and more Polish ad tech (Netsprint, Adkontekst, Clickonometrics, OPTAD360, Yieldbird, stat4u). New: error monitoring (Sentry, Rollbar, Raygun, TrackJS, Honeybadger, Airbrake, Crashlytics), e-mail open/click tracking (Mailchimp, Brevo, MailerLite, ActiveCampaign, HubSpot, Mailgun, AWeber…), affiliate networks (CJ, Impact, Admitad, Awin, ShareASale), A/B testing (VWO, Kameleoon), FingerprintJS, mobile ad networks (ironSource, Chartboost, Fyber, Pangle), smart-TV ads (LG, Roku), FreeWheel and Innovid video ads, Windows and Apple telemetry, video ads (Dailymotion, Connatix, SpotX) and more Amazon, Yandex and LinkedIn endpoints.
- Not blocked on purpose, because blocking them breaks websites: cookie-consent managers, feature-flag services, video players, social login/share widgets, newsletter sign-up forms.
- With all four profiles on, Tracker Radar's own rules block 87% of the 487 hosts in the adblock.turtlecute.org test (was 56%).

### Earlier in this cycle (0.3.1, not released separately)

- Tracker database grown to **358 domains from 178 companies** (+68 domains): ad and pixel endpoints of social networks (Facebook, Pinterest, Reddit, TikTok, X), Yahoo and Yandex ad/analytics, error monitoring (Bugsnag, Sentry), Freshworks session recording and device-maker telemetry (Xiaomi, Huawei, Samsung, Apple, OPPO, Realme, OnePlus).
- With the three quick-protection profiles on, Tracker Radar now blocks 126 of the 127 hosts checked by the adblock.turtlecute.org test (the only one left is the Yandex Maps API, kept on purpose so embedded maps keep working).

## 0.3.0

- **Quick protection**: block all advertising, all analytics or all session recorders with one click. Works per tracker domain, so blocking "all ads" doesn't break YouTube embeds.
- **Pause blocking on a site**: one button in the popup if a page stops working. Paused sites are listed on the statistics page.
- **Session recording alert**: a red warning in the popup when a site uses tools that record mouse movements, clicks and typing (Hotjar, Microsoft Clarity, FullStory…).
- **Export statistics** as CSV or JSON.
- Translations for all new features (EN, PL, DE, ES, FR, UK).

## 0.2.0

First public release: live tracker radar, privacy grade A–F, per-company blocking, 7/30-day statistics, 290+ tracker domains, 6 languages.

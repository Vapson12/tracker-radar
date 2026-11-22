# Changelog

## 0.3.1

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

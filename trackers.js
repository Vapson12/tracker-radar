// Known tracker domains → [company, category].
// Matching is by domain suffix, longest match wins (e.g. "bat.bing.com" before "bing.com").
// Contributions welcome: keep entries sorted by company.

export const CATEGORIES = {
  ads: { label: 'Advertising', color: '#ff5c7a' },
  analytics: { label: 'Analytics', color: '#4cc9f0' },
  recording: { label: 'Session recording', color: '#f7b801' },
  social: { label: 'Social', color: '#9b5de5' },
};

export const TRACKERS = {
  // Adobe
  'demdex.net': ['Adobe', 'ads'],
  'everesttech.net': ['Adobe', 'ads'],
  'omtrdc.net': ['Adobe', 'analytics'],
  // Amazon
  'amazon-adsystem.com': ['Amazon', 'ads'],
  // Amplitude
  'amplitude.com': ['Amplitude', 'analytics'],
  // Bidswitch
  'bidswitch.net': ['Bidswitch', 'ads'],
  // Cloudflare
  'cloudflareinsights.com': ['Cloudflare', 'analytics'],
  // comScore
  'scorecardresearch.com': ['comScore', 'analytics'],
  // Criteo
  'criteo.com': ['Criteo', 'ads'],
  'criteo.net': ['Criteo', 'ads'],
  // FullStory
  'fullstory.com': ['FullStory', 'recording'],
  // Gemius
  'gemius.pl': ['Gemius', 'analytics'],
  // Google
  'google-analytics.com': ['Google', 'analytics'],
  'analytics.google.com': ['Google', 'analytics'],
  'googletagmanager.com': ['Google', 'analytics'],
  'googleoptimize.com': ['Google', 'analytics'],
  'doubleclick.net': ['Google', 'ads'],
  'googlesyndication.com': ['Google', 'ads'],
  'googleadservices.com': ['Google', 'ads'],
  'adservice.google.com': ['Google', 'ads'],
  '2mdn.net': ['Google', 'ads'],
  'youtube.com': ['Google', 'social'],
  'youtube-nocookie.com': ['Google', 'social'],
  // Heap
  'heapanalytics.com': ['Heap', 'analytics'],
  // Hotjar
  'hotjar.com': ['Hotjar', 'recording'],
  'hotjar.io': ['Hotjar', 'recording'],
  // HubSpot
  'hs-analytics.net': ['HubSpot', 'analytics'],
  'hs-scripts.com': ['HubSpot', 'analytics'],
  'hubspot.com': ['HubSpot', 'analytics'],
  // ID5
  'id5-sync.com': ['ID5', 'ads'],
  // Index Exchange
  'casalemedia.com': ['Index Exchange', 'ads'],
  // LinkedIn / Microsoft
  'linkedin.com': ['Microsoft (LinkedIn)', 'social'],
  'licdn.com': ['Microsoft (LinkedIn)', 'social'],
  'ads.linkedin.com': ['Microsoft (LinkedIn)', 'ads'],
  'bat.bing.com': ['Microsoft', 'ads'],
  'clarity.ms': ['Microsoft', 'recording'],
  // LiveRamp
  'rlcdn.com': ['LiveRamp', 'ads'],
  // LogRocket
  'logrocket.com': ['LogRocket', 'recording'],
  'lr-ingest.com': ['LogRocket', 'recording'],
  // Lotame
  'crwdcntrl.net': ['Lotame', 'ads'],
  // Magnite
  'rubiconproject.com': ['Magnite', 'ads'],
  // Matomo
  'matomo.cloud': ['Matomo', 'analytics'],
  // Media.net
  'media.net': ['Media.net', 'ads'],
  // Meta
  'facebook.net': ['Meta', 'ads'],
  'facebook.com': ['Meta', 'social'],
  'fbcdn.net': ['Meta', 'social'],
  'instagram.com': ['Meta', 'social'],
  // Mixpanel
  'mixpanel.com': ['Mixpanel', 'analytics'],
  // Mouseflow
  'mouseflow.com': ['Mouseflow', 'recording'],
  // New Relic
  'nr-data.net': ['New Relic', 'analytics'],
  // OpenX
  'openx.net': ['OpenX', 'ads'],
  // Optimizely
  'optimizely.com': ['Optimizely', 'analytics'],
  // Oracle
  'bluekai.com': ['Oracle', 'ads'],
  'addthis.com': ['Oracle', 'ads'],
  // Outbrain
  'outbrain.com': ['Outbrain', 'ads'],
  // Pinterest
  'pinterest.com': ['Pinterest', 'social'],
  'ct.pinterest.com': ['Pinterest', 'ads'],
  // PubMatic
  'pubmatic.com': ['PubMatic', 'ads'],
  // Quantcast
  'quantserve.com': ['Quantcast', 'ads'],
  'quantcount.com': ['Quantcast', 'ads'],
  // Reddit
  'alb.reddit.com': ['Reddit', 'ads'],
  // RTB House
  'creativecdn.com': ['RTB House', 'ads'],
  // Segment
  'segment.com': ['Segment', 'analytics'],
  'segment.io': ['Segment', 'analytics'],
  // Smart AdServer
  'smartadserver.com': ['Equativ', 'ads'],
  // Smartlook
  'smartlook.com': ['Smartlook', 'recording'],
  // Snap
  'sc-static.net': ['Snap', 'ads'],
  'snapchat.com': ['Snap', 'ads'],
  // Taboola
  'taboola.com': ['Taboola', 'ads'],
  // Teads
  'teads.tv': ['Teads', 'ads'],
  // The Trade Desk
  'adsrvr.org': ['The Trade Desk', 'ads'],
  // TikTok
  'tiktok.com': ['TikTok', 'social'],
  'analytics.tiktok.com': ['TikTok', 'ads'],
  // VWO
  'visualwebsiteoptimizer.com': ['VWO', 'analytics'],
  // X (Twitter)
  'ads-twitter.com': ['X (Twitter)', 'ads'],
  'twitter.com': ['X (Twitter)', 'social'],
  'x.com': ['X (Twitter)', 'social'],
  't.co': ['X (Twitter)', 'social'],
  // Xandr
  'adnxs.com': ['Xandr (Microsoft)', 'ads'],
  // Yahoo
  'analytics.yahoo.com': ['Yahoo', 'ads'],
  'ads.yahoo.com': ['Yahoo', 'ads'],
  // Yandex
  'mc.yandex.ru': ['Yandex', 'analytics'],
  'mc.yandex.com': ['Yandex', 'analytics'],
};

// Extended list: ad tech, data brokers, analytics, session recorders,
// affiliate networks and social widgets.
Object.assign(TRACKERS, {
  // Ad exchanges, DSPs and SSPs
  '33across.com': ['33Across', 'ads'],
  '360yield.com': ['Improve Digital', 'ads'],
  'improvedigital.com': ['Improve Digital', 'ads'],
  '3lift.com': ['TripleLift', 'ads'],
  'triplelift.com': ['TripleLift', 'ads'],
  'adcolony.com': ['AdColony', 'ads'],
  'adform.net': ['Adform', 'ads'],
  'adformdsp.net': ['Adform', 'ads'],
  'seadform.net': ['Adform', 'ads'],
  'adhese.com': ['Adhese', 'ads'],
  'adition.com': ['Adition', 'ads'],
  'adkernel.com': ['AdKernel', 'ads'],
  'adnxs-simple.com': ['Xandr (Microsoft)', 'ads'],
  'adroll.com': ['AdRoll', 'ads'],
  'adsafeprotected.com': ['Integral Ad Science', 'ads'],
  'adscale.de': ['Ströer', 'ads'],
  'adsterra.com': ['Adsterra', 'ads'],
  'advertising.com': ['Yahoo', 'ads'],
  'agkn.com': ['Neustar', 'ads'],
  'applovin.com': ['AppLovin', 'ads'],
  'atdmt.com': ['Microsoft', 'ads'],
  'contextweb.com': ['PulsePoint', 'ads'],
  'doubleverify.com': ['DoubleVerify', 'ads'],
  'emxdgt.com': ['EMX', 'ads'],
  'exoclick.com': ['ExoClick', 'ads'],
  'eyeota.net': ['Eyeota', 'ads'],
  'freewheel.tv': ['Comcast (FreeWheel)', 'ads'],
  'stickyadstv.com': ['Comcast (FreeWheel)', 'ads'],
  'gumgum.com': ['GumGum', 'ads'],
  'inmobi.com': ['InMobi', 'ads'],
  'juicyads.com': ['JuicyAds', 'ads'],
  'liftoff.io': ['Liftoff', 'ads'],
  'vungle.com': ['Liftoff', 'ads'],
  'lijit.com': ['Sovrn', 'ads'],
  'sovrn.com': ['Sovrn', 'ads'],
  'viglink.com': ['Sovrn', 'ads'],
  'mathtag.com': ['MediaMath', 'ads'],
  'mediamath.com': ['MediaMath', 'ads'],
  'mgid.com': ['MGID', 'ads'],
  'moatads.com': ['Oracle', 'ads'],
  'moatpixel.com': ['Oracle', 'ads'],
  'nativo.com': ['Nativo', 'ads'],
  'onetag-sys.com': ['OneTag', 'ads'],
  'popads.net': ['PopAds', 'ads'],
  'propellerads.com': ['PropellerAds', 'ads'],
  'revcontent.com': ['Revcontent', 'ads'],
  'richaudience.com': ['Rich Audience', 'ads'],
  'serving-sys.com': ['Amazon', 'ads'],
  'assoc-amazon.com': ['Amazon', 'ads'],
  'sharethrough.com': ['Sharethrough', 'ads'],
  'smaato.net': ['Smaato', 'ads'],
  'smilewanted.com': ['SmileWanted', 'ads'],
  'spotx.tv': ['Magnite', 'ads'],
  'spotxchange.com': ['Magnite', 'ads'],
  'springserve.com': ['Magnite', 'ads'],
  'tremorhub.com': ['Nexxen', 'ads'],
  'unrulymedia.com': ['Nexxen', 'ads'],
  'amobee.com': ['Nexxen', 'ads'],
  'theadex.com': ['The ADEX', 'ads'],
  'trafficjunky.net': ['TrafficJunky', 'ads'],
  'unityads.unity3d.com': ['Unity', 'ads'],
  'yieldlab.net': ['Yieldlab', 'ads'],
  'yieldmo.com': ['Yieldmo', 'ads'],
  // Native ads / content recommendation
  'outbrainimg.com': ['Outbrain', 'ads'],
  'zemanta.com': ['Outbrain', 'ads'],
  'taboolasyndication.com': ['Taboola', 'ads'],
  'zergnet.com': ['ZergNet', 'ads'],
  'bounceexchange.com': ['Wunderkind', 'ads'],
  'bouncex.net': ['Wunderkind', 'ads'],
  // Data brokers / audience data
  'demandbase.com': ['Demandbase', 'ads'],
  'company-target.com': ['Demandbase', 'ads'],
  '6sc.co': ['6sense', 'ads'],
  'exelator.com': ['Nielsen', 'ads'],
  'krxd.net': ['Salesforce', 'ads'],
  'ml314.com': ['Bombora', 'ads'],
  'permutive.app': ['Permutive', 'ads'],
  'permutive.com': ['Permutive', 'ads'],
  'semasio.net': ['Semasio', 'ads'],
  'sharethis.com': ['ShareThis', 'ads'],
  'tapad.com': ['Tapad', 'ads'],
  'zeotap.com': ['Zeotap', 'ads'],
  'zoominfo.com': ['ZoomInfo', 'ads'],
  // Affiliate networks
  'anrdoezrs.net': ['CJ Affiliate', 'ads'],
  'dpbolvw.net': ['CJ Affiliate', 'ads'],
  'emjcd.com': ['CJ Affiliate', 'ads'],
  'jdoqocy.com': ['CJ Affiliate', 'ads'],
  'kqzyfj.com': ['CJ Affiliate', 'ads'],
  'tkqlhce.com': ['CJ Affiliate', 'ads'],
  'awin1.com': ['Awin', 'ads'],
  'zenaps.com': ['Awin', 'ads'],
  'linksynergy.com': ['Rakuten Advertising', 'ads'],
  'shareasale.com': ['ShareASale', 'ads'],
  'skimlinks.com': ['Skimlinks', 'ads'],
  'skimresources.com': ['Skimlinks', 'ads'],
  'tradedoubler.com': ['Tradedoubler', 'ads'],
  'webgains.com': ['Webgains', 'ads'],
  // Big platforms: ad & pixel endpoints
  'googletagservices.com': ['Google', 'ads'],
  'imasdk.googleapis.com': ['Google', 'ads'],
  'ytimg.com': ['Google', 'social'],
  'ads.tiktok.com': ['TikTok', 'ads'],
  'business-api.tiktok.com': ['TikTok', 'ads'],
  'ads.twitter.com': ['X (Twitter)', 'ads'],
  'analytics.twitter.com': ['X (Twitter)', 'ads'],
  'ads.reddit.com': ['Reddit', 'ads'],
  'q.quora.com': ['Quora', 'ads'],
  'hsadspixel.net': ['HubSpot', 'ads'],
  // Poland
  'adocean.pl': ['Gemius', 'ads'],
  'stat24.com': ['Gemius', 'analytics'],
  'adtotal.pl': ['Wirtualna Polska', 'ads'],
  'dot.wp.pl': ['Wirtualna Polska', 'analytics'],
  'salesmanago.com': ['SALESmanago', 'analytics'],
  'salesmanago.pl': ['SALESmanago', 'analytics'],
  'edrone.me': ['edrone', 'analytics'],
  'synerise.com': ['Synerise', 'analytics'],
  'snrcdn.net': ['Synerise', 'analytics'],
  // Analytics, tag managers, CDPs, marketing automation
  '2o7.net': ['Adobe', 'analytics'],
  'adobedc.net': ['Adobe', 'analytics'],
  'adobedtm.com': ['Adobe', 'analytics'],
  'marketo.net': ['Adobe', 'analytics'],
  'mktoresp.com': ['Adobe', 'analytics'],
  'abtasty.com': ['AB Tasty', 'analytics'],
  'adjust.com': ['Adjust', 'analytics'],
  'appboycdn.com': ['Braze', 'analytics'],
  'braze.com': ['Braze', 'analytics'],
  'appsflyer.com': ['AppsFlyer', 'analytics'],
  'branch.io': ['Branch', 'analytics'],
  'browser-intake-datadoghq.com': ['Datadog', 'analytics'],
  'browser-intake-datadoghq.eu': ['Datadog', 'analytics'],
  'datadoghq-browser-agent.com': ['Datadog', 'analytics'],
  'chartbeat.com': ['Chartbeat', 'analytics'],
  'chartbeat.net': ['Chartbeat', 'analytics'],
  'clearbit.com': ['HubSpot', 'analytics'],
  'hs-banner.com': ['HubSpot', 'analytics'],
  'hscollectedforms.net': ['HubSpot', 'analytics'],
  'hsforms.net': ['HubSpot', 'analytics'],
  'clicky.com': ['Clicky', 'analytics'],
  'cnzz.com': ['Alibaba', 'analytics'],
  'umeng.com': ['Alibaba', 'analytics'],
  'convertexperiments.com': ['Convert', 'analytics'],
  'cquotient.com': ['Salesforce', 'analytics'],
  'exacttarget.com': ['Salesforce', 'analytics'],
  'pardot.com': ['Salesforce', 'analytics'],
  'customer.io': ['Customer.io', 'analytics'],
  'dynamicyield.com': ['Dynamic Yield', 'analytics'],
  'eloqua.com': ['Oracle', 'analytics'],
  'en25.com': ['Oracle', 'analytics'],
  'oracleinfinity.io': ['Oracle', 'analytics'],
  'ensighten.com': ['Ensighten', 'analytics'],
  'histats.com': ['Histats', 'analytics'],
  'hm.baidu.com': ['Baidu', 'analytics'],
  'imrworldwide.com': ['Nielsen', 'analytics'],
  'ingest.sentry.io': ['Sentry', 'analytics'],
  'iterable.com': ['Iterable', 'analytics'],
  'kameleoon.eu': ['Kameleoon', 'analytics'],
  'kampyle.com': ['Medallia', 'analytics'],
  'medallia.com': ['Medallia', 'analytics'],
  'kissmetrics.io': ['Kissmetrics', 'analytics'],
  'klaviyo.com': ['Klaviyo', 'analytics'],
  'kochava.com': ['Kochava', 'analytics'],
  'leadfeeder.com': ['Leadfeeder', 'analytics'],
  'lfeeder.com': ['Leadfeeder', 'analytics'],
  'liveinternet.ru': ['LiveInternet', 'analytics'],
  'monetate.net': ['Monetate', 'analytics'],
  'mparticle.com': ['mParticle', 'analytics'],
  'mxpnl.com': ['Mixpanel', 'analytics'],
  'newrelic.com': ['New Relic', 'analytics'],
  'omnisnippet1.com': ['Omnisend', 'analytics'],
  'omnisrc.com': ['Omnisend', 'analytics'],
  'parsely.com': ['Parse.ly', 'analytics'],
  'pendo.io': ['Pendo', 'analytics'],
  'piwik.pro': ['Piwik PRO', 'analytics'],
  'plausible.io': ['Plausible', 'analytics'],
  'posthog.com': ['PostHog', 'analytics'],
  'qualtrics.com': ['Qualtrics', 'analytics'],
  'rudderlabs.com': ['RudderStack', 'analytics'],
  'rudderstack.com': ['RudderStack', 'analytics'],
  'simpleanalyticscdn.com': ['Simple Analytics', 'analytics'],
  'statcounter.com': ['StatCounter', 'analytics'],
  'tealiumiq.com': ['Tealium', 'analytics'],
  'tiqcdn.com': ['Tealium', 'analytics'],
  'top-fwz1.mail.ru': ['VK', 'analytics'],
  'usefathom.com': ['Fathom', 'analytics'],
  'walkme.com': ['WalkMe', 'analytics'],
  'woopra.com': ['Woopra', 'analytics'],
  'pixel.wp.com': ['Automattic', 'analytics'],
  'stats.wp.com': ['Automattic', 'analytics'],
  // Session recording / heatmaps
  'clicktale.net': ['Contentsquare', 'recording'],
  'contentsquare.com': ['Contentsquare', 'recording'],
  'contentsquare.net': ['Contentsquare', 'recording'],
  'decibelinsight.net': ['Contentsquare', 'recording'],
  'crazyegg.com': ['Crazy Egg', 'recording'],
  'glassboxdigital.io': ['Glassbox', 'recording'],
  'inspectlet.com': ['Inspectlet', 'recording'],
  'luckyorange.com': ['Lucky Orange', 'recording'],
  'luckyorange.net': ['Lucky Orange', 'recording'],
  'quantummetric.com': ['Quantum Metric', 'recording'],
  'sessioncam.com': ['SessionCam', 'recording'],
  'webvisor.com': ['Yandex', 'recording'],
  // Social widgets & embeds
  'addtoany.com': ['AddToAny', 'social'],
  'disqus.com': ['Disqus', 'social'],
  'disquscdn.com': ['Disqus', 'social'],
  'gravatar.com': ['Automattic', 'social'],
  'tumblr.com': ['Automattic', 'social'],
  'pinimg.com': ['Pinterest', 'social'],
  'reddit.com': ['Reddit', 'social'],
  'redditstatic.com': ['Reddit', 'social'],
  'telegram.org': ['Telegram', 'social'],
  'threads.net': ['Meta', 'social'],
  'vk.com': ['VK', 'social'],
});

/** All tracker domains that belong to a company (used for blocking rules). */
export function companyDomains(company) {
  return Object.keys(TRACKERS).filter((d) => TRACKERS[d][0] === company);
}

// Sites that belong to a tracker company: requests to that company's own
// domains are not counted as third-party tracking on these sites.
const SITE_OWNERS = {
  'google.com': 'Google',
  'google.pl': 'Google',
  'youtube.com': 'Google',
  'facebook.com': 'Meta',
  'instagram.com': 'Meta',
  'messenger.com': 'Meta',
  'linkedin.com': 'Microsoft (LinkedIn)',
  'x.com': 'X (Twitter)',
  'twitter.com': 'X (Twitter)',
  'tiktok.com': 'TikTok',
  'pinterest.com': 'Pinterest',
  'threads.net': 'Meta',
  'reddit.com': 'Reddit',
  'vk.com': 'VK',
  'tumblr.com': 'Automattic',
  'wordpress.com': 'Automattic',
  'amazon.com': 'Amazon',
  'amazon.pl': 'Amazon',
  'amazon.de': 'Amazon',
  'wp.pl': 'Wirtualna Polska',
};

const MULTI_PART_TLDS = new Set([
  'co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'com.pl', 'net.pl', 'org.pl', 'gov.pl',
  'edu.pl', 'waw.pl', 'com.au', 'net.au', 'co.nz', 'co.jp', 'com.br', 'co.in',
  'com.tr', 'com.mx', 'com.ar', 'co.za',
]);

/** "a.b.example.co.uk" → "example.co.uk" (good-enough eTLD+1). */
export function baseDomain(host) {
  if (!host) return '';
  if (/^[\d.]+$/.test(host) || host.includes(':')) return host; // IP address
  const parts = host.split('.');
  if (parts.length <= 2) return host;
  const last2 = parts.slice(-2).join('.');
  return MULTI_PART_TLDS.has(last2) ? parts.slice(-3).join('.') : last2;
}

/** Returns { company, category } for a known tracker host, or null. */
export function classify(host) {
  const parts = host.split('.');
  for (let i = 0; i < parts.length - 1; i++) {
    const hit = TRACKERS[parts.slice(i).join('.')];
    if (hit) return { company: hit[0], category: hit[1] };
  }
  return null;
}

export function siteOwner(site) {
  return SITE_OWNERS[site] || null;
}

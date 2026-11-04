import { baseDomain, classify, siteOwner, companyDomains } from './trackers.js';

const api = globalThis.browser ?? globalThis.chrome;

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

// Per-tab state, cached in memory and mirrored to storage.session so it
// survives the service worker / event page being put to sleep.
const tabs = new Map();
const saveTimers = new Map();
const key = (tabId) => `tab_${tabId}`;

// Persistent state (storage.local): blocked companies + 30-day history.
let blocked = new Set();
let history = { days: {} };
let historyTimer = null;
const HISTORY_DAYS = 30;

const ready = (async () => {
  const s = await api.storage.local.get(['blocked', 'history']);
  blocked = new Set(s.blocked || []);
  history = s.history || { days: {} };
})();

// ---------------------------------------------------------------------------
// Blocking (declarativeNetRequest dynamic rules, one rule per company)
// ---------------------------------------------------------------------------

const BLOCK_TYPES = [
  'sub_frame', 'script', 'image', 'xmlhttprequest', 'ping', 'stylesheet',
  'font', 'media', 'websocket', 'object', 'csp_report', 'other',
];

async function syncBlockRules() {
  await ready;
  const existing = await api.declarativeNetRequest.getDynamicRules();
  const addRules = [...blocked].sort()
    .map((company) => companyDomains(company))
    .filter((domains) => domains.length)
    .map((domains, i) => ({
      id: i + 1,
      priority: 1,
      action: { type: 'block' },
      // thirdParty: visiting facebook.com itself still works, embeds elsewhere are blocked.
      condition: { requestDomains: domains, domainType: 'thirdParty', resourceTypes: BLOCK_TYPES },
    }));
  await api.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map((r) => r.id),
    addRules,
  });
}

async function setBlocked(company, block) {
  await ready;
  block ? blocked.add(company) : blocked.delete(company);
  await api.storage.local.set({ blocked: [...blocked] });
  await syncBlockRules();
  return [...blocked];
}

api.runtime.onInstalled.addListener(() => syncBlockRules());

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------

const today = () => new Date().toLocaleDateString('sv'); // YYYY-MM-DD, local time

function historyDay() {
  return history.days[today()] ||= { requests: 0, blocked: 0, companies: {}, sites: {} };
}

function historySite(day, site) {
  return day.sites[site] ||= { visits: 0, requests: 0, companies: {} };
}

function saveHistory() {
  clearTimeout(historyTimer);
  historyTimer = setTimeout(() => {
    const cutoff = new Date(Date.now() - HISTORY_DAYS * 864e5).toLocaleDateString('sv');
    for (const d of Object.keys(history.days)) if (d < cutoff) delete history.days[d];
    api.storage.local.set({ history });
  }, 2000);
}

async function recordVisit(site) {
  await ready;
  if (!site) return;
  historySite(historyDay(), site).visits++;
  saveHistory();
}

function recordTrackerInHistory(site, company, category, isBlocked) {
  const day = historyDay();
  day.requests++;
  if (isBlocked) day.blocked++;
  const c = day.companies[company] ||= { category, requests: 0, sites: {} };
  c.requests++;
  c.sites[site] = 1;
  const s = historySite(day, site);
  s.requests++;
  s.companies[company] = category;
  saveHistory();
}

// ---------------------------------------------------------------------------
// Per-tab tracking
// ---------------------------------------------------------------------------

function newTabState(url) {
  let host = '';
  try { host = new URL(url).hostname; } catch {}
  const site = baseDomain(host);
  return { url, site, owner: siteOwner(site), startedAt: Date.now(), totalThirdParty: 0, blockedCount: 0, domains: {} };
}

async function loadTab(tabId) {
  if (tabs.has(tabId)) return tabs.get(tabId);
  const stored = (await api.storage.session.get(key(tabId)))[key(tabId)];
  if (stored && !tabs.has(tabId)) tabs.set(tabId, stored);
  return tabs.get(tabId) || null;
}

function scheduleSave(tabId) {
  clearTimeout(saveTimers.get(tabId));
  saveTimers.set(tabId, setTimeout(() => {
    const state = tabs.get(tabId);
    if (state) api.storage.session.set({ [key(tabId)]: state });
  }, 300));
}

function trackerCompanies(state) {
  const set = new Set();
  for (const d of Object.values(state.domains)) if (d.category) set.add(d.company);
  return set.size;
}

function updateBadge(tabId, state) {
  const n = state ? trackerCompanies(state) : 0;
  api.action.setBadgeText({ tabId, text: n ? String(n) : '' }).catch(() => {});
  const color = n >= 10 ? '#e63946' : n >= 4 ? '#f4a261' : '#2a9d8f';
  api.action.setBadgeBackgroundColor({ tabId, color }).catch(() => {});
}

api.webRequest.onBeforeRequest.addListener(
  (details) => {
    const { tabId, type, url } = details;
    if (tabId < 0 || !/^https?:/.test(url)) return;

    if (type === 'main_frame') {
      const state = newTabState(url);
      tabs.set(tabId, state);
      scheduleSave(tabId);
      updateBadge(tabId, state);
      recordVisit(state.site);
      return;
    }

    record(tabId, details);
  },
  { urls: ['<all_urls>'] }
);

async function record(tabId, details) {
  await ready;
  let state = await loadTab(tabId);
  if (!state) {
    // Tab was open before the extension started: infer the page from the initiator.
    state = newTabState(details.initiator || details.originUrl || details.documentUrl || '');
    tabs.set(tabId, state);
  }

  let host;
  try { host = new URL(details.url).hostname; } catch { return; }
  if (!state.site || baseDomain(host) === state.site) return; // first party

  const hit = classify(host);
  if (hit && state.owner && hit.company === state.owner) return; // same owner as the site

  const isBlocked = !!hit && blocked.has(hit.company);
  state.totalThirdParty++;
  if (isBlocked) state.blockedCount++;

  const entry = state.domains[host] ||= {
    count: 0,
    blocked: 0,
    company: hit ? hit.company : baseDomain(host),
    category: hit ? hit.category : null,
    types: {},
  };
  entry.count++;
  if (isBlocked) entry.blocked++;
  entry.types[details.type] = (entry.types[details.type] || 0) + 1;

  if (hit) recordTrackerInHistory(state.site, hit.company, hit.category, isBlocked);

  scheduleSave(tabId);
  updateBadge(tabId, state);
}

api.tabs.onRemoved.addListener((tabId) => {
  tabs.delete(tabId);
  api.storage.session.remove(key(tabId));
});

// ---------------------------------------------------------------------------
// Messages from popup / stats page
// ---------------------------------------------------------------------------

api.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  const handlers = {
    getTab: async () => ({ state: await loadTab(msg.tabId), blocked: [...blocked] }),
    setBlocked: () => setBlocked(msg.company, msg.block),
    getHistory: async () => ({ history, blocked: [...blocked] }),
    clearHistory: async () => {
      history = { days: {} };
      await api.storage.local.set({ history });
      return true;
    },
  };
  const handler = handlers[msg?.type];
  if (!handler) return;
  ready.then(handler).then(sendResponse);
  return true; // async response
});

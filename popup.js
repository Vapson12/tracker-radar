import { CATEGORIES } from './trackers.js';
import { privacyScore, gradeFor, GRADE_COLORS } from './scoring.js';

const api = globalThis.browser ?? globalThis.chrome;

const $ = (id) => document.getElementById(id);
const t = (key) => api.i18n.getMessage(key) || key;
// Locale actually used for messages (e.g. "pl"), so dates match the UI language.
const uiLocale = () => api.i18n.getMessage('locale') || 'en';
const CAT_KEY = { ads: 'catAds', analytics: 'catAnalytics', recording: 'catRecording', social: 'catSocial' };
const catLabel = (cat) => t(CAT_KEY[cat]);

// Translate static text: every element with data-i18n="messageKey".
function applyI18n() {
  document.documentElement.lang = uiLocale();
  for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
}

const openCompanies = new Set();
let blockedCompanies = new Set();
let currentTabId = null;

function hashAngle(str) {
  let h = 0;
  for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return (h % 360) * Math.PI / 180;
}

// Distance from the center per category (radar rings).
const RING = { recording: 32, analytics: 55, social: 75, ads: 88 };

function groupByCompany(state) {
  const companies = new Map();
  const others = [];
  for (const [host, d] of Object.entries(state.domains)) {
    if (!d.category) { others.push([host, d.count]); continue; }
    const c = companies.get(d.company) || { name: d.company, category: d.category, count: 0, blocked: 0, domains: [] };
    c.count += d.count;
    c.blocked += d.blocked || 0;
    c.domains.push(host);
    // A company that does ads anywhere on the page is shown as ads.
    if (d.category === 'ads') c.category = 'ads';
    companies.set(d.company, c);
  }
  return {
    companies: [...companies.values()].sort((a, b) => b.count - a.count),
    others: others.sort((a, b) => b[1] - a[1]),
  };
}

function renderRadar(companies) {
  const g = $('blips');
  g.replaceChildren();
  const max = Math.max(1, ...companies.map((c) => c.count));
  for (const c of companies) {
    const a = hashAngle(c.name);
    const r = RING[c.category] ?? 80;
    const size = 3 + 5 * Math.sqrt(c.count / max);
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', 100 + r * Math.cos(a));
    circle.setAttribute('cy', 100 + r * Math.sin(a));
    circle.setAttribute('r', size);
    circle.setAttribute('fill', CATEGORIES[c.category].color);
    circle.setAttribute('class', 'blip');
    circle.style.animationDelay = `${(a / (2 * Math.PI)) * 3}s`;
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${c.name} — ${c.count} ${t('requests')}`;
    circle.appendChild(title);
    g.appendChild(circle);
  }
}

function renderCompanies(companies) {
  const list = $('companies');
  list.replaceChildren();
  const max = Math.max(1, ...companies.map((c) => c.count));
  for (const c of companies) {
    const li = document.createElement('li');
    if (openCompanies.has(c.name)) li.classList.add('open');

    const row = document.createElement('div');
    row.className = 'company-row';
    row.title = catLabel(c.category);

    const name = document.createElement('span');
    name.className = 'company-name';
    name.textContent = c.name;

    const track = document.createElement('div');
    track.className = 'bar-track';
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.width = `${(c.count / max) * 100}%`;
    bar.style.background = CATEGORIES[c.category].color;
    track.appendChild(bar);

    const count = document.createElement('span');
    count.className = 'company-count';
    count.textContent = c.count;

    const isBlocked = blockedCompanies.has(c.name);
    if (isBlocked) li.classList.add('is-blocked');

    const shield = document.createElement('button');
    shield.className = 'shield';
    shield.textContent = isBlocked ? '🛡️' : '🛡';
    shield.title = isBlocked ? t('actUnblock') : t('actBlock');
    shield.setAttribute('aria-pressed', String(isBlocked));
    shield.addEventListener('click', async (e) => {
      e.stopPropagation();
      const list = await api.runtime.sendMessage({ type: 'setBlocked', company: c.name, block: !isBlocked });
      blockedCompanies = new Set(list);
      refresh(currentTabId);
    });

    row.append(name, track, count, shield);

    const domains = document.createElement('div');
    domains.className = 'company-domains';
    domains.textContent = (isBlocked ? `🛡 ${t('blockedTag')} · ` : '') + c.domains.join(', ');

    row.addEventListener('click', () => {
      li.classList.toggle('open');
      li.classList.contains('open') ? openCompanies.add(c.name) : openCompanies.delete(c.name);
    });

    li.append(row, domains);
    list.appendChild(li);
  }
  $('empty').hidden = companies.length > 0;
}

function renderOthers(others) {
  $('other-count').textContent = `(${others.length})`;
  const list = $('others');
  list.replaceChildren();
  for (const [host, count] of others) {
    const li = document.createElement('li');
    const h = document.createElement('span');
    h.textContent = host;
    const n = document.createElement('span');
    n.textContent = count;
    li.append(h, n);
    list.appendChild(li);
  }
}

function renderLegend() {
  const el = $('legend');
  for (const [id, cat] of Object.entries(CATEGORIES)) {
    const s = document.createElement('span');
    s.style.setProperty('--c', cat.color);
    s.textContent = catLabel(id);
    el.appendChild(s);
  }
}

async function getTabId() {
  // ?tabId=123 lets you open the popup in a normal tab for debugging.
  const fromQuery = new URLSearchParams(location.search).get('tabId');
  if (fromQuery) return Number(fromQuery);
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  return tab?.id;
}

async function refresh(tabId) {
  const res = await api.runtime.sendMessage({ type: 'getTab', tabId });
  const state = res?.state;
  blockedCompanies = new Set(res?.blocked || []);
  if (!state) {
    $('site').textContent = t('reloadToScan');
    return;
  }
  $('site').textContent = state.site || '—';
  const { companies, others } = groupByCompany(state);
  const trackerDomains = companies.reduce((n, c) => n + c.domains.length, 0);
  $('stat-companies').textContent = companies.length;
  $('stat-domains').textContent = trackerDomains;
  $('stat-requests').textContent = state.totalThirdParty;

  const grade = gradeFor(privacyScore(companies.map((c) => c.category)));
  const g = $('grade');
  g.hidden = false;
  g.textContent = grade;
  g.style.background = GRADE_COLORS[grade];

  $('blocked-line').hidden = !state.blockedCount;
  $('blocked-count').textContent = state.blockedCount || 0;
  renderRadar(companies);
  renderCompanies(companies);
  renderOthers(others);
}

// Firefox may not grant host permissions at install time: ask for them.
const ALL_SITES = { origins: ['<all_urls>'] };
if (!(await api.permissions.contains(ALL_SITES))) {
  $('perm').hidden = false;
  $('perm-btn').addEventListener('click', async () => {
    if (await api.permissions.request(ALL_SITES)) {
      $('perm').hidden = true;
      $('site').textContent = t('reloadToScan');
    }
  });
}

applyI18n();
$('grade').title = t('gradeHint');
$('open-stats').addEventListener('click', () => {
  api.tabs.create({ url: api.runtime.getURL('stats.html') });
  window.close();
});
renderLegend();
const tabId = await getTabId();
currentTabId = tabId;
if (tabId != null) {
  refresh(tabId);
  setInterval(() => refresh(tabId), 1000); // live updates while the popup is open
}

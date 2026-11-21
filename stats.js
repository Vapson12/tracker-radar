import { CATEGORIES } from './trackers.js';
import { privacyScore, gradeFor, GRADE_COLORS } from './scoring.js';

const api = globalThis.browser ?? globalThis.chrome;
const $ = (id) => document.getElementById(id);
const t = (key) => api.i18n.getMessage(key) || key;
// Locale actually used for messages (e.g. "pl"), so dates match the UI language.
const uiLocale = () => api.i18n.getMessage('locale') || 'en';

let rangeDays = 7;
let data = { history: { days: {} }, blocked: [] };

function applyI18n() {
  document.documentElement.lang = uiLocale();
  for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
  document.title = `${t('statsTitle')} · Tracker Radar`;
}

/** Last N days as YYYY-MM-DD strings, oldest first. */
function lastDays(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) out.push(new Date(Date.now() - i * 864e5).toLocaleDateString('sv'));
  return out;
}

function aggregate(dates) {
  const companies = new Map(); // name → { category, sites:Set }
  const sites = new Map();     // site → { companies: Map(name → category) }
  let requests = 0, blocked = 0;
  const perDay = [];

  for (const date of dates) {
    const day = data.history.days[date];
    perDay.push({ date, companies: day ? Object.keys(day.companies).length : 0 });
    if (!day) continue;
    requests += day.requests;
    blocked += day.blocked;
    for (const [name, c] of Object.entries(day.companies)) {
      const agg = companies.get(name) || { name, category: c.category, sites: new Set() };
      for (const s of Object.keys(c.sites)) agg.sites.add(s);
      companies.set(name, agg);
    }
    for (const [site, s] of Object.entries(day.sites)) {
      const agg = sites.get(site) || { site, companies: new Map() };
      for (const [name, cat] of Object.entries(s.companies)) agg.companies.set(name, cat);
      sites.set(site, agg);
    }
  }
  return { companies, sites, requests, blocked, perDay };
}

function renderChart(perDay) {
  const chart = $('chart');
  chart.replaceChildren();
  const max = Math.max(1, ...perDay.map((d) => d.companies));
  const fmt = new Intl.DateTimeFormat(uiLocale(), rangeDays <= 7 ? { weekday: 'short' } : { day: 'numeric' });
  for (const d of perDay) {
    const col = document.createElement('div');
    col.className = 'day';
    col.title = `${d.date}: ${d.companies}`;
    const val = document.createElement('span');
    val.className = 'val';
    val.textContent = d.companies || '';
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${(d.companies / max) * 80}%`;
    const lbl = document.createElement('span');
    lbl.className = 'lbl';
    lbl.textContent = fmt.format(new Date(`${d.date}T12:00:00`));
    col.append(val, bar, lbl);
    chart.appendChild(col);
  }
}

function cell(text, cls) {
  const td = document.createElement('td');
  if (cls) td.className = cls;
  if (text instanceof Node) td.appendChild(text); else td.textContent = text;
  return td;
}

function renderTopCompanies(companies) {
  const body = $('top-companies');
  body.replaceChildren();
  const top = [...companies.values()].sort((a, b) => b.sites.size - a.sites.size).slice(0, 12);
  for (const c of top) {
    const name = document.createElement('span');
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.background = CATEGORIES[c.category]?.color || '#6c757d';
    name.append(dot, c.name);
    const tr = document.createElement('tr');
    tr.append(cell(name, 'name'), cell(c.sites.size, 'n'), cell(data.blocked.includes(c.name) ? '🛡' : '', 'n'));
    body.appendChild(tr);
  }
}

function renderTopSites(sites) {
  const body = $('top-sites');
  body.replaceChildren();
  const top = [...sites.values()]
    .filter((s) => s.companies.size)
    .sort((a, b) => b.companies.size - a.companies.size)
    .slice(0, 12);
  for (const s of top) {
    const grade = gradeFor(privacyScore([...s.companies.values()]));
    const badge = document.createElement('span');
    badge.className = 'grade';
    badge.textContent = grade;
    badge.style.background = GRADE_COLORS[grade];
    const tr = document.createElement('tr');
    tr.append(cell(s.site, 'name'), cell(s.companies.size, 'n'), cell(badge, 'n'));
    body.appendChild(tr);
  }
}

function renderBlocked() {
  const list = $('blocked');
  list.replaceChildren();
  for (const company of [...data.blocked].sort()) {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = t('actUnblock');
    btn.addEventListener('click', async () => {
      data.blocked = await api.runtime.sendMessage({ type: 'setBlocked', company, block: false });
      render();
    });
    li.append(`🛡 ${company}`, btn);
    list.appendChild(li);
  }
  $('none-blocked').hidden = data.blocked.length > 0;
}

function renderPaused() {
  const list = $('paused');
  list.replaceChildren();
  const sites = [...(data.paused || [])].sort();
  for (const site of sites) {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = t('resumeShort');
    btn.addEventListener('click', async () => {
      data.paused = await api.runtime.sendMessage({ type: 'setPaused', site, pause: false });
      render();
    });
    li.append(`⏸ ${site}`, btn);
    list.appendChild(li);
  }
  $('none-paused').hidden = sites.length > 0;
}

// ---- Export ---------------------------------------------------------------

function download(filename, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const csvCell = (v) => /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v);

function exportCsv() {
  // One row per (day, website, tracking company).
  const rows = [['date', 'website', 'company', 'category', 'blocked_company']];
  for (const date of Object.keys(data.history.days).sort()) {
    for (const [site, s] of Object.entries(data.history.days[date].sites)) {
      for (const [company, category] of Object.entries(s.companies)) {
        rows.push([date, site, company, category, data.blocked.includes(company) ? 'yes' : 'no']);
      }
    }
  }
  download(`tracker-radar-${new Date().toLocaleDateString('sv')}.csv`, rows.map((r) => r.map(csvCell).join(',')).join('\n'), 'text/csv');
}

function exportJson() {
  const out = {
    exportedAt: new Date().toISOString(),
    version: api.runtime.getManifest().version,
    blockedCompanies: data.blocked,
    quickProtection: data.profiles || [],
    pausedSites: data.paused || [],
    history: data.history,
  };
  download(`tracker-radar-${new Date().toLocaleDateString('sv')}.json`, JSON.stringify(out, null, 2), 'application/json');
}

function render() {
  const agg = aggregate(lastDays(rangeDays));
  $('s-companies').textContent = agg.companies.size;
  $('s-sites').textContent = agg.sites.size;
  $('s-requests').textContent = agg.requests;
  $('s-blocked').textContent = agg.blocked;
  $('no-data').hidden = agg.sites.size > 0;
  renderChart(agg.perDay);
  renderTopCompanies(agg.companies);
  renderTopSites(agg.sites);
  renderBlocked();
  renderPaused();
}

async function load() {
  data = await api.runtime.sendMessage({ type: 'getHistory' });
  render();
}

applyI18n();

for (const btn of document.querySelectorAll('.range button')) {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.range button').forEach((b) => b.classList.toggle('active', b === btn));
    rangeDays = Number(btn.dataset.days);
    render();
  });
}

$('export-csv').addEventListener('click', exportCsv);
$('export-json').addEventListener('click', exportJson);

$('clear').addEventListener('click', async () => {
  if (!confirm(t('confirmClear'))) return;
  await api.runtime.sendMessage({ type: 'clearHistory' });
  load();
});

load();

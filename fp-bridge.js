// Isolated-world content script:
//  - gives fp-main.js (page world) a noise seed, synchronously at document_start,
//  - forwards fingerprinting detections to the background script.
(() => {
  const api = globalThis.browser ?? globalThis.chrome;
  const TAG = '__trackerRadarFP__';

  // Seed = hash(per-install secret, site). In Firefox the extension URL contains a
  // random per-install UUID, so other sites/trackers can't predict the noise.
  // The site part keeps the noise stable on one site and different across sites.
  const parts = location.hostname.split('.');
  const site = parts.slice(-2).join('.');
  let h = 2166136261;
  for (const ch of api.runtime.getURL('') + '|' + site) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  const seed = h >>> 0;

  const send = () => document.dispatchEvent(new CustomEvent('__trp_seed', { detail: seed }));
  document.addEventListener('__trp_hello', send, true);
  send();

  window.addEventListener('message', (e) => {
    const d = e.data;
    if (e.source !== window || !d || d[TAG] !== 'detected') return;
    if (!['canvas', 'webgl', 'audio', 'fonts'].includes(d.technique)) return;
    api.runtime.sendMessage({ type: 'fpDetected', technique: d.technique, host: String(d.host || '').slice(0, 253) }).catch(() => {});
  });
})();

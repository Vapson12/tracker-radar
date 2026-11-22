// Runs in the page's own JavaScript world (MAIN) at document_start.
// 1) Detects browser fingerprinting: canvas, WebGL, audio and font probing.
// 2) Optionally adds tiny noise to those readings (fingerprint protection).
// Findings are sent to fp-bridge.js with window.postMessage; nothing leaves the browser.
(() => {
  const TAG = '__trackerRadarFP__';
  if (window[TAG]) return;
  Object.defineProperty(window, TAG, { value: true });

  let protect = false;
  let seed = 0x9e3779b9;
  let seedSet = false;

  // Settings come in synchronously, before any page script runs:
  //   __trp_seed     from fp-bridge.js: per-install secret mixed with the site
  //   __trp_protect  from fp-on.js, which is only registered while protection is on
  // Only the first seed is accepted, so a page can't swap in a seed it knows.
  document.addEventListener('__trp_seed', (e) => {
    if (!seedSet && Number.isFinite(e.detail)) { seed = e.detail >>> 0; seedSet = true; }
  }, true);
  document.addEventListener('__trp_protect', () => { protect = true; }, true);
  // Ask the other scripts to (re)send, in case they ran before this one.
  document.dispatchEvent(new CustomEvent('__trp_hello'));

  // ---- reporting --------------------------------------------------------

  const reported = new Set();

  /** Host of the script that called the API (first stack frame outside this file). */
  function callerHost() {
    const lines = (new Error().stack || '').split('\n');
    for (const line of lines) {
      const m = line.match(/(https?:\/\/[^/\s)]+)\//);
      if (m && !line.includes('fp-main.js')) {
        try { return new URL(m[1]).hostname; } catch {}
      }
    }
    return location.hostname;
  }

  function report(technique) {
    const host = callerHost();
    const key = technique + '|' + host;
    if (reported.has(key)) return;
    reported.add(key);
    window.postMessage({ [TAG]: 'detected', technique, host }, '*');
  }

  // ---- deterministic noise (same per site for the whole browser session) --

  function rng(n) {
    let x = (seed ^ (n * 0x85ebca6b)) >>> 0;
    x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5;
    return (x >>> 0) / 4294967296;
  }

  function noisePixels(data) {
    // Flip the lowest bit of ~1 in 50 colour values: invisible, but changes the hash.
    for (let i = 0; i < data.length; i += 4) {
      if (rng(i) < 0.02) {
        const c = i + Math.floor(rng(i + 1) * 3);
        data[c] = data[c] ^ 1;
      }
    }
  }

  // ---- canvas -----------------------------------------------------------

  const C2D = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
  const CANVAS = window.HTMLCanvasElement && HTMLCanvasElement.prototype;
  const textCanvases = new WeakSet();
  const fontsMeasured = new Set();

  if (C2D && CANVAS) {
    for (const fn of ['fillText', 'strokeText']) {
      const orig = C2D[fn];
      C2D[fn] = function (...args) {
        textCanvases.add(this.canvas);
        return orig.apply(this, args);
      };
    }

    const origMeasure = C2D.measureText;
    C2D.measureText = function (...args) {
      fontsMeasured.add(this.font);
      if (fontsMeasured.size > 30) report('fonts');
      return origMeasure.apply(this, args);
    };

    const origGetImageData = C2D.getImageData;
    // Small canvases with text that get read back are the classic fingerprint.
    const suspicious = (canvas) => canvas && textCanvases.has(canvas) && canvas.width * canvas.height <= 640 * 480;

    C2D.getImageData = function (...args) {
      const img = origGetImageData.apply(this, args);
      if (suspicious(this.canvas)) {
        report('canvas');
        if (protect) noisePixels(img.data);
      }
      return img;
    };

    function noisyCopy(canvas) {
      const copy = document.createElement('canvas');
      copy.width = canvas.width;
      copy.height = canvas.height;
      const ctx = copy.getContext('2d');
      ctx.drawImage(canvas, 0, 0);
      const img = origGetImageData.call(ctx, 0, 0, copy.width, copy.height);
      noisePixels(img.data);
      ctx.putImageData(img, 0, 0);
      return copy;
    }

    for (const fn of ['toDataURL', 'toBlob']) {
      const orig = CANVAS[fn];
      CANVAS[fn] = function (...args) {
        if (suspicious(this)) {
          report('canvas');
          if (protect && this.width && this.height) {
            try { return orig.apply(noisyCopy(this), args); } catch {}
          }
        }
        return orig.apply(this, args);
      };
    }
  }

  // ---- WebGL ------------------------------------------------------------

  const UNMASKED_VENDOR = 0x9245;
  const UNMASKED_RENDERER = 0x9246;
  for (const name of ['WebGLRenderingContext', 'WebGL2RenderingContext']) {
    const proto = window[name] && window[name].prototype;
    if (!proto) continue;
    const origParam = proto.getParameter;
    proto.getParameter = function (p) {
      if (p === UNMASKED_VENDOR || p === UNMASKED_RENDERER) {
        report('webgl');
        if (protect) return p === UNMASKED_VENDOR ? 'Mozilla' : 'Mozilla';
      }
      return origParam.call(this, p);
    };
    const origExt = proto.getExtension;
    proto.getExtension = function (ext) {
      if (ext === 'WEBGL_debug_renderer_info') {
        report('webgl');
        // With protection on, the extension that reveals the graphics card model
        // is simply not available (sites don't need it to render anything).
        if (protect) return null;
      }
      return origExt.call(this, ext);
    };
  }

  // ---- Audio ------------------------------------------------------------

  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (OAC) {
    const origRender = OAC.prototype.startRendering;
    OAC.prototype.startRendering = function (...args) {
      report('audio');
      return origRender.apply(this, args);
    };
  }
  if (window.AudioBuffer) {
    const noised = new WeakSet();
    const origGet = AudioBuffer.prototype.getChannelData;
    AudioBuffer.prototype.getChannelData = function (...args) {
      const data = origGet.apply(this, args);
      if (protect && !noised.has(data)) {
        noised.add(data);
        for (let i = 0; i < data.length; i += 31) data[i] += (rng(i) - 0.5) * 2e-6;
      }
      return data;
    };
  }

  // ---- Fonts (CSS Font Loading API probing) -------------------------------

  if (document.fonts && document.fonts.check) {
    let checks = 0;
    const origCheck = document.fonts.check.bind(document.fonts);
    document.fonts.check = (...args) => {
      if (++checks > 30) report('fonts');
      return origCheck(...args);
    };
  }
})();

"""Builds browser-specific packages into dist/: python3 build.py"""
import json, zipfile, pathlib, copy

ROOT = pathlib.Path(__file__).parent
FILES = ['background.js', 'trackers.js', 'scoring.js', 'popup.html', 'popup.css', 'popup.js',
         'stats.html', 'stats.css', 'stats.js',
         'icons/icon16.png', 'icons/icon32.png', 'icons/icon48.png', 'icons/icon128.png', 'LICENSE']
base = json.loads((ROOT / 'manifest.json').read_text())

firefox = copy.deepcopy(base)
firefox['background'] = {'scripts': ['background.js'], 'type': 'module'}

chrome = copy.deepcopy(base)
chrome['background'] = {'service_worker': 'background.js', 'type': 'module'}
chrome.pop('browser_specific_settings', None)

(ROOT / 'dist').mkdir(exist_ok=True)
for name, manifest in [('firefox', firefox), ('chrome', chrome)]:
    out = ROOT / 'dist' / f'tracker-radar-{name}.zip'
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('manifest.json', json.dumps(manifest, indent=2))
        for f in FILES:
            z.write(ROOT / f, f)
        for f in sorted((ROOT / '_locales').rglob('messages.json')):
            z.write(f, f.relative_to(ROOT).as_posix())
    print('built', out)

// Prepares the Capacitor project: writes capacitor.config.json and fills www/
//   APK_MODE=bundled  (default) the site files are packed inside the APK: pages open instantly and all links stay inside the app.
//                     Products, projects, texts and photos you edit in the admin still update by themselves (they come from the server).
//   APK_MODE=live     the app opens the published website; code changes show up without a new APK
//   SITE_URL          the published website (GitHub Pages) address, used by "live"
import { cpSync, rmSync, mkdirSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const www = join(here, 'www');
const mode = (process.env.APK_MODE || 'bundled').toLowerCase();
let url = process.env.SITE_URL || 'https://example.github.io/your-repo/'; // the workflow always passes SITE_URL
url = new URL(url).href; // the host name is lower-cased here, Capacitor compares it case-sensitively
if (!url.endsWith('/')) url += '/';
if (!['live', 'bundled'].includes(mode)) throw new Error('APK_MODE must be "live" or "bundled"');

rmSync(www, { recursive: true, force: true });
mkdirSync(www, { recursive: true });

if (mode === 'bundled') {
  const skip = new Set(['apk', '.github', '.git', 'apps-script', 'node_modules', 'data', 'uploads', 'server.js', 'package.json', 'package-lock.json', 'README.md', '.gitignore']);
  for (const name of readdirSync(root)) {
    if (skip.has(name) || name.startsWith('.')) continue;
    cpSync(join(root, name), join(www, name), { recursive: true });
  }
} else {
  writeFileSync(join(www, 'index.html'), '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hook</title><body style="background:#FE502D;margin:0"><script>location.replace(' + JSON.stringify(url) + ')</script>');
}

const config = {
  appId: 'eg.hookagency.app',
  appName: 'Hook',
  webDir: 'www',
  backgroundColor: '#FE502D',
  android: {
    backgroundColor: '#FE502D',
    allowMixedContent: false,
    // the website looks for this word to know it runs inside the app
    appendUserAgent: 'HookApp'
  },
  server: { androidScheme: 'https' }
};
if (mode === 'live') {
  config.server.url = url;
  // every page of the site (same host) opens inside the app, only other sites go to the browser
  config.server.allowNavigation = [new URL(url).hostname];
}
writeFileSync(join(here, 'capacitor.config.json'), JSON.stringify(config, null, 2) + '\n');

const count = d => readdirSync(d).reduce((n, f) => n + (statSync(join(d, f)).isDirectory() ? count(join(d, f)) : 1), 0);
console.log(`APK mode: ${mode}${mode === 'live' ? ' -> ' + url : ''} | www files: ${count(www)}`);

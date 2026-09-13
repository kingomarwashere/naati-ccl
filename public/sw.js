// CCL Practice service worker — cache static shell, never intercept navigations or API.
const CACHE = 'ccl-v1';
const ASSETS = ['/app/auth.js', '/favicon.svg', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  // never touch navigations or API — always go to network (avoids stale-shell bugs)
  if (req.mode === 'navigate' || url.pathname.startsWith('/api/')) return;
  // cache-first for audio + static assets
  if (url.pathname.startsWith('/audio/') || ASSETS.includes(url.pathname)) {
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) c.put(req, res.clone());
      return res;
    }));
  }
});

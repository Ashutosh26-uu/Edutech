// Offline support.
// - Next's build output under /_next/static/ is content-hashed (a new deploy means new file
//   names), so it is served cache-first: repeat visits on slow data load scripts and CSS instantly.
// - Pages and everything else are network-first, falling back to the last cached copy offline.
// - API calls are never cached (or even handled here).
// Bump VERSION to drop every old cache when the caching rules change.
const VERSION = "v2";
const PAGES = `studyclip-pages-${VERSION}`;
const STATIC = `studyclip-static-${VERSION}`;
const STATIC_MAX = 400; // hashed files pile up across deploys; keep the newest few hundred

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) =>
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== PAGES && k !== STATIC).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  ),
);

/** Only plain, complete, same-origin answers are worth keeping. */
const cacheable = (res) => res && res.status === 200 && res.type === "basic";

async function trim(cache, max) {
  const keys = await cache.keys();
  // Oldest entries come first; drop them until the cache is back under its limit.
  await Promise.all(keys.slice(0, Math.max(0, keys.length - max)).map((k) => cache.delete(k)));
}

async function cacheFirst(req) {
  const hit = await caches.match(req, { cacheName: STATIC });
  if (hit) return hit;
  const res = await fetch(req);
  if (cacheable(res)) {
    const copy = res.clone();
    caches.open(STATIC).then((c) => c.put(req, copy).then(() => trim(c, STATIC_MAX)));
  }
  return res;
}

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    if (cacheable(res)) {
      const copy = res.clone();
      caches.open(PAGES).then((c) => c.put(req, copy));
    }
    return res;
  } catch (err) {
    const hit = (await caches.match(req, { cacheName: PAGES })) || (await caches.match(req));
    if (hit) return hit;
    // A page never opened before: show the Today page, which works offline once visited.
    if (req.mode === "navigate") {
      const fallback = (await caches.match(new URL("today/", self.registration.scope).href)) || (await caches.match(new URL("today", self.registration.scope).href));
      if (fallback) return fallback;
    }
    throw err;
  }
}

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin || url.pathname.includes("/api/")) return;
  e.respondWith(url.pathname.includes("/_next/static/") ? cacheFirst(e.request) : networkFirst(e.request));
});

// Daily study reminder (Web Push, opt-in on /today). One notification at a time: the tag
// replaces yesterday's if it is still showing.
self.addEventListener("push", (e) => {
  let data = {};
  try {
    data = e.data ? e.data.json() : {};
  } catch {
    data = { body: e.data ? e.data.text() : "" };
  }
  const icon = new URL("icon.svg", self.registration.scope).href;
  e.waitUntil(
    self.registration.showNotification(data.title || "StudyClip", {
      body: data.body || "Today's question is ready.",
      icon,
      badge: icon,
      tag: "daily-reminder",
      renotify: false,
      data: { url: data.url || "/today" },
    }),
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const target = new URL(String(e.notification.data?.url || "/today").replace(/^\//, ""), self.registration.scope).href;
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((tabs) => {
      const tab = tabs.find((c) => new URL(c.url).origin === location.origin);
      // Focus first (it must happen while the click still counts), then move that tab to the page.
      if (tab) return tab.focus().then((c) => (c.url === target ? c : c.navigate(target))).catch(() => {});
      return self.clients.openWindow(target);
    }),
  );
});

// Minimal offline support: pages and static assets are served network-first and
// fall back to the last cached copy when offline. API calls are never cached.
const CACHE = "studyclip-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin || url.pathname.includes("/api/")) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match(new URL("today/", self.registration.scope).href))),
  );
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

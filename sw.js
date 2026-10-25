/*
  Spanish in 15: offline cache (only used when the site is served over http or https).
  Stale while revalidate: answer from the cache, then refresh the cache in the background.
  Week files (data/weeks/weekNN.js) are cached the first time they are opened.
  Bump CACHE when you want every visitor to drop old files at once.
*/
var CACHE = "spanish15-v4";
var SHELL = [
  "./",
  "index.html",
  "css/style.css",
  "data/course.js",
  "data/year_outline.js",
  "data/lessons.js",
  "js/core.js",
  "js/game.js",
  "js/speech.js",
  "js/fx.js",
  "js/quiz.js",
  "js/exercises.js",
  "js/session.js",
  "js/v2.js",
  "js/app.js",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return Promise.all(SHELL.map(function (url) {
        return cache.add(url).catch(function () { /* a missing optional file must not block install */ });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k.indexOf("spanish15-") === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; /* never touch YouTube or other sites */
  event.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(req, { ignoreSearch: true }).then(function (hit) {
        var net = fetch(req).then(function (res) {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        }).catch(function () { return hit; });
        return hit || net;
      });
    })
  );
});

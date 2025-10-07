const CACHE = 'ntrstc-v1';
const ASSETS = [
  '/', '/index.html', '/styles.css', '/app.js', '/pwa.js', '/admin.html', '/admin.js', '/posts.json'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('fetch', (e)=>{
  e.respondWith(
    caches.match(e.request).then(r=> r || fetch(e.request))
  );
});

const CACHE_NAME = 'notes-app-v2.0.0';
const API_CACHE_NAME = 'notes-api-v2';
const RUNTIME_CACHE = 'runtime-v2';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/bundle.js',
  '/styles.css',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== CACHE_NAME &&
            cacheName !== API_CACHE_NAME &&
            cacheName !== RUNTIME_CACHE
          ) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      )
    )
  );
  return self.clients.claim();
});

// Fetch event - Network first, fallback to cache with offline page
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests - Network first, cache fallback
  if (url.origin === 'https://notes-api.dicoding.dev') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() =>
          // If network fails, try cache
          caches.match(request).then((response) => {
            if (response) {
              console.log('[ServiceWorker] Serving from cache:', request.url);
              return response;
            }
            // Return offline response
            return new Response(
              JSON.stringify({
                error: true,
                message: 'Offline - cached data not available',
                data: [],
              }),
              {
                headers: { 'Content-Type': 'application/json' },
                status: 503,
              }
            );
          })
        )
    );
    return;
  }

  // Static assets - Cache first, network fallback with offline support
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        // Serve from cache and update in background
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse);
              });
            }
          })
          .catch(() => {
            // Network failed, already serving from cache
          });
        return response;
      }

      return fetch(request)
        .then((networkResponse) => {
          // Cache successful responses
          if (networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() =>
          // Return offline fallback for HTML pages
          caches.match('/index.html').then((fallback) => {
            if (fallback && request.headers.get('accept').includes('text/html')) {
              return fallback;
            }
            return new Response('Offline', { status: 503 });
          })
        );
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag);
  
  if (event.tag === 'sync-notes') {
    event.waitUntil(syncNotes());
  } else if (event.tag.startsWith('create-note-')) {
    event.waitUntil(syncCreateNote(event.tag));
  } else if (event.tag.startsWith('update-note-')) {
    event.waitUntil(syncUpdateNote(event.tag));
  } else if (event.tag.startsWith('delete-note-')) {
    event.waitUntil(syncDeleteNote(event.tag));
  }
});

async function syncNotes() {
  console.log('[ServiceWorker] Syncing notes...');
  try {
    // Attempt to fetch fresh data
    const response = await fetch('https://notes-api.dicoding.dev/v2/notes');
    if (response.ok) {
      const data = await response.json();
      // Update cache with fresh data
      const cache = await caches.open(API_CACHE_NAME);
      cache.put('https://notes-api.dicoding.dev/v2/notes', new Response(JSON.stringify(data)));
      console.log('[ServiceWorker] Notes synced successfully');
    }
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
  }
}

async function syncCreateNote(tag) {
  console.log('[ServiceWorker] Syncing create note:', tag);
  // Implement note creation sync logic
}

async function syncUpdateNote(tag) {
  console.log('[ServiceWorker] Syncing update note:', tag);
  // Implement note update sync logic
}

async function syncDeleteNote(tag) {
  console.log('[ServiceWorker] Syncing delete note:', tag);
  // Implement note deletion sync logic
}

// Push notifications (optional - for future enhancement)
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received');
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification('Notes App', options)
  );
});

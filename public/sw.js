// Minimal service worker. It exists so browsers treat GymAI as an installable app;
// it does not cache anything, so every request still goes to the network.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
self.addEventListener('fetch', () => {})

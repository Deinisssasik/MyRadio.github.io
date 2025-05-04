// Название кэша и версия
const CACHE_NAME = 'myradio-v1';
// Ресурсы для кэширования при установке
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/img/favicon.ico',
  // Добавьте пути к логотипам радиостанций, например:
  '/img/Europa_plus.png',
  '/img/DFM.png',
  // Другие статические ресурсы
];

// Установка сервис-воркера
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_RESOURCES))
      .then(() => self.skipWaiting())
  );
});

// Активация (очистка старых кэшей)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Стратегия кэширования: "Сначала сеть, потом кэш"
self.addEventListener('fetch', event => {
  // Для аудиопотоков используем только сеть
  if (event.request.url.includes('stream') || 
      event.request.url.includes('radio') ||
      event.request.url.includes('mp3') ||
      event.request.url.includes('aacp')) {
    return fetch(event.request);
  }

  // Для остальных ресурсов: сначала сеть, при ошибке - кэш
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Клонируем ответ для кэширования
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
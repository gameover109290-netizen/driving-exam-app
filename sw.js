
const CACHE_NAME = 'driving-exam-cache-v3';
const urlsToCache = ${JSON.stringify(allFiles, null, 4)};

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache, starting download...');
                // 1つが失敗しても全体を止めないための安全なキャッシュ登録
                return Promise.all(
                    urlsToCache.map(url => {
                        return cache.add(url).catch(err => {
                            console.error('Failed to cache:', url, err);
                        });
                    })
                );
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true })
            .then(response => {
                if (response) return response;
                
                // rootへのアクセスだった場合、index.htmlを返す（PWA向けの安全対策）
                const url = new URL(event.request.url);
                if (url.pathname.endsWith('/')) {
                    return caches.match('./index.html');
                }
                
                return fetch(event.request);
            })
    );
});

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

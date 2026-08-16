
const CACHE_NAME = 'driving-exam-cache-v2';
const urlsToCache = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./questions.js",
    "./danger_questions.js",
    "./manifest.json",
    "./icons/icon-192x192.png",
    "./icons/icon-512x512.png",
    "./icons/icon-180x180.png",
    "./images/danger_1.svg",
    "./images/danger_2.svg",
    "./images/danger_3.svg",
    "./images/danger_4.svg",
    "./images/danger_5.svg",
    "./images/keep_out.svg",
    "./images/no_entry.svg",
    "./images/no_parking.svg",
    "./images/no_stopping.svg",
    "./images/no_stopping_area.svg",
    "./images/one_way.svg",
    "./images/page_0.png",
    "./images/stop.png",
    "./images/stop.svg",
    "./images/zebra_zone.svg",
    "./media/blue_mov.mp4",
    "./media/red_mov.mp4",
    "./media/right_mov.mp4",
    "./media/text_sample01.mp4",
    "./media/text_sample02.mp4",
    "./media/text_sample03.mp4",
    "./media/text_sample04.mp4",
    "./media/text_sample05.mp4",
    "./media/text_sample06.mp4",
    "./media/text_sample07.mp4",
    "./media/text_sample08.mp4",
    "./media/yellow_mov.mp4"
];

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

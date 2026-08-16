
const CACHE_NAME = 'driving-exam-cache-v1';
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
    "./media/blue_mov.wmv",
    "./media/red_mov.mp4",
    "./media/red_mov.wmv",
    "./media/right_mov.mp4",
    "./media/right_mov.wmv",
    "./media/text_sample01.mp4",
    "./media/text_sample01.wmv",
    "./media/text_sample02.mp4",
    "./media/text_sample02.wmv",
    "./media/text_sample03.mp4",
    "./media/text_sample03.wmv",
    "./media/text_sample04.mp4",
    "./media/text_sample04.wmv",
    "./media/text_sample05.mp4",
    "./media/text_sample05.wmv",
    "./media/text_sample06.mp4",
    "./media/text_sample06.wmv",
    "./media/text_sample07.mp4",
    "./media/text_sample07.wmv",
    "./media/text_sample08.mp4",
    "./media/text_sample08.wmv",
    "./media/yellow_mov.mp4",
    "./media/yellow_mov.wmv"
];

// インストール時にキャッシュする
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// リクエスト時のキャッシュ参照
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // キャッシュがあればそれを返す、なければネットワークへ
                return response || fetch(event.request);
            })
    );
});

// 古いキャッシュの削除
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

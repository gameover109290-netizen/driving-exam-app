const fs = require('fs');
const path = require('path');

const coreFiles = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './questions.js',
    './danger_questions.js',
    './manifest.json',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png',
    './icons/icon-180x180.png'
];

function getFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).map(f => `./${dir}/${f}`);
}

const imageFiles = getFiles('images');
const mediaFiles = getFiles('media');

const allFiles = [...coreFiles, ...imageFiles, ...mediaFiles];

const swContent = `
const CACHE_NAME = 'driving-exam-cache-v1';
const urlsToCache = ${JSON.stringify(allFiles, null, 4)};

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
`;

fs.writeFileSync('sw.js', swContent);
console.log('sw.js generated successfully.');

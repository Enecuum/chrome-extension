/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.


import {clientsClaim} from 'workbox-core';
import {ExpirationPlugin} from 'workbox-expiration';
import {createHandlerBoundToURL, precacheAndRoute, PrecacheController} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate} from 'workbox-strategies';

import {HEAD} from './version'

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
// precacheAndRoute(self.__WB_MANIFEST);

//TODO
let revisionNumber = HEAD

let array = ['/index.html', '/js/popup.js', '/js/lockAccount.js', '/js/contentScript.js', '/lib/enqweb3lib.ext.min.js']

let list = Array.from(array, link => {
    return {url: link, revision: revisionNumber}
});

precacheAndRoute(list)

console.log('Service Worker version: ' + revisionNumber)

const precacheController = new PrecacheController();
precacheController.addToCacheList(list);

self.addEventListener('fetch', event => {
    event.respondWith(fetch(event.request));
    console.log('Service Worker fetch.');
});
self.addEventListener('install', event => {
    // Passing in event is required in Workbox v6+
    event.waitUntil(precacheController.install(event));
    console.log('Service Worker install.');
});
self.addEventListener('installed', event => {
    console.log('Service Worker installed.');
});
self.addEventListener('activate', event => {
    console.log('Service Worker activate.');
});
self.addEventListener('sync', event => {
    console.log('Service Worker sync.');
});

// self.addEventListener('activate', function(event) {
//     event.waitUntil(
//         caches.keys().then(function(cacheNames) {
//             return Promise.all(
//                 cacheNames.filter(function(cacheName) {
//                     // Return true if you want to remove this cache,
//                     // but remember that caches are shared across
//                     // the whole origin
//                 }).map(function(cacheName) {
//                     return caches.delete(cacheName);
//                 })
//             );
//         })
//     );
// });


// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
    // Return false to exempt requests from being fulfilled by index.html.
    ({request, url}: { request: Request; url: URL }) => {
        // If this isn't a navigation, skip.
        if (request.mode !== 'navigate') {
            return false;
        }

        // If this is a URL that starts with /_, skip.
        if (url.pathname.startsWith('/_')) {
            return false;
        }

        // If this looks like a URL for a resource, because it contains
        // a file extension, skip.
        if (url.pathname.match(fileExtensionRegexp)) {
            return false;
        }

        // Return true to signal that we want to use the handler.
        return true;
    },
    createHandlerBoundToURL('/index.html')
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
    // Add in any other file extensions or routing criteria as needed.
    ({url}) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
    // Customize this strategy as needed, e.g., by changing to CacheFirst.
    new StaleWhileRevalidate({
        cacheName: 'images',
        plugins: [
            // Ensure that once this runtime cache reaches a maximum size the
            // least-recently used images are removed.
            new ExpirationPlugin({maxEntries: 50}),
        ],
    })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Any other custom service worker logic can go here.

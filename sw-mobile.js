'use strict';
let data;

self.addEventListener('install', skipWaiting);

self.addEventListener('message', function (event) {
	if (event.data) {
		if (typeof event.data === 'string') {
			data = new URL(event.data, event.source.url).href;
		} else if (event.data.framework && event.data.modules && event.data.prefix && event.data.home) {
			data = event.data;
			data.homeReg = RegExp('^' + new URL(data.home, event.source.url).href.replace(/[.*(){[\^$\\]/g, '\\$&') + '(index\\.html)?(\\?.*)?$');
			for (let i = 0; i < data.framework.length; i++) {
				data.framework[i] = new URL(data.framework[i], event.source.url).href;
			}
			for (let i = 0; i < data.modules.length; i++) {
				data.modules[i] = new URL(data.modules[i] + '/', event.source.url).href;
			}
			caches.open(data.prefix + 'modules').then(cache => cache.keys().then(keys => keys.forEach(request => {
				if (!findModule(request.url)) {
					cache.delete(request);
				}
			})));
			caches.open(data.prefix + 'framework').then(cache => cache.keys().then(keys => keys.forEach(request => {
				if (data.framework.indexOf(request.url) < 0) {
					cache.delete(request);
				}
			})));
		}
	}
});

self.addEventListener('fetch', function (event) {
	if (data && event.request.method === 'GET') {
		if (typeof data === 'string') {
			if (event.request.url.length >= data.length && event.request.url.substr(0, data.length) === data) {
				event.respondWith(fetch(event.request, {
					mode: 'no-cors',
					cache: 'no-cache'
				}));
			}
		} else {
			let type;
			if (data.framework.indexOf(event.request.url) >= 0) {
				type = 'framework';
			} else if (findModule(event.request.url)) {
				type = 'modules';
			} else if (data.homeReg.test(event.request.url)) {
				type = 'home';
			}
			if (type == 'home') {
				event.respondWith(caches.open(data.home + type).then(cache => fetch(event.request, {
					mode: 'no-cors',
					cache: 'no-cache'
				}).then(response => {
					cache.put(data.home, response.clone());
					return response;
				}, e => cache.match(data.home).then(response => response ? response : new Response(e.message, {
					status: 502
				})))));
			} else if (type) {
				event.respondWith(caches.open(data.prefix + type).then(cache => cache.match(event.request).then(response => response ? response : fetch(event.request, {
					mode: 'no-cors',
					cache: 'no-cache'
				}).then(response => {
					cache.put(event.request, response.clone());
					return response;
				}, e => new Response(e.message, {
					status: 502
				})))));
			}
		}
	}
});

function findModule(url) {
	let found;
	for (let i = 0; i < data.modules.length; i++) {
		if (url.length > data.modules[i].length && url.substr(0, data.modules[i].length) === data.modules[i]) {
			found = true;
			break;
		}
	}
	return found;
}
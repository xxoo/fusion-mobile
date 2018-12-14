'use strict';
let data;

self.addEventListener('install', skipWaiting);

self.addEventListener('message', function (event) {
	if (event.data) {
		if (typeof event.data === 'string') {
			data = new URL(event.data, event.source.url).href;
		} else if (event.data.framework && event.data.modules) {
			data = event.data;
			for (let i = 0; i < data.framework.length; i++) {
				data.framework[i] = new URL(data.framework[i], event.source.url).href;
			}
			for (let i = 0; i < data.modules.length; i++) {
				data.modules[i] = new URL(data.modules[i] + '/', event.source.url).href;
			}
			caches.open(data.prefix + 'modules').then(function (cache) {
				return cache.keys().then(function (keys) {
					keys.forEach(function (request) {
						if (!findModule(request.url)) {
							cache.delete(request);
						}
					});
				});
			});
			caches.open(data.prefix + 'framework').then(function (cache) {
				return cache.keys().then(function (keys) {
					keys.forEach(function (request) {
						if (data.framework.indexOf(request.url) < 0) {
							cache.delete(request);
						}
					});
				});
			});
		}
	}
});

self.addEventListener('fetch', function (event) {
	if (data && event.request.method === 'GET') {
		if (typeof data === 'string') {
			if (event.request.url.length >= data.length && event.request.url.substr(0, data.length) === data) {
				event.respondWith(fetch(new Request(event.request, {
					cache: 'no-cache'
				})));
			}
		} else {
			let type;
			if (data.framework.indexOf(event.request.url) >= 0) {
				type = 'framework';
			} else if (findModule(event.request.url)) {
				type = 'modules';
			}
			if (type) {
				event.respondWith(caches.open(data.prefix + type).then(function (cache) {
					return cache.match(event.request).then(function (response) {
						if (response) {
							return response;
						} else {
							return fetch(event.request).then(function (response) {
								if (response.ok) {
									cache.put(event.request, response.clone());
								}
								return response;
							});
						}
					});
				}));
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
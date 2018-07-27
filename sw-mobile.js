'use strict';
let data;

self.addEventListener('install', function(event) {
  this.skipWaiting();
});

self.addEventListener('message', function (event) {
	if (event.data && event.data.framework && event.data.modules) {
		data = event.data;
		for (let i = 0; i < data.modules.length; i++) {
			data.modules[i] = data.modules[i] + '/';
		}
		caches.open('fusion-mobile-modules').then(function (cache) {
			return cache.keys().then(function (keys) {
				keys.forEach(function (request) {
					if (!findModule(request.url)) {
						cache.delete(request);
					}
				});
			});
		});
		caches.open('fusion-mobile-framework').then(function (cache) {
			return cache.keys().then(function (keys) {
				keys.forEach(function (request) {
					if (data.framework.indexOf(request.url) < 0) {
						cache.delete(request);
					}
				});
			});
		});
	}
});

self.addEventListener('fetch', function (event) {
	if (data && event.request.method === 'GET') {
		let type;
		if (data.framework.indexOf(event.request.url) >= 0) {
			type = 'framework';
		} else if (findModule(event.request.url)) {
			type = 'modules';
		}
		if (type) {
			event.respondWith(caches.open('fusion-mobile-' + type).then(function (cache) {
				return cache.match(event.request).then(function (response) {
					if (response) {
						return response;
					} else {
						return fetch(event.request, {
							credentials: 'include'
						}).then(function (response) {
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
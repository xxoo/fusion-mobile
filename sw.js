'use module';
let data;

oninstall = skipWaiting;

onmessage = function (evt) {
	if (evt.data) {
		if (typeof evt.data === 'string') {
			data = new URL(evt.data, evt.source.url).href;
		} else if (evt.data.framework && evt.data.modules && evt.data.prefix && evt.data.home) {
			data = evt.data;
			data.homeReg = RegExp('^' + new URL(data.home, evt.source.url).href.replace(/[.*(){[\^$\\]/g, '\\$&') + '(index\\.html)?(\\?.*)?$');
			for (let i = 0; i < data.framework.length; i++) {
				data.framework[i] = new URL(data.framework[i], evt.source.url).href;
			}
			for (let i = 0; i < data.modules.length; i++) {
				data.modules[i] = new URL(data.modules[i] + '/', evt.source.url).href;
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
};

onfetch = function (evt) {
	if (data && evt.request.method === 'GET') {
		if (typeof data === 'string') {
			if (evt.request.url.length >= data.length && evt.request.url.substr(0, data.length) === data) {
				evt.respondWith(fetch(evt.request, {
					mode: 'no-cors',
					cache: 'no-cache'
				}));
			}
		} else {
			let type;
			if (data.framework.indexOf(evt.request.url) >= 0) {
				type = 'framework';
			} else if (findModule(evt.request.url)) {
				type = 'modules';
			} else if (data.homeReg.test(evt.request.url)) {
				type = 'home';
			}
			if (type === 'home') {
				evt.respondWith(caches.open(data.home + type).then(cache => fetch(evt.request, {
					mode: 'no-cors',
					cache: 'no-cache'
				}).then(response => {
					cache.put(data.home, response.clone());
					return response;
				}, e => cache.match(data.home).then(response => response ? response : new Response(e.message, {
					status: 502
				})))));
			} else if (type) {
				evt.respondWith(caches.open(data.prefix + type).then(cache => cache.match(evt.request).then(response => response ? response : fetch(evt.request, {
					mode: 'no-cors',
					cache: 'no-cache'
				}).then(response => {
					cache.put(evt.request, response.clone());
					return response;
				}, e => new Response(e.message, {
					status: 502
				})))));
			}
		}
	}
};

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
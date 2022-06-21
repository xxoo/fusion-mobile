'use module';
let config;
const getbase = url => url.replace(/^http(s)?:\/\/[^/]+|[^/]*(\?.*)?(#.*)?$/g, ''),
	base = getbase(location.href),
	homeReg = RegExp('^' + location.href.replace(/[^/]*(\?.*)?(#.*)?$/, '').replace(/[.*(){[\^$\\]/g, '\\$&') + '(index\\.html)?(\\?.*)?(#.*)?$'),
	find = url => {
		for (let i = 0; i < config.dir.length; i++) {
			if (url.length > config.dir[i].length && url.substr(0, config.dir[i].length) === config.dir[i]) {
				return true;
			}
		}
	};

caches.open(base + 'home').then(cache => cache.match('config')).then(response => response && response.json()).then(json => config = json);

oninstall = skipWaiting;

onmessage = function (evt) {
	if (getbase(evt.source.url) === base && evt.data) {
		if (typeof evt.data === 'string') {
			config = new URL(evt.data, evt.source.url).href;
		} else if (evt.data.file && evt.data.dir) {
			config = evt.data;
			for (let i = 0; i < config.file.length; i++) {
				config.file[i] = new URL(config.file[i], evt.source.url).href;
			}
			for (let i = 0; i < config.dir.length; i++) {
				config.dir[i] = new URL(config.dir[i] + '/', evt.source.url).href;
			}
			caches.open(base + 'dir').then(cache => cache.keys().then(keys => keys.forEach(request => {
				if (!find(request.url)) {
					cache.delete(request);
				}
			})));
			caches.open(base + 'file').then(cache => cache.keys().then(keys => keys.forEach(request => {
				if (config.file.indexOf(request.url) < 0) {
					cache.delete(request);
				}
			})));
		}
		caches.open(base + 'home').then(cache => cache.put('config', new Response(JSON.stringify(config))));
	}
};

onfetch = function (evt) {
	if (config && evt.request.method === 'GET') {
		if (typeof config === 'string') {
			if (evt.request.url.length >= config.length && evt.request.url.substr(0, config.length) === config) {
				evt.respondWith(fetch(evt.request, {
					mode: 'no-cors',
					cache: 'no-cache'
				}));
			}
		} else {
			let type;
			if (config.file.indexOf(evt.request.url) >= 0) {
				type = 'file';
			} else if (find(evt.request.url)) {
				type = 'dir';
			} else if (homeReg.test(evt.request.url)) {
				type = 'home';
			}
			if (type === 'home') {
				evt.respondWith(caches.open(base + type).then(cache => fetch(evt.request, {
					mode: 'no-cors',
					cache: 'no-cache'
				}).then(response => {
					cache.put(base, response.clone());
					return response;
				}, e => cache.match(base).then(response => response ? response : new Response(e.message, {
					status: 502
				})))));
			} else if (type) {
				evt.respondWith(caches.open(base + type).then(cache => cache.match(evt.request).then(response => response ? response : fetch(evt.request, {
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
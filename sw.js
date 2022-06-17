'use module';
let config;
const getbase = url => url.replace(/^http(s)?:\/\/[^/]+|[^/]*(\?.*)?(#.*)?$/g, ''),
	base = getbase(location.href),
	homeReg = RegExp('^' + location.href.replace(/[^/]*(\?.*)?(#.*)?$/, '').replace(/[.*(){[\^$\\]/g, '\\$&') + '(index\\.html)?(\\?.*)?(#.*)?$'),
	findModule = url => {
		for (let i = 0; i < config.module.length; i++) {
			if (url.length > config.module[i].length && url.substr(0, config.module[i].length) === config.module[i]) {
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
		} else if (evt.data.framework && evt.data.module) {
			config = evt.data;
			for (let i = 0; i < config.framework.length; i++) {
				config.framework[i] = new URL(config.framework[i], evt.source.url).href;
			}
			for (let i = 0; i < config.module.length; i++) {
				config.module[i] = new URL(config.module[i] + '/', evt.source.url).href;
			}
			caches.open(base + 'module').then(cache => cache.keys().then(keys => keys.forEach(request => {
				if (!findModule(request.url)) {
					cache.delete(request);
				}
			})));
			caches.open(base + 'framework').then(cache => cache.keys().then(keys => keys.forEach(request => {
				if (config.framework.indexOf(request.url) < 0) {
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
			if (config.framework.indexOf(evt.request.url) >= 0) {
				type = 'framework';
			} else if (findModule(evt.request.url)) {
				type = 'module';
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
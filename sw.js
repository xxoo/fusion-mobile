'use module';
if (typeof globalThis === 'undefined') {
	self.globalThis = self;
}
import './framework/src/jsex.js';
let config;
const base = getbase(location.href),
	homeReg = RegExp('^' + base.replace(/[.*(){[\^$\\]/g, '\\$&') + '(index\\.html)?(\\?.*)?$'),
	getbase = url => url.replace(/^http(s)?:\/\/[^/]+|[^/]*(\?.*)?(#.*)?$/g, ''),
	findFramework = url => {
		for (let i = 0; i < config.framework.length; i++) {
			if (typeof config.framework[i] === 'string') {
				if (url === config.framework[i]) {
					return true;
				}
			} else if (config.framework[i].test(url)) {
				return true;
			}
		}
	},
	findModule = url => {
		for (let i = 0; i < config.modules.length; i++) {
			if (url.length > config.modules[i].length && url.substr(0, config.modules[i].length) === config.modules[i]) {
				return true;
			}
		}
	};

caches.open(base + 'home').then(cache => cache.match('config')).then(response => response && response.text()).then(txt => {
	if (txt) {
		const o = txt.parseJsex();
		if (o) {
			config = o.value;
		}
	}
});

oninstall = skipWaiting;

onmessage = function (evt) {
	if (getbase(evt.source.url) === base && evt.data) {
		if (typeof evt.data === 'string') {
			config = new URL(evt.data, evt.source.url).href;
		} else if (evt.data.framework && evt.data.modules) {
			config = evt.data;
			for (let i = 0; i < config.framework.length; i++) {
				if (typeof config.framework[i] === 'string') {
					config.framework[i] = new URL(config.framework[i], evt.source.url).href;
				}
			}
			for (let i = 0; i < config.modules.length; i++) {
				config.modules[i] = new URL(config.modules[i] + '/', evt.source.url).href;
			}
			caches.open(config.home + 'modules').then(cache => cache.keys().then(keys => keys.forEach(request => {
				if (!findModule(request.url)) {
					cache.delete(request);
				}
			})));
			caches.open(config.home + 'framework').then(cache => cache.keys().then(keys => keys.forEach(request => {
				if (config.framework.indexOf(request.url) < 0) {
					cache.delete(request);
				}
			})));
		}
		caches.open(base + 'home').then(cache => cache.put('config', new Response(toJsex(config))));
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
			if (findFramework(evt.request.url)) {
				type = 'framework';
			} else if (findModule(evt.request.url)) {
				type = 'modules';
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
! function () {
	'use strict';
	var src = document.currentScript.getAttribute('src'),
		prefix = src.replace(/framework\/[^\/]+$/, ''),
		swfile = 'sw-mobile.js',
		cfg = {
			waitSeconds: 0,
			baseUrl: prefix + 'dev/'
		},
		n;
	if (VERSION !== 'dev') {
		for (n in MODULES) {
			MODULES[n] = prefix + 'dist/' + n + '/' + MODULES[n];
		}
		cfg.paths = MODULES;
	}
	require.config(cfg);
	if (navigator.serviceWorker) {
		if (navigator.serviceWorker.controller && navigator.serviceWorker.controller.scriptURL === new URL(swfile, location.href).href) {
			postmsg(navigator.serviceWorker.controller);
			init();
		} else {
			navigator.serviceWorker.register(swfile, {
				scope: './'
			}).then(function (registration) {
				postmsg(registration.installing || registration.waiting || registration.active);
				location.reload();
			}, init);
		}
	} else {
		init();
	}

	function postmsg(controller) {
		var msg;
		if (VERSION === 'dev') {
			msg = prefix;
		} else {
			RES_TO_CACHE.push(src);
			msg = {
				framework: RES_TO_CACHE,
				modules: Object.values(MODULES)
			};
		}
		controller.postMessage(msg);
	}

	function init() {
		var l = document.createElement('link'),
			m = document.createElement('link');
		if (VERSION === 'dev') {
			l.rel = m.rel = 'stylesheet/less';
			l.href = require.toUrl('site/index/index.less');
			m.href = require.toUrl('common/kernel/kernel.less');
			require([prefix + 'framework/less.js'], function () {
				less.pageLoadFinished.then(start);
			});
		} else {
			l.rel = m.rel = 'stylesheet';
			l.href = require.toUrl('site/index/index.css');
			m.href = require.toUrl('common/kernel/kernel.css');
			l.onload = m.onload = trystart;
			n = false;
		}
		document.head.appendChild(m);
		document.head.appendChild(l);
	}

	function start() {
		require(['site/index/index']);
	}

	function trystart() {
		this.onload = null;
		if (n) {
			start();
		} else {
			n = true;
		}
	}
}();
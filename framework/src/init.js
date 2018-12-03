! function () {
	'use strict';
	var src = document.currentScript.getAttribute('src'),
		prefix = src.replace(/framework\/[^\/]+$/, ''),
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
		navigator.serviceWorker.register('sw-mobile.js', {
			scope: './'
		}).then(function (registration) {
			var controller = registration.installing || registration.waiting || registration.active;
			RES_TO_CACHE.unshift(src);
			controller.postMessage(VERSION === 'dev' ? prefix : {
				framework: RES_TO_CACHE,
				modules: Object.values(MODULES)
			});
			init();
		}, function (err) {
			console.log('unable to register ServiceWorker: ' + err);
			init();
		});
	} else {
		init();
	}

	function init() {
		var l = document.createElement('link'),
			m = document.createElement('link');
		if (VERSION === 'dev') {
			l.rel = m.rel = 'stylesheet/less';
			l.href = require.toUrl('site/index/index.less');
			m.href = require.toUrl('common/kernel/kernel.less');
			require([prefix + 'framework/less.js'], function () {
				less.pageLoadFinished.then(function () {
					require(['site/index/index']);
				});
			});
		} else {
			l.rel = m.rel = 'stylesheet';
			l.href = require.toUrl('site/index/index.css');
			m.href = require.toUrl('common/kernel/kernel.css');
			self.addEventListener('load', function () {
				require(['site/index/index']);
			});
		}
		document.head.appendChild(m);
		document.head.appendChild(l);
		if (browser.app === 'Safari') {
			l = document.querySelector('meta[name="viewport"]');
			m = l.content;
			l.content = '';
			setTimeout(function () {
				l.content = m;
			}, 0);
		}
	}
}();
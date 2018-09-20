var browser = (function () {
	'use strict';
	var t, M, wait,
		s = 'user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1',
		browser = {
			platform: 'unknown',
			name: 'unsupported',
			version: 0
		};
	if (M = navigator.userAgent.match(/Macintosh|Windows/)) {
		browser.platform = M[0];
		if (M = navigator.userAgent.match(/(Edge)\/([\d\.]+)/) || navigator.userAgent.match(/(Chrome|Firefox)\/([\d\.]+)/) || navigator.userAgent.match(/(AppleWebKit)\/([\d\.]+)/)) {
			browser.name = M[1];
			browser.version = M[2];
		}
	} else if (M = navigator.userAgent.match(/Android/) || navigator.userAgent.match(/Linux/)) {
		browser.platform = M[0];
		if (M = navigator.userAgent.match(/(Chrome|Firefox)\/([\d\.]+)/) || navigator.userAgent.match(/(AppleWebKit)\/([\d\.]+)/)) {
			browser.name = M[1];
			browser.version = M[2];
		}
	} else if (M = navigator.userAgent.match(/(iPhone|iPad|iPod(?: Touch)?); CPU(?: iPhone)? OS ([\d_\.]+)/)) {
		browser.platform = M[1];
		browser.name = 'IOS';
		browser.version = M[2].replace(/_/g, '.');
	}
	if (navigator.userAgent.match(/QQ\/[\d\.]+/i)) {
		browser.app = 'QQ';
	} else if (navigator.userAgent.match(/micromessenger\/[\d\.]+/i)) {
		browser.app = 'WeChat';
	} else if (navigator.userAgent.match(/WeiBo/i)) {
		browser.app = 'WeiBo';
	}
	if (window.top === window) {
		t = document.head.appendChild(document.createElement('meta'));
		t.name = 'viewport';
		if (browser.name === 'unsupported') {
			t.content = s;
		} else {
			rsz();
			window.addEventListener('resize', rsz);
		}
	}
	return browser;

	function calcRato(sw) {
		var step = 0.125;
		var zoom = sw / 320;
		//放大时不使用线性算法
		if (zoom > 1) {
			zoom = Math.floor(Math.sqrt(zoom) / step) * step;
		}
		return zoom;
	}

	function rsz() {
		var r;
		if (wait) {
			wait = false;
		} else {
			if (t.content !== s) {
				wait = true;
				t.content = s;
			}
			r = calcRato(Math.min(innerWidth, innerHeight));
			if (r !== 1) {
				wait = true;
				t.content = 'user-scalable=no, width=' + 100 / r + '%, initial-scale=' + r + ', maximum-scale=' + r + ', minimum-scale=' + r;
			}
		}
	}
})();
! function () {
	'use strict';
	var src = document.currentScript.getAttribute('src'),
		prefix = src.replace(/framework\/[^\/]+$/, ''),
		cfg = {
			waitSeconds: 0,
			baseUrl: prefix + 'dev/'
		},
		l = document.createElement('link'),
		m = document.createElement('link'),
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
			RES_TO_CACHE.push(src);
			controller.postMessage({
				framework: RES_TO_CACHE,
				modules: Object.values(MODULES)
			});
		}, function (err) {
			console.log('unable to register ServiceWorker: ' + err);
		});
	}
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
		window.addEventListener('load', function () {
			require(['site/index/index']);
		});
	}
	document.head.appendChild(m);
	document.head.appendChild(l);
}();
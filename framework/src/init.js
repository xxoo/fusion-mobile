var browser = function () {
	'use strict';
	var M,
		browser = {
			platform: '',
			name: '',
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
	return browser;
}();
! function () {
	'use strict';
	var src = document.currentScript.getAttribute('src'),
		s = 'user-scalable=no, width=device-width',
		prefix = src.replace(/framework\/[^\/]+$/, ''),
		cfg = {
			waitSeconds: 0,
			baseUrl: prefix + 'dev/'
		},
		l = document.createElement('link'),
		m = document.createElement('link'),
		n, t, wait;
	if (window.top === window) {
		t = document.head.appendChild(document.createElement('meta'));
		t.name = 'viewport';
		t.content = s;
		if (window.visualViewport) {
			visualViewport.addEventListener('resize', function () {
				t.content = 'user-scalable=no, width=' + calcWidth(Math.round(visualViewport.width * visualViewport.scale), visualViewport.height * visualViewport.scale);
			});
			visualViewport.dispatchEvent(new Event('resize'));
		} else {
			window.addEventListener('resize', function () {
				var width;
				if (wait) {
					wait = false;
				} else {
					if (t.content !== s) {
						wait = true;
						t.content = s;
					}
					width = calcWidth(innerWidth, innerHeight);
					if (width !== innerWidth) {
						wait = true;
						t.content = 'user-scalable=no, width=' + width;
					}
				}
			});
			window.dispatchEvent(new Event('resize'));
		}
	}
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

	function calcWidth(width, height) {
		var sw = Math.min(width, height),
			r = sw / 320;
		if (r > 1) {
			r = Math.sqrt(r);
		}
		return Math.round(width / r);
	}
}();
var browser = (function () {
	'use strict';
	var M, browser = {
		platform: 'unknown',
		name: 'unsupported',
		version: 0
	};
	if (navigator.userAgent.match(/Android/)) {
		browser.platform = 'Android';
		if (M = navigator.userAgent.match(/(Chrome|Firefox)\/([\d\.]+)/)) {
			browser.name = M[1];
			browser.version = M[2];
		}
	} else if (M = navigator.userAgent.match(/(iPhone|iPad|iPod(?: Touch)?); CPU(?: iPhone)? OS ([\d_\.]+)/)) {
		browser.platform = M[1];
		browser.name = 'IOS';
		browser.version = M[2].replace(/_/g, '.');
	} else if (navigator.userAgent.match(/Windows/)) {
		browser.platform = 'Windows';
		if (M = navigator.userAgent.match(/(Trident)\/([\d\.]+).+Touch/)) {
			browser.name = M[1];
			browser.version = M[2];
		} else if ((navigator.maxTouchPoints || window.TouchEvent) && (M = navigator.userAgent.match(/(Chrome|Firefox)\/([\d\.]+)/))) {
			browser.name = M[1];
			browser.version = M[2];
		}
	}
	if (navigator.userAgent.match(/QQ\/[\d\.]+/i)) {
		browser.app = 'QQ';
	} else if (navigator.userAgent.match(/micromessenger\/[\d\.]+/i)) {
		browser.app = 'WeChat';
	} else if (navigator.userAgent.match(/WeiBo/i)) {
		browser.app = 'WeiBo';
	}
	if (window.top === window) {
		var s, sw, ww,
			t = document.head.appendChild(document.createElement('meta'));
		t.name = 'format-detection';
		t.content = 'telephone=no';
		t = document.head.appendChild(document.createElement('meta'));
		t.name = 'viewport';
		if (browser.name === 'Firefox') {
			s = calcRato(Math.min(screen.width, screen.height));
			t.content = 'user-scalable=no, width=' + 100 / s + '%, initial-scale=' + s + ', maximum-scale=' + s + ', minimum-scale=' + s;
		} else if (browser.name === 'Trident') {
			t.content = 'width=device-width, user-scalable=no';
			document.documentElement.style.zoom = calcRato(Math.min(screen.width, screen.height));
		} else {
			t.content = 'user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1';
			sw = Math.min(screen.width, screen.height);
			ww = Math.min(window.innerWidth, window.innerHeight);
			if (sw >= ww * devicePixelRatio) {
				document.documentElement.style.zoom = calcRato(sw / devicePixelRatio);
			} else {
				s = calcRato(sw);
				t.content = 'user-scalable=no, width=' + 100 / s + '%, initial-scale=' + s + ', maximum-scale=' + s + ', minimum-scale=' + s;
				if (browser.name === 'IOS' && CSS.supports('padding-bottom: constant(safe-area-inset-bottom)')) {
					t.content += ', viewport-fit=cover';
					document.documentElement.style.top = 'constant(safe-area-inset-top)';
					document.documentElement.style.left = 'constant(safe-area-inset-left)';
					document.documentElement.style.right = 'constant(safe-area-inset-right)';
					document.documentElement.style.bottom = 'constant(safe-area-inset-bottom)';
				}
			}
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
		navigator.serviceWorker.register(prefix + 'sw.js', {
			scope: './'
		}).then(function (registration) {
			var controller = registration.installing || registration.waiting || registration.active;
			if (!window.RES_TO_CACHE) {
				window.RES_TO_CACHE = [];
			}
			RES_TO_CACHE.push(location.origin + src);
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
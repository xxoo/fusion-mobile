! function () {
	'use strict';
	if (typeof Element.prototype.replaceChildren !== 'function') {
		Element.prototype.replaceChildren = function (...nodes) {
			this.innerHTML = '';
			for (let i = 0; i < nodes.length; i++) {
				this.append(nodes[i]);
			}
		};
	}
	if (typeof Object.hasOwn !== 'function') {
		Object.hasOwn = (o, p) => Object.prototype.hasOwnProperty.call(o, p);
	}
	const src = document.currentScript.getAttribute('src'),
		prefix = src.replace(/framework\/[^\/]+$/, ''),
		swfile = 'sw.js',
		cfg = {
			waitSeconds: 0,
			baseUrl: prefix + 'dev/'
		};
	if (BUILD) {
		for (const n in MODULES) {
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
				scope: './',
				type: 'module'
			}).then(function (registration) {
				postmsg(registration.installing || registration.waiting || registration.active);
				location.reload();
			}, init);
		}
	} else {
		init();
	}

	function postmsg(controller) {
		let msg;
		if (BUILD) {
			RES_TO_CACHE.push(src);
			msg = {
				file: RES_TO_CACHE,
				dir: DIR_TO_CACHE
			};
			for (const n in MODULES) {
				msg.dir.push(MODULES[n]);
			}
		} else {
			msg = prefix;
		}
		controller.postMessage(msg);
	}

	function init() {
		const l = document.createElement('link'),
			m = document.createElement('link');
		if (BUILD) {
			let n;
			l.rel = m.rel = 'stylesheet';
			l.href = require.toUrl('site/index/index.css');
			m.href = require.toUrl('common/fusion/fusion.css');
			l.onload = m.onload = function () {
				this.onload = null;
				if (n) {
					start();
				} else {
					n = true;
				}
			};
		} else {
			l.rel = m.rel = 'stylesheet/less';
			l.href = require.toUrl('site/index/index.less');
			m.href = require.toUrl('common/fusion/fusion.less');
			require([prefix + 'framework/less.js'], () => less.pageLoadFinished.then(start));
			self.less = {
				env: 'development',
				errorReporting: 'console',
				logLevel: 0
			};
		}
		document.head.appendChild(m);
		document.head.appendChild(l);
	}

	function start() {
		require(['site/index/index']);
	}
}();
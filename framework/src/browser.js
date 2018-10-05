var browser = function () {
	'use strict';
	var M,
		browser = {
			platform: '',
			name: '',
			app: '',
			version: 0
		};
	if (M = navigator.userAgent.match(/Macintosh|Windows/)) {
		browser.platform = M[0];
		if (M = navigator.userAgent.match(/(Edge)\/(\d+)/) || navigator.userAgent.match(/(Chrome|Firefox)\/(\d+)/) || navigator.userAgent.match(/(AppleWebKit)\/(\d+)/)) {
			browser.name = M[1];
			browser.version = +M[2];
		}
	} else if (M = navigator.userAgent.match(/Android/) || navigator.userAgent.match(/Linux/)) {
		browser.platform = M[0];
		if (M = navigator.userAgent.match(/(Chrome|Firefox)\/(\d+)/) || navigator.userAgent.match(/(AppleWebKit)\/(\d+)/)) {
			browser.name = M[1];
			browser.version = +M[2];
		}
	} else if (M = navigator.userAgent.match(/(iPhone|iPad|iPod(?: Touch)?); CPU(?: iPhone)? OS (\d+)/)) {
		browser.platform = M[1];
		browser.name = 'IOS';
		browser.version = +M[2];
	}
	if (navigator.userAgent.match(/QQ\/\d+/i)) {
		browser.app = 'QQ';
	} else if (navigator.userAgent.match(/micromessenger\/\d+/i)) {
		browser.app = 'WeChat';
	} else if (navigator.userAgent.match(/WeiBo/i)) {
		browser.app = 'WeiBo';
	} else if (browser.name === 'IOS' && navigator.userAgent.match(/Safari/)) {
		browser.app = 'Safari';
	}
	return browser;
}();
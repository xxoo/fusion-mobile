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
	if (/QQ\/\d+/i.test(navigator.userAgent)) {
		browser.app = 'QQ';
	} else if (/micromessenger\/\d+/i.test(navigator.userAgent)) {
		browser.app = 'WeChat';
	} else if (/WeiBo/i.test(navigator.userAgent)) {
		browser.app = 'WeiBo';
	} else if (browser.name === 'IOS' && /Safari/.test(navigator.userAgent)) {
		browser.app = 'Safari';
	}
	return browser;
}();
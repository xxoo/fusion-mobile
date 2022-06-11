'use strict';
define(['common/fusion/fusion'], function (fusion) {
	//百度统计代码
	if (location.host === 'your_production_host') {
		self._hmt = document.createElement('script');
		_hmt.src = '//hm.baidu.com/hm.js?[your_hmid]';
		document.head.appendChild(_hmt);
		_hmt = [['_setAutoPageview', false]];
		fusion.listeners.on(fusion.pageEvents, 'route', function () {
			_hmt.push(['_trackPageview', location.pathname + fusion.buildHash(fusion.location)]);
		});
	}
	fusion.init([{
		id: 'list',
		ico: ['mdiHomeVariantOutline', 'mdiHomeVariant']
	}, {
		id: 'user',
		ico: ['mdiAccountOutline', 'mdiAccount']
	}, {
		id: 'settings',
		ico: ['mdiCogOutline', 'mdiCog']
	}]);
	if (!document.body.classList.contains('clean') && browser.platform === 'Android' && browser.name === 'unsupported' && !browser.app) {
		fusion.htmlDialog('\
			<div style="padding:10px;font-weight:bold;font-size:14px;">请更换浏览器</div>\
			<div style="padding:0 20px 0 20px;font-size:12px;line-height:18px;text-align:justify;width:268px;">您使用的浏览器可能无法为本站提供完整支持, 推荐安装以下浏览器以获得更佳体验.</div>\
			<div style="text-align:center;">\
				<a style="margin:10px;vertical-align:top;" class="browserico chrome" href="https://play.google.com/store/apps/details?id=com.android.chrome" target="_blank"></a>\
				<a style="margin:10px;vertical-align:top;" class="browserico firefox" href="https://play.google.com/store/apps/details?id=org.mozilla.firefox" target="_blank"></a>\
				<a style="margin:10px;vertical-align:top;" class="browserico opera" href="https://play.google.com/store/apps/details?id=com.opera.browser" target="_blank"></a>\
			</div>\
		'.replace(/	|  /g, ''));
	}
});
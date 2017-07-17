'use strict';
define(['common/kernel/kernel'], function(kernel) {
	//百度统计代码
	if (location.host === 'your_production_host') {
		window._hmt = document.createElement('script');
		_hmt.src = '//hm.baidu.com/hm.js?[your_hmid]';
		document.head.appendChild(_hmt);
		_hmt = [
			['_setAutoPageview', false]
		];
	}
	kernel.init('home', {
		'home': 'home',
		'list': 'bars',
		'user': 'user',
		'settings': 'gear'
	}, function(){
		//百度统计接口
		if (window._hmt && _hmt.push) {
			_hmt.push(['_trackPageview', '/' + kernel.buildHash(kernel.location)]);
		}
	});
	if (!document.body.classList.contains('clean') && browser.platform === 'Android' && browser.name === 'unsupported' && !browser.app) {
		kernel.htmlDialog('\
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
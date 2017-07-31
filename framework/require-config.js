'use strict';
! function() {
	//请确保modules第一个被赋值
	var modules = {"common/kernel":4,"common/pointerevents":1,"common/svgicos":1,"common/touchguesture":1,"common/touchslider":1,"page/home":1,"page/list":1,"page/settings":1,"page/user":1,"popup/samplePopup":1,"popup/samplePopup2":1,"site/index":2,"site/pages":1,"site/popups":1},
		//请确保srcRoot第二个被赋值
		srcRoot = 'dev/',
		//请确保productRoot第三个被赋值
		productRoot = 'dist/',
		//请确保siteVersion第四个被赋值
		siteVersion = "1.0.265",
		//请确保debug第五个被赋值
		debug = false,
		prefix = document.currentScript.src.replace(/^http(s)?:\/\/[^\/]+|framework\/[^\/]+$/g, ''),
		cfg = {
			waitSeconds: 0,
			baseUrl: prefix + srcRoot
		};
	if (!debug) {
		for (var n in modules) {
			modules[n] = prefix + productRoot + n + '/' + modules[n];
		}
		cfg.paths = modules;
	}
	require.config(cfg);
	//用于外部访问的基本信息
	require.data = {
		siteVersion: siteVersion,
		debug: debug
	};
	//若需要从外部获得模块路径请使用require.toUrl('family/name')
}();
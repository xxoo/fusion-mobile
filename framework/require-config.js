'use strict';
! function() {
	//请确保modules第一个被赋值
	var modules = {"common/kernel":9,"common/pointerevents":3,"common/svgicos":3,"common/touchguesture":2,"common/touchslider":3,"page/list":4,"page/settings":2,"page/user":2,"popup/page":2,"popup/samplePopup":2,"popup/samplePopup2":2,"site/apis":2,"site/index":5,"site/pages":2,"site/popups":3},
		//请确保srcRoot第二个被赋值
		srcRoot = 'dev/',
		//请确保productRoot第三个被赋值
		productRoot = 'dist/',
		//请确保siteVersion第四个被赋值
		siteVersion = "1.0.272",
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
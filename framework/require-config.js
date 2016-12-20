'use strict';
! function() {
	//请确保modules第一个被赋值
	var modules = {"common/kernel":"0.0.2","common/pointerevents":"0.0.3","common/svgicos":"0.0.1","common/touchguesture":"0.0.1","common/touchslider":"0.0.3","page/home":"0.0.3","page/list":"0.0.2","page/settings":"0.0.2","page/user":"0.0.2","popup/samplePopup":"0.0.2","popup/samplePopup2":"0.0.2","site/index":"0.0.2","site/pages":"0.0.3","site/popups":"0.0.2"},
		//请确保srcRoot第二个被赋值
		srcRoot = 'dev/',
		//请确保productRoot第三个被赋值
		productRoot = 'dist/',
		//请确保siteVersion第四个被赋值
		siteVersion = "1.0.246",
		//请确保debug第五个被赋值
		debug = false,
		prefix = document.currentScript.src.replace(/^http(s)?:\/\/[^\/]+|framework\/[^\/]+$/g, ''),
		cfg = {
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
'use strict';
define(['module', 'common/fusion/fusion'], function (module, fusion) {
	var thispanel = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = document.querySelector('#panel>.' + thispanel);
	return {
		onunload: function () {
			//return true;
		},
		autoDestroy: true //auto destory popup when it is unloaded
	};
});
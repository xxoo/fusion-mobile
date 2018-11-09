'use strict';
define(['module', 'common/kernel/kernel'], function(module, kernel) {
	var thispanel = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = document.querySelector('#panel>.' + thispanel);
	return {
		onunload: function() {
			//return true;
		},
		autoDestroy: true //auto destory popup when it is unloaded
	}
});
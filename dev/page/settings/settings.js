'use strict';
define(['module', 'common/fusion/fusion'], function (module, fusion) {
	var thispage = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = document.querySelector('#page>.content>.' + thispage),
		n = 0;
	dom.querySelector('a').addEventListener('click', function () {
		fusion.openPopup('samplePopup', ++n);
	}, false);
	return {
		autoDestroy: true
	};
});
'use strict';
define(['module', 'common/kernel/kernel'], function(module, kernel) {
	var thispage = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = document.querySelector('#page>.content>.' + thispage),
		n = 0;
	dom.querySelector('a').addEventListener('click', function() {
		kernel.openPopup('samplePopup', ++n);
	}, false);
});
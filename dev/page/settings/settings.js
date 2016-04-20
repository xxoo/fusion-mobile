'use strict';
define(['site/kernel/kernel'], function(kernel) {
	var thispage = 'settings',
		dom = document.querySelector('#page>.content>.' + thispage),
		n = 0;
	dom.querySelector('a').addEventListener('click', function() {
		kernel.openPopup('samplePopup', ++n);
	}, false);
});
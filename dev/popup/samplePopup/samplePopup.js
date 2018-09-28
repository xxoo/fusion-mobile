'use strict';
define(['module', 'common/kernel/kernel'], function(module, kernel) {
	var thispopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = document.querySelector('#popup>.content>.' + thispopup);
	dom.querySelector('.menuItem').addEventListener('click', function() {
		kernel.openPopup('samplePopup2');
	});
	return {
		//如果指定了这个方法则需要在其中调用kernel.showPopup(thispopup)来显示此弹窗
		open: function(param, back) {
			kernel.alert('the param is: ' + param);
			kernel.showPopup(thispopup, back);
		},
		onload: function(back) {
			//opening this popup
			//return true can stop opening this popup
			//return true;
		},
		onloadend: function(back) {
			//this popup is open
		},
		onunload: function() {
			//closing this popup
			//return true can stop closing this popup
			//return true;
		},
		onunloadend: function() {
			//this popup is closed
		},
		ondestroy: function() {
			console.log('do clean up stuff here');
		},
		autoDestroy: true //auto destory popup when it is unloaded
	}
});
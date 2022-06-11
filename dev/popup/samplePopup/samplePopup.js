'use strict';
define(['module', 'common/fusion/fusion'], function (module, fusion) {
	var thispopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = document.querySelector('#popup>.content>.' + thispopup);
	dom.querySelector('.menuItem').addEventListener('click', function () {
		fusion.openPopup('samplePopup2');
	});
	return {
		//如果指定了这个方法则需要在其中调用fusion.showPopup(thispopup)来显示此弹窗
		open: function (param, back) {
			fusion.alert('the param is: ' + param);
			fusion.showPopup(thispopup, back);
		},
		onload: function (back) {
			//opening this popup
			//return true can stop opening this popup
			//return true;
		},
		onloadend: function (back) {
			//this popup is open
		},
		onunload: function () {
			//closing this popup
			//return true can stop closing this popup
			//return true;
		},
		onunloadend: function () {
			//this popup is closed
		},
		ondestroy: function () {
			console.log('do clean up stuff here');
		},
		autoDestroy: true //auto destory popup when it is unloaded
	};
});
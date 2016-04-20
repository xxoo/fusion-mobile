'use strict';
define(['site/kernel/kernel'], function(kernel) {
	var thispage = 'list',
		dom = document.querySelector('#page>.content>.' + thispage);
	return {
		onload: function(force) {
			if (force) {
				kernel.alert('opening list page');
			} else {
				kernel.alert('going back to list page');
			}
		},
		onloadend: function() {
			//this page is open
		},
        onunload: function() {
            //leveing this page
        },
        onunloadend: function() {
            //left this page
        }
        // 除以上事件外还可包含以下属性
		// * onleftmenuclick 左上角dom点击事件
		// * leftMenuDomContent 左上角dom对象, 字符串表示只显示相应文本
		// * onrightmenuclick 右上角dom点击事件
		// * rightMenuDomContent 右上角dom对象, 字符串表示只显示相应文本
	};
});
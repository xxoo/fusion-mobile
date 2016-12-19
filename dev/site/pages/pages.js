//pages
//路由配置
'use strict';
define({
	'home': {
		'js': 'home', // 主调js
		'html': 'home.html',
		'css': 'home.less', // 主调css
		'title': '首页' // 标题
	},
	'list': {
		'js': 'list',
		'html': 'list.html',
		'css': 'list.less',
		'title': '列表'
	},
	'user': {
		'html': 'user.html',
		'css': 'user.less',
		'title': '用户中心',
		'back': 'list'
	},
	'settings': {
		'js': 'settings',
		'html': 'settings.html',
		'css': 'settings.less',
		'title': '设置',
		'back': 'user'
	}
});

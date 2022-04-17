'use strict';
define(['module', 'common/kernel/kernel', 'common/touchslider/touchslider'], function (module, kernel, touchslider) {
	var thispage = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = document.querySelector('#page>.content>.' + thispage),
		tree = {
			'common/kernel/kernel': {
				desc: '核心模块，包含框架中的主要接口',
				methods: {
					'appendCss(url:string, forcecss:bool):HTMLLinkElement': {
						desc: '用于加载样式，会自动根据当前环境来选择加载less或者由less编译成的css',
						code: `var a = kernel.appendCss(require.toUrl('common/kernel/kernel'));
console.log(a.href);
setTimeout(function(){
	kernel.removeCss(a);
}, 1000);`
					},
					'removeCss(lnk:HTMLLinkElement):undefined': {
						desc: '移除已加载的less或者css',
						code: `var a = kernel.appendCss(require.toUrl('common/kernel/kernel'));
console.log(a.href);
setTimeout(function(){
	kernel.removeCss(a);
}, 1000);`
					},
					'makeSvg(name:string, type?:0|1|2):SVGSVGElement': {
						desc: '使用<a href="https://materialdesignicons.com/" target="_blank" style="color: darkgoldenrod;">common/svgicos</a>模块中name索引的内容作为path创建一个svg图标. type为0时图标的空白填充区域为0, 为1时图标会以最小的空白填充来使其成为正方形，为2时图标的空白填充区域为设计时指定的尺寸',
						code: `console.log(kernel.makeSvg('mdiHomeVariant'));`
					},
					'setSvgPath(svg:SVGSVGElement, name:string, type?:0|1|2):undefined': {
						desc: '修改由makeSvg创建的图标. type为0时图标的空白填充区域为0, 为1时图标会以最小的空白填充来使其成为正方形，为2时图标的空白填充区域为设计时指定的尺寸',
						code: `var svg = kernel.makeSvg('mdiHomeVariant');
console.log(svg.getAttribute('viewBox'));
kernel.setSvgPath(svg, 'mdiHomeVariant', 1);
console.log(svg.getAttribute('viewBox'));
kernel.setSvgPath(svg, 'mdiHomeVariant', 2);
console.log(svg.getAttribute('viewBox'));`
					},
					'buildHash(loc:Object):string': {
						desc: '将loc对象转换为锚点链接字符串',
						code: `console.log(kernel.buildHash(kernel.location));`
					},
					'parseHash(hash:string):Object': {
						desc: '将锚点链接字符串转换为loc对象',
						code: `console.log(kernel.parseHash(location.hash));`
					},
					'isSameLocation(loc1:Object, loc2:Object):boolean': {
						desc: '判断loc1和loc2是否对应同一个地址',
						code: `console.log(kernel.isSameLocation(kernel.location, {
	id: 'list',
	args: {
		api: 'isSameLocation(loc1:Object, loc2:Object):boolean'
	}
}));`
					},
					'replaceLocation(loc:Object):undefined': {
						desc: '改变当前地址，若loc和当前地址相同，则调用reloadPage',
						code: `kernel.replaceLocation({
	id: 'doc',
	args: {
		api: 'replaceLocation'
	}
});`
					},
					'getDefaultBack(loc:Object):Object': {
						desc: '获得loc的默认返回地址',
						code: `console.log(kernel.getDefaultBack({
	id: 'user',
	args: {}
}));`
					},
					'isGoingback(from:string, to:string):boolean': {
						desc: '判断从from跳转到to是否属于后退',
						code: `console.log(kernel.isGoingback('user', 'list'));`
					},
					'setAutoScale(minWidth:number):undefined': {
						desc: '设置自动缩放功能. 当 minWidth > 0 时则启用, 否则禁用. 当窗口宽度小于 minWidth 时会(线性)缩小页面内容, 当窗口宽度大于 minWidth 时会(非线性)放大页面内容.',
						code: `kernel.setAutoScale(375);`
					},
					'listeners.add(o:Object, e:string, f:Function):undefined': {
						desc: '注册监听事件',
						code: `kernel.listeners.add(kernel.popupEvents, 'show', func);
kernel.listeners.add(kernel.popupEvents, 'hide', func);
kernel.openPopup('samplePopup', 'doc');
function func(evt){
	console.log(kernel.listeners.list(this));
	kernel.listeners.remove(this, evt.type, func);
	console.log(evt);
}`
					},
					'listeners.list(o:Object, e?:string):Array|Object': {
						desc: '列出已注册的监听事件',
						code: `kernel.listeners.add(kernel.popupEvents, 'show', func);
kernel.listeners.add(kernel.popupEvents, 'hide', func);
kernel.openPopup('samplePopup', 'doc');
function func(evt){
	console.log(kernel.listeners.list(this));
	kernel.listeners.remove(this, evt.type, func);
	console.log(evt);
}`
					},
					'listeners.remove(o:Object, e?:string, f?:Function):undefined': {
						desc: '解除已注册的监听',
						code: `kernel.listeners.add(kernel.popupEvents, 'show', func);
kernel.listeners.add(kernel.popupEvents, 'hide', func);
kernel.openPopup('samplePopup', 'doc');
function func(evt){
	console.log(kernel.listeners.list(this));
	kernel.listeners.remove(this, evt.type, func);
	console.log(evt);
}`
					},
					'fixIosScrolling(dom:HTMLElement):undefined': {
						desc: '修复在ios中某元素上下滚动时会导致整个viewport一起滚动的问题, 调用此方法后会讲dom元素的padding-top和padding-bottom设置为1, 需要示例请查看首页源码'
					},
					'scrollReload(dom:HTMLElement, func?:Function):undefined': {
						desc: '在dom元素上启用下拉刷新, 当未指定刷新时调用的func时会调用reloadPage, 此方法会调用fixIosScrolling, 需要示例请查看本页源码'
					},
					'getScrollTop(dom:HTMLElement):number': {
						desc: '当对dom元素使用过fixIosScrolling后需要用这个方法来获取其scrollTop',
						code: `console.log(kernel.getScrollTop(document.querySelector('#page>.content>.list')))`
					},
					'getScrollHeight(dom:HTMLElement):number': {
						desc: '当对dom元素使用过fixIosScrolling后需要用这个方法来获取其scrollHeight',
						code: `console.log(kernel.getScrollHeight(document.querySelector('#page>.content>.list')))`
					},
					'setScrollTop(dom:HTMLElement, n:number):undefined': {
						desc: '当对dom元素使用过fixIosScrolling后需要用这个方法来设置其scrollTop',
						code: `kernel.setScrollTop(document.querySelector('#page>.content>.list'), 0)`
					},
					'showHelper(steps:Object|Array):undefined': {
						desc: '显示遮罩帮助指引',
						code: ``
					},
					'openPopup(id:string, param:any, back:boolean):undefined': {
						desc: '打开弹窗',
						code: `kernel.listeners.add(kernel.popupEvents, 'show', func);
kernel.listeners.add(kernel.popupEvents, 'hide', func);
kernel.openPopup('samplePopup', 'doc');
function func(evt){
	console.log(kernel.listeners.list(this));
	kernel.listeners.remove(this, evt.type, func);
	console.log(evt);
}`
					},
					'showPopup(id:string, back:boolean):0|1|2': {
						desc: '显示弹窗，只有在指定弹窗已经加载后才可使用. 返回0表示操作失败, 返回1表示操作成功, 返回2表示操作已队列. 若失败, 原因可能是当前弹窗的onunload方法返回true',
						code: `kernel.showPopup('samplePopup');`
					},
					'closePopup(id?:string|Array):0|1|2': {
						desc: '关闭弹窗, 返回0表示操作失败, 返回1表示操作成功, 返回2表示操作已队列. 若失败, 原因可能是当前弹窗的onunload方法返回true',
						code: `kernel.listeners.add(kernel.popupEvents, 'show', func);
kernel.listeners.add(kernel.popupEvents, 'hide', func);
kernel.openPopup('samplePopup', 'doc');
function func(evt){
	console.log(kernel.listeners.list(this));
	kernel.listeners.remove(this, evt.type, func);
	console.log(evt);
}`
					},
					'getCurrentPopup():string': {
						desc: '获取当前正在显示的弹窗id',
						code: `console.log(kernel.getCurrentPopup());`
					},
					'destroyPopup(id:string):boolean': {
						desc: '销毁已加载的指定弹窗, 会出发弹窗的ondestroy事件. 不可销毁当前弹窗, 返回true表示销毁成功',
						code: `console.log(kernel.destroyPopup('samplePopup2'));`
					},
					'setPopupBack(backid:string|Function, param:any):undefined': {
						desc: '设置弹窗上的后退按钮点击行为，调用后会显示后退按钮。不能在loadend之前使用, 需要示例请查看samplePopup2源码'
					},
					'setPopupTitle(newTitle:string, id?:string):undefined': {
						desc: '设置弹窗的标题, 若未指定id则会修改当前显示的弹窗, 并且为临时修改, 临时修改不能在loadend之前使用, 需要示例请查看samplePopup2源码'
					},
					'openPanel(id:string, param:any):0|1|2': {
						desc: '打开侧边栏',
						code: `kernel.openPanel('samplePanel');`
					},
					'showPanel(id:string):0|1|2': {
						desc: '显示侧边栏，只有在指定侧边栏已经加载后才可使用. 返回0表示操作失败, 返回1表示操作成功, 返回2表示操作已队列. 若失败, 原因可能是当前侧边栏的onunload方法返回true',
						code: `kernel.showPanel('samplePanel');`
					},
					'closePanel(id?:string|Array):0|1|2': {
						desc: '关闭侧边栏, 返回0表示操作失败, 返回1表示操作成功, 返回2表示操作已队列. 若失败, 原因可能是当前侧边栏的onunload方法返回true'
					},
					'getCurrentPanel():string': {
						desc: '获取当前正在显示的侧边栏id',
						code: `console.log(kernel.getCurrentPanel());`
					},
					'destroyPanel(id:string):boolean': {
						desc: '销毁已加载的指定侧边栏, 会出发侧边栏的ondestroy事件. 不可销毁当前侧边栏, 返回true表示销毁成功',
						code: `console.log(kernel.destroyPanel('samplePanel'));`
					},
					'showReadable(html:string|HTMLElement, callback?:Function, className?:string):undefined': {
						desc: '显示内容展示窗',
						code: `kernel.showReadable('&lt;h1>title&lt;/h1>&lt;p>content&lt;/p>', function(){
	console.log('readable window closed');
});`
					},
					'showForeign(url:string, callback?:Function):undefined': {
						desc: '将外部链接作为iframe显示在内容展示窗内',
						code: `kernel.showForeign('https://xxoo.github.io/fusion/', function(){
	console.log('foreign window closed');
});`
					},
					'hideReadable():undefined': {
						desc: '隐藏当前内容展示窗或外部链接窗, 一般不需要手动调用'
					},
					'showPhotoView(url:string, btns?:Array, func?:Function):undefined': {
						desc: '显示图片查看器, btns是显示在底部的按钮文字, func是点击这些按钮是会执行的回调, 接受一个参数i, 为按钮的索引',
						code: ``
					},
					'hidePhotoView():undefined': {
						desc: '关闭图片查看器, 一般不需要手动调用'
					},
					'showSliderView(doms:Array, idx?:number, className?:string):undefined': {
						desc: '显示轮播视图, doms为包含一系列HTMLElement的数组, idx为默认展示的HTMLElement索引, className为添加到视图的css class',
						code: ``
					},
					'hideSliderView():undefined': {
						desc: '隐藏轮播视图, 一般不需要手动调用'
					},
					'alert(text:string, closecb?:Function, opencb?:Function):undefined': {
						desc: '显示提示框',
						code: `kernel.alert('this is an alert box.');`
					},
					'confirm(text:string, closecb?:Function, opencb:Function):undefined': {
						desc: '显示需确认的提示框',
						code: `kernel.confirm('is this a confirm box?', function(sure){
	console.log(sure);
});`
					},
					'htmlDialog(html:string|HTMLElement, className?:string, closecb?:Function, opencb?:Function):undefined': {
						desc: '显示自定义内容的对话框',
						code: ``
					},
					'closeDialog(param:any):undefined': {
						desc: '关闭当前对话框, 一般不需要手动调用, param会作为参数传入到closecb中'
					},
					'showLoading(text?:string):undefined': {
						title: 'showLoading(text?:string):undefined',
						desc: '显示加载中界面, 这个方法包含一个引用计数, 每次调用会+1，所以此方法必须和hideLoading成对使用',
						code: `kernel.showLoading();
console.log(kernel.isLoading());
setTimeout(kernel.hideLoading, 1000);
kernel.listeners.add(kernel.dialogEvents, 'loaded', loaded);
function loaded(evt){
	kernel.listeners.remove(this, evt.type, loaded);
	console.log(kernel.isLoading());
}`
					},
					'hideLoading():undefined': {
						desc: '使showLoading的引用计数-1, 当到达0时才会关闭加载中界面, 并触发dialogEvents.onloaded事件',
						code: `kernel.showLoading();
console.log(kernel.isLoading());
setTimeout(kernel.hideLoading, 1000);
kernel.listeners.add(kernel.dialogEvents, 'loaded', loaded);
function loaded(evt){
	kernel.listeners.remove(this, evt.type, loaded);
	console.log(kernel.isLoading());
}`
					},
					'isLoading():boolean': {
						desc: '判断加载中界面是否在显示',
						code: `kernel.showLoading();
console.log(kernel.isLoading());
setTimeout(kernel.hideLoading, 1000);
kernel.listeners.add(kernel.dialogEvents, 'loaded', loaded);
function loaded(evt){
	kernel.listeners.remove(this, evt.type, loaded);
	console.log(kernel.isLoading());
}`
					},
					'hint(text:string, t?:number):undefined': {
						desc: '显示简易文本提示',
						code: `kernel.hint('文本提示');`
					},
					'init(navs:Array):undefined': {
						desc: '启动路由或者修改导航按钮, 导航栏第一项将被作为默认页, 需要示例请查看site/index/index中的代码'
					},
					'reloadPage(id?:string, silent?:boolean):undefined': {
						desc: '重新加载当前页',
						code: `kernel.reloadPage();`
					},
					'destroyPage(id:string):boolean': {
						desc: '销毁指定页面, 会触发页面的ondestroy事件. 无法销毁当前页, 返回true表示销毁成功',
						code: `console.log(kernel.destroyPage('user'));`
					}
				},
				properties: {
					'location:Object': {
						desc: '用于存放当前路由信息, 请勿直接修改',
						code: `console.log(kernel.location);`
					},
					'lastLocation:Object': {
						desc: '用于存放最近发生变化的路由信息, 可能为undefined, 请勿直接修改',
						code: `console.log(kernel.lastLocation);`
					}
				},
				events: {
					'popupEvents.onshow': {
						desc: '弹窗框架出现时触发'
					},
					'popupEvents.onshowend': {
						desc: '弹窗框架出现动画结束时触发'
					},
					'popupEvents.onhide': {
						desc: '弹窗框架隐藏时触发'
					},
					'popupEvents.onhideend': {
						desc: '弹窗框架隐藏动画结束时触发'
					},
					'dialogEvents.onloaded': {
						desc: 'loading提示框隐藏时触发'
					},
					'pageEvents.onroute': {
						desc: '页面路由开始时触发'
					},
					'pageEvents.onrouteend': {
						desc: '页面路由开始后页面资源加载成功后触发'
					}
				}
			},
			'common/pointerevents/pointerevents': {
				desc: '整合PointerEvent, TouchEvent, MouseEvent的监听方法, 用法请见源代码中的注释',
				methods: {
					'var events = pointerevents(dom:HTMLElement, callback:Function):Object': {
						desc: '模块的导出方法, 用法请见源代码中的注释'
					},
					'events.destroy():undefined': {
						desc: '销毁监听对象'
					}
				},
				properties: {
					'events.pointers:Array': {
						desc: '当前正在监听的触摸点id'
					}
				}
			},
			'common/touchguesture/touchguesture': {
				desc: '对平移和缩放的手势监听方法, 用法请见源代码中的注释',
				methods: {
					'var guesture = touchguesture(dom:HTMLElement):Object': {
						desc: '模块的导出方法, 用法请见源代码中的注释'
					},
					'guesture.destroy():undefined': {
						desc: '销毁监听对象'
					}
				},
				events: {
					'guesture.ondragstart': {
						desc: '拖动开始时触发'
					},
					'guesture.ondragend': {
						desc: '拖动结束时触发'
					},
					'guesture.onzoomstart': {
						desc: '缩放开始时触发'
					},
					'guesture.onzoomend': {
						desc: '缩放结束时触发'
					}
				}
			},
			'common/touchslider/touchslider': {
				desc: '支持触摸的滚动轮播',
				methods: {
					'var slider = touchslider(container:HTMLElement, contents?:Array, idx?:number):touchslider': {
						desc: '模块的导出方法, 用法请见源代码中的注释'
					},
					'slider.add(o:HTMLElement):number|undefined': {
						desc: '添加元素, 并返回该元素的索引, 若动在移动中则会在移动结束后执行, 并返回undefined'
					},
					'slider.remove(i:number|HTMLElement):HTMLElement|undefined': {
						desc: '删除指定元素或指定索引的元素, 并返回该元素, 若动在移动中则会在移动结束后执行, 并返回undefined'
					},
					'slider.clear():undefined': {
						desc: '清空所有元素, 若动在移动中则会在移动结束后执行'
					},
					'slider.slideTo(i:number|HTMLElement, direction:number):boolean': {
						desc: '滚动到指定元素或指定索引的元素, direction>0则动画为左移, direction<0则动画为右移, 其他情况无动画'
					},
					'slider.startPlay(delay:number):undefined': {
						desc: '以delay毫秒为延时来自动轮播'
					},
					'slider.stopPlay():boolean': {
						desc: '停止自动轮播'
					}
				},
				properties: {
					'slider.rate:number': {
						desc: '惯性比率, 默认值4000'
					},
					'slider.duration:number': {
						desc: '动画长度, 单位毫秒, 默认值400'
					},
					'slider.minVal:number': {
						desc: '手动触发移动的最小距离, 单位px, 默认值5'
					}
				},
				events: {
					'slider.onchange': {
						desc: '当前展示的元素发生变化时触发'
					},
					'slider.onslidend': {
						desc: '滚动停止时触发'
					}
				}
			}
		},
		sld = touchslider(dom.querySelector('.sld')),
		nav = dom.querySelector('.nav'),
		tabs = dom.querySelector('.tabs'),
		content = dom.querySelector('.content'),
		mods = Object.keys(tree),
		typeNames = {
			properties: '属性',
			methods: '方法',
			events: '事件'
		},
		mod, type, api, i, tmp;

	content.addEventListener('click', function (evt) {
		if (evt.target.className === 'code') {
			eval('var kernel = require("common/kernel/kernel");' + evt.target.textContent);
		}
	});
	sld.onchange = function () {
		nav.firstChild.data = navFormat(this.current, this.children.length);
		if (mod && mod !== mods[this.current]) {
			location.hash = '!' + thispage + '&mod=' + encodeURIComponent(mods[this.current]);
		}
	};
	for (i in tree) {
		tmp = document.createElement('div');
		tmp.className = 'item';
		tmp.innerHTML = `<div>${i}</div>${tree[i].desc}`;
		sld.add(tmp);
	}
	sld.onchange();
	kernel.scrollReload(dom);
	return {
		onload: function (force) {
			var types, apis,
				m = mod,
				t = type,
				a = api;
			if (force) {
				kernel.setScrollTop(dom, 0);
			}
			if (kernel.location.args.mod in tree) {
				mod = kernel.location.args.mod;
			} else {
				mod = mods[0];
			}
			types = Object.keys(tree[mod]);
			types.shift();
			if ((kernel.location.args.type in tree[mod]) && (kernel.location.args.type in typeNames)) {
				type = kernel.location.args.type;
			} else {
				type = types[0];
			}
			api = '';
			apis = [];
			for (i in tree[mod][type]) {
				apis.push(getShotTitle(i));
				if (apis[apis.length - 1] === kernel.location.args.api) {
					api = kernel.location.args.api;
				}
			}
			if (m !== mod) {
				t = '';
				sld.slideTo(mods.indexOf(mod));
				while (tabs.childNodes.length) {
					tabs.removeChild(tabs.firstChild);
				}
				for (i = 0; i < types.length; i++) {
					tmp = document.createElement('a');
					tmp.textContent = typeNames[types[i]];
					tmp.href = '#!' + thispage + '&mod=' + encodeURIComponent(mod) + '&type=' + encodeURIComponent(types[i]);
					tabs.appendChild(tmp);
				}
			}
			if (t !== type) {
				a = '';
				tabs.querySelector('a:nth-child(' + (types.indexOf(type) + 1) + ')').classList.add('active');
				if (t) {
					tabs.querySelector('a:nth-child(' + (types.indexOf(t) + 1) + ')').classList.remove('active');
				}
				while (content.childNodes.length) {
					content.removeChild(content.firstChild);
				}
				for (i in tree[mod][type]) {
					tmp = `<div class="item">
						<a href="#!${thispage}&mod=${encodeURIComponent(mod)}&type=${encodeURIComponent(type)}&api=${encodeURIComponent(getShotTitle(i))}">${i}</a><div class="desc">${tree[mod][type][i].desc}</div>`;
					if (tree[mod][type][i].code) {
						tmp += `<div class="code">${tree[mod][type][i].code}</div>`;
					}
					tmp += '</div>';
					content.insertAdjacentHTML('beforeEnd', tmp);
				}
			}
			if (a) {
				content.querySelector('.item:nth-child(' + (apis.indexOf(a) + 1) + ')').classList.remove('active');
			}
			if (api) {
				content.querySelector('.item:nth-child(' + (apis.indexOf(api) + 1) + ')').classList.add('active');
			}
		},
		onloadend: function () {
			tmp = content.querySelector('.item.active');
			tmp && tmp.scrollIntoView({
				block: 'start',
				behavior: 'smooth'
			});
		},
		onunload: function () {
			//leveing this page
		},
		onunloadend: function () {
			//left this page
		}
		// 除以上事件外还可包含以下属性
		// * onleftmenuclick 左上角dom点击事件
		// * leftMenuDomContent 左上角dom对象, 字符串表示只显示相应文本
		// * onrightmenuclick 右上角dom点击事件
		// * rightMenuDomContent 右上角dom对象, 字符串表示只显示相应文本
	};

	function navFormat(t, num) {
		var a = '●',
			b = '○',
			txt = '';
		for (var i = 0; i < num; i++) {
			txt += (i === t) ? a : b;
		}
		return txt;
	}

	function getShotTitle(title) {
		return title.replace(/[(:].+$/, '');
	}
});
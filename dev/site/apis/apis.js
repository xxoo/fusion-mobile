'use strice';
define({
	'common/kernel': {
		description: '核心模块，包含框架中的主要接口',
		properties: {
			'location:Object': {
				desc: '用于存放当前路由信息, 请勿直接修改',
				example: `console.log(kernel.location);`
			},
			'lastLocation:Object': {
				desc: '用于存放最近发生变化的路由信息, 可能为undefined, 请勿直接修改',
				example: `console.log(kernel.lastLocation);`
			}
		},
		methods: {
			'appendCss(url:String):HTMLLinkElement': {
				desc: '用于加载样式，会自动根据当前环境来选择加载less或者由less编译成的css',
				example: `var a = kernel.appendCss(require.toUrl('common/kernel/kernel.less'));
console.log(a.href);
setTimeout(function(){
console.log(kernel.removeCss(a));
}, 1000);`
			},
			'removeCss(lnk:HTMLLinkElement):String': {
				desc: '移除已加载的less或者css',
				example: `var a = kernel.appendCss(require.toUrl('common/kernel/kernel.less'));
console.log(a.href);
setTimeout(function(){
console.log(kernel.removeCss(a));
}, 1000);`
			},
			'makeSvg(name:String, square?:Bollean):SVGSVGElement': {
				desc: '使用common/svgicos模块中name索引的内容作为path创建一个svg图标',
				example: `console.log(kernel.makeSvg('home'));`
			},
			'setSvgPath(svg:SVGSVGElement, name:String, square?:Bollean):void': {
				desc: '修改由makeSvg创建的图标',
				example: `var svg = kernel.makeSvg('home');
kernel.setSvgPath(svg, 'list', true);
console.log(svg);`
			},
			'buildHash(loc:Object):String': {
				desc: '将loc对象转换为锚点链接字符串',
				example: `console.log(kernel.buildHash(kernel.location));`
			},
			'parseHash(hash:String):Object': {
				desc: '将锚点链接字符串转换为loc对象',
				example: `console.log(kernel.parseHash(location.hash));`
			},
			'isSameLocation(loc1:Object, loc2:Object):Bollean': {
				desc: '判断loc1和loc2是否对应同一个地址',
				example: `console.log(kernel.isSameLocation(kernel.location, {
id: 'doc',
args: {
	api: 'isSameLocation'
}
}));`
			},
			'replaceLocation(loc:Object):void': {
				desc: '改变当前地址，若loc和当前地址相同，则调用reloadPage',
				example: `kernel.replaceLocation({
id: 'doc', args: {
	api: 'replaceLocation'
}
});`
			},
			'getDefaultBack(loc:Object):Object': {
				desc: '获得loc的默认返回地址',
				example: `console.log(kernel.getDefaultBack({
id: 'list'
}));`
			},
			'isGoingback(from:Object, to:Object):Boolean': {
				desc: '判断从from跳转到to是否属于后退',
				example: `console.log(kernel.isGoingback({
id: 'list'
}, {
id: 'home'
}));`
			},
			'dataType(a:any):String': {
				desc: '获得a的数据类型, 和jQuery.type类似',
				example: `console.log(kernel.dataType([]));`
			},
			'listeners.add(o:Object, e:String, f:Function):void': {
				desc: '注册监听事件',
				example: `kernel.listeners.add(kernel.popupEvents, 'show', func);
kernel.listeners.add(kernel.popupEvents, 'hide', func);
kernel.openPopup('samplePopup', 'doc');
function func(evt){
console.log(kernel.listeners.list(this));
kernel.listeners.remove(this, evt.type, func);
console.log(evt);
}`
			},
			'listeners.list(o:Object, e:String):Array|Object': {
				desc: '列出已注册的监听事件',
				example: `kernel.listeners.add(kernel.popupEvents, 'show', func);
kernel.listeners.add(kernel.popupEvents, 'hide', func);
kernel.openPopup('samplePopup', 'doc');
function func(evt){
console.log(kernel.listeners.list(this));
kernel.listeners.remove(this, evt.type, func);
console.log(evt);
}`
			},
			'listeners.remove(o:Object, e?:String, f?:Function):void': {
				desc: '解除已注册的监听',
				example: `kernel.listeners.add(kernel.popupEvents, 'show', func);
kernel.listeners.add(kernel.popupEvents, 'hide', func);
kernel.openPopup('samplePopup', 'doc');
function func(evt){
console.log(kernel.listeners.list(this));
kernel.listeners.remove(this, evt.type, func);
console.log(evt);
}`
			},
			'fixIosScrolling(dom:HTMLElement):void': {
				desc: '修复在ios中某元素上下滚动时会导致整个viewport一起滚动的问题, 调用此方法后会讲dom元素的padding-top和padding-bottom设置为1, 需要示例请查看首页源码'
			},
			'scrollReload(dom:HTMLElement, func?:Function):void': {
				desc: '在dom元素上启用下拉刷新, 当未指定刷新时调用的func时会调用reloadPage, 此方法会调用fixIosScrolling, 需要示例请查看本页源码'
			},
			'getScrollHeight(dom:HTMLElement):Number': {
				desc: '当对dom元素使用过fixIosScrolling后需要用这个方法来获取其scrollHeight',
				example: `console.log(kernel.getScrollHeight(document.querySelector('#page>.content>.list')))`
			},
			'setScrollTop(dom:HTMLElement, n:Number):void': {
				desc: '当对dom元素使用过fixIosScrolling后需要用这个方法来设置其scrollTop',
				example: `kernel.setScrollTop(document.querySelector('#page>.content>.list'), 0)`
			},
			'showHelper(steps:Object|Array):void': {
				desc: '显示遮罩帮助指引',
				example: ``
			},
			'openPopup(id:String, param:any):void': {
				desc: '打开弹窗',
				example: `kernel.listeners.add(kernel.popupEvents, 'show', func);
kernel.listeners.add(kernel.popupEvents, 'hide', func);
kernel.openPopup('samplePopup', 'doc');
function func(evt){
console.log(kernel.listeners.list(this));
kernel.listeners.remove(this, evt.type, func);
console.log(evt);
}`
			},
			'showPopup(id:String, param:any):void': {
				desc: '显示弹窗，只有在指定弹窗已经加载后才可使用',
				example: `kernel.showPopup('samplePopup', 'doc');`
			},
			'closePopup(id:String):void': {
				desc: '关闭弹窗',
				example: `kernel.listeners.add(kernel.popupEvents, 'show', func);
kernel.listeners.add(kernel.popupEvents, 'hide', func);
kernel.openPopup('samplePopup', 'doc');
function func(evt){
console.log(kernel.listeners.list(this));
kernel.listeners.remove(this, evt.type, func);
console.log(evt);
}`
			},
			'getCurrentPopup():String': {
				desc: '获取当前正在显示的弹窗id',
				example: `console.log(kernel.getCurrentPopup());`
			},
			'destoryPopup(id:String):void': {
				desc: '销毁已加载的指定弹窗, 不可销毁当前弹窗',
				example: `kernel.destoryPopup('samplePopup');`
			},
			'setPopupBackParam(param:any):void': {
				desc: '设置点击返回按钮时要传递到该窗口的参数, 不能在loadend之前使用, 需要示例请查看samplePopup2源码'
			},
			'setPopupBack(backid:String, id?:String):void': {
				desc: '设置弹窗的后退位置, 若未指定id则会修改当前显示的弹窗, 并且为临时修改, 临时修改不能在loadend之前使用, 需要示例请查看samplePopup2源码'
			},
			'setPopupTitle(newTitle:String, id?:String):void': {
				desc: '设置弹窗的标题, 若未指定id则会修改当前显示的弹窗, 并且为临时修改, 临时修改不能在loadend之前使用, 需要示例请查看samplePopup2源码'
			},
			'showReadable(html:String|HTMLElement, callback?:Function, className?:String):void': {
				desc: '显示内容展示窗',
				example: `kernel.showReadable('&lt;h1>title&lt;/h1>&lt;p>content&lt;/p>', function(){
console.log('readable window closed');
});`
			},
			'showForeign(url:String, callback?:Function):void': {
				desc: '将外部链接作为iframe显示在内容展示窗内',
				example: `kernel.showForeign('https://xxoo.github.io/fusion/', function(){
console.log('foreign window closed');
});`
			},
			'hideReadable():void': {
				desc: '隐藏当前内容展示窗或外部链接窗, 一般不需要手动调用'
			},
			'showPhotoView(url:String, btns?:Array, func?:Function):void': {
				desc: '显示图片查看器, btns是显示在底部的按钮文字, func是点击这些按钮是会执行的回调, 接受一个参数i, 为按钮的索引',
				example: ``
			},
			'hidePhotoView():void': {
				desc: '关闭图片查看器, 一般不需要手动调用'
			},
			'showSliderView(doms:Array, idx?:Number, className?:String):void': {
				desc: '显示轮播视图, doms为包含一系列HTMLElement的数组, idx为默认展示的HTMLElement索引, className为添加到视图的css class',
				example: ``
			},
			'hideSliderView():void': {
				desc: '隐藏轮播视图, 一般不需要手动调用'
			},
			'alert(text:String, callback?:Function):void': {
				desc: '显示提示框',
				example: `kernel.alert('this is an alert box.');`
			},
			'confirm(text:String, callback:Function):void': {
				desc: '显示需确认的提示框',
				example: `kernel.confirm('is this a confirm box?', function(sure){
console.log(sure);
});`
			},
			'htmlDialog(html:String|HTMLElement, className?:String, callback?:Function):void': {
				desc: '显示自定义内容的对话框',
				example: ``
			},
			'closeDialog():void': {
				desc: '关闭当前对话框, 一般不需要手动调用'
			},
			'showLoading(text?:String):void': {
				title: 'showLoading(text?:String):void',
				desc: '显示加载中界面, 这个方法包含一个引用计数, 每次调用会+1，所以此方法必须和hideLoading成对使用',
				example: `kernel.showLoading();
console.log(kernel.isLoading());
setTimeout(kernel.hideLoading, 1000);
kernel.listeners.add(kernel.dialogEvents, 'loaded', loaded);
function loaded(evt){
kernel.listeners.remove(this, evt.type, loaded);
console.log(kernel.isLoading());
}`
			},
			'hideLoading():void': {
				desc: '使showLoading的引用计数-1, 当到达0时才会关闭加载中界面, 并触发dialogEvents.onloaded事件',
				example: `kernel.showLoading();
console.log(kernel.isLoading());
setTimeout(kernel.hideLoading, 1000);
kernel.listeners.add(kernel.dialogEvents, 'loaded', loaded);
function loaded(evt){
kernel.listeners.remove(this, evt.type, loaded);
console.log(kernel.isLoading());
}`
			},
			'isLoading():Boolean': {
				desc: '判断加载中界面是否在显示',
				example: `kernel.showLoading();
console.log(kernel.isLoading());
setTimeout(kernel.hideLoading, 1000);
kernel.listeners.add(kernel.dialogEvents, 'loaded', loaded);
function loaded(evt){
kernel.listeners.remove(this, evt.type, loaded);
console.log(kernel.isLoading());
}`
			},
			'hint(text:String, t?:Number):void': {
				desc: '显示简易文本提示',
				example: `kernel.hint('文本提示');`
			},
			'init(home:String, icos:Array):void': {
				desc: '启动路由或者修改默认页及导航按钮, 需要示例请查看site/index/index中的代码'
			},
			'reloadPage(id?:String, silent?:Boolean):void': {
				desc: '重新加载当前页',
				example: `kernel.reloadPage();`
			},
			'destoryPage(id?:String):void': {
				desc: '销毁制定页面, 会触发页面的ondestory事件, 无法销毁当前页'
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
			'pageEvents.onroutend': {
				desc: '页面路由开始后页面资源加载成功后触发'
			}
		}
	}
});
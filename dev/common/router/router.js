/*  router.js 0.1
 *  页面路由功能实现
 *  调用方法:
 *  var router=require('path/to/router');
 *  router.init(pages,defaultpage);
 *
 *  pages: 页面定义的Object对象
 *  defaultpage: 首页id
 */

'use strict';
define(function() {
	var pages, home, myhistory,
		router = {
			init: function(pgs, homeId) {
				// 如果没有初始化就进行
				if (!this.location) {
					pages = pgs;
					home = homeId;
					// 当前URL
					this.location = this.getLocation(location.hash);
					// 最后的 URL
					this.lastLocation = {
						id: undefined,
						args: {}
					};
					// 看是否有 routerHistory
					myhistory = window.sessionStorage ? sessionStorage.getItem('routerHistory') : null;
					if (myhistory === null) {
						myhistory = {};
					} else {
						myhistory = JSON.parse(myhistory);
					}
					// 解析 myhistory
					for (var n in myhistory) {
						if (n in pages) {
							pages[n].backArgs = myhistory[n];
						}
					}

					// 通知页面hash变化
					if ('onhashchange' in window) {
						window.addEventListener('hashchange', hashchange, false);
					} else {
						var lastHash = location.hash;
						setInterval(function() {
							if (location.hash !== lastHash) {
								lastHash = location.hash;
								hashchange();
							}
						}, 100);
					}
				}
			},
			// hash 字符串 变成 loaction 对象
			getLocation: function(hash) {
				// id 对应 pages 中的 页面;
				// 如果 id 不存在; 返回到 home 页面;
				// 如果 id 存在; args 有误, 会跳到id 指定页面
				var i, a, o = {
					id: home,
					args: {}
				};
				var s = hash.match(/[^=&]+(=[^&]*)?/g);
				if (s) {
					if (s[0].indexOf('#!') === 0) {
						a = s[0].substr(2);
						if (a in pages) {
							o.id = a;
						}
					}
					for (i = 1; i < s.length; i++) {
						a = s[i].match(/^([^=]+)(?:=(.+))?$/);
						if (a) {
							o.args[a[1]] = a[2];
						}
					}
				}
				return o;
			},
			// location 对象 变成 hash 字符串; backbutton 时候需要用到
			buildHash: function(loc) {
				var n, hash = '#!' + loc.id;
				for (n in loc.args) {
					hash += loc.args[n] === undefined ? '&' + n : '&' + n + '=' + loc.args[n];
				}
				return hash;
			},
			// 后退行为
			getDefaultBack: function(loc) {
				var i, o, bk, a;
				if (!loc) {
					loc = this.location;
				}
				o = pages[loc.id];
				if (o) {
					if (o.back) {
						a = o.back;
					} else if (loc.id !== home) {
						a = home;
					}
					if (a && pages[a]) {
						if (o.backArgs instanceof Object) {
							bk = {
								id: a,
								args: o.backArgs
							};
						} else {
							bk = {
								id: a,
								args: {}
							};
							if (pages[a].args) {
								for (i = 0; i < pages[a].args.length; i++) {
									if (pages[a].args[i] in loc.args) {
										bk.args[pages[a].args[i]] = loc.args[pages[a].args[i]];
									}
								}
							}
						}
					}
				}
				return bk;
			},
			// 比较两个 location对象; 看 url 是否改变;
			// 比较 key 和 args
			isSameLocation: function(loc1, loc2) {
				var n;
				if (loc1.id === loc2.id && Object.keys(loc1.args).length === Object.keys(loc2.args).length) {
					for (n in loc1.args) {
						if (!(n in loc2.args) || loc1.args[n] !== loc2.args[n]) {
							return false;
						}
					}
					return true;
				} else {
					return false;
				}
			},
			// 判断是否是后退
			isGoingback: function(from, to) {
				if (to === home) {
					return true;
				} else {
					while (from !== home) {
						if (from === to) {
							break;
						} else {
							from = pages[from].back || home;
						}
					}
					return from !== home;
				}
			}
		};
	return router;

	function hashchange() {
		var newLocation = router.getLocation(location.hash);
		// 如果url 发生改变 就执行
		if (!router.isSameLocation(newLocation, router.location)) {
			router.lastLocation = router.location;
			router.location = newLocation;
			// 如果是前进操作
			if ((pages[router.location.id].back && router.lastLocation.id === pages[router.location.id].back) || (!pages[router.location.id].back && router.lastLocation.id === home)) {
				// 把上一页赋值给他的后退页
				myhistory[router.location.id] = pages[router.location.id].backArgs = router.lastLocation.args;
				// 记录到 sessionStorage
				window.sessionStorage && sessionStorage.setItem('routerHistory', JSON.stringify(myhistory));
			} // 如果是 后退操作
			else if (pages[router.lastLocation.id].backArgs && router.location.id === pages[router.lastLocation.id].back) {
				// 剔除最后一次 back 对象
				delete pages[router.lastLocation.id].backArgs;
				delete myhistory[router.lastLocation.id];
				window.sessionStorage && sessionStorage.setItem('routerHistory', JSON.stringify(myhistory));
			}
			// router onchange 的时候 发送通知
			if (typeof router.onchange === 'function') {
				router.onchange({
					type: 'change'
				});
			}
		}
	}
});
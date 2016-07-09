'use strict';
define(['common/touchslider/touchslider', 'common/pointerevents/pointerevents', 'common/svgicos/svgicos', 'site/pages/pages', 'site/popups/popups'], function(touchslider, pointerevents, svgicos, pages, popups) {
	var homePage, kernel = {
		// 加入css 到head中;
		// 如果是生产环境; 加入 css
		// 如果是开发环境 加入less
		appendCss: function(url) { //自动根据当前环境添加css或less
			var csslnk = document.createElement('link');
			if (/\.less$/.test(url)) {
				if (typeof less === 'object') {
					csslnk.rel = 'stylesheet/less';
					csslnk.href = url;
					less.sheets.push(csslnk);
					less.refresh();
				} else {
					csslnk.rel = 'stylesheet';
					csslnk.href = url.replace(/less$/, 'css');
				}
			} else {
				csslnk.rel = 'stylesheet';
				csslnk.href = url;
			}
			document.head.appendChild(csslnk);
		},
		// 创建 svg dom;
		makeSvg: function(name, square) {
			var svgns = 'http://www.w3.org/2000/svg';
			var svg = document.createElementNS(svgns, 'svg');
			svg.appendChild(document.createElementNS(svgns, 'path')).setAttribute('transform', 'scale(1,-1)');
			if (name) {
				kernel.setSvgPath(svg, name, square);
			}
			return svg;
		},
		// 设置svg 内容
		setSvgPath: function(svg, name, square) {
		    var box, tmp = kernel.makeSvg();
			tmp.style.position = 'absolute';
			tmp.style.bottom = tmp.style.right = '100%';
			tmp.firstChild.setAttribute('d', svgicos[name]);
			document.body.appendChild(tmp);
		    box = tmp.firstChild.getBBox();
			document.body.removeChild(tmp);
			if (square) {
			    if (box.width > box.height) {
			        box.y -= (box.width - box.height) / 2;
			        box.height = box.width;
			    } else {
			        box.x -= (box.height - box.width) / 2;
			        box.width = box.height;
			    }
			}
		    svg.firstChild.setAttribute('d', svgicos[name]);
		    svg.setAttribute('viewBox', box.x + ' ' + (-box.y - box.height) + ' ' + box.width + ' ' + box.height);
		},
		extendIn: function(o, e, p) {
			for (var i = 0; i < p.length; i++) {
				if (p[i] in e) {
					o[p[i]] = e[p[i]];
				}
			}
		},
		buildHash: function(loc) {
			var n, hash = '#!' + encodeURIComponent(loc.id);
			for (n in loc.args) {
				hash += loc.args[n] === undefined ? '&' + encodeURIComponent(n) : '&' + encodeURIComponent(n) + '=' + encodeURIComponent(loc.args[n]);
			}
			return hash;
		},
		parseHash: function(hash) {
			var i, a, s, nl = {
				id: homePage,
				args: {}
			};
			hash = hash.substr(1).replace(/[#\?].*$/, '');
			s = hash.match(/[^=&]+(=[^&]*)?/g);
			if (s) {
				if (s[0].charAt(0) === '!') {
					a = s[0].substr(1);
					if (a in pages) {
						nl.id = decodeURIComponent(a);
					}
				}
				for (i = 1; i < s.length; i++) {
					a = s[i].match(/^([^=]+)(=)?(.+)?$/);
					if (a) {
						nl.args[decodeURIComponent(a[1])] = a[2] ? decodeURIComponent(a[3] || '') : undefined;
					}
				}
			}
			return nl;
		},
		// 后退行为
		getDefaultBack: function(loc) {
			var i, o, bk, a;
			if (!loc) {
				loc = kernel.location;
			}
			o = pages[loc.id];
			if (o) {
				if (o.back) {
					a = o.back;
				} else if (loc.id !== homePage) {
					a = homePage;
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
			if (to === homePage) {
				return true;
			} else {
				while (from !== homePage) {
					if (from === to) {
						break;
					} else {
						from = pages[from].back || homePage;
					}
				}
				return from !== homePage;
			}
		},
		clone: function(d) {
			var result;
			var s;
			if (d instanceof Date) {
				result = new Date(d.valueOf());
			} else if (d instanceof RegExp) {
				s = '';
				if (d.ignoreCase) {
					s += 'i';
				}
				if (d.multiline) {
					s += 'm';
				}
				if (d.global) {
					s += 'g';
				}
				result = RegExp(d.source.RegEncode(), s);
			} else if (d instanceof Error) {
				s = d.message ? d.message : '';
				if (d instanceof RangeError) {
					result = RangeError(s);
				} else if (d instanceof ReferenceError) {
					result = ReferenceError(s);
				} else if (d instanceof SyntaxError) {
					result = SyntaxError(s);
				} else if (d instanceof TypeError) {
					result = TypeError(s);
				} else if (d instanceof URIError) {
					result = URIError(s);
				} else {
					result = Error(s);
				}
			} else if (d instanceof Array) {
				result = [];
				for (s = 0; s < d.length; s++) {
					result[s] = kernel.clone(d[s]);
				}
			} else if (d instanceof Object) {
				result = {};
				for (s in d) {
					result[s] = kernel.clone(d[s]);
				}
			} else {
				result = d;
			}
			return result;
		},
		isEqual: function(o1, o2) {
			var t = Object.prototype.toString.call(o1),
				n;
			if (t === Object.prototype.toString.call(o2)) {
				if (t === '[object Object]') {
					if (Object.keys(o1).length === Object.keys(o2).length) {
						for (n in o1) {
							if (!(n in o2) || !kernel.isEqual(o1[n], o2[n])) {
								return false;
							}
						}
						return true;
					} else {
						return false;
					}
				} else if (t === '[object Array]') {
					if (o1.length === o2.length) {
						for (n = 0; n < o1.length; n++) {
							if (!kernel.isEqual(o1[n], o2[n])) {
								return false;
							}
						}
						return true;
					} else {
						return false;
					}
				} else if (t === '[object String]' || t === '[object Number]' || t === '[object Undefined]' || t === '[object Null]') {
					return o1 === o2;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},
		cancelEvent: function(evt) {
			evt.preventDefault();
		},
		stopEvent: function(evt) {
			evt.stopPropagation();
		}
	};

	! function() {
		kernel.listeners = {
			add: function(o, e, f) {
				if (!o.xEvents) {
					o.xEvents = function(evt) { //override internal event manager
						xEventProcessor(o, evt);
					};
				}
				if (!o.xEvents[e]) {
					o.xEvents[e] = [];
					o.xEvents[e].stack = [];
					o.xEvents[e].locked = false;
					//if (o.addEventListener) {
					//	o.addEventListener(e, o.xEvents, false);
					//} else if (o.attachEvent) {
					//	o.attachEvent('on' + e, o.xEvents);
					//} else {
						o['on' + e] = o.xEvents;
					//}
				}
				if (o.xEvents[e].locked) {
					o.xEvents[e].stack.push([false, f]);
				} else {
					if (o.xEvents[e].indexOf(f) < 0) {
						o.xEvents[e].push(f);
					}
				}
			},
			list: function(o, e) {
				var r, n;
				if (e) {
					if (o.xEvents && o.xEvents[e]) {
						r = o.xEvents[e].slice(0);
					} else {
						r = [];
					}
				} else {
					r = {};
					if (o.xEvents) {
						for (n in o.xEvents) {
							if (o.xEvents[n] instanceof Array && o.xEvents[n].length > 0) {
								r[n] = o.xEvents[n].slice(0);
							}
						}
					}
				}
				return r;
			},
			remove: function(o, e, f) {
				var n, addRemoveMark;
				if (o.xEvents) {
					if (e) {
						if (o.xEvents[e]) {
							if (o.xEvents[e].locked) {
								if (f) {
									o.xEvents[e].stack.push([true, f]);
								} else {
									o.xEvents[e].stack.push(null);
								}
							} else {
								if (f) {
									var tmp = o.xEvents[e].indexOf(f);
									if (tmp !== -1) {
										o.xEvents[e].splice(tmp, 1);
									}
								} else {
									o.xEvents[e].splice(0, o.xEvents[e].length);
								}
							}
							if (o.xEvents[e].length === 0) {
								delete o.xEvents[e];
								//if (o.removeEventListener) {
								//	o.removeEventListener(e, o.xEvents, false);
								//} else if (o.detachEvent) {
								//	o.detachEvent('on' + e, o.xEvents);
								//} else {
									o['on' + e] = null;
								//}
							}
						}
					} else {
						if (!o.xEvents.removeMark) {
							for (n in o.xEvents) {
								if (!o.xEvents[n].locked) {
									delete o.xEvents[n];
									//if (o.removeEventListener) {
									//	o.removeEventListener(n, o.xEvents, false);
									//} else if (o.detachEvent) {
									//	o.detachEvent('on' + n, o.xEvents);
									//} else {
										o['on' + n] = null;
									//}
								} else {
									addRemoveMark = true;
								}
							}
							if (addRemoveMark) {
								o.xEvents.removeMark = true;
							} else {
								o.xEvents = null;
							}
						}
					}
				}
			}
		};

		function xEventProcessor(o, evt) {
			o.xEvents[evt.type].locked = true;
			for (var i = 0; i < o.xEvents[evt.type].length; i++) {
				o.xEvents[evt.type][i].call(o, evt);
			}
			o.xEvents[evt.type].locked = false;
			while (o.xEvents[evt.type].stack.length > 0) {
				if (o.xEvents[evt.type].stack[0]) {
					var tmp = o.xEvents[evt.type].indexOf(o.xEvents[evt.type].stack[0][1]);
					if (o.xEvents[evt.type].stack[0][0]) {
						if (tmp !== -1) {
							o.xEvents[evt.type].splice(tmp, 1);
						}
					} else {
						if (tmp === -1) {
							o.xEvents[evt.type].push(o.xEvents[evt.type].stack[0][1]);
						}
					}
				} else {
					o.xEvents[evt.type].splice(0, o.xEvents[evt.type].length);
				}
				o.xEvents[evt.type].stack.shift();
			}
			if (o.xEvents[evt.type].length === 0) {
				delete o.xEvents[evt.type];
				//if (o.removeEventListener) {
				//	o.removeEventListener(evt.type, o.xEvents, false);
				//} else if (o.detachEvent) {
				//	o.detachEvent('on' + evt.type, o.xEvents);
				//} else {
					o['on' + evt.type] = null;
				//}
			}
			if (o.xEvents.removeMark) {
				delete o.xEvents.removeMark;
				for (var n in o.xEvents) {
					delete o.xEvents[n];
					//if (o.removeEventListener) {
					//	o.removeEventListener(n, o.xEvents, false);
					//} else if (o.detachEvent) {
					//	o.detachEvent('on' + n, o.xEvents);
					//} else {
						o['on' + n] = null;
					//}
				}
				o.xEvents = null;
			}
		}
	}();

	! function() {
		kernel.names = {};
		if ('animation' in document.documentElement.style) {
			kernel.names.aniEvt = 'animationend';
			kernel.names.aniStyle = 'animation';
		} else {
			kernel.names.aniEvt = 'webkitAnimationEnd';
			kernel.names.aniStyle = 'webkitAnimation';
		}
		if ('transition' in document.documentElement.style) {
			kernel.names.transEvt = 'transitionend';
			kernel.names.transStyle = 'transition';
		} else {
			kernel.names.transEvt = 'webkitTransitionEnd';
			kernel.names.transStyle = 'webkitTransition';
		}
		if ('transform' in document.documentElement.style) {
			kernel.names.transform = 'transform';
		} else {
			kernel.names.transform = 'webkitTransform';
		}
	}();

	! function() {
		kernel.scrollReload = function(dom, func) {
			kernel.fixIosScrolling(dom);
			var y, st, reloadHint, scrolled;
			var events = pointerevents(dom, function(evt) {
				if (evt.type === 'start') {
					if (events.pointers.length === 0 && ((dom.classList.contains('iosScrollFix') && dom.scrollTop === 1) || (!dom.classList.contains('iosScrollFix') && dom.scrollTop === 0))) {
						y = evt.y;
						window.addEventListener('scroll', scrolling, true);
						return true;
					}
				} else {
					if (scrolled) {
						scrolled = false;
						return true;
					} else {
						var h;
						if (evt.y > y + 5) {
							if (!st) {
								st = true;
								end();
							}
							evt.domEvent.preventDefault();
							if (!reloadHint) {
								reloadHint = document.createElement('div');
								reloadHint.className = 'reloadHint';
								reloadHint.appendChild(kernel.makeSvg('refresh'));
								dom.appendChild(reloadHint);
							}
							h = reloadHint.offsetHeight || reloadHint.clientHeight;
							if (evt.y - y < h * 2) {
								reloadHint.style.top = evt.y - y - h + 'px';
								reloadHint.classList.remove('pin');
								reloadHint.style.opacity = (evt.y - y) / h / 2;
								reloadHint.style[kernel.names.transform] = 'rotate(' + 360 * reloadHint.style.opacity + 'deg)';
							} else {
								reloadHint.style.top = h + 'px';
								reloadHint.style.opacity = 1;
								reloadHint.classList.add('pin');
								reloadHint.style[kernel.names.transform] = '';
							}
						} else {
							if (evt.y < y && !st) {
								return true;
							} else if (reloadHint) {
								dom.removeChild(reloadHint);
								reloadHint = undefined;
							}
						}
						if (evt.type === 'end' || evt.type === 'cancel') {
							if (reloadHint) {
								dom.removeChild(reloadHint);
								if (reloadHint.classList.contains('pin')) {
									if (typeof func === 'function') {
										func();
									} else {
										kernel.reloadPage();
									}
								}
								reloadHint = undefined;
							}
							st = false;
						}
					}
				}
				function scrolling(evt){
					if (evt.target !== dom) {
						scrolled = true;
						end();
					}
				}
				function end(){
					window.removeEventListener('scroll', scrolling, true);
				}
			});
		};
		//fix ios overscrolling on viewport issue
		//stupid ios designer
		kernel.fixIosScrolling = function(o) {
			var s;
			if (browser.name === 'IOS') {
				o.classList.add('iosScrollFix');
				if (getComputedStyle(o).display == 'none') {
					s = o.style.display;
					o.style.display = 'block';
					o.scrollTop = 1;
					o.style.display = s;
				} else {
					o.scrollTop = 1;
				}
				o.addEventListener('scroll', onscroll, false);
			}
		};

		kernel.getScrollHeight = function(o) {
			return o.classList.contains('iosScrollFix') ? o.scrollHeight - 1 : o.scrollHeight;
		};

		if (browser.name === 'IOS') {
			window.addEventListener('touchmove', function(evt) {
				var t = evt.target;
				while (t != document.body) {
					if (t.classList.contains('iosScrollFix') || t.classList.contains('hScroll')) {
						return;
					}
					t = t.parentNode;
				}
				evt.preventDefault();
			}, false);
		}

		//禁止各种scroll
		window.addEventListener('scroll', noscroll, false);
		document.documentElement.addEventListener('scroll', noscroll, false);
		document.body.addEventListener('scroll', noscroll, false);
		document.getElementById('page').addEventListener('scroll', noscroll, false);
		document.getElementById('popup').addEventListener('scroll', noscroll, false);

		function onscroll(evt) {
			if (this.scrollTop === 0) {
				this.scrollTop = 1;
			} else if (this.scrollTop + this.clientHeight === this.scrollHeight) {
				this.scrollTop -= 1;
			}
		}

		// 重置scroll
		function noscroll(evt) {
			if (evt.target === this) {
				if (this.scrollTo) {
					this.scrollTo(0, 0);
				} else {
					this.scrollLeft = this.scrollTop = 0;
				}
			}
		}
	}();

	! function() {
		var helper = document.getElementById('helper'),
			tb = helper.firstChild,
			img = helper.lastChild,
			allSteps;
		helper.addEventListener('click', function(evt) {
			if (allSteps.length > 1) {
				allSteps.shift();
				setStep(allSteps[0]);
			} else {
				helper.style.display = '';
			}
		}, false);
		kernel.showHelper = function(steps) {
			if (steps instanceof Array) {
				allSteps = steps;
			} else {
				allSteps = [steps];
			}
			setStep(allSteps[0]);
			helper.style.display = 'block';
		};

		function setStep(step) {
			var tmp, tmp1, i;
			img.src = step.img;
			if ('right' in step) {
				img.style.right = step.right;
			}
			if ('left' in step) {
				img.style.left = step.left;
			}
			if ('top' in step) {
				img.style.top = step.top;
			}
			if ('bottom' in step) {
				img.style.bottom = step.bottom;
			}
			if ('width' in step) {
				img.style.width = step.width;
			}
			if ('height' in step) {
				img.style.height = step.height;
			}
			for (i = 0; i < tb.childNodes.length; i++) {
				tmp = tb.childNodes[i];
				if (step.rows[i]) {
					tmp.style.height = step.rows[i];
					tmp.className = 'unflexable';
				} else {
					tmp.style.height = 'auto';
					tmp.className = 'flexable';
				}
			}
			tmp = tb.childNodes[1];
			for (i = 0; i < tmp.childNodes.length; i++) {
				tmp1 = tmp.childNodes[i];
				if (step.cells[i]) {
					tmp1.style.width = step.cells[i];
					tmp1.className = 'unflexable';
				} else {
					tmp1.style.width = 'auto';
					tmp1.className = 'flexable';
				}
			}
		}
	}();

	//弹出窗口
	! function() {
		var activePopup, tempBack, animating, todo,
			popupsBox = document.getElementById('popup'),
			popupClose = popupsBox.querySelector(':scope>.header>.close'),
			title = popupsBox.querySelector(':scope>.header>.title').firstChild,
			back = popupsBox.querySelector(':scope>.header>.back');

		// 如果弹窗有自定义打开方式则直接调用该接口，否则会调用showPopup
		// 如果定义了open请确保最终打开自己时调用的是showPopup而不是openPopup
		kernel.openPopup = function(id, param) {
			var popupcfg = popups[id];
			if (popupcfg) {
				initLoad(popupcfg, id, false, function() {
					if (typeof popupcfg.open === 'function') {
						popupcfg.open(param);
					} else {
						kernel.showPopup(id, param);
					}
				});
			} else {
				kernel.hint('popup config not found: ' + id);
			}
		};
		// 普通弹窗
		kernel.showPopup = function(id, param) { //显示弹出窗口
			if (animating) {
				todo = function() {
					kernel.showPopup(id, param);
				};
			} else {
				var toshow;
				// 有 .in 表示正在显示中
				// 如果没有 in class 就需要打开
				if (!popupsBox.classList.contains('in')) {
					if (switchCanceled(id, param)) {
						return true;
					} else {
						toshow = popupsBox.querySelector(':scope>.content>.' + id);
						toshow.style.right = 0;
						toshow.style.visibility = 'visible';
						popupsBox.classList.add('in');
						animating = id;
						if (typeof kernel.popupEvents.onshow === 'function') {
							kernel.popupEvents.onshow({
								type: 'show',
								id: id
							});
						}
						popupSwitched(id);
						kernel.hideReadable();
					}
				} else if (activePopup !== id) {
					return switchToPopup(id, param);
				} else {
					if (typeof popups[id].onload !== 'function' || !popups[id].onload(param)) {
						if (typeof popups[id].onloadend === 'function') {
							popups[id].onloadend();
						}
					}
				}
			}
		};
		//关闭弹窗, 如果未指定id则会关闭任何弹窗否则只有当前弹窗匹配id时才关闭
		kernel.closePopup = function(id) {
			var p;
			if (animating) {
				todo = function() {
					kernel.closePopup(id);
				};
			} else {
				p = kernel.getCurrentPopup();
				if (p && (!id || p === id || (id instanceof Array && id.indexOf(p) >= 0))) {
					//onunload 返回 true可以阻止窗口关闭
					if (typeof popups[p].onunload !== 'function' || !popups[p].onunload()) {
						popupsBox.classList.remove('in');
						popupsBox.classList.add('out');
						animating = true;
						delete popups[p].backParam;
						if (typeof kernel.popupEvents.onhide === 'function') {
							kernel.popupEvents.onhide({
								type: 'hide',
								id: p
							});
						}
					}
				}
			}
		};
		// 获取当前显示的 popup id
		kernel.getCurrentPopup = function() {
			if (popupsBox.classList.contains('in')) {
				return activePopup;
			}
		};
		// 设置点击返回按钮时要传递到该窗口的参数, 不能在loadend之前使用
		kernel.setPopupBackParam = function(param) {
			if (popupsBox.classList.contains('in')) {
				popups[activePopup].backParam = param;
			}
		};
		// 如果未指定id则临时改变当前弹窗的后退位置, 临时修改不能在loadend之前使用
		// 参数1 需要返回的页面id
		// 参数2 如果提供; 就会永久修改 指定页面的 后退页面ID
		kernel.setPopupBack = function(backid, id) {
			if (id) {
				if (id in popups) {
					if (backid) {
						popups[id].back = backid;
						if (activePopup === id) {
							back.lastChild.data = popups[backid].title;
						}
					} else {
						delete popups[id].back;
						back.style.visibility = 'hidden';
					}
				}
			} else {
				if (popupsBox.classList.contains('in')) {
					if (backid) {
						back.lastChild.data = popups[backid].title;
						tempBack = backid;
						back.style.visibility = '';
					} else {
						back.style.visibility = 'hidden';
					}
				}
			}
		};
		// 如果未指定id则临时改变当前弹窗的标题, 临时修改不能在loadend之前使用
		kernel.setPopupTitle = function(newTitle, id) {
			if (id) {
				if (id in popups) {
					popups[id].title = newTitle;
					if (activePopup === id) {
						title.data = newTitle;
					}
				}
			} else {
				if (popupsBox.classList.contains('in')) {
					title.data = newTitle;
				}
			}
		};
		// 包含onshow, onshowend, onhide, onhideend
		kernel.popupEvents = {};
		// 初始化窗口关闭按钮
		popupClose.appendChild(kernel.makeSvg('close'));
		popupClose.addEventListener('click', function() {
			kernel.closePopup()
		}, false);
		// 初始化窗口返回按钮
		back.insertBefore(kernel.makeSvg('chevron-left'), back.firstChild);
		back.addEventListener('click', function(evt) {
			kernel.openPopup(tempBack ? tempBack : popups[activePopup].back, popups[activePopup].backParam);
		}, false);
		popupsBox.addEventListener(kernel.names.aniEvt, function(evt) {
			var tohide;
			if (evt.target === this) {
				animating = false;
				if (this.classList.contains('out')) {
					this.classList.remove('out');
					if (typeof kernel.popupEvents.onhideend === 'function') {
						kernel.popupEvents.onhideend({
							type: 'hideend',
							id: activePopup
						});
					}
					tohide = popupsBox.querySelector(':scope>.content>.' + activePopup);
					tohide.style.right = tohide.style.visibility = '';
					if (typeof popups[activePopup].onunloadend === 'function') {
						popups[activePopup].onunloadend();
					}
					activePopup = undefined;
				} else {
					if (typeof popups[activePopup].onloadend === 'function') {
						popups[activePopup].onloadend();
					}
					if (typeof kernel.popupEvents.onshowend === 'function') {
						kernel.popupEvents.onshowend({
							type: 'showend',
							id: activePopup
						});
					}
				}
				if (typeof todo === 'function') {
					var tmp = todo;
					todo = undefined;
					tmp();
				}
			}
		}, false);

		function switchCanceled(id, param) {
			//onunload 或 onload 返回 true 可以阻止停止事件
			return (activePopup && typeof popups[activePopup].onunload === 'function' && popups[activePopup].onunload()) || (typeof popups[id].onload === 'function' && popups[id].onload(param));
		}
		// 弹窗显示后要执行的工作
		function popupSwitched(id) {
			// activePopup 上一个显示的窗口;
			// 只有在弹窗切换的时候 会有 activePopup
			if (activePopup) {
				popupsBox.classList.remove(activePopup);
				// 删除上一个窗体的数据
				delete popups[activePopup].backParam;
			}
			tempBack = undefined;
			activePopup = id;
			popupsBox.classList.add(activePopup);
			// 给 title 节点设值
			title.data = popups[id].title;
			if (popups[id].back) {
				back.lastChild.data = popups[popups[id].back].title;
				back.style.visibility = 'visible';
			} else {
				back.style.visibility = 'hidden';
			}
		}

		function switchToPopup(id, param) {
			var oldPopup = activePopup;
			if (switchCanceled(id, param)) {
				return true;
			} else {
				panelSwitch(popupsBox.querySelector(':scope>.content>.' + id), popupsBox.querySelector(':scope>.content>.' + activePopup), id === popups[activePopup].back || id === tempBack, function() {
					var tmp;
					animating = false;
					popupSwitched(id);
					if (typeof popups[oldPopup].onunloadend === 'function') {
						popups[oldPopup].onunloadend();
					}
					if (typeof popups[activePopup].onloadend === 'function') {
						popups[activePopup].onloadend();
					}
					if (typeof todo === 'function') {
						tmp = todo;
						todo = undefined;
						tmp();
					}
				});
				animating = id;
			}
		}
	}();
	// 内置特殊弹窗, 会显示在普通弹窗之上, 并且彼此独立
	! function() {
		var readableBox = document.getElementById('readable'),
			readableClose = document.querySelector('#readable>.close'),
			readableContent = document.querySelector('#readable>.content'),
			raCallback;

		kernel.fixIosScrolling(readableContent);
		kernel.showReadable = function(html, callback) { //展示静态内容
			if (typeof html === 'string') {
				readableContent.innerHTML = html;
			} else {
				readableContent.appendChild(html);
			}
			readableBox.className = 'in';
			raCallback = callback;
		};
		kernel.hideReadable = function() {
			if (readableBox.className === 'in') {
				readableBox.className = 'out';
				if (typeof raCallback === 'function') {
					raCallback();
				}
			}
		};
		kernel.isReadableShowing = function() {
			return readableBox.className === 'in';
		};
		kernel.showForeign = function(url, callback) { //展示站外内容
			kernel.showReadable('<iframe frameborder="0" frameborder="no" scrolling="auto" sandbox="allow-same-origin allow-forms allow-scripts" style="position:absolute;width:100%;height:100%;" src="' + url + '"></iframe>', callback);
		};
		// clearPopup 会检查有那些窗口正在显示, 并自动将其全部关闭, 其它关闭窗口的方法都不执行检查
		kernel.clearPopup = function() {
			if (kernel.isReadableShowing()) {
				kernel.hideReadable();
			}
			kernel.closePopup();
		};
		readableClose.appendChild(kernel.makeSvg('close'));
		readableClose.addEventListener('click', kernel.hideReadable, false);
		readableBox.addEventListener(kernel.names.aniEvt, function(evt) {
			if (evt.target === this && this.classList.contains('out')) {
				while (readableContent.childNodes.length > 0) {
					readableContent.removeChild(readableContent.firstChild);
				}
				this.className = '';
			}
		}, false);
	}();
	//对话框及提示功能
	! function() {
		var hintmo, callback,
			loadingRT = 0,
			dlgStack = [],
			loadingCtn = document.getElementById('loading'),
			hintCtn = document.getElementById('hint'),
			dialogCtn = document.getElementById('dialog'),
			dialogBox = dialogCtn.querySelector('div'),
			dialogContent = dialogBox.querySelector('.content'),
			dialogClose = dialogBox.querySelector('.close'),
			photoViewCtn = document.getElementById('photoView'),
			photoViewClose = photoViewCtn.querySelector('.close'),
			photoSlider = touchslider(photoViewCtn.querySelector('.content'));

		kernel.showPhotoView = function(photos, idx) {
			var i, tmp;
			for (i = 0; i < photos.length; i++) {
				tmp = document.createElement('div');
				tmp.style.backgroundImage = 'url(' + photos[i] + ')';
				tmp.className = 'item';
				photoSlider.add(tmp);
			}
			if (idx) {
				photoSlider.slideTo(idx, true);
			} else {
				if (photoSlider.children.length > 1) {
					photoSlider.onchange();
				}
			}
			document.getElementById('photoView').style.visibility = 'visible';
			document.body.classList.add('mask');
		};
		kernel.hidePhotoView = function() {
			while (photoSlider.children.length) {
				photoSlider.remove(0);
			}
		};
		kernel.alert = function(text, callback) { //alert对话框
			openDialog('alert', text, callback);
		};
		kernel.confirm = function(text, callback) { //yes no对话框
			openDialog('confirm', text, callback);
		};
		kernel.htmlDialog = function(html, callback) { //自定义内容的对话框
			openDialog('htmlDialog', html, callback);
		};
		kernel.closeDialog = function(param) { //通用对话框关闭方法
			var a;
			window.removeEventListener('resize', syncDialogSize, false);
			dialogCtn.style.visibility = '';
			unmask();
			if (typeof callback === 'function') {
				callback(param);
			}
			while (dialogContent.childNodes.length) {
				dialogContent.removeChild(dialogContent.lastChild);
			}
			callback = undefined;
			if (dlgStack.length) {
				a = dlgStack.shift();
				kernel[a.shift()].apply(kernel, a);
			}
		};
		kernel.showLoading = function(text) { //loading提示框, 每次调用引用计数＋1所以showLoading和hideLoading必须成对使用
			loadingCtn.querySelector('div').lastChild.data = text ? text : '加载中...';
			if (loadingRT === 0) {
				loadingCtn.style.visibility = 'visible';
				document.body.classList.add('mask');
			}
			loadingRT++;
		};
		kernel.hideLoading = function() {
			if (loadingRT > 0) {
				loadingRT--;
				if (loadingRT === 0) {
					loadingCtn.style.visibility = '';
					unmask();
					if (typeof kernel.dialogEvents.onloaded === 'function') {
						kernel.dialogEvents.onloaded({
							type: 'loaded'
						});
					}
				}
			}
		};
		kernel.isLoading = function() {
			return loadingRT > 0;
		};
		kernel.hint = function(text, t) { //底部提示, 不干扰用户操作, 默认显示5秒
			document.querySelector('#hint>.text').firstChild.data = text;
			if (hintmo) {
				clearTimeout(hintmo);
			} else {
				hintCtn.style.opacity = 1;
			}
			hintmo = setTimeout(function() {
				hintCtn.style.opacity = '';
				hintmo = undefined;
			}, t ? t : 5000);
		};
		//目前只有loaded事件
		kernel.dialogEvents = {};

		photoSlider.onchange = function() {
			var i, txt;
			if (this.children.length > 0) {
				txt = '';
				if (this.children.length > 1) {
					for (i = 0; i < this.children.length; i++) {
						txt += (i === this.current) ? '●' : '○';
					}
				}
				document.querySelector('#photoView>.nav').firstChild.data = txt;
			} else {
				photoViewCtn.style.visibility = '';
				unmask();
			}
		};
		dialogClose.appendChild(kernel.makeSvg('close'));
		dialogClose.addEventListener('click', kernel.closeDialog, false);
		dialogBox.querySelector('.yes').addEventListener('click', kernel.closeDialog, false);
		dialogBox.querySelector('.no').addEventListener('click', function() {
			kernel.closeDialog();
		}, false);
		photoViewClose.appendChild(dialogClose.firstChild.cloneNode(true));
		photoViewClose.addEventListener('click', kernel.hidePhotoView, false);

		function unmask() {
			if (hintCtn.style.visibility === '' && dialogCtn.style.visibility === '' && loadingCtn.style.visibility === '' && photoViewCtn.style.visibility === '') {
				document.body.classList.remove('mask');
			}
		}

		function openDialog(type, content, cb) {
			if (dialogCtn.style.visibility === 'visible') {
				dlgStack.push([type, content, cb]);
			} else {
				dialogBox.className = type;
				if (type === 'htmlDialog') {
					if (typeof content === 'string') {
						dialogContent.innerHTML = content;
					} else {
						dialogContent.appendChild(content);
					}
				} else {
					dialogContent.textContent = content;
				}
				window.addEventListener('resize', syncDialogSize, false);
				syncDialogSize();
				document.body.classList.add('mask');
				dialogCtn.style.visibility = 'visible';
				callback = cb;
			}
		}

		function syncDialogSize() {
			dialogBox.style.width = dialogBox.style.height = '';
			dialogBox.style.bottom = dialogBox.style.right = 'auto';
			dialogBox.style.width = dialogBox.offsetWidth + 'px';
			dialogBox.style.height = dialogBox.offsetHeight + 'px';
			dialogBox.style.bottom = dialogBox.style.right = '';
		}
	}();

	//页面加载相关功能
	! function() {
		//此处不能使用kernel.lastLocation.id, 因为currentpage仅在页面加载成功才会更新
		//而kernel.lastLocation.id在页面加载前就已经更新, 无法确保成功加载
		var routerHistory, currentpage, animating, todo, locCallback, navIcos, navs,
			pagesBox = document.getElementById('page'),
			backbtn = pagesBox.querySelector(':scope>.header>.back'),
			headerLeftMenuBtn = pagesBox.querySelector(':scope>.header>.leftMenuBtn'),
			headerRightMenuBtn = pagesBox.querySelector(':scope>.header>.rightMenuBtn');
		//if private browsing is enabled, Safari will throw a stupid exception when calling setItem from sessionStorage or localStorage. the fallowing code can avoid this.
		try {
			sessionStorage.setItem(0, 0);
			sessionStorage.removeItem(0);
		} catch (e) {
			Storage.prototype.setItem = function(){};
		}
		//icos是导航菜单的列表
		//home是默认页
		//callback是每次路由变化时要执行的回调
		kernel.init = function(home, icos, callback) {
			var n, navCtn = pagesBox.querySelector(':scope>.navMenu');
			// 如果没有初始化就进行
			if (!kernel.location) {
				homePage = home;
				navIcos = icos;
				locCallback = callback;
				// 当前URL
				kernel.location = kernel.parseHash(location.hash);
				// 如果带这个参数 就 隐藏头尾
				if (kernel.location.args.ui === 'clean') {
					document.body.classList.add('clean');
				}
				// 最后的 URL
				kernel.lastLocation = {
					id: undefined,
					args: {}
				};
				// 看是否有 kernelHistory
				routerHistory = sessionStorage.getItem('routerHistory');
				routerHistory = routerHistory ? JSON.parse(routerHistory) : {};
				// 解析 routerHistory
				for (n in routerHistory) {
					if (n in pages) {
						pages[n].backArgs = routerHistory[n];
					}
				}
				window.addEventListener('hashchange', hashchange, false);
				navs = {};
				while(navCtn.childNodes.length){
					navCtn.removeChild(navCtn.childNodes[0]);
				}
				for (n in navIcos) {
					if (n in pages) {
						navs[n] = navCtn.appendChild(document.createElement('a'));
						navs[n].href = '#!' + n;
						if (RegExp('^' + n + '(?:-|$)').test(kernel.location.id)) {
							navs[n].className = 'selected';
							navs[n].appendChild(kernel.makeSvg(typeof navIcos[n] === 'object' ? navIcos[n].selected : navIcos[n], true));
						} else {
							navs[n].appendChild(kernel.makeSvg(typeof navIcos[n] === 'object' ? navIcos[n].normal : navIcos[n], true));
						}
						navs[n].appendChild(document.createTextNode(pages[n].title));
					}
				}
				//禁止各种 long tap 菜单
				//ios 中需使用样式 -webkit-touch-callout: none;
				window.addEventListener('contextmenu', browser.name === 'Firefox' ? kernel.stopEvent : kernel.cancelEvent, false);
				window.addEventListener('dragstart', kernel.cancelEvent, false);
				document.body.classList.remove('loading');
				manageLocation();
				if ('autopopup' in kernel.location.args) {
					kernel.openPopup(kernel.location.args.autopopup, kernel.location.args.autopopuparg ? JSON.parse(kernel.location.args.autopopuparg) : undefined);
				}
			}
		};

		//刷新当前页
		kernel.reloadPage = function() {
			var thislocation;
			// 是否有数据正在加载
			if (kernel.isLoading()) {
				thislocation = kernel.location;
				// 注册监听 ; loaded
				kernel.listeners.add(kernel.dialogEvents, 'loaded', listener);
			} else {
				reloadPage();
			}

			function listener(evt) {
				kernel.listeners.remove(this, evt.type, listener);
				// url 是否改变
				if (kernel.isSameLocation(thislocation, kernel.location)) {
					reloadPage();
				}
			}
		};

		backbtn.insertBefore(kernel.makeSvg('chevron-left'), backbtn.firstChild);
		headerRightMenuBtn.addEventListener('click', function(evt) {
			if (typeof pages[currentpage].onrightmenuclick === 'function') {
				pages[currentpage].onrightmenuclick();
			}
		}, false);
		headerLeftMenuBtn.addEventListener('click', function(evt) {
			if (typeof pages[currentpage].onleftmenuclick === 'function') {
				pages[currentpage].onleftmenuclick();
			}
		}, false);

		function manageLocation() {
			var n, m, pageid = kernel.location.id,
				pagecfg = pages[pageid];
			if (kernel.lastLocation.id) {
				n = pageid.replace(/-.*$/, '');
				m = kernel.lastLocation.id.replace(/-.*$/, '');
				if (n !== m) {
					if (n in navs) {
						navs[n].className = 'selected';
						if (typeof navIcos[n] === 'object') {
							kernel.setSvgPath(navs[n].firstChild, navIcos[n].selected, true);
						}
					}
					if (m in navs) {
						navs[m].className = '';
						if (typeof navIcos[m] === 'object') {
							kernel.setSvgPath(navs[m].firstChild, navIcos[m].normal, true);
						}
					}
				}
				kernel.clearPopup();
			}
			if (typeof locCallback === 'function') {
				locCallback();
			}
			initLoad(pagecfg, pageid, true, function(firstLoad) {
				if (animating) {
					todo = true;
				} else {
					var toshow, ctn, oldpageid, page, goingback,
						pageid = kernel.location.id;

					// 只有返回或未发生转向时允许页面缓存
					if (pageid !== currentpage) {
						page = document.getElementById('page');
						// 重置 class
						page.classList.add(pageid);
						// 重置 title
						pagesBox.querySelector(':scope>.header>.title').firstChild.data = pages[pageid].title;
						// 重置 顶部按钮
						while (headerRightMenuBtn.childNodes.length) {
							headerRightMenuBtn.removeChild(headerRightMenuBtn.firstChild);
						}
						while (headerLeftMenuBtn.childNodes.length) {
							headerLeftMenuBtn.removeChild(headerLeftMenuBtn.firstChild);
						}
						// init 顶部按钮事件 和 元素
						// 如果没有 就隐藏
						if (pages[pageid].onrightmenuclick) {
							if (typeof pages[pageid].onrightmenuclick === 'function') {
								headerRightMenuBtn.href = 'javascript:;';
							} else {
								headerRightMenuBtn.href = pages[pageid].onrightmenuclick;
							}
							if (pages[pageid].rightMenuDomContent) {
								headerRightMenuBtn.appendChild(pages[pageid].rightMenuDomContent);
							}
							headerRightMenuBtn.style.display = '';
						} else {
							headerRightMenuBtn.style.display = 'none';
						}
						if (pages[pageid].onleftmenuclick) {
							if (typeof pages[pageid].onleftmenuclick === 'function') {
								headerLeftMenuBtn.href = 'javascript:;';
							} else {
								headerLeftMenuBtn.href = pages[pageid].onleftmenuclick;
							}
							if (pages[pageid].leftMenuDomContent) {
								headerLeftMenuBtn.appendChild(pages[pageid].leftMenuDomContent);
							}
							headerLeftMenuBtn.style.display = '';
							backbtn.style.display = 'none';
						} else {
							headerLeftMenuBtn.style.display = 'none';
						}
						// 设置 返回按钮URL
						setBackButton(kernel.getDefaultBack());
						toshow = pagesBox.querySelector(':scope>.content>.' + pageid);

						// 如果有 上一个pageID; 就动画切换
						// 如果没有 就直接显示
						if (currentpage) {
							page.classList.remove(currentpage);
							oldpageid = currentpage;
							currentpage = pageid;
							// kernel 判断是否是 返回操作; 处理不一样的动画
							goingback = kernel.isGoingback(oldpageid, pageid);
							animating = true;
							// panelSwitch 动画
							panelSwitch(toshow, pagesBox.querySelector(':scope>.content>.' + oldpageid), goingback, function() {
								animating = false;
								// 切换完成后 就执行 对呀的方法;
								if (typeof pages[oldpageid].onunloadend === 'function') {
									// 如果是回退 就不强制刷新
									pages[oldpageid].onunloadend(!goingback);
								}
								// 当前页的加载
								if (typeof pages[pageid].onloadend === 'function') {
									pages[pageid].onloadend(!goingback);
								}
								if (todo) {
									todo = false;
									//toshow可能已被隐藏
									toshow.style.visibility = 'visible';
									manageLocation();
								}
							});

							// 加载页面的时候

							// 触发上一个页面的卸载事件
							if (typeof pages[oldpageid].onunload === 'function') {
								pages[oldpageid].onunload();
							}
							// 触发当前页面的加载事件
							if (typeof pages[pageid].onload === 'function') {
								pages[pageid].onload(!goingback || firstLoad);
							}
						} else { //初次加载不显示动画
							currentpage = pageid; // 记录当前显示中的页面
							toshow.style.right = 0;
							toshow.style.visibility = 'visible';
							noSwitchLoad(true); // 触发当前页的 加载事件
						}
					} else { //未发生转向, 但url有变化
						// 相当于 刷新界面 或者是 改变了参数
						// 不需要动画
						noSwitchLoad(); //直接触发页面事件 onload
					}
				}
			});
		}

		function reloadPage() {
			kernel.clearPopup();
			if (typeof pages[currentpage].onunload === 'function') {
				pages[currentpage].onunload(true);
			}
			if (typeof pages[currentpage].onunloadend === 'function') {
				pages[currentpage].onunloadend(true);
			}
			if (typeof pages[currentpage].onload === 'function') {
				pages[currentpage].onload(true);
			}
			if (typeof pages[currentpage].onloadend === 'function') {
				pages[currentpage].onloadend(true);
			}
		}

		function noSwitchLoad(force) {
			if (typeof pages[currentpage].onload === 'function') {
				pages[currentpage].onload(force);
			}
			if (typeof pages[currentpage].onloadend === 'function') {
				pages[currentpage].onloadend();
			}
		}

		function setBackButton(loc) {
			if (loc && loc.id) {
				var txt = pages[loc.id].title;
				if (!txt) {
					txt = '返回';
				}
				backbtn.lastChild.data = txt;
				backbtn.href = kernel.buildHash(loc);
				backbtn.style.display = '';
			} else {
				backbtn.href = '#!';
				backbtn.style.display = 'none';
			}
		}
		function hashchange() {
			var newLocation = kernel.parseHash(location.hash);
			// 如果url 发生改变 就执行
			if (!kernel.isSameLocation(newLocation, kernel.location)) {
				kernel.lastLocation = kernel.location;
				kernel.location = newLocation;
				// 如果是前进操作
				if ((pages[kernel.location.id].back && kernel.lastLocation.id === pages[kernel.location.id].back) || (!pages[kernel.location.id].back && kernel.lastLocation.id === homePage)) {
					// 把上一页赋值给他的后退页
					routerHistory[kernel.location.id] = pages[kernel.location.id].backArgs = kernel.lastLocation.args;
					// 记录到 sessionStorage
					sessionStorage.setItem('kernelHistory', JSON.stringify(routerHistory));
				} // 如果是 后退操作
				else if (pages[kernel.lastLocation.id].backArgs && kernel.location.id === pages[kernel.lastLocation.id].back) {
					// 剔除最后一次 back 对象
					delete pages[kernel.lastLocation.id].backArgs;
					delete routerHistory[kernel.lastLocation.id];
					sessionStorage.setItem('kernelHistory', JSON.stringify(routerHistory));
				}
				// kernel onchange 的时候 发送通知
				manageLocation();
			}
		}
	}();

	return kernel;

	function initLoad(oldcfg, id, isPage, callback) {
		var ctn, family, exts, n, m, url, xhr;
		if (oldcfg.loaded === 2) {
			callback();
		} else if (oldcfg.loaded !== 1) {
			oldcfg.loaded = 1;
			if (isPage) {
				ctn = document.getElementById('page');
				family = 'page';
				exts = ['onload', 'onloadend', 'onunload', 'onunloadend', 'onrightmenuclick', 'onleftmenuclick', 'rightMenuDomContent', 'leftMenuDomContent'];
			} else {
				ctn = document.getElementById('popup');
				family = 'popup';
				exts = ['onload', 'onloadend', 'onunload', 'onunloadend', 'open'];
			}
			n = family + '/' + id + '/';
			m = require.toUrl(n);
			if ('css' in oldcfg) {
				kernel.appendCss(m + oldcfg.css);
				delete oldcfg.css;
			}
			if ('html' in oldcfg) {
				kernel.showLoading();
				url = m + oldcfg.html;
				xhr = new XMLHttpRequest();
				xhr.open('get', url, true);
				xhr.onreadystatechange = function() {
					if (this.readyState === 4) {
						if (this.status === 200) {
							delete oldcfg.html;
							loadJs(this.responseText);
						} else {
							oldcfg.loaded = 0;
							if (require.data.debug || this.status !== 404) {
								errorOccurs(url, this.status, isPage);
							} else {
								updated(isPage);
							}
						}
						kernel.hideLoading();
					}
				};
				xhr.send('');
			} else {
				loadJs('');
			}
		}

		function loadJs(html) {
			var js;
			ctn.querySelector(':scope>.content').insertAdjacentHTML('beforeEnd', '<div class="' + id + '">' + html + '</div>');
			addPanelAnimationListener(ctn.querySelector(':scope>.content>.' + id));
			if ('js' in oldcfg) {
				kernel.showLoading();
				js = n + oldcfg.js;
				if (require.data.debug) {
					require([js], required);
				} else {
					require([js], required, function(error) {
						oldcfg.loaded = 0;
						if ((error.requireType && error.requireType !== 'scripterror' && error.requireType !== 'nodefine') || (error.xhr && error.xhr.status !== 404)) {
							require.undef(js);
							errorOccurs(js, error.message, isPage);
						} else {
							updated(isPage);
						}
						kernel.hideLoading();
					});
				}
			} else {
				oldcfg.loaded = 2;
				callback(true);
			}
		}

		function required(cfg) {
			delete oldcfg.js;
			if (cfg) {
				kernel.extendIn(oldcfg, cfg, exts);
			}
			oldcfg.loaded = 2;
			callback(true);
			kernel.hideLoading();
		}
	}

	function errorOccurs(res, msg, isPage) {
		kernel.alert('加载' + res + '时发生了一个错误: ' + msg, isPage ? function() {
			history.back();
		} : undefined);
	}

	function updated(isPage) {
		if (isPage) {
			location.reload();
		} else {
			kernel.confirm('网站已经更新, 使用该功能需要先重新加载. 是否立即刷新本页?', function(sure) {
				if (sure) {
					location.reload();
				}
			});
		}
	}
	//启动左右滑动的动画
	function panelSwitch(toshow, tohide, goingback, callback) {
		toshow.style.visibility = 'visible';
		if (goingback) {
			tohide.classList.add('panelTransR1');
			toshow.classList.add('panelTransR2');
		} else {
			tohide.classList.add('panelTransL1');
			toshow.classList.add('panelTransL2');
		}
		if (typeof callback === 'function') {
			addPanelAnimationListener(toshow, listener);
		}

		function listener(evt) {
			this.removeEventListener(evt.type, listener, false);
			callback();
		}
	}
	//对需要左右滑动的panel需要添加一个事件监听
	function addPanelAnimationListener(emt, listener) {
		if (typeof listener !== 'function') {
			listener = panelAnimationEnd;
		}
		emt.addEventListener(kernel.names.aniEvt, listener, false);
	}
	//左右滑动的动画完成后要执行的操作
	function panelAnimationEnd(evt) {
		if (evt.target === this) { //ios中this的子节点也会触发该事件
			if (this.className.match(/ panelTrans[LR]1/)) {
				this.style.right = this.style.visibility = '';
			} else {
				this.style.right = 0;
			}
			this.className = this.className.replace(/ panelTrans[LR][12]/, '');
		}
	}
});
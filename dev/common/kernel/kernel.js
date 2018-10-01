'use strict';
define(['common/touchslider/touchslider', 'common/touchguesture/touchguesture', 'common/pointerevents/pointerevents', 'common/svgicos/svgicos', 'site/pages/pages', 'site/popups/popups', './lang'], function (touchslider, touchguesture, pointerevents, svgicos, pages, popups, lang) {
	let homePage,
		activities = document.body.querySelector('#activities'),
		kernel = {
			// 加入css 到head中;
			// 如果是生产环境; 加入 css
			// 如果是开发环境 加入less
			appendCss: function (url) { //自动根据当前环境添加css或less
				let csslnk = document.createElement('link');
				if (/\.less$/.test(url)) {
					if (self.less) {
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
				return document.head.appendChild(csslnk);
			},
			removeCss: function (lnk) {
				lnk.remove();
				if (lnk.rel === 'stylesheet/less') {
					less.sheets.splice(less.sheets.indexOf(lnk), 1);
					less.refresh();
				}
				return lnk.getAttribute('href');
			},
			// 创建 svg dom;
			makeSvg: function (name, type) {
				let svgns = 'http://www.w3.org/2000/svg',
					svg = document.createElementNS(svgns, 'svg');
				svg.appendChild(document.createElementNS(svgns, 'path'));
				if (name) {
					kernel.setSvgPath(svg, name, type);
				}
				return svg;
			},
			// 设置svg 内容
			setSvgPath: function (svg, name, type) {
				let tmp = kernel.makeSvg();
				if (svgicos.hasOwnProperty(name)) {
					name = svgicos[name];
				}
				svg.firstChild.setAttribute('d', name);
				tmp.style.position = 'absolute';
				tmp.style.bottom = tmp.style.right = '100%';
				tmp.firstChild.setAttribute('d', name);
				document.body.appendChild(tmp);
				let box = tmp.firstChild.getBBox();
				tmp.remove();
				if (type == 2) {
					box.width += box.x * 2;
					box.x = 0;
					box.height += box.y * 2;
					box.y = 0;
				} else if (type) {
					if (box.width > box.height) {
						box.y -= (box.width - box.height) / 2;
						box.height = box.width;
					} else {
						box.x -= (box.height - box.width) / 2;
						box.width = box.height;
					}
				}
				svg.setAttribute('viewBox', box.x + ' ' + box.y + ' ' + box.width + ' ' + box.height);
			},
			parseHash: function (hash) {
				let nl = {
					id: homePage,
					args: {}
				};
				hash = hash.substr(1).replace(/[#?].*$/, '');
				let s = hash.match(/[^=&]+(=[^&]*)?/g);
				if (s && s[0].charAt(0) === '!') {
					let a = decodeURIComponent(s[0].substr(1));
					if (pages.hasOwnProperty(a)) {
						nl.id = a;
					}
					for (let i = 1; i < s.length; i++) {
						a = s[i].match(/^([^=]+)(=)?(.+)?$/);
						if (a) {
							nl.args[decodeURIComponent(a[1])] = a[2] ? decodeURIComponent(a[3] || '') : undefined;
						}
					}
				}
				return nl;
			},
			// 后退行为
			getDefaultBack: function (loc) {
				if (!loc) {
					loc = kernel.location;
				}
				let bk2, bk1 = pages[loc.id].backLoc;
				if (pages[loc.id].back && pages[pages[loc.id].back]) {
					bk2 = {
						id: pages[loc.id].back,
						args: {}
					};
					let o = pages[pages[loc.id].back].alias ? pages[pages[pages[loc.id].back].alias] : pages[pages[loc.id].back];
					if (o.args) {
						for (let i = 0; i < o.args.length; i++) {
							if (loc.args.hasOwnProperty(o.args[i])) {
								bk2.args[o.args[i]] = loc.args[o.args[i]];
							}
						}
					}
				}
				if (bk1 && bk2) {
					for (let i in bk2.args) {
						if (bk2.args[i] !== bk1.args[i]) {
							return bk2;
						}
					}
					return bk1;
				} else {
					return bk1 || bk2;
				}
			},
			// 判断是否是后退
			isGoingback: function (from, to) {
				let f = from;
				if (f !== to) {
					if (to === homePage || (f.length > to.length + 1 && f.substr(0, to.length + 1) === to + '-')) {
						return true;
					} else {
						while (pages[f].back) {
							f = pages[f].back;
							if (f === to) {
								return true;
							}
						}
						f = from.split('-');
						let t = to.split('-'),
							j = Math.min(f.length, t.length),
							i;
						while (i < j && f[i] === t[i]) {
							i++;
						}
						if (i < Math.max(f.length, t.length) - 1) {
							if (i < f.length - 1) {
								f.splice(i + 1);
							}
							if (i < t.length - 1) {
								t.splice(i + 1);
							}
							return kernel.isGoingback(f.join('-'), t.join('-'));
						}
					}
				}
			},
			replaceLocation: function (loc) {
				if (kernel.location && kernel.isSameLocation(loc, kernel.location)) {
					kernel.reloadPage();
				} else {
					location.replace(kernel.buildHash(loc));
				}
			}
		};

	if (self.frameElement && frameElement.kernel) {
		if (self.Reflect) {
			Reflect.setPrototypeOf(kernel, frameElement.kernel);
		} else {
			kernel.__proto__ = frameElement.kernel;
		}
	} else {
		//杂项功能
		! function () {
			kernel.buildHash = function (loc) {
				let hash = '#!' + encodeURIComponent(loc.id);
				for (let n in loc.args) {
					hash += loc.args[n] === undefined ? '&' + encodeURIComponent(n) : '&' + encodeURIComponent(n) + '=' + encodeURIComponent(loc.args[n]);
				}
				return hash;
			};
			// 比较两个 location对象; 看 url 是否改变;
			// 比较 key 和 args
			kernel.isSameLocation = function (loc1, loc2) {
				if (loc1.id === loc2.id && Object.keys(loc1.args).length === Object.keys(loc2.args).length) {
					for (let n in loc1.args) {
						if (loc2.args.hasOwnProperty(n)) {
							if (loc1.args[n] === undefined) {
								if (loc1.args[n] !== loc2.args[n]) {
									return false;
								}
							} else {
								if ('' + loc1.args[n] !== '' + loc2.args[n]) {
									return false;
								}
							}
						} else {
							return false;
						}
					}
					return true;
				} else {
					return false;
				}
			};
			kernel.dataType = function (a) {
				let t = typeof a;
				if (['boolean', 'string', 'symbol', 'number', 'bigint', 'function', 'undefined'].indexOf(t) < 0) {
					t = Object.prototype.toString.call(a).replace(/^\[object |\]$/g, '').toLowerCase();
					if (['date', 'array', 'regexp', 'error', 'null'].indexOf(t) < 0) {
						return 'object';
					} else {
						return t;
					}
				} else {
					return t;
				}
			};
			kernel.getLang = function (langs) {
				for (let i = 0; i < navigator.languages.length; i++) {
					if (langs.hasOwnProperty(navigator.languages[i])) {
						return langs[navigator.languages[i]];
					}
				}
				return langs.en;
			};
		}();
		! function () {
			let t = document.head.querySelector('meta[name=viewport]'),
				s = t.content,
				minWidth, wait;
			kernel.setAutoScale = function (v) {
				minWidth = v;
				if (minWidth > 0) {
					self.dispatchEvent(new Event('resize'));
				} else {
					t.content = s;
				}
			};
			self.addEventListener('resize', self.visualViewport ? function () {
				if (minWidth > 0) {
					t.content = 'user-scalable=no, width=' + calcWidth(Math.round(visualViewport.width * visualViewport.scale), Math.round(visualViewport.height * visualViewport.scale));
				}
			} : function () {
				if (minWidth > 0) {
					if (browser.name === 'IOS') {
						if (t.content === s) {
							t.content = 'user-scalable=no, width=' + calcWidth(innerWidth, innerHeight);
						} else {
							let w = innerWidth,
								h = innerHeight,
								rsz = function () {
									if (innerWidth === w && innerHeight === h) {
										requestAnimationFrame(rsz);
									} else {
										t.content = 'user-scalable=no, width=' + calcWidth(innerWidth, innerHeight);
									}
								};
							t.content = s;
							rsz();
						}
					} else {
						if (wait) {
							wait = false;
						} else {
							if (t.content !== s) {
								wait = true
								t.content = s;
							}
							let width = calcWidth(innerWidth, innerHeight);
							if (width !== innerWidth) {
								wait = true;
								t.content = 'user-scalable=no, width=' + width;
							}
						}
					}
				}
			});

			function calcWidth(width, height) {
				let sw = Math.min(width, height),
					r = sw / minWidth;
				if (r > 1) {
					r = Math.sqrt(r);
				}
				return Math.round(width / r);
			}
		}();
		//事件处理
		! function () {
			kernel.listeners = {
				add: function (o, e, f) {
					let result = 0;
					if (!o.hasOwnProperty('xEvents')) {
						o.xEvents = {};
					}
					if (!o.xEvents.hasOwnProperty(e)) {
						o.xEvents[e] = {
							stack: [],
							heap: [],
							locked: false
						};
						o['on' + e] = xEventProcessor;
					}
					if (o.xEvents[e].locked) {
						o.xEvents[e].stack.push([f]);
						result = 2;
					} else if (o.xEvents[e].heap.indexOf(f) < 0) {
						o.xEvents[e].heap.push(f);
						result = 1;
					}
					return result;
				},
				list: function (o, e) {
					let result;
					if (e) {
						result = o.hasOwnProperty('xEvents') && o.xEvents.hasOwnProperty(e) ? o.xEvents[e].heap.slice(0) : [];
					} else {
						result = {};
						if (o.hasOwnProperty('xEvents')) {
							for (let i in o.xEvents) {
								result[i] = o.xEvents[i].heap.slice(0);
							}
						}
					}
					return result;
				},
				remove: function (o, e, f) {
					let result = 0;
					if (o.hasOwnProperty('xEvents')) {
						if (e) {
							if (o.xEvents.hasOwnProperty(e)) {
								if (o.xEvents[e].locked) {
									o.xEvents[e].stack.push(f);
									result = 2;
								} else if (f) {
									let i = o.xEvents[e].heap.indexOf(f);
									if (i >= 0) {
										o.xEvents[e].heap.splice(i, 1);
										cleanup(o, e);
										result = 1;
									}
								} else {
									cleanup(o, e, true);
									result = 1;
								}
							}
						} else {
							for (let i in o.xEvents) {
								if (o.xEvents[i].locked) {
									o.xEvents[i].stack.push(undefined);
									result = 2;
								} else {
									cleanup(o, i, true);
								}
							}
							if (!result) {
								result = 1;
							}
						}
					}
					return result;
				}
			};

			function xEventProcessor(evt) {
				this.xEvents[evt.type].locked = true;
				for (let i = 0; i < this.xEvents[evt.type].heap.length; i++) {
					this.xEvents[evt.type].heap[i].call(this, evt);
				}
				this.xEvents[evt.type].locked = false;
				while (this.xEvents[evt.type].stack.length) {
					if (this.xEvents[evt.type].stack[0]) {
						if (typeof this.xEvents[evt.type].stack[0] === 'function') {
							let i = this.xEvents[evt.type].heap.indexOf(this.xEvents[evt.type].stack[0]);
							if (i >= 0) {
								this.xEvents[evt.type].heap.splice(i, 1);
							}
						} else if (this.xEvents[evt.type].heap.indexOf(this.xEvents[evt.type].stack[0][0]) < 0) {
							this.xEvents[evt.type].heap.push(this.xEvents[evt.type].stack[0][0]);
						}
					} else {
						this.xEvents[evt.type].heap.splice(0);
					}
					this.xEvents[evt.type].stack.shift();
				}
				cleanup(this, evt.type);
			}

			function cleanup(o, e, force) {
				if (force || !o.xEvents[e].heap.length) {
					delete o.xEvents[e];
					o['on' + e] = null;
				}
			}
		}();

		! function () {
			kernel.scrollReload = function (dom, func) {
				let y, st, reloadHint, scrolled,
					kernel = this,
					events = pointerevents(dom, function (evt) {
						let h;
						if (evt.type === 'start') {
							if (events.pointers.length === 0 && kernel.getScrollTop(dom) === 0) {
								y = evt.y;
								evt.domEvent.view.addEventListener('scroll', scrolling, true);
								return true;
							}
						} else {
							if (scrolled) {
								scrolled = false;
								return true;
							} else {
								if (evt.y > y + 5) {
									if (!st) {
										st = true;
										evt.domEvent.view.removeEventListener('scroll', scrolling, true);
									}
									evt.domEvent.preventDefault();
									if (!reloadHint) {
										reloadHint = evt.domEvent.view.document.createElement('div');
										reloadHint.className = 'reloadHint';
										reloadHint.appendChild(kernel.makeSvg('sync-alt-solid', 1));
										dom.appendChild(reloadHint);
									}
									h = reloadHint.offsetHeight || reloadHint.clientHeight;
									if (evt.y - y < h * 2) {
										reloadHint.style.top = evt.y - y - h + 'px';
										reloadHint.classList.remove('pin');
										reloadHint.style.opacity = (evt.y - y) / h / 2;
										reloadHint.style.transform = 'rotate(' + 360 * reloadHint.style.opacity + 'deg)';
									} else {
										reloadHint.style.top = h + 'px';
										reloadHint.style.opacity = 1;
										reloadHint.classList.add('pin');
										reloadHint.style.transform = '';
									}
								} else {
									if (evt.y < y && !st) {
										return true;
									} else if (reloadHint) {
										reloadHint.remove();
										reloadHint = undefined;
									}
								}
								if (evt.type === 'end' || evt.type === 'cancel') {
									if (reloadHint) {
										reloadHint.remove();
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
					});
				kernel.fixIosScrolling(dom);

				function scrolling(evt) {
					if (evt.target !== dom) {
						scrolled = true;
						this.removeEventListener('scroll', scrolling, true);
					}
				}
			};

			//fix ios vertical overscrolling on viewport issue
			kernel.fixIosScrolling = function (o, hscroll) {
				if (browser.name === 'IOS') {
					o.style.webkitOverflowScrolling = 'touch';
					o.addEventListener('touchmove', stopEvent, {
						passive: false
					});
					if (!hscroll) {
						o.classList.add('iosScrollFix');
						o.scrollTop = 1;
						o.addEventListener('scroll', onscroll);
					}
				}
			};

			kernel.getScrollTop = function (o) {
				return o.classList.contains('iosScrollFix') ? o.scrollTop - 1 : o.scrollTop;
			};

			kernel.getScrollHeight = function (o) {
				return o.classList.contains('iosScrollFix') ? o.scrollHeight - 2 : o.scrollHeight;
			};

			kernel.setScrollTop = function (o, v) {
				o.scrollTop = o.classList.contains('iosScrollFix') ? v + 1 : v;
			};

			function onscroll(evt) {
				if (this.scrollTop === 0) {
					this.scrollTop = 1;
				} else if (this.scrollTop + this.clientHeight === this.scrollHeight) {
					this.scrollTop -= 1;
				}
			}
		}();

		! function () {
			let helper = document.body.querySelector('#helper'),
				tb = helper.firstChild,
				img = helper.lastChild,
				allSteps;
			helper.addEventListener('click', nextStep);
			kernel.showHelper = function (steps) {
				if (kernel.dataType(steps) === 'array') {
					allSteps = steps;
				} else {
					allSteps = [steps];
				}
				setStep(allSteps[0]);
				helper.style.display = 'block';
			};

			function nextStep() {
				if (allSteps.length > 1) {
					allSteps.shift();
					if (typeof allSteps[0] === 'function') {
						allSteps[0]();
						nextStep();
					} else {
						setStep(allSteps[0]);
					}
				} else {
					helper.style.display = '';
				}
			}

			function setStep(step) {
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
				for (let i = 0; i < tb.childNodes.length; i++) {
					let tmp = tb.childNodes[i];
					if (step.rows[i]) {
						tmp.style.height = step.rows[i];
						tmp.className = 'unflexable';
					} else {
						tmp.style.height = 'auto';
						tmp.className = 'flexable';
					}
				}
				for (let i = 0; i < tb.childNodes[1].childNodes.length; i++) {
					let tmp1 = tb.childNodes[1].childNodes[i];
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
		! function () {
			let activePopup, tempBack, tempBackParam, animating, todo,
				popupsBox = document.body.querySelector('#popup'),
				popupClose = popupsBox.querySelector(':scope>.header>.close'),
				title = popupsBox.querySelector(':scope>.header>.title').firstChild,
				back = popupsBox.querySelector(':scope>.header>.back');

			// 如果弹窗有自定义打开方式则直接调用该接口，否则会调用showPopup
			// 如果定义了open请确保最终打开自己时调用的是showPopup而不是openPopup
			kernel.openPopup = function (id, param, goBack) {
				if (popups.hasOwnProperty(id)) {
					initLoad(false, id, function () {
						if (typeof popups[id].open === 'function') {
							popups[id].open(param, activePopup && goBack);
						} else {
							kernel.showPopup(id, goBack);
						}
					});
					return true;
				}
			};
			// 普通弹窗
			kernel.showPopup = function (id, goBack) { //显示弹出窗口
				let result = 0;
				if (popups[id].status > 1) {
					if (animating) {
						todo = kernel.showPopup.bind(this, id, goBack);
						result = 2;
					} else if (!activePopup) {
						popups[id].status++;
						if (typeof popups[id].onload === 'fucntion') {
							popups[id].onload();
						}
						let toshow = popupsBox.querySelector(':scope>.content>.' + id);
						toshow.style.left = 0;
						toshow.style.visibility = 'inherit';
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
						result = 1;
					} else if (activePopup === id) {
						if (typeof popups[id].onload !== 'function') {
							popups[id].onload();
						}
						if (typeof popups[id].onloadend === 'function') {
							popups[id].onloadend();
						}
						result = 1;
					} else if (typeof popups[activePopup].onunload !== 'function' || !popups[activePopup].onunload()) { //onunload 返回 true 可以阻止弹窗切换
						let tohide = popupsBox.querySelector(':scope>.content>.' + activePopup);
						popups[activePopup].status--;
						popups[id].status++;
						if (typeof popups[id].onload === 'function') {
							popups[id].onload(goBack);
						}
						panelSwitch(popupsBox.querySelector(':scope>.content>.' + id), tohide, goBack, function () {
							let oldPopup = activePopup;
							animating = false;
							popupSwitched(id);
							if (typeof popups[oldPopup].onunloadend === 'function') {
								popups[oldPopup].onunloadend();
							}
							popups[oldPopup].status--;
							if (popups[oldPopup].autoDestroy) {
								destroy(popups[oldPopup], 'popup', oldPopup);
							} else if (document.activeElement && tohide.contains(document.activeElement)) {
								document.activeElement.blur();
							}
							if (typeof popups[activePopup].onloadend === 'function') {
								popups[activePopup].onloadend(goBack);
							}
							popups[id].status++;
							if (typeof todo === 'function') {
								let tmp = todo;
								todo = undefined;
								tmp();
							}
						});
						animating = id;
						result = 1;
					}
				}
				return result;
			};
			//关闭弹窗, 如果未指定id则会关闭任何弹窗否则只有当前弹窗匹配id时才关闭
			kernel.closePopup = function (id) {
				let result = 0;
				if (animating) {
					todo = kernel.closePopup.bind(this, id);
					result = 2;
				} else if (activePopup && (!id || activePopup === id || (kernel.dataType(id) === 'array' && id.indexOf(activePopup) >= 0)) && (typeof popups[activePopup].onunload !== 'function' || !popups[activePopup].onunload())) { //onunload 返回 true可以阻止窗口关闭
					popups[activePopup].status--;
					popupsBox.classList.remove('in');
					popupsBox.classList.add('out');
					animating = true;
					if (typeof kernel.popupEvents.onhide === 'function') {
						kernel.popupEvents.onhide({
							type: 'hide',
							id: activePopup
						});
					}
					result = 1;
				}
				return result;
			};
			// 获取当前显示的 popup id
			kernel.getCurrentPopup = function () {
				return activePopup;
			};
			// 如果未指定id则临时改变当前弹窗的后退位置, 临时修改不能在loadend之前使用
			// 参数1 需要返回的页面id
			// 参数2 如果提供; 就会永久修改 指定页面的 后退页面ID
			kernel.setPopupBack = function (backid, param) {
				if (popupsBox.classList.contains('in')) {
					if (backid) {
						back.lastChild.data = typeof backid === 'function' || !popups[backid].title ? lang.back : popups[backid].title;
						tempBack = backid;
						back.style.display = '';
						tempBackParam = param;
					} else {
						back.style.display = 'none';
					}
				}
			};
			// 如果未指定id则临时改变当前弹窗的标题, 临时修改不能在loadend之前使用
			kernel.setPopupTitle = function (newTitle, id) {
				if (id) {
					if (popups.hasOwnProperty(id)) {
						popups[id].title = newTitle;
						if (activePopup === id) {
							title.data = newTitle;
							if (activities.classList.contains('hidePopupHeader')) {
								document.title = title.data;
							}
						}
					}
				} else {
					if (popupsBox.classList.contains('in')) {
						title.data = newTitle;
						if (activities.classList.contains('hidePopupHeader')) {
							document.title = title.data;
						}
					}
				}
			};
			kernel.destroyPopup = function (id) {
				if (popups[id].status === 2) {
					destroy(popups[id], 'popup', id);
					return true;
				}
			};
			// 包含onshow, onshowend, onhide, onhideend
			kernel.popupEvents = {};
			// 初始化窗口关闭按钮
			popupClose.appendChild(kernel.makeSvg('times-light', 1));
			popupClose.addEventListener('click', function () {
				kernel.closePopup()
			});
			// 初始化窗口返回按钮
			back.insertBefore(kernel.makeSvg('angle-left-light', 1), back.firstChild);
			back.addEventListener('click', function (evt) {
				if (typeof tempBack === 'function') {
					tempBack(tempBackParam);
				} else {
					kernel.openPopup(tempBack, tempBackParam, true);
				}
			});
			popupsBox.addEventListener('animationend', function (evt) {
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
						let tohide = popupsBox.querySelector(':scope>.content>.' + activePopup);
						tohide.style.left = tohide.style.visibility = '';
						if (typeof popups[activePopup].onunloadend === 'function') {
							popups[activePopup].onunloadend();
						}
						popups[activePopup].status--;
						if (popups[activePopup].autoDestroy) {
							destroy(popups[activePopup], 'popup', activePopup);
						} else if (document.activeElement && tohide.contains(document.activeElement)) {
							document.activeElement.blur();
						}
						popupsBox.classList.remove(activePopup);
						activePopup = undefined;
					} else {
						if (typeof popups[activePopup].onloadend === 'function') {
							popups[activePopup].onloadend();
						}
						popups[activePopup].status++;
						if (typeof kernel.popupEvents.onshowend === 'function') {
							kernel.popupEvents.onshowend({
								type: 'showend',
								id: activePopup
							});
						}
					}
					if (typeof todo === 'function') {
						let tmp = todo;
						todo = undefined;
						tmp();
					}
				}
			});

			// 弹窗显示后要执行的工作
			function popupSwitched(id) {
				// activePopup 上一个显示的窗口;
				// 只有在弹窗切换的时候 会有 activePopup
				if (activePopup) {
					popupsBox.classList.remove(activePopup);
				}
				tempBack = tempBackParam = undefined;
				activePopup = id;
				popupsBox.classList.add(activePopup);
				// 给 title 节点设值
				title.data = popups[id].title;
				if (activities.classList.contains('hidePopupHeader')) {
					document.title = title.data;
				}
				back.style.display = 'none';
			}
		}();
		// 内置特殊弹窗, 会显示在普通弹窗之上, 并且彼此独立
		! function () {
			let readableBox = document.body.querySelector('#readable'),
				readableClose = readableBox.querySelector(':scope>.close'),
				readableContent = readableBox.querySelector(':scope>.content'),
				raCallback;

			kernel.fixIosScrolling(readableContent);
			kernel.showReadable = function (html, callback, className) { //展示静态内容
				if (typeof html === 'string') {
					readableContent.innerHTML = html;
				} else {
					readableContent.appendChild(html);
				}
				readableBox.className = className ? 'in ' + className : 'in';
				raCallback = callback;
			};
			kernel.hideReadable = function () {
				if (readableBox.classList.contains('in')) {
					readableBox.classList.remove('in');
					readableBox.classList.add('out');
					if (typeof raCallback === 'function') {
						raCallback();
					}
				}
			};
			kernel.showForeign = function (url, callback) { //展示站外内容
				kernel.showReadable('<iframe frameborder="no" scrolling="auto" sandbox="allow-same-origin allow-forms allow-scripts" src="' + url + '"></iframe>', callback, 'foreign');
			};
			readableClose.appendChild(kernel.makeSvg('times-solid', 1));
			readableClose.addEventListener('click', kernel.hideReadable);
			readableBox.addEventListener('animationend', function (evt) {
				if (evt.target === this && this.classList.contains('out')) {
					while (readableContent.childNodes.length > 0) {
						readableContent.firstChild.remove();
					}
					this.className = '';
				}
			});
		}();
		//对话框及提示功能
		! function () {
			let hintmo, callback,
				loadingRT = 0,
				dlgStack = [],
				photoStatus = {},
				loadingCtn = document.body.querySelector('#loading'),
				hintCtn = document.body.querySelector('#hint'),
				dialogCtn = document.body.querySelector('#dialog'),
				dialogBox = dialogCtn.querySelector(':scope>div'),
				dialogContent = dialogBox.querySelector(':scope>.content'),
				dialogClose = dialogBox.querySelector(':scope>.close'),
				yesbtn = dialogBox.querySelector(':scope>.btns>.yes'),
				nobtn = dialogBox.querySelector(':scope>.btns>.no'),
				sliderViewCtn = document.body.querySelector('#sliderView'),
				sliderViewClose = sliderViewCtn.querySelector(':scope>.close'),
				slider = touchslider(sliderViewCtn.querySelector(':scope>.content')),
				photoViewCtn = document.body.querySelector('#photoView'),
				photoViewClose = photoViewCtn.querySelector(':scope>.close'),
				photoViewContent = photoViewCtn.querySelector(':scope>img'),
				photoViewActions = photoViewCtn.querySelector(':scope>.actions'),
				guesture = touchguesture(photoViewCtn);

			guesture.onzoomstart = zoomstart;
			guesture.ondragstart = dragstart;
			kernel.showPhotoView = function (url, btns, cb) {
				photoViewContent.src = url;
				while (photoViewActions.childNodes.length) {
					photoViewActions.firstChild.remove();
				}
				if (typeof cb === 'function' && btns && btns.length) {
					for (let i = 0; i < btns.length; i++) {
						let tmp = document.createElement('a');
						tmp.href = 'javascript:;';
						tmp.appendChild(document.createTextNode(btns[i]));
						tmp.addEventListener('click', cb.bind(kernel, i));
						photoViewActions.appendChild(tmp);
					}
					photoViewActions.style.display = '';
				} else {
					photoViewActions.style.display = 'none';
				}
			};

			kernel.hidePhotoView = function () {
				photoViewContent.src = 'about:blank';
			};
			photoViewContent.addEventListener('load', function () {
				photoViewCtn.style.visibility = 'inherit';
				self.addEventListener('resize', syncPhotoViewSize);
				syncPhotoViewSize();
			});
			photoViewContent.addEventListener('error', function () {
				photoViewCtn.style.visibility = '';
				self.removeEventListener('resize', syncPhotoViewSize);
			});

			kernel.showSliderView = function (doms, idx, className) {
				sliderViewCtn.className = className || '';
				for (let i = 0; i < doms.length; i++) {
					slider.add(doms[i]);
				}
				if (idx) {
					slider.slideTo(idx, true);
				}
			};
			kernel.hideSliderView = function () {
				slider.clear();
			};
			kernel.alert = function (text, callback) { //alert对话框
				openDialog('alert', text, callback);
			};
			kernel.confirm = function (text, callback) { //yes no对话框
				openDialog('confirm', text, callback);
			};
			kernel.htmlDialog = function (html, className, callback) { //自定义内容的对话框
				openDialog(className || '', html, callback);
			};
			kernel.closeDialog = function (param) { //通用对话框关闭方法
				self.removeEventListener('resize', syncDialogSize, false);
				dialogCtn.style.visibility = '';
				if (typeof callback === 'function') {
					callback(param);
				}
				while (dialogContent.childNodes.length) {
					dialogContent.lastChild.remove();
				}
				callback = undefined;
				if (dlgStack.length) {
					let a = dlgStack.shift();
					kernel[a.shift()].apply(kernel, a);
				}
			};
			kernel.showLoading = function (text) { //loading提示框, 每次调用引用计数+1所以showLoading和hideLoading必须成对使用
				loadingCtn.querySelector(':scope>div').lastChild.data = text ? text : lang.loading;
				if (loadingRT === 0) {
					loadingCtn.style.visibility = 'inherit';
					activities.classList.add('mask');
				}
				loadingRT++;
			};
			kernel.hideLoading = function () {
				if (loadingRT > 0) {
					loadingRT--;
					if (loadingRT === 0) {
						loadingCtn.style.visibility = '';
						activities.classList.remove('mask');
						if (typeof kernel.dialogEvents.onloaded === 'function') {
							kernel.dialogEvents.onloaded({
								type: 'loaded'
							});
						}
					}
				}
			};
			kernel.isLoading = function () {
				return loadingRT > 0;
			};
			kernel.hint = function (text, t) { //底部提示, 不干扰用户操作, 默认显示5秒
				hintCtn.querySelector(':scope>.text').firstChild.data = text;
				if (hintmo) {
					clearTimeout(hintmo);
				} else {
					hintCtn.style.opacity = 1;
				}
				hintmo = setTimeout(function () {
					hintCtn.style.opacity = '';
					hintmo = undefined;
				}, t ? t : 5000);
			};
			//目前只有loaded事件
			kernel.dialogEvents = {};

			slider.onchange = function () {
				let txt = '';
				if (this.children.length) {
					if (this.children.length > 1) {
						for (let i = 0; i < this.children.length; i++) {
							txt += (i === this.current) ? '●' : '○';
						}
					}
					sliderViewCtn.style.visibility = 'inherit';
				} else {
					sliderViewCtn.style.visibility = '';
				}
				sliderViewCtn.querySelector(':scope>.nav').firstChild.data = txt;
			};
			dialogClose.appendChild(kernel.makeSvg('times-circle-solid', 1));
			dialogClose.addEventListener('click', closeDialog);
			nobtn.addEventListener('click', closeDialog);
			yesbtn.addEventListener('click', kernel.closeDialog);
			sliderViewClose.appendChild(kernel.makeSvg('times-solid', 1));
			photoViewClose.appendChild(sliderViewClose.firstChild.cloneNode(true));
			sliderViewClose.addEventListener('click', kernel.hideSliderView);
			photoViewClose.addEventListener('click', kernel.hidePhotoView);

			function closeDialog() {
				kernel.closeDialog();
			}

			function openDialog(type, content, cb) {
				if (dialogCtn.style.visibility === 'inherit') {
					dlgStack.push([type, content, cb]);
				} else {
					dialogBox.className = type;
					if (type === 'alert') {
						dialogContent.textContent = content;
					} else if (type === 'confirm') {
						if (kernel.dataType(content) === 'array') {
							dialogContent.textContent = content[0];
							yesbtn.firstChild.data = content[1];
							nobtn.firstChild.data = content[2];
						} else {
							dialogContent.textContent = content;
							yesbtn.firstChild.data = lang.yes;
							nobtn.firstChild.data = lang.no;
						}
					} else {
						if (typeof content === 'string') {
							dialogContent.innerHTML = content;
						} else {
							dialogContent.appendChild(content);
						}
					}
					self.addEventListener('resize', syncDialogSize);
					syncDialogSize();
					dialogCtn.style.visibility = 'inherit';
					callback = cb;
				}
			}

			function syncDialogSize() {
				dialogBox.style.width = dialogBox.style.height = '';
				dialogBox.style.left = dialogBox.style.top = '20px';
				dialogBox.style.bottom = dialogBox.style.right = 'auto';
				dialogBox.style.width = dialogBox.offsetWidth + 'px';
				dialogBox.style.height = dialogBox.offsetHeight + 'px';
				dialogBox.style.left = dialogBox.style.top = dialogBox.style.bottom = dialogBox.style.right = '';
			}

			function setImg() {
				photoViewContent.style.width = photoStatus.w + 'px';
				photoViewContent.style.height = photoStatus.h + 'px';
				photoViewContent.style.left = photoStatus.l + 'px';
				photoViewContent.style.top = photoStatus.t + 'px';
			}

			function syncPhotoViewSize() {
				photoStatus.ww = innerWidth;
				photoStatus.wh = innerHeight;
				photoStatus.wr = photoStatus.ww / photoStatus.wh;
				photoStatus.ow = photoViewContent.naturalWidth;
				photoStatus.oh = photoViewContent.naturalHeight;
				photoStatus.r = photoStatus.ow / photoStatus.oh;
				if (photoStatus.ow > photoStatus.ww || photoStatus.oh > photoStatus.wh) {
					if (photoStatus.r > photoStatus.wr) {
						photoStatus.z = photoStatus.mz = photoStatus.ww / photoStatus.ow;
						photoStatus.l = 0;
						photoStatus.w = photoStatus.ww;
						photoStatus.h = photoStatus.w / photoStatus.r;
						photoStatus.t = (photoStatus.wh - photoStatus.h) / 2;
					} else {
						photoStatus.z = photoStatus.mz = photoStatus.wh / photoStatus.oh;
						photoStatus.t = 0;
						photoStatus.h = photoStatus.wh;
						photoStatus.w = photoStatus.h * photoStatus.r;
						photoStatus.l = (photoStatus.ww - photoStatus.w) / 2;
					}
				} else {
					photoStatus.z = photoStatus.mz = 1;
					photoStatus.w = photoStatus.ow;
					photoStatus.h = photoStatus.oh;
					photoStatus.l = (photoStatus.ww - photoStatus.w) / 2;
					photoStatus.t = (photoStatus.wh - photoStatus.h) / 2;
				}
				setImg();
			}

			function zoomstart(evt) {
				let x = evt.x,
					y = evt.y,
					oz = photoStatus.z;
				this.onzoomstart = null;
				this.onzoomchange = zoomchange;
				this.onzoomend = function (evt) {
					zoomchange.call(this, evt);
					this.onzoomchange = this.zoomend = null;
					this.onzoomstart = zoomstart;
				};

				function zoomchange(evt) {
					let nz = Math.max(Math.min(evt.zoom * oz, 1), photoStatus.mz);
					if (nz !== photoStatus.z) {
						photoStatus.w = photoStatus.ow * nz;
						photoStatus.h = photoStatus.oh * nz;
						photoStatus.l = photoStatus.w > photoStatus.ww ? Math.min(Math.max(x + (photoStatus.l - x) * nz / photoStatus.z, photoStatus.ww - photoStatus.w), 0) : (photoStatus.ww - photoStatus.w) / 2;
						photoStatus.t = photoStatus.h > photoStatus.wh ? Math.min(Math.max(y + (photoStatus.t - y) * nz / photoStatus.z, photoStatus.wh - photoStatus.h), 0) : (photoStatus.wh - photoStatus.h) / 2;
						photoStatus.z = nz;
						setImg();
					}
				}
			}

			function dragstart(evt) {
				let x = evt.x,
					y = evt.y,
					ol = photoStatus.l,
					ot = photoStatus.t;
				guesture.ondragmove = dragmove;
				guesture.ondragend = function (evt) {
					dragmove.call(this, evt);
					this.ondragmove = this.ondragend = null;
					this.ondragstart = dragstart;
				};

				function dragmove(evt) {
					if (photoStatus.w > photoStatus.ww) {
						photoStatus.l = Math.min(Math.max(ol + evt.x - x, photoStatus.ww - photoStatus.w), 0);
					}
					if (photoStatus.h > photoStatus.wh) {
						photoStatus.t = Math.min(Math.max(ot + evt.y - y, photoStatus.wh - photoStatus.h), 0);
					}
					setImg();
				}
			}
		}();
	}
	//页面加载相关功能
	! function () {
		//此处不能使用kernel.lastLocation.id, 因为currentpage仅在页面加载成功才会更新
		//而kernel.lastLocation.id在页面加载前就已经更新, 无法确保成功加载
		let routerHistory, currentpage, animating, todo, navIcos, navs,
			historyName = location.pathname,
			pagesBox = document.body.querySelector('#page'),
			navCtn = pagesBox.querySelector(':scope>.navMenu'),
			pageTitle = pagesBox.querySelector(':scope>.header>.title').firstChild,
			backbtn = pagesBox.querySelector(':scope>.header>.back'),
			headerLeftMenuBtn = pagesBox.querySelector(':scope>.header>.leftMenuBtn'),
			headerRightMenuBtn = pagesBox.querySelector(':scope>.header>.rightMenuBtn');
		//if private browsing is enabled, Safari will throw a stupid exception when calling setItem from sessionStorage or localStorage. the fallowing code can avoid this.
		try {
			sessionStorage.setItem(0, 0);
			sessionStorage.removeItem(0);
		} catch (e) {
			Storage.prototype.setItem = function () {};
		}
		//icos是导航菜单的列表
		//home是默认页
		kernel.init = function (home, icos) {
			if (pages.hasOwnProperty(home)) {
				if (homePage) {
					if (icos) {
						initNavs(icos);
					}
					if (homePage !== home) {
						let oldHome = homePage;
						homePage = home;
						if (kernel.location.id === oldHome) {
							hashchange();
							return true;
						}
					}
				} else {
					homePage = home;
					// 当前URL
					kernel.location = kernel.parseHash(location.hash);
					// 如果带ui参数就把参数中样式加入body
					if (kernel.location.args.ui) {
						kernel.location.args.ui.split(',').forEach(function (item) {
							activities.classList.add(item);
						});
					}
					// 看是否有history
					routerHistory = sessionStorage.getItem(historyName);
					routerHistory = routerHistory ? JSON.parse(routerHistory) : {};
					// 解析 routerHistory
					for (let n in routerHistory) {
						if (pages.hasOwnProperty(n)) {
							pages[n].backLoc = routerHistory[n];
						}
					}
					self.addEventListener('hashchange', hashchange);
					initNavs(icos);
					manageLocation();
					if (kernel.location.args.hasOwnProperty('autopopup')) {
						let tmp;
						if (kernel.location.args.hasOwnProperty('autopopuparg')) {
							try {
								tmp = JSON.parse(kernel.location.args.autopopuparg);
							} catch (e) {}
						}
						if (kernel.openPopup(kernel.location.args.autopopup, tmp)) {
							document.body.querySelector('#popup').style.animationDuration = '1ms';
							kernel.listeners.add(kernel.popupEvents, 'showend', removeLoading);
						} else {
							removeLoading();
						}
					} else {
						removeLoading();
					}

					function removeLoading(evt) {
						if (evt) {
							kernel.listeners.remove(this, evt.type, removeLoading);
							setTimeout(function () {
								document.body.querySelector('#popup').style.animationDuration = '';
							}, 400);
						}
						document.body.addEventListener('transitionend', function (evt) {
							if (evt.target === this) {
								document.body.style.transition = '';
							}
						});
						document.documentElement.classList.remove('loading');
					}
				}
			}
		};
		//刷新当前页
		kernel.reloadPage = function (id, silent) {
			let thislocation;
			// 是否有数据正在加载
			if (kernel.isLoading()) {
				thislocation = kernel.location;
				// 注册监听 ; loaded
				kernel.listeners.add(kernel.dialogEvents, 'loaded', listener);
			} else {
				reloadPage(id, silent);
			}

			function listener(evt) {
				kernel.listeners.remove(this, evt.type, listener);
				// url 是否改变
				if (thislocation === kernel.location) {
					reloadPage(id, silent);
				}
			}
		};
		kernel.destroyPage = function (id) {
			if (pages[id].status === 2) {
				destroy(pages[id], 'page', id);
				return true;
			}
		};
		kernel.pageEvents = {};
		backbtn.insertBefore(kernel.makeSvg('angle-left-light', 1), backbtn.firstChild);
		headerRightMenuBtn.addEventListener('click', function (evt) {
			let page = pages[pages[currentpage].alias ? pages[currentpage].alias : currentpage];
			if (typeof page.onrightmenuclick === 'function') {
				page.onrightmenuclick();
			}
		});
		headerLeftMenuBtn.addEventListener('click', function (evt) {
			let page = pages[pages[currentpage].alias ? pages[currentpage].alias : currentpage];
			if (typeof page.onleftmenuclick === 'function') {
				page.onleftmenuclick();
			}
		});

		function initNavs(icos) {
			while (navCtn.childNodes.length) {
				navCtn.firstChild.remove();
			}
			navIcos = icos;
			navs = {};
			for (let n in navIcos) {
				if (pages.hasOwnProperty(n)) {
					navs[n] = navCtn.appendChild(document.createElement('a'));
					navs[n].href = '#!' + n;
					if (RegExp('^' + n + '(?:-|$)').test(kernel.location.id)) {
						navs[n].className = 'selected';
						navs[n].appendChild(kernel.makeSvg(typeof navIcos[n] === 'string' ? navIcos[n] : navIcos[n].selected, 1));
					} else {
						navs[n].appendChild(kernel.makeSvg(typeof navIcos[n] === 'string' ? navIcos[n] : navIcos[n].normal, 1));
					}
					navs[n].appendChild(document.createTextNode(pages[n].alias ? pages[n].title || pages[pages[n].alias].title : pages[n].title));
				}
			}
		}

		function hashchange() {
			let newLocation = kernel.parseHash(location.hash);
			// 如果url 发生改变 就执行
			if (!kernel.isSameLocation(newLocation, kernel.location)) {
				kernel.lastLocation = kernel.location;
				kernel.location = newLocation;
				// 如果是前进操作
				if ((pages[kernel.location.id].back && (kernel.lastLocation.id === pages[kernel.location.id].back || pages[kernel.lastLocation.id].alias === pages[kernel.location.id].back))) {
					// 把上一页赋值给他的后退页
					routerHistory[kernel.location.id] = pages[kernel.location.id].backLoc = kernel.lastLocation;
					// 记录到 sessionStorage
					sessionStorage.setItem(historyName, JSON.stringify(routerHistory));
				} // 如果是 后退操作
				else if (pages[kernel.lastLocation.id].backLoc && (kernel.location.id === pages[kernel.lastLocation.id].back || (pages[kernel.location.id].alias && pages[kernel.location.id].alias === pages[kernel.lastLocation.id].back))) {
					// 剔除最后一次 back 对象
					delete pages[kernel.lastLocation.id].backLoc;
					delete routerHistory[kernel.lastLocation.id];
					sessionStorage.setItem(historyName, JSON.stringify(routerHistory));
				}
				manageLocation();
			}
		}

		function manageLocation() {
			let pageid = kernel.location.id;
			if (kernel.hasOwnProperty('lastLocation')) {
				let n = pageid.replace(/-.*$/, ''),
					m = kernel.lastLocation.id.replace(/-.*$/, '');
				if (n !== m) {
					if (navs.hasOwnProperty(n)) {
						navs[n].className = 'selected';
						if (typeof navIcos[n] !== 'string') {
							kernel.setSvgPath(navs[n].firstChild, navIcos[n].selected, 1);
						}
					}
					if (navs.hasOwnProperty(m)) {
						navs[m].className = '';
						if (typeof navIcos[m] !== 'string') {
							kernel.setSvgPath(navs[m].firstChild, navIcos[m].normal, 1);
						}
					}
				}
				clearWindow();
			}
			if (typeof kernel.pageEvents.onroute === 'function') {
				kernel.pageEvents.onroute({
					type: 'route'
				});
			}
			initLoad(true, pageid, function (firstLoad) {
				if (animating) {
					todo = true;
				} else {
					let force;
					if (pageid === currentpage) { // 未发生转向, 但url有变化
						// 相当于 刷新界面 或者是 改变了参数
						// 不需要动画
						noSwitchLoad(); // 直接触发页面事件 onload
					} else { // 只有返回或未发生转向时允许页面缓存
						let id = pages[pageid].alias ? pages[pageid].alias : pageid,
							title = pages[pageid].title || pages[id].title;
						pagesBox.classList.add(pageid);
						// 重置 title
						pageTitle.data = title;
						if (activities.classList.contains('clean') || activities.classList.contains('hidePageHeader')) {
							document.title = title;
						}
						if (self.frameElement && frameElement.kernel && kernel.getCurrentPopup() === 'page') {
							kernel.setPopupTitle(title);
						}
						// 重置 顶部按钮
						while (headerRightMenuBtn.childNodes.length) {
							headerRightMenuBtn.firstChild.remove();
						}
						headerRightMenuBtn.removeAttribute('href');
						while (headerLeftMenuBtn.childNodes.length) {
							headerLeftMenuBtn.firstChild.remove();
						}
						headerLeftMenuBtn.removeAttribute('href');
						// init 顶部按钮事件 和 元素
						// 如果没有 就隐藏
						if (pages[id].rightMenuContent || pages[id].onrightmenuclick) {
							if (typeof pages[id].rightMenuContent === 'string') {
								headerRightMenuBtn.innerHTML = pages[id].rightMenuContent;
							} else if (pages[id].rightMenuContent) {
								headerRightMenuBtn.appendChild(pages[id].rightMenuContent);
							}
							if (typeof pages[id].onrightmenuclick === 'function') {
								headerRightMenuBtn.href = 'javascript:;';
							} else if (pages[id].onrightmenuclick) {
								headerRightMenuBtn.href = pages[id].onrightmenuclick;
							}
							headerRightMenuBtn.style.display = '';
						} else {
							headerRightMenuBtn.style.display = 'none';
						}
						if (pages[id].leftMenuContent || pages[id].onleftmenuclick) {
							if (typeof pages[id].leftMenuContent === 'string') {
								headerLeftMenuBtn.innerHTML = pages[id].leftMenuContent;
							} else if (pages[id].leftMenuContent) {
								headerLeftMenuBtn.appendChild(pages[id].leftMenuContent);
							}
							if (typeof pages[id].onleftmenuclick === 'function') {
								headerLeftMenuBtn.href = 'javascript:;';
							} else if (pages[id].onleftmenuclick) {
								headerLeftMenuBtn.href = pages[id].onleftmenuclick;
							}
							headerLeftMenuBtn.style.display = '';
						} else {
							headerLeftMenuBtn.style.display = 'none';
						}
						// 设置 返回按钮URL
						let loc = kernel.getDefaultBack();
						if (loc) {
							let txt = pages[loc.id].title;
							if (!txt && pages[loc.id].alias) {
								txt = pages[pages[loc.id].alias].title;
							}
							backbtn.lastChild.data = txt || lang.back;
							backbtn.href = kernel.buildHash(loc);
							backbtn.style.display = '';
						} else {
							backbtn.style.display = 'none';
						}
						let toshow = pagesBox.querySelector(':scope>.content>.' + id);
						if (currentpage) {
							pagesBox.classList.remove(currentpage);
							let oldid = pages[currentpage].alias ? pages[currentpage].alias : currentpage,
								oldpageid = currentpage;
							currentpage = pageid;
							//alias之间切换不需要动画
							if (id === oldid) {
								force = true;
								noSwitchLoad(force);
							} else {
								animating = true;
								let tohide = pagesBox.querySelector(':scope>.content>.' + oldid),
									goingback = kernel.isGoingback(oldpageid, pageid);
								force = !goingback || firstLoad;
								panelSwitch(toshow, tohide, goingback, function () {
									animating = false;
									if (typeof pages[oldid].onunloadend === 'function') {
										pages[oldid].onunloadend();
									}
									pages[oldid].status--;
									if (pages[oldid].autoDestroy) {
										destroy(pages[oldid], 'page', oldid);
									} else if (document.activeElement && tohide.contains(document.activeElement)) {
										document.activeElement.blur();
									}
									if (typeof pages[id].onloadend === 'function') {
										pages[id].onloadend(force);
									}
									pages[id].status++;
									if (todo) {
										todo = false;
										toshow.style.visibility = 'inherit';
										manageLocation();
									}
								});

								// 加载页面的时候
								// 触发上一个页面的卸载事件
								if (typeof pages[oldid].onunload === 'function') {
									pages[oldid].onunload();
								}
								pages[oldid].status--;
								// 触发当前页面的加载事件
								pages[id].status++;
								if (typeof pages[id].onload === 'function') {
									pages[id].onload(force);
								}
							}
						} else { // 初次加载不显示动画
							force = true;
							currentpage = pageid; // 记录当前显示中的页面
							toshow.style.left = 0;
							toshow.style.visibility = 'inherit';
							noSwitchLoad(force); // 触发当前页的 加载事件
						}
					}
					if (typeof kernel.pageEvents.onrouteend === 'function') {
						kernel.pageEvents.onrouteend({
							type: 'routeend',
							force: force
						});
					}
				}
			});
		}

		function reloadPage(id, silent) {
			let cfg = pages[currentpage].alias ? pages[pages[currentpage].alias] : pages[currentpage];
			if (!id || id === currentpage || (kernel.dataType(id) === 'array' && id.indexOf(currentpage) >= 0)) {
				if (!silent) {
					clearWindow();
				}
				if (typeof cfg.onload === 'function') {
					cfg.onload(true);
				}
				if (typeof cfg.onloadend === 'function') {
					cfg.onloadend(true);
				}
			}
		}

		function clearWindow() {
			if (!self.frameElement || !frameElement.kernel) {
				kernel.hideReadable();
				kernel.closePopup();
			}
		}

		function noSwitchLoad(force) {
			let cfg = pages[currentpage].alias ? pages[pages[currentpage].alias] : pages[currentpage];
			if (cfg.status < 3) {
				cfg.status++;
			}
			if (typeof cfg.onload === 'function') {
				cfg.onload(force);
			}
			if (typeof cfg.onloadend === 'function') {
				cfg.onloadend(force);
			}
			if (cfg.status < 4) {
				cfg.status++;
			}
		}
	}();

	lang = kernel.getLang(lang);
	//禁止各种 long tap 菜单
	//ios 中需使用样式 -webkit-touch-callout: none;
	self.addEventListener('contextmenu', browser.name === 'Firefox' ? stopEvent : cancelEvent);
	self.addEventListener('dragstart', cancelEvent);
	if (browser.name === 'IOS') {
		self.addEventListener('gesturestart', cancelEvent);
		self.addEventListener('touchmove', cancelEvent, {
			passive: false
		});
	}
	return kernel;

	function destroy(cfg, type, id) {
		let n = type + '/' + id + '/',
			o = document.body.querySelector('#' + type + '>.content>.' + id);
		if (typeof cfg.ondestroy === 'function') {
			cfg.ondestroy();
		}
		o.remove();
		if (cfg.css && typeof cfg.css !== 'string') {
			cfg.css = kernel.removeCss(cfg.css).substr(require.toUrl(n).length);
		}
		if (cfg.js) {
			n += cfg.js;
			if (require.defined(n)) {
				o = require(n);
				require.undef(n);
				if (o) {
					if (self.Reflect) {
						Reflect.setPrototypeOf(cfg, Object.prototype);
					} else {
						cfg.__proto__ = Object.prototype;
					}
				}
			}
		}
		delete cfg.status;
	}

	function initLoad(isPage, id, callback) {
		let oldcfg, ctn, family, n;
		if (isPage) {
			family = 'page';
			oldcfg = pages[id];
			if (oldcfg.alias) {
				id = oldcfg.alias;
				oldcfg = pages[oldcfg.alias];
			}
		} else {
			family = 'popup';
			oldcfg = popups[id];
		}
		//status: 1=loading, 2=loaded but hidden, 3=showing or hiding, 4=shown
		if (oldcfg.status > 1) {
			callback();
		} else if (!oldcfg.status) {
			oldcfg.status = 1;
			ctn = document.body.querySelector('#' + family);
			n = family + '/' + id + '/';
			let m = require.toUrl(n);
			if (typeof oldcfg.css === 'string') {
				oldcfg.css = kernel.appendCss(m + oldcfg.css);
			}
			if ('html' in oldcfg) {
				kernel.showLoading();
				let url = m + oldcfg.html,
					xhr = new XMLHttpRequest();
				xhr.open('get', url, true);
				xhr.onreadystatechange = function () {
					if (this.readyState === 4) {
						if (this.status === 200) {
							loadJs(this.responseText);
						} else {
							destroy(oldcfg, family, id);
							if (VERSION === 'dev' || this.status !== 404) {
								errorOccurs(url, this.status);
							} else {
								updated();
							}
						}
						kernel.hideLoading();
					}
				};
				xhr.send('');
			} else {
				loadJs('');
			}

			function loadJs(html) {
				ctn.querySelector(':scope>.content').insertAdjacentHTML('beforeEnd', '<div class="' + id + '">' + html + '</div>');
				addPanelAnimationListener(ctn.querySelector(':scope>.content>.' + id));
				if ('js' in oldcfg) {
					kernel.showLoading();
					let js = n + oldcfg.js;
					require([js], function (cfg) {
						if (cfg) {
							if (self.Reflect) {
								Reflect.setPrototypeOf(oldcfg, cfg);
							} else {
								oldcfg.__proto__ = cfg;
							}
						}
						oldcfg.status++;
						callback(true);
						kernel.hideLoading();
					}, VERSION === 'dev' ? undefined : function (error) {
						destroy(oldcfg, family, id);
						if ((error.requireType && error.requireType !== 'scripterror' && error.requireType !== 'nodefine') || (error.xhr && error.xhr.status !== 404)) {
							errorOccurs(js, error.message);
						} else {
							updated();
						}
						kernel.hideLoading();
					});
				} else {
					oldcfg.status++;
					callback(true);
				}
			}

			function errorOccurs(res, msg) {
				kernel.alert(lang.error.replace('${res}', res) + msg, isPage ? function () {
					history.back();
				} : undefined);
			}

			function updated() {
				if (isPage) {
					location.reload();
				} else {
					kernel.confirm(lang.update, function (sure) {
						if (sure) {
							location.reload();
						}
					});
				}
			}
		}
	}
	//启动左右滑动的动画
	function panelSwitch(toshow, tohide, goingback, callback) {
		toshow.style.visibility = 'inherit';
		if (goingback) {
			tohide.style.animationName = 'panelTransR1';
			toshow.style.animationName = 'panelTransR2';
		} else {
			tohide.style.animationName = 'panelTransL1';
			toshow.style.animationName = 'panelTransL2';
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
		emt.addEventListener('animationend', listener);
	}
	//左右滑动的动画完成后要执行的操作
	function panelAnimationEnd(evt) {
		if (evt.target === this) { //ios中this的子节点也会触发该事件
			if (this.style.animationName.substr(this.style.animationName.length - 1) === '1') {
				this.style.left = this.style.visibility = '';
			} else {
				this.style.left = 0;
			}
			this.style.animationName = '';
		}
	}

	function cancelEvent(evt) {
		evt.preventDefault();
	}

	function stopEvent(evt) {
		evt.stopPropagation();
	}
});
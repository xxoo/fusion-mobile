'use strict';
define(['common/touchslider/touchslider', 'common/touchguesture/touchguesture', 'common/pointerevents/pointerevents', 'common/svgicos/svgicos', 'site/pages/pages', 'site/panels/panels', 'site/popups/popups', './lang'], function (touchslider, touchguesture, pointerevents, svgicos, pages, panels, popups, lang) {
	//predefined arguments
	//autoPopup, autoPopupArg, ui, backHash
	let homePage, anievt, aniname, anidru;
	const cancelEvent = evt => evt.preventDefault(),
		stopEvent = evt => evt.stopPropagation(),
		fusion = {
			__proto__: null,
			// 加入css 到head中;
			// 如果是生产环境; 加入 css
			// 如果是开发环境 加入less
			appendCss(url, forcecss) { //自动根据当前环境添加css或less
				const csslnk = document.createElement('link');
				if (self.less && !forcecss) {
					csslnk.rel = 'stylesheet/less';
					csslnk.href = url + '.less';
					less.sheets.push(csslnk);
					less.refresh();
				} else {
					csslnk.rel = 'stylesheet';
					csslnk.href = url + '.css';
				}
				return document.head.appendChild(csslnk);
			},
			removeCss(lnk) {
				lnk.remove();
				if (lnk.rel === 'stylesheet/less') {
					less.sheets.splice(less.sheets.indexOf(lnk), 1);
					less.refresh();
				}
			},
			// 创建 svg dom;
			makeSvg(name, type) {
				const svgns = 'http://www.w3.org/2000/svg',
					svg = document.createElementNS(svgns, 'svg');
				svg.appendChild(document.createElementNS(svgns, 'path'));
				if (name) {
					fusion.setSvgPath(svg, name, type);
				}
				return svg;
			},
			// 设置svg 内容
			setSvgPath(svg, name, type) {
				if (name in svgicos) {
					name = svgicos[name];
				}
				svg.firstChild.setAttribute('d', name);
				let box;
				if (type == 3) {
					box = {
						x: 0,
						y: 0,
						width: 24,
						height: 24
					};
				} else {
					const tmp = fusion.makeSvg();
					tmp.style.position = 'absolute';
					tmp.style.bottom = tmp.style.right = '100%';
					tmp.firstChild.setAttribute('d', name);
					document.body.appendChild(tmp);
					box = tmp.firstChild.getBBox();
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
				}
				svg.setAttribute('viewBox', box.x + ' ' + box.y + ' ' + box.width + ' ' + box.height);
			},
			parseHash(hash) {
				const nl = {
					__proto__: null,
					id: homePage,
					args: { __proto__: null }
				};
				const s = hash.substring(1).match(/[^=/]+(=[^/]*)?/g);
				if (s) {
					let a = decodeURIComponent(s[0], true);
					if (a in pages) {
						nl.id = a;
					}
					for (let i = 1; i < s.length; i++) {
						a = s[i].match(/^([^=]+)(=)?(.+)?$/);
						if (a) {
							nl.args[decodeURIComponent(a[1], true)] = a[2] ? decodeURIComponent(a[3] || '') : undefined;
						}
					}
				}
				return nl;
			},
			// 后退行为
			getDefaultBack(loc) {
				let bk2;
				if (!loc) {
					loc = fusion.location;
				}
				if (loc.args.backHash) {
					bk2 = fusion.parseHash(loc.args.backHash);
				}
				if (bk2) {
					return bk2;
				} else {
					const bk1 = pages[loc.id].backLoc;
					if (pages[loc.id].back && pages[pages[loc.id].back]) {
						bk2 = {
							id: pages[loc.id].back,
							args: { __proto__: null }
						};
						const o = pages[pages[loc.id].back].alias ? pages[pages[pages[loc.id].back].alias] : pages[pages[loc.id].back];
						if (o.args) {
							for (let i = 0; i < o.args.length; i++) {
								if (o.args[i] in loc.args) {
									bk2.args[o.args[i]] = loc.args[o.args[i]];
								}
							}
						}
					}
					if (bk1 && bk2) {
						for (const i in bk2.args) {
							if (bk2.args[i] !== bk1.args[i]) {
								return bk2;
							}
						}
						return bk1;
					} else {
						return bk1 || bk2;
					}
				}
			},
			// 判断是否是后退
			isGoingback(from, to) {
				let f = from;
				if (f !== to) {
					if (to === homePage || (f.length > to.length + 1 && f.substring(0, to.length + 1) === to + '-')) {
						return true;
					} else {
						while (pages[f].back) {
							f = pages[f].back;
							if (f === to) {
								return true;
							}
						}
						f = from.split('-');
						const t = to.split('-'),
							j = Math.min(f.length, t.length);
						let i = 0;
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
							return fusion.isGoingback(f.join('-'), t.join('-'));
						}
					}
				}
			},
			replaceLocation(loc, force) {
				if (fusion.location && fusion.isSameLocation(loc, fusion.location)) {
					if (force) {
						fusion.reloadPage();
					}
					return false;
				} else {
					location.replace(fusion.buildHash(loc));
					return true;
				}
			}
		};
	if ('animation' in document.documentElement.style) {
		anievt = 'onanimationend';
		aniname = 'animationName';
		anidru = 'animationDuration';
	} else {
		anievt = 'onwebkitanimationend';
		aniname = 'webkitAnimationName';
		anidru = 'webkitAnimationDuration';
	}
	if (self.frameElement && frameElement.fusion) {
		if (self.Reflect) {
			Reflect.setPrototypeOf(fusion, frameElement.fusion);
		} else {
			fusion.__proto__ = frameElement.fusion;
		}
	} else {
		//杂项功能
		(() => {
			fusion.encodeArg = (s, isName) => s.replace(isName ? /[^!$\x26-\x2e\x30-\x3b\x3f-\x5f\x61-\x7e]+/g : /[^!$=\x26-\x2e\x30-\x3b\x3f-\x5f\x61-\x7e]+/g, encodeURIComponent);
			fusion.buildHash = function (loc) {
				let hash = '#/' + fusion.encodeArg(loc.id, true);
				for (let n in loc.args) {
					hash += '/' + fusion.encodeArg(n, true);
					if (loc.args[n] !== undefined) {
						hash += '=' + fusion.encodeArg(loc.args[n]);
					}
				}
				return hash;
			};
			// 比较两个 location对象; 看 url 是否改变;
			// 比较 key 和 args
			fusion.isSameLocation = function (loc1, loc2) {
				if (loc1.id === loc2.id && Object.keys(loc1.args).length === Object.keys(loc2.args).length) {
					for (const n in loc1.args) {
						if (!(n in loc2.args)) {
							return false;
						} else if (loc1.args[n] === undefined) {
							if (loc1.args[n] !== loc2.args[n]) {
								return false;
							}
						} else if ('' + loc1.args[n] !== '' + loc2.args[n]) {
							return false;
						}
					}
					return true;
				} else {
					return false;
				}
			};
			fusion.getLang = function (langs) {
				if (navigator.languages) {
					for (let i = 0; i < navigator.languages.length; i++) {
						if (navigator.languages[i] in langs) {
							return langs[navigator.languages[i]];
						}
					}
				} else {
					if (navigator.language in langs) {
						return langs[navigator.language];
					}
				}
				return langs.en;
			};
		})();
		(() => {
			const t = document.head.querySelector('meta[name=viewport]'),
				s = t.content;
			let lw, lh, tmo, minWidth;
			fusion.setAutoScale = function (v) {
				minWidth = v;
				if (minWidth > 0) {
					if (self.visualViewport) {
						self.visualViewport.dispatchEvent(new Event('resize'));
					} else {
						self.dispatchEvent(new Event('resize'));
					}
				} else {
					t.content = s;
					lw = lh = undefined;
				}
			};
			if (self.visualViewport) {
				self.visualViewport.addEventListener('resize', function () {
					if (minWidth > 0) {
						setScale(Math.round(this.width * this.scale), Math.round(this.height * this.scale), true);
					}
				});
			} else {
				self.addEventListener('resize', function () {
					if (minWidth > 0) {
						if (tmo) {
							cancelAnimationFrame(tmo);
						}
						fallback();
					}
				});
			}

			function fallback() {
				let s1 = t.content.match(/initial-scale=([\d\.]+)/);
				if (s1) {
					s1 = +s1[1];
				} else {
					s1 = 1;
				}
				const w = Math.round(innerWidth * s1),
					h = Math.round(innerHeight * s1);
				if (lw === w && lh === h) {
					tmo = requestAnimationFrame(fallback);
				} else {
					setScale(w, h);
					lw = w;
					lh = h;
					tmo = undefined;
				}
			}

			function setScale(width, height, useWidth) {
				if (width && height) {
					const sw = Math.min(width, height);
					let r = sw / minWidth;
					if (r > 1) {
						r = Math.sqrt(r);
					}
					if (useWidth) {
						r = 'user-scalable=no, width=' + Math.round(width / r);
					} else {
						r = sw / Math.round(sw / r);
						r = 'user-scalable=no, initial-scale=' + r + ', maximum-scale=' + r + ', minimum-scale=' + r;
					}
					if (t.content !== r) {
						t.content = r;
					}
				}
			}
		})();
		//事件处理
		(() => {
			const key = typeof Symbol === 'function' ? Symbol('xEvents') : 'xEvents';
			fusion.listeners = {
				on(o, e, f) {
					let result = 0;
					if (typeof f === 'function') {
						if (!Object.hasOwn(o, key)) {
							o[key] = { __proto__: null };
						}
						if (!(e in o[key])) {
							o[key][e] = {
								stack: [],
								heap: [],
								locked: false
							};
							o['on' + e] = xEventProcessor;
						}
						if (o[key][e].locked) {
							o[key][e].stack.push([f]);
							result = 2;
						} else if (o[key][e].heap.indexOf(f) < 0) {
							o[key][e].heap.push(f);
							result = 1;
						}
					}
					return result;
				},
				once(o, e, f) {
					fusion.listeners.on(o, e, function ff(evt) {
						fusion.listeners.off(o, e, ff);
						f.call(o, evt);
					});
				},
				list(o, e) {
					let result;
					if (e) {
						result = Object.hasOwn(o, key) && e in o[key] ? o[key][e].heap.slice(0) : [];
					} else {
						result = { __proto__: null };
						if (Object.hasOwn(o, key)) {
							for (let i in o[key]) {
								result[i] = o[key][i].heap.slice(0);
							}
						}
					}
					return result;
				},
				off(o, e, f) {
					let result = 0;
					if (Object.hasOwn(o, key)) {
						if (e) {
							if (e in o[key]) {
								if (o[key][e].locked) {
									o[key][e].stack.push(f);
									result = 2;
								} else if (typeof f === 'function') {
									let i = o[key][e].heap.indexOf(f);
									if (i >= 0) {
										o[key][e].heap.splice(i, 1);
										cleanup(o, e);
										result = 1;
									}
								} else {
									cleanup(o, e, true);
									result = 1;
								}
							}
						} else {
							for (const i in o[key]) {
								if (o[key][i].locked) {
									o[key][i].stack.push(undefined);
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
				},
				trigger(o, e, d = { __proto__: null }) {
					const s = 'on' + e;
					if (typeof o[s] === 'function') {
						d.type = e;
						o[s](d);
					}
				}
			};

			function xEventProcessor(evt) {
				const p = this[key][evt.type];
				p.locked = true;
				for (let i = 0; i < p.heap.length; i++) {
					p.heap[i].call(this, evt);
				}
				p.locked = false;
				while (p.stack.length) {
					if (p.stack[0]) {
						if (typeof p.stack[0] === 'function') {
							const i = p.heap.indexOf(p.stack[0]);
							if (i >= 0) {
								p.heap.splice(i, 1);
							}
						} else if (p.heap.indexOf(p.stack[0][0]) < 0) {
							p.heap.push(p.stack[0][0]);
						}
					} else {
						p.heap.splice(0);
					}
					p.stack.shift();
				}
				cleanup(this, evt.type);
			}

			function cleanup(o, e, force) {
				if (force || !o[key][e].heap.length) {
					delete o[key][e];
					o['on' + e] = null;
				}
			}
		})();

		(() => {
			fusion.scrollReload = function (dom, func) {
				let y, st, reloadHint, scrolled;
				const events = pointerevents(dom, evt => {
					if (evt.type === 'start') {
						if (events.pointers.length === 0 && this.getScrollTop(dom) === 0) {
							y = evt.y;
							evt.domEvent.view.addEventListener('scroll', scrolling, true);
							return true;
						}
					} else {
						if (scrolled) {
							scrolled = false;
							return true;
						} else {
							if (evt.y > y) {
								if (!st) {
									st = true;
									evt.domEvent.view.removeEventListener('scroll', scrolling, true);
								}
								evt.domEvent.preventDefault();
								evt.domEvent.stopPropagation();
								if (!reloadHint) {
									reloadHint = this.makeSvg('mdiRefresh', 3);
									reloadHint.classList.add('reloadHint');
									dom.appendChild(reloadHint);
								}
								const h = 40, //this height is defined in fusion.less
									v = evt.y - y - h;
								if (v < h) {
									reloadHint.classList.remove('pin');
									reloadHint.style.top = v * 17 / 16 - Math.pow(v, 2) * 17 / (32 * h) + h * 11 / 32 + 'px';
									reloadHint.style.opacity = (v + h) / (h * 2);
									reloadHint.style.transform = 'rotate(' + 360 * reloadHint.style.opacity + 'deg)';
								} else if (!reloadHint.classList.contains('pin')) {
									reloadHint.style.top = h + 'px';
									reloadHint.style.opacity = 1;
									reloadHint.classList.add('pin');
									reloadHint.style.transform = '';
									if (navigator.vibrate) {
										navigator.vibrate(10);
									}
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
											this.reloadPage();
										}
									}
									reloadHint = undefined;
								}
								st = false;
							}
						}
					}
				});
				this.fixIosScrolling(dom);

				function scrolling(evt) {
					if (evt.target !== dom) {
						scrolled = true;
						this.removeEventListener('scroll', scrolling, true);
					}
				}
			};

			//fix ios vertical overscrolling on viewport issue
			fusion.fixIosScrolling = function (o, hscroll, rev) {
				if (browser.name === 'IOS') {
					const one = rev ? -1 : 1;
					o.addEventListener('touchmove', stopEvent, {
						passive: false
					});
					if (!hscroll) {
						o.classList.add('iosScrollFix');
						if (rev) {
							o.classList.add('rev');
						}
						o.scrollTop = one;
						o.onscroll = function () {
							if (this.scrollTop === 0) {
								console.log(this.scrollTop);
								this.scrollTop = one;
							} else if (this.scrollTop + this.clientHeight === this.scrollHeight) {
								console.log(this.scrollTop);
								this.scrollTop -= one;
							}
						};
					}
				}
			};

			fusion.getScrollTop = (o, rev) => o.classList.contains('iosScrollFix') ? o.scrollTop + (rev ? 1 : -1) : o.scrollTop;
			fusion.getScrollHeight = o => o.classList.contains('iosScrollFix') ? o.scrollHeight - 2 : o.scrollHeight;
			fusion.setScrollTop = (o, v, rev) => o.scrollTop = o.classList.contains('iosScrollFix') ? v + (rev ? -1 : 1) : v;
		})();

		(() => {
			const helper = document.body.querySelector('#helper'),
				tb = helper.firstChild,
				img = helper.lastChild;
			let allSteps;
			helper.onclick = nextStep;
			fusion.showHelper = function (steps) {
				allSteps = Array.isArray(steps) ? steps : [steps];
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
				for (let i = 0; i < tb.childElementCount; i++) {
					let tmp = tb.children[i];
					if (step.rows[i]) {
						tmp.style.height = step.rows[i];
						tmp.className = 'unflexable';
					} else {
						tmp.style.height = 'auto';
						tmp.className = 'flexable';
					}
				}
				for (let i = 0; i < tb.children[1].childElementCount; i++) {
					let tmp1 = tb.children[1].children[i];
					if (step.cells[i]) {
						tmp1.style.width = step.cells[i];
						tmp1.className = 'unflexable';
					} else {
						tmp1.style.width = 'auto';
						tmp1.className = 'flexable';
					}
				}
			}
		})();

		//侧边栏
		(() => {
			let animating, activePanel, todo, o, x, ox, nx, ot, nt, moving, scrolled;
			const panelBox = document.querySelector('#panel'),
				content = panelBox.querySelector(':scope>.content'),
				events = pointerevents(panelBox, function (evt) {
					if (evt.type === 'start') {
						if (!events.pointers.length && !animating) {
							o = content.querySelector(':scope>.' + activePanel);
							ox = nx = x = evt.x;
							ot = nt = evt.domEvent.timeStamp;
							evt.domEvent.view.addEventListener('scroll', scrolling, true);
							return true;
						}
					} else if (scrolled) {
						scrolled = false;
						return true;
					} else {
						if (evt.type === 'move') {
							ox = nx;
							ot = nt;
							nx = evt.x;
							nt = evt.domEvent.timeStamp;
							if (!moving && Math.abs(nx - x) > 5) {
								moving = true;
								evt.domEvent.view.removeEventListener('scroll', scrolling, true);
							}
							if (moving) {
								evt.domEvent.preventDefault();
								content.style.transform = 'translateX(' + Math.max(Math.min(nx - x, 0), -content.offsetWidth) + 'px)';
							}
						} else {
							if (moving) {
								let speed = (evt.x - ox) / (evt.domEvent.timeStamp - ot),
									s = Math.pow(speed, 2) * 4000;
								if (speed < 0) {
									s = -s;
								}
								s = s + nx - x < -content.offsetWidth / 2;
								if (((s && !fusion.closePanel()) || !s) && content.style.transform !== 'translateX(0px)') {
									content.style.transition = '';
									content.style.transform = 'translateX(0px)';
									content.ontransitionend = function (evt) {
										if (evt.target === this) {
											this.style.transition = 'none';
											this.ontransitionend = null;
										}
									};
								}
							} else {
								evt.domEvent.view.addEventListener('scroll', scrolling, true);
							}
							scrolled = moving = false;
						}
					}
				});
			fusion.openPanel = function (id, param) {
				if (id in panels) {
					initLoad('panel', id, function (firstLoad) {
						if (typeof panels[id].open === 'function') {
							panels[id].open(param);
						} else {
							fusion.showPanel(id);
						}
					});
					return true;
				}
			};
			fusion.showPanel = function (id) {
				let result = 0;
				if (panels[id].status > 1) {
					if (animating) {
						todo = fusion.showPopup.bind(this, id);
						result = 2;
					} else if (!activePanel) {
						panels[id].status++;
						if (typeof panels[id].onload === 'function') {
							panels[id].onload();
						}
						panelBox.style.visibility = 'inherit';
						animating = content.querySelector(':scope>.' + id);
						animating.style.right = animating.style.top = 'auto';
						animating.style.position = 'relative';
						content.style.width = animating.offsetWidth + 'px'; //safari fix
						content.style.transform = 'translateX(0px)';
						panelBox.className = activePanel = id;
					} else if (activePanel === id) {
						if (typeof panels[id].onload !== 'function') {
							panels[id].onload();
						}
						if (typeof panels[id].onloadend === 'function') {
							panels[id].onloadend();
						}
						result = 1;
					} else if (hidePanel()) {
						todo = fusion.showPanel.bind(this, id);
						result = 1;
					}
				}
				return result;
			};
			fusion.closePanel = function (id) {
				let result = 0;
				if (animating) {
					todo = fusion.closePanel.bind(this, id);
					result = 2;
				} else if (activePanel && (!id || activePanel === id || (Array.isArray(id) && id.indexOf(activePanel) >= 0)) && hidePanel()) {
					result = 1;
				}
				return result;
			};
			Object.defineProperty(fusion, 'currentPanel', {
				enumerable: true,
				get: () => activePanel
			});
			fusion.destroyPanel = function (id) {
				if (panels[id].status === 2) {
					destroy(panels[id], 'panel', id);
					return true;
				}
			};
			content.addEventListener('transitionend', function (evt) {
				if (animating && evt.target === this) {
					if (this.style.transform) {
						if (typeof panels[activePanel].onloadend === 'function') {
							panels[activePanel].onloadend();
						}
						panels[activePanel].status++;
						this.style.width = ''; //safari fix
						this.style.transition = 'none';
					} else {
						if (typeof panels[activePanel].onunloadend === 'function') {
							panels[activePanel].onunloadend();
						}
						panels[activePanel].status--;
						animating.style.position = animating.style.right = animating.style.top = '';
						if (panels[activePanel].autoDestroy) {
							destroy(panels[activePanel], 'panel', activePanel);
						} else if (document.activeElement && animating.contains(document.activeElement)) {
							document.activeElement.blur();
						}
						activePanel = undefined;
						panelBox.style.visibility = '';
					}
					animating = undefined;
					if (todo) {
						let tmp = todo;
						todo = undefined;
						tmp();
					}
				}
			});

			function hidePanel() {
				if (typeof panels[activePanel].onunload !== 'function' || !panels[activePanel].onunload()) {
					panels[activePanel].status--;
					animating = content.querySelector(':scope>.' + activePanel);
					content.style.transition = content.style.transform = '';
					return true;
				}
			}

			function scrolling() {
				scrolled = true;
				this.removeEventListener('scroll', scrolling, true);
			}
		})();

		//弹出窗口
		(() => {
			let activePopup, tempBack, tempBackParam, animating, todo;
			const popupsBox = document.body.querySelector('#popup'),
				popupClose = popupsBox.querySelector(':scope>.header>.close'),
				title = popupsBox.querySelector(':scope>.header>.title'),
				back = popupsBox.querySelector(':scope>.header>.back');

			// 如果弹窗有自定义打开方式则直接调用该接口，否则会调用showPopup
			// 如果定义了open请确保最终打开自己时调用的是showPopup而不是openPopup
			fusion.openPopup = function (id, param, goBack) {
				if (id in popups) {
					initLoad('popup', id, function () {
						if (typeof popups[id].open === 'function') {
							popups[id].open(param, activePopup && goBack);
						} else {
							fusion.showPopup(id, goBack);
						}
					});
					return true;
				}
			};
			// 普通弹窗
			fusion.showPopup = function (id, goBack) { //显示弹出窗口
				let result = 0;
				if (popups[id].status > 1) {
					if (animating) {
						todo = fusion.showPopup.bind(this, id, goBack);
						result = 2;
					} else if (!activePopup) {
						popups[id].status++;
						if (typeof popups[id].onload === 'function') {
							popups[id].onload();
						}
						let toshow = popupsBox.querySelector(':scope>.content>.' + id);
						toshow.style.left = 0;
						toshow.style.visibility = 'inherit';
						popupsBox.classList.add('in');
						animating = id;
						fusion.listeners.trigger(fusion.popupEvents, 'show', { id });
						popupSwitched(id);
						fusion.hideReadable();
						result = 1;
					} else if (activePopup === id) {
						if (typeof popups[id].onload === 'function') {
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
						viewSwitch(popupsBox.querySelector(':scope>.content>.' + id), tohide, goBack, function () {
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
			fusion.closePopup = function (id) {
				let result = 0;
				if (animating) {
					todo = fusion.closePopup.bind(this, id);
					result = 2;
				} else if (activePopup && (!id || activePopup === id || (Array.isArray(id) && id.indexOf(activePopup) >= 0)) && (typeof popups[activePopup].onunload !== 'function' || !popups[activePopup].onunload())) { //onunload 返回 true可以阻止窗口关闭
					popups[activePopup].status--;
					popupsBox.classList.remove('in');
					popupsBox.classList.add('out');
					animating = true;
					fusion.listeners.trigger(fusion.popupEvents, 'hide', { id: activePopup });
					result = 1;
				}
				return result;
			};
			// 获取当前显示的 popup id
			Object.defineProperty(fusion, 'currentPopup', {
				enumerable: true,
				get: () => activePopup
			});
			// 如果未指定id则临时改变当前弹窗的后退位置, 临时修改不能在loadend之前使用
			// 参数1 需要返回的页面id
			// 参数2 如果提供; 就会永久修改 指定页面的 后退页面ID
			fusion.setPopupBack = function (backid, param) {
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
			fusion.setPopupTitle = function (newTitle, id) {
				if (id) {
					if (id in popups) {
						popups[id].title = newTitle;
						if (activePopup === id) {
							if (!popups[id].titleContent) {
								title.textContent = newTitle;
							}
							if (document.body.classList.contains('hidePopupHeader')) {
								document.title = newTitle;
							}
						}
					}
				} else if (popupsBox.classList.contains('in')) {
					if (!popups[activePopup].titleContent) {
						title.textContent = newTitle;
					}
					if (document.body.classList.contains('hidePopupHeader')) {
						document.title = newTitle;
					}
				}
			};
			fusion.destroyPopup = function (id) {
				if (popups[id].status === 2) {
					destroy(popups[id], 'popup', id);
					return true;
				}
			};
			// 包含onshow, onshowend, onhide, onhideend
			fusion.popupEvents = { __proto__: null };
			popupsBox.querySelector(':scope>.content')[anievt] = viewAnimationEnd;
			// 初始化窗口关闭按钮
			popupClose.appendChild(fusion.makeSvg('mdiWindowClose', 1));
			popupClose.onclick = fusion.closePopup.bind(fusion, undefined);
			// 初始化窗口返回按钮
			back.insertBefore(fusion.makeSvg('mdiChevronLeft', 1), back.firstChild);
			back.onclick = function () {
				if (typeof tempBack === 'function') {
					tempBack(tempBackParam);
				} else {
					fusion.openPopup(tempBack, tempBackParam, true);
				}
			};
			popupsBox[anievt] = function (evt) {
				if (evt.target === this) {
					animating = false;
					if (this.classList.contains('out')) {
						this.classList.remove('out');
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
						if (typeof fusion.popupEvents.onhideend === 'function') {
							fusion.popupEvents.onhideend({
								type: 'hideend',
								id: activePopup
							});
						}
						activePopup = undefined;
					} else {
						if (typeof fusion.popupEvents.onshowend === 'function') {
							fusion.popupEvents.onshowend({
								type: 'showend',
								id: activePopup
							});
						}
						if (typeof popups[activePopup].onloadend === 'function') {
							popups[activePopup].onloadend();
						}
						popups[activePopup].status++;
					}
					if (typeof todo === 'function') {
						let tmp = todo;
						todo = undefined;
						tmp();
					}
				}
			};

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
				if (typeof popups[id].titleContent === 'string') {
					title.innerHTML = typeof popups[id].titleContent;
				} else if (popups[id].titleContent instanceof Node) {
					title.replaceChildren(popups[id].titleContent);
				} else if (popups[id].titleContent && typeof popups[id].titleContent[Symbol.iterator] === 'function') {
					title.replaceChildren(...popups[id].titleContent);
				} else {
					title.replaceChildren(popups[id].title);
				}
				if (document.body.classList.contains('hidePopupHeader')) {
					document.title = popups[id].title;
				}
				back.style.display = 'none';
			}
		})();
		// 内置特殊弹窗, 会显示在普通弹窗之上, 并且彼此独立
		(() => {
			let readableBox = document.body.querySelector('#readable'),
				readableClose = readableBox.querySelector(':scope>.close'),
				readableContent = readableBox.querySelector(':scope>.content'),
				raCallback, cls;

			fusion.fixIosScrolling(readableContent);
			cls = readableContent.className;
			fusion.showReadable = function (html, callback, className) { //展示静态内容
				if (typeof html === 'string') {
					readableContent.innerHTML = html;
				} else if (html instanceof Node) {
					readableContent.replaceChildren(html);
				} else if (html && typeof html[Symbol.iterator] === 'function') {
					readableContent.replaceChildren(...html);
				} else {
					readableContent.innerHTML = '';
				}
				readableContent.className = className ? cls + ' ' + className : cls;
				readableBox.className = 'in';
				raCallback = callback;
			};
			fusion.hideReadable = function () {
				if (readableBox.classList.contains('in')) {
					readableBox.classList.remove('in');
					readableBox.classList.add('out');
					if (typeof raCallback === 'function') {
						raCallback();
					}
				}
			};
			fusion.showForeign = function (url, callback) { //展示站外内容
				fusion.showReadable(`<iframe frameborder="no" scrolling="${browser.name === 'IOS' ? 'no' : 'auto'}" sandbox="allow-same-origin allow-forms allow-scripts allow-modals" src="${url}"></iframe>`, callback, 'foreign');
			};
			readableClose.appendChild(fusion.makeSvg('mdiCloseThick', 1));
			readableClose.onclick = fusion.hideReadable;
			readableBox[anievt] = function (evt) {
				if (evt.target === this && this.classList.contains('out')) {
					while (readableContent.hasChildNodes()) {
						readableContent.firstChild.remove();
					}
					this.className = '';
				}
			};
		})();
		//对话框及提示功能
		(() => {
			let hintmo, onClose, cp, w, h,
				dlgId = 0,
				loadingRT = 0;
			const dlgStack = [],
				photos = [],
				loadingCtn = document.body.querySelector('#loading'),
				hintCtn = document.body.querySelector('#hint'),
				dialogCtn = document.body.querySelector('#dialog'),
				dialogBox = dialogCtn.querySelector(':scope>div'),
				dialogContent = dialogBox.querySelector(':scope>.content'),
				yesbtn = dialogBox.querySelector(':scope>.btns>.yes'),
				nobtn = dialogBox.querySelector(':scope>.btns>.no'),
				dialogClose = dialogBox.querySelector(':scope>.close'),
				sliderViewCtn = document.body.querySelector('#sliderView'),
				sliderViewClose = sliderViewCtn.querySelector(':scope>.close'),
				slider = touchslider(sliderViewCtn.querySelector(':scope>.content')),
				photoViewBox = document.body.querySelector('#photoView'),
				photoViewCtn = photoViewBox.querySelector(':scope>.content'),
				photoViewClose = photoViewBox.querySelector(':scope>.close'),
				photoViewActions = photoViewBox.querySelector(':scope>.actions'),
				flip = photoViewActions.querySelector(':scope>.flip'),
				rotate = photoViewActions.querySelector(':scope>.rotate'),
				prev = photoViewActions.querySelector(':scope>.prev'),
				next = photoViewActions.querySelector(':scope>.next'),
				guesture = touchguesture(photoViewCtn);
			fusion.showPhotoView = function (urls, cur = 0, btns, cb) {
				cp = cur;
				for (let i = 0; i < urls.length; i++) {
					const ctn = document.createElement('div'),
						img = document.createElement('img');
					if (cur === i) {
						ctn.style.visibility = 'inherit';
					}
					ctn.appendChild(img);
					photoViewCtn.appendChild(ctn);
					img.src = urls[i];
					img.onload = imgload.bind(img, i);
					img.ontransitionend = transend;
				}
				prev.style.display = next.style.display = urls.length > 1 ? '' : 'none';
				if (typeof cb === 'function' && btns && btns.length) {
					for (let i = 0; i < btns.length; i++) {
						const tmp = document.createElement('a');
						tmp.append(btns[i]);
						tmp.onclick = () => cb(i, cp);
						next.insertAdjacentElement('beforebegin', tmp);
					}
				}
				photoViewBox.style.visibility = 'inherit';
			};
			fusion.hidePhotoView = function () {
				while (photoViewActions.childElementCount > 4) {
					photoViewActions.children[3].remove();
				}
				photos.splice(0);
				cp = undefined;
				photoViewCtn.innerHTML = photoViewBox.style.visibility = '';
			};
			fusion.getPhotoOrientation = function (i) {
				const p = photos[i];
				if (p) {
					let r = p.r,
						f = p.fx;
					if (p.fy) {
						f *= -1;
						r += 2;
					}
					r %= 4;
					if (r === 1) {
						return f ? 5 : 8;
					} else if (r === 2) {
						return f ? 4 : 3;
					} else if (r === 3) {
						return f ? 7 : 6;
					} else {
						return f ? 2 : 1;
					}
				}
			};
			fusion.showSliderView = function (doms, idx, className) {
				sliderViewCtn.className = className || '';
				for (let i = 0; i < doms.length; i++) {
					slider.add(doms[i]);
				}
				if (idx) {
					slider.slideTo(idx, true);
				}
			};
			fusion.hideSliderView = function () {
				slider.clear();
			};
			//alert对话框
			fusion.alert = (text, onclose, onopen) => openDialog('alert', text, onclose, onopen);
			//yes no对话框
			fusion.confirm = (text, onclose, onopen) => openDialog('confirm', text, onclose, onopen);
			//自定义内容的对话框
			fusion.htmlDialog = (html, className, onclose, onopen) => openDialog(className || '', html, onclose, onopen);
			//通用对话框关闭方法
			fusion.closeDialog = function (param, id) {
				const t = typeof id === 'number';
				if (!t || id === dlgId) {
					if (typeof onClose === 'function') {
						onClose(param, id);
						onClose = undefined;
					}
					dialogCtn.style.visibility = '';
					while (dialogContent.hasChildNodes()) {
						dialogContent.lastChild.remove();
					}
					let g;
					while (dlgStack.length && !g) {
						g = dlgStack.shift();
						if (g) {
							openDialog.apply(undefined, g);
						} else {
							++dlgId;
						}
					}
				} else if (t && t > dlgId && id <= dlgId + dlgStack.length) {
					dlgStack[id - dlgId - 1] = undefined;
				}
			};
			fusion.showLoading = function (text) { //loading提示框, 每次调用引用计数+1所以showLoading和hideLoading必须成对使用
				loadingCtn.querySelector(':scope>div').lastChild.data = text ? text : lang.loading;
				if (loadingRT === 0) {
					loadingCtn.style.visibility = 'inherit';
				}
				loadingRT++;
			};
			fusion.hideLoading = function () {
				if (loadingRT > 0) {
					loadingRT--;
					if (loadingRT === 0) {
						loadingCtn.style.visibility = '';
						fusion.listeners.trigger(fusion.dialogEvents, 'loaded');
					}
				}
			};
			Object.defineProperty(fusion, 'isLoading', {
				get: () => loadingRT > 0
			});
			fusion.hint = function (text, t) { //底部提示, 不干扰用户操作, 默认显示5秒
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
			fusion.dialogEvents = { __proto__: null };
			self.addEventListener('resize', resize);
			guesture.onzoomstart = zoomstart;
			guesture.ondragstart = dragstart;
			photoViewCtn[anievt] = viewAnimationEnd;
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
			yesbtn.onclick = fusion.closeDialog.bind(fusion, true);
			nobtn.onclick = dialogClose.onclick = fusion.closeDialog.bind(fusion, false);
			prev.onclick = function () {
				const ncp = cp === 0 ? photoViewCtn.childElementCount - 1 : cp - 1;
				viewSwitch(photoViewCtn.children[ncp], photoViewCtn.children[cp], true, () => cp = ncp);
			};
			next.onclick = function () {
				const ncp = cp === photoViewCtn.childElementCount - 1 ? 0 : cp + 1;
				viewSwitch(photoViewCtn.children[ncp], photoViewCtn.children[cp], false, () => cp = ncp);
			};
			flip.onclick = function () {
				const p = photos[cp];
				if (p) {
					if (p.r % 2) {
						p.fy *= -1;
					} else {
						p.fx *= -1;
					}
					sync(cp, true);
				}
			};
			rotate.onclick = function () {
				const p = photos[cp];
				if (p) {
					p.r += 1;
					sync(cp, true);
				}
			};
			prev.appendChild(fusion.makeSvg('mdiChevronLeft', 1));
			next.appendChild(fusion.makeSvg('mdiChevronRight', 1));
			flip.appendChild(fusion.makeSvg('mdiFlipHorizontal', 1));
			rotate.appendChild(fusion.makeSvg('mdiFileRotateRightOutline', 1));
			dialogClose.appendChild(fusion.makeSvg('mdiWindowClose', 1));
			sliderViewClose.appendChild(fusion.makeSvg('mdiCloseThick', 1));
			photoViewClose.appendChild(sliderViewClose.firstChild.cloneNode(true));
			sliderViewClose.onclick = fusion.hideSliderView;
			photoViewClose.onclick = fusion.hidePhotoView;
			resize();

			function resize() {
				w = photoViewCtn.clientWidth;
				h = photoViewCtn.clientHeight;
				for (let i = 0; i < photos.length; i++) {
					sync(i);
				}
			}
			function imgload(i) {
				photos[i] = {
					img: this,
					ow: this.naturalWidth,
					oh: this.naturalHeight,
					r: 0,
					x: 0,
					y: 0,
					fx: 1,
					fy: 1,
					z: 0
				};
				sync(i);
			}
			function transend() {
				this.style.transitionProperty = '';
			}
			function sync(i, ani) {
				const p = photos[i];
				if (p) {
					const pr = p.r % 2,
						z = Math.min(w / (pr ? p.oh : p.ow), h / (pr ? p.ow : p.oh));
					if (p.z < z) {
						p.z = z;
					}
					const pw = p.ow * p.z,
						ph = p.oh * p.z;
					if (pr) {
						if (ph > w) {
							p.x = Math.min(Math.max(w - (ph + pw) / 2, p.x), (ph - pw) / 2);
						} else {
							p.x = (w - pw) / 2;
						}
						if (pw > h) {
							p.y = Math.min(Math.max(h - (ph + pw) / 2, p.y), (pw - ph) / 2);
						} else {
							p.y = (h - ph) / 2;
						}
					} else {
						if (pw > w) {
							p.x = Math.min(Math.max(w - pw, p.x), 0);
						} else {
							p.x = (w - pw) / 2;
						}
						if (ph > h) {
							p.y = Math.min(Math.max(h - ph, p.y), 0);
						} else {
							p.y = (h - ph) / 2;
						}
					}
					if (ani) {
						p.img.style.transitionProperty = 'transform,width,height,top,left';
					}
					p.img.style.transform = `rotate(${p.r * 90}deg) scale(${p.fx},${p.fy})`;
					p.img.style.width = pw + 'px';
					p.img.style.height = ph + 'px';
					p.img.style.left = p.x + 'px';
					p.img.style.top = p.y + 'px';
				}
			}

			function openDialog(type, content, onclose, onopen) {
				if (dialogCtn.style.visibility === 'inherit') {
					dlgStack.push([type, content, onclose, onopen]);
					return dlgId + dlgStack.length;
				} else {
					if (type === 'alert') {
						if (Array.isArray(content)) {
							dialogContent.textContent = content[0];
							yesbtn.firstChild.data = content[1];
						} else {
							dialogContent.textContent = content;
							nobtn.firstChild.data = lang.close;
						}
					} else if (type === 'confirm') {
						if (Array.isArray(content)) {
							dialogContent.textContent = content[0];
							yesbtn.firstChild.data = content[1];
							nobtn.firstChild.data = content[2];
						} else {
							dialogContent.textContent = content;
							yesbtn.firstChild.data = lang.yes;
							nobtn.firstChild.data = lang.no;
						}
					} else if (typeof content === 'string') {
						dialogContent.innerHTML = content;
					} else if (content instanceof Node) {
						dialogContent.replaceChildren(content);
					} else if (content && typeof content[Symbol.iterator] === 'function') {
						dialogContent.replaceChildren(...content);
					} else {
						dialogContent.innerHTML = '';
					}
					dialogBox.className = type;
					dialogCtn.style.visibility = 'inherit';
					++dlgId;
					onClose = onclose;
					if (typeof onopen === 'function') {
						onopen(dlgId);
					}
					return dlgId;
				}
			}

			function zoomstart(evt) {
				const p = photos[cp];
				if (p) {
					const x = evt.x,
						y = evt.y,
						oz = p.z,
						zoomchange = evt => {
							const nz = Math.min(evt.zoom * oz, 1);
							if (nz !== p.z) {
								p.x = x + (p.x - x) * nz / p.z;
								p.y = y + (p.y - y) * nz / p.z;
								p.z = nz;
								sync(cp);
							}
						};
					this.onzoomstart = null;
					this.onzoomchange = zoomchange;
					this.onzoomend = evt => {
						zoomchange(evt);
						this.onzoomchange = this.zoomend = null;
						this.onzoomstart = zoomstart;
					};
				}
			}

			function dragstart(evt) {
				const p = photos[cp];
				if (p) {
					const x = evt.x,
						y = evt.y,
						ox = p.x,
						oy = p.y,
						dragmove = evt => {
							p.x = ox + evt.x - x;
							p.y = oy + evt.y - y;
							sync(cp);
						};
					this.ondragstart = null;
					this.ondragmove = dragmove;
					this.ondragend = evt => {
						dragmove(evt);
						this.ondragmove = this.ondragend = null;
						this.ondragstart = dragstart;
					};
				}
			}
		})();
	}
	//页面加载相关功能
	(() => {
		//此处不能使用fusion.lastLocation.id, 因为currentpage仅在页面加载成功才会更新
		//而fusion.lastLocation.id在页面加载前就已经更新, 无法确保成功加载
		let routerHistory, currentpage, animating, todo, navIcos;
		const historyName = location.pathname,
			pagesBox = document.body.querySelector('#page'),
			navCtn = pagesBox.querySelector(':scope>.navMenu'),
			pageTitle = pagesBox.querySelector(':scope>.header>.title'),
			backbtn = pagesBox.querySelector(':scope>.header>.back'),
			headerLeftMenuBtn = pagesBox.querySelector(':scope>.header>.leftMenuBtn'),
			headerRightMenuBtn = pagesBox.querySelector(':scope>.header>.rightMenuBtn');
		//if private browsing is enabled, Safari will throw a stupid exception when calling setItem from sessionStorage or localStorage. the fallowing code can avoid this.
		try {
			sessionStorage.setItem(0, 0);
			sessionStorage.removeItem(0);
		} catch (e) {
			Storage.prototype.setItem = function () { };
		}
		//icos是导航菜单的列表
		//home是默认页
		fusion.init = function (navs) {
			let home;
			const icos = { __proto__: null };
			for (let i = 0; i < navs.length; i++) {
				let id, ico;
				if (typeof navs[i] === 'string') {
					id = navs[i];
				} else {
					id = navs[i].id;
					ico = navs[i].ico;
				}
				if (id in pages) {
					if (!home) {
						home = id;
					}
					icos[id] = ico;
				}
			}
			if (home) {
				if (homePage) {
					initNavs(icos);
					if (homePage !== home) {
						let oldHome = homePage;
						homePage = home;
						if (fusion.location.id === oldHome) {
							hashchange();
							return true;
						}
					}
				} else {
					homePage = home;
					// 当前URL
					fusion.location = fusion.parseHash(location.hash);
					// 如果带ui参数就把参数中样式加入body
					if (fusion.location.args.ui) {
						fusion.location.args.ui.split(',').forEach(function (item) {
							document.body.classList.add(item);
						});
					}
					// 看是否有history
					routerHistory = sessionStorage.getItem(historyName);
					if (routerHistory) {
						routerHistory = routerHistory.parseJsex();
						if (routerHistory) {
							routerHistory = routerHistory.value;
						}
					}
					if (!routerHistory) {
						routerHistory = { __proto__: null };
					}
					// 解析 routerHistory
					for (let n in routerHistory) {
						if (n in pages) {
							pages[n].backLoc = routerHistory[n];
						}
					}
					self.addEventListener('hashchange', hashchange);
					initNavs(icos);
					manageLocation();
					if ('autoPopup' in fusion.location.args) {
						let tmp;
						if ('autoPopupArg' in fusion.location.args) {
							tmp = fusion.location.args.autoPopupArg.parseJsex();
							if (tmp) {
								tmp = tmp.value;
							}
						}
						if (fusion.openPopup(fusion.location.args.autoPopup, tmp)) {
							document.body.querySelector('#popup').style[anidru] = '1ms';
							fusion.listeners.on(fusion.popupEvents, 'showend', removeLoading);
						} else {
							removeLoading();
						}
					} else {
						removeLoading();
					}
				}
			}
		};
		//刷新当前页
		fusion.reloadPage = function (id, silent) {
			let thislocation;
			// 是否有数据正在加载
			if (fusion.isLoading) {
				thislocation = fusion.location;
				// 注册监听 ; loaded
				fusion.listeners.on(fusion.dialogEvents, 'loaded', function listener(evt) {
					fusion.listeners.off(this, evt.type, listener);
					// url 是否改变
					if (thislocation === fusion.location) {
						reloadPage(id, silent);
					}
				});
			} else {
				reloadPage(id, silent);
			}
		};
		fusion.destroyPage = function (id) {
			if (pages[id].status === 2) {
				destroy(pages[id], 'page', id);
				return true;
			}
		};
		fusion.pageEvents = { __proto__: null };
		pagesBox.querySelector(':scope>.content')[anievt] = viewAnimationEnd;
		backbtn.insertBefore(fusion.makeSvg('mdiChevronLeft', 1), backbtn.firstChild);
		headerRightMenuBtn.onclick = function () {
			const page = pages[pages[currentpage].alias ? pages[currentpage].alias : currentpage];
			if (typeof page.onrightmenuclick === 'function') {
				page.onrightmenuclick();
			}
		};
		headerLeftMenuBtn.onclick = function () {
			const page = pages[pages[currentpage].alias ? pages[currentpage].alias : currentpage];
			if (typeof page.onleftmenuclick === 'function') {
				page.onleftmenuclick();
			}
		};

		function removeLoading(evt) {
			if (evt) {
				fusion.listeners.off(this, evt.type, removeLoading);
				setTimeout(function () {
					document.body.querySelector('#popup').style[anidru] = '';
				}, 400);
			}
			document.body.addEventListener('transitionend', tsend);
			document.documentElement.classList.remove('loading');
		}

		function tsend(evt) {
			if (evt.target === this) {
				this.removeEventListener(evt.type, tsend);
				this.style.transition = '';
			}
		}

		function initNavs(icos) {
			while (navCtn.hasChildNodes()) {
				navCtn.firstChild.remove();
			}
			navIcos = icos;
			for (const n in navIcos) {
				if (n in pages) {
					const nav = navCtn.appendChild(document.createElement('a'));
					nav.className = n;
					nav.href = '#/' + n;
					if (RegExp('^' + n + '(?:-|$)').test(fusion.location.id)) {
						nav.classList.add('selected');
						if (navIcos[n]) {
							nav.appendChild(fusion.makeSvg(typeof navIcos[n] === 'string' ? navIcos[n] : navIcos[n][1], 1));
						}
					} else {
						if (navIcos[n]) {
							nav.appendChild(fusion.makeSvg(typeof navIcos[n] === 'string' ? navIcos[n] : navIcos[n][0], 1));
						}
					}
					nav.append(pages[n].alias ? pages[n].title || pages[pages[n].alias].title : pages[n].title);
				}
			}
		}

		function hashchange() {
			const newLocation = fusion.parseHash(location.hash);
			// 如果url 发生改变 就执行
			if (!fusion.isSameLocation(newLocation, fusion.location)) {
				fusion.lastLocation = fusion.location;
				fusion.location = newLocation;
				// 如果是前进操作
				if ((pages[fusion.location.id].back && (fusion.lastLocation.id === pages[fusion.location.id].back || pages[fusion.lastLocation.id].alias === pages[fusion.location.id].back))) {
					// 把上一页赋值给他的后退页
					routerHistory[fusion.location.id] = pages[fusion.location.id].backLoc = fusion.lastLocation;
					// 记录到 sessionStorage
					sessionStorage.setItem(historyName, toJsex(routerHistory));
				} // 如果是 后退操作
				else if (pages[fusion.lastLocation.id].backLoc && (fusion.location.id === pages[fusion.lastLocation.id].back || (pages[fusion.location.id].alias && pages[fusion.location.id].alias === pages[fusion.lastLocation.id].back))) {
					// 剔除最后一次 back 对象
					delete pages[fusion.lastLocation.id].backLoc;
					delete routerHistory[fusion.lastLocation.id];
					sessionStorage.setItem(historyName, toJsex(routerHistory));
				}
				manageLocation();
			}
		}

		function manageLocation() {
			const pageid = fusion.location.id;
			if ('lastLocation' in fusion) {
				const n = pageid.replace(/-.*$/, ''),
					m = fusion.lastLocation.id.replace(/-.*$/, '');
				if (n !== m) {
					let nav = navCtn.querySelector(':scope>a.' + n);
					if (nav) {
						nav.classList.add('selected');
						if (navIcos[n] && typeof navIcos[n] !== 'string') {
							fusion.setSvgPath(nav.firstChild, navIcos[n][1], 1);
						}
					}
					nav = navCtn.querySelector(':scope>a.' + m);
					if (nav) {
						nav.classList.remove('selected');
						if (navIcos[m] && typeof navIcos[m] !== 'string') {
							fusion.setSvgPath(nav.firstChild, navIcos[m][0], 1);
						}
					}
				}
				clearWindow();
			}
			fusion.listeners.trigger(fusion.pageEvents, 'route');
			initLoad('page', pageid, function (firstLoad) {
				if (animating) {
					todo = true;
				} else {
					let force;
					if (pageid === currentpage) { // 未发生转向, 但url有变化
						// 相当于 刷新界面 或者是 改变了参数
						// 不需要动画
						noSwitchLoad(); // 直接触发页面事件 onload
					} else { // 只有返回或未发生转向时允许页面缓存
						const id = pages[pageid].alias ? pages[pageid].alias : pageid,
							title = pages[pageid].title || pages[id].title;
						pagesBox.classList.add(pageid);
						if (document.body.classList.contains('clean') || document.body.classList.contains('hidePageHeader')) {
							document.title = title;
						}
						if (self.frameElement && frameElement.fusion && fusion.currentPopup === 'page') {
							fusion.setPopupTitle(title);
						}
						// 重置 title
						if (typeof pages[id].titleContent === 'string') {
							pageTitle.innerHTML = typeof pages[id].titleContent;
						} else if (pages[id].titleContent instanceof Node) {
							pageTitle.replaceChildren(pages[id].titleContent);
						} else if (pages[id].titleContent && typeof pages[id].titleContent[Symbol.iterator] === 'function') {
							pageTitle.replaceChildren(...pages[id].titleContent);
						} else {
							pageTitle.replaceChildren(title);
						}
						// 重置 顶部按钮
						// init 顶部按钮事件 和 元素
						// 如果没有 就隐藏
						headerRightMenuBtn.removeAttribute('href');
						if (pages[id].rightMenuContent || pages[id].onrightmenuclick) {
							if (typeof pages[id].rightMenuContent === 'string') {
								headerRightMenuBtn.innerHTML = pages[id].rightMenuContent;
							} else if (pages[id].rightMenuContent instanceof Node) {
								headerRightMenuBtn.replaceChildren(pages[id].rightMenuContent);
							} else if (pages[id].rightMenuContent && typeof pages[id].rightMenuContent[Symbol.iterator] === 'function') {
								headerRightMenuBtn.replaceChildren(...pages[id].rightMenuContent);
							} else {
								headerRightMenuBtn.innerHTML = '';
							}
							if (typeof pages[id].onrightmenuclick === 'string') {
								headerRightMenuBtn.href = pages[id].onrightmenuclick;
							}
							headerRightMenuBtn.style.display = '';
						} else {
							headerRightMenuBtn.style.display = 'none';
							headerRightMenuBtn.innerHTML = '';
						}
						headerLeftMenuBtn.removeAttribute('href');
						if (pages[id].leftMenuContent || pages[id].onleftmenuclick) {
							if (typeof pages[id].leftMenuContent === 'string') {
								headerLeftMenuBtn.innerHTML = pages[id].leftMenuContent;
							} else if (pages[id].leftMenuContent instanceof Node) {
								headerLeftMenuBtn.replaceChildren(pages[id].leftMenuContent);
							} else if (pages[id].leftMenuContent && typeof pages[id].leftMenuContent[Symbol.iterator] === 'function') {
								headerLeftMenuBtn.replaceChildren(...pages[id].leftMenuContent);
							} else {
								headerLeftMenuBtn.innerHTML = '';
							}
							if (typeof pages[id].onleftmenuclick === 'string') {
								headerLeftMenuBtn.href = pages[id].onleftmenuclick;
							}
							headerLeftMenuBtn.style.display = '';
						} else {
							headerLeftMenuBtn.style.display = 'none';
							headerLeftMenuBtn.innerHTML = '';
						}
						// 设置 返回按钮URL
						let loc = fusion.getDefaultBack();
						if (loc) {
							let txt = pages[loc.id].title;
							if (!txt && pages[loc.id].alias) {
								txt = pages[pages[loc.id].alias].title;
							}
							backbtn.lastChild.data = txt || lang.back;
							backbtn.href = fusion.buildHash(loc);
							backbtn.style.display = '';
						} else {
							backbtn.style.display = 'none';
						}
						const toshow = pagesBox.querySelector(':scope>.content>.' + id);
						if (currentpage) {
							pagesBox.classList.remove(currentpage);
							const oldid = pages[currentpage].alias ? pages[currentpage].alias : currentpage,
								oldpageid = currentpage;
							currentpage = pageid;
							//alias之间切换不需要动画
							if (id === oldid) {
								force = true;
								noSwitchLoad(force);
							} else {
								animating = true;
								const tohide = pagesBox.querySelector(':scope>.content>.' + oldid),
									goingback = fusion.lastLocation && fusion.lastLocation.args.backHash === location.hash || fusion.isGoingback(oldpageid, pageid);
								force = !goingback || firstLoad;
								viewSwitch(toshow, tohide, goingback, function () {
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
					fusion.listeners.trigger(fusion.pageEvents, 'routeend', { force });
				}
			});
		}

		function reloadPage(id, silent) {
			const cfg = pages[currentpage].alias ? pages[pages[currentpage].alias] : pages[currentpage];
			if (!id || id === currentpage || (Array.isArray(id) && id.indexOf(currentpage) >= 0)) {
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
			if (!self.frameElement || !frameElement.fusion) {
				fusion.hideReadable();
				fusion.closePopup();
			}
		}

		function noSwitchLoad(force) {
			const cfg = pages[currentpage].alias ? pages[pages[currentpage].alias] : pages[currentpage];
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
	})();

	lang = fusion.getLang(lang);
	//禁止各种 long tap 菜单
	//ios 中需使用样式 -webkit-touch-callout: none;
	self.addEventListener('contextmenu', browser.name === 'Firefox' ? stopEvent : cancelEvent);
	self.addEventListener('dragstart', cancelEvent);
	if (browser.name === 'IOS') {
		self.addEventListener('gesturestart', cancelEvent, {
			passive: false
		});
		self.addEventListener('touchmove', cancelEvent, {
			passive: false
		});
	}
	return fusion;

	function destroy(cfg, type, id) {
		const o = document.body.querySelector('#' + type + '>.content>.' + id);
		if (o) {
			if (typeof cfg.ondestroy === 'function') {
				cfg.ondestroy();
			}
			o.remove();
			if (cfg.js) {
				const n = type + '/' + id + '/' + id;
				if (require.defined(n)) {
					const p = require(n);
					require.undef(n);
					if (p) {
						if (self.Reflect) {
							Reflect.setPrototypeOf(cfg, Object.prototype);
						} else {
							cfg.__proto__ = Object.prototype;
						}
					}
				}
			}
		}
		if (cfg.css && cfg.css.href) {
			fusion.removeCss(cfg.css);
			cfg.css = true;
		}
		delete cfg.status;
	}

	function initLoad(type, id, callback) {
		let oldcfg, n;
		if (type === 'panel') {
			oldcfg = panels[id];
		} else if (type === 'popup') {
			oldcfg = popups[id];
		} else {
			oldcfg = pages[id];
			if (oldcfg.alias) {
				id = oldcfg.alias;
				oldcfg = pages[oldcfg.alias];
			}
		}
		//status: 1=loading, 2=loaded but hidden, 3=showing or hiding, 4=shown
		if (oldcfg.status > 1) {
			callback();
		} else if (!oldcfg.status) {
			oldcfg.status = 1;
			n = type + '/' + id + '/';
			const m = require.toUrl(n);
			if (oldcfg.css) {
				oldcfg.css = fusion.appendCss(m + id);
			}
			if (oldcfg.html) {
				const url = m + id + '.html';
				fetch(url).then(res => {
					if (res.ok) {
						return res.text().then(loadJs);
					} else {
						destroy(oldcfg, type, id);
						if (BUILD && res.status === 404) {
							updated();
						} else {
							errorOccurs(url, res.status);
						}
					}
				}, err => errorOccurs(url, err.message)).then(fusion.hideLoading);
				fusion.showLoading();
			} else {
				loadJs('');
			}

			function loadJs(html) {
				const ctn = document.body.querySelector('#' + type + '>.content');
				ctn.insertAdjacentHTML('beforeEnd', '<div class="' + id + '">' + html + '</div>');
				const dom = ctn.lastChild;
				if (oldcfg.js) {
					fusion.showLoading();
					dom.style.opacity = 0;
					dom.style.transition = 'opacity 400ms ease-in-out';
					dom.ontransitionend = domtransend;
					fusion.listeners.on(fusion.dialogEvents, 'loaded', loaded);
					const js = n + id;
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
						fusion.hideLoading();
					}, BUILD && function (error) {
						destroy(oldcfg, type, id);
						if ((error.requireType && error.requireType !== 'scripterror' && error.requireType !== 'nodefine') || (error.xhr && error.xhr.status !== 404)) {
							errorOccurs(js, error.message);
						} else {
							updated();
						}
						fusion.hideLoading();
					});
				} else {
					oldcfg.status++;
					callback(true);
				}

				function loaded(evt) {
					fusion.listeners.off(this, evt.type, loaded);
					dom.style.opacity = '';
				}

				function domtransend(evt) {
					if (evt.target === this) {
						this.ontransitionend = null;
						this.style.transition = '';
					}
				}
			}

			function errorOccurs(res, msg) {
				fusion.alert(lang.error.replace('${res}', res) + msg, type === 'page' ? function () {
					history.back();
				} : undefined);
			}

			function updated() {
				if (type === 'page') {
					location.reload();
				} else {
					fusion.confirm(lang.update, function (sure) {
						if (sure) {
							location.reload();
						}
					});
				}
			}
		}
	}
	//启动左右滑动的动画
	function viewSwitch(toshow, tohide, goingback, callback) {
		toshow.style.visibility = 'inherit';
		if (goingback) {
			tohide.style[aniname] = 'viewTransR1';
			toshow.style[aniname] = 'viewTransR2';
		} else {
			tohide.style[aniname] = 'viewTransL1';
			toshow.style[aniname] = 'viewTransL2';
		}
		toshow[anievt] = function (evt) {
			if (evt.target === this) {
				this[anievt] = null;
				callback();
			}
		};
	}
	//左右滑动的动画完成后要执行的操作
	function viewAnimationEnd(evt) {
		if (evt.target.parentNode === this) {
			if (evt.target.style[aniname][evt.target.style[aniname].length - 1] === '1') {
				evt.target.style.visibility = '';
			}
			evt.target.style[aniname] = '';
		}
	}
});
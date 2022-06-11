'use strict';
define(['module', 'common/fusion/fusion', 'common/pointerevents/pointerevents', './lang'], function (module, fusion, pointerevents, lang) {
	const title = document.createElement('div'),
		content = document.createElement('div'),
		prev = fusion.makeSvg('mdiChevronLeft', 3),
		next = fusion.makeSvg('mdiChevronRight', 3),
		btns = document.createElement('div'),
		ok = document.createElement('button'),
		clear = document.createElement('button'),
		h = 32,
		trans = 'margin-top 100ms ease-in-out',
		observer = new MutationObserver(function (mutations) {
			for (let i = 0; i < mutations.length; i++) {
				if (mutations[i].type === 'attributes') {
					attrchange(mutations[i].target);
				}
			}
		}),
		select = {
			init: o => {
				o.addEventListener('click', click);
				attrchange(o);
				observer.observe(o, {
					attributes: true,
					attributeFilter: ['value', 'data-options', 'data-required']
				});
			},
			action: o => fusion.htmlDialog([title, content, btns, prev, next], 'selectDialog', onclose, () => {
				if (o.dataset) {//DOM Element
					that = o;
					data = that.dataset;
					options = data.options.parseJsex().value;
				} else {
					that = data = o;
					options = data.options;
				}
				if (Array.isArray(options)) {
					idxs = options;
					options = {};
					index = 0;
					for (let i = 0; i < idxs.length; i++) {
						options[idxs[i]] = idxs[i];
						if (that.value === idxs[i]) {
							index = i;
						}
					}
				} else {
					idxs = Object.keys(options);
					index = idxs.indexOf(that.value);
					if (index < 0) {
						index = 0;
					}
				}
				if (idxs.length > 8) {
					cs = 9;
				} else if (idxs.length > 6) {
					cs = 7;
				} else if (idxs.length > 4) {
					cs = 5;
				} else if (idxs.length) {
					cs = 3;
				} else {
					cs = 0;
				}
				if (cs) {
					half = (cs - 1) / 2;
					content.style.height = cs * h + 2 + 'px';
					if (idxs.length < cs) {
						let s = '';
						for (let i = 0; i < idxs.length; i++) {
							s += `<div>${options[idxs[i]]}</div>`;
						}
						content.innerHTML = s;
						if (index === 0) {
							content.firstChild.style.marginTop = h + 'px';
						}
					} else {
						content.innerHTML = makehtml(index);
					}
					title.textContent = data.title || data.placeholder || lang.choose;
					ok.textContent = data.ok || lang.ok;
					ok.disabled = data === that ? data.notok : 'notok' in data;
					clear.textContent = data.clear || lang.clear;
					clear.style.display = (data === that ? data.required : 'required' in data) || !that.value || idxs.length === 1 ? 'none' : '';
					prev.style.visibility = typeof data.onprev === 'function' ? 'visible' : '';
					next.style.visibility = typeof data.onnext === 'function' ? 'visible' : '';
				} else {
					fusion.closeDialog();
				}
			})
		};
	let that, cs, data, options, idxs, y, index, half, n, l;
	fusion.appendCss(require.toUrl(module.id));
	title.className = 'title';
	content.className = 'content';
	btns.className = 'btns';
	clear.className = 'clear';
	ok.className = 'ok';
	ok.type = clear.type = 'button';
	prev.classList.add('prev');
	next.classList.add('next');
	btns.appendChild(clear);
	btns.appendChild(ok);
	content.addEventListener('transitionend', function (evt) {
		if (idxs.length < cs) {
			evt.target.style.transition = '';
		} else {
			if (evt.target.style.marginTop) {
				evt.target.remove();
			} else {
				evt.target.style.transition = '';
				this.lastChild.remove();
			}
		}
	});
	ok.onclick = function () {
		if (!this.disabled) {
			fusion.closeDialog('ok');
		}
	};
	clear.onclick = function () {
		fusion.closeDialog('clear');
	};
	prev.onclick = function () {
		fusion.closeDialog('prev');
	};
	next.onclick = function () {
		fusion.closeDialog('next');
	};
	pointerevents(content, function (evt) {
		if (idxs.length > 1) {
			if (evt.type === 'start') {
				if (!this.pointers.length) {
					evt.domEvent.preventDefault();
					if (idxs.length < cs) {
						l = content.firstChild.offsetTop;
					} else {
						n = index;
						l = 0;
					}
					y = evt.y;
					return true;
				}
			} else if (evt.type === 'move') {
				const m = evt.y - y;
				if (idxs.length < cs) {
					content.firstChild.style.marginTop = Math.min(Math.max(0, l + m), h) + 'px';
				} else {
					l = m % h;
					if (l > 0) {
						l -= h;
					}
					n = (index - Math.floor(m / h)) % idxs.length;
					if (n < 0) {
						n += idxs.length;
					}
					content.innerHTML = makehtml(n, l);
				}
			} else {
				if (idxs.length < cs) {
					l = content.firstChild.offsetTop;
					if (l % h) {
						l = Math.round(l / h);
						startAni();
					}
					index = l === 0 ? 1 : 0;
				} else if (l) {
					startAni();
					index = (n - 1 - Math.round(l / h) + idxs.length) % idxs.length;
				} else {
					index = n;
				}
			}
		}
	});
	return select;

	function startAni() {
		content.firstChild.style.marginTop = -l > h / 2 ? -h + 'px' : '';
		content.firstChild.style.transition = trans;
	}

	function attrchange(o) {
		if (o.dataset.options) {
			const data = o.dataset.options.parseJsex().value;
			if (Array.isArray(data)) {
				if (data.indexOf(o.value) < 0) {
					if ('required' in o.dataset && data.length) {
						o.textContent = o.value = data[0];
					} else {
						cleanup(o);
					}
				} else {
					o.textContent = o.value;
				}
			} else {
				if (o.value in data) {
					o.textContent = data[o.value];
				} else {
					let nm;
					for (const n in data) {
						nm = n;
						break;
					}
					if ('required' in o.dataset && nm) {
						o.value = nm;
						o.textContent = data[nm];
					} else {
						cleanup(o);
					}
				}
			}
			const e = 'required' in o.dataset && !o.value;
			o.setCustomValidity({
				valueMissing: e,
				valid: !e
			});
		}
	}

	function cleanup(o) {
		if (o.value) {
			o.value = '';
		}
		o.textContent = '';
	}

	function click() {
		if (!this.disabled && this.dataset.options) {
			select.action(this);
		}
	}

	function onclose(type) {
		if (type) {
			let chg;
			if (type === 'ok' || type === 'next') {
				if (that.value !== idxs[index]) {
					chg = true;
					that.value = idxs[index];
				}
			} else if (type === 'clear' && that.value !== '') {
				chg = true;
				that.value = '';
			}
			if (that === data) {
				if (chg) {
					fusion.listeners.trigger(that, 'change');
				}
				fusion.listeners.trigger(that, type);
			} else {
				if (chg) {
					that.dispatchEvent(new Event('change'));
				}
				that.dispatchEvent(new Event(type));
			}
		}
	}

	function makehtml(idx, top) {
		let s;
		if (top) {
			let i;
			if (idxs.length > cs) {
				i = idx - half - 1;
				if (i < 0) {
					i += idxs.length;
				}
			} else {
				i = (idx + half) % idxs.length;
			}
			s = `<div style="margin-top:${top}px">${options[idxs[i]]}</div>`;
		} else {
			s = '';
		}
		for (let i = idx - half; i <= idx + half; i++) {
			let j = i % idxs.length;
			if (j < 0) {
				j += idxs.length;
			}
			s += `<div>${options[idxs[j]]}</div>`;
		}
		return s;
	}
});
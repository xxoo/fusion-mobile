'use strict';
define(['module', 'common/kernel/kernel', 'common/pointerevents/pointerevents', './lang'], function (module, kernel, pointerevents, lang) {
	const dom = document.createElement('div'),
		h = 32,
		trans = 'margin-top 100ms ease-in-out',
		observer = new MutationObserver(function (mutations) {
			for (let i = 0; i < mutations.length; i++) {
				if (mutations[i].type === 'attributes') {
					if (mutations[i].attributeName === 'data-value' || mutations[i].attributeName === 'data-options' || mutations[i].attributeName === 'data-required') {
						attrchange(mutations[i].target);
					} else if (mutations[i].attributeName === 'data-placeholder' && !mutations[i].target.dataset.value) {
						mutations[i].target.dataset.firstChild.data = mutations[i].target.dataset.placeholder || lang.choose;
					}
				}
			}
		}),
		select = {
			init: function (o) {
				o.addEventListener('click', click);
				attrchange(o);
				observer.observe(o, {
					attributes: true,
					attributeFilter: ['data-value', 'data-options', 'data-placeholder']
				});
			},
			action: action
		};
	let that, cs, data, options, idxs, title, content, ok, clear, y, index, half, n, l;
	dom.innerHTML = '<div class="title">--</div><div class="content"></div><div class="btns"><a class="clear">--</a><a class="ok">--</a></div>';
	title = dom.querySelector('.title').firstChild;
	content = dom.querySelector('.content');
	ok = dom.querySelector('.ok');
	clear = dom.querySelector('.clear');
	kernel.appendCss(require.toUrl(module.id));
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
	ok.addEventListener('click', function () {
		kernel.closeDialog('ok');
	});
	clear.addEventListener('click', function () {
		kernel.closeDialog('clear');
	});
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
			const data = JSON.parse(o.dataset.options);
			if (Array.isArray(data)) {
				if (data.indexOf(o.dataset.value) < 0) {
					if (o.dataset.required && data.length) {
						o.firstChild.data = o.dataset.value = data[0];
					} else {
						cleanup(o);
					}
				} else {
					o.firstChild.data = o.dataset.value;
				}
			} else {
				if (data.hasOwnProperty(o.dataset.value)) {
					o.firstChild.data = data[o.dataset.value];
				} else {
					const ks = Object.keys(data);
					if (o.dataset.required && ks.length) {
						o.dataset.value = ks[0];
						o.firstChild.data = data[ks[0]];
					} else {
						cleanup(o);
					}
				}
			}
		}
	}

	function cleanup(o) {
		if (o.dataset.value) {
			o.dataset.value = '';
		}
		o.firstChild.data = o.dataset.placeholder || lang.choose;
	}

	function click() {
		if (!this.classList.contains('disabled') && this.dataset.options) {
			action.call(this);
		}
	}

	function action(o) {
		const t = this;
		kernel.htmlDialog(dom, 'selectDialog', onclose, function () {
			if (t === select || !t) {
				that = undefined;
				data = o;
				options = data.options;
			} else {
				that = t;
				data = that.dataset;
				options = JSON.parse(data.options);
			}
			if (Array.isArray(options)) {
				idxs = options;
				options = {};
				index = 0;
				for (let i = 0; i < idxs.length; i++) {
					options[idxs[i]] = idxs[i];
					if (data.value === idxs[i]) {
						index = i;
					}
				}
			} else {
				idxs = Object.keys(options);
				index = idxs.indexOf(data.value);
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
				title.data = data.title || data.placeholder || lang.choose;
				ok.firstChild.data = data.ok || lang.ok;
				clear.firstChild.data = data.clear || lang.clear;
				clear.style.display = data.required || !data.value || idxs.length === 1 ? 'none' : '';
			} else {
				kernel.closeDialog();
			}
		});
	}

	function onclose(type) {
		if (type) {
			let chg;
			if (type === 'ok' && data.value !== idxs[index]) {
				chg = true;
				data.value = idxs[index];
			} else if (type === 'clear' && data.value !== '') {
				chg = true;
				data.value = '';
			}
			if (that) {
				if (chg) {
					that.dispatchEvent(new Event('change'));
				}
				that.dispatchEvent(new Event(type));
			} else {
				if (chg && typeof data.onchange === 'function') {
					data.onchange({
						type: 'change'
					});
				}
				if (typeof data['on' + type] === 'function') {
					data['on' + type]({
						type: type
					});
				}
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
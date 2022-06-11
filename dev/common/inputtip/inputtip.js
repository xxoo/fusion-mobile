'use strict';
define(['module', 'common/fusion/fusion', './lang'], function (module, fusion, lang) {
	let inv, target, tmo, synctmo, arr,
		dom = document.createElement('div');
	fusion.appendCss(require.toUrl(module.id));
	dom.id = 'inputtip';
	dom.appendChild(document.createTextNode(''));
	arr = dom.appendChild(document.createElement('span'));
	document.body.appendChild(dom);
	document.addEventListener('invalid', function (evt) {
		evt.preventDefault();
		show(evt.target);
	}, true);

	return show;

	function show(t, txt) {
		if (!inv) {
			if (target) {
				blur(true);
			}
			target = t;
			target.focus();
			if (document.activeElement !== target) {
				target.scrollIntoView({
					block: 'nearest',
					inline: 'nearest'
				});
			}
			target.addEventListener('blur', blur);
			dom.firstChild.data = txt || lang;
			syncPos();
			dom.style.opacity = 1;
			tmo = setTimeout(blur, 10 * 1000);
			inv = setTimeout(function () {
				inv = undefined;
			}, 0);
		}
	}

	function syncPos() {
		let w = dom.offsetWidth,
			h = dom.offsetHeight,
			rect = target.getBoundingClientRect(),
			ox, oy;
		if (browser.name === 'IOS') {
			ox = scrollX;
			oy = scrollY;
		} else {
			ox = oy = 0;
		}
		if (rect.top < h + 6) {
			arr.className = 'bottom';
			dom.style.top = oy + rect.top + rect.height + 6 + 'px';
		} else {
			arr.className = 'top';
			dom.style.top = oy + rect.top - h - 6 + 'px';
		}
		if (rect.width / 2 + rect.left < w / 2) {
			dom.style.left = ox;
			arr.style.left = Math.max(10, rect.width / 2 + rect.left) + 'px';
		} else if (innerWidth - rect.left - rect.width / 2 < w / 2) {
			dom.style.left = ox + innerWidth - w + 'px';
			arr.style.left = Math.min(w - 10, w - innerWidth + rect.left + rect.width / 2) + 'px';
		} else {
			dom.style.left = ox + rect.width / 2 + rect.left - w / 2 + 'px';
			arr.style.left = '50%';
		}
		synctmo = requestAnimationFrame(syncPos);
	}

	function blur(clear) {
		target.removeEventListener('blur', blur);
		cancelAnimationFrame(synctmo);
		target = undefined;
		dom.style.opacity = '';
		if (clear) {
			clearTimeout(tmo);
		}
	}
});
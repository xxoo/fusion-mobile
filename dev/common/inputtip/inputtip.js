'use strict';
define(['module', 'common/kernel/kernel', './lang'], function (module, kernel, lang) {
	let inv, target, tmo, synctmo, arr,
		dom = document.createElement('div');
	kernel.appendCss(require.toUrl(module.id));
	dom.id = 'inputtip';
	dom.appendChild(document.createTextNode(lang));
	arr = dom.appendChild(document.createElement('span'));
	document.body.appendChild(dom);
	document.addEventListener('invalid', function (evt) {
		evt.preventDefault();
		if (!inv) {
			if (target) {
				blur(true);
			}
			target = evt.target;
			target.focus();
			target.addEventListener('blur', blur);
			syncPos();
			dom.style.opacity = 1;
			tmo = setTimeout(blur, 5 * 1000);
			inv = setTimeout(function () {
				inv = undefined;
			}, 0);
		}
	}, true);

	function syncPos() {
		let w = dom.offsetWidth,
			h = dom.offsetHeight,
			rect = target.getBoundingClientRect(),
			ox, oy;
		if (browser.name === 'IOS') {
			ox = pageXOffset;
			oy = pageYOffset;
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
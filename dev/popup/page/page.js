'use strict';
//this popup is for holding pages
define(['module', 'common/kernel/kernel', 'site/pages/pages'], function (module, kernel, pages) {
	var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = document.querySelector('#popup>.content>.' + thisPopup),
		frame, pageLoc;
	dom.innerHTML = '<iframe frameborder="0" frameborder="no" scrolling="no" sandbox="allow-same-origin allow-forms allow-scripts" src="about:blank" style="display:block;width:100%;height:100%;"></iframe>';
	frame = dom.firstChild;
	frame.kernel = kernel;

	return {
		onload: function (loc) {
			if (loc) {
				pageLoc = loc;
				if (frame.src === 'about:blank') {
					kernel.listeners.add(kernel.popupEvents, 'hide', popuphide);
					loc.args.ui = 'clean';
				}
				frame.src = kernel.buildHash(loc);
			} else if (frame.src === 'about:blank') {
				return true;
			}
		},
		onloadend: function () {
			kernel.setPopupTitle(pages[pageLoc.id].title);
		}
	};

	function popuphide() {
		kernel.listeners.remove(kernel.popupEvents, 'hide', popuphide);
		frame.src = 'about:blank';
	}
});
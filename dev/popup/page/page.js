'use strict';
//this popup is for holding pages
define(['module', 'common/fusion/fusion', 'site/pages/pages'], function (module, fusion, pages) {
	let thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = document.querySelector('#popup>.content>.' + thisPopup),
		frame, pageLoc;
	dom.innerHTML = '<iframe frameborder="0" frameborder="no" scrolling="no" sandbox="allow-same-origin allow-forms allow-scripts" src="about:blank" style="display:block;width:100%;height:100%;"></iframe>';
	frame = dom.firstChild;
	frame.fusion = fusion;

	return {
		open: function (loc, back) {
			if (loc) {
				pageLoc = loc;
				if (frame.src === 'about:blank') {
					fusion.listeners.on(fusion.popupEvents, 'hide', popuphide);
					loc.args.ui = 'clean';
				}
				frame.src = fusion.buildHash(loc);
			}
			fusion.showPopup(thisPopup, back);
		},
		onloadend: function () {
			fusion.setPopupTitle(pages[pageLoc.id].title);
		}
	};

	function popuphide() {
		fusion.listeners.off(fusion.popupEvents, 'hide', popuphide);
		frame.src = 'about:blank';
	}
});
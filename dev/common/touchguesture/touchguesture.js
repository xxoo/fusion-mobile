/*	touchguesture.js 0.1
 *
 *	usage:
 *		let gesture=touchguesture(dom);
 *		guesture.ondragstart=function(evt){
 *			let x = evt.x;
 *			let y = evt.y;
 *		}
 *		guesture.ondragmove=function(evt){
 *			let x = evt.x;
 *			let y = evt.y;
 *		}
 *		guesture.ondragend=function(evt){
 *			let x = evt.x;
 *			let y = evt.y;
 *		}
 *		guesture.onzoomstart=function(evt){
 *			let x = evt.x;
 *			let y = evt.y;
 *		}
 *		guesture.onzoomchange=function(evt){
 *			let zoom = evt.zoom;
 *		}
 *		guesture.onzoomend=function(evt){
 *			let zoom = evt.zoom;
 *		}
 */

'use strict';
define(['common/pointerevents/pointerevents'], function(pointerevents) {
	let touchguesture = function(dom) {
		if (this instanceof touchguesture) {
			let that = this,
				touchs = [];
			this.destory = pointerevents(dom, function(evt) {
				return touchstart(that, evt, touchs);
			}).destory;
		} else {
			return new touchguesture(dom);
		}
	};
	return touchguesture;

	function touchstart(obj, evt, touchs) {
		if (evt.type === 'start') {
			if (touchs.length < 2) {
				let o = {
					id: evt.id,
					x: evt.x,
					y: evt.y
				};
				touchs.push(o);
				if (touchs.length === 1) {
					fireEvent(obj, 'dragstart', {
						x: touchs[0].x,
						y: touchs[0].y
					});
				} else {
					o.l = Math.sqrt(Math.pow(evt.x - touchs[0].x, 2) + Math.pow(evt.y - touchs[0].y, 2));
					fireEvent(obj, 'dragend', {
						x: touchs[0].x,
						y: touchs[0].y
					});
					fireEvent(obj, 'zoomstart', {
						x: (touchs[0].x + touchs[1].x) / 2,
						y: (touchs[0].y + touchs[1].y) / 2
					});
				}
				return true;
			}
		} else if (evt.type === 'move') {
			mv(obj, evt, touchs);
		} else {
			ed(obj, evt, touchs);
		}
	}

	function mv(obj, evt, touchs) {
		evt.domEvent.preventDefault();
		evt.domEvent.stopPropagation();
		if (touchs.length === 1) {
			if (evt.id === touchs[0].id) {
				touchs[0].x = evt.x;
				touchs[0].y = evt.y;
				fireEvent(obj, 'dragmove', {
					x: touchs[0].x,
					y: touchs[0].y
				});
			}
		} else {
			let j = evt.id === touchs[0].id ? 0 : 1;
			touchs[j].x = evt.x;
			touchs[j].y = evt.y;
			fireEvent(obj, 'zoomchange', {
				zoom: Math.sqrt(Math.pow(touchs[1].x - touchs[0].x, 2) + Math.pow(touchs[1].y - touchs[0].y, 2)) / touchs[1].l
			});
		}
	}

	function ed(obj, evt, touchs) {
		if (touchs.length === 2) {
			let j = evt.id === touchs[0].id ? 0 : 1;
			touchs[j].x = evt.x;
			touchs[j].y = evt.y;
			fireEvent(obj, 'zoomend', {
				zoom: Math.sqrt(Math.pow(touchs[1].x - touchs[0].x, 2) + Math.pow(touchs[1].y - touchs[0].y, 2)) / touchs[1].l
			});
			touchs.splice(j, 1);
			delete touchs[0].l;
			fireEvent(obj, 'dragstart', {
				x: touchs[0].x,
				y: touchs[0].y
			});
		} else {
			touchs.pop();
			fireEvent(obj, 'dragend', {
				x: evt.x,
				y: evt.y
			});
		}
	}

	function fireEvent(obj, evt, o) {
		let n = 'on' + evt;
		if (typeof obj[n] === 'function') {
			if (!o) {
				o = {};
			}
			o.type = evt;
			obj[n](o);
		}
	}
});
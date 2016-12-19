/*	touchguesture.js 0.1
 *
 *	usage:
 *		var gesture=touchguesture(dom);
 *		guesture.ondragstart=function(evt){
 *			var x = evt.x;
 *			var y = evt.y;
 *		}
 *		guesture.ondragmove=function(evt){
 *			var x = evt.x;
 *			var y = evt.y;
 *		}
 *		guesture.ondragend=function(evt){
 *			var x = evt.x;
 *			var y = evt.y;
 *		}
 *		guesture.onzoomstart=function(evt){
 *			var x = evt.x;
 *			var y = evt.y;
 *		}
 *		guesture.onzoomchange=function(evt){
 *			var zoom = evt.zoom;
 *		}
 *		guesture.onzoomend=function(evt){
 *			var zoom = evt.zoom;
 *		}
 */

'use strict';
define(['common/pointerevents/pointerevents'], function(pointerevents) {
	var touchguesture = function(dom) {
		var self, touchs;
		if (this instanceof touchguesture) {
			self = this;
			touchs = [];
			this.destory = pointerevents(dom, function(evt) {
				return touchstart(self, evt, touchs);
			}).destory;
		} else {
			return new touchguesture(dom);
		}
	};
	return touchguesture;

	function touchstart(obj, evt, touchs) {
		var o;
		if (evt.type === 'start') {
			if (touchs.length < 2) {
				o = {
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
		var i, j = 0;
		evt.domEvent.preventDefault();
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
			var j = evt.id === touchs[0].id ? 0 : 1;
			touchs[j].x = evt.x;
			touchs[j].y = evt.y;
			fireEvent(obj, 'zoomchange', {
				zoom: Math.sqrt(Math.pow(touchs[1].x - touchs[0].x, 2) + Math.pow(touchs[1].y - touchs[0].y, 2)) / touchs[1].l
			});
		}
	}

	function ed(obj, evt, touchs) {
		var j;
		if (touchs.length === 2) {
			j = evt.id === touchs[0].id ? 0 : 1;
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
		var n = 'on' + evt;
		if (typeof obj[n] === 'function') {
			if (!o) {
				o = {};
			}
			o.type = evt;
			obj[n](o);
		}
	}
});
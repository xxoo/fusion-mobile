/*	pointerevents.js 0.1
 *	support both touch events model and w3c pointer events model (which is currently only available in ie)
 *	usage:
 *      var events=pointerevents(dom,function(evt){
 *          if(evt.type==='start'){
 *              if(events.pointers.length<2){
 *                  return true; //return true on start means watch this pointer
 *              }
 *          } else if(evt.type==='move'){
 *              if(evt.x>100){
 *                  return true; //return true on move means stop watching this pointer
 *              }
 *          } else if(evt.type === 'end' || evt.type === 'cancel'){
 *             if(pointer.length===1){//the only pointer is ended
 *                  events.destory(); //you may wanna stop watching by now
 *             }
 *          }
 *      });
 */

'use strict';
define(function() {
	var touchEvents, touchActionStyle;
	if (window.PointerEvent) {
		touchEvents = {
			start: 'pointerdown',
			move: 'pointermove',
			end: 'pointerup',
			cancel: 'pointercancel'
		};
		touchActionStyle = 'touchAction';
	} else if (window.MSPointerEvent) {
		touchEvents = {
			start: 'MSPointerDown',
			move: 'MSPointerMove',
			end: 'MSPointerUp',
			cancel: 'MSPointerCancel'
		};
		touchActionStyle = 'msTouchAction';
	} else {
		touchEvents = {
			start: 'touchstart',
			move: 'touchmove',
			end: 'touchend',
			cancel: 'touchcancel'
		};
	}

	return function(dom, callback) {
		var result = {
			pointers: [],
			destory: function() {
				dom.removeEventListener(touchEvents.start, start, false);
			}
		};
		if (touchActionStyle) {
			dom.style[touchActionStyle] = 'none';
		}
		dom.addEventListener(touchEvents.start, start, false);
		return result;

		function start(evt) {
			pointerStart(evt, callback, result.pointers, result);
		}
	};

	function watchDocument(callback, pointers, self) {
		var o = {
			move: function(evt) {
				process(evt, callback, pointers, 'move', o, self);
			},
			end: function(evt) {
				process(evt, callback, pointers, 'end', o, self);
			},
			cancel: function(evt) {
				process(evt, callback, pointers, 'cancel', o, self);
			}
		};
		document.addEventListener(touchEvents.move, o.move, false);
		document.addEventListener(touchEvents.end, o.end, false);
		document.addEventListener(touchEvents.cancel, o.cancel, false);
	}

	function unwatchDocument(o) {
		document.removeEventListener(touchEvents.move, o.move, false);
		document.removeEventListener(touchEvents.end, o.end, false);
		document.removeEventListener(touchEvents.cancel, o.cancel, false);
	}

	function pointerStart(evt, callback, pointers, self) {
		var i, t;
		if ('pointerId' in evt) {
			if (callback.call(self, {
				type: 'start',
				id: evt.pointerId,
				x: evt.clientX,
				y: evt.clientY,
				domEvent: evt
			})) {
				pointers.push(evt.pointerId);
				if (pointers.length === 1) {
					watchDocument(callback, pointers, self);
				}
			}
		} else {
			for (i = 0; i < evt.changedTouches.length; i++) {
				t = evt.changedTouches[i];
				if (callback.call(self, {
					type: 'start',
					id: t.identifier,
					x: t.clientX,
					y: t.clientY,
					domEvent: evt
				})) {
					pointers.push(t.identifier);
					if (pointers.length === 1) {
						watchDocument(callback, pointers, self);
					}
				}
			}
		}
	}

	function process(evt, callback, pointers, type, o, self) {
		var i, j, t;
		if ('pointerId' in evt) {
			j = pointers.indexOf(evt.pointerId);
			if (j >= 0) {
				if (callback.call(self, {
					type: type,
					id: evt.pointerId,
					x: evt.clientX,
					y: evt.clientY,
					domEvent: evt
				}) || type !== 'move') {
					pointers.splice(j, 1);
					if (!pointers.length) {
						unwatchDocument(o);
					}
				}
			}
		} else {
			for (i = 0; i < evt.changedTouches.length; i++) {
				t = evt.changedTouches[i];
				j = pointers.indexOf(t.identifier);
				if (j >= 0) {
					if (callback.call(self ,{
						type: type,
						id: t.identifier,
						x: t.clientX,
						y: t.clientY,
						domEvent: evt
					}) || type !== 'move') {
						pointers.splice(j, 1);
						if (!pointers.length) {
							unwatchDocument(o);
							break;
						}
					}
				}
			}
		}
	}
});
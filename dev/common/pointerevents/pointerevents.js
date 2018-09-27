/*	pointerevents.js 0.1
 *	support both touch events model and w3c pointer events model (which is currently only available in ie)
 *	usage:
 *      let events=pointerevents(dom,function(evt){
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
	let touchEvents, touchActionStyle;
	if (self.TouchEvent) {
		touchEvents = {
			start: 'touchstart',
			move: 'touchmove',
			end: 'touchend',
			cancel: 'touchcancel'
		};
	} else if (self.PointerEvent) {
		touchEvents = {
			start: 'pointerdown',
			move: 'pointermove',
			end: 'pointerup',
			cancel: 'pointercancel'
		};
		touchActionStyle = 'touchAction';
	} else if (self.MSPointerEvent) {
		touchEvents = {
			start: 'MSPointerDown',
			move: 'MSPointerMove',
			end: 'MSPointerUp',
			cancel: 'MSPointerCancel'
		};
		touchActionStyle = 'msTouchAction';
	} else {
		touchEvents = {
			start: 'mousedown',
			move: 'mousemove',
			end: 'mouseup'
		}
	}

	return function(dom, callback) {
		let peo = {
			pointers: [],
			destory: function() {
				dom.removeEventListener(touchEvents.start, start, false);
			}
		};
		if (touchActionStyle) {
			dom.style[touchActionStyle] = 'none';
		}
		dom.addEventListener(touchEvents.start, start, false);
		return peo;

		function start(evt) {
			pointerStart(evt, callback, peo.pointers, peo);
		}
	};

	function watchView(callback, pointers, peo, win) {
		let o = {
			move: function(evt) {
				process(evt, callback, pointers, 'move', o, peo);
			},
			end: function(evt) {
				process(evt, callback, pointers, 'end', o, peo);
			},
			cancel: function(evt) {
				process(evt, callback, pointers, 'cancel', o, peo);
			}
		};
		win.addEventListener(touchEvents.move, o.move, {
			capture: true,
			passive: false
		});
		win.addEventListener(touchEvents.end, o.end, {
			capture: true
		});
		if (o.cancel) {
			win.addEventListener(touchEvents.cancel, o.cancel, {
				capture: true
			});
		}
	}

	function unwatchView(o, win) {
		win.removeEventListener(touchEvents.move, o.move, {
			capture: true,
			passive: false
		});
		win.removeEventListener(touchEvents.end, o.end, {
			capture: true
		});
		if (o.cancel) {
			win.removeEventListener(touchEvents.cancel, o.cancel, {
				capture: true
			});
		}
	}

	function pointerStart(evt, callback, pointers, peo) {
		if ('pointerId' in evt) {
			if (callback.call(peo, {
					type: 'start',
					id: evt.pointerId,
					x: evt.clientX,
					y: evt.clientY,
					domEvent: evt
				})) {
				pointers.push(evt.pointerId);
				if (pointers.length === 1) {
					watchView(callback, pointers, peo, evt.view);
				}
			}
		} else if ('changedTouches' in evt) {
			for (let i = 0; i < evt.changedTouches.length; i++) {
				let t = evt.changedTouches[i];
				if (callback.call(peo, {
						type: 'start',
						id: t.identifier,
						x: t.clientX,
						y: t.clientY,
						domEvent: evt
					})) {
					pointers.push(t.identifier);
					if (pointers.length === 1) {
						watchView(callback, pointers, peo, evt.view);
					}
				}
			}
		} else {
			if (callback.call(peo, {
					type: 'start',
					id: undefined,
					x: evt.clientX,
					y: evt.clientY,
					domEvent: evt
				})) {
				pointers.push(undefined);
				if (pointers.length === 1) {
					watchView(callback, pointers, peo, evt.view);
				}
			}
		}
	}

	function process(evt, callback, pointers, type, o, peo) {
		if ('pointerId' in evt) {
			let j = pointers.indexOf(evt.pointerId);
			if (j >= 0) {
				if (callback.call(peo, {
						type: type,
						id: evt.pointerId,
						x: evt.clientX,
						y: evt.clientY,
						domEvent: evt
					}) || type !== 'move') {
					pointers.splice(j, 1);
					if (!pointers.length) {
						unwatchView(o, evt.view);
					}
				}
			}
		} else if ('changedTouches' in evt) {
			for (let i = 0; i < evt.changedTouches.length; i++) {
				let t = evt.changedTouches[i],
					j = pointers.indexOf(t.identifier);
				if (j >= 0) {
					if (callback.call(peo, {
							type: type,
							id: t.identifier,
							x: t.clientX,
							y: t.clientY,
							domEvent: evt
						}) || type !== 'move') {
						pointers.splice(j, 1);
						if (!pointers.length) {
							unwatchView(o, evt.view);
							break;
						}
					}
				}
			}
		} else {
			let j = pointers.indexOf(undefined);
			if (j >= 0) {
				if (callback.call(peo, {
						type: type,
						id: undefined,
						x: evt.clientX,
						y: evt.clientY,
						domEvent: evt
					}) || type !== 'move') {
					pointers.splice(j, 1);
					if (!pointers.length) {
						unwatchView(o, evt.view);
					}
				}
			}
		}
	}
});
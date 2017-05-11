"use strict";define(function(){function e(e,n,t,o){var d={move:function(c){i(c,e,n,"move",d,t)},end:function(c){i(c,e,n,"end",d,t)},cancel:function(c){i(c,e,n,"cancel",d,t)}};o.addEventListener(c.move,d.move,{capture:!0,passive:!1}),o.addEventListener(c.end,d.end,{capture:!0}),d.cancel&&o.addEventListener(c.cancel,d.cancel,{capture:!0})}function n(e,n){n.removeEventListener(c.move,e.move,{capture:!0,passive:!1}),n.removeEventListener(c.end,e.end,{capture:!0}),e.cancel&&n.removeEventListener(c.cancel,e.cancel,{capture:!0})}function t(n,t,i,c){var o,d;if("pointerId"in n)t.call(c,{type:"start",id:n.pointerId,x:n.clientX,y:n.clientY,domEvent:n})&&(i.push(n.pointerId),1===i.length&&e(t,i,c,n.view));else if("changedTouches"in n)for(o=0;o<n.changedTouches.length;o++)d=n.changedTouches[o],t.call(c,{type:"start",id:d.identifier,x:d.clientX,y:d.clientY,domEvent:n})&&(i.push(d.identifier),1===i.length&&e(t,i,c,n.view));else t.call(c,{type:"start",id:undefined,x:n.clientX,y:n.clientY,domEvent:n})&&(i.push(undefined),1===i.length&&e(t,i,c,n.view))}function i(e,t,i,c,o,d){var r,a,l;if("pointerId"in e)(a=i.indexOf(e.pointerId))>=0&&(t.call(d,{type:c,id:e.pointerId,x:e.clientX,y:e.clientY,domEvent:e})||"move"!==c)&&(i.splice(a,1),i.length||n(o,e.view));else if("changedTouches"in e){for(r=0;r<e.changedTouches.length;r++)if(l=e.changedTouches[r],(a=i.indexOf(l.identifier))>=0&&(t.call(d,{type:c,id:l.identifier,x:l.clientX,y:l.clientY,domEvent:e})||"move"!==c)&&(i.splice(a,1),!i.length)){n(o,e.view);break}}else(a=i.indexOf(undefined))>=0&&(t.call(d,{type:c,id:undefined,x:e.clientX,y:e.clientY,domEvent:e})||"move"!==c)&&(i.splice(a,1),i.length||n(o,e.view))}var c,o;return"ontouchstart"in window?c={start:"touchstart",move:"touchmove",end:"touchend",cancel:"touchcancel"}:window.PointerEvent?(c={start:"pointerdown",move:"pointermove",end:"pointerup",cancel:"pointercancel"},o="touchAction"):window.MSPointerEvent?(c={start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp",cancel:"MSPointerCancel"},o="msTouchAction"):c={start:"mousedown",move:"mousemove",end:"mouseup"},function(e,n){function i(e){t(e,n,d.pointers,d)}var d={pointers:[],destory:function(){e.removeEventListener(c.start,i,!1)}};return o&&(e.style[o]="none"),e.addEventListener(c.start,i,!1),d}});
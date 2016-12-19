"use strict";define("common/pointerevents/pointerevents",function(){function e(e,t,n){var s={move:function(i){o(i,e,t,"move",s,n)},end:function(i){o(i,e,t,"end",s,n)},cancel:function(i){o(i,e,t,"cancel",s,n)}};document.addEventListener(i.move,s.move,!1),document.addEventListener(i.end,s.end,!1),document.addEventListener(i.cancel,s.cancel,!1)}function t(e){document.removeEventListener(i.move,e.move,!1),document.removeEventListener(i.end,e.end,!1),document.removeEventListener(i.cancel,e.cancel,!1)}function n(t,n,o,i){var s,l;if("pointerId"in t)n.call(i,{type:"start",id:t.pointerId,x:t.clientX,y:t.clientY,domEvent:t})&&(o.push(t.pointerId),1===o.length&&e(n,o,i));else for(s=0;s<t.changedTouches.length;s++)l=t.changedTouches[s],n.call(i,{type:"start",id:l.identifier,x:l.clientX,y:l.clientY,domEvent:t})&&(o.push(l.identifier),1===o.length&&e(n,o,i))}function o(e,n,o,i,s,l){var a,c,r;if("pointerId"in e)c=o.indexOf(e.pointerId),c>=0&&(n.call(l,{type:i,id:e.pointerId,x:e.clientX,y:e.clientY,domEvent:e})||"move"!==i)&&(o.splice(c,1),o.length||t(s));else for(a=0;a<e.changedTouches.length;a++)if(r=e.changedTouches[a],c=o.indexOf(r.identifier),c>=0&&(n.call(l,{type:i,id:r.identifier,x:r.clientX,y:r.clientY,domEvent:e})||"move"!==i)&&(o.splice(c,1),!o.length)){t(s);break}}var i,s;return window.PointerEvent?(i={start:"pointerdown",move:"pointermove",end:"pointerup",cancel:"pointercancel"},s="touchAction"):window.MSPointerEvent?(i={start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp",cancel:"MSPointerCancel"},s="msTouchAction"):i={start:"touchstart",move:"touchmove",end:"touchend",cancel:"touchcancel"},function(e,t){function o(e){n(e,t,l.pointers,l)}var l={pointers:[],destory:function(){e.removeEventListener(i.start,o,!1)}};return s&&(e.style[s]="none"),e.addEventListener(i.start,o,!1),l}});
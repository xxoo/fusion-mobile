"use strict";define(["common/pointerevents/pointerevents"],(function(t){return function n(o){if(!(this instanceof n))return new n(o);var y=this,r=[];this.destory=t(o,(function(t){return function(t,n,o){if("start"===n.type){if(o.length<2){var y={id:n.id,x:n.x,y:n.y};return o.push(y),1===o.length?e(t,"dragstart",{x:o[0].x,y:o[0].y}):(y.l=Math.sqrt(Math.pow(n.x-o[0].x,2)+Math.pow(n.y-o[0].y,2)),e(t,"dragend",{x:o[0].x,y:o[0].y}),e(t,"zoomstart",{x:(o[0].x+o[1].x)/2,y:(o[0].y+o[1].y)/2})),!0}}else"move"===n.type?function(t,n,o){if(n.domEvent.preventDefault(),n.domEvent.stopPropagation(),1===o.length)n.id===o[0].id&&(o[0].x=n.x,o[0].y=n.y,e(t,"dragmove",{x:o[0].x,y:o[0].y}));else{var y=n.id===o[0].id?0:1;o[y].x=n.x,o[y].y=n.y,e(t,"zoomchange",{zoom:Math.sqrt(Math.pow(o[1].x-o[0].x,2)+Math.pow(o[1].y-o[0].y,2))/o[1].l})}}(t,n,o):function(t,n,o){if(2===o.length){var y=n.id===o[0].id?0:1;o[y].x=n.x,o[y].y=n.y,e(t,"zoomend",{zoom:Math.sqrt(Math.pow(o[1].x-o[0].x,2)+Math.pow(o[1].y-o[0].y,2))/o[1].l}),o.splice(y,1),delete o[0].l,e(t,"dragstart",{x:o[0].x,y:o[0].y})}else o.pop(),e(t,"dragend",{x:n.x,y:n.y})}(t,n,o)}(y,t,r)})).destory};function e(t,e,n){var o="on"+e;"function"==typeof t[o]&&(n||(n={}),n.type=e,t[o](n))}}));
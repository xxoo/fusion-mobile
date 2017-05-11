"use strict";define(["common/pointerevents/pointerevents"],function(t){function i(t,i){var e,n;i?(e=Math.round(Math.sqrt(-1*t.subcontainer.offsetLeft/t.container.clientWidth)*t.duration),n=0):(e=Math.round(Math.sqrt((t.container.offsetWidth+t.subcontainer.offsetLeft)/t.container.clientWidth)*t.duration),n="-100%"),e>0?(t.sliding=!0,t.subcontainer.style[b]="left "+e+"ms ease-in-out",t.subcontainer.style.left=n):a(t)}function e(t,i){if(t.target===this){for(i.invisible.appendChild("-100%"===this.style.left?this.firstChild:this.lastChild),this.style[b]="",this.style.left=0,i.sliding=!1;i.removeStack.length>0;)i.remove(i.removeStack.shift());for(;i.pushStack.length>0;)i.add(i.pushStack.shift());o(i,"slidend"),a(i)}}function n(t,i,e,n){if("start"===t.type){if(!e.pointers.length&&i.children.length>1&&!i.sliding)return i.timer&&(clearTimeout(i.timer),delete i.timer),n.ox=n.nx=n.x=t.x,n.ot=n.nt=t.domEvent.timeStamp,n.sl=function(t){document.removeEventListener("scroll",n.sl,!0),delete n.sl},document.addEventListener("scroll",n.sl,!0),!0}else(i.moving||n.sl)&&("move"===t.type?s(t,i,n):"end"===t.type?r(t,i,n):h(i,n))}function s(t,i,e){var n,s,r;i.children.length>1&&!i.sliding&&(e.ox=e.nx,e.ot=e.nt,e.nx=t.x,e.nt=t.domEvent.timeStamp,!i.moving&&Math.abs(e.nx-e.x)>i.minVal&&(i.moving=!0,e.sl()),i.moving&&(n=e.nx-e.x,s=e.nx>e.x?Math.floor(n/i.container.clientWidth):Math.ceil(n/i.container.clientWidth),n%=i.container.clientWidth,0===s?s=i.current:(e.x+=s*i.container.clientWidth,s=c(i.current-s,i.children.length)),r=0===n?s:c(n>0?s-1:s+1,i.children.length),i.children[s]!==i.subcontainer.firstChild&&i.children[r]!==i.subcontainer.firstChild&&i.invisible.appendChild(i.subcontainer.firstChild),i.subcontainer.lastChild&&i.children[s]!==i.subcontainer.lastChild&&i.children[r]!==i.subcontainer.lastChild&&i.invisible.appendChild(i.subcontainer.lastChild),i.children[s].parentNode!==i.subcontainer&&(i.subcontainer.childNodes.length>0&&n<0?i.subcontainer.insertBefore(i.children[s],i.children[r]):i.subcontainer.appendChild(i.children[s])),n>0?(i.subcontainer.firstChild!==i.children[r]&&i.subcontainer.insertBefore(i.children[r],i.children[s]),i.subcontainer.style.left=n-i.container.clientWidth+"px"):n<0?(i.subcontainer.lastChild!==i.children[r]&&i.subcontainer.appendChild(i.children[r]),i.subcontainer.style.left=n+"px"):i.subcontainer.style.left=0,s!==i.current&&(i.current=s,o(i,"change",{current:!0})))),i.moving&&(t.domEvent.preventDefault(),t.domEvent.stopPropagation())}function r(t,e,n){var s,r;2===e.subcontainer.childNodes.length?(s=(t.x-n.ox)/(t.domEvent.timeStamp-n.ot),r=Math.pow(s,2)*e.rate,s<0&&(r*=-1),e.children[e.current]===e.subcontainer.firstChild?e.subcontainer.offsetLeft+r<-.5*e.container.offsetWidth?(i(e,!1),e.current=c(e.current+1,e.children.length),o(e,"change",{current:!0})):i(e,!0):e.subcontainer.offsetLeft+r>-.5*e.container.offsetWidth?(i(e,!0),e.current=c(e.current-1,e.children.length),o(e,"change",{current:!0})):i(e,!1)):a(e),l(e,n)}function h(t,e){2===t.subcontainer.childNodes.length?i(t,t.children[t.current]===t.subcontainer.firstChild):a(t),l(t,e)}function l(t,i){t.moving?t.moving=!1:i.sl&&i.sl()}function c(t,i){var e=t%i;return e<0&&(e+=i),e}function o(t,i,e){var n="on"+i;if("function"==typeof t[n])t[n]({type:i,__proto__:e})}function d(t){t.preventDefault()}function a(t){t.delay&&(t.timer=setTimeout(function(){delete t.timer,t.slideTo(t.current+1)},t.delay))}function u(t){t.target===this&&(this.scrollLeft=this.scrollTop=0)}var p,f,b;return"transition"in document.documentElement.style?(b="transition",f="transitionend"):(b="webkitTransition",f="webkitTransitionEnd"),p=function(i,s,r){function h(t){return n(t,a,o,b)}function l(t){a.sliding&&(t.preventDefault(),t.stopPropagation())}if(!(this instanceof p))return new p(i);var c,o,a=this,b={};if(this.pushStack=[],this.removeStack=[],i?(this.container=i,"static"===getComputedStyle(i).position&&(i.style.position="relative")):(this.container=document.createElement("div"),this.container.style.position="relative"),this.container.style.overflow="hidden",this.container.style.userSelect="none",this.invisible=this.container.appendChild(document.createElement("div")),this.invisible.style.position="absolute",this.invisible.style.visibility="hidden",this.subcontainer=this.container.appendChild(document.createElement("div")),this.subcontainer.style.position="absolute",this.subcontainer.style.width="200%",this.subcontainer.style.height="100%",this.subcontainer.style.left=this.subcontainer.style.top=0,this.subcontainer.addEventListener(f,function(t){e.call(this,t,a)},!1),this.container.addEventListener("dragstart",d,!1),this.container.addEventListener("scroll",u,!1),this.container.addEventListener("click",l,!0),o=t(this.container,h),s instanceof Array&&s.length>0)for(this.children=s,"number"==typeof r&&r>=0&&r<s.length?this.current=r:this.current=0,c=0;c<s.length;c++)s[c].style.width="50%",s[c].style.height="100%",s[c].style.display="inline-block",c===this.current?this.subcontainer.appendChild(s[c]):this.invisible.appendChild(s[c]);else this.current=undefined,this.children=[]},p.prototype.rate=4e3,p.prototype.duration=400,p.prototype.minVal=5,p.prototype.add=function(t){var i;return this.sliding?this.pushStack.push(t):(i=this.children.length,t.style.width="50%",t.style.height="100%",t.style.display="inline-block",this.children.push(t),i?(2===this.subcontainer.childNodes.length?this.current===i-1&&this.subcontainer.firstChild===this.children[this.current]?(this.invisible.appendChild(this.subcontainer.firstChild),this.subcontainer.insertBefore(t,this.subcontainer.lastChild)):0===this.current&&this.subcontainer.lastChild===this.children[this.current]?(this.invisible.appendChild(this.subcontainer.lastChild),this.subcontainer.appendChild(t)):this.invisible.appendChild(t):this.invisible.appendChild(t),o(this,"change",{length:!0})):(this.subcontainer.appendChild(t),this.current=0,o(this,"change",{current:!0,length:!0}))),i},p.prototype.remove=function(t){var i;return this.sliding?("number"==typeof t&&(t=this.children[t]),this.removeStack.indexOf(t)<0&&this.removeStack.push(t)):this.children.length>0&&("number"!=typeof t&&(t=this.children.indexOf(t)),t=c(t,this.children.length),i=this.children.splice(t,1)[0],this.current===t?(2===this.subcontainer.childNodes.length?this.children.length>1?i===this.subcontainer.firstChild?(this.current=c(t-1,this.children.length),this.subcontainer.insertBefore(this.children[this.current],i)):(this.current=c(t,this.children.length),this.subcontainer.appendChild(this.children[this.current])):(this.current=0,this.subcontainer.style.left=0):this.children.length>0?(this.current=c(t,this.children.length),this.subcontainer.appendChild(this.children[this.current])):this.current=undefined,this.subcontainer.removeChild(i),o(this,"change",{current:!0,length:!0})):(i.parentNode===this.subcontainer?(this.children.length>1?i===this.subcontainer.firstChild?this.subcontainer.insertBefore(this.children[c(t-1,this.children.length)],i):this.subcontainer.appendChild(this.children[c(t,this.children.length)]):(this.subcontainer.removeChild(i),this.subcontainer.style.left=0),this.subcontainer.removeChild(i)):this.invisible.removeChild(i),this.current>t?(this.current-=1,o(this,"change",{current:!0,length:!0})):o(this,"change",{length:!0}))),i},p.prototype.clear=function(){if(this.sliding)this.removeStack=this.children.slice(0),this.pushStack=[];else for(;this.children.length;)this.remove(0)},p.prototype.slideTo=function(t,e){var n;return 1===this.subcontainer.childNodes.length&&this.children.length>1?((t=c(t,this.children.length))!==this.current&&(e?(this.invisible.appendChild(this.children[this.current]),this.subcontainer.appendChild(this.children[t])):0===t&&this.current===this.children.length-1||t>this.current?(this.subcontainer.appendChild(this.children[t]),i(this,!1)):(this.subcontainer.insertBefore(this.children[t],this.children[this.current]),this.subcontainer.style.left="-100%",i(this,!0)),this.current=t,o(this,"change",{current:!0})),n=!0):n=!1,n},p.prototype.startPlay=function(t){this.stopPlay(),this.delay=t,a(this)},p.prototype.stopPlay=function(){var t;return this.delay?(delete this.delay,this.timer&&(clearTimeout(this.timer),delete this.timer),t=!0):t=!1,t},p});
"use strict";define(["common/touchslider/touchslider","common/touchguesture/touchguesture","common/pointerevents/pointerevents","common/svgicos/svgicos","site/pages/pages","site/panels/panels","site/popups/popups","./lang"],function(t,e,n,i,s,a,o,l){var r,c,f,h,u,d,y,m,v,w=document.body.querySelector("#activities"),g={appendCss:function(t,e){var n=document.createElement("link");return self.less&&!e?(n.rel="stylesheet/less",n.href=t+".less",less.sheets.push(n),less.refresh()):(n.rel="stylesheet",n.href=t+".css"),document.head.appendChild(n)},removeCss:function(t){t.remove(),"stylesheet/less"===t.rel&&(less.sheets.splice(less.sheets.indexOf(t),1),less.refresh())},makeSvg:function(t,e){var n="http://www.w3.org/2000/svg",i=document.createElementNS(n,"svg");return i.appendChild(document.createElementNS(n,"path")),t&&g.setSvgPath(i,t,e),i},setSvgPath:function(t,e,n){var s=g.makeSvg();i.hasOwnProperty(e)&&(e=i[e]),t.firstChild.setAttribute("d",e),s.style.position="absolute",s.style.bottom=s.style.right="100%",s.firstChild.setAttribute("d",e),document.body.appendChild(s);var a=s.firstChild.getBBox();s.remove(),2==n?(a.width+=2*a.x,a.x=0,a.height+=2*a.y,a.y=0):n&&(a.width>a.height?(a.y-=(a.width-a.height)/2,a.height=a.width):(a.x-=(a.height-a.width)/2,a.width=a.height)),t.setAttribute("viewBox",a.x+" "+a.y+" "+a.width+" "+a.height)},parseHash:function(t){var e={id:r,args:{}},n=(t=t.substr(1).replace(/[#?].*$/,"")).match(/[^=&]+(=[^&]*)?/g);if(n&&"!"===n[0].charAt(0)){var i=decodeURIComponent(n[0].substr(1));s.hasOwnProperty(i)&&(e.id=i);for(var a=1;a<n.length;a++)(i=n[a].match(/^([^=]+)(=)?(.+)?$/))&&(e.args[decodeURIComponent(i[1])]=i[2]?decodeURIComponent(i[3]||""):void 0)}return e},getDefaultBack:function(t){var e;if(t||(t=g.location),t.args.backHash)try{e=g.parseHash(t.args.backHash)}catch(l){}if(e)return e;var n=s[t.id].backLoc;if(s[t.id].back&&s[s[t.id].back]){e={id:s[t.id].back,args:{}};var i=s[s[t.id].back].alias?s[s[s[t.id].back].alias]:s[s[t.id].back];if(i.args)for(var a=0;a<i.args.length;a++)t.args.hasOwnProperty(i.args[a])&&(e.args[i.args[a]]=t.args[i.args[a]])}if(n&&e){for(var o in e.args)if(e.args[o]!==n.args[o])return e;return n}return n||e},isGoingback:function(t,e){var n=t;if(n!==e){if(e===r||n.length>e.length+1&&n.substr(0,e.length+1)===e+"-")return!0;for(;s[n].back;)if((n=s[n].back)===e)return!0;n=t.split("-");for(var i,a=e.split("-"),o=Math.min(n.length,a.length);i<o&&n[i]===a[i];)i++;if(i<Math.max(n.length,a.length)-1)return i<n.length-1&&n.splice(i+1),i<a.length-1&&a.splice(i+1),g.isGoingback(n.join("-"),a.join("-"))}},replaceLocation:function(t){g.location&&g.isSameLocation(t,g.location)?g.reloadPage():location.replace(g.buildHash(t))}};return document.documentElement.style.hasOwnProperty("animation")?(c="animationend",f="animationName",h="animationDuration"):(c="webkitAnimationEnd",f="webkitAnimationName",h="webkitAnimationDuration"),self.frameElement&&frameElement.kernel?self.Reflect?Reflect.setPrototypeOf(g,frameElement.kernel):g.__proto__=frameElement.kernel:(g.buildHash=function(t){var e="#!"+encodeURIComponent(t.id);for(var n in t.args)e+=void 0===t.args[n]?"&"+encodeURIComponent(n):"&"+encodeURIComponent(n)+"="+encodeURIComponent(t.args[n]);return e},g.isSameLocation=function(t,e){if(t.id===e.id&&Object.keys(t.args).length===Object.keys(e.args).length){for(var n in t.args){if(!e.args.hasOwnProperty(n))return!1;if(void 0===t.args[n]){if(t.args[n]!==e.args[n])return!1}else if(""+t.args[n]!=""+e.args[n])return!1}return!0}return!1},g.getLang=function(t){if(navigator.languages){for(var e=0;e<navigator.languages.length;e++)if(t.hasOwnProperty(navigator.languages[e]))return t[navigator.languages[e]]}else if(t.hasOwnProperty(navigator.language))return t[navigator.language];return t.en},function(){var t,e,n,i,s=document.head.querySelector("meta[name=viewport]"),a=s.content;function o(){var i=s.content.match(/initial-scale=([\d\.]+)/);i=i?+i[1]:1;var a=Math.round(innerWidth*i),r=Math.round(innerHeight*i);t===a&&e===r?n=requestAnimationFrame(o):(l(a,r),t=a,e=r,n=void 0)}function l(t,e,n){if(t&&e){var a=Math.min(t,e),o=a/i;o>1&&(o=Math.sqrt(o)),o=n?"user-scalable=no, width="+Math.round(t/o):"user-scalable=no, initial-scale="+(o=a/Math.round(a/o))+", maximum-scale="+o+", minimum-scale="+o,s.content!==o&&(s.content=o)}}g.setAutoScale=function(n){(i=n)>0?self.visualViewport?self.visualViewport.dispatchEvent(new Event("resize")):self.dispatchEvent(new Event("resize")):(s.content=a,t=e=void 0)},self.visualViewport?self.visualViewport.addEventListener("resize",function(){i>0&&l(Math.round(this.width*this.scale),Math.round(this.height*this.scale),!0)}):self.addEventListener("resize",function(){i>0&&(n&&cancelAnimationFrame(n),o())})}(),function(){var t="function"==typeof Symbol?Symbol("xEvents"):"xEvents";function e(e){this[t][e.type].locked=!0;for(var i=0;i<this[t][e.type].heap.length;i++)this[t][e.type].heap[i].call(this,e);for(this[t][e.type].locked=!1;this[t][e.type].stack.length;){if(this[t][e.type].stack[0])if("function"==typeof this[t][e.type].stack[0]){var s=this[t][e.type].heap.indexOf(this[t][e.type].stack[0]);s>=0&&this[t][e.type].heap.splice(s,1)}else this[t][e.type].heap.indexOf(this[t][e.type].stack[0][0])<0&&this[t][e.type].heap.push(this[t][e.type].stack[0][0]);else this[t][e.type].heap.splice(0);this[t][e.type].stack.shift()}n(this,e.type)}function n(e,n,i){!i&&e[t][n].heap.length||(delete e[t][n],e["on"+n]=null)}g.listeners={add:function(n,i,s){var a=0;return"function"==typeof s&&(n.hasOwnProperty(t)||(n[t]={}),n[t].hasOwnProperty(i)||(n[t][i]={stack:[],heap:[],locked:!1},n["on"+i]=e),n[t][i].locked?(n[t][i].stack.push([s]),a=2):n[t][i].heap.indexOf(s)<0&&(n[t][i].heap.push(s),a=1)),a},list:function(e,n){var i;if(n)i=e.hasOwnProperty(t)&&e[t].hasOwnProperty(n)?e[t][n].heap.slice(0):[];else if(i={},e.hasOwnProperty(t))for(var s in e[t])i[s]=e[t][s].heap.slice(0);return i},remove:function(e,i,s){var a=0;if(e.hasOwnProperty(t))if(i){if(e[t].hasOwnProperty(i))if(e[t][i].locked)e[t][i].stack.push(s),a=2;else if("function"==typeof s){var o=e[t][i].heap.indexOf(s);o>=0&&(e[t][i].heap.splice(o,1),n(e,i),a=1)}else n(e,i,!0),a=1}else{for(var l in e[t])e[t][l].locked?(e[t][l].stack.push(void 0),a=2):n(e,l,!0);a||(a=1)}return a}}}(),function(){function t(t){0===this.scrollTop?this.scrollTop=1:this.scrollTop+this.clientHeight===this.scrollHeight&&(this.scrollTop-=1)}g.scrollReload=function(t,e){var i,s,a,o,l=this,r=n(t,function(n){if("start"===n.type){if(0===r.pointers.length&&0===l.getScrollTop(t))return i=n.y,n.domEvent.view.addEventListener("scroll",c,!0),!0}else{if(o)return o=!1,!0;if(n.y>i){s||(s=!0,n.domEvent.view.removeEventListener("scroll",c,!0)),n.domEvent.preventDefault(),n.domEvent.stopPropagation(),a||((a=n.domEvent.view.document.createElement("span")).className="reloadHint",a.appendChild(l.makeSvg("sync-alt-solid",1)),t.appendChild(a));var f=a.offsetHeight||a.clientHeight,h=n.y-i-f;h<f?(a.classList.remove("pin"),a.style.top=17*h/16-17*Math.pow(h,2)/(32*f)+11*f/32+"px",a.style.opacity=(h+f)/(2*f),a.style.transform="rotate("+360*a.style.opacity+"deg)"):a.classList.contains("pin")||(a.style.top=f+"px",a.style.opacity=1,a.classList.add("pin"),a.style.transform="",navigator.vibrate&&navigator.vibrate(10))}else{if(n.y<i&&!s)return!0;a&&(a.remove(),a=void 0)}"end"!==n.type&&"cancel"!==n.type||(a&&(a.remove(),a.classList.contains("pin")&&("function"==typeof e?e():l.reloadPage()),a=void 0),s=!1)}});function c(e){e.target!==t&&(o=!0,this.removeEventListener("scroll",c,!0))}l.fixIosScrolling(t)},g.fixIosScrolling=function(e,n){"IOS"===browser.name&&(e.addEventListener("touchmove",q,{passive:!1}),n||(e.classList.add("iosScrollFix"),e.scrollTop=1,e.addEventListener("scroll",t)))},g.getScrollTop=function(t){return t.classList.contains("iosScrollFix")?t.scrollTop-1:t.scrollTop},g.getScrollHeight=function(t){return t.classList.contains("iosScrollFix")?t.scrollHeight-2:t.scrollHeight},g.setScrollTop=function(t,e){t.scrollTop=t.classList.contains("iosScrollFix")?e+1:e}}(),function(){var t,e=document.body.querySelector("#helper"),n=e.firstChild,i=e.lastChild;function s(t){i.src=t.img,"right"in t&&(i.style.right=t.right),"left"in t&&(i.style.left=t.left),"top"in t&&(i.style.top=t.top),"bottom"in t&&(i.style.bottom=t.bottom),"width"in t&&(i.style.width=t.width),"height"in t&&(i.style.height=t.height);for(var e=0;e<n.childNodes.length;e++){var s=n.childNodes[e];t.rows[e]?(s.style.height=t.rows[e],s.className="unflexable"):(s.style.height="auto",s.className="flexable")}for(var a=0;a<n.childNodes[1].childNodes.length;a++){var o=n.childNodes[1].childNodes[a];t.cells[a]?(o.style.width=t.cells[a],o.className="unflexable"):(o.style.width="auto",o.className="flexable")}}e.addEventListener("click",function n(){t.length>1?(t.shift(),"function"==typeof t[0]?(t[0](),n()):s(t[0])):e.style.display=""}),g.showHelper=function(n){s((t="Array"===dataType(n)?n:[n])[0]),e.style.display="block"}}(),function(){var t,e,i,s,o,l,r,c,f,h,u=document.querySelector("#panel"),d=u.querySelector(":scope>.backdrop"),y=u.querySelector(":scope>.content"),m=n(u,function(n){if("start"===n.type){if(!m.pointers.length&&!t)return y.querySelector(":scope>."+e),o=l=s=n.x,r=c=n.domEvent.timeStamp,n.domEvent.view.addEventListener("scroll",b,!0),!0}else{if(h)return h=!1,!0;if("move"===n.type)o=l,r=c,l=n.x,c=n.domEvent.timeStamp,!f&&Math.abs(l-s)>5&&(f=!0,n.domEvent.view.removeEventListener("scroll",b,!0)),f&&(n.domEvent.preventDefault(),y.style.transform="translateX("+Math.max(Math.min(l-s,0),-y.offsetWidth)+"px)");else{if(f){var i=(n.x-o)/(n.domEvent.timeStamp-r),a=4e3*Math.pow(i,2);i<0&&(a=-a),(!(a=a+l-s<-y.offsetWidth/2)||g.closePanel())&&a||"translateX(0px)"===y.style.transform||(y.style.transition="",y.style.transform="translateX(0px)",y.addEventListener("transitionend",w))}else n.domEvent.view.addEventListener("scroll",b,!0);h=f=!1}}});function v(n){if("function"!=typeof a[e].onunload||!a[e].onunload())return a[e].status--,t=y.querySelector(":scope>."+e),y.style.transition=y.style.transform="",n&&(d.style.opacity=""),!0}function w(t){t.target===this&&(this.style.transition="none",this.removeEventListener(t.type,w))}function b(){h=!0,this.removeEventListener("scroll",b,!0)}g.openPanel=function(t,e){if(a.hasOwnProperty(t))return L("panel",t,function(n){"function"==typeof a[t].open?a[t].open(e):g.showPanel(t)}),!0},g.showPanel=function(n){var s=0;return a[n].status>1&&(t?(i=g.showPopup.bind(this,n),s=2):e?e===n?("function"!=typeof a[n].onload&&a[n].onload(),"function"==typeof a[n].onloadend&&a[n].onloadend(),s=1):v()&&(i=g.showPanel.bind(this,n),s=1):(a[n].status++,"fucntion"==typeof a[n].onload&&a[n].onload(),u.style.visibility="inherit",d.style.opacity=1,(t=y.querySelector(":scope>."+n)).style.right=t.style.top="auto",t.style.position="relative",y.style.width=t.offsetWidth+"px",y.style.transform="translateX(0px)",u.className=e=n)),s},g.closePanel=function(n){var s=0;return t?(i=g.closePanel.bind(this,n),s=2):e&&(!n||e===n||"Array"===dataType(n)&&n.indexOf(e)>=0)&&v(!0)&&(s=1),s},g.getCurrentPanel=function(){return e},g.destroyPanel=function(t){if(2===a[t].status)return E(a[t],"panel",t),!0},y.addEventListener("transitionend",function(n){if(t&&n.target===this&&(this.style.transform?("function"==typeof a[e].onloadend&&a[e].onloadend(),a[e].status++,this.style.width="",this.style.transition="none"):("function"==typeof a[e].onunloadend&&a[e].onunloadend(),a[e].status--,t.style.position=t.style.right=t.style.top="",a[e].autoDestroy?E(a[e],"panel",e):document.activeElement&&t.contains(document.activeElement)&&document.activeElement.blur(),e=void 0),t=void 0,i)){var s=i;i=void 0,s()}}),d.addEventListener("transitionend",function(t){t.target!==this||d.style.opacity||(u.style.visibility="")}),d.addEventListener("click",g.closePanel.bind(g,void 0))}(),function(){var t,e,n,i,s,a=document.body.querySelector("#popup"),r=a.querySelector(":scope>.header>.close"),f=a.querySelector(":scope>.header>.title").firstChild,h=a.querySelector(":scope>.header>.back");function u(i){t&&a.classList.remove(t),e=n=void 0,t=i,a.classList.add(t),f.data=o[i].title,w.classList.contains("hidePopupHeader")&&(document.title=f.data),h.style.display="none"}g.openPopup=function(e,n,i){if(o.hasOwnProperty(e))return L("popup",e,function(){"function"==typeof o[e].open?o[e].open(n,t&&i):g.showPopup(e,i)}),!0},g.showPopup=function(e,n){var l=0;if(o[e].status>1)if(i)s=g.showPopup.bind(this,e,n),l=2;else if(t){if(t===e)"function"==typeof o[e].onload&&o[e].onload(),"function"==typeof o[e].onloadend&&o[e].onloadend(),l=1;else if("function"!=typeof o[t].onunload||!o[t].onunload()){var r=a.querySelector(":scope>.content>."+t);o[t].status--,o[e].status++,"function"==typeof o[e].onload&&o[e].onload(n),b(a.querySelector(":scope>.content>."+e),r,n,function(){var a=t;if(i=!1,u(e),"function"==typeof o[a].onunloadend&&o[a].onunloadend(),o[a].status--,o[a].autoDestroy?E(o[a],"popup",a):document.activeElement&&r.contains(document.activeElement)&&document.activeElement.blur(),"function"==typeof o[t].onloadend&&o[t].onloadend(n),o[e].status++,"function"==typeof s){var l=s;s=void 0,l()}}),i=e,l=1}}else{o[e].status++,"fucntion"==typeof o[e].onload&&o[e].onload();var c=a.querySelector(":scope>.content>."+e);c.style.left=0,c.style.visibility="inherit",a.classList.add("in"),i=e,"function"==typeof g.popupEvents.onshow&&g.popupEvents.onshow({type:"show",id:e}),u(e),g.hideReadable(),l=1}return l},g.closePopup=function(e){var n=0;return i?(s=g.closePopup.bind(this,e),n=2):!t||e&&t!==e&&!("Array"===dataType(e)&&e.indexOf(t)>=0)||"function"==typeof o[t].onunload&&o[t].onunload()||(o[t].status--,a.classList.remove("in"),a.classList.add("out"),i=!0,"function"==typeof g.popupEvents.onhide&&g.popupEvents.onhide({type:"hide",id:t}),n=1),n},g.getCurrentPopup=function(){return t},g.setPopupBack=function(t,i){a.classList.contains("in")&&(t?(h.lastChild.data="function"!=typeof t&&o[t].title?o[t].title:l.back,e=t,h.style.display="",n=i):h.style.display="none")},g.setPopupTitle=function(e,n){n?o.hasOwnProperty(n)&&(o[n].title=e,t===n&&(f.data=e,w.classList.contains("hidePopupHeader")&&(document.title=f.data))):a.classList.contains("in")&&(f.data=e,w.classList.contains("hidePopupHeader")&&(document.title=f.data))},g.destroyPopup=function(t){if(2===o[t].status)return E(o[t],"popup",t),!0},g.popupEvents={},r.appendChild(g.makeSvg("times-light",1)),r.addEventListener("click",function(){g.closePopup()}),h.insertBefore(g.makeSvg("angle-left-light",1),h.firstChild),h.addEventListener("click",function(t){"function"==typeof e?e(n):g.openPopup(e,n,!0)}),a.addEventListener(c,function(e){if(e.target===this){if(i=!1,this.classList.contains("out")){this.classList.remove("out");var n=a.querySelector(":scope>.content>."+t);n.style.left=n.style.visibility="","function"==typeof o[t].onunloadend&&o[t].onunloadend(),o[t].status--,o[t].autoDestroy?E(o[t],"popup",t):document.activeElement&&n.contains(document.activeElement)&&document.activeElement.blur(),a.classList.remove(t),"function"==typeof g.popupEvents.onhideend&&g.popupEvents.onhideend({type:"hideend",id:t}),t=void 0}else"function"==typeof g.popupEvents.onshowend&&g.popupEvents.onshowend({type:"showend",id:t}),"function"==typeof o[t].onloadend&&o[t].onloadend(),o[t].status++;if("function"==typeof s){var l=s;s=void 0,l()}}})}(),y=document.body.querySelector("#readable"),m=y.querySelector(":scope>.close"),v=y.querySelector(":scope>.content"),g.fixIosScrolling(v),d=v.className,g.showReadable=function(t,e,n){"string"==typeof t?v.innerHTML=t:v.appendChild(t),v.className=n?d+" "+n:d,y.className="in",u=e},g.hideReadable=function(){y.classList.contains("in")&&(y.classList.remove("in"),y.classList.add("out"),"function"==typeof u&&u())},g.showForeign=function(t,e){g.showReadable(`<iframe frameborder="no" scrolling="${"IOS"===browser.name?"no":"auto"}" sandbox="allow-same-origin allow-forms allow-scripts allow-modals" src="${t}"></iframe>`,e,"foreign")},m.appendChild(g.makeSvg("times-solid",1)),m.addEventListener("click",g.hideReadable),y.addEventListener(c,function(t){if(t.target===this&&this.classList.contains("out")){for(;v.childNodes.length>0;)v.firstChild.remove();this.className=""}}),function(){var n,i,s=0,a=[],o={},r=document.body.querySelector("#loading"),c=document.body.querySelector("#hint"),f=document.body.querySelector("#dialog"),h=f.querySelector(":scope>div"),u=h.querySelector(":scope>.content"),d=h.querySelector(":scope>.close"),y=h.querySelector(":scope>.btns>.yes"),m=h.querySelector(":scope>.btns>.no"),v=document.body.querySelector("#sliderView"),E=v.querySelector(":scope>.close"),L=t(v.querySelector(":scope>.content")),b=document.body.querySelector("#photoView"),S=b.querySelector(":scope>.close"),C=b.querySelector(":scope>img"),q=b.querySelector(":scope>.actions"),p=e(b);function M(){g.closeDialog()}function T(t,e,n,s){"inherit"===f.style.visibility?a.push([t,e,n,s]):(h.className=t,"alert"===t?"Array"===dataType(e)?(u.textContent=e[0],y.firstChild.data=e[1]):(u.textContent=e,y.firstChild.data=l.ok):"confirm"===t?"Array"===dataType(e)?(u.textContent=e[0],y.firstChild.data=e[1],m.firstChild.data=e[2]):(u.textContent=e,y.firstChild.data=l.yes,m.firstChild.data=l.no):"string"==typeof e?u.innerHTML=e:u.appendChild(e),f.style.visibility="inherit",i=n,"function"==typeof s&&s())}function O(){C.style.width=o.w+"px",C.style.height=o.h+"px",C.style.left=o.l+"px",C.style.top=o.t+"px"}function N(){o.ww=innerWidth,o.wh=innerHeight,o.wr=o.ww/o.wh,o.ow=C.naturalWidth,o.oh=C.naturalHeight,o.r=o.ow/o.oh,o.ow>o.ww||o.oh>o.wh?o.r>o.wr?(o.z=o.mz=o.ww/o.ow,o.l=0,o.w=o.ww,o.h=o.w/o.r,o.t=(o.wh-o.h)/2):(o.z=o.mz=o.wh/o.oh,o.t=0,o.h=o.wh,o.w=o.h*o.r,o.l=(o.ww-o.w)/2):(o.z=o.mz=1,o.w=o.ow,o.h=o.oh,o.l=(o.ww-o.w)/2,o.t=(o.wh-o.h)/2),O()}p.onzoomstart=function t(e){var n=e.x,i=e.y,s=o.z;this.onzoomstart=null;this.onzoomchange=a;this.onzoomend=function(e){a.call(this,e),this.onzoomchange=this.zoomend=null,this.onzoomstart=t};function a(t){var e=Math.max(Math.min(t.zoom*s,1),o.mz);e!==o.z&&(o.w=o.ow*e,o.h=o.oh*e,o.l=o.w>o.ww?Math.min(Math.max(n+(o.l-n)*e/o.z,o.ww-o.w),0):(o.ww-o.w)/2,o.t=o.h>o.wh?Math.min(Math.max(i+(o.t-i)*e/o.z,o.wh-o.h),0):(o.wh-o.h)/2,o.z=e,O())}},p.ondragstart=function t(e){var n=e.x,i=e.y,s=o.l,a=o.t;p.ondragmove=l;p.ondragend=function(e){l.call(this,e),this.ondragmove=this.ondragend=null,this.ondragstart=t};function l(t){o.w>o.ww&&(o.l=Math.min(Math.max(s+t.x-n,o.ww-o.w),0)),o.h>o.wh&&(o.t=Math.min(Math.max(a+t.y-i,o.wh-o.h),0)),O()}},g.showPhotoView=function(t,e,n){for(C.src=t;q.childNodes.length;)q.firstChild.remove();if("function"==typeof n&&e&&e.length){for(var i=0;i<e.length;i++){var s=document.createElement("a");s.href="javascript:;",s.appendChild(document.createTextNode(e[i])),s.addEventListener("click",n.bind(g,i)),q.appendChild(s)}q.style.display=""}else q.style.display="none"},g.hidePhotoView=function(){C.src="about:blank"},C.addEventListener("load",function(){b.style.visibility="inherit",self.addEventListener("resize",N),N()}),C.addEventListener("error",function(){b.style.visibility="",self.removeEventListener("resize",N)}),g.showSliderView=function(t,e,n){v.className=n||"";for(var i=0;i<t.length;i++)L.add(t[i]);e&&L.slideTo(e,!0)},g.hideSliderView=function(){L.clear()},g.alert=function(t,e,n){T("alert",t,e,n)},g.confirm=function(t,e,n){T("confirm",t,e,n)},g.htmlDialog=function(t,e,n,i){T(e||"",t,n,i)},g.closeDialog=function(t){if("function"==typeof i){var e=i;i=void 0,e(t)}for(f.style.visibility="";u.childNodes.length;)u.lastChild.remove();a.length&&T.apply(void 0,a.shift())},g.showLoading=function(t){r.querySelector(":scope>div").lastChild.data=t||l.loading,0===s&&(r.style.visibility="inherit",w.classList.add("mask")),s++},g.hideLoading=function(){s>0&&0===--s&&(r.style.visibility="",w.classList.remove("mask"),"function"==typeof g.dialogEvents.onloaded&&g.dialogEvents.onloaded({type:"loaded"}))},g.isLoading=function(){return s>0},g.hint=function(t,e){c.querySelector(":scope>.text").firstChild.data=t,n?clearTimeout(n):c.style.opacity=1,n=setTimeout(function(){c.style.opacity="",n=void 0},e||5e3)},g.dialogEvents={},L.onchange=function(){var t="";if(this.children.length){if(this.children.length>1)for(var e=0;e<this.children.length;e++)t+=e===this.current?"●":"○";v.style.visibility="inherit"}else v.style.visibility="";v.querySelector(":scope>.nav").firstChild.data=t},d.appendChild(g.makeSvg("times-light",1)),d.addEventListener("click",M),m.addEventListener("click",M),y.addEventListener("click",g.closeDialog),E.appendChild(g.makeSvg("times-solid",1)),S.appendChild(E.firstChild.cloneNode(!0)),E.addEventListener("click",g.hideSliderView),S.addEventListener("click",g.hidePhotoView)}()),function(){var t,e,n,i,a,o=location.pathname,c=document.body.querySelector("#page"),f=c.querySelector(":scope>.navMenu"),u=c.querySelector(":scope>.header>.title").firstChild,d=c.querySelector(":scope>.header>.back"),y=c.querySelector(":scope>.header>.leftMenuBtn"),m=c.querySelector(":scope>.header>.rightMenuBtn");try{sessionStorage.setItem(0,0),sessionStorage.removeItem(0)}catch(N){Storage.prototype.setItem=function(){}}function v(t){t&&(g.listeners.remove(this,t.type,v),setTimeout(function(){document.body.querySelector("#popup").style[h]=""},400)),document.body.addEventListener("transitionend",S),document.documentElement.classList.remove("loading")}function S(t){t.target===this&&(this.removeEventListener(t.type,S),this.style.transition="")}function C(t){for(;f.childNodes.length;)f.firstChild.remove();for(var e in a=t)if(s.hasOwnProperty(e)){var n=f.appendChild(document.createElement("a"));n.className=e,n.href="#!"+e,RegExp("^"+e+"(?:-|$)").test(g.location.id)?(n.classList.add("selected"),a[e]&&n.appendChild(g.makeSvg("string"==typeof a[e]?a[e]:a[e][1],1))):a[e]&&n.appendChild(g.makeSvg("string"==typeof a[e]?a[e]:a[e][0],1)),n.appendChild(document.createTextNode(s[e].alias?s[e].title||s[s[e].alias].title:s[e].title))}}function q(){var e=g.parseHash(location.hash);g.isSameLocation(e,g.location)||(g.lastLocation=g.location,g.location=e,!s[g.location.id].back||g.lastLocation.id!==s[g.location.id].back&&s[g.lastLocation.id].alias!==s[g.location.id].back?s[g.lastLocation.id].backLoc&&(g.location.id===s[g.lastLocation.id].back||s[g.location.id].alias&&s[g.location.id].alias===s[g.lastLocation.id].back)&&(delete s[g.lastLocation.id].backLoc,delete t[g.lastLocation.id],sessionStorage.setItem(o,toJsex(t))):(t[g.location.id]=s[g.location.id].backLoc=g.lastLocation,sessionStorage.setItem(o,toJsex(t))),p())}function p(){var t=g.location.id;if(g.hasOwnProperty("lastLocation")){var o=t.replace(/-.*$/,""),r=g.lastLocation.id.replace(/-.*$/,"");if(o!==r){var h=f.querySelector(":scope>a."+o);h&&(h.classList.add("selected"),a[o]&&"string"!=typeof a[o]&&g.setSvgPath(h.firstChild,a[o][1],1)),(h=f.querySelector(":scope>a."+r))&&(h.classList.remove("selected"),a[r]&&"string"!=typeof a[r]&&g.setSvgPath(h.firstChild,a[r][0],1))}T()}"function"==typeof g.pageEvents.onroute&&g.pageEvents.onroute({type:"route"}),L("page",t,function(a){if(n)i=!0;else{var o;if(t===e)O();else{var r=s[t].alias?s[t].alias:t,f=s[t].title||s[r].title;for(c.classList.add(t),u.data=f,(w.classList.contains("clean")||w.classList.contains("hidePageHeader"))&&(document.title=f),self.frameElement&&frameElement.kernel&&"page"===g.getCurrentPopup()&&g.setPopupTitle(f);m.childNodes.length;)m.firstChild.remove();for(m.removeAttribute("href");y.childNodes.length;)y.firstChild.remove();y.removeAttribute("href"),s[r].rightMenuContent||s[r].onrightmenuclick?("string"==typeof s[r].rightMenuContent?m.innerHTML=s[r].rightMenuContent:s[r].rightMenuContent&&m.appendChild(s[r].rightMenuContent),"function"==typeof s[r].onrightmenuclick?m.href="javascript:;":s[r].onrightmenuclick&&(m.href=s[r].onrightmenuclick),m.style.display=""):m.style.display="none",s[r].leftMenuContent||s[r].onleftmenuclick?("string"==typeof s[r].leftMenuContent?y.innerHTML=s[r].leftMenuContent:s[r].leftMenuContent&&y.appendChild(s[r].leftMenuContent),"function"==typeof s[r].onleftmenuclick?y.href="javascript:;":s[r].onleftmenuclick&&(y.href=s[r].onleftmenuclick),y.style.display=""):y.style.display="none";var h=g.getDefaultBack();if(h){var v=s[h.id].title;!v&&s[h.id].alias&&(v=s[s[h.id].alias].title),d.lastChild.data=v||l.back,d.href=g.buildHash(h),d.style.display=""}else d.style.display="none";var L=c.querySelector(":scope>.content>."+r);if(e){c.classList.remove(e);var S=s[e].alias?s[e].alias:e,C=e;if(e=t,r===S)O(o=!0);else{n=!0;var q=c.querySelector(":scope>.content>."+S),M=g.lastLocation&&g.lastLocation.args.backHash===location.hash||g.isGoingback(C,t);o=!M||a,b(L,q,M,function(){n=!1,"function"==typeof s[S].onunloadend&&s[S].onunloadend(),s[S].status--,s[S].autoDestroy?E(s[S],"page",S):document.activeElement&&q.contains(document.activeElement)&&document.activeElement.blur(),"function"==typeof s[r].onloadend&&s[r].onloadend(o),s[r].status++,i&&(i=!1,L.style.visibility="inherit",p())}),"function"==typeof s[S].onunload&&s[S].onunload(),s[S].status--,s[r].status++,"function"==typeof s[r].onload&&s[r].onload(o)}}else o=!0,e=t,L.style.left=0,L.style.visibility="inherit",O(o)}"function"==typeof g.pageEvents.onrouteend&&g.pageEvents.onrouteend({type:"routeend",force:o})}})}function M(t,n){var i=s[e].alias?s[s[e].alias]:s[e];(!t||t===e||"Array"===dataType(t)&&t.indexOf(e)>=0)&&(n||T(),"function"==typeof i.onload&&i.onload(!0),"function"==typeof i.onloadend&&i.onloadend(!0))}function T(){self.frameElement&&frameElement.kernel||(g.hideReadable(),g.closePopup())}function O(t){var n=s[e].alias?s[s[e].alias]:s[e];n.status<3&&n.status++,"function"==typeof n.onload&&n.onload(t),"function"==typeof n.onloadend&&n.onloadend(t),n.status<4&&n.status++}g.init=function(e){for(var n,i={},a=0;a<e.length;a++){var l=void 0,c=void 0;"string"==typeof e[a]?l=e[a]:(l=e[a].id,c=e[a].ico),s.hasOwnProperty(l)&&(n||(n=l),i[l]=c)}if(n)if(r){if(C(i),r!==n){var f=r;if(r=n,g.location.id===f)return q(),!0}}else{for(var u in r=n,g.location=g.parseHash(location.hash),g.location.args.ui&&g.location.args.ui.split(",").forEach(function(t){w.classList.add(t)}),(t=sessionStorage.getItem(o))&&(t=t.parseJsex())&&(t=t.value),t||(t={}),t)s.hasOwnProperty(u)&&(s[u].backLoc=t[u]);var d;if(self.addEventListener("hashchange",q),C(i),p(),g.location.args.hasOwnProperty("autoPopup"))g.location.args.hasOwnProperty("autoPopupArg")&&(d=g.location.args.autoPopupArg.parseJsex())&&(d=d.value),g.openPopup(g.location.args.autoPopup,d)?(document.body.querySelector("#popup").style[h]="1ms",g.listeners.add(g.popupEvents,"showend",v)):v();else v()}},g.reloadPage=function(t,e){var n;g.isLoading()?(n=g.location,g.listeners.add(g.dialogEvents,"loaded",function i(s){g.listeners.remove(this,s.type,i);n===g.location&&M(t,e)})):M(t,e)},g.destroyPage=function(t){if(2===s[t].status)return E(s[t],"page",t),!0},g.pageEvents={},d.insertBefore(g.makeSvg("angle-left-light",1),d.firstChild),m.addEventListener("click",function(t){var n=s[s[e].alias?s[e].alias:e];"function"==typeof n.onrightmenuclick&&n.onrightmenuclick()}),y.addEventListener("click",function(t){var n=s[s[e].alias?s[e].alias:e];"function"==typeof n.onleftmenuclick&&n.onleftmenuclick()})}(),l=g.getLang(l),self.addEventListener("contextmenu","Firefox"===browser.name?q:C),self.addEventListener("dragstart",C),"IOS"===browser.name&&(self.addEventListener("gesturestart",C,{passive:!1}),self.addEventListener("touchmove",C,{passive:!1})),g;function E(t,e,n){var i=document.body.querySelector("#"+e+">.content>."+n);if(i&&("function"==typeof t.ondestroy&&t.ondestroy(),i.remove(),t.js)){var s=e+"/"+n+"/"+n;require.defined(s)&&(i=require(s),require.undef(s),i&&(self.Reflect?Reflect.setPrototypeOf(t,Object.prototype):t.__proto__=Object.prototype))}t.css&&t.css.href&&(g.removeCss(t.css),t.css=!0),delete t.status}function L(t,e,n){var i,r;if("panel"===t?i=a[e]:"popup"===t?i=o[e]:(i=s[e]).alias&&(e=i.alias,i=s[i.alias]),i.status>1)n();else if(!i.status){var f=function(s){var a=document.body.querySelector("#"+t+">.content");a.insertAdjacentHTML("beforeEnd",'<div class="'+e+'">'+s+"</div>");var o=a.lastChild;if("panel"!==t&&o.addEventListener(c,S),i.js){g.showLoading(),o.style.opacity=0,o.style.transition="opacity 400ms ease-in-out",o.addEventListener("transitionend",function t(e){e.target===this&&(this.removeEventListener(e.type,t),this.style.transition="")}),g.listeners.add(g.dialogEvents,"loaded",function t(e){g.listeners.remove(this,e.type,t);o.style.opacity=""});var l=r+e;require([l],function(t){t&&(self.Reflect?Reflect.setPrototypeOf(i,t):i.__proto__=t),i.status++,n(!0),g.hideLoading()},BUILD&&function(n){E(i,t,e),n.requireType&&"scripterror"!==n.requireType&&"nodefine"!==n.requireType||n.xhr&&404!==n.xhr.status?h(l,n.message):u(),g.hideLoading()})}else i.status++,n(!0)},h=function(e,n){g.alert(l.error.replace("${res}",e)+n,"page"===t?function(){history.back()}:void 0)},u=function(){"page"===t?location.reload():g.confirm(l.update,function(t){t&&location.reload()})};i.status=1,r=t+"/"+e+"/";var d=require.toUrl(r);if(i.css&&(i.css=g.appendCss(d+e)),i.html){g.showLoading();var y=d+e+".html",m=new XMLHttpRequest;m.open("get",y,!0),m.onreadystatechange=function(){4===this.readyState&&(200===this.status?f(this.responseText):(E(i,t,e),BUILD&&404===this.status?u():h(y,this.status)),g.hideLoading())},m.send("")}else f("")}}function b(t,e,n,i){t.style.visibility="inherit",n?(e.style[f]="viewTransR1",t.style[f]="viewTransR2"):(e.style[f]="viewTransL1",t.style[f]="viewTransL2"),t.addEventListener(c,function t(e){e.target===this&&(this.removeEventListener(e.type,t),i())})}function S(t){t.target===this&&("1"===this.style[f].substr(this.style[f].length-1)?this.style.left=this.style.visibility="":this.style.left=0,this.style[f]="")}function C(t){t.preventDefault()}function q(t){t.stopPropagation()}});
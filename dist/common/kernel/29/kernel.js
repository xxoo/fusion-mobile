"use strict";define(["common/touchslider/touchslider","common/touchguesture/touchguesture","common/pointerevents/pointerevents","common/svgicos/svgicos","site/pages/pages","site/panels/panels","site/popups/popups","./lang"],function(e,t,n,o,i,s,a,r){var l,c,d,u,f,h=document.body.querySelector("#activities"),p={appendCss:function(e){var t=document.createElement("link");return/\.less$/.test(e)?self.less?(t.rel="stylesheet/less",t.href=e,less.sheets.push(t),less.refresh()):(t.rel="stylesheet",t.href=e.replace(/less$/,"css")):(t.rel="stylesheet",t.href=e),document.head.appendChild(t)},removeCss:function(e){return e.remove(),"stylesheet/less"===e.rel&&(less.sheets.splice(less.sheets.indexOf(e),1),less.refresh()),e.getAttribute("href")},makeSvg:function(e,t){var n="http://www.w3.org/2000/svg",o=document.createElementNS(n,"svg");return o.appendChild(document.createElementNS(n,"path")),e&&p.setSvgPath(o,e,t),o},setSvgPath:function(e,t,n){var i=p.makeSvg();o.hasOwnProperty(t)&&(t=o[t]),e.firstChild.setAttribute("d",t),i.style.position="absolute",i.style.bottom=i.style.right="100%",i.firstChild.setAttribute("d",t),document.body.appendChild(i);var s=i.firstChild.getBBox();i.remove(),2==n?(s.width+=2*s.x,s.x=0,s.height+=2*s.y,s.y=0):n&&(s.width>s.height?(s.y-=(s.width-s.height)/2,s.height=s.width):(s.x-=(s.height-s.width)/2,s.width=s.height)),e.setAttribute("viewBox",s.x+" "+s.y+" "+s.width+" "+s.height)},parseHash:function(e){var t={id:l,args:{}},n=(e=e.substr(1).replace(/[#?].*$/,"")).match(/[^=&]+(=[^&]*)?/g);if(n&&"!"===n[0].charAt(0)){var o=decodeURIComponent(n[0].substr(1));i.hasOwnProperty(o)&&(t.id=o);for(var s=1;s<n.length;s++)(o=n[s].match(/^([^=]+)(=)?(.+)?$/))&&(t.args[decodeURIComponent(o[1])]=o[2]?decodeURIComponent(o[3]||""):void 0)}return t},getDefaultBack:function(e){e||(e=p.location);var t,n=i[e.id].backLoc;if(i[e.id].back&&i[i[e.id].back]){t={id:i[e.id].back,args:{}};var o=i[i[e.id].back].alias?i[i[i[e.id].back].alias]:i[i[e.id].back];if(o.args)for(var s=0;s<o.args.length;s++)e.args.hasOwnProperty(o.args[s])&&(t.args[o.args[s]]=e.args[o.args[s]])}if(n&&t){for(var a in t.args)if(t.args[a]!==n.args[a])return t;return n}return n||t},isGoingback:function(e,t){var n=e;if(n!==t){if(t===l||n.length>t.length+1&&n.substr(0,t.length+1)===t+"-")return!0;for(;i[n].back;)if((n=i[n].back)===t)return!0;n=e.split("-");for(var o,s=t.split("-"),a=Math.min(n.length,s.length);o<a&&n[o]===s[o];)o++;if(o<Math.max(n.length,s.length)-1)return o<n.length-1&&n.splice(o+1),o<s.length-1&&s.splice(o+1),p.isGoingback(n.join("-"),s.join("-"))}},replaceLocation:function(e){p.location&&p.isSameLocation(e,p.location)?p.reloadPage():location.replace(p.buildHash(e))}};return self.frameElement&&frameElement.kernel?self.Reflect?Reflect.setPrototypeOf(p,frameElement.kernel):p.__proto__=frameElement.kernel:(p.buildHash=function(e){var t="#!"+encodeURIComponent(e.id);for(var n in e.args)t+=void 0===e.args[n]?"&"+encodeURIComponent(n):"&"+encodeURIComponent(n)+"="+encodeURIComponent(e.args[n]);return t},p.isSameLocation=function(e,t){if(e.id===t.id&&Object.keys(e.args).length===Object.keys(t.args).length){for(var n in e.args){if(!t.args.hasOwnProperty(n))return!1;if(void 0===e.args[n]){if(e.args[n]!==t.args[n])return!1}else if(""+e.args[n]!=""+t.args[n])return!1}return!0}return!1},p.getLang=function(e){for(var t=0;t<navigator.languages.length;t++)if(e.hasOwnProperty(navigator.languages[t]))return e[navigator.languages[t]];return e.en},function(){var e,t,n=document.head.querySelector("meta[name=viewport]"),o=n.content;function i(t,n){var o=Math.min(t,n)/e;return o>1&&(o=Math.sqrt(o)),Math.round(t/o)}p.setAutoScale=function(t){(e=t)>0?self.dispatchEvent(new Event("resize")):n.content=o},self.visualViewport?self.addEventListener("resize",function(){e>0&&(n.content="user-scalable=no, width="+i(Math.round(visualViewport.width*visualViewport.scale),Math.round(visualViewport.height*visualViewport.scale)))}):"IOS"===browser.name?self.addEventListener("resize","Safari"===browser.app&&browser.version>10?function(){if(n.content===o)n.content="user-scalable=no, width="+i(innerWidth,innerHeight);else{var e=innerWidth,t=innerHeight;n.content=o,function o(){innerWidth===e&&innerHeight===t?requestAnimationFrame(o):n.content="user-scalable=no, width="+i(innerWidth,innerHeight)}()}}:function(){if(t)t=!1;else if(n.content===o){var e=i(innerWidth,innerHeight);e!==innerWidth&&(t=!0,n.content="user-scalable=no, width="+e)}else n.content=o}):self.addEventListener("resize",function(){if(t)t=!1;else{n.content!==o&&(n.content=o,t=!0);var e=i(innerWidth,innerHeight);e!==innerWidth&&(t=!0,n.content="user-scalable=no, width="+e)}})}(),function(){var e=Symbol("xEvents");function t(t){this[e][t.type].locked=!0;for(var o=0;o<this[e][t.type].heap.length;o++)this[e][t.type].heap[o].call(this,t);for(this[e][t.type].locked=!1;this[e][t.type].stack.length;){if(this[e][t.type].stack[0])if("function"==typeof this[e][t.type].stack[0]){var i=this[e][t.type].heap.indexOf(this[e][t.type].stack[0]);i>=0&&this[e][t.type].heap.splice(i,1)}else this[e][t.type].heap.indexOf(this[e][t.type].stack[0][0])<0&&this[e][t.type].heap.push(this[e][t.type].stack[0][0]);else this[e][t.type].heap.splice(0);this[e][t.type].stack.shift()}n(this,t.type)}function n(t,n,o){!o&&t[e][n].heap.length||(delete t[e][n],t["on"+n]=null)}p.listeners={add:function(n,o,i){var s=0;return"function"==typeof i&&(n.hasOwnProperty(e)||(n[e]={}),n[e].hasOwnProperty(o)||(n[e][o]={stack:[],heap:[],locked:!1},n["on"+o]=t),n[e][o].locked?(n[e][o].stack.push([i]),s=2):n[e][o].heap.indexOf(i)<0&&(n[e][o].heap.push(i),s=1)),s},list:function(t,n){var o;if(n)o=t.hasOwnProperty(e)&&t[e].hasOwnProperty(n)?t[e][n].heap.slice(0):[];else if(o={},t.hasOwnProperty(e))for(var i in t[e])o[i]=t[e][i].heap.slice(0);return o},remove:function(t,o,i){var s=0;if(t.hasOwnProperty(e))if(o){if(t[e].hasOwnProperty(o))if(t[e][o].locked)t[e][o].stack.push(i),s=2;else if("function"==typeof i){var a=t[e][o].heap.indexOf(i);a>=0&&(t[e][o].heap.splice(a,1),n(t,o),s=1)}else n(t,o,!0),s=1}else{for(var r in t[e])t[e][r].locked?(t[e][r].stack.push(void 0),s=2):n(t,r,!0);s||(s=1)}return s}}}(),function(){function e(e){0===this.scrollTop?this.scrollTop=1:this.scrollTop+this.clientHeight===this.scrollHeight&&(this.scrollTop-=1)}p.scrollReload=function(e,t){var o,i,s,a,r=this,l=n(e,function(n){var d;if("start"===n.type){if(0===l.pointers.length&&0===r.getScrollTop(e))return o=n.y,n.domEvent.view.addEventListener("scroll",c,!0),!0}else{if(a)return a=!1,!0;if(n.y>o+5)i||(i=!0,n.domEvent.view.removeEventListener("scroll",c,!0)),n.domEvent.preventDefault(),s||((s=n.domEvent.view.document.createElement("div")).className="reloadHint",s.appendChild(r.makeSvg("sync-alt-solid",1)),e.appendChild(s)),d=s.offsetHeight||s.clientHeight,n.y-o<2*d?(s.style.top=n.y-o-d+"px",s.classList.remove("pin"),s.style.opacity=(n.y-o)/d/2,s.style.transform="rotate("+360*s.style.opacity+"deg)"):(s.style.top=d+"px",s.style.opacity=1,s.classList.add("pin"),s.style.transform="");else{if(n.y<o&&!i)return!0;s&&(s.remove(),s=void 0)}"end"!==n.type&&"cancel"!==n.type||(s&&(s.remove(),s.classList.contains("pin")&&("function"==typeof t?t():r.reloadPage()),s=void 0),i=!1)}});function c(t){t.target!==e&&(a=!0,this.removeEventListener("scroll",c,!0))}r.fixIosScrolling(e)},p.fixIosScrolling=function(t,n){"IOS"===browser.name&&(t.style.webkitOverflowScrolling="touch",t.addEventListener("touchmove",L,{passive:!1}),n||(t.classList.add("iosScrollFix"),t.scrollTop=1,t.addEventListener("scroll",e)))},p.getScrollTop=function(e){return e.classList.contains("iosScrollFix")?e.scrollTop-1:e.scrollTop},p.getScrollHeight=function(e){return e.classList.contains("iosScrollFix")?e.scrollHeight-2:e.scrollHeight},p.setScrollTop=function(e,t){e.scrollTop=e.classList.contains("iosScrollFix")?t+1:t}}(),function(){var e,t=document.body.querySelector("#helper"),n=t.firstChild,o=t.lastChild;function i(e){o.src=e.img,"right"in e&&(o.style.right=e.right),"left"in e&&(o.style.left=e.left),"top"in e&&(o.style.top=e.top),"bottom"in e&&(o.style.bottom=e.bottom),"width"in e&&(o.style.width=e.width),"height"in e&&(o.style.height=e.height);for(var t=0;t<n.childNodes.length;t++){var i=n.childNodes[t];e.rows[t]?(i.style.height=e.rows[t],i.className="unflexable"):(i.style.height="auto",i.className="flexable")}for(var s=0;s<n.childNodes[1].childNodes.length;s++){var a=n.childNodes[1].childNodes[s];e.cells[s]?(a.style.width=e.cells[s],a.className="unflexable"):(a.style.width="auto",a.className="flexable")}}t.addEventListener("click",function n(){e.length>1?(e.shift(),"function"==typeof e[0]?(e[0](),n()):i(e[0])):t.style.display=""}),p.showHelper=function(n){i((e="Array"===dataType(n)?n:[n])[0]),t.style.display="block"}}(),function(){var e,t,o,i,a,r,l,c,d,u,f,h=document.querySelector("#panel"),m=h.querySelector(":scope>div:first-child"),g=n(h,function(n){if("start"===n.type){if(!g.pointers.length&&!e)return i=h.querySelector(":scope>."+t),r=l=a=n.x,c=d=n.domEvent.timeStamp,n.domEvent.view.addEventListener("scroll",L,!0),!0}else{if(f)return f=!1,!0;if("move"===n.type)r=l,c=d,l=n.x,d=n.domEvent.timeStamp,!u&&Math.abs(l-a)>5&&(u=!0,n.domEvent.view.removeEventListener("scroll",L,!0)),u&&(n.domEvent.preventDefault(),i.style.transform="translateX("+Math.max(Math.min(l-a,0),-i.offsetWidth)+"px)");else{if(u){var o=(n.x-r)/(n.domEvent.timeStamp-c),s=4e3*Math.pow(o,2);o<0&&(s=-s),(!(s=s+l-a<-i.offsetWidth/2)||p.closePanel())&&s||"translateX(0px)"===i.style.transform||(i.style.transition="",i.style.transform="translateX(0px)",i.addEventListener("transitionend",b))}else n.domEvent.view.addEventListener("scroll",L,!0);f=u=!1}}});function w(n){if("function"!=typeof s[t].onunload||!s[t].onunload())return s[t].status--,(e=h.querySelector(":scope>."+t)).style.transition=e.style.transform="",n&&(m.style.opacity=""),!0}function b(e){e.target===this&&(this.style.transition="none",this.removeEventListener(e.type,b))}function L(){f=!0,this.removeEventListener("scroll",L,!0)}p.openPanel=function(e,t){if(s.hasOwnProperty(e))return v("panel",e,function(n){n&&h.querySelector(":scope>."+e).offsetLeft,"function"==typeof s[e].open?s[e].open(t):p.showPanel(e)}),!0},p.showPanel=function(n){var i=0;return s[n].status>1&&(e?(o=p.showPopup.bind(this,n),i=2):t?t===n?("function"!=typeof s[n].onload&&s[n].onload(),"function"==typeof s[n].onloadend&&s[n].onloadend(),i=1):w()&&(o=p.showPanel.bind(this,n),i=1):(s[n].status++,"fucntion"==typeof s[n].onload&&s[n].onload(),h.style.visibility="inherit",m.style.opacity=1,(e=h.querySelector(":scope>."+n)).style.transform="translateX(0px)",h.className=t=n)),i},p.closePanel=function(n){var i=0;return e?(o=p.closePanel.bind(this,n),i=2):t&&(!n||t===n||"Array"===dataType(n)&&n.indexOf(t)>=0)&&w(!0)&&(i=1),i},p.getCurrentPanel=function(){return t},p.destroyPanel=function(e){if(2===s[e].status)return y(s[e],"panel",e),!0},h.addEventListener("transitionend",function(n){if(n.target===e){if(e.style.transform?("function"==typeof s[t].onloadend&&s[t].onloadend(),s[t].status++,e.style.transition="none"):("function"==typeof s[t].onunloadend&&s[t].onunloadend(),s[t].status--,s[t].autoDestroy?y(s[t],"panel",t):document.activeElement&&e.contains(document.activeElement)&&document.activeElement.blur(),t=void 0),e=void 0,o){var i=o;o=void 0,i()}}else n.target!==m||m.style.opacity||(this.style.visibility="")}),m.addEventListener("click",p.closePanel.bind(p,void 0))}(),function(){var e,t,n,o,i,s=document.body.querySelector("#popup"),l=s.querySelector(":scope>.header>.close"),c=s.querySelector(":scope>.header>.title").firstChild,d=s.querySelector(":scope>.header>.back");function u(o){e&&s.classList.remove(e),t=n=void 0,e=o,s.classList.add(e),c.data=a[o].title,h.classList.contains("hidePopupHeader")&&(document.title=c.data),d.style.display="none"}p.openPopup=function(t,n,o){if(a.hasOwnProperty(t))return v("popup",t,function(){"function"==typeof a[t].open?a[t].open(n,e&&o):p.showPopup(t,o)}),!0},p.showPopup=function(t,n){var r=0;if(a[t].status>1)if(o)i=p.showPopup.bind(this,t,n),r=2;else if(e){if(e===t)"function"!=typeof a[t].onload&&a[t].onload(),"function"==typeof a[t].onloadend&&a[t].onloadend(),r=1;else if("function"!=typeof a[e].onunload||!a[e].onunload()){var l=s.querySelector(":scope>.content>."+e);a[e].status--,a[t].status++,"function"==typeof a[t].onload&&a[t].onload(n),m(s.querySelector(":scope>.content>."+t),l,n,function(){var s=e;if(o=!1,u(t),"function"==typeof a[s].onunloadend&&a[s].onunloadend(),a[s].status--,a[s].autoDestroy?y(a[s],"popup",s):document.activeElement&&l.contains(document.activeElement)&&document.activeElement.blur(),"function"==typeof a[e].onloadend&&a[e].onloadend(n),a[t].status++,"function"==typeof i){var r=i;i=void 0,r()}}),o=t,r=1}}else{a[t].status++,"fucntion"==typeof a[t].onload&&a[t].onload();var c=s.querySelector(":scope>.content>."+t);c.style.left=0,c.style.visibility="inherit",s.classList.add("in"),o=t,"function"==typeof p.popupEvents.onshow&&p.popupEvents.onshow({type:"show",id:t}),u(t),p.hideReadable(),r=1}return r},p.closePopup=function(t){var n=0;return o?(i=p.closePopup.bind(this,t),n=2):!e||t&&e!==t&&!("Array"===dataType(t)&&t.indexOf(e)>=0)||"function"==typeof a[e].onunload&&a[e].onunload()||(a[e].status--,s.classList.remove("in"),s.classList.add("out"),o=!0,"function"==typeof p.popupEvents.onhide&&p.popupEvents.onhide({type:"hide",id:e}),n=1),n},p.getCurrentPopup=function(){return e},p.setPopupBack=function(e,o){s.classList.contains("in")&&(e?(d.lastChild.data="function"!=typeof e&&a[e].title?a[e].title:r.back,t=e,d.style.display="",n=o):d.style.display="none")},p.setPopupTitle=function(t,n){n?a.hasOwnProperty(n)&&(a[n].title=t,e===n&&(c.data=t,h.classList.contains("hidePopupHeader")&&(document.title=c.data))):s.classList.contains("in")&&(c.data=t,h.classList.contains("hidePopupHeader")&&(document.title=c.data))},p.destroyPopup=function(e){if(2===a[e].status)return y(a[e],"popup",e),!0},p.popupEvents={},l.appendChild(p.makeSvg("times-light",1)),l.addEventListener("click",function(){p.closePopup()}),d.insertBefore(p.makeSvg("angle-left-light",1),d.firstChild),d.addEventListener("click",function(e){"function"==typeof t?t(n):p.openPopup(t,n,!0)}),s.addEventListener("animationend",function(t){if(t.target===this){if(o=!1,this.classList.contains("out")){this.classList.remove("out"),"function"==typeof p.popupEvents.onhideend&&p.popupEvents.onhideend({type:"hideend",id:e});var n=s.querySelector(":scope>.content>."+e);n.style.left=n.style.visibility="","function"==typeof a[e].onunloadend&&a[e].onunloadend(),a[e].status--,a[e].autoDestroy?y(a[e],"popup",e):document.activeElement&&n.contains(document.activeElement)&&document.activeElement.blur(),s.classList.remove(e),e=void 0}else"function"==typeof a[e].onloadend&&a[e].onloadend(),a[e].status++,"function"==typeof p.popupEvents.onshowend&&p.popupEvents.onshowend({type:"showend",id:e});if("function"==typeof i){var r=i;i=void 0,r()}}})}(),d=document.body.querySelector("#readable"),u=d.querySelector(":scope>.close"),f=d.querySelector(":scope>.content"),p.fixIosScrolling(f),p.showReadable=function(e,t,n){"string"==typeof e?f.innerHTML=e:f.appendChild(e),d.className=n?"in "+n:"in",c=t},p.hideReadable=function(){d.classList.contains("in")&&(d.classList.remove("in"),d.classList.add("out"),"function"==typeof c&&c())},p.showForeign=function(e,t){p.showReadable('<iframe frameborder="no" scrolling="auto" sandbox="allow-same-origin allow-forms allow-scripts" src="'+e+'"></iframe>',t,"foreign")},u.appendChild(p.makeSvg("times-solid",1)),u.addEventListener("click",p.hideReadable),d.addEventListener("animationend",function(e){if(e.target===this&&this.classList.contains("out")){for(;f.childNodes.length>0;)f.firstChild.remove();this.className=""}}),function(){var n,o,i=0,s=[],a={},l=document.body.querySelector("#loading"),c=document.body.querySelector("#hint"),d=document.body.querySelector("#dialog"),u=d.querySelector(":scope>div"),f=u.querySelector(":scope>.content"),y=u.querySelector(":scope>.close"),v=u.querySelector(":scope>.btns>.yes"),m=u.querySelector(":scope>.btns>.no"),g=document.body.querySelector("#sliderView"),w=g.querySelector(":scope>.close"),b=e(g.querySelector(":scope>.content")),L=document.body.querySelector("#photoView"),E=L.querySelector(":scope>.close"),S=L.querySelector(":scope>img"),k=L.querySelector(":scope>.actions"),C=t(L);function x(){p.closeDialog()}function P(e,t,n){"inherit"===d.style.visibility?s.push([e,t,n]):(u.className=e,"alert"===e?f.textContent=t:"confirm"===e?"Array"===dataType(t)?(f.textContent=t[0],v.firstChild.data=t[1],m.firstChild.data=t[2]):(f.textContent=t,v.firstChild.data=r.yes,m.firstChild.data=r.no):"string"==typeof t?f.innerHTML=t:f.appendChild(t),self.addEventListener("resize",q),q(),d.style.visibility="inherit",o=n)}function q(){u.style.width=u.style.height="",u.style.left=u.style.top="20px",u.style.bottom=u.style.right="auto",u.style.width=u.offsetWidth+"px",u.style.height=u.offsetHeight+"px",u.style.left=u.style.top=u.style.bottom=u.style.right=""}function O(){S.style.width=a.w+"px",S.style.height=a.h+"px",S.style.left=a.l+"px",S.style.top=a.t+"px"}function M(){a.ww=innerWidth,a.wh=innerHeight,a.wr=a.ww/a.wh,a.ow=S.naturalWidth,a.oh=S.naturalHeight,a.r=a.ow/a.oh,a.ow>a.ww||a.oh>a.wh?a.r>a.wr?(a.z=a.mz=a.ww/a.ow,a.l=0,a.w=a.ww,a.h=a.w/a.r,a.t=(a.wh-a.h)/2):(a.z=a.mz=a.wh/a.oh,a.t=0,a.h=a.wh,a.w=a.h*a.r,a.l=(a.ww-a.w)/2):(a.z=a.mz=1,a.w=a.ow,a.h=a.oh,a.l=(a.ww-a.w)/2,a.t=(a.wh-a.h)/2),O()}C.onzoomstart=function e(t){var n=t.x,o=t.y,i=a.z;this.onzoomstart=null;this.onzoomchange=s;this.onzoomend=function(t){s.call(this,t),this.onzoomchange=this.zoomend=null,this.onzoomstart=e};function s(e){var t=Math.max(Math.min(e.zoom*i,1),a.mz);t!==a.z&&(a.w=a.ow*t,a.h=a.oh*t,a.l=a.w>a.ww?Math.min(Math.max(n+(a.l-n)*t/a.z,a.ww-a.w),0):(a.ww-a.w)/2,a.t=a.h>a.wh?Math.min(Math.max(o+(a.t-o)*t/a.z,a.wh-a.h),0):(a.wh-a.h)/2,a.z=t,O())}},C.ondragstart=function e(t){var n=t.x,o=t.y,i=a.l,s=a.t;C.ondragmove=r;C.ondragend=function(t){r.call(this,t),this.ondragmove=this.ondragend=null,this.ondragstart=e};function r(e){a.w>a.ww&&(a.l=Math.min(Math.max(i+e.x-n,a.ww-a.w),0)),a.h>a.wh&&(a.t=Math.min(Math.max(s+e.y-o,a.wh-a.h),0)),O()}},p.showPhotoView=function(e,t,n){for(S.src=e;k.childNodes.length;)k.firstChild.remove();if("function"==typeof n&&t&&t.length){for(var o=0;o<t.length;o++){var i=document.createElement("a");i.href="javascript:;",i.appendChild(document.createTextNode(t[o])),i.addEventListener("click",n.bind(p,o)),k.appendChild(i)}k.style.display=""}else k.style.display="none"},p.hidePhotoView=function(){S.src="about:blank"},S.addEventListener("load",function(){L.style.visibility="inherit",self.addEventListener("resize",M),M()}),S.addEventListener("error",function(){L.style.visibility="",self.removeEventListener("resize",M)}),p.showSliderView=function(e,t,n){g.className=n||"";for(var o=0;o<e.length;o++)b.add(e[o]);t&&b.slideTo(t,!0)},p.hideSliderView=function(){b.clear()},p.alert=function(e,t){P("alert",e,t)},p.confirm=function(e,t){P("confirm",e,t)},p.htmlDialog=function(e,t,n){P(t||"",e,n)},p.closeDialog=function(e){for(self.removeEventListener("resize",q,!1),d.style.visibility="","function"==typeof o&&o(e);f.childNodes.length;)f.lastChild.remove();if(o=void 0,s.length){var t=s.shift();p[t.shift()].apply(p,t)}},p.showLoading=function(e){l.querySelector(":scope>div").lastChild.data=e||r.loading,0===i&&(l.style.visibility="inherit",h.classList.add("mask")),i++},p.hideLoading=function(){i>0&&0===--i&&(l.style.visibility="",h.classList.remove("mask"),"function"==typeof p.dialogEvents.onloaded&&p.dialogEvents.onloaded({type:"loaded"}))},p.isLoading=function(){return i>0},p.hint=function(e,t){c.querySelector(":scope>.text").firstChild.data=e,n?clearTimeout(n):c.style.opacity=1,n=setTimeout(function(){c.style.opacity="",n=void 0},t||5e3)},p.dialogEvents={},b.onchange=function(){var e="";if(this.children.length){if(this.children.length>1)for(var t=0;t<this.children.length;t++)e+=t===this.current?"●":"○";g.style.visibility="inherit"}else g.style.visibility="";g.querySelector(":scope>.nav").firstChild.data=e},y.appendChild(p.makeSvg("times-circle-solid",1)),y.addEventListener("click",x),m.addEventListener("click",x),v.addEventListener("click",p.closeDialog),w.appendChild(p.makeSvg("times-solid",1)),E.appendChild(w.firstChild.cloneNode(!0)),w.addEventListener("click",p.hideSliderView),E.addEventListener("click",p.hidePhotoView)}()),function(){var e,t,n,o,s,a,c=location.pathname,d=document.body.querySelector("#page"),u=d.querySelector(":scope>.navMenu"),f=d.querySelector(":scope>.header>.title").firstChild,g=d.querySelector(":scope>.header>.back"),w=d.querySelector(":scope>.header>.leftMenuBtn"),b=d.querySelector(":scope>.header>.rightMenuBtn");try{sessionStorage.setItem(0,0),sessionStorage.removeItem(0)}catch(e){Storage.prototype.setItem=function(){}}function L(e){e&&(p.listeners.remove(this,e.type,L),setTimeout(function(){document.body.querySelector("#popup").style.animationDuration=""},400)),document.body.addEventListener("transitionend",E),document.documentElement.classList.remove("loading")}function E(e){e.target===this&&(this.removeEventListener(e.type,E),this.style.transition="")}function S(e){for(;u.childNodes.length;)u.firstChild.remove();for(var t in a={},s=e)i.hasOwnProperty(t)&&(a[t]=u.appendChild(document.createElement("a")),a[t].href="#!"+t,RegExp("^"+t+"(?:-|$)").test(p.location.id)?(a[t].className="selected",a[t].appendChild(p.makeSvg("string"==typeof s[t]?s[t]:s[t].selected,1))):a[t].appendChild(p.makeSvg("string"==typeof s[t]?s[t]:s[t].normal,1)),a[t].appendChild(document.createTextNode(i[t].alias?i[t].title||i[i[t].alias].title:i[t].title)))}function k(){var t=p.parseHash(location.hash);p.isSameLocation(t,p.location)||(p.lastLocation=p.location,p.location=t,!i[p.location.id].back||p.lastLocation.id!==i[p.location.id].back&&i[p.lastLocation.id].alias!==i[p.location.id].back?i[p.lastLocation.id].backLoc&&(p.location.id===i[p.lastLocation.id].back||i[p.location.id].alias&&i[p.location.id].alias===i[p.lastLocation.id].back)&&(delete i[p.lastLocation.id].backLoc,delete e[p.lastLocation.id],sessionStorage.setItem(c,toJsex(e))):(e[p.location.id]=i[p.location.id].backLoc=p.lastLocation,sessionStorage.setItem(c,toJsex(e))),C())}function C(){var e=p.location.id;if(p.hasOwnProperty("lastLocation")){var l=e.replace(/-.*$/,""),c=p.lastLocation.id.replace(/-.*$/,"");l!==c&&(a.hasOwnProperty(l)&&(a[l].className="selected","string"!=typeof s[l]&&p.setSvgPath(a[l].firstChild,s[l].selected,1)),a.hasOwnProperty(c)&&(a[c].className="","string"!=typeof s[c]&&p.setSvgPath(a[c].firstChild,s[c].normal,1))),P()}"function"==typeof p.pageEvents.onroute&&p.pageEvents.onroute({type:"route"}),v("page",e,function(s){if(n)o=!0;else{var a;if(e===t)q();else{var l=i[e].alias?i[e].alias:e,c=i[e].title||i[l].title;for(d.classList.add(e),f.data=c,(h.classList.contains("clean")||h.classList.contains("hidePageHeader"))&&(document.title=c),self.frameElement&&frameElement.kernel&&"page"===p.getCurrentPopup()&&p.setPopupTitle(c);b.childNodes.length;)b.firstChild.remove();for(b.removeAttribute("href");w.childNodes.length;)w.firstChild.remove();w.removeAttribute("href"),i[l].rightMenuContent||i[l].onrightmenuclick?("string"==typeof i[l].rightMenuContent?b.innerHTML=i[l].rightMenuContent:i[l].rightMenuContent&&b.appendChild(i[l].rightMenuContent),"function"==typeof i[l].onrightmenuclick?b.href="javascript:;":i[l].onrightmenuclick&&(b.href=i[l].onrightmenuclick),b.style.display=""):b.style.display="none",i[l].leftMenuContent||i[l].onleftmenuclick?("string"==typeof i[l].leftMenuContent?w.innerHTML=i[l].leftMenuContent:i[l].leftMenuContent&&w.appendChild(i[l].leftMenuContent),"function"==typeof i[l].onleftmenuclick?w.href="javascript:;":i[l].onleftmenuclick&&(w.href=i[l].onleftmenuclick),w.style.display=""):w.style.display="none";var u=p.getDefaultBack();if(u){var v=i[u.id].title;!v&&i[u.id].alias&&(v=i[i[u.id].alias].title),g.lastChild.data=v||r.back,g.href=p.buildHash(u),g.style.display=""}else g.style.display="none";var L=d.querySelector(":scope>.content>."+l);if(t){d.classList.remove(t);var E=i[t].alias?i[t].alias:t,S=t;if(t=e,l===E)q(a=!0);else{n=!0;var k=d.querySelector(":scope>.content>."+E),x=p.isGoingback(S,e);a=!x||s,m(L,k,x,function(){n=!1,"function"==typeof i[E].onunloadend&&i[E].onunloadend(),i[E].status--,i[E].autoDestroy?y(i[E],"page",E):document.activeElement&&k.contains(document.activeElement)&&document.activeElement.blur(),"function"==typeof i[l].onloadend&&i[l].onloadend(a),i[l].status++,o&&(o=!1,L.style.visibility="inherit",C())}),"function"==typeof i[E].onunload&&i[E].onunload(),i[E].status--,i[l].status++,"function"==typeof i[l].onload&&i[l].onload(a)}}else a=!0,t=e,L.style.left=0,L.style.visibility="inherit",q(a)}"function"==typeof p.pageEvents.onrouteend&&p.pageEvents.onrouteend({type:"routeend",force:a})}})}function x(e,n){var o=i[t].alias?i[i[t].alias]:i[t];(!e||e===t||"Array"===dataType(e)&&e.indexOf(t)>=0)&&(n||P(),"function"==typeof o.onload&&o.onload(!0),"function"==typeof o.onloadend&&o.onloadend(!0))}function P(){self.frameElement&&frameElement.kernel||(p.hideReadable(),p.closePopup())}function q(e){var n=i[t].alias?i[i[t].alias]:i[t];n.status<3&&n.status++,"function"==typeof n.onload&&n.onload(e),"function"==typeof n.onloadend&&n.onloadend(e),n.status<4&&n.status++}p.init=function(t,n){if(i.hasOwnProperty(t))if(l){if(n&&S(n),l!==t){var o=l;if(l=t,p.location.id===o)return k(),!0}}else{for(var s in l=t,p.location=p.parseHash(location.hash),p.location.args.ui&&p.location.args.ui.split(",").forEach(function(e){h.classList.add(e)}),(e=sessionStorage.getItem(c))&&(e=e.parseJsex())&&(e=e.value),e||(e={}),e)i.hasOwnProperty(s)&&(i[s].backLoc=e[s]);var a;if(self.addEventListener("hashchange",k),S(n),C(),p.location.args.hasOwnProperty("autopopup"))p.location.args.hasOwnProperty("autopopuparg")&&(a=p.location.args.autopopuparg.parseJsex())&&(a=a.value),p.openPopup(p.location.args.autopopup,a)?(document.body.querySelector("#popup").style.animationDuration="1ms",p.listeners.add(p.popupEvents,"showend",L)):L();else L()}},p.reloadPage=function(e,t){var n;p.isLoading()?(n=p.location,p.listeners.add(p.dialogEvents,"loaded",function o(i){p.listeners.remove(this,i.type,o);n===p.location&&x(e,t)})):x(e,t)},p.destroyPage=function(e){if(2===i[e].status)return y(i[e],"page",e),!0},p.pageEvents={},g.insertBefore(p.makeSvg("angle-left-light",1),g.firstChild),b.addEventListener("click",function(e){var n=i[i[t].alias?i[t].alias:t];"function"==typeof n.onrightmenuclick&&n.onrightmenuclick()}),w.addEventListener("click",function(e){var n=i[i[t].alias?i[t].alias:t];"function"==typeof n.onleftmenuclick&&n.onleftmenuclick()})}(),r=p.getLang(r),self.addEventListener("contextmenu","Firefox"===browser.name?L:b),self.addEventListener("dragstart",b),"IOS"===browser.name&&(self.addEventListener("gesturestart",b),self.addEventListener("touchmove",b,{passive:!1})),p;function y(e,t,n){var o=t+"/"+n+"/",i=document.body.querySelector("#"+t+("panel"===t?">.":">.content>.")+n);"function"==typeof e.ondestroy&&e.ondestroy(),i.remove(),e.css&&"string"!=typeof e.css&&(e.css=p.removeCss(e.css).substr(require.toUrl(o).length)),e.js&&(o+=e.js,require.defined(o)&&(i=require(o),require.undef(o),i&&(self.Reflect?Reflect.setPrototypeOf(e,Object.prototype):e.__proto__=Object.prototype))),delete e.status}function v(e,t,n){var o,l,c;if("panel"===e?o=s[t]:"popup"===e?o=a[t]:(o=i[t]).alias&&(t=o.alias,o=i[o.alias]),o.status>1)n();else if(!o.status){var d=function(i){if("panel"===e?l.insertAdjacentHTML("beforeEnd",'<div class="'+t+'">'+i+"</div>"):(l.querySelector(":scope>.content").insertAdjacentHTML("beforeEnd",'<div class="'+t+'">'+i+"</div>"),g(l.querySelector(":scope>.content>."+t))),"js"in o){p.showLoading();var s=c+o.js;require([s],function(e){e&&(self.Reflect?Reflect.setPrototypeOf(o,e):o.__proto__=e),o.status++,n(!0),p.hideLoading()},"dev"===VERSION?void 0:function(n){y(o,e,t),n.requireType&&"scripterror"!==n.requireType&&"nodefine"!==n.requireType||n.xhr&&404!==n.xhr.status?u(s,n.message):f(),p.hideLoading()})}else o.status++,n(!0)},u=function(t,n){p.alert(r.error.replace("${res}",t)+n,"page"===e?function(){history.back()}:void 0)},f=function(){"page"===e?location.reload():p.confirm(r.update,function(e){e&&location.reload()})};o.status=1,l=document.body.querySelector("#"+e),c=e+"/"+t+"/";var h=require.toUrl(c);if("string"==typeof o.css&&(o.css=p.appendCss(h+o.css)),"html"in o){p.showLoading();var v=h+o.html,m=new XMLHttpRequest;m.open("get",v,!0),m.onreadystatechange=function(){4===this.readyState&&(200===this.status?d(this.responseText):(y(o,e,t),"dev"===VERSION||404!==this.status?u(v,this.status):f()),p.hideLoading())},m.send("")}else d("")}}function m(e,t,n,o){e.style.visibility="inherit",n?(t.style.animationName="viewTransR1",e.style.animationName="viewTransR2"):(t.style.animationName="viewTransL1",e.style.animationName="viewTransL2"),"function"==typeof o&&g(e,function e(t){this.removeEventListener(t.type,e,!1);o()})}function g(e,t){"function"!=typeof t&&(t=w),e.addEventListener("animationend",t)}function w(e){e.target===this&&("1"===this.style.animationName.substr(this.style.animationName.length-1)?this.style.left=this.style.visibility="":this.style.left=0,this.style.animationName="")}function b(e){e.preventDefault()}function L(e){e.stopPropagation()}});
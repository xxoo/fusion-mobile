"use strict";define(["common/touchslider/touchslider","common/touchguesture/touchguesture","common/pointerevents/pointerevents","common/svgicos/svgicos","site/pages/pages","site/popups/popups","./lang"],function(e,t,n,o,i,s,a){var l,r,c,d,u,f=document.body.querySelector("#activities"),h={appendCss:function(e){var t=document.createElement("link");return/\.less$/.test(e)?self.less?(t.rel="stylesheet/less",t.href=e,less.sheets.push(t),less.refresh()):(t.rel="stylesheet",t.href=e.replace(/less$/,"css")):(t.rel="stylesheet",t.href=e),document.head.appendChild(t)},removeCss:function(e){return e.remove(),"stylesheet/less"===e.rel&&(less.sheets.splice(less.sheets.indexOf(e),1),less.refresh()),e.getAttribute("href")},makeSvg:function(e,t){var n="http://www.w3.org/2000/svg",o=document.createElementNS(n,"svg");return o.appendChild(document.createElementNS(n,"path")),e&&h.setSvgPath(o,e,t),o},setSvgPath:function(e,t,n){var i=h.makeSvg();o.hasOwnProperty(t)&&(t=o[t]),e.firstChild.setAttribute("d",t),i.style.position="absolute",i.style.bottom=i.style.right="100%",i.firstChild.setAttribute("d",t),document.body.appendChild(i);var s=i.firstChild.getBBox();i.remove(),2==n?(s.width+=2*s.x,s.x=0,s.height+=2*s.y,s.y=0):n&&(s.width>s.height?(s.y-=(s.width-s.height)/2,s.height=s.width):(s.x-=(s.height-s.width)/2,s.width=s.height)),e.setAttribute("viewBox",s.x+" "+s.y+" "+s.width+" "+s.height)},parseHash:function(e){var t={id:l,args:{}},n=(e=e.substr(1).replace(/[#?].*$/,"")).match(/[^=&]+(=[^&]*)?/g);if(n&&"!"===n[0].charAt(0)){var o=decodeURIComponent(n[0].substr(1));i.hasOwnProperty(o)&&(t.id=o);for(var s=1;s<n.length;s++)(o=n[s].match(/^([^=]+)(=)?(.+)?$/))&&(t.args[decodeURIComponent(o[1])]=o[2]?decodeURIComponent(o[3]||""):void 0)}return t},getDefaultBack:function(e){e||(e=h.location);var t,n=i[e.id].backLoc;if(i[e.id].back&&i[i[e.id].back]){t={id:i[e.id].back,args:{}};var o=i[i[e.id].back].alias?i[i[i[e.id].back].alias]:i[i[e.id].back];if(o.args)for(var s=0;s<o.args.length;s++)e.args.hasOwnProperty(o.args[s])&&(t.args[o.args[s]]=e.args[o.args[s]])}if(n&&t){for(var a in t.args)if(t.args[a]!==n.args[a])return t;return n}return n||t},isGoingback:function(e,t){var n=e;if(n!==t){if(t===l||n.length>t.length+1&&n.substr(0,t.length+1)===t+"-")return!0;for(;i[n].back;)if((n=i[n].back)===t)return!0;n=e.split("-");for(var o,s=t.split("-"),a=Math.min(n.length,s.length);o<a&&n[o]===s[o];)o++;if(o<Math.max(n.length,s.length)-1)return o<n.length-1&&n.splice(o+1),o<s.length-1&&s.splice(o+1),h.isGoingback(n.join("-"),s.join("-"))}},replaceLocation:function(e){h.location&&h.isSameLocation(e,h.location)?h.reloadPage():location.replace(h.buildHash(e))}};return function(){var e,t,n,o,s,r,c=location.pathname,d=document.body.querySelector("#page"),u=d.querySelector(":scope>.navMenu"),v=d.querySelector(":scope>.header>.title").firstChild,m=d.querySelector(":scope>.header>.back"),w=d.querySelector(":scope>.header>.leftMenuBtn"),E=d.querySelector(":scope>.header>.rightMenuBtn");try{sessionStorage.setItem(0,0),sessionStorage.removeItem(0)}catch(e){Storage.prototype.setItem=function(){}}function S(e){for(;u.childNodes.length;)u.firstChild.remove();for(var t in r={},s=e)i.hasOwnProperty(t)&&(r[t]=u.appendChild(document.createElement("a")),r[t].href="#!"+t,RegExp("^"+t+"(?:-|$)").test(h.location.id)?(r[t].className="selected",r[t].appendChild(h.makeSvg("string"==typeof s[t]?s[t]:s[t].selected,1))):r[t].appendChild(h.makeSvg("string"==typeof s[t]?s[t]:s[t].normal,1)),r[t].appendChild(document.createTextNode(i[t].alias?i[t].title||i[i[t].alias].title:i[t].title)))}function k(){var t=h.parseHash(location.hash);h.isSameLocation(t,h.location)||(h.lastLocation=h.location,h.location=t,!i[h.location.id].back||h.lastLocation.id!==i[h.location.id].back&&i[h.lastLocation.id].alias!==i[h.location.id].back?i[h.lastLocation.id].backLoc&&(h.location.id===i[h.lastLocation.id].back||i[h.location.id].alias&&i[h.location.id].alias===i[h.lastLocation.id].back)&&(delete i[h.lastLocation.id].backLoc,delete e[h.lastLocation.id],sessionStorage.setItem(c,JSON.stringify(e))):(e[h.location.id]=i[h.location.id].backLoc=h.lastLocation,sessionStorage.setItem(c,JSON.stringify(e))),C())}function C(){var e=h.location.id,l=i[e];if(h.hasOwnProperty("lastLocation")){var c=e.replace(/-.*$/,""),u=h.lastLocation.id.replace(/-.*$/,"");c!==u&&(r.hasOwnProperty(c)&&(r[c].className="selected","string"!=typeof s[c]&&h.setSvgPath(r[c].firstChild,s[c].selected,1)),r.hasOwnProperty(u)&&(r[u].className="","string"!=typeof s[u]&&h.setSvgPath(r[u].firstChild,s[u].normal,1))),P()}"function"==typeof h.pageEvents.onroute&&h.pageEvents.onroute({type:"route"}),y(l,e,!0,function(s){if(n)o=!0;else{var l;if(e===t)N();else{var r=i[e].alias?i[e].alias:e,c=i[e].title||i[r].title;for(d.classList.add(e),v.data=c,(f.classList.contains("clean")||f.classList.contains("hidePageHeader"))&&(document.title=c),self.frameElement&&frameElement.kernel&&"page"===h.getCurrentPopup()&&h.setPopupTitle(c);E.childNodes.length;)E.firstChild.remove();for(E.removeAttribute("href");w.childNodes.length;)w.firstChild.remove();w.removeAttribute("href"),i[r].rightMenuContent||i[r].onrightmenuclick?("string"==typeof i[r].rightMenuContent?E.innerHTML=i[r].rightMenuContent:i[r].rightMenuContent&&E.appendChild(i[r].rightMenuContent),"function"==typeof i[r].onrightmenuclick?E.href="javascript:;":i[r].onrightmenuclick&&(E.href=i[r].onrightmenuclick),E.style.display=""):E.style.display="none",i[r].leftMenuContent||i[r].onleftmenuclick?("string"==typeof i[r].leftMenuContent?w.innerHTML=i[r].leftMenuContent:i[r].leftMenuContent&&w.appendChild(i[r].leftMenuContent),"function"==typeof i[r].onleftmenuclick?w.href="javascript:;":i[r].onleftmenuclick&&(w.href=i[r].onleftmenuclick),w.style.display=""):w.style.display="none",function(e){if(e&&e.id){var t=i[e.id].title;!t&&i[e.id].alias&&(t=i[i[e.id].alias].title),m.lastChild.data=t||a.back,m.href=h.buildHash(e),m.style.display=""}else m.style.display="none"}(h.getDefaultBack());var u=d.querySelector(":scope>.content>."+r);if(t){d.classList.remove(t);var p=t,y=i[p].alias?i[p].alias:p;if(t=e,r===y)N(l=!0);else{n=!0;var b=d.querySelector(":scope>.content>."+y),x=h.isGoingback(p,e);l=!x||s,g(u,b,x,function(){n=!1,"function"==typeof i[y].onunloadend&&i[y].onunloadend(),document.activeElement&&b.contains(document.activeElement)&&document.activeElement.blur(),"function"==typeof i[r].onloadend&&i[r].onloadend(l),o&&(o=!1,u.style.visibility="inherit",C())}),"function"==typeof i[y].onunload&&i[y].onunload(),"function"==typeof i[r].onload&&i[r].onload(l)}}else l=!0,t=e,u.style.left=0,u.style.visibility="inherit",N(l)}"function"==typeof h.pageEvents.onroutend&&h.pageEvents.onroutend({type:"routend",force:l})}})}function q(e,n){var o=i[t].alias?i[i[t].alias]:i[t];(!e||e===t||"array"===h.dataType(e)&&e.indexOf(t)>=0)&&(n||P(),"function"==typeof o.onload&&o.onload(!0),"function"==typeof o.onloadend&&o.onloadend(!0))}function P(){self.frameElement&&frameElement.kernel||(h.hideReadable(),h.closePopup())}function N(e){var n=i[t].alias?i[i[t].alias]:i[t];"function"==typeof n.onload&&n.onload(e),"function"==typeof n.onloadend&&n.onloadend(e)}h.init=function(t,n){if(i.hasOwnProperty(t))if(l=t,h.hasOwnProperty("location"))n&&S(n),k();else{for(var o in h.location=h.parseHash(location.hash),h.location.args.ui&&h.location.args.ui.split(",").forEach(function(e){f.classList.add(e)}),e=(e=sessionStorage.getItem(c))?JSON.parse(e):{})i.hasOwnProperty(o)&&(i[o].backLoc=e[o]);self.addEventListener("hashchange",k),S(n),self.addEventListener("contextmenu","Firefox"===browser.name?x:b),self.addEventListener("dragstart",b),C(),h.location.args.hasOwnProperty("autopopup")&&h.openPopup(h.location.args.autopopup,h.location.args.autopopuparg?JSON.parse(h.location.args.autopopuparg):void 0)?(document.body.querySelector("#popup").style.animationDuration="1ms",h.listeners.add(h.popupEvents,"showend",L)):L()}},h.reloadPage=function(e,t){var n;h.isLoading()?(n=h.location,h.listeners.add(h.dialogEvents,"loaded",function o(i){h.listeners.remove(this,i.type,o);n===h.location&&q(e,t)})):q(e,t)},h.destoryPage=function(e){i.hasOwnProperty(e)&&p(i[e],"page",e)},h.pageEvents={},m.insertBefore(h.makeSvg("angle-left-light",1),m.firstChild),E.addEventListener("click",function(e){var n=i[i[t].alias?i[t].alias:t];"function"==typeof n.onrightmenuclick&&n.onrightmenuclick()}),w.addEventListener("click",function(e){var n=i[i[t].alias?i[t].alias:t];"function"==typeof n.onleftmenuclick&&n.onleftmenuclick()})}(),"IOS"===browser.name&&(self.addEventListener("gesturestart",b),self.addEventListener("touchmove",b,{passive:!1})),self.frameElement&&frameElement.kernel?self.Reflect?Reflect.setPrototypeOf(h,frameElement.kernel):h.__proto__=frameElement.kernel:(h.buildHash=function(e){var t="#!"+encodeURIComponent(e.id);for(var n in e.args)t+=void 0===e.args[n]?"&"+encodeURIComponent(n):"&"+encodeURIComponent(n)+"="+encodeURIComponent(e.args[n]);return t},h.isSameLocation=function(e,t){if(e.id===t.id&&Object.keys(e.args).length===Object.keys(t.args).length){for(var n in e.args){if(!t.args.hasOwnProperty(n))return!1;if(void 0===e.args[n]){if(e.args[n]!==t.args[n])return!1}else if(""+e.args[n]!=""+t.args[n])return!1}return!0}return!1},h.dataType=function(e){var t=typeof e;return["boolean","string","symbol","number","bigint","function","undefined"].indexOf(t)<0?(t=Object.prototype.toString.call(e).replace(/^\[object |\]$/g,"").toLowerCase(),["date","array","regexp","error","null"].indexOf(t)<0?"object":t):t},function(){var e,t,n=document.head.querySelector("meta[name=viewport]"),o=n.content;function i(t,n){var o=Math.min(t,n)/e;return o>1&&(o=Math.sqrt(o)),Math.round(t/o)}h.setAutoScale=function(t){(e=t)>0?self.dispatchEvent(new Event("resize")):n.content=o},self.addEventListener("resize",self.visualViewport?function(){e>0&&(n.content="user-scalable=no, width="+i(Math.round(visualViewport.width*visualViewport.scale),Math.round(visualViewport.height*visualViewport.scale)))}:function(){if(e>0)if("IOS"===browser.name)if(n.content===o)n.content="user-scalable=no, width="+i(innerWidth,innerHeight);else{var s=innerWidth,a=innerHeight;n.content=o,function e(){innerWidth===s&&innerHeight===a?requestAnimationFrame(e):n.content="user-scalable=no, width="+i(innerWidth,innerHeight)}()}else if(t)t=!1;else{n.content!==o&&(t=!0,n.content=o);var l=i(innerWidth,innerHeight);l!==innerWidth&&(t=!0,n.content="user-scalable=no, width="+l)}})}(),function(){h.listeners={add:function(e,t,n){e.xEvents||(e.xEvents=function(t){!function(e,t){e.xEvents[t.type].locked=!0;for(var n=0;n<e.xEvents[t.type].length;n++)e.xEvents[t.type][n].call(e,t);e.xEvents[t.type].locked=!1;for(;e.xEvents[t.type].stack.length;){if(e.xEvents[t.type].stack[0]){var o=e.xEvents[t.type].indexOf(e.xEvents[t.type].stack[0][1]);e.xEvents[t.type].stack[0][0]?o>=0&&e.xEvents[t.type].splice(o,1):o<0&&e.xEvents[t.type].push(e.xEvents[t.type].stack[0][1])}else e.xEvents[t.type].splice(0,e.xEvents[t.type].length);e.xEvents[t.type].stack.shift()}e.xEvents[t.type].length||(delete e.xEvents[t.type],e["on"+t.type]=null);if(e.xEvents.removeMark){for(var i in delete e.xEvents.removeMark,e.xEvents)delete e.xEvents[i],e["on"+i]=null;delete e.xEvents}}(e,t)}),e.xEvents[t]||(e.xEvents[t]=[],e.xEvents[t].stack=[],e.xEvents[t].locked=!1,e["on"+t]=e.xEvents),e.xEvents[t].locked?e.xEvents[t].stack.push([!1,n]):e.xEvents[t].indexOf(n)<0&&e.xEvents[t].push(n)},list:function(e,t){var n;if(t)n=e.xEvents&&e.xEvents[t]?e.xEvents[t].slice(0):[];else if(n={},e.xEvents)for(var o in e.xEvents)"array"===h.dataType(e.xEvents[o])&&e.xEvents[o].length&&(n[o]=e.xEvents[o].slice(0));return n},remove:function(e,t,n){if(e.xEvents)if(t){if(e.xEvents[t]){if(e.xEvents[t].locked)n?e.xEvents[t].stack.push([!0,n]):e.xEvents[t].stack.push(null);else if(n){var o=e.xEvents[t].indexOf(n);o>=0&&e.xEvents[t].splice(o,1)}else e.xEvents[t].splice(0,e.xEvents[t].length);0===e.xEvents[t].length&&(delete e.xEvents[t],e["on"+t]=null)}}else if(!e.xEvents.removeMark){var i;for(var s in e.xEvents)e.xEvents[s].locked?i=!0:(delete e.xEvents[s],e["on"+s]=null);i?e.xEvents.removeMark=!0:delete e.xEvents}}}}(),function(){function e(e){0===this.scrollTop?this.scrollTop=1:this.scrollTop+this.clientHeight===this.scrollHeight&&(this.scrollTop-=1)}h.scrollReload=function(e,t){var o,i,s,a,l=this,r=n(e,function(n){var d;if("start"===n.type){if(0===r.pointers.length&&0===l.getScrollTop(e))return o=n.y,n.domEvent.view.addEventListener("scroll",c,!0),!0}else{if(a)return a=!1,!0;if(n.y>o+5)i||(i=!0,n.domEvent.view.removeEventListener("scroll",c,!0)),n.domEvent.preventDefault(),s||((s=n.domEvent.view.document.createElement("div")).className="reloadHint",s.appendChild(l.makeSvg("sync-alt-solid",1)),e.appendChild(s)),d=s.offsetHeight||s.clientHeight,n.y-o<2*d?(s.style.top=n.y-o-d+"px",s.classList.remove("pin"),s.style.opacity=(n.y-o)/d/2,s.style.transform="rotate("+360*s.style.opacity+"deg)"):(s.style.top=d+"px",s.style.opacity=1,s.classList.add("pin"),s.style.transform="");else{if(n.y<o&&!i)return!0;s&&(s.remove(),s=void 0)}"end"!==n.type&&"cancel"!==n.type||(s&&(s.remove(),s.classList.contains("pin")&&("function"==typeof t?t():l.reloadPage()),s=void 0),i=!1)}});function c(t){t.target!==e&&(a=!0,this.removeEventListener("scroll",c,!0))}l.fixIosScrolling(e)},h.fixIosScrolling=function(t,n){"IOS"===browser.name&&(t.style.webkitOverflowScrolling="touch",t.addEventListener("touchmove",x,{passive:!1}),n||(t.classList.add("iosScrollFix"),t.scrollTop=1,t.addEventListener("scroll",e)))},h.getScrollTop=function(e){return e.classList.contains("iosScrollFix")?e.scrollTop-1:e.scrollTop},h.getScrollHeight=function(e){return e.classList.contains("iosScrollFix")?e.scrollHeight-2:e.scrollHeight},h.setScrollTop=function(e,t){e.scrollTop=e.classList.contains("iosScrollFix")?t+1:t}}(),function(){var e,t=document.body.querySelector("#helper"),n=t.firstChild,o=t.lastChild;function i(e){o.src=e.img,"right"in e&&(o.style.right=e.right),"left"in e&&(o.style.left=e.left),"top"in e&&(o.style.top=e.top),"bottom"in e&&(o.style.bottom=e.bottom),"width"in e&&(o.style.width=e.width),"height"in e&&(o.style.height=e.height);for(var t=0;t<n.childNodes.length;t++){var i=n.childNodes[t];e.rows[t]?(i.style.height=e.rows[t],i.className="unflexable"):(i.style.height="auto",i.className="flexable")}for(var s=0;s<n.childNodes[1].childNodes.length;s++){var a=n.childNodes[1].childNodes[s];e.cells[s]?(a.style.width=e.cells[s],a.className="unflexable"):(a.style.width="auto",a.className="flexable")}}t.addEventListener("click",function n(){e.length>1?(e.shift(),"function"==typeof e[0]?(e[0](),n()):i(e[0])):t.style.display=""}),h.showHelper=function(n){i((e="array"===h.dataType(n)?n:[n])[0]),t.style.display="block"}}(),function(){var e,t,n,o,i,l=document.body.querySelector("#popup"),r=l.querySelector(":scope>.header>.close"),c=l.querySelector(":scope>.header>.title").firstChild,d=l.querySelector(":scope>.header>.back");function u(t,n){return e&&"function"==typeof s[e].onunload&&s[e].onunload()||"function"==typeof s[t].onload&&s[t].onload(n)}function v(o){e&&l.classList.remove(e),t=n=void 0,e=o,l.classList.add(e),c.data=s[o].title,f.classList.contains("hidePopupHeader")&&(document.title=c.data),d.style.display="none"}h.openPopup=function(t,n,o){var i=s[t];if(i)return y(i,t,!1,function(s){"function"==typeof i.open?i.open(n,e&&o):h.showPopup(t,o)}),!0;h.hint("popup config not found: "+t)},h.showPopup=function(t,n){if(o)i=function(){h.showPopup(t,n)};else{var a=l.querySelector(":scope>.content>."+t);if(n=e&&n,l.classList.contains("in")){if(e!==t){if(u(t,n))return!0;var r=e,c=l.querySelector(":scope>.content>."+e);return g(a,c,n,function(){if(o=!1,v(t),"function"==typeof s[r].onunloadend&&s[r].onunloadend(),document.activeElement&&c.contains(document.activeElement)&&document.activeElement.blur(),"function"==typeof s[e].onloadend&&s[e].onloadend(n),"function"==typeof i){var a=i;i=void 0,a()}}),o=t,!1}"function"==typeof s[t].onload&&s[t].onload(n)||"function"==typeof s[t].onloadend&&s[t].onloadend(n)}else{if(u(t,n))return!0;a.style.left=0,a.style.visibility="inherit",l.classList.add("in"),o=t,"function"==typeof h.popupEvents.onshow&&h.popupEvents.onshow({type:"show",id:t}),v(t),h.hideReadable()}}},h.closePopup=function(e){if(o)i=function(){h.closePopup(e)};else{var t=h.getCurrentPopup();t&&(!e||t===e||"array"===h.dataType(e)&&e.indexOf(t)>=0)&&("function"==typeof s[t].onunload&&s[t].onunload()||(l.classList.remove("in"),l.classList.add("out"),o=!0,"function"==typeof h.popupEvents.onhide&&h.popupEvents.onhide({type:"hide",id:t})))}},h.getCurrentPopup=function(){if(l.classList.contains("in"))return e},h.setPopupBack=function(e,o){l.classList.contains("in")&&(e?(d.lastChild.data="function"!=typeof e&&s[e].title?s[e].title:a.back,t=e,d.style.display="",n=o):d.style.display="none")},h.setPopupTitle=function(t,n){n?s.hasOwnProperty(n)&&(s[n].title=t,e===n&&(c.data=t,f.classList.contains("hidePopupHeader")&&(document.title=c.data))):l.classList.contains("in")&&(c.data=t,f.classList.contains("hidePopupHeader")&&(document.title=c.data))},h.destoryPopup=function(e){s.hasOwnProperty(e)&&p(s[e],"popup",e)},h.popupEvents={},r.appendChild(h.makeSvg("times-light",1)),r.addEventListener("click",function(){h.closePopup()}),d.insertBefore(h.makeSvg("angle-left-light",1),d.firstChild),d.addEventListener("click",function(e){"function"==typeof t?t(n):h.openPopup(t,n,!0)}),l.addEventListener("animationend",function(t){if(t.target===this){if(o=!1,this.classList.contains("out")){this.classList.remove("out"),"function"==typeof h.popupEvents.onhideend&&h.popupEvents.onhideend({type:"hideend",id:e});var n=l.querySelector(":scope>.content>."+e);n.style.left=n.style.visibility="","function"==typeof s[e].onunloadend&&s[e].onunloadend(),document.activeElement&&n.contains(document.activeElement)&&document.activeElement.blur(),l.classList.remove(e),e=void 0}else"function"==typeof s[e].onloadend&&s[e].onloadend(!0),"function"==typeof h.popupEvents.onshowend&&h.popupEvents.onshowend({type:"showend",id:e});if("function"==typeof i){var a=i;i=void 0,a()}}})}(),c=document.body.querySelector("#readable"),d=c.querySelector(":scope>.close"),u=c.querySelector(":scope>.content"),h.fixIosScrolling(u),h.showReadable=function(e,t,n){"string"==typeof e?u.innerHTML=e:u.appendChild(e),c.className=n?"in "+n:"in",r=t},h.hideReadable=function(){c.classList.contains("in")&&(c.classList.remove("in"),c.classList.add("out"),"function"==typeof r&&r())},h.showForeign=function(e,t){h.showReadable('<iframe frameborder="no" scrolling="auto" sandbox="allow-same-origin allow-forms allow-scripts" src="'+e+'"></iframe>',t,"foreign")},d.appendChild(h.makeSvg("times-solid",1)),d.addEventListener("click",h.hideReadable),c.addEventListener("animationend",function(e){if(e.target===this&&this.classList.contains("out")){for(;u.childNodes.length>0;)u.firstChild.remove();this.className=""}}),function(){var n,o,i=0,s=[],l={},r=document.body.querySelector("#loading"),c=document.body.querySelector("#hint"),d=document.body.querySelector("#dialog"),u=d.querySelector(":scope>div"),p=u.querySelector(":scope>.content"),y=u.querySelector(":scope>.close"),v=u.querySelector(":scope>.btns>.yes"),m=u.querySelector(":scope>.btns>.no"),g=document.body.querySelector("#sliderView"),w=g.querySelector(":scope>.close"),E=e(g.querySelector(":scope>.content")),b=document.body.querySelector("#photoView"),x=b.querySelector(":scope>.close"),L=b.querySelector(":scope>img"),S=b.querySelector(":scope>.actions"),k=t(b);function C(){h.closeDialog()}function q(e,t,n){"inherit"===d.style.visibility?s.push([e,t,n]):(u.className=e,"alert"===e?p.textContent=t:"confirm"===e?"string"==typeof t?(p.textContent=t,v.firstChild.data=a.yes,m.firstChild.data=a.no):(p.textContent=t[0],v.firstChild.data=t[1],m.firstChild.data=t[2]):"string"==typeof t?p.innerHTML=t:p.appendChild(t),self.addEventListener("resize",P),P(),d.style.visibility="inherit",o=n)}function P(){u.style.width=u.style.height="",u.style.left=u.style.top="20px",u.style.bottom=u.style.right="auto",u.style.width=u.offsetWidth+"px",u.style.height=u.offsetHeight+"px",u.style.left=u.style.top=u.style.bottom=u.style.right=""}function N(){L.style.width=l.w+"px",L.style.height=l.h+"px",L.style.left=l.l+"px",L.style.top=l.t+"px"}function O(){l.ww=innerWidth,l.wh=innerHeight,l.wr=l.ww/l.wh,l.ow=L.naturalWidth,l.oh=L.naturalHeight,l.r=l.ow/l.oh,l.ow>l.ww||l.oh>l.wh?l.r>l.wr?(l.z=l.mz=l.ww/l.ow,l.l=0,l.w=l.ww,l.h=l.w/l.r,l.t=(l.wh-l.h)/2):(l.z=l.mz=l.wh/l.oh,l.t=0,l.h=l.wh,l.w=l.h*l.r,l.l=(l.ww-l.w)/2):(l.z=l.mz=1,l.w=l.ow,l.h=l.oh,l.l=(l.ww-l.w)/2,l.t=(l.wh-l.h)/2),N()}k.onzoomstart=function e(t){var n=t.x,o=t.y,i=l.z;this.onzoomstart=null;this.onzoomchange=s;this.onzoomend=function(t){s.call(this,t),this.onzoomchange=this.zoomend=null,this.onzoomstart=e};function s(e){var t=Math.max(Math.min(e.zoom*i,1),l.mz);t!==l.z&&(l.w=l.ow*t,l.h=l.oh*t,l.l=l.w>l.ww?Math.min(Math.max(n+(l.l-n)*t/l.z,l.ww-l.w),0):(l.ww-l.w)/2,l.t=l.h>l.wh?Math.min(Math.max(o+(l.t-o)*t/l.z,l.wh-l.h),0):(l.wh-l.h)/2,l.z=t,N())}},k.ondragstart=function e(t){var n=t.x,o=t.y,i=l.l,s=l.t;k.ondragmove=a;k.ondragend=function(t){a.call(this,t),this.ondragmove=this.ondragend=null,this.ondragstart=e};function a(e){l.w>l.ww&&(l.l=Math.min(Math.max(i+e.x-n,l.ww-l.w),0)),l.h>l.wh&&(l.t=Math.min(Math.max(s+e.y-o,l.wh-l.h),0)),N()}},h.showPhotoView=function(e,t,n){for(L.src=e;S.childNodes.length;)S.firstChild.remove();if("function"==typeof n&&t&&t.length){for(var o=0;o<t.length;o++){var i=document.createElement("a");i.href="javascript:;",i.appendChild(document.createTextNode(t[o])),i.addEventListener("click",n.bind(h,o)),S.appendChild(i)}S.style.display=""}else S.style.display="none"},h.hidePhotoView=function(){L.src="about:blank"},L.addEventListener("load",function(){b.style.visibility="inherit",self.addEventListener("resize",O),O()}),L.addEventListener("error",function(){b.style.visibility="",self.removeEventListener("resize",O)}),h.showSliderView=function(e,t,n){g.className=n||"";for(var o=0;o<e.length;o++)E.add(e[o]);t&&E.slideTo(t,!0)},h.hideSliderView=function(){E.clear()},h.alert=function(e,t){q("alert",e,t)},h.confirm=function(e,t){q("confirm",e,t)},h.htmlDialog=function(e,t,n){q(t||"",e,n)},h.closeDialog=function(e){for(self.removeEventListener("resize",P,!1),d.style.visibility="","function"==typeof o&&o(e);p.childNodes.length;)p.lastChild.remove();if(o=void 0,s.length){var t=s.shift();h[t.shift()].apply(h,t)}},h.showLoading=function(e){r.querySelector(":scope>div").lastChild.data=e||a.loading,0===i&&(r.style.visibility="inherit",f.classList.add("mask")),i++},h.hideLoading=function(){i>0&&0===--i&&(r.style.visibility="",f.classList.remove("mask"),"function"==typeof h.dialogEvents.onloaded&&h.dialogEvents.onloaded({type:"loaded"}))},h.isLoading=function(){return i>0},h.hint=function(e,t){c.querySelector(":scope>.text").firstChild.data=e,n?clearTimeout(n):c.style.opacity=1,n=setTimeout(function(){c.style.opacity="",n=void 0},t||5e3)},h.dialogEvents={},E.onchange=function(){var e="";if(this.children.length){if(this.children.length>1)for(var t=0;t<this.children.length;t++)e+=t===this.current?"●":"○";g.style.visibility="inherit"}else g.style.visibility="";g.querySelector(":scope>.nav").firstChild.data=e},y.appendChild(h.makeSvg("times-circle-solid",1)),y.addEventListener("click",C),m.addEventListener("click",C),v.addEventListener("click",h.closeDialog),w.appendChild(h.makeSvg("times-solid",1)),x.appendChild(w.firstChild.cloneNode(!0)),w.addEventListener("click",h.hideSliderView),x.addEventListener("click",h.hidePhotoView)}()),h;function p(e,t,n){var o=t+"/"+n+"/",i=document.body.querySelector("#"+t+">.content>."+n);2===e.loaded&&"function"==typeof e.ondestory&&e.ondestory(),i.remove(),e.css&&"string"!=typeof e.css&&(e.css=h.removeCss(e.css).substr(require.toUrl(o).length)),e.js&&(o+=e.js,require.defined(o)&&(i=require(o),require.undef(o),i&&(self.Reflect?Reflect.setPrototypeOf(e,Object.prototype):e.__proto__=Object.prototype))),e.loaded=0}function y(e,t,n,o){var s,a,l;if(n&&e.alias&&(t=e.alias,e=i[e.alias]),2===e.loaded)o();else if(1!==e.loaded){e.loaded=1,n?(s=document.body.querySelector("#page"),a="page"):(s=document.body.querySelector("#popup"),a="popup"),l=a+"/"+t+"/";var r=require.toUrl(l);if("string"==typeof e.css&&(e.css=h.appendCss(r+e.css)),"html"in e){h.showLoading();var c=r+e.html,d=new XMLHttpRequest;d.open("get",c,!0),d.onreadystatechange=function(){4===this.readyState&&(200===this.status?u(this.responseText):(p(e,a,t),"dev"===VERSION||404!==this.status?v(c,this.status,n):m(n)),h.hideLoading())},d.send("")}else u("")}function u(i){if(s.querySelector(":scope>.content").insertAdjacentHTML("beforeEnd",'<div class="'+t+'">'+i+"</div>"),w(s.querySelector(":scope>.content>."+t)),"js"in e){h.showLoading();var r=l+e.js;require([r],function(t){t&&(self.Reflect?Reflect.setPrototypeOf(e,t):e.__proto__=t),e.loaded=2,o(!0),h.hideLoading()},"dev"===VERSION?void 0:function(o){p(e,a,t),o.requireType&&"scripterror"!==o.requireType&&"nodefine"!==o.requireType||o.xhr&&404!==o.xhr.status?v(r,o.message,n):m(n),h.hideLoading()})}else e.loaded=2,o(!0)}}function v(e,t,n){h.alert(a.error.replace("${res}",e)+t,n?function(){history.back()}:void 0)}function m(e){e?location.reload():h.confirm(a.update,function(e){e&&location.reload()})}function g(e,t,n,o){e.style.visibility="inherit",n?(t.style.animationName="panelTransR1",e.style.animationName="panelTransR2"):(t.style.animationName="panelTransL1",e.style.animationName="panelTransL2"),"function"==typeof o&&w(e,function e(t){this.removeEventListener(t.type,e,!1);o()})}function w(e,t){"function"!=typeof t&&(t=E),e.addEventListener("animationend",t)}function E(e){e.target===this&&("1"===this.style.animationName.substr(this.style.animationName.length-1)?this.style.left=this.style.visibility="":this.style.left=0,this.style.animationName="")}function b(e){e.preventDefault()}function x(e){e.stopPropagation()}function L(e){e&&(h.listeners.remove(this,e.type,L),setTimeout(function(){document.body.querySelector("#popup").style.animationDuration=""},400)),document.body.addEventListener("transitionend",function(e){e.target===this&&(document.body.style.transition="")}),document.documentElement.classList.remove("loading")}});
"use strict";define(["common/touchslider/touchslider","common/touchguesture/touchguesture","common/pointerevents/pointerevents","common/svgicos/svgicos","site/pages/pages","site/popups/popups"],function(e,t,n,o,i,s){var a,l,r,c,d,u=document.body.querySelector("#activities"),f={appendCss:function(e){var t=document.createElement("link");return/\.less$/.test(e)?self.less?(t.rel="stylesheet/less",t.href=e,less.sheets.push(t),less.refresh()):(t.rel="stylesheet",t.href=e.replace(/less$/,"css")):(t.rel="stylesheet",t.href=e),document.head.appendChild(t)},removeCss:function(e){return e.remove(),"stylesheet/less"===e.rel&&(less.sheets.splice(less.sheets.indexOf(e),1),less.refresh()),e.getAttribute("href")},makeSvg:function(e,t){var n="http://www.w3.org/2000/svg",o=document.createElementNS(n,"svg");return o.appendChild(document.createElementNS(n,"path")),e&&f.setSvgPath(o,e,t),o},setSvgPath:function(e,t,n){var i=f.makeSvg();o.hasOwnProperty(t)&&(t=o[t]),e.firstChild.setAttribute("d",t),i.style.position="absolute",i.style.bottom=i.style.right="100%",i.firstChild.setAttribute("d",t),document.body.appendChild(i);var s=i.firstChild.getBBox();i.remove(),2==n?(s.width+=2*s.x,s.x=0,s.height+=2*s.y,s.y=0):n&&(s.width>s.height?(s.y-=(s.width-s.height)/2,s.height=s.width):(s.x-=(s.height-s.width)/2,s.width=s.height)),e.setAttribute("viewBox",s.x+" "+s.y+" "+s.width+" "+s.height)},parseHash:function(e){var t={id:a,args:{}},n=(e=e.substr(1).replace(/[#?].*$/,"")).match(/[^=&]+(=[^&]*)?/g);if(n&&"!"===n[0].charAt(0)){var o=decodeURIComponent(n[0].substr(1));i.hasOwnProperty(o)&&(t.id=o);for(var s=1;s<n.length;s++)(o=n[s].match(/^([^=]+)(=)?(.+)?$/))&&(t.args[decodeURIComponent(o[1])]=o[2]?decodeURIComponent(o[3]||""):void 0)}return t},getDefaultBack:function(e){e||(e=f.location);var t,n=i[e.id].backLoc;if(i[e.id].back&&i[i[e.id].back]){t={id:i[e.id].back,args:{}};var o=i[i[e.id].back].alias?i[i[i[e.id].back].alias]:i[i[e.id].back];if(o.args)for(var s=0;s<o.args.length;s++)e.args.hasOwnProperty(o.args[s])&&(t.args[o.args[s]]=e.args[o.args[s]])}if(n&&t){for(var a in t.args)if(t.args[a]!==n.args[a])return t;return n}return n||t},isGoingback:function(e,t){var n=e;if(n!==t){if(t===a||n.length>t.length+1&&n.substr(0,t.length+1)===t+"-")return!0;for(;i[n].back;)if((n=i[n].back)===t)return!0;n=e.split("-");for(var o,s=t.split("-"),l=Math.min(n.length,s.length);o<l&&n[o]===s[o];)o++;if(o<Math.max(n.length,s.length)-1)return o<n.length-1&&n.splice(o+1),o<s.length-1&&s.splice(o+1),f.isGoingback(n.join("-"),s.join("-"))}},replaceLocation:function(e){f.location&&f.isSameLocation(e,f.location)?f.reloadPage():location.replace(f.buildHash(e))}};return function(){var e,t,n,o,s,l,r=location.pathname,c=document.body.querySelector("#page"),d=c.querySelector(":scope>.navMenu"),y=c.querySelector(":scope>.header>.title").firstChild,v=c.querySelector(":scope>.header>.back"),g=c.querySelector(":scope>.header>.leftMenuBtn"),w=c.querySelector(":scope>.header>.rightMenuBtn");try{sessionStorage.setItem(0,0),sessionStorage.removeItem(0)}catch(e){Storage.prototype.setItem=function(){}}function L(e){for(;d.childNodes.length;)d.firstChild.remove();for(var t in l={},s=e)i.hasOwnProperty(t)&&(l[t]=d.appendChild(document.createElement("a")),l[t].href="#!"+t,RegExp("^"+t+"(?:-|$)").test(f.location.id)?(l[t].className="selected",l[t].appendChild(f.makeSvg("string"==typeof s[t]?s[t]:s[t].selected,1))):l[t].appendChild(f.makeSvg("string"==typeof s[t]?s[t]:s[t].normal,1)),l[t].appendChild(document.createTextNode(i[t].alias?i[t].title||i[i[t].alias].title:i[t].title)))}function S(){var t=f.parseHash(location.hash);f.isSameLocation(t,f.location)||(f.lastLocation=f.location,f.location=t,!i[f.location.id].back||f.lastLocation.id!==i[f.location.id].back&&i[f.lastLocation.id].alias!==i[f.location.id].back?i[f.lastLocation.id].backLoc&&(f.location.id===i[f.lastLocation.id].back||i[f.location.id].alias&&i[f.location.id].alias===i[f.lastLocation.id].back)&&(delete i[f.lastLocation.id].backLoc,delete e[f.lastLocation.id],sessionStorage.setItem(r,JSON.stringify(e))):(e[f.location.id]=i[f.location.id].backLoc=f.lastLocation,sessionStorage.setItem(r,JSON.stringify(e))),k())}function k(){var e=f.location.id,a=i[e];if(f.hasOwnProperty("lastLocation")){var r=e.replace(/-.*$/,""),d=f.lastLocation.id.replace(/-.*$/,"");r!==d&&(l.hasOwnProperty(r)&&(l[r].className="selected","string"!=typeof s[r]&&f.setSvgPath(l[r].firstChild,s[r].selected,1)),l.hasOwnProperty(d)&&(l[d].className="","string"!=typeof s[d]&&f.setSvgPath(l[d].firstChild,s[d].normal,1))),q()}"function"==typeof f.pageEvents.onroute&&f.pageEvents.onroute({type:"route"}),p(a,e,!0,function(s){if(n)o=!0;else{var a;if(e===t)P();else{var l=i[e].alias?i[e].alias:e,r=i[e].title||i[l].title;for(c.classList.add(e),y.data=r,(u.classList.contains("clean")||u.classList.contains("hidePageHeader"))&&(document.title=r),self.frameElement&&frameElement.kernel&&"page"===f.getCurrentPopup()&&f.setPopupTitle(r);w.childNodes.length;)w.firstChild.remove();for(w.removeAttribute("href");g.childNodes.length;)g.firstChild.remove();g.removeAttribute("href"),i[l].rightMenuContent||i[l].onrightmenuclick?("string"==typeof i[l].rightMenuContent?w.innerHTML=i[l].rightMenuContent:i[l].rightMenuContent&&w.appendChild(i[l].rightMenuContent),"function"==typeof i[l].onrightmenuclick?w.href="javascript:;":i[l].onrightmenuclick&&(w.href=i[l].onrightmenuclick),w.style.display=""):w.style.display="none",i[l].leftMenuContent||i[l].onleftmenuclick?("string"==typeof i[l].leftMenuContent?g.innerHTML=i[l].leftMenuContent:i[l].leftMenuContent&&g.appendChild(i[l].leftMenuContent),"function"==typeof i[l].onleftmenuclick?g.href="javascript:;":i[l].onleftmenuclick&&(g.href=i[l].onleftmenuclick),g.style.display=""):g.style.display="none",function(e){if(e&&e.id){var t=i[e.id].title;!t&&i[e.id].alias&&(t=i[i[e.id].alias].title),v.lastChild.data=t||"返回",v.href=f.buildHash(e),v.style.display=""}else v.style.display="none"}(f.getDefaultBack());var d=c.querySelector(":scope>.content>."+l);if(t){c.classList.remove(t);var h=t,p=i[h].alias?i[h].alias:h;if(t=e,l===p)P(a=!0);else{n=!0;var E=c.querySelector(":scope>.content>."+p),b=f.isGoingback(h,e);a=!b||s,m(d,E,b,function(){n=!1,"function"==typeof i[p].onunloadend&&i[p].onunloadend(),document.activeElement&&E.contains(document.activeElement)&&document.activeElement.blur(),"function"==typeof i[l].onloadend&&i[l].onloadend(a),o&&(o=!1,d.style.visibility="inherit",k())}),"function"==typeof i[p].onunload&&i[p].onunload(),"function"==typeof i[l].onload&&i[l].onload(a)}}else a=!0,t=e,d.style.left=0,d.style.visibility="inherit",P(a)}"function"==typeof f.pageEvents.onroutend&&f.pageEvents.onroutend({type:"routend",force:a})}})}function C(e,n){var o=i[t].alias?i[i[t].alias]:i[t];(!e||e===t||"array"===f.dataType(e)&&e.indexOf(t)>=0)&&(n||q(),"function"==typeof o.onload&&o.onload(!0),"function"==typeof o.onloadend&&o.onloadend(!0))}function q(){self.frameElement&&frameElement.kernel||(f.hideReadable(),f.closePopup())}function P(e){var n=i[t].alias?i[i[t].alias]:i[t];"function"==typeof n.onload&&n.onload(e),"function"==typeof n.onloadend&&n.onloadend(e)}f.init=function(t,n){if(i.hasOwnProperty(t))if(a=t,f.hasOwnProperty("location"))n&&L(n),S();else{for(var o in f.location=f.parseHash(location.hash),f.location.args.ui&&f.location.args.ui.split(",").forEach(function(e){u.classList.add(e)}),e=(e=sessionStorage.getItem(r))?JSON.parse(e):{})i.hasOwnProperty(o)&&(i[o].backLoc=e[o]);self.addEventListener("hashchange",S),L(n),self.addEventListener("contextmenu","Firefox"===browser.name?b:E),self.addEventListener("dragstart",E),k(),f.location.args.hasOwnProperty("autopopup")&&f.openPopup(f.location.args.autopopup,f.location.args.autopopuparg?JSON.parse(f.location.args.autopopuparg):void 0)?(document.body.querySelector("#popup").style.animationDuration="1ms",f.listeners.add(f.popupEvents,"showend",x)):x()}},f.reloadPage=function(e,t){var n;f.isLoading()?(n=f.location,f.listeners.add(f.dialogEvents,"loaded",function o(i){f.listeners.remove(this,i.type,o);n===f.location&&C(e,t)})):C(e,t)},f.destoryPage=function(e){i.hasOwnProperty(e)&&h(i[e],"page",e)},f.pageEvents={},v.insertBefore(f.makeSvg("angle-left-light",1),v.firstChild),w.addEventListener("click",function(e){var n=i[i[t].alias?i[t].alias:t];"function"==typeof n.onrightmenuclick&&n.onrightmenuclick()}),g.addEventListener("click",function(e){var n=i[i[t].alias?i[t].alias:t];"function"==typeof n.onleftmenuclick&&n.onleftmenuclick()})}(),"IOS"===browser.name&&(self.addEventListener("gesturestart",E),self.addEventListener("touchmove",E,{passive:!1})),self.frameElement&&frameElement.kernel?self.Reflect?Reflect.setPrototypeOf(f,frameElement.kernel):f.__proto__=frameElement.kernel:(f.buildHash=function(e){var t="#!"+encodeURIComponent(e.id);for(var n in e.args)t+=void 0===e.args[n]?"&"+encodeURIComponent(n):"&"+encodeURIComponent(n)+"="+encodeURIComponent(e.args[n]);return t},f.isSameLocation=function(e,t){if(e.id===t.id&&Object.keys(e.args).length===Object.keys(t.args).length){for(var n in e.args){if(!t.args.hasOwnProperty(n))return!1;if(void 0===e.args[n]){if(e.args[n]!==t.args[n])return!1}else if(""+e.args[n]!=""+t.args[n])return!1}return!0}return!1},f.dataType=function(e){var t=typeof e;return["boolean","string","symbol","number","bigint","function","undefined"].indexOf(t)<0?(t=Object.prototype.toString.call(e).replace(/^\[object |\]$/g,"").toLowerCase(),["date","array","regexp","error","null"].indexOf(t)<0?"object":t):t},function(){var e,t,n=document.head.querySelector("meta[name=viewport]"),o=n.content;function i(t,n){var o=Math.min(t,n)/e;return o>1&&(o=Math.sqrt(o)),Math.round(t/o)}f.setAutoScale=function(t){(e=t)>0?self.dispatchEvent(new Event("resize")):n.content=o},self.addEventListener("resize",self.visualViewport?function(){e>0&&(n.content="user-scalable=no, width="+i(Math.round(visualViewport.width*visualViewport.scale),Math.round(visualViewport.height*visualViewport.scale)))}:function(){if(e>0)if("IOS"===browser.name)if(n.content===o)n.content="user-scalable=no, width="+i(innerWidth,innerHeight);else{var s=innerWidth,a=innerHeight;n.content=o,function e(){innerWidth===s&&innerHeight===a?requestAnimationFrame(e):n.content="user-scalable=no, width="+i(innerWidth,innerHeight)}()}else if(t)t=!1;else{n.content!==o&&(t=!0,n.content=o);var l=i(innerWidth,innerHeight);l!==innerWidth&&(t=!0,n.content="user-scalable=no, width="+l)}})}(),function(){f.listeners={add:function(e,t,n){e.xEvents||(e.xEvents=function(t){!function(e,t){e.xEvents[t.type].locked=!0;for(var n=0;n<e.xEvents[t.type].length;n++)e.xEvents[t.type][n].call(e,t);e.xEvents[t.type].locked=!1;for(;e.xEvents[t.type].stack.length;){if(e.xEvents[t.type].stack[0]){var o=e.xEvents[t.type].indexOf(e.xEvents[t.type].stack[0][1]);e.xEvents[t.type].stack[0][0]?o>=0&&e.xEvents[t.type].splice(o,1):o<0&&e.xEvents[t.type].push(e.xEvents[t.type].stack[0][1])}else e.xEvents[t.type].splice(0,e.xEvents[t.type].length);e.xEvents[t.type].stack.shift()}e.xEvents[t.type].length||(delete e.xEvents[t.type],e["on"+t.type]=null);if(e.xEvents.removeMark){for(var i in delete e.xEvents.removeMark,e.xEvents)delete e.xEvents[i],e["on"+i]=null;delete e.xEvents}}(e,t)}),e.xEvents[t]||(e.xEvents[t]=[],e.xEvents[t].stack=[],e.xEvents[t].locked=!1,e["on"+t]=e.xEvents),e.xEvents[t].locked?e.xEvents[t].stack.push([!1,n]):e.xEvents[t].indexOf(n)<0&&e.xEvents[t].push(n)},list:function(e,t){var n;if(t)n=e.xEvents&&e.xEvents[t]?e.xEvents[t].slice(0):[];else if(n={},e.xEvents)for(var o in e.xEvents)"array"===f.dataType(e.xEvents[o])&&e.xEvents[o].length&&(n[o]=e.xEvents[o].slice(0));return n},remove:function(e,t,n){if(e.xEvents)if(t){if(e.xEvents[t]){if(e.xEvents[t].locked)n?e.xEvents[t].stack.push([!0,n]):e.xEvents[t].stack.push(null);else if(n){var o=e.xEvents[t].indexOf(n);o>=0&&e.xEvents[t].splice(o,1)}else e.xEvents[t].splice(0,e.xEvents[t].length);0===e.xEvents[t].length&&(delete e.xEvents[t],e["on"+t]=null)}}else if(!e.xEvents.removeMark){var i;for(var s in e.xEvents)e.xEvents[s].locked?i=!0:(delete e.xEvents[s],e["on"+s]=null);i?e.xEvents.removeMark=!0:delete e.xEvents}}}}(),function(){function e(e){0===this.scrollTop?this.scrollTop=1:this.scrollTop+this.clientHeight===this.scrollHeight&&(this.scrollTop-=1)}f.scrollReload=function(e,t){var o,i,s,a,l=this,r=n(e,function(n){var d;if("start"===n.type){if(0===r.pointers.length&&0===l.getScrollTop(e))return o=n.y,n.domEvent.view.addEventListener("scroll",c,!0),!0}else{if(a)return a=!1,!0;if(n.y>o+5)i||(i=!0,n.domEvent.view.removeEventListener("scroll",c,!0)),n.domEvent.preventDefault(),s||((s=n.domEvent.view.document.createElement("div")).className="reloadHint",s.appendChild(l.makeSvg("sync-alt-solid",1)),e.appendChild(s)),d=s.offsetHeight||s.clientHeight,n.y-o<2*d?(s.style.top=n.y-o-d+"px",s.classList.remove("pin"),s.style.opacity=(n.y-o)/d/2,s.style.transform="rotate("+360*s.style.opacity+"deg)"):(s.style.top=d+"px",s.style.opacity=1,s.classList.add("pin"),s.style.transform="");else{if(n.y<o&&!i)return!0;s&&(s.remove(),s=void 0)}"end"!==n.type&&"cancel"!==n.type||(s&&(s.remove(),s.classList.contains("pin")&&("function"==typeof t?t():l.reloadPage()),s=void 0),i=!1)}});function c(t){t.target!==e&&(a=!0,this.removeEventListener("scroll",c,!0))}l.fixIosScrolling(e)},f.fixIosScrolling=function(t,n){"IOS"===browser.name&&(t.style.webkitOverflowScrolling="touch",t.addEventListener("touchmove",b,{passive:!1}),n||(t.classList.add("iosScrollFix"),t.scrollTop=1,t.addEventListener("scroll",e)))},f.getScrollTop=function(e){return e.classList.contains("iosScrollFix")?e.scrollTop-1:e.scrollTop},f.getScrollHeight=function(e){return e.classList.contains("iosScrollFix")?e.scrollHeight-2:e.scrollHeight},f.setScrollTop=function(e,t){e.scrollTop=e.classList.contains("iosScrollFix")?t+1:t}}(),function(){var e,t=document.body.querySelector("#helper"),n=t.firstChild,o=t.lastChild;function i(e){o.src=e.img,"right"in e&&(o.style.right=e.right),"left"in e&&(o.style.left=e.left),"top"in e&&(o.style.top=e.top),"bottom"in e&&(o.style.bottom=e.bottom),"width"in e&&(o.style.width=e.width),"height"in e&&(o.style.height=e.height);for(var t=0;t<n.childNodes.length;t++){var i=n.childNodes[t];e.rows[t]?(i.style.height=e.rows[t],i.className="unflexable"):(i.style.height="auto",i.className="flexable")}for(var s=0;s<n.childNodes[1].childNodes.length;s++){var a=n.childNodes[1].childNodes[s];e.cells[s]?(a.style.width=e.cells[s],a.className="unflexable"):(a.style.width="auto",a.className="flexable")}}t.addEventListener("click",function n(){e.length>1?(e.shift(),"function"==typeof e[0]?(e[0](),n()):i(e[0])):t.style.display=""}),f.showHelper=function(n){i((e="array"===f.dataType(n)?n:[n])[0]),t.style.display="block"}}(),function(){var e,t,n,o,i,a=document.body.querySelector("#popup"),l=a.querySelector(":scope>.header>.close"),r=a.querySelector(":scope>.header>.title").firstChild,c=a.querySelector(":scope>.header>.back");function d(t,n){return e&&"function"==typeof s[e].onunload&&s[e].onunload()||"function"==typeof s[t].onload&&s[t].onload(n)}function y(o){e&&a.classList.remove(e),t=n=void 0,e=o,a.classList.add(e),r.data=s[o].title,u.classList.contains("hidePopupHeader")&&(document.title=r.data),c.style.display="none"}f.openPopup=function(t,n,o){var i=s[t];if(i)return p(i,t,!1,function(s){"function"==typeof i.open?i.open(n,e&&o):f.showPopup(t,o)}),!0;f.hint("popup config not found: "+t)},f.showPopup=function(t,n){if(o)i=function(){f.showPopup(t,n)};else{n=e&&n;var l=a.querySelector(":scope>.content>."+t);if(a.classList.contains("in")){if(e!==t){if(d(t,n))return!0;var r=e,c=a.querySelector(":scope>.content>."+e);return m(l,c,n,function(){if(o=!1,y(t),"function"==typeof s[r].onunloadend&&s[r].onunloadend(),document.activeElement&&c.contains(document.activeElement)&&document.activeElement.blur(),"function"==typeof s[e].onloadend&&s[e].onloadend(n),"function"==typeof i){var a=i;i=void 0,a()}}),o=t,!1}"function"==typeof s[t].onload&&s[t].onload(n)||"function"==typeof s[t].onloadend&&s[t].onloadend(n)}else{if(d(t,n))return!0;l.style.left=0,l.style.visibility="inherit",a.classList.add("in"),o=t,"function"==typeof f.popupEvents.onshow&&f.popupEvents.onshow({type:"show",id:t}),y(t),f.hideReadable()}}},f.closePopup=function(e){if(o)i=function(){f.closePopup(e)};else{var t=f.getCurrentPopup();t&&(!e||t===e||"array"===f.dataType(e)&&e.indexOf(t)>=0)&&("function"==typeof s[t].onunload&&s[t].onunload()||(a.classList.remove("in"),a.classList.add("out"),o=!0,"function"==typeof f.popupEvents.onhide&&f.popupEvents.onhide({type:"hide",id:t})))}},f.getCurrentPopup=function(){if(a.classList.contains("in"))return e},f.setPopupBack=function(e,o){a.classList.contains("in")&&(e?(c.lastChild.data="function"!=typeof e&&s[e].title?s[e].title:"返回",t=e,c.style.display="",n=o):c.style.display="none")},f.setPopupTitle=function(t,n){n?s.hasOwnProperty(n)&&(s[n].title=t,e===n&&(r.data=t,u.classList.contains("hidePopupHeader")&&(document.title=r.data))):a.classList.contains("in")&&(r.data=t,u.classList.contains("hidePopupHeader")&&(document.title=r.data))},f.destoryPopup=function(e){s.hasOwnProperty(e)&&h(s[e],"popup",e)},f.popupEvents={},l.appendChild(f.makeSvg("times-light",1)),l.addEventListener("click",function(){f.closePopup()}),c.insertBefore(f.makeSvg("angle-left-light",1),c.firstChild),c.addEventListener("click",function(e){"function"==typeof t?t(n):f.openPopup(t,n,!0)}),a.addEventListener("animationend",function(t){if(t.target===this){if(o=!1,this.classList.contains("out")){this.classList.remove("out"),"function"==typeof f.popupEvents.onhideend&&f.popupEvents.onhideend({type:"hideend",id:e});var n=a.querySelector(":scope>.content>."+e);n.style.left=n.style.visibility="","function"==typeof s[e].onunloadend&&s[e].onunloadend(),document.activeElement&&n.contains(document.activeElement)&&document.activeElement.blur(),a.classList.remove(e),e=void 0}else"function"==typeof s[e].onloadend&&s[e].onloadend(!0),"function"==typeof f.popupEvents.onshowend&&f.popupEvents.onshowend({type:"showend",id:e});if("function"==typeof i){var l=i;i=void 0,l()}}})}(),r=document.body.querySelector("#readable"),c=r.querySelector(":scope>.close"),d=r.querySelector(":scope>.content"),f.fixIosScrolling(d),f.showReadable=function(e,t,n){"string"==typeof e?d.innerHTML=e:d.appendChild(e),r.className=n?"in "+n:"in",l=t},f.hideReadable=function(){r.classList.contains("in")&&(r.classList.remove("in"),r.classList.add("out"),"function"==typeof l&&l())},f.showForeign=function(e,t){f.showReadable('<iframe frameborder="no" scrolling="auto" sandbox="allow-same-origin allow-forms allow-scripts" src="'+e+'"></iframe>',t,"foreign")},c.appendChild(f.makeSvg("times-solid",1)),c.addEventListener("click",f.hideReadable),r.addEventListener("animationend",function(e){if(e.target===this&&this.classList.contains("out")){for(;d.childNodes.length>0;)d.firstChild.remove();this.className=""}}),function(){var n,o,i=0,s=[],a={},l=document.body.querySelector("#loading"),r=document.body.querySelector("#hint"),c=document.body.querySelector("#dialog"),d=c.querySelector(":scope>div"),h=d.querySelector(":scope>.content"),p=d.querySelector(":scope>.close"),y=d.querySelector(":scope>.btns>.yes"),v=d.querySelector(":scope>.btns>.no"),m=document.body.querySelector("#sliderView"),g=m.querySelector(":scope>.close"),w=e(m.querySelector(":scope>.content")),E=document.body.querySelector("#photoView"),b=E.querySelector(":scope>.close"),x=E.querySelector(":scope>img"),L=E.querySelector(":scope>.actions"),S=t(E);function k(){f.closeDialog()}function C(e,t,n){"inherit"===c.style.visibility?s.push([e,t,n]):(d.className=e,"alert"===e?h.textContent=t:"confirm"===e?"string"==typeof t?(h.textContent=t,y.textContent="是",v.textContent="否"):(h.textContent=t[0],y.textContent=t[1],v.textContent=t[2]):"string"==typeof t?h.innerHTML=t:h.appendChild(t),self.addEventListener("resize",q),q(),c.style.visibility="inherit",o=n)}function q(){d.style.width=d.style.height="",d.style.left=d.style.top="20px",d.style.bottom=d.style.right="auto",d.style.width=d.offsetWidth+"px",d.style.height=d.offsetHeight+"px",d.style.left=d.style.top=d.style.bottom=d.style.right=""}function P(){x.style.width=a.w+"px",x.style.height=a.h+"px",x.style.left=a.l+"px",x.style.top=a.t+"px"}function N(){a.ww=innerWidth,a.wh=innerHeight,a.wr=a.ww/a.wh,a.ow=x.naturalWidth,a.oh=x.naturalHeight,a.r=a.ow/a.oh,a.ow>a.ww||a.oh>a.wh?a.r>a.wr?(a.z=a.mz=a.ww/a.ow,a.l=0,a.w=a.ww,a.h=a.w/a.r,a.t=(a.wh-a.h)/2):(a.z=a.mz=a.wh/a.oh,a.t=0,a.h=a.wh,a.w=a.h*a.r,a.l=(a.ww-a.w)/2):(a.z=a.mz=1,a.w=a.ow,a.h=a.oh,a.l=(a.ww-a.w)/2,a.t=(a.wh-a.h)/2),P()}S.onzoomstart=function e(t){var n=t.x,o=t.y,i=a.z;this.onzoomstart=null;this.onzoomchange=s;this.onzoomend=function(t){s.call(this,t),this.onzoomchange=this.zoomend=null,this.onzoomstart=e};function s(e){var t=Math.max(Math.min(e.zoom*i,1),a.mz);t!==a.z&&(a.w=a.ow*t,a.h=a.oh*t,a.l=a.w>a.ww?Math.min(Math.max(n+(a.l-n)*t/a.z,a.ww-a.w),0):(a.ww-a.w)/2,a.t=a.h>a.wh?Math.min(Math.max(o+(a.t-o)*t/a.z,a.wh-a.h),0):(a.wh-a.h)/2,a.z=t,P())}},S.ondragstart=function e(t){var n=t.x,o=t.y,i=a.l,s=a.t;S.ondragmove=l;S.ondragend=function(t){l.call(this,t),this.ondragmove=this.ondragend=null,this.ondragstart=e};function l(e){a.w>a.ww&&(a.l=Math.min(Math.max(i+e.x-n,a.ww-a.w),0)),a.h>a.wh&&(a.t=Math.min(Math.max(s+e.y-o,a.wh-a.h),0)),P()}},f.showPhotoView=function(e,t,n){for(x.src=e;L.childNodes.length;)L.firstChild.remove();if("function"==typeof n&&t&&t.length){for(var o=0;o<t.length;o++){var i=document.createElement("a");i.href="javascript:;",i.appendChild(document.createTextNode(t[o])),i.addEventListener("click",n.bind(f,o)),L.appendChild(i)}L.style.display=""}else L.style.display="none"},f.hidePhotoView=function(){x.src="about:blank"},x.addEventListener("load",function(){E.style.visibility="inherit",self.addEventListener("resize",N),N()}),x.addEventListener("error",function(){E.style.visibility="",self.removeEventListener("resize",N)}),f.showSliderView=function(e,t,n){m.className=n||"";for(var o=0;o<e.length;o++)w.add(e[o]);t&&w.slideTo(t,!0)},f.hideSliderView=function(){w.clear()},f.alert=function(e,t){C("alert",e,t)},f.confirm=function(e,t){C("confirm",e,t)},f.htmlDialog=function(e,t,n){C(t||"",e,n)},f.closeDialog=function(e){for(self.removeEventListener("resize",q,!1),c.style.visibility="","function"==typeof o&&o(e);h.childNodes.length;)h.lastChild.remove();if(o=void 0,s.length){var t=s.shift();f[t.shift()].apply(f,t)}},f.showLoading=function(e){l.querySelector(":scope>div").lastChild.data=e||"加载中...",0===i&&(l.style.visibility="inherit",u.classList.add("mask")),i++},f.hideLoading=function(){i>0&&0===--i&&(l.style.visibility="",u.classList.remove("mask"),"function"==typeof f.dialogEvents.onloaded&&f.dialogEvents.onloaded({type:"loaded"}))},f.isLoading=function(){return i>0},f.hint=function(e,t){r.querySelector(":scope>.text").firstChild.data=e,n?clearTimeout(n):r.style.opacity=1,n=setTimeout(function(){r.style.opacity="",n=void 0},t||5e3)},f.dialogEvents={},w.onchange=function(){var e="";if(this.children.length){if(this.children.length>1)for(var t=0;t<this.children.length;t++)e+=t===this.current?"●":"○";m.style.visibility="inherit"}else m.style.visibility="";m.querySelector(":scope>.nav").firstChild.data=e},p.appendChild(f.makeSvg("times-circle-solid",1)),p.addEventListener("click",k),v.addEventListener("click",k),y.addEventListener("click",f.closeDialog),g.appendChild(f.makeSvg("times-solid",1)),b.appendChild(g.firstChild.cloneNode(!0)),g.addEventListener("click",f.hideSliderView),b.addEventListener("click",f.hidePhotoView)}()),f;function h(e,t,n){var o=t+"/"+n+"/",i=document.body.querySelector("#"+t+">.content>."+n);2===e.loaded&&"function"==typeof e.ondestory&&e.ondestory(),i.remove(),e.css&&"string"!=typeof e.css&&(e.css=f.removeCss(e.css).substr(require.toUrl(o).length)),e.js&&(o+=e.js,require.defined(o)&&(i=require(o),require.undef(o),i&&(self.Reflect?Reflect.setPrototypeOf(e,Object.prototype):e.__proto__=Object.prototype))),e.loaded=0}function p(e,t,n,o){var s,a,l;if(n&&e.alias&&(t=e.alias,e=i[e.alias]),2===e.loaded)o();else if(1!==e.loaded){e.loaded=1,n?(s=document.body.querySelector("#page"),a="page"):(s=document.body.querySelector("#popup"),a="popup"),l=a+"/"+t+"/";var r=require.toUrl(l);if("string"==typeof e.css&&(e.css=f.appendCss(r+e.css)),"html"in e){f.showLoading();var c=r+e.html,d=new XMLHttpRequest;d.open("get",c,!0),d.onreadystatechange=function(){4===this.readyState&&(200===this.status?u(this.responseText):(h(e,a,t),"dev"===VERSION||404!==this.status?y(c,this.status,n):v(n)),f.hideLoading())},d.send("")}else u("")}function u(i){if(s.querySelector(":scope>.content").insertAdjacentHTML("beforeEnd",'<div class="'+t+'">'+i+"</div>"),g(s.querySelector(":scope>.content>."+t)),"js"in e){f.showLoading();var r=l+e.js;require([r],function(t){t&&(self.Reflect?Reflect.setPrototypeOf(e,t):e.__proto__=t),e.loaded=2,o(!0),f.hideLoading()},"dev"===VERSION?void 0:function(o){h(e,a,t),o.requireType&&"scripterror"!==o.requireType&&"nodefine"!==o.requireType||o.xhr&&404!==o.xhr.status?y(r,o.message,n):v(n),f.hideLoading()})}else e.loaded=2,o(!0)}}function y(e,t,n){f.alert("加载"+e+"时发生了一个错误: "+t,n?function(){history.back()}:void 0)}function v(e){e?location.reload():f.confirm("网站已经更新, 使用该功能需要先重新加载. 是否立即刷新本页?",function(e){e&&location.reload()})}function m(e,t,n,o){e.style.visibility="inherit",n?(t.style.animationName="panelTransR1",e.style.animationName="panelTransR2"):(t.style.animationName="panelTransL1",e.style.animationName="panelTransL2"),"function"==typeof o&&g(e,function e(t){this.removeEventListener(t.type,e,!1);o()})}function g(e,t){"function"!=typeof t&&(t=w),e.addEventListener("animationend",t)}function w(e){e.target===this&&("1"===this.style.animationName.substr(this.style.animationName.length-1)?this.style.left=this.style.visibility="":this.style.left=0,this.style.animationName="")}function E(e){e.preventDefault()}function b(e){e.stopPropagation()}function x(e){e&&(f.listeners.remove(this,e.type,x),setTimeout(function(){document.body.querySelector("#popup").style.animationDuration=""},400)),document.body.addEventListener("transitionend",function(e){e.target===this&&(document.body.style.transition="")}),document.documentElement.classList.remove("loading")}});
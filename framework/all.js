"use strict";var browser,requirejs,require,define;try{sessionStorage.setItem("test",1),sessionStorage.removeItem("test")}catch(e){Storage.prototype.setItem=function(){}}browser=function(){function e(e){var t=.125,i=e/320;return i>1&&(i=Math.floor(Math.sqrt(i)/t)*t),i}var t,i,n,r,o,a={platform:"unknown",name:"unsupported",version:0};return navigator.userAgent.match(/Android/)?(a.platform="Android",(t=navigator.userAgent.match(/(Chrome|Firefox)\/([\d\.]+)/))&&(a.name=t[1],a.version=t[2])):(t=navigator.userAgent.match(/(iPhone|iPad|iPod)(?: Touch)?; CPU(?: iPhone)? OS ([\d_\.]+)/))?(a.platform=t[1],a.name="IOS",a.version=t[2].replace(/_/g,".")):navigator.userAgent.match(/Windows/)&&(a.platform="Windows",(t=navigator.userAgent.match(/(Trident)\/([\d\.]+).+Touch/))?(a.name=t[1],a.version=t[2]):(navigator.maxTouchPoints||window.TouchEvent)&&(t=navigator.userAgent.match(/(Chrome|Firefox)\/([\d\.]+)/))&&(a.name=t[1],a.version=t[2])),navigator.userAgent.match(/QQ\/[\d\.]+/i)?a.app="QQ":navigator.userAgent.match(/micromessenger\/[\d\.]+/i)?a.app="WeChat":navigator.userAgent.match(/WeiBo/i)&&(a.app="WeiBo"),window.top===window&&("Firefox"===a.name?(i=e(Math.min(screen.width,screen.height)),document.write('<meta name="viewport" content="width='+100/i+"%, initial-scale="+i+', user-scalable=no"/>')):"Trident"===a.name?(document.write('<meta name="viewport" content="width=device-width, user-scalable=no"/>'),document.documentElement.style.zoom=e(Math.min(screen.width,screen.height))):(n=document.createElement("meta"),n.name="viewport",n.content="width=device-width, user-scalable=no",document.head.appendChild(n),r=Math.min(screen.width,screen.height),o=Math.min(window.innerWidth,window.innerHeight),r>=o*devicePixelRatio?document.documentElement.style.zoom=e(r/devicePixelRatio):(i=e(r),n.content="user-scalable=no, width="+100/i+"%, initial-scale="+i))),a}(),!function(){function e(t){var i,n;this.removeEventListener("load",e,!1),i=document.createElement("link"),n=document.createElement("link"),require.data.debug?(i.rel=n.rel="stylesheet/less",i.href=require.toUrl("site/index/index.less"),n.href=require.toUrl("site/kernel/kernel.less"),document.head.appendChild(i),i=document.createElement("script"),i.src="/fusion-mobile/framework/less.js"):(i.rel=n.rel="stylesheet",i.href=require.toUrl("site/index/index.css"),n.href=require.toUrl("site/kernel/kernel.css")),document.head.appendChild(i),document.head.appendChild(n)}var t=document.createElement("script");t.src="/fusion-mobile/framework/require-config.js?"+(new Date).valueOf(),t.addEventListener("load",e,!1),document.head.appendChild(t),window.addEventListener("load",function(){require(["site/index/index"])},!1)}(),"SVGElement"in self&&!("classList"in SVGElement)&&!function(e){var t,i="classList",n="prototype",r=e.SVGElement[n],o=Object,a=String[n].trim||function(){return this.replace(/^\s+|\s+$/g,"")},s=Array[n].indexOf||function(e){for(var t=0,i=this.length;i>t;t++)if(t in this&&this[t]===e)return t;return-1},c=function(e,t){this.name=e,this.code=DOMException[e],this.message=t},u=function(e,t){if(""===t)throw new c("SYNTAX_ERR","An invalid or illegal string was specified");if(/\s/.test(t))throw new c("INVALID_CHARACTER_ERR","String contains an invalid character");return s.call(e,t)},d=function(e){for(var t=a.call(e.getAttribute("class")||""),i=t?t.split(/\s+/):[],n=0,r=i.length;r>n;n++)this.push(i[n]);this._updateClassName=function(){e.setAttribute("class",""+this)}},l=d[n]=[],p=function(){return new d(this)};c[n]=Error[n],l.item=function(e){return this[e]||null},l.contains=function(e){return e+="",-1!==u(this,e)},l.add=function(){var e,t=arguments,i=0,n=t.length,r=!1;do e=t[i]+"",-1===u(this,e)&&(this.push(e),r=!0);while(++i<n);r&&this._updateClassName()},l.remove=function(){var e,t,i=arguments,n=0,r=i.length,o=!1;do e=i[n]+"",t=u(this,e),-1!==t&&(this.splice(t,1),o=!0);while(++n<r);o&&this._updateClassName()},l.toggle=function(e,t){e+="";var i=this.contains(e),n=i?t!==!0&&"remove":t!==!1&&"add";return n&&this[n](e),!i},l.toString=function(){return this.join(" ")},o.defineProperty?(t={get:p,enumerable:!0,configurable:!0},o.defineProperty(r,i,t)):o[n].__defineGetter__&&r.__defineGetter__(i,p)}(self),function(global){function commentReplace(e,t,i,n){return n||""}function isFunction(e){return"[object Function]"===ostring.call(e)}function isArray(e){return"[object Array]"===ostring.call(e)}function each(e,t){if(e){var i;for(i=0;i<e.length&&(!e[i]||!t(e[i],i,e));i+=1);}}function eachReverse(e,t){if(e){var i;for(i=e.length-1;i>-1&&(!e[i]||!t(e[i],i,e));i-=1);}}function hasProp(e,t){return hasOwn.call(e,t)}function getOwn(e,t){return hasProp(e,t)&&e[t]}function eachProp(e,t){var i;for(i in e)if(hasProp(e,i)&&t(e[i],i))break}function mixin(e,t,i,n){return t&&eachProp(t,function(t,r){!i&&hasProp(e,r)||(!n||"object"!=typeof t||!t||isArray(t)||isFunction(t)||t instanceof RegExp?e[r]=t:(e[r]||(e[r]={}),mixin(e[r],t,i,n)))}),e}function bind(e,t){return function(){return t.apply(e,arguments)}}function scripts(){return document.getElementsByTagName("script")}function defaultOnError(e){throw e}function getGlobal(e){if(!e)return e;var t=global;return each(e.split("."),function(e){t=t[e]}),t}function makeError(e,t,i,n){var r=Error(t+"\nhttp://requirejs.org/docs/errors.html#"+e);return r.requireType=e,r.requireModules=n,i&&(r.originalError=i),r}function newContext(e){function t(e){var t,i;for(t=0;t<e.length;t++)if(i=e[t],"."===i)e.splice(t,1),t-=1;else if(".."===i){if(0===t||1===t&&".."===e[2]||".."===e[t-1])continue;t>0&&(e.splice(t-1,2),t-=2)}}function i(e,i,n){var r,o,a,s,c,u,d,l,p,h,f,m,g=i&&i.split("/"),v=y.map,x=v&&v["*"];if(e&&(e=e.split("/"),d=e.length-1,y.nodeIdCompat&&jsSuffixRegExp.test(e[d])&&(e[d]=e[d].replace(jsSuffixRegExp,"")),"."===e[0].charAt(0)&&g&&(m=g.slice(0,g.length-1),e=m.concat(e)),t(e),e=e.join("/")),n&&v&&(g||x)){a=e.split("/");e:for(s=a.length;s>0;s-=1){if(u=a.slice(0,s).join("/"),g)for(c=g.length;c>0;c-=1)if(o=getOwn(v,g.slice(0,c).join("/")),o&&(o=getOwn(o,u))){l=o,p=s;break e}!h&&x&&getOwn(x,u)&&(h=getOwn(x,u),f=s)}!l&&h&&(l=h,p=f),l&&(a.splice(0,p,l),e=a.join("/"))}return r=getOwn(y.pkgs,e),r?r:e}function n(e){isBrowser&&each(scripts(),function(t){return t.getAttribute("data-requiremodule")===e&&t.getAttribute("data-requirecontext")===w.contextName?(t.parentNode.removeChild(t),!0):void 0})}function r(e){var t=getOwn(y.paths,e);return t&&isArray(t)&&t.length>1?(t.shift(),w.require.undef(e),w.makeRequire(null,{skipMap:!0})([e]),!0):void 0}function o(e){var t,i=e?e.indexOf("!"):-1;return i>-1&&(t=e.substring(0,i),e=e.substring(i+1,e.length)),[t,e]}function a(e,t,n,r){var a,s,c,u,d=null,l=t?t.name:null,p=e,h=!0,f="";return e||(h=!1,e="_@r"+(j+=1)),u=o(e),d=u[0],e=u[1],d&&(d=i(d,l,r),s=getOwn(A,d)),e&&(d?f=s&&s.normalize?s.normalize(e,function(e){return i(e,l,r)}):-1===e.indexOf("!")?i(e,l,r):e:(f=i(e,l,r),u=o(f),d=u[0],f=u[1],n=!0,a=w.nameToUrl(f))),c=!d||s||n?"":"_unnormalized"+(C+=1),{prefix:d,name:f,parentMap:t,unnormalized:!!c,url:a,originalName:p,isDefine:h,id:(d?d+"!"+f:f)+c}}function s(e){var t=e.id,i=getOwn(S,t);return i||(i=S[t]=new w.Module(e)),i}function c(e,t,i){var n=e.id,r=getOwn(S,n);!hasProp(A,n)||r&&!r.defineEmitComplete?(r=s(e),r.error&&"error"===t?i(r.error):r.on(t,i)):"defined"===t&&i(A[n])}function u(e,t){var i=e.requireModules,n=!1;t?t(e):(each(i,function(t){var i=getOwn(S,t);i&&(i.error=e,i.events.error&&(n=!0,i.emit("error",e)))}),n||req.onError(e))}function d(){globalDefQueue.length&&(each(globalDefQueue,function(e){var t=e[0];"string"==typeof t&&(w.defQueueMap[t]=!0),O.push(e)}),globalDefQueue=[])}function l(e){delete S[e],delete k[e]}function p(e,t,i){var n=e.map.id;e.error?e.emit("error",e.error):(t[n]=!0,each(e.depMaps,function(n,r){var o=n.id,a=getOwn(S,o);!a||e.depMatched[r]||i[o]||(getOwn(t,o)?(e.defineDep(r,A[o]),e.check()):p(a,t,i))}),i[n]=!0)}function h(){var e,t,i=1e3*y.waitSeconds,o=i&&w.startTime+i<(new Date).getTime(),a=[],s=[],c=!1,d=!0;if(!x){if(x=!0,eachProp(k,function(e){var i=e.map,u=i.id;if(e.enabled&&(i.isDefine||s.push(e),!e.error))if(!e.inited&&o)r(u)?(t=!0,c=!0):(a.push(u),n(u));else if(!e.inited&&e.fetched&&i.isDefine&&(c=!0,!i.prefix))return d=!1}),o&&a.length)return e=makeError("timeout","Load timeout for modules: "+a,null,a),e.contextName=w.contextName,u(e);d&&each(s,function(e){p(e,{},{})}),o&&!t||!c||!isBrowser&&!isWebWorker||q||(q=setTimeout(function(){q=0,h()},50)),x=!1}}function f(e){hasProp(A,e[0])||s(a(e[0],null,!0)).init(e[1],e[2])}function m(e,t,i,n){e.detachEvent&&!isOpera?n&&e.detachEvent(n,t):e.removeEventListener(i,t,!1)}function g(e){var t=e.currentTarget||e.srcElement;return m(t,w.onScriptLoad,"load","onreadystatechange"),m(t,w.onScriptError,"error"),{node:t,id:t&&t.getAttribute("data-requiremodule")}}function v(){var e;for(d();O.length;){if(e=O.shift(),null===e[0])return u(makeError("mismatch","Mismatched anonymous define() module: "+e[e.length-1]));f(e)}w.defQueueMap={}}var x,b,w,E,q,y={waitSeconds:7,baseUrl:"./",paths:{},bundles:{},pkgs:{},shim:{},config:{}},S={},k={},M={},O=[],A={},P={},R={},j=1,C=1;return E={require:function(e){return e.require?e.require:e.require=w.makeRequire(e.map)},exports:function(e){return e.usingExports=!0,e.map.isDefine?e.exports?A[e.map.id]=e.exports:e.exports=A[e.map.id]={}:void 0},module:function(e){return e.module?e.module:e.module={id:e.map.id,uri:e.map.url,config:function(){return getOwn(y.config,e.map.id)||{}},exports:e.exports||(e.exports={})}}},b=function(e){this.events=getOwn(M,e.id)||{},this.map=e,this.shim=getOwn(y.shim,e.id),this.depExports=[],this.depMaps=[],this.depMatched=[],this.pluginMaps={},this.depCount=0},b.prototype={init:function(e,t,i,n){n=n||{},this.inited||(this.factory=t,i?this.on("error",i):this.events.error&&(i=bind(this,function(e){this.emit("error",e)})),this.depMaps=e&&e.slice(0),this.errback=i,this.inited=!0,this.ignore=n.ignore,n.enabled||this.enabled?this.enable():this.check())},defineDep:function(e,t){this.depMatched[e]||(this.depMatched[e]=!0,this.depCount-=1,this.depExports[e]=t)},fetch:function(){if(!this.fetched){this.fetched=!0,w.startTime=(new Date).getTime();var e=this.map;return this.shim?void w.makeRequire(this.map,{enableBuildCallback:!0})(this.shim.deps||[],bind(this,function(){return e.prefix?this.callPlugin():this.load()})):e.prefix?this.callPlugin():this.load()}},load:function(){var e=this.map.url;P[e]||(P[e]=!0,w.load(this.map.id,e))},check:function(){var e,t,i,n,r,o,a;if(this.enabled&&!this.enabling)if(i=this.map.id,n=this.depExports,r=this.exports,o=this.factory,this.inited){if(this.error)this.emit("error",this.error);else if(!this.defining){if(this.defining=!0,this.depCount<1&&!this.defined){if(isFunction(o)){if(this.events.error&&this.map.isDefine||req.onError!==defaultOnError)try{r=w.execCb(i,o,n,r)}catch(t){e=t}else r=w.execCb(i,o,n,r);if(this.map.isDefine&&void 0===r&&(t=this.module,t?r=t.exports:this.usingExports&&(r=this.exports)),e)return e.requireMap=this.map,e.requireModules=this.map.isDefine?[this.map.id]:null,e.requireType=this.map.isDefine?"define":"require",u(this.error=e)}else r=o;this.exports=r,this.map.isDefine&&!this.ignore&&(A[i]=r,req.onResourceLoad&&(a=[],each(this.depMaps,function(e){a.push(e.normalizedMap||e)}),req.onResourceLoad(w,this.map,a))),l(i),this.defined=!0}this.defining=!1,this.defined&&!this.defineEmitted&&(this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=!0)}}else hasProp(w.defQueueMap,i)||this.fetch()},callPlugin:function(){var e=this.map,t=e.id,n=a(e.prefix);this.depMaps.push(n),c(n,"defined",bind(this,function(n){var r,o,d,p=getOwn(R,this.map.id),h=this.map.name,f=this.map.parentMap?this.map.parentMap.name:null,m=w.makeRequire(e.parentMap,{enableBuildCallback:!0});return this.map.unnormalized?(n.normalize&&(h=n.normalize(h,function(e){return i(e,f,!0)})||""),o=a(e.prefix+"!"+h,this.map.parentMap),c(o,"defined",bind(this,function(e){this.map.normalizedMap=o,this.init([],function(){return e},null,{enabled:!0,ignore:!0})})),d=getOwn(S,o.id),void(d&&(this.depMaps.push(o),this.events.error&&d.on("error",bind(this,function(e){this.emit("error",e)})),d.enable()))):p?(this.map.url=w.nameToUrl(p),void this.load()):(r=bind(this,function(e){this.init([],function(){return e},null,{enabled:!0})}),r.error=bind(this,function(e){this.inited=!0,this.error=e,e.requireModules=[t],eachProp(S,function(e){0===e.map.id.indexOf(t+"_unnormalized")&&l(e.map.id)}),u(e)}),r.fromText=bind(this,function(i,n){var o=e.name,c=a(o),d=useInteractive;n&&(i=n),d&&(useInteractive=!1),s(c),hasProp(y.config,t)&&(y.config[o]=y.config[t]);try{req.exec(i)}catch(e){return u(makeError("fromtexteval","fromText eval for "+t+" failed: "+e,e,[t]))}d&&(useInteractive=!0),this.depMaps.push(c),w.completeLoad(o),m([o],r)}),void n.load(e.name,m,r,y))})),w.enable(n,this),this.pluginMaps[n.id]=n},enable:function(){k[this.map.id]=this,this.enabled=!0,this.enabling=!0,each(this.depMaps,bind(this,function(e,t){var i,n,r;if("string"==typeof e){if(e=a(e,this.map.isDefine?this.map:this.map.parentMap,!1,!this.skipMap),this.depMaps[t]=e,r=getOwn(E,e.id))return void(this.depExports[t]=r(this));this.depCount+=1,c(e,"defined",bind(this,function(e){this.undefed||(this.defineDep(t,e),this.check())})),this.errback?c(e,"error",bind(this,this.errback)):this.events.error&&c(e,"error",bind(this,function(e){this.emit("error",e)}))}i=e.id,n=S[i],hasProp(E,i)||!n||n.enabled||w.enable(e,this)})),eachProp(this.pluginMaps,bind(this,function(e){var t=getOwn(S,e.id);t&&!t.enabled&&w.enable(e,this)})),this.enabling=!1,this.check()},on:function(e,t){var i=this.events[e];i||(i=this.events[e]=[]),i.push(t)},emit:function(e,t){each(this.events[e],function(e){e(t)}),"error"===e&&delete this.events[e]}},w={config:y,contextName:e,registry:S,defined:A,urlFetched:P,defQueue:O,defQueueMap:{},Module:b,makeModuleMap:a,nextTick:req.nextTick,onError:u,configure:function(e){var t,i,n;e.baseUrl&&"/"!==e.baseUrl.charAt(e.baseUrl.length-1)&&(e.baseUrl+="/"),"string"==typeof e.urlArgs&&(t=e.urlArgs,e.urlArgs=function(e,i){return(-1===i.indexOf("?")?"?":"&")+t}),i=y.shim,n={paths:!0,bundles:!0,config:!0,map:!0},eachProp(e,function(e,t){n[t]?(y[t]||(y[t]={}),mixin(y[t],e,!0,!0)):y[t]=e}),e.bundles&&eachProp(e.bundles,function(e,t){each(e,function(e){e!==t&&(R[e]=t)})}),e.shim&&(eachProp(e.shim,function(e,t){isArray(e)&&(e={deps:e}),!e.exports&&!e.init||e.exportsFn||(e.exportsFn=w.makeShimExports(e)),i[t]=e}),y.shim=i),e.packages&&each(e.packages,function(e){var t,i;e="string"==typeof e?{name:e}:e,i=e.name,t=e.location,t&&(y.paths[i]=e.location),y.pkgs[i]=e.name+"/"+(e.main||"main").replace(currDirRegExp,"").replace(jsSuffixRegExp,"")}),eachProp(S,function(e,t){e.inited||e.map.unnormalized||(e.map=a(t,null,!0))}),(e.deps||e.callback)&&w.require(e.deps||[],e.callback)},makeShimExports:function(e){function t(){var t;return e.init&&(t=e.init.apply(global,arguments)),t||e.exports&&getGlobal(e.exports)}return t},makeRequire:function(t,r){function o(i,n,c){var d,l,p;return r.enableBuildCallback&&n&&isFunction(n)&&(n.__requireJsBuild=!0),"string"==typeof i?isFunction(n)?u(makeError("requireargs","Invalid require call"),c):t&&hasProp(E,i)?E[i](S[t.id]):req.get?req.get(w,i,t,o):(l=a(i,t,!1,!0),d=l.id,hasProp(A,d)?A[d]:u(makeError("notloaded",'Module name "'+d+'" has not been loaded yet for context: '+e+(t?"":". Use require([])")))):(v(),w.nextTick(function(){v(),p=s(a(null,t)),p.skipMap=r.skipMap,p.init(i,n,c,{enabled:!0}),h()}),o)}return r=r||{},mixin(o,{isBrowser:isBrowser,toUrl:function(e){var n,r=e.lastIndexOf("."),o=e.split("/")[0],a="."===o||".."===o;return-1!==r&&(!a||r>1)&&(n=e.substring(r,e.length),e=e.substring(0,r)),w.nameToUrl(i(e,t&&t.id,!0),n,!0)},defined:function(e){return hasProp(A,a(e,t,!1,!0).id)},specified:function(e){return e=a(e,t,!1,!0).id,hasProp(A,e)||hasProp(S,e)}}),t||(o.undef=function(e){d();var i=a(e,t,!0),r=getOwn(S,e);r.undefed=!0,n(e),delete A[e],delete P[i.url],delete M[e],eachReverse(O,function(t,i){t[0]===e&&O.splice(i,1)}),delete w.defQueueMap[e],r&&(r.events.defined&&(M[e]=r.events),l(e))}),o},enable:function(e){var t=getOwn(S,e.id);t&&s(e).enable()},completeLoad:function(e){var t,i,n,o=getOwn(y.shim,e)||{},a=o.exports;for(d();O.length;){if(i=O.shift(),null===i[0]){if(i[0]=e,t)break;t=!0}else i[0]===e&&(t=!0);f(i)}if(w.defQueueMap={},n=getOwn(S,e),!t&&!hasProp(A,e)&&n&&!n.inited){if(!(!y.enforceDefine||a&&getGlobal(a)))return r(e)?void 0:u(makeError("nodefine","No define call for "+e,null,[e]));f([e,o.deps||[],o.exportsFn])}h()},nameToUrl:function(e,t,i){var n,r,o,a,s,c,u,d=getOwn(y.pkgs,e);if(d&&(e=d),u=getOwn(R,e))return w.nameToUrl(u,t,i);if(req.jsExtRegExp.test(e))s=e+(t||"");else{for(n=y.paths,r=e.split("/"),o=r.length;o>0;o-=1)if(a=r.slice(0,o).join("/"),c=getOwn(n,a)){isArray(c)&&(c=c[0]),r.splice(0,o,c);break}s=r.join("/"),s+=t||(/^data\:|^blob\:|\?/.test(s)||i?"":".js"),s=("/"===s.charAt(0)||s.match(/^[\w\+\.\-]+:/)?"":y.baseUrl)+s}return y.urlArgs&&!/^blob\:/.test(s)?s+y.urlArgs(e,s):s},load:function(e,t){req.load(w,e,t)},execCb:function(e,t,i,n){return t.apply(n,i)},onScriptLoad:function(e){if("load"===e.type||readyRegExp.test((e.currentTarget||e.srcElement).readyState)){interactiveScript=null;var t=g(e);w.completeLoad(t.id)}},onScriptError:function(e){var t,i=g(e);return r(i.id)?void 0:(t=[],eachProp(S,function(e,n){0!==n.indexOf("_@r")&&each(e.depMaps,function(e){return e.id===i.id?(t.push(n),!0):void 0})}),u(makeError("scripterror",'Script error for "'+i.id+(t.length?'", needed by: '+t.join(", "):'"'),e,[i.id])))}},w.require=w.makeRequire(),w}function getInteractiveScript(){return interactiveScript&&"interactive"===interactiveScript.readyState?interactiveScript:(eachReverse(scripts(),function(e){return"interactive"===e.readyState?interactiveScript=e:void 0}),interactiveScript)}var req,s,head,baseElement,dataMain,src,interactiveScript,currentlyAddingScript,mainScript,subPath,version="2.2.0",commentRegExp=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,cjsRequireRegExp=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,jsSuffixRegExp=/\.js$/,currDirRegExp=/^\.\//,op=Object.prototype,ostring=op.toString,hasOwn=op.hasOwnProperty,isBrowser=!("undefined"==typeof window||"undefined"==typeof navigator||!window.document),isWebWorker=!isBrowser&&"undefined"!=typeof importScripts,readyRegExp=isBrowser&&"PLAYSTATION 3"===navigator.platform?/^complete$/:/^(complete|loaded)$/,defContextName="_",isOpera="undefined"!=typeof opera&&""+opera=="[object Opera]",contexts={},cfg={},globalDefQueue=[],useInteractive=!1;if(void 0===define){if(void 0!==requirejs){if(isFunction(requirejs))return;cfg=requirejs,requirejs=void 0}void 0===require||isFunction(require)||(cfg=require,require=void 0),req=requirejs=function(e,t,i,n){var r,o,a=defContextName;return isArray(e)||"string"==typeof e||(o=e,isArray(t)?(e=t,t=i,i=n):e=[]),o&&o.context&&(a=o.context),r=getOwn(contexts,a),r||(r=contexts[a]=req.s.newContext(a)),o&&r.configure(o),r.require(e,t,i)},req.config=function(e){return req(e)},req.nextTick="undefined"!=typeof setTimeout?function(e){setTimeout(e,4)}:function(e){e()},require||(require=req),req.version=version,req.jsExtRegExp=/^\/|:|\?|\.js$/,req.isBrowser=isBrowser,s=req.s={contexts:contexts,newContext:newContext},req({}),each(["toUrl","undef","defined","specified"],function(e){req[e]=function(){var t=contexts[defContextName];return t.require[e].apply(t,arguments)}}),isBrowser&&(head=s.head=document.getElementsByTagName("head")[0],baseElement=document.getElementsByTagName("base")[0],baseElement&&(head=s.head=baseElement.parentNode)),req.onError=defaultOnError,req.createNode=function(e,t,i){var n=e.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script");return n.type=e.scriptType||"text/javascript",n.charset="utf-8",n.async=!0,n},req.load=function(e,t,i){var n,r=e&&e.config||{};if(isBrowser)return n=req.createNode(r,t,i),n.setAttribute("data-requirecontext",e.contextName),n.setAttribute("data-requiremodule",t),!n.attachEvent||n.attachEvent.toString&&(""+n.attachEvent).indexOf("[native code")<0||isOpera?(n.addEventListener("load",e.onScriptLoad,!1),n.addEventListener("error",e.onScriptError,!1)):(useInteractive=!0,n.attachEvent("onreadystatechange",e.onScriptLoad)),n.src=i,r.onNodeCreated&&r.onNodeCreated(n,r,t,i),currentlyAddingScript=n,baseElement?head.insertBefore(n,baseElement):head.appendChild(n),currentlyAddingScript=null,n;if(isWebWorker)try{setTimeout(function(){},0),importScripts(i),e.completeLoad(t)}catch(n){e.onError(makeError("importscripts","importScripts failed for "+t+" at "+i,n,[t]))}},isBrowser&&!cfg.skipDataMain&&eachReverse(scripts(),function(e){return head||(head=e.parentNode),dataMain=e.getAttribute("data-main"),dataMain?(mainScript=dataMain,cfg.baseUrl||-1!==mainScript.indexOf("!")||(src=mainScript.split("/"),mainScript=src.pop(),subPath=src.length?src.join("/")+"/":"./",cfg.baseUrl=subPath),mainScript=mainScript.replace(jsSuffixRegExp,""),req.jsExtRegExp.test(mainScript)&&(mainScript=dataMain),cfg.deps=cfg.deps?cfg.deps.concat(mainScript):[mainScript],!0):void 0}),define=function(e,t,i){var n,r;"string"!=typeof e&&(i=t,t=e,e=null),isArray(t)||(i=t,t=null),!t&&isFunction(i)&&(t=[],i.length&&((""+i).replace(commentRegExp,commentReplace).replace(cjsRequireRegExp,function(e,i){t.push(i)}),t=(1===i.length?["require"]:["require","exports","module"]).concat(t))),useInteractive&&(n=currentlyAddingScript||getInteractiveScript(),n&&(e||(e=n.getAttribute("data-requiremodule")),r=contexts[n.getAttribute("data-requirecontext")])),r?(r.defQueue.push([e,t,i]),r.defQueueMap[e]=!0):globalDefQueue.push([e,t,i])},define.amd={jQuery:!0},req.exec=function(text){return eval(text)},req(cfg)}}(this);
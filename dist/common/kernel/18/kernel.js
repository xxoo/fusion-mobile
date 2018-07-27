'use strict';var _typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&'function'==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?'symbol':typeof a};define(['common/touchslider/touchslider','common/touchguesture/touchguesture','common/pointerevents/pointerevents','common/svgicos/svgicos','site/pages/pages','site/popups/popups'],function(a,b,c,d,e,f){function g(a,b,c){var d=b+'/'+c+'/',e=document.querySelector('#'+b+'>.content>.'+c);2===a.loaded&&'function'==typeof a.ondestory&&a.ondestory(),e.parentNode.removeChild(e),a.css&&'string'!=typeof a.css&&(a.css=s.removeCss(a.css).substr(require.toUrl(d).length)),a.js&&(d+=a.js,require.defined(d)&&(e=require(d),require.undef(d),e&&(window.Reflect?Reflect.setPrototypeOf(a,Object.prototype):a.__proto__=Object.prototype))),a.loaded=0}function h(a,b,c,d){function f(e){var f;k.querySelector(':scope>.content').insertAdjacentHTML('beforeEnd','<div class="'+b+'">'+e+'</div>'),l(k.querySelector(':scope>.content>.'+b)),'js'in a?(s.showLoading(),f=p+a.js,'dev'===VERSION?require([f],h):require([f],h,function(d){g(a,o,b),d.requireType&&'scripterror'!==d.requireType&&'nodefine'!==d.requireType||d.xhr&&404!==d.xhr.status?i(f,d.message,c):j(c),s.hideLoading()})):(a.loaded=2,d(!0))}function h(b){b&&(window.Reflect?Reflect.setPrototypeOf(a,b):a.__proto__=b),a.loaded=2,d(!0),s.hideLoading()}var k,o,p,q,r,t;c&&a.alias&&(b=a.alias,a=e[a.alias]),2===a.loaded?d():1!==a.loaded&&(a.loaded=1,c?(k=document.getElementById('page'),o='page'):(k=document.getElementById('popup'),o='popup'),p=o+'/'+b+'/',q=require.toUrl(p),'string'==typeof a.css&&(a.css=s.appendCss(q+a.css)),'html'in a?(s.showLoading(),r=q+a.html,t=new XMLHttpRequest,t.open('get',r,!0),t.onreadystatechange=function(){4===this.readyState&&(200===this.status?f(this.responseText):(g(a,o,b),'dev'===VERSION||404!==this.status?i(r,this.status,c):j(c)),s.hideLoading())},t.send('')):f(''))}function i(a,b,c){s.alert('\u52A0\u8F7D'+a+'\u65F6\u53D1\u751F\u4E86\u4E00\u4E2A\u9519\u8BEF: '+b,c?function(){history.back()}:void 0)}function j(a){a?location.reload():s.confirm('\u7F51\u7AD9\u5DF2\u7ECF\u66F4\u65B0, \u4F7F\u7528\u8BE5\u529F\u80FD\u9700\u8981\u5148\u91CD\u65B0\u52A0\u8F7D. \u662F\u5426\u7ACB\u5373\u5237\u65B0\u672C\u9875?',function(a){a&&location.reload()})}function k(a,b,c,d){function e(a){this.removeEventListener(a.type,e,!1),d()}a.style.visibility='inherit',c?(b.style.animationName='panelTransR1',a.style.animationName='panelTransR2'):(b.style.animationName='panelTransL1',a.style.animationName='panelTransL2'),'function'==typeof d&&l(a,e)}function l(a,b){'function'!=typeof b&&(b=m),a.addEventListener('animationend',b)}function m(a){a.target===this&&(this.style.right='1'===this.style.animationName.substr(this.style.animationName.length-1)?this.style.visibility='':0,this.style.animationName='')}function n(a,b){for(;e[a].back;)if(a=e[a].back,a===b)return!0}function o(){s.hideReadable(),s.closePopup()}function p(a){a.preventDefault()}function q(a){a.stopPropagation()}function r(a){a&&(s.listeners.remove(this,a.type,r),setTimeout(function(){document.querySelector('#popup').style.animationDuration=''},400)),document.body.addEventListener('transitionend',function(a){a.target===this&&(document.body.style.transition='')}),document.documentElement.classList.remove('loading')}var t,s={appendCss:function c(a){var b=document.createElement('link');return /\.less$/.test(a)?window.less?(b.rel='stylesheet/less',b.href=a,less.sheets.push(b),less.refresh()):(b.rel='stylesheet',b.href=a.replace(/less$/,'css')):(b.rel='stylesheet',b.href=a),document.head.appendChild(b)},removeCss:function b(a){return document.head.removeChild(a),'stylesheet/less'===a.rel&&(less.sheets.splice(less.sheets.indexOf(a),1),less.refresh()),a.getAttribute('href')},makeSvg:function d(a,b){var c=document.createElementNS('http://www.w3.org/2000/svg','svg');return c.appendChild(document.createElementNS('http://www.w3.org/2000/svg','path')),a&&s.setSvgPath(c,a,b),c},setSvgPath:function g(a,b,c){var e,f=s.makeSvg();d.hasOwnProperty(b)&&(b=d[b]),a.firstChild.setAttribute('d',b),f.style.position='absolute',f.style.bottom=f.style.right='100%',f.firstChild.setAttribute('d',b),document.body.appendChild(f),e=f.firstChild.getBBox(),document.body.removeChild(f),2==c?(e.width+=2*e.x,e.x=0,e.height+=2*e.y,e.y=0):c&&(e.width>e.height?(e.y-=(e.width-e.height)/2,e.height=e.width):(e.x-=(e.height-e.width)/2,e.width=e.height)),a.setAttribute('viewBox',e.x+' '+e.y+' '+e.width+' '+e.height)},buildHash:function d(a){var b,c='#!'+encodeURIComponent(a.id);for(b in a.args)c+=void 0===a.args[b]?'&'+encodeURIComponent(b):'&'+encodeURIComponent(b)+'='+encodeURIComponent(a.args[b]);return c},parseHash:function h(b){var c,d,f,g={id:t,args:{}};if(b=b.substr(1).replace(/[#\?].*$/,''),f=b.match(/[^=&]+(=[^&]*)?/g),f)for('!'===f[0].charAt(0)&&(d=f[0].substr(1),(d in e)&&(g.id=decodeURIComponent(d))),c=1;c<f.length;c++)d=f[c].match(/^([^=]+)(=)?(.+)?$/),d&&(g.args[decodeURIComponent(d[1])]=d[2]?decodeURIComponent(d[3]||''):void 0);return g},getDefaultBack:function g(a){var b,c,d,f;if(a||(a=s.location),d=e[a.id].backLoc,e[a.id].back&&e[e[a.id].back]&&(f={id:e[a.id].back,args:{}},c=e[e[a.id].back].alias?e[e[e[a.id].back].alias]:e[e[a.id].back],c.args))for(b=0;b<c.args.length;b++)c.args[b]in a.args&&(f.args[c.args[b]]=a.args[c.args[b]]);if(d&&f){for(b in f.args)if(f.args[b]!==d.args[b])return f;return d}return d||f},isSameLocation:function d(a,b){if(a.id===b.id&&Object.keys(a.args).length===Object.keys(b.args).length){for(var c in a.args){if(!(c in b.args))return!1;if(void 0===a.args[c]){if(a.args[c]!==b.args[c])return!1;}else if(''+a.args[c]!=''+b.args[c])return!1}return!0}return!1},replaceLocation:function b(a){s.location&&s.isSameLocation(a,s.location)?s.reloadPage():location.replace(s.buildHash(a))},isGoingback:function c(a,b){return b===t||n(a,b)},dataType:function c(b){var a='undefined'==typeof b?'undefined':_typeof(b);return'boolean'===a||'string'===a||'symbol'===a||'number'===a||'function'===a||'undefined'===a?a:(a=Object.prototype.toString.call(b).replace(/^\[object |\]$/g,'').toLowerCase(),'date'===a||'array'===a||'regexp'===a||'error'===a||'null'===a?a:'object')}};return!function(){function a(a,b){var c,d;for(a.xEvents[b.type].locked=!0,c=0;c<a.xEvents[b.type].length;c++)a.xEvents[b.type][c].call(a,b);for(a.xEvents[b.type].locked=!1;a.xEvents[b.type].stack.length;)a.xEvents[b.type].stack[0]?(d=a.xEvents[b.type].indexOf(a.xEvents[b.type].stack[0][1]),a.xEvents[b.type].stack[0][0]?0<=d&&a.xEvents[b.type].splice(d,1):0>d&&a.xEvents[b.type].push(a.xEvents[b.type].stack[0][1])):a.xEvents[b.type].splice(0,a.xEvents[b.type].length),a.xEvents[b.type].stack.shift();if(a.xEvents[b.type].length||(delete a.xEvents[b.type],a['on'+b.type]=null),a.xEvents.removeMark){for(c in delete a.xEvents.removeMark,a.xEvents)delete a.xEvents[c],a['on'+c]=null;delete a.xEvents}}s.listeners={add:function e(b,c,d){b.xEvents||(b.xEvents=function(c){a(b,c)}),b.xEvents[c]||(b.xEvents[c]=[],b.xEvents[c].stack=[],b.xEvents[c].locked=!1,b['on'+c]=b.xEvents),b.xEvents[c].locked?b.xEvents[c].stack.push([!1,d]):0>b.xEvents[c].indexOf(d)&&b.xEvents[c].push(d)},list:function e(a,b){var c,d;if(b)c=a.xEvents&&a.xEvents[b]?a.xEvents[b].slice(0):[];else if(c={},a.xEvents)for(d in a.xEvents)'array'===s.dataType(a.xEvents[d])&&a.xEvents[d].length&&(c[d]=a.xEvents[d].slice(0));return c},remove:function g(a,b,c){var d,e,f;if(a.xEvents)if(b)a.xEvents[b]&&(a.xEvents[b].locked?c?a.xEvents[b].stack.push([!0,c]):a.xEvents[b].stack.push(null):c?(f=a.xEvents[b].indexOf(c),0<=f&&a.xEvents[b].splice(f,1)):a.xEvents[b].splice(0,a.xEvents[b].length),0===a.xEvents[b].length&&(delete a.xEvents[b],a['on'+b]=null));else if(!a.xEvents.removeMark){for(d in a.xEvents)a.xEvents[d].locked?e=!0:(delete a.xEvents[d],a['on'+d]=null);e?a.xEvents.removeMark=!0:delete a.xEvents}}}}(),!function(){function a(){0===this.scrollTop?this.scrollTop=1:this.scrollTop+this.clientHeight===this.scrollHeight&&(this.scrollTop-=1)}s.scrollReload=function(a,b){s.fixIosScrolling(a);var d,e,f,g,i=c(a,function(c){function j(b){b.target!==a&&(g=!0,k())}function k(){window.removeEventListener('scroll',j,!0)}if('start'!==c.type){if(g)return g=!1,!0;var l;if(c.y>d+5)e||(e=!0,k()),c.domEvent.preventDefault(),f||(f=document.createElement('div'),f.className='reloadHint',f.appendChild(s.makeSvg('sync-alt-solid',1)),a.appendChild(f)),l=f.offsetHeight||f.clientHeight,c.y-d<2*l?(f.style.top=c.y-d-l+'px',f.classList.remove('pin'),f.style.opacity=(c.y-d)/l/2,f.style.transform='rotate('+360*f.style.opacity+'deg)'):(f.style.top=l+'px',f.style.opacity=1,f.classList.add('pin'),f.style.transform='');else{if(c.y<d&&!e)return!0;f&&(a.removeChild(f),f=void 0)}('end'===c.type||'cancel'===c.type)&&(f&&(a.removeChild(f),f.classList.contains('pin')&&('function'==typeof b?b():s.reloadPage()),f=void 0),e=!1)}else if(0===i.pointers.length&&(a.classList.contains('iosScrollFix')&&1===a.scrollTop||!a.classList.contains('iosScrollFix')&&0===a.scrollTop))return d=c.y,window.addEventListener('scroll',j,!0),!0})},s.fixIosScrolling=function(b,c){'IOS'===browser.name&&(b.style.webkitOverflowScrolling='touch',b.addEventListener('touchmove',q),!c&&(b.classList.add('iosScrollFix'),b.scrollTop=1,b.addEventListener('scroll',a)))},s.getScrollHeight=function(a){return a.classList.contains('iosScrollFix')?a.scrollHeight-1:a.scrollHeight},s.setScrollTop=function(a,b){a.scrollTop=a.classList.contains('iosScrollFix')?b+1:b},'IOS'===browser.name&&window.addEventListener('touchmove',p)}(),!function(){function a(){1<c.length?(c.shift(),'function'==typeof c[0]?(c[0](),a()):b(c[0])):d.style.display=''}function b(a){var b,c,d;for(f.src=a.img,('right'in a)&&(f.style.right=a.right),('left'in a)&&(f.style.left=a.left),('top'in a)&&(f.style.top=a.top),('bottom'in a)&&(f.style.bottom=a.bottom),('width'in a)&&(f.style.width=a.width),('height'in a)&&(f.style.height=a.height),d=0;d<e.childNodes.length;d++)b=e.childNodes[d],a.rows[d]?(b.style.height=a.rows[d],b.className='unflexable'):(b.style.height='auto',b.className='flexable');for(b=e.childNodes[1],d=0;d<b.childNodes.length;d++)c=b.childNodes[d],a.cells[d]?(c.style.width=a.cells[d],c.className='unflexable'):(c.style.width='auto',c.className='flexable')}var c,d=document.getElementById('helper'),e=d.firstChild,f=d.lastChild;d.addEventListener('click',a),s.showHelper=function(a){c='array'===s.dataType(a)?a:[a],b(c[0]),d.style.display='block'}}(),!function(){function a(a,b){return d&&'function'==typeof f[d].onunload&&f[d].onunload()||'function'==typeof f[a].onload&&f[a].onload(b,!d||a!==f[d].back&&a!==e)}function b(a){d&&(l.classList.remove(d),delete f[d].backParam),e=void 0,d=a,l.classList.add(d),n.data=f[a].title,document.body.classList.contains('hidePopupHeader')&&(document.title=n.data),f[a].back?(o.lastChild.data=f[f[a].back].title,o.style.display=''):o.style.display='none'}function c(c,g,h){var m,n=d;return!!a(c,g)||void(m=l.querySelector(':scope>.content>.'+d),k(l.querySelector(':scope>.content>.'+c),m,h||c===f[d].back||c===e,function(){var a;i=!1,b(c),'function'==typeof f[n].onunloadend&&f[n].onunloadend(),document.activeElement&&m.contains(document.activeElement)&&document.activeElement.blur(),'function'==typeof f[d].onloadend&&f[d].onloadend(),'function'==typeof j&&(a=j,j=void 0,a())}),i=c)}var d,e,i,j,l=document.getElementById('popup'),m=l.querySelector(':scope>.header>.close'),n=l.querySelector(':scope>.header>.title').firstChild,o=l.querySelector(':scope>.header>.back');s.openPopup=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.openPopup?window.frameElement.kernel.openPopup:function(a,b,c){var g=f[a];return g?(h(g,a,!1,function(){'function'==typeof g.open?g.open(b,!c&&(!d||a!==f[d].back&&a!==e)):s.showPopup(a,b,c)}),!0):void s.hint('popup config not found: '+a)},s.showPopup=function(g,h,k){if(i)j=function(){s.showPopup(g,h,k)};else{var m;if(!l.classList.contains('in')){if(a(g,h))return!0;m=l.querySelector(':scope>.content>.'+g),m.style.right=0,m.style.visibility='inherit',l.classList.add('in'),i=g,'function'==typeof s.popupEvents.onshow&&s.popupEvents.onshow({type:'show',id:g}),b(g),s.hideReadable()}else{if(d!==g)return c(g,h,k);'function'==typeof f[g].onload&&f[g].onload(h,!k&&(!d||g!==f[d].back&&g!==e))||'function'!=typeof f[g].onloadend||f[g].onloadend()}}},s.closePopup=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.closePopup?window.frameElement.kernel.closePopup:function(a){var b;i?j=function(){s.closePopup(a)}:(b=s.getCurrentPopup(),b&&(!a||b===a||'array'===s.dataType(a)&&0<=a.indexOf(b))&&('function'!=typeof f[b].onunload||!f[b].onunload())&&(l.classList.remove('in'),l.classList.add('out'),i=!0,delete f[b].backParam,'function'==typeof s.popupEvents.onhide&&s.popupEvents.onhide({type:'hide',id:b})))},s.getCurrentPopup=function(){if(l.classList.contains('in'))return d},s.setPopupBackParam=function(a){l.classList.contains('in')&&(f[d].backParam=a)},s.setPopupBack=function(a,b){b?b in f&&(a?(f[b].back=a,d===b&&(o.lastChild.data='function'!=typeof a&&f[a].title?f[a].title:'\u8FD4\u56DE')):(delete f[b].back,o.style.display='none')):l.classList.contains('in')&&(a?(o.lastChild.data='function'!=typeof a&&f[a].title?f[a].title:'\u8FD4\u56DE',e=a,o.style.display=''):o.style.display='none')},s.setPopupTitle=function(a,b){b?b in f&&(f[b].title=a,d===b&&(n.data=a,document.body.classList.contains('hidePopupHeader')&&(document.title=n.data))):l.classList.contains('in')&&(n.data=a,document.body.classList.contains('hidePopupHeader')&&(document.title=n.data))},s.destoryPopup=function(a){var b=f[a];b&&g(b,'popup',a)},s.popupEvents={},m.appendChild(s.makeSvg('times-light',1)),m.addEventListener('click',function(){s.closePopup()}),o.insertBefore(s.makeSvg('angle-left-light',1),o.firstChild),o.addEventListener('click',function(){'function'==typeof e?e(f[d].backParam):s.openPopup(e?e:f[d].back,f[d].backParam)}),l.addEventListener('animationend',function(a){var b;if(a.target===this&&(i=!1,this.classList.contains('out')?(this.classList.remove('out'),'function'==typeof s.popupEvents.onhideend&&s.popupEvents.onhideend({type:'hideend',id:d}),b=l.querySelector(':scope>.content>.'+d),b.style.right=b.style.visibility='','function'==typeof f[d].onunloadend&&f[d].onunloadend(),document.activeElement&&b.contains(document.activeElement)&&document.activeElement.blur(),l.classList.remove(d),d=void 0):('function'==typeof f[d].onloadend&&f[d].onloadend(),'function'==typeof s.popupEvents.onshowend&&s.popupEvents.onshowend({type:'showend',id:d})),'function'==typeof j)){var c=j;j=void 0,c()}})}(),!function(){var a,b=document.getElementById('readable'),c=b.querySelector(':scope>.close'),d=b.querySelector(':scope>.content');s.fixIosScrolling(d),s.showReadable=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.showReadable?window.frameElement.kernel.showReadable:function(c,e,f){'string'==typeof c?d.innerHTML=c:d.appendChild(c),b.className=f?'in '+f:'in',a=e},s.hideReadable=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.hideReadable?window.frameElement.kernel.hideReadable:function(){b.classList.contains('in')&&(b.classList.remove('in'),b.classList.add('out'),'function'==typeof a&&a())},s.showForeign=function(a,b){s.showReadable('<iframe frameborder="no" scrolling="auto" sandbox="allow-same-origin allow-forms allow-scripts" src="'+a+'"></iframe>',b,'foreign')},c.appendChild(s.makeSvg('times-solid',1)),c.addEventListener('click',s.hideReadable),b.addEventListener('animationend',function(a){if(a.target===this&&this.classList.contains('out')){for(;0<d.childNodes.length;)d.removeChild(d.firstChild);this.className=''}})}(),!function(){function c(){''===t.style.visibility&&''===r.style.visibility&&''===A.style.visibility&&''===D.style.visibility&&document.body.classList.remove('mask')}function d(){s.closeDialog()}function e(a,b,c){'inherit'===t.style.visibility?p.push([a,b,c]):(v.className=a,'alert'===a?w.textContent=b:'confirm'===a?'string'==typeof b?(w.textContent=b,y.textContent='\u662F',z.textContent='\u5426'):(w.textContent=b[0],y.textContent=b[1],z.textContent=b[2]):'string'==typeof b?w.innerHTML=b:w.appendChild(b),window.addEventListener('resize',f),f(),document.body.classList.add('mask'),t.style.visibility='inherit',l=c)}function f(){v.style.width=v.style.height='',v.style.left=v.style.top='20px',v.style.bottom=v.style.right='auto',v.style.width=v.offsetWidth+'px',v.style.height=v.offsetHeight+'px',v.style.left=v.style.top=v.style.bottom=v.style.right=''}function g(){F.style.width=q.w+'px',F.style.height=q.h+'px',F.style.left=q.l+'px',F.style.top=q.t+'px'}function h(){q.ww=window.innerWidth,q.wh=window.innerHeight,q.wr=q.ww/q.wh,q.ow=F.naturalWidth,q.oh=F.naturalHeight,q.r=q.ow/q.oh,q.ow>q.ww||q.oh>q.wh?q.r>q.wr?(q.z=q.mz=q.ww/q.ow,q.l=0,q.w=q.ww,q.h=q.w/q.r,q.t=(q.wh-q.h)/2):(q.z=q.mz=q.wh/q.oh,q.t=0,q.h=q.wh,q.w=q.h*q.r,q.l=(q.ww-q.w)/2):(q.z=q.mz=1,q.w=q.ow,q.h=q.oh,q.l=(q.ww-q.w)/2,q.t=(q.wh-q.h)/2),g()}function i(a){function b(a){var b=m(n(a.zoom*e,1),q.mz);b!==q.z&&(q.w=q.ow*b,q.h=q.oh*b,q.l=q.w>q.ww?n(m(c+(q.l-c)*b/q.z,q.ww-q.w),0):(q.ww-q.w)/2,q.t=q.h>q.wh?n(m(d+(q.t-d)*b/q.z,q.wh-q.h),0):(q.wh-q.h)/2,q.z=b,g())}var c=a.x,d=a.y,e=q.z;this.onzoomstart=null,this.onzoomchange=b,this.onzoomend=function(a){b.call(this,a),this.onzoomchange=this.zoomend=null,this.onzoomstart=i}}function j(a){function b(a){q.w>q.ww&&(q.l=n(m(e+a.x-c,q.ww-q.w),0)),q.h>q.wh&&(q.t=n(m(f+a.y-d,q.wh-q.h),0)),g()}var c=a.x,d=a.y,e=q.l,f=q.t;H.ondragmove=b,H.ondragend=function(a){b.call(this,a),this.ondragmove=this.ondragend=null,this.ondragstart=j}}var k,l,m=Math.max,n=Math.min,o=0,p=[],q={},r=document.getElementById('loading'),u=document.getElementById('hint'),t=document.getElementById('dialog'),v=t.querySelector(':scope>div'),w=v.querySelector(':scope>.content'),x=v.querySelector(':scope>.close'),y=v.querySelector(':scope>.btns>.yes'),z=v.querySelector(':scope>.btns>.no'),A=document.getElementById('sliderView'),B=A.querySelector(':scope>.close'),C=a(A.querySelector(':scope>.content')),D=document.getElementById('photoView'),E=D.querySelector(':scope>.close'),F=D.querySelector(':scope>img'),G=D.querySelector(':scope>.actions'),H=b(D);H.onzoomstart=i,H.ondragstart=j,s.showPhotoView=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.showPhotoView?window.frameElement.kernel.showPhotoView:function(a,b,c){var d,e;for(F.src=a;G.childNodes.length;)G.removeChild(G.firstChild);if('function'==typeof c&&b&&b.length){for(d=0;d<b.length;d++)e=document.createElement('a'),e.href='javascript:;',e.appendChild(document.createTextNode(b[d])),e.addEventListener('click',c.bind(s,d)),G.appendChild(e);G.style.display=''}else G.style.display='none'},s.hidePhotoView=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.hidePhotoView?window.frameElement.kernel.hidePhotoView:function(){F.src='about:blank'},F.addEventListener('load',function(){D.style.visibility='inherit',document.body.classList.add('mask'),window.addEventListener('resize',h),h()}),F.addEventListener('error',function(){D.style.visibility='',window.removeEventListener('resize',h),c()}),s.showSliderView=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.showSliderView?window.frameElement.kernel.showSliderView:function(a,b,c){var d;for(A.className=c||'',d=0;d<a.length;d++)C.add(a[d]);b&&C.slideTo(b,!0)},s.hideSliderView=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.hideSliderView?window.frameElement.kernel.hideSliderView:function(){C.clear()},s.alert=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.alert?window.frameElement.kernel.alert:function(a,b){e('alert',a,b)},s.confirm=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.confirm?window.frameElement.kernel.confirm:function(a,b){e('confirm',a,b)},s.htmlDialog=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.htmlDialog?window.frameElement.kernel.htmlDialog:function(a,b,c){e(b||'',a,c)},s.closeDialog=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.closeDialog?window.frameElement.kernel.closeDialog:function(b){var d;for(window.removeEventListener('resize',f,!1),t.style.visibility='',c(),'function'==typeof l&&l(b);w.childNodes.length;)w.removeChild(w.lastChild);l=void 0,p.length&&(d=p.shift(),s[d.shift()].apply(s,d))},s.showLoading=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.showLoading?window.frameElement.kernel.showLoading:function(a){r.querySelector(':scope>div').lastChild.data=a?a:'\u52A0\u8F7D\u4E2D...',0==o&&(r.style.visibility='inherit',document.body.classList.add('mask')),o++},s.hideLoading=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.hideLoading?window.frameElement.kernel.hideLoading:function(){0<o&&(o--,0==o&&(r.style.visibility='',c(),'function'==typeof s.dialogEvents.onloaded&&s.dialogEvents.onloaded({type:'loaded'})))},s.isLoading=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.isLoading?window.frameElement.kernel.isLoading:function(){return 0<o},s.hint=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.hint?window.frameElement.kernel.hint:function(a,b){u.querySelector(':scope>.text').firstChild.data=a,k?clearTimeout(k):u.style.opacity=1,k=setTimeout(function(){u.style.opacity='',k=void 0},b?b:5e3)},s.dialogEvents={},C.onchange=function(){var a,b='';if(this.children.length){if(1<this.children.length)for(a=0;a<this.children.length;a++)b+=a===this.current?'\u25CF':'\u25CB';A.style.visibility='inherit',document.body.classList.add('mask')}else A.style.visibility='',c();A.querySelector(':scope>.nav').firstChild.data=b},x.appendChild(s.makeSvg('times-circle-solid',1)),x.addEventListener('click',d),z.addEventListener('click',d),y.addEventListener('click',s.closeDialog),B.appendChild(s.makeSvg('times-solid',1)),E.appendChild(B.firstChild.cloneNode(!0)),B.addEventListener('click',s.hideSliderView),E.addEventListener('click',s.hidePhotoView)}(),!function(){function a(a){for(var b,c=w.querySelector(':scope>.navMenu');c.childNodes.length;)c.removeChild(c.childNodes[0]);for(b in u=a,v={},u)b in e&&(v[b]=c.appendChild(document.createElement('a')),v[b].href='#!'+b,RegExp('^'+b+'(?:-|$)').test(s.location.id)?(v[b].className='selected',v[b].appendChild(s.makeSvg('string'==typeof u[b]?u[b]:u[b].selected,1))):v[b].appendChild(s.makeSvg('string'==typeof u[b]?u[b]:u[b].normal,1)),v[b].appendChild(document.createTextNode(e[b].alias?e[b].title||e[e[b].alias].title:e[b].title)))}function b(){var a,c,g=s.location.id,i=e[g];s.lastLocation&&(a=g.replace(/-.*$/,''),c=s.lastLocation.id.replace(/-.*$/,''),a!==c&&(a in v&&(v[a].className='selected','string'!=typeof u[a]&&s.setSvgPath(v[a].firstChild,u[a].selected,!0)),c in v&&(v[c].className='','string'!=typeof u[c]&&s.setSvgPath(v[c].firstChild,u[c].normal,!0))),o()),'function'==typeof s.pageEvents.onroute&&s.pageEvents.onroute({type:'route'}),h(i,g,!0,function(a){if(m)n=!0;else{var c,h,i,j,o,p,q=e[g].alias?e[g].alias:g;if(g!==l){for(w.classList.add(g),p=e[g].title||e[q].title,w.querySelector(':scope>.header>.title').firstChild.data=p,(document.body.classList.contains('clean')||document.body.classList.contains('hidePageHeader'))&&(document.title=p),window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.getCurrentPopup&&'page'===window.frameElement.kernel.getCurrentPopup()&&window.frameElement.kernel.setPopupTitle(p);z.childNodes.length;)z.removeChild(z.firstChild);for(z.removeAttribute('href');y.childNodes.length;)y.removeChild(y.firstChild);y.removeAttribute('href'),e[q].rightMenuContent||e[q].onrightmenuclick?('string'==typeof e[q].rightMenuContent?z.innerHTML=e[q].rightMenuContent:e[q].rightMenuContent&&z.appendChild(e[q].rightMenuContent),'function'==typeof e[q].onrightmenuclick?z.href='javascript:;':e[q].onrightmenuclick&&(z.href=e[q].onrightmenuclick),z.style.display=''):z.style.display='none',e[q].leftMenuContent||e[q].onleftmenuclick?('string'==typeof e[q].leftMenuContent?y.innerHTML=e[q].leftMenuContent:e[q].leftMenuContent&&y.appendChild(e[q].leftMenuContent),'function'==typeof e[q].onleftmenuclick?y.href='javascript:;':e[q].onleftmenuclick&&(y.href=e[q].onleftmenuclick),y.style.display=''):y.style.display='none',f(s.getDefaultBack()),c=w.querySelector(':scope>.content>.'+q),l?(w.classList.remove(l),i=l,j=e[i].alias?e[i].alias:i,l=g,q===j?d(!0):(o=s.isGoingback(i,g),m=!0,h=w.querySelector(':scope>.content>.'+j),k(c,h,o,function(){m=!1,'function'==typeof e[j].onunloadend&&e[j].onunloadend(!o),document.activeElement&&h.contains(document.activeElement)&&document.activeElement.blur(),'function'==typeof e[q].onloadend&&e[g].onloadend(!o),n&&(n=!1,c.style.visibility='inherit',b())}),'function'==typeof e[j].onunload&&e[j].onunload(),'function'==typeof e[q].onload&&e[q].onload(!o||a))):(l=g,c.style.right=0,c.style.visibility='inherit',d(!0))}else d();'function'==typeof s.pageEvents.onroutend&&s.pageEvents.onroutend({type:'routend'})}})}function c(a,b){var c=e[l].alias?e[e[l].alias]:e[l];(!a||'string'==typeof a&&a===s.location.id||0<=a.indexOf(s.location.id))&&(!b&&o(),'function'==typeof c.onunload&&c.onunload(!0),'function'==typeof c.onunloadend&&c.onunloadend(!0),'function'==typeof c.onload&&c.onload(!0),'function'==typeof c.onloadend&&c.onloadend(!0))}function d(a){var b=e[l].alias?e[e[l].alias]:e[l];'function'==typeof b.onload&&b.onload(a),'function'==typeof b.onloadend&&b.onloadend()}function f(a){if(a&&a.id){var b=e[a.id].title;!b&&e[a.id].alias&&(b=e[e[a.id].alias].title,!b&&(b='\u8FD4\u56DE')),x.lastChild.data=b,x.href=s.buildHash(a),x.style.display=''}else x.href='#!',x.style.display='none'}function i(){var a=s.parseHash(location.hash);s.isSameLocation(a,s.location)||(s.lastLocation=s.location,s.location=a,e[s.location.id].back&&(s.lastLocation.id===e[s.location.id].back||e[s.lastLocation.id].alias===e[s.location.id].back)?(j[s.location.id]=e[s.location.id].backLoc=s.lastLocation,sessionStorage.setItem('kernelHistory',JSON.stringify(j))):e[s.lastLocation.id].backLoc&&(s.location.id===e[s.lastLocation.id].back||e[s.location.id].alias&&e[s.location.id].alias===e[s.lastLocation.id].back)&&(delete e[s.lastLocation.id].backLoc,delete j[s.lastLocation.id],sessionStorage.setItem('kernelHistory',JSON.stringify(j))),b())}var j,l,m,n,u,v,w=document.getElementById('page'),x=w.querySelector(':scope>.header>.back'),y=w.querySelector(':scope>.header>.leftMenuBtn'),z=w.querySelector(':scope>.header>.rightMenuBtn');try{sessionStorage.setItem(0,0),sessionStorage.removeItem(0)}catch(a){Storage.prototype.setItem=function(){}}s.init=function(c,d){if(c in e)if(t=c,!s.location){for(var f in s.location=s.parseHash(location.hash),s.location.args.ui&&s.location.args.ui.split(',').forEach(function(a){document.body.classList.add(a)}),j=sessionStorage.getItem('kernelHistory'),j=j?JSON.parse(j):{},j)f in e&&(e[f].backLoc=j[f]);window.addEventListener('hashchange',i),a(d),window.addEventListener('contextmenu','Firefox'===browser.name?q:p),window.addEventListener('dragstart',p),b(),s.location.args.hasOwnProperty('autopopup')&&s.openPopup(s.location.args.autopopup,s.location.args.autopopuparg?JSON.parse(s.location.args.autopopuparg):void 0)?(document.querySelector('#popup').style.animationDuration='1ms',s.listeners.add(s.popupEvents,'showend',r)):r()}else d&&a(d),i()},s.reloadPage=function(a,b){function d(f){s.listeners.remove(this,f.type,d),s.isSameLocation(e,s.location)&&c(a,b)}var e;s.isLoading()?(e=s.location,s.listeners.add(s.dialogEvents,'loaded',d)):c(a,b)},s.destoryPage=function(a){var b=e[a];b&&g(b,'page',a)},s.pageEvents={},x.insertBefore(s.makeSvg('angle-left-light',1),x.firstChild),z.addEventListener('click',function(){var a=e[e[l].alias?e[l].alias:l];'function'==typeof a.onrightmenuclick&&a.onrightmenuclick()}),y.addEventListener('click',function(){var a=e[e[l].alias?e[l].alias:l];'function'==typeof a.onleftmenuclick&&a.onleftmenuclick()})}(),s});
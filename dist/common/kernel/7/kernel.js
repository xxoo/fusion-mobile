'use strict';var _typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&'function'==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?'symbol':typeof a};define(['common/touchslider/touchslider','common/touchguesture/touchguesture','common/pointerevents/pointerevents','common/svgicos/svgicos','site/pages/pages','site/popups/popups'],function(a,b,c,d,e,f){function g(a,b,c){var d=b+'/'+c+'/',e=document.querySelector('#'+b+'>.content>.'+c);2===a.loaded&&'function'==typeof a.ondestory&&a.ondestory(),e.parentNode.removeChild(e),a.css&&'string'!=typeof a.css&&(a.css=s.removeCss(a.css).substr(require.toUrl(d).length)),a.js&&(d+=a.js,require.defined(d)&&(e=require(d),require.undef(d),e&&Reflect.setPrototypeOf(a,Object.prototype))),a.loaded=0}function h(a,b,c,d){function f(e){var f;k.querySelector(':scope>.content').insertAdjacentHTML('beforeEnd','<div class="'+b+'">'+e+'</div>'),l(k.querySelector(':scope>.content>.'+b)),'js'in a?(s.showLoading(),f=p+a.js,require.data.debug?require([f],h):require([f],h,function(d){g(a,o,b),d.requireType&&'scripterror'!==d.requireType&&'nodefine'!==d.requireType||d.xhr&&404!==d.xhr.status?i(f,d.message,c):j(c),s.hideLoading()})):(a.loaded=2,d(!0))}function h(b){b&&Reflect.setPrototypeOf(a,b),a.loaded=2,d(!0),s.hideLoading()}var k,o,p,n,m,q;c&&a.alias&&(b=a.alias,a=e[a.alias]),2===a.loaded?d():1!==a.loaded&&(a.loaded=1,c?(k=document.getElementById('page'),o='page'):(k=document.getElementById('popup'),o='popup'),p=o+'/'+b+'/',n=require.toUrl(p),'string'==typeof a.css&&(a.css=s.appendCss(n+a.css)),'html'in a?(s.showLoading(),m=n+a.html,q=new XMLHttpRequest,q.open('get',m,!0),q.onreadystatechange=function(){4===this.readyState&&(200===this.status?f(this.responseText):(g(a,o,b),require.data.debug||404!==this.status?i(m,this.status,c):j(c)),s.hideLoading())},q.send('')):f(''))}function i(a,b,c){s.alert('\u52A0\u8F7D'+a+'\u65F6\u53D1\u751F\u4E86\u4E00\u4E2A\u9519\u8BEF: '+b,c?function(){history.back()}:void 0)}function j(a){a?location.reload():s.confirm('\u7F51\u7AD9\u5DF2\u7ECF\u66F4\u65B0, \u4F7F\u7528\u8BE5\u529F\u80FD\u9700\u8981\u5148\u91CD\u65B0\u52A0\u8F7D. \u662F\u5426\u7ACB\u5373\u5237\u65B0\u672C\u9875?',function(a){a&&location.reload()})}function k(a,b,c,d){function e(a){this.removeEventListener(a.type,e,!1),d()}a.style.visibility='visible',c?(b.style.animationName='panelTransR1',a.style.animationName='panelTransR2'):(b.style.animationName='panelTransL1',a.style.animationName='panelTransL2'),'function'==typeof d&&l(a,e)}function l(a,b){'function'!=typeof b&&(b=m),a.addEventListener('animationend',b)}function m(a){a.target===this&&(this.style.right='1'===this.style.animationName.substr(this.style.animationName.length-1)?this.style.visibility='':0,this.style.animationName='')}function n(a,b){for(;e[a].back;)if(a=e[a].back,a===b)return!0}function o(){s.hideReadable(),s.closePopup()}function p(a){a.preventDefault()}function q(a){a.stopPropagation()}var r,s={appendCss:function appendCss(a){var b=document.createElement('link');return /\.less$/.test(a)?'object'===('undefined'==typeof less?'undefined':_typeof(less))?(b.rel='stylesheet/less',b.href=a,less.sheets.push(b),less.refresh()):(b.rel='stylesheet',b.href=a.replace(/less$/,'css')):(b.rel='stylesheet',b.href=a),document.head.appendChild(b)},removeCss:function removeCss(a){return document.head.removeChild(a),'stylesheet/less'===a.rel&&(less.sheets.splice(less.sheets.indexOf(a),1),less.refresh()),a.getAttribute('href')},makeSvg:function makeSvg(a,b){var c='http://www.w3.org/2000/svg',d=document.createElementNS(c,'svg');return d.appendChild(document.createElementNS(c,'path')).setAttribute('transform','scale(1,-1)'),a&&s.setSvgPath(d,a,b),d},setSvgPath:function setSvgPath(a,b,c){var e,f=s.makeSvg();f.style.position='absolute',f.style.bottom=f.style.right='100%',f.firstChild.setAttribute('d',d[b]||b),document.body.appendChild(f),e=f.firstChild.getBBox(),document.body.removeChild(f),c&&(e.width>e.height?(e.y-=(e.width-e.height)/2,e.height=e.width):(e.x-=(e.height-e.width)/2,e.width=e.height)),a.firstChild.setAttribute('d',d[b]||b),a.setAttribute('viewBox',e.x+' '+(-e.y-e.height)+' '+e.width+' '+e.height)},buildHash:function buildHash(a){var b,c='#!'+encodeURIComponent(a.id);for(b in a.args)c+=void 0===a.args[b]?'&'+encodeURIComponent(b):'&'+encodeURIComponent(b)+'='+encodeURIComponent(a.args[b]);return c},parseHash:function parseHash(b){var c,d,a,f={id:r,args:{}};if(b=b.substr(1).replace(/[#\?].*$/,''),a=b.match(/[^=&]+(=[^&]*)?/g),a)for('!'===a[0].charAt(0)&&(d=a[0].substr(1),(d in e)&&(f.id=decodeURIComponent(d))),c=1;c<a.length;c++)d=a[c].match(/^([^=]+)(=)?(.+)?$/),d&&(f.args[decodeURIComponent(d[1])]=d[2]?decodeURIComponent(d[3]||''):void 0);return f},getDefaultBack:function getDefaultBack(a){var b,c,d;if(a||(a=s.location),e[a.id])if('object'===s.dataType(e[a.id].backLoc))d=e[a.id].backLoc;else if(e[a.id].back&&e[e[a.id].back]&&(d={id:e[a.id].back,args:{}},c=e[e[a.id].back].alias?e[e[e[a.id].back].alias]:e[e[a.id].back],c.args))for(b=0;b<c.args.length;b++)c.args[b]in a.args&&(d.args[c.args[b]]=a.args[c.args[b]]);return d},isSameLocation:function isSameLocation(a,b){if(a.id===b.id&&Object.keys(a.args).length===Object.keys(b.args).length){for(var c in a.args){if(!(c in b.args))return!1;if(void 0===a.args[c]){if(a.args[c]!==b.args[c])return!1;}else if(''+a.args[c]!=''+b.args[c])return!1}return!0}return!1},replaceLocation:function replaceLocation(a){s.location&&s.isSameLocation(a,s.location)?s.reloadPage():location.replace(s.buildHash(a))},isGoingback:function isGoingback(a,b){return!!n(a,b)||!n(b,a)&&(e[a].alias?!!n(e[a].alias,b)||!n(b,e[a].alias)&&b===r:e[b].alias?!!n(a,e[b].alias)||!n(e[b].alias,a)&&e[a]===r:b===r)},dataType:function dataType(b){var c='undefined'==typeof b?'undefined':_typeof(b);return'boolean'===c||'string'===c||'symbol'===c||'number'===c||'function'===c||'undefined'===c?c:(c=Object.prototype.toString.call(b).replace(/^\[object |\]$/g,'').toLowerCase(),'date'===c||'array'===c||'regexp'===c||'error'===c||'null'===c?c:'object')}};return!function(){function a(a,b){var c,d;for(a.xEvents[b.type].locked=!0,c=0;c<a.xEvents[b.type].length;c++)a.xEvents[b.type][c].call(a,b);for(a.xEvents[b.type].locked=!1;a.xEvents[b.type].stack.length;)a.xEvents[b.type].stack[0]?(d=a.xEvents[b.type].indexOf(a.xEvents[b.type].stack[0][1]),a.xEvents[b.type].stack[0][0]?0<=d&&a.xEvents[b.type].splice(d,1):0>d&&a.xEvents[b.type].push(a.xEvents[b.type].stack[0][1])):a.xEvents[b.type].splice(0,a.xEvents[b.type].length),a.xEvents[b.type].stack.shift();if(a.xEvents[b.type].length||(delete a.xEvents[b.type],a['on'+b.type]=null),a.xEvents.removeMark){for(c in delete a.xEvents.removeMark,a.xEvents)delete a.xEvents[c],a['on'+c]=null;delete a.xEvents}}s.listeners={add:function add(b,c,d){b.xEvents||(b.xEvents=function(c){a(b,c)}),b.xEvents[c]||(b.xEvents[c]=[],b.xEvents[c].stack=[],b.xEvents[c].locked=!1,b['on'+c]=b.xEvents),b.xEvents[c].locked?b.xEvents[c].stack.push([!1,d]):0>b.xEvents[c].indexOf(d)&&b.xEvents[c].push(d)},list:function list(a,b){var c,d;if(b)c=a.xEvents&&a.xEvents[b]?a.xEvents[b].slice(0):[];else if(c={},a.xEvents)for(d in a.xEvents)'array'===s.dataType(a.xEvents[d])&&a.xEvents[d].length&&(c[d]=a.xEvents[d].slice(0));return c},remove:function remove(a,b,c){var d,e,f;if(a.xEvents)if(b)a.xEvents[b]&&(a.xEvents[b].locked?c?a.xEvents[b].stack.push([!0,c]):a.xEvents[b].stack.push(null):c?(f=a.xEvents[b].indexOf(c),0<=f&&a.xEvents[b].splice(f,1)):a.xEvents[b].splice(0,a.xEvents[b].length),0===a.xEvents[b].length&&(delete a.xEvents[b],a['on'+b]=null));else if(!a.xEvents.removeMark){for(d in a.xEvents)a.xEvents[d].locked?e=!0:(delete a.xEvents[d],a['on'+d]=null);e?a.xEvents.removeMark=!0:delete a.xEvents}}}}(),!function(){function a(){0===this.scrollTop?this.scrollTop=1:this.scrollTop+this.clientHeight===this.scrollHeight&&(this.scrollTop-=1)}s.scrollReload=function(a,b){s.fixIosScrolling(a);var d,e,f,g,i=c(a,function(c){function j(b){b.target!==a&&(g=!0,k())}function k(){window.removeEventListener('scroll',j,!0)}if('start'!==c.type){if(g)return g=!1,!0;var l;if(c.y>d+5)e||(e=!0,k()),c.domEvent.preventDefault(),f||(f=document.createElement('div'),f.className='reloadHint',f.appendChild(s.makeSvg('refresh',!0)),a.appendChild(f)),l=f.offsetHeight||f.clientHeight,c.y-d<2*l?(f.style.top=c.y-d-l+'px',f.classList.remove('pin'),f.style.opacity=(c.y-d)/l/2,f.style.transform='rotate('+360*f.style.opacity+'deg)'):(f.style.top=l+'px',f.style.opacity=1,f.classList.add('pin'),f.style.transform='');else{if(c.y<d&&!e)return!0;f&&(a.removeChild(f),f=void 0)}('end'===c.type||'cancel'===c.type)&&(f&&(a.removeChild(f),f.classList.contains('pin')&&('function'==typeof b?b():s.reloadPage()),f=void 0),e=!1)}else if(0===i.pointers.length&&(a.classList.contains('iosScrollFix')&&1===a.scrollTop||!a.classList.contains('iosScrollFix')&&0===a.scrollTop))return d=c.y,window.addEventListener('scroll',j,!0),!0})},s.fixIosScrolling=function(b,c){'IOS'===browser.name&&(b.style.webkitOverflowScrolling='touch',b.addEventListener('touchmove',q),!c&&(b.classList.add('iosScrollFix'),b.scrollTop=1,b.addEventListener('scroll',a)))},s.getScrollHeight=function(a){return a.classList.contains('iosScrollFix')?a.scrollHeight-1:a.scrollHeight},s.setScrollTop=function(a,b){a.scrollTop=a.classList.contains('iosScrollFix')?b+1:b},'IOS'===browser.name&&window.addEventListener('touchmove',p)}(),!function(){function a(){1<c.length?(c.shift(),'function'==typeof c[0]?(c[0](),a()):b(c[0])):d.style.display=''}function b(a){var b,c,d;for(f.src=a.img,('right'in a)&&(f.style.right=a.right),('left'in a)&&(f.style.left=a.left),('top'in a)&&(f.style.top=a.top),('bottom'in a)&&(f.style.bottom=a.bottom),('width'in a)&&(f.style.width=a.width),('height'in a)&&(f.style.height=a.height),d=0;d<e.childNodes.length;d++)b=e.childNodes[d],a.rows[d]?(b.style.height=a.rows[d],b.className='unflexable'):(b.style.height='auto',b.className='flexable');for(b=e.childNodes[1],d=0;d<b.childNodes.length;d++)c=b.childNodes[d],a.cells[d]?(c.style.width=a.cells[d],c.className='unflexable'):(c.style.width='auto',c.className='flexable')}var c,d=document.getElementById('helper'),e=d.firstChild,f=d.lastChild;d.addEventListener('click',a),s.showHelper=function(a){c='array'===s.dataType(a)?a:[a],b(c[0]),d.style.display='block'}}(),!function(){function a(a,b){return d&&'function'==typeof f[d].onunload&&f[d].onunload()||'function'==typeof f[a].onload&&f[a].onload(b,!d||a!==f[d].back&&a!==e)}function b(a){d&&(l.classList.remove(d),delete f[d].backParam),e=void 0,d=a,l.classList.add(d),n.data=f[a].title,f[a].back?(o.lastChild.data=f[f[a].back].title,o.style.visibility='visible'):o.style.visibility='hidden'}function c(c,g){var h=d;return!!a(c,g)||void(k(l.querySelector(':scope>.content>.'+c),l.querySelector(':scope>.content>.'+d),c===f[d].back||c===e,function(){var a;i=!1,b(c),'function'==typeof f[h].onunloadend&&f[h].onunloadend(),'function'==typeof f[d].onloadend&&f[d].onloadend(),'function'==typeof j&&(a=j,j=void 0,a())}),i=c)}var d,e,i,j,l=document.getElementById('popup'),m=l.querySelector(':scope>.header>.close'),n=l.querySelector(':scope>.header>.title').firstChild,o=l.querySelector(':scope>.header>.back');s.openPopup=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.openPopup?window.frameElement.kernel.openPopup:function(a,b){var c=f[a];c?h(c,a,!1,function(){'function'==typeof c.open?c.open(b,!d||a!==f[d].back&&a!==e):s.showPopup(a,b)}):s.hint('popup config not found: '+a)},s.showPopup=function(g,h){if(i)j=function(){s.showPopup(g,h)};else{var k;if(!l.classList.contains('in')){if(a(g,h))return!0;k=l.querySelector(':scope>.content>.'+g),k.style.right=0,k.style.visibility='visible',l.classList.add('in'),i=g,'function'==typeof s.popupEvents.onshow&&s.popupEvents.onshow({type:'show',id:g}),b(g),s.hideReadable()}else{if(d!==g)return c(g,h);'function'==typeof f[g].onload&&f[g].onload(h,!d||g!==f[d].back&&g!==e)||'function'!=typeof f[g].onloadend||f[g].onloadend()}}},s.closePopup=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.closePopup?window.frameElement.kernel.closePopup:function(a){var b;i?j=function(){s.closePopup(a)}:(b=s.getCurrentPopup(),b&&(!a||b===a||'array'===s.dataType(a)&&0<=a.indexOf(b))&&('function'!=typeof f[b].onunload||!f[b].onunload())&&(l.classList.remove('in'),l.classList.add('out'),i=!0,delete f[b].backParam,'function'==typeof s.popupEvents.onhide&&s.popupEvents.onhide({type:'hide',id:b})))},s.getCurrentPopup=function(){if(l.classList.contains('in'))return d},s.setPopupBackParam=function(a){l.classList.contains('in')&&(f[d].backParam=a)},s.setPopupBack=function(a,b){b?b in f&&(a?(f[b].back=a,d===b&&(o.lastChild.data=f[a].title)):(delete f[b].back,o.style.visibility='hidden')):l.classList.contains('in')&&(a?(o.lastChild.data=f[a].title,e=a,o.style.visibility=''):o.style.visibility='hidden')},s.setPopupTitle=function(a,b){b?b in f&&(f[b].title=a,d===b&&(n.data=a)):l.classList.contains('in')&&(n.data=a)},s.destoryPopup=function(a){var b=f[a];b&&g(b,'popup',a)},s.popupEvents={},m.appendChild(s.makeSvg('close',!0)),m.addEventListener('click',function(){s.closePopup()}),o.insertBefore(s.makeSvg('angle-left',!0),o.firstChild),o.addEventListener('click',function(){s.openPopup(e?e:f[d].back,f[d].backParam)}),l.addEventListener('animationend',function(a){var b;if(a.target===this&&(i=!1,this.classList.contains('out')?(this.classList.remove('out'),'function'==typeof s.popupEvents.onhideend&&s.popupEvents.onhideend({type:'hideend',id:d}),b=l.querySelector(':scope>.content>.'+d),b.style.right=b.style.visibility='','function'==typeof f[d].onunloadend&&f[d].onunloadend(),l.classList.remove(d),d=void 0):('function'==typeof f[d].onloadend&&f[d].onloadend(),'function'==typeof s.popupEvents.onshowend&&s.popupEvents.onshowend({type:'showend',id:d})),'function'==typeof j)){var c=j;j=void 0,c()}})}(),!function(){var a,b=document.getElementById('readable'),c=b.querySelector(':scope>.close'),d=b.querySelector(':scope>.content');s.fixIosScrolling(d),s.showReadable=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.showReadable?window.frameElement.kernel.showReadable:function(c,e,f){'string'==typeof c?d.innerHTML=c:d.appendChild(c),b.className=f?'in '+f:'in',a=e},s.hideReadable=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.hideReadable?window.frameElement.kernel.hideReadable:function(){b.classList.contains('in')&&(b.classList.remove('in'),b.classList.add('out'),'function'==typeof a&&a())},s.showForeign=function(a,b){s.showReadable('<iframe frameborder="no" scrolling="auto" sandbox="allow-same-origin allow-forms allow-scripts" src="'+a+'"></iframe>',b,'foreign')},c.appendChild(s.makeSvg('close',!0)),c.addEventListener('click',s.hideReadable),b.addEventListener('animationend',function(a){if(a.target===this&&this.classList.contains('out')){for(;0<d.childNodes.length;)d.removeChild(d.firstChild);this.className=''}})}(),!function(){function c(){''===t.style.visibility&&''===q.style.visibility&&''===z.style.visibility&&''===C.style.visibility&&document.body.classList.remove('mask')}function d(a,b,c){'visible'===t.style.visibility?o.push([a,b,c]):(u.className=a,'alert'===a?v.textContent=b:'confirm'===a?'string'==typeof b?(v.textContent=b,x.textContent='\u662F',y.textContent='\u5426'):(v.textContent=b[0],x.textContent=b[1],y.textContent=b[2]):'string'==typeof b?v.innerHTML=b:v.appendChild(b),window.addEventListener('resize',e),e(),document.body.classList.add('mask'),t.style.visibility='visible',k=c)}function e(){u.style.width=u.style.height='',u.style.left=u.style.top='20px',u.style.bottom=u.style.right='auto',u.style.width=u.offsetWidth+'px',u.style.height=u.offsetHeight+'px',u.style.left=u.style.top=u.style.bottom=u.style.right=''}function f(){E.style.width=p.w+'px',E.style.height=p.h+'px',E.style.left=p.l+'px',E.style.top=p.t+'px'}function g(){p.ww=window.innerWidth,p.wh=window.innerHeight,p.wr=p.ww/p.wh,p.ow=E.naturalWidth,p.oh=E.naturalHeight,p.r=p.ow/p.oh,p.ow>p.ww||p.oh>p.wh?p.r>p.wr?(p.z=p.mz=p.ww/p.ow,p.l=0,p.w=p.ww,p.h=p.w/p.r,p.t=(p.wh-p.h)/2):(p.z=p.mz=p.wh/p.oh,p.t=0,p.h=p.wh,p.w=p.h*p.r,p.l=(p.ww-p.w)/2):(p.z=p.mz=1,p.w=p.ow,p.h=p.oh,p.l=(p.ww-p.w)/2,p.t=(p.wh-p.h)/2),f()}function h(a){function b(a){var b=l(m(a.zoom*e,1),p.mz);b!==p.z&&(p.w=p.ow*b,p.h=p.oh*b,p.l=p.w>p.ww?m(l(c+(p.l-c)*b/p.z,p.ww-p.w),0):(p.ww-p.w)/2,p.t=p.h>p.wh?m(l(d+(p.t-d)*b/p.z,p.wh-p.h),0):(p.wh-p.h)/2,p.z=b,f())}var c=a.x,d=a.y,e=p.z;this.onzoomstart=null,this.onzoomchange=b,this.onzoomend=function(a){b.call(this,a),this.onzoomchange=this.zoomend=null,this.onzoomstart=h}}function i(a){function b(a){p.w>p.ww&&(p.l=m(l(e+a.x-c,p.ww-p.w),0)),p.h>p.wh&&(p.t=m(l(g+a.y-d,p.wh-p.h),0)),f()}var c=a.x,d=a.y,e=p.l,g=p.t;G.ondragmove=b,G.ondragend=function(a){b.call(this,a),this.ondragmove=this.ondragend=null,this.ondragstart=i}}var j,k,l=Math.max,m=Math.min,n=0,o=[],p={},q=document.getElementById('loading'),r=document.getElementById('hint'),t=document.getElementById('dialog'),u=t.querySelector(':scope>div'),v=u.querySelector(':scope>.content'),w=u.querySelector(':scope>.close'),x=u.querySelector(':scope>.btns>.yes'),y=u.querySelector(':scope>.btns>.no'),z=document.getElementById('sliderView'),A=z.querySelector(':scope>.close'),B=a(z.querySelector(':scope>.content')),C=document.getElementById('photoView'),D=C.querySelector(':scope>.close'),E=C.querySelector(':scope>img'),F=C.querySelector(':scope>.actions'),G=b(C);G.onzoomstart=h,G.ondragstart=i,s.showPhotoView=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.showPhotoView?window.frameElement.kernel.showPhotoView:function(a,b,c){var d,e;for(E.src=a;F.childNodes.length;)F.removeChild(F.firstChild);if('function'==typeof c&&b&&b.length){for(d=0;d<b.length;d++)e=document.createElement('a'),e.href='javascript:;',e.appendChild(document.createTextNode(b[d])),e.addEventListener('click',c.bind(s,d)),F.appendChild(e);F.style.display=''}else F.style.display='none'},s.hidePhotoView=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.hidePhotoView?window.frameElement.kernel.hidePhotoView:function(){E.src='about:blank'},E.addEventListener('load',function(){C.style.visibility='visible',document.body.classList.add('mask'),window.addEventListener('resize',g),g()}),E.addEventListener('error',function(){C.style.visibility='',window.removeEventListener('resize',g),c()}),s.showSliderView=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.showSliderView?window.frameElement.kernel.showSliderView:function(a,b,c){var d;for(z.className=c||'',d=0;d<a.length;d++)B.add(a[d]);b&&B.slideTo(b,!0)},s.hideSliderView=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.hideSliderView?window.frameElement.kernel.hideSliderView:function(){B.clear()},s.alert=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.alert?window.frameElement.kernel.alert:function(a,b){d('alert',a,b)},s.confirm=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.confirm?window.frameElement.kernel.confirm:function(a,b){d('confirm',a,b)},s.htmlDialog=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.htmlDialog?window.frameElement.kernel.htmlDialog:function(a,b,c){d(b||'',a,c)},s.closeDialog=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.closeDialog?window.frameElement.kernel.closeDialog:function(b){var d;for(window.removeEventListener('resize',e,!1),t.style.visibility='',c(),'function'==typeof k&&k(b);v.childNodes.length;)v.removeChild(v.lastChild);k=void 0,o.length&&(d=o.shift(),s[d.shift()].apply(s,d))},s.showLoading=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.showLoading?window.frameElement.kernel.showLoading:function(a){q.querySelector(':scope>div').lastChild.data=a?a:'\u52A0\u8F7D\u4E2D...',0==n&&(q.style.visibility='visible',document.body.classList.add('mask')),n++},s.hideLoading=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.hideLoading?window.frameElement.kernel.hideLoading:function(){0<n&&(n--,0==n&&(q.style.visibility='',c(),'function'==typeof s.dialogEvents.onloaded&&s.dialogEvents.onloaded({type:'loaded'})))},s.isLoading=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.isLoading?window.frameElement.kernel.isLoading:function(){return 0<n},s.hint=window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.hint?window.frameElement.kernel.hint:function(a,b){r.querySelector(':scope>.text').firstChild.data=a,j?clearTimeout(j):r.style.opacity=1,j=setTimeout(function(){r.style.opacity='',j=void 0},b?b:5e3)},s.dialogEvents={},B.onchange=function(){var a,b='';if(this.children.length){if(1<this.children.length)for(a=0;a<this.children.length;a++)b+=a===this.current?'\u25CF':'\u25CB';z.style.visibility='visible',document.body.classList.add('mask')}else z.style.visibility='',c();z.querySelector(':scope>.nav').firstChild.data=b},w.appendChild(s.makeSvg('close',!0)),w.addEventListener('click',s.closeDialog),x.addEventListener('click',s.closeDialog),y.addEventListener('click',function(){s.closeDialog()}),A.appendChild(w.firstChild.cloneNode(!0)),D.appendChild(w.firstChild.cloneNode(!0)),A.addEventListener('click',s.hideSliderView),D.addEventListener('click',s.hidePhotoView)}(),!function(){function a(a){for(var b,c=v.querySelector(':scope>.navMenu');c.childNodes.length;)c.removeChild(c.childNodes[0]);for(b in t=a,u={},t)b in e&&(u[b]=c.appendChild(document.createElement('a')),u[b].href='#!'+b,RegExp('^'+b+'(?:-|$)').test(s.location.id)?(u[b].className='selected',u[b].appendChild(s.makeSvg('object'===_typeof(t[b])?t[b].selected:t[b],!0))):u[b].appendChild(s.makeSvg('object'===_typeof(t[b])?t[b].normal:t[b],!0)),u[b].appendChild(document.createTextNode(e[b].title)))}function b(){var a,c,g=s.location.id,i=e[g];s.lastLocation&&(a=g.replace(/-.*$/,''),c=s.lastLocation.id.replace(/-.*$/,''),a!==c&&(a in u&&(u[a].className='selected','object'===_typeof(t[a])&&s.setSvgPath(u[a].firstChild,t[a].selected,!0)),c in u&&(u[c].className='','object'===_typeof(t[c])&&s.setSvgPath(u[c].firstChild,t[c].normal,!0))),o()),'function'==typeof s.pageEvents.onroute&&s.pageEvents.onroute({type:'route'}),h(i,g,!0,function(a){if(m)n=!0;else{var c,h,i,j,o=e[g].alias?e[g].alias:g;if(g!==l){for(v.classList.add(g),v.querySelector(':scope>.header>.title').firstChild.data=e[g].title,window.frameElement&&window.frameElement.kernel&&'function'==typeof window.frameElement.kernel.getCurrentPopup&&'page'===window.frameElement.kernel.getCurrentPopup()&&window.frameElement.kernel.setPopupTitle(e[g].title);y.childNodes.length;)y.removeChild(y.firstChild);for(;x.childNodes.length;)x.removeChild(x.firstChild);e[g].onrightmenuclick?(y.href='function'==typeof e[g].onrightmenuclick?'javascript:;':e[g].onrightmenuclick,e[g].rightMenuDomContent&&y.appendChild(e[g].rightMenuDomContent),y.style.display=''):y.style.display='none',e[g].onleftmenuclick?(x.href='function'==typeof e[g].onleftmenuclick?'javascript:;':e[g].onleftmenuclick,e[g].leftMenuDomContent&&x.appendChild(e[g].leftMenuDomContent),x.style.display='',w.style.display='none'):x.style.display='none',f(s.getDefaultBack()),c=v.querySelector(':scope>.content>.'+o),l?(v.classList.remove(l),h=l,i=e[h].alias?e[h].alias:h,l=g,o===i?d(!0):(j=s.isGoingback(h,g),m=!0,k(c,v.querySelector(':scope>.content>.'+i),j,function(){m=!1,'function'==typeof e[i].onunloadend&&e[i].onunloadend(!j),'function'==typeof e[o].onloadend&&e[g].onloadend(!j),n&&(n=!1,c.style.visibility='visible',b())}),'function'==typeof e[i].onunload&&e[i].onunload(),'function'==typeof e[o].onload&&e[o].onload(!j||a))):(l=g,c.style.right=0,c.style.visibility='visible',d(!0))}else d();'function'==typeof s.pageEvents.onroutend&&s.pageEvents.onroutend({type:'routend'})}})}function c(a,b){var c=e[l].alias?e[e[l].alias]:e[l];(!a||'string'==typeof a&&a===s.location.id||0<=a.indexOf(s.location.id))&&(!b&&o(),'function'==typeof c.onunload&&c.onunload(!0),'function'==typeof c.onunloadend&&c.onunloadend(!0),'function'==typeof c.onload&&c.onload(!0),'function'==typeof c.onloadend&&c.onloadend(!0))}function d(a){var b=e[l].alias?e[e[l].alias]:e[l];'function'==typeof b.onload&&b.onload(a),'function'==typeof b.onloadend&&b.onloadend()}function f(a){if(a&&a.id){var b=e[a.id].title;b||(b='\u8FD4\u56DE'),w.lastChild.data=b,w.href=s.buildHash(a),w.style.display=''}else w.href='#!',w.style.display='none'}function i(){var a=s.parseHash(location.hash);s.isSameLocation(a,s.location)||(s.lastLocation=s.location,s.location=a,e[s.location.id].back&&(s.lastLocation.id===e[s.location.id].back||e[s.lastLocation.id].alias===e[s.location.id].back)?(j[s.location.id]=e[s.location.id].backLoc=s.lastLocation,sessionStorage.setItem('kernelHistory',JSON.stringify(j))):e[s.lastLocation.id].backLoc&&(s.location.id===e[s.lastLocation.id].back||e[s.location.id].alias&&e[s.location.id].alias===e[s.lastLocation.id].back)&&(delete e[s.lastLocation.id].backLoc,delete j[s.lastLocation.id],sessionStorage.setItem('kernelHistory',JSON.stringify(j))),b())}var j,l,m,n,t,u,v=document.getElementById('page'),w=v.querySelector(':scope>.header>.back'),x=v.querySelector(':scope>.header>.leftMenuBtn'),y=v.querySelector(':scope>.header>.rightMenuBtn');try{sessionStorage.setItem(0,0),sessionStorage.removeItem(0)}catch(a){Storage.prototype.setItem=function(){}}s.init=function(c,d){if(c in e)if(r=c,!s.location){for(var f in s.location=s.parseHash(location.hash),'clean'===s.location.args.ui&&document.body.classList.add('clean'),j=sessionStorage.getItem('kernelHistory'),j=j?JSON.parse(j):{},j)f in e&&(e[f].backLoc=j[f]);window.addEventListener('hashchange',i),a(d),window.addEventListener('contextmenu','Firefox'===browser.name?q:p),window.addEventListener('dragstart',p),document.documentElement.classList.remove('loading'),b(),'autopopup'in s.location.args&&s.openPopup(s.location.args.autopopup,s.location.args.autopopuparg?JSON.parse(s.location.args.autopopuparg):void 0)}else d&&a(d),i()},s.reloadPage=function(a,b){function d(f){s.listeners.remove(this,f.type,d),s.isSameLocation(e,s.location)&&c(a,b)}var e;s.isLoading()?(e=s.location,s.listeners.add(s.dialogEvents,'loaded',d)):c(a,b)},s.destoryPage=function(a){var b=e[a];b&&g(b,'page',a)},s.pageEvents={},w.insertBefore(s.makeSvg('angle-left',!0),w.firstChild),y.addEventListener('click',function(){'function'==typeof e[l].onrightmenuclick&&e[l].onrightmenuclick()}),x.addEventListener('click',function(){'function'==typeof e[l].onleftmenuclick&&e[l].onleftmenuclick()})}(),s});
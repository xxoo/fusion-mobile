'use strict';define(['module','common/kernel/kernel','site/pages/pages'],function(a,b,c){function d(){b.listeners.remove(b.popupEvents,'hide',d),e.src='about:blank'}var e,f,g=a.id.replace(/^[^/]+\/|\/[^/]+/g,''),h=document.querySelector('#popup>.content>.'+g);return h.innerHTML='<iframe frameborder="0" frameborder="no" scrolling="no" sandbox="allow-same-origin allow-forms allow-scripts" src="about:blank" style="display:block;width:100%;height:100%;"></iframe>',e=h.firstChild,e.kernel=b,{open:function h(a,c){if(a)f=a,'about:blank'===e.src&&(b.listeners.add(b.popupEvents,'hide',d),a.args.ui='clean'),e.src=b.buildHash(a);else if('about:blank'===e.src)return!0;b.openPopup(g,!c)},onloadend:function a(){b.setPopupTitle(c[f.id].title)}}});
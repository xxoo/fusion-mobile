'use strict';define(['common/kernel/kernel'],function(a){'your_production_host'===location.host&&(window._hmt=document.createElement('script'),_hmt.src='//hm.baidu.com/hm.js?[your_hmid]',document.head.appendChild(_hmt),_hmt=[['_setAutoPageview',!1]]),a.listeners.add(a.pageEvents,'route',function(){window._hmt&&_hmt.push&&_hmt.push(['_trackPageview','/'+a.buildHash(a.location)])}),a.init('list',{list:{normal:'home-regular',selected:'home-solid'},user:{normal:'user-regular',selected:'user-solid'},settings:{normal:'cog-regular',selected:'cog-solid'}}),document.body.classList.contains('clean')||'Android'!==browser.platform||'unsupported'!==browser.name||browser.app||a.htmlDialog('\t\t\t<div style="padding:10px;font-weight:bold;font-size:14px;">请更换浏览器</div>\t\t\t<div style="padding:0 20px 0 20px;font-size:12px;line-height:18px;text-align:justify;width:268px;">您使用的浏览器可能无法为本站提供完整支持, 推荐安装以下浏览器以获得更佳体验.</div>\t\t\t<div style="text-align:center;">\t\t\t\t<a style="margin:10px;vertical-align:top;" class="browserico chrome" href="https://play.google.com/store/apps/details?id=com.android.chrome" target="_blank"></a>\t\t\t\t<a style="margin:10px;vertical-align:top;" class="browserico firefox" href="https://play.google.com/store/apps/details?id=org.mozilla.firefox" target="_blank"></a>\t\t\t\t<a style="margin:10px;vertical-align:top;" class="browserico opera" href="https://play.google.com/store/apps/details?id=com.opera.browser" target="_blank"></a>\t\t\t</div>\t\t'.replace(/	|  /g,''))});
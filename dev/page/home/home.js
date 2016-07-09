'use strict';
define(['module', 'common/kernel/kernel', 'common/touchslider/touchslider'], function(module, kernel, touchslider) {
	var thispage = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = document.querySelector('#page>.content>.' + thispage),
		banner = touchslider(dom.querySelector('.banner'));
	kernel.scrollReload(dom);
	banner.onchange = function() {
		dom.querySelector('.nav').firstChild.data = navFormat(this.current, this.children.length);
	};
	var i, tmp,
		imgs = [{
			img: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
			href: 'https://www.google.com/intl/en/about/',
			bg: 'white'
		}, {
			img: 'https://assets.onestore.ms/cdnfiles/onestorerolling-1604-13000/shell/v3/images/logo/microsoft.png',
			href: 'https://blogs.microsoft.com/',
			bg:'white'
		}, {
			img: 'http://www.apple.com/ac/globalnav/2.0/en_US/images/ac-globalnav/globalnav/apple/image_large.svg',
			href: 'https://www.apple.com',
			bg:'rgba(0,0,0,0.8)'
		}];
	for (i = 0; i < imgs.length; i++) {
		tmp = document.createElement('a');
		tmp.className = 'item';
		tmp.href = 'javascript:;';
		tmp.style.backgroundImage = 'url(' + imgs[i].img + ')';
		tmp.style.backgroundColor = imgs[i].bg;
		showForeign(tmp, imgs[i].href);
		banner.add(tmp);
	}
	banner.onchange();

	return {
		onload: function(force) {
			banner.startPlay(10000);
		},
		onunload: function() {
			banner.stopPlay();
		}
	};

	function navFormat(t, num) {
		var a = '●',
			b = '○',
			txt = '';
		for (var i = 0; i < num; i++) {
			txt += (i === t) ? a : b;
		}
		return txt;
	}

	function showForeign(o, url) {
		o.addEventListener('click', function(evt) {
			kernel.showForeign(url);
		}, false);
	}
});
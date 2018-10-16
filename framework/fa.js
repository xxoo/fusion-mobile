! function () {
	'use strict';
	let l = document.querySelector('link[href^="https://pro-next.fontawesome.com/releases/"]');
	if (l) {
		let s = document.createElement('script');
		s.src = l.href.replace(/css\/all.css$/, 'js/all.js');
		document.head.appendChild(s);
		go();
	} else {
		alert('can not detect version');
	}

	function go() {
		let b = document.querySelector('div.tc.mt3-ns>button');
		if (b) {
			b.click();
			setTimeout(go, 1000);
		} else {
			let r = {},
				icos = document.querySelectorAll('#results-icons>ul a[href^="/icons/"]');
			for (let i = 0; i < icos.length; i++) {
				let h = icos[i].getAttribute('href').match(/\/icons\/([^?]+)\?style=([^&]+)/);
				if (h) {
					r[h[1] + '-' + h[2]] = icos[i].querySelector('svg>path').getAttribute('d');
				}
			}
			document.write(JSON.stringify(r));
			document.close();
		}
	}
}();
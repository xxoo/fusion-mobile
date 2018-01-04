let r = {}, icos = document.querySelectorAll('#results-icons a');
for (let i = 0; i < icos.length; i++) {
	let h = icos[i].getAttribute('href').match(/\/icons\/([^?]+)\?style=([^&]+)/);
	if (h){
		r[h[1] + '-' + h[2]] = icos[i].querySelector('svg>path').getAttribute('d');
  }
}
document.write(JSON.stringify(r));
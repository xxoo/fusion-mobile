//this script is for dumping svg paths from FontAwesome source
//requires node.js
'use strict';
var fs = require('fs'),
	target = process.argv.length > 2 ? process.argv[2] + '/' : '',
	svg = fs.readFileSync(target + 'fonts/fontawesome-webfont.svg', {
		encoding: 'utf8'
	}).split('\n'),
	name = fs.readFileSync(target + 'less/variables.less', {
		encoding: 'utf8'
	}).split('\n'),
	paths = {},
	vars = {},
	i, m;
for (i = 0; i < svg.length; i++) {
	m = svg[i].match(/&#x([0-9a-f]+);"(?: +horiz-adv-x="\d+")? +d=("[^"]{6,}")/);
	if (m) {
		paths[m[1]] = m[2];
	}
}
for (i = 0; i < name.length; i++) {
	m = name[i].match(/@fa-var-([^:]+): +"\\([0-9a-f]+)/);
	if (m && (m[2] in paths)) {
		vars[m[1]] = m[2];
	}
};
svg = '';
for (i in paths) {
	if (svg) {
		svg += ',\n\t\t';
	}
	svg += i + ' = ' + paths[i];
}
name = '';
for (i in vars) {
	if (name) {
		name += ',\n\t\t';
	}
	name += '"' + i + '": ' + vars[i];
}
fs.writeFileSync('../dev/common/svgicos/svgicos.js', '"use strict";\ndefine(function(){\n\tvar ' + svg + ';\n\treturn {\n\t\t' + name + '\n\t};\n});', {
	encoding: 'utf8'
});
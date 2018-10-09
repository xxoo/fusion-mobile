! function () {
	'use strict';
	var g = typeof self === 'undefined' ? global : self,
		arrays = ['array', 'int8array', 'uint8array', 'uint8clampedarray', 'int16array', 'uint16array', 'int32array', 'uint32array', 'bigint64array', 'biguint64array', 'float32array', 'float64array'],
		esobjs = {
			'function': ['asyncfunction', 'generatorfunction', 'asyncgeneratorfunction'],
			'object': ['date', 'regexp', 'error', 'promise', 'map', 'weakmap', 'set', 'weakset', 'proxy', 'generator', 'asyncgenerator', 'dataview', 'arraybuffer', 'sharedarraybuffer'].concat(arrays)
		},
		wksbls = ['iterator', 'asyncIterator', 'match', 'replace', 'search', 'split', 'hasInstance', 'isConcatSpreadable', 'unscopables', 'species', 'toPrimitive', 'toStringTag'];
	String.prototype.parseJsex = function () {
		var m, l, r;
		if (this.substr(0, l = 4) === 'null') {
			r = {
				value: null,
				length: l
			};
		} else if (this.substr(0, l = 9) === 'undefined') {
			r = {
				value: undefined,
				length: l
			};
		} else if (this.substr(0, l = 8) === 'Infinity') {
			r = {
				value: Infinity,
				length: l
			};
		} else if (this.substr(0, l = 9) === '-Infinity') {
			r = {
				value: -Infinity,
				length: l
			};
		} else if (this.substr(0, l = 3) === 'NaN') {
			r = {
				value: NaN,
				length: l
			};
		} else if (this.substr(0, l = 4) === 'true') {
			r = {
				value: true,
				length: l
			};
		} else if (this.substr(0, l = 5) === 'false') {
			r = {
				value: false,
				length: l
			};
		} else if (m = this.match(/^(-?[1-9]\d*|0)n/)) {
			r = {
				value: BigInt(m[1]),
				length: m[0].length
			};
		} else if (m = this.match(/^(?:-?(?:[1-9](?:\.\d*[1-9])?[eE][-+]?[1-9]\d*|0\.\d*[1-9]?|[1-9]\d*(?:\.\d*[1-9])?)|0)/)) {
			r = {
				value: +m[0],
				length: m[0].length
			};
		} else if (m = this.match(/^"(?:(?:[^\x00-\x1f"]|\\")*?[^\\])??(?:\\\\)*"/)) {
			try {
				r = m[0].replace(/^"|\\[\\bnvfr"]|\\x[0-f]{2}|\\u[0-f]{4}|"$|\\/g, function (a) {
					if (a === '"') {
						return '';
					} else if (a === '\\\\') {
						return '\\';
					} else if (a === '\\"') {
						return '"';
					} else if (a === '\\b') {
						return '\b';
					} else if (a === '\\n') {
						return '\n';
					} else if (a === '\\v') {
						return '\v';
					} else if (a === '\\f') {
						return '\f';
					} else if (a === '\\r') {
						return '\r';
					} else if (a.length > 3) {
						return String.fromCharCode('0x' + a.substr(2));
					} else {
						throw SyntaxError('bad escape');
					}
				});
			} catch (e) {}
			if (r) {
				r = {
					value: r,
					length: m[0].length
				};
			}
		} else if (this.substr(0, l = 9) === 'new Date(') {
			m = this.substr(l).parseJsex();
			if (m && typeof m.value === 'number' && this.charAt(l += m.length) === ')') {
				r = {
					value: new Date(parseFloat(m.value)),
					length: l + 1
				};
			}
		} else if (this.substr(0, l = 7) === 'Symbol.') {
			for (m = 0; m < wksbls.length; m++) {
				if (this.substr(l, wksbls[m].length) === wksbls[m]) {
					r = {
						value: Symbol[wksbls[m]],
						length: l + wksbls[m].length
					};
					break;
				}
			}
		} else if (this.substr(0, l = 7) === 'Symbol(') {
			if (this.charAt(l) === ')') {
				r = {
					value: Symbol(),
					length: l + 1
				};
			} else {
				m = this.substr(l).parseJsex();
				if (m && typeof m.value === 'string') {
					l += m.length;
					if (this.charAt(l) === ')') {
						r = {
							value: Symbol(m.value),
							length: l + 1
						};
					}
				}
			}
		} else if (m = this.match(/^\/((?:\\\\)+|(?:[^\\\/]|[^\/][^\x00-\x1f]*?[^\\])(?:\\\\)*)\/(g?i?m?u?y?)/)) {
			try {
				r = {
					value: RegExp(m[1], m[2]),
					length: m[0].length
				};
			} catch (e) {}
		} else if (m = this.match(/^(Range|Reference|Syntax|Type|URI|Eval)?Error\(/)) {
			l = m[0].length;
			m = {
				g: m[1]
			};
			if (m.g === 'Range') {
				m.g = RangeError;
			} else if (m.g === 'Reference') {
				m.g = ReferenceError;
			} else if (m.g === 'Syntax') {
				m.g = SyntaxError;
			} else if (m.g === 'Type') {
				m.g = TypeError;
			} else if (m.g === 'URI') {
				m.g = URIError;
			} else if (m.g === 'Eval') {
				m.g = EvalError;
			} else {
				m.g = Error;
			}
			if (this.charAt(l) === ')') {
				r = {
					value: m.g(),
					length: l + 1
				};
			} else {
				m.f = this.substr(l).parseJsex();
				if (m.f && typeof m.f.value === 'string') {
					l += m.f.length;
					if (this.charAt(l) === ')') {
						r = {
							value: m.g(m.f.value),
							length: l + 1
						};
					}
				}
			}
		} else if (this.charAt(0) === '[') {
			l = 1;
			m = {
				l: true,
				e: true,
				q: false,
				n: false,
				f: undefined,
				g: []
			};
			while (!(m.n || (m.e && this.charAt(l) === ']'))) {
				if (m.q) {
					if (this.charAt(l) === ',') {
						l += 1;
						m.l = true;
						m.e = m.q = false;
						continue;
					}
				} else if (m.l) {
					m.f = this.substr(l).parseJsex();
					if (m.f) {
						l += m.f.length;
						m.g.push(m.f.value);
						m.l = false;
						m.e = m.q = true;
						continue;
					}
				}
				m.n = true;
			}
			if (!m.n) {
				r = {
					value: m.g,
					length: l + 1
				};
			}
		} else if (this.charAt(0) === '{') {
			l = 1;
			m = {
				l: true,
				e: true,
				q: false,
				n: false,
				f: undefined,
				m: '',
				g: {}
			};
			while (!(m.n || (m.e && this.charAt(l) === '}'))) {
				if (m.q) {
					if (this.charAt(l) === ',') {
						l += 1;
						m.l = true;
						m.e = m.q = false;
						continue;
					}
				} else if (m.l) {
					m.f = this.substr(l).parseJsex();
					if (m.f && typeof m.f.value === 'string' && !(m.f.value in m.g)) { //disallow index duplication
						l += m.f.length;
						m.m = m.f.value;
						if (this.charAt(l) === ':') {
							l += 1;
							m.f = this.substr(l).parseJsex();
							if (m.f) {
								l += m.f.length;
								m.g[m.m] = m.f.value;
								m.l = false;
								m.e = m.q = true;
								continue;
							}
						}
					}
				}
				m.n = true;
			}
			if (!m.n) {
				r = {
					value: m.g,
					length: l + 1
				};
			}
		}
		return r;
	};
	g.dataType = function (a) {
		var t;
		if (a == null) {
			return String(a);
		} else {
			t = typeof a;
			if (esobjs.hasOwnProperty(t)) {
				a = Object.prototype.toString.call(a).replace(/^\[object |\]$/g, '').toLowerCase();
				if (esobjs[t].indexOf(a) >= 0) {
					t = a;
				}
			}
			return t;
		}
	};
	g.toJsex = function (d) {
		var s, i;
		if (d == null) {
			s = String(d);
		} else {
			i = dataType(d);
			if (i === 'string') {
				s = jsEncode(d);
			} else if (['number', 'boolean'].indexOf(i) >= 0) {
				s = d.toString();
			} else if (i === 'symbol') {
				for (i = 0; i < wksbls.length; i++) {
					if (d === Symbol[wksbls[i]]) {
						s = 'Symbol.' + wksbls[i];
						break;
					}
				}
				if (!s) {
					s = d.toString();
					if (s.length > 8) {
						s = 'Symbol(' + jsEncode(s.substr(7, s.length - 8)) + ')';
					}
				}
			} else if (i === 'bigint') {
				s = d + 'n';
			} else if (i === 'date') {
				s = 'new Date(' + d.getTime() + ')';
			} else if (i === 'regexp') {
				s = '/' + (d.source ? d.source.replace(/[\x00-\x1f]/g, function (a) {
					var c;
					if (a === '\n') {
						return '\\n';
					} else if (a === '\v') {
						return '\\v';
					} else if (a === '\f') {
						return '\\f';
					} else if (a === '\r') {
						return '\\r';
					} else {
						c = a.charCodeAt(0);
						return (c < 16 ? '\\x0' : '\\x') + c.toString(16);
					}
				}).replace(/^(?=\/)/, '\\').replace(/[^\\](\\\\)*(?=\/)/g, '$&\\') : '(?:)') + '/';
				if (d.global) {
					s += 'g';
				}
				if (d.ignoreCase) {
					s += 'i';
				}
				if (d.multiline) {
					s += 'm';
				}
				if (d.unicode) {
					s += 'u';
				}
				if (d.sticky) {
					s += 'y';
				}
			} else if (i === 'error') {
				s = ['RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError', 'EvalError'].indexOf(d.name) < 0 ? 'Error' : d.name;
				s += '(';
				if (d.message) {
					s += jsEncode(String(d.message));
				}
				s += ')';
			} else if (arrays.indexOf(i) >= 0) {
				s = '[';
				for (i = 0; i < d.length; i++) {
					if (i > 0) {
						s += ',';
					}
					s += toJsex(d[i]);
				}
				s += ']';
			} else {
				s = '{';
				for (i in d) {
					if (d.hasOwnProperty(i)) {
						if (s.length > 1) {
							s += ',';
						}
						s += jsEncode(i) + ':' + toJsex(d[i]);
					}
				}
				s += '}';
			}
		}
		return s;
	};
	g.isEqual = function (o1, o2) {
		var i, n, t;
		if (o1 === o2) {
			return true;
		} else {
			t = dataType(o1);
			if (t === dataType(o2)) {
				if (t === 'regexp') {
					return o1.source === o2.source && o1.global === o2.global && o1.ignoreCase === o2.ignoreCase && o1.multiline === o2.multiline && o1.unicode === o2.unicode && o1.sticky === o2.sticky;
				} else if (t === 'error') {
					return o1.message = o2.message && o1.name === o2.name;
				} else if (t === 'date') {
					return o1.getTime() === o2.getTime();
				} else if (t === 'symbol') {
					return o1.toString() === o2.toString();
				} else if (t === 'object') {
					n = Object.keys(o1);
					if (n.length === Object.keys(o2).length) {
						for (i = 0; i < n.length; i++) {
							if (!o2.hasOwnProperty(n[i]) || !isEqual(o1[n[i]], o2[n[i]])) {
								return false;
							}
						}
						return true;
					} else {
						return false;
					}
				} else if (['map', 'set'].indexOf(t) >= 0) {
					if (o1.size === o2.size) {
						i = o1.entries();
						n = i.next();
						while (n.value) {
							if (!o2.has(n.value[0]) || (t === 'map' && !isEqual(n.value[1], o2.get(n.value[0])))) {
								return false;
							}
							n = i.next();
						}
						return true;
					} else {
						return false;
					}
				} else if (arrays.indexOf(t) >= 0) {
					if (o1.length === o2.length) {
						for (n = 0; n < o1.length; n++) {
							if (!isEqual(o1[n], o2[n])) {
								return false;
							}
						}
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
	};

	function jsEncode(str) {
		return '"' + str.replace(/[\\"\x00-\x1f]/g, function (a) {
			var c;
			if (a === '\\') {
				return '\\\\';
			} else if (a === '"') {
				return '\\"';
			} else if (a === '\b') {
				return '\\b';
			} else if (a === '\n') {
				return '\\n';
			} else if (a === '\v') {
				return '\\v';
			} else if (a === '\f') {
				return '\\f';
			} else if (a === '\r') {
				return '\\r';
			} else {
				c = a.charCodeAt(0);
				return (c < 16 ? '\\x0' : '\\x') + c.toString(16);
			}
		}) + '"';
	}
}();
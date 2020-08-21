! function () {
	'use strict';
	var g = typeof self === 'undefined' ? global : self,
		pmtobjs = ['String', 'Number', 'Boolean', 'Symbol', 'BigInt'],
		arrays = ['Array', 'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'BigInt64Array', 'BigUint64Array'],
		wksbls = ['iterator', 'asyncIterator', 'match', 'replace', 'search', 'split', 'hasInstance', 'isConcatSpreadable', 'unscopables', 'species', 'toPrimitive', 'toStringTag'];

	//deserialize jsex, support JSON string
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
		} else if (this.substr(0, l = 9) === 'new Date(') {
			m = this.substr(l).parseJsex();
			if (m && typeof m.value === 'number' && this.charAt(l += m.length) === ')') {
				r = {
					value: new Date(parseFloat(m.value)),
					length: l + 1
				};
			}
		} else if (this.substr(0, l = 6) === 'Symbol') {
			if (this.charAt(l) === '(') {
				l += 1;
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
			} else if (this.substr(l, 5) === '.for(') {
				l += 5;
				m = this.substr(l).parseJsex();
				if (m && typeof m.value === 'string') {
					l += m.length;
					if (this.charAt(l) === ')') {
						r = {
							value: Symbol.for(m.value),
							length: l + 1
						};
					}
				}
			} else if (this.charAt(l) === '.') {
				l += 1;
				for (m = 0; m < wksbls.length; m++) {
					if (this.substr(l, wksbls[m].length) === wksbls[m]) {
						r = {
							value: Symbol[wksbls[m]],
							length: l + wksbls[m].length
						};
						break;
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
		} else if (m = this.match(/^"(?:(?:[^\x00-\x08\x0a-\x1f\x7f\xff"]|\\")*?[^\\\x00-\x08\x0a-\x1f\x7f\xff])??(?:\\\\)*"/)) {
			try {
				r = m[0].replace(/^"|\\[\\btnvfr"]|\\x[0-f]{2}|\\u[0-f]{4}|"$|\\/g, function (a) {
					if (a === '"') {
						return '';
					} else if (a === '\\\\') {
						return '\\';
					} else if (a === '\\"') {
						return '"';
					} else if (a === '\\b') {
						return '\b';
					} else if (a === '\\t') {
						return '	';
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
			if (r !== undefined) {
				r = {
					value: r,
					length: m[0].length
				};
			}
		} else if (m = this.match(/^\/((?:\\\\)+|(?:[^\\\/]|[^\/][^\x00-\x08\x0a-\x1f\x7f\xff]*?[^\\\x00-\x08\x0a-\x1f\x7f\xff])(?:\\\\)*)\/(g?i?m?u?y?)/)) {
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
		}
		return r;
	};
	//reference types are the names of their constructor, such as String, Uint8Array, AsyncFunction
	//primitive types are lowercased, such as string, bigint, null
	g.dataType = function (a) {
		var t;
		if (a == null) {
			return String(a);
		} else {
			t = typeof a;
			if (['function', 'object'].indexOf(t) >= 0) {
				t = Object.prototype.toString.call(a).replace(/^\[object |\]$/g, '');
			}
			return t;
		}
	};
	//serialize js data to jsex
	g.toJsex = function (d) {
		var s, i, n;
		if (d == null) {
			s = String(d);
		} else {
			i = dataType(d);
			if (pmtobjs.indexOf(i) >= 0) {
				d = d.valueOf();
				i = i.toLowerCase();
			}
			if (i === 'string') {
				s = strEncode(d);
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
					s = Symbol.keyFor(d);
					if (typeof s === 'string') {
						s = 'Symbol.for(' + strEncode(s) + ')';
					} else if (Symbol.prototype.hasOwnProperty('description')) {
						s = 'Symbol(';
						if (d.description) {
							s += strEncode(s.description);
						}
						s += ')';
					} else {
						s = d.toString();
						if (s.length > 8) {
							s = 'Symbol(' + strEncode(s.substr(7, s.length - 8)) + ')';
						}
					}
				}
			} else if (i === 'bigint') {
				s = d + 'n';
			} else if (i === 'Date') {
				s = 'new Date(' + d.getTime() + ')';
			} else if (i === 'RegExp') {
				s = '/' + (d.source ? d.source.replace(/[\x00-\x08\x0a-\x1f\x7f\xff]/g, function (a) {
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
			} else if (i === 'Error') {
				s = ['RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError', 'EvalError'].indexOf(d.name) < 0 ? 'Error' : d.name;
				s += '(';
				if (d.message) {
					s += strEncode(String(d.message));
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
				n = Object.getOwnPropertyNames(d);
				for (i = 0; i < n.length; i++) {
					if (i > 0) {
						s += ',';
					}
					s += strEncode(n[i]) + ':' + toJsex(d[n[i]]);
				}
				s += '}';
			}
		}
		return s;
	};
	//isEqual returns true if toJsex(o1) equals toJsex(o2)
	//object key order does not matter
	g.isEqual = function (o1, o2) {
		var i, n,
			t1 = dataType(o1),
			t2 = dataType(o2);
		if (pmtobjs.indexOf(t1) >= 0) {
			o1 = o1.valueOf();
			t1 = t1.toLowerCase();
		}
		if (pmtobjs.indexOf(t2) >= 0) {
			o2 = o2.valueOf();
			t2 = t2.toLowerCase();
		}
		if (o1 === o2 || (Number.isNaN(o1) && Number.isNaN(o2))) {
			return true;
		} else if (arrays.indexOf(t1) >= 0) {
			if (arrays.indexOf(t2) >= 0 && o1.length === o2.length) {
				for (i = 0; i < o1.length; i++) {
					if (!isEqual(o1[i], o2[i])) {
						return;
					}
				}
				return true;
			}
		} else if (t1 === t2) {
			if (t1 === 'Date') {
				return o1.getTime() === o2.getTime();
			} else if (['RegExp', 'Error', 'symbol'].indexOf(t1) >= 0) {
				return toJsex(o1) === toJsex(o2);
			} else if (t1 === 'Object') {
				n = Object.getOwnPropertyNames(o1);
				if (n.length === Object.getOwnPropertyNames(o2).length) {
					for (i = 0; i < n.length; i++) {
						if (!o2.hasOwnProperty(n[i]) || !isEqual(o1[n[i]], o2[n[i]])) {
							return;
						}
					}
					return true;
				}
			}
		}
	};

	function strEncode(str) {
		return '"' + str.replace(/[\\"\x00-\x08\x0a-\x1f\x7f\xff]/g, function (a) {
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
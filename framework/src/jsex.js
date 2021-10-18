//jsex version: 1.0.27
//https://github.com/xxoo/jsex
(() => {
	'use strict';
	const blanklength = str => str.match(/^(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/|\/\/.*)*/)[0].length,
		//assume a function has no syntax error, then we can use some imrigorous detection to seek out the end of its name or params
		//t = 0 for name, t = 1 for params
		sectionlength = (s, t, forof) => {
			const p = [
				['[', ']', '!~+-*=<>|&{}?:,;(', /^([\d\w$.]+)|[!~+\-*=<>|&{}?:,;()]+/],
				['(', ')', '!~+-*=<>|&{}?:,;[', /^([\d\w$.]+)|[!~+\-*=<>|&{}?:,;[\]]+/]
			][t];
			let e,
				i = blanklength(s.substring(1)) + 1;
			while (s[i] !== p[1]) {
				if (s[i] === '/') {
					if (e) {
						++i;
						e = false;
					} else {
						i += s.substring(i).match(/^\/(?!\*)(?:[^[/\\\r\n\u2028\u2029]|\\.|\[(?:[^\r\n\u2028\u2029\]\\]|\\.)*\])+\//)[0].length;
						e = true;
					}
				} else if (s[i] === '"') {
					i += s.substring(i).match(/^"(?:[^\r\n"\\]|\\(?:\r\n?|[^\r]))*"/)[0].length;
					e = true;
				} else if (s[i] === '\'') {
					i += s.substring(i).match(/^'(?:[^\r\n'\\]|\\(?:\r\n?|[^\r]))*'/)[0].length;
					e = true;
				} else if (s[i] === '`') {
					i += s.substring(i).match(/^`(?:[^`\\]|\\[\s\S])*`/)[0].length;
					e = true;
				} else if (s[i] === p[0]) {
					i += sectionlength(s.substring(i), t, t && forof === 1 ? 2 : 0);
					e = true;
				} else {
					const m = s.substring(i).match(p[3]);
					i += m[0].length;
					//we need to detect for...of statement
					if (forof === 0) {
						if (m[0] === 'for') {
							forof = 1;
						}
					} else if (forof === 1) {
						if (m[0] === '(') {
							forof = 2;
						} else if (m[0] !== 'await') {
							forof = 0;
						}
					} else if (forof === 2) {
						if (m[1]) {
							if (!['const', 'let', 'var'].includes(m[0])) {
								forof = 3;
							}
						} else {
							forof = 0;
						}
					} else if (forof === 3) {
						forof = m[0] === 'of' ? 4 : 0;
					} else {
						forof = 0;
					}
					e = forof === 4 ? false : !['extends', 'yield', 'await', 'new', 'delete', 'void', 'typeof', 'case', 'throw', 'return', 'in', 'else', 'do', '...'].includes(m[0]) && !p[2].includes(s[i - 1]);
				}
				i += blanklength(s.substring(i));
			}
			return i + 1;
		},
		escapeStr = str => '"' + str.replace(/[\ud800-\udbff][\udc00-\udfff]|([\ud800-\udfff])|([\r\n\\"])/g, (p0, p1, p2) => {
			if (p1) {
				return '\\u' + p1.charCodeAt(0).toString(16);
			} else if (p2) {
				return {
					'"': '\\"',
					'\n': '\\n',
					'\r': '\\r',
					'\\': '\\\\',
					__proto__: null
				}[p2];
			} else {
				return p0;
			}
		}) + '"',
		escapeStrJson = str => '"' + str.replace(/[\ud800-\udbff][\udc00-\udfff]|([\ud800-\udfff])|([\0-\37\\"])/g, (p0, p1, p2) => {
			if (p1) {
				return '\\u' + p1.charCodeAt(0).toString(16);
			} else if (p2) {
				const n = {
					'"': '\\"',
					'\n': '\\n',
					'\r': '\\r',
					'\t': '\\t',
					'\b': '\\b',
					'\f': '\\f',
					'\\': '\\\\',
					__proto__: null
				};
				if (p2 in n) {
					return n[p2];
				} else {
					const c = p2.charCodeAt(0);
					return '\\u00' + (c < 16 ? '0' : '') + c.toString(16);
				}
			} else {
				return p0;
			}
		}) + '"',
		getRealType = data => {
			const t = Object.prototype.toString.call(data);
			return t.substring(8, t.length - 1);
		},
		realToJsex = (data, options, log) => {
			let s;
			if (data == null) {
				s = String(data);
			} else {
				let t = typeof data;
				if (t === 'boolean') {
					s = data.toString();
				} else if (t === 'string') {
					s = options.jsonCompatible ? escapeStrJson(data) : escapeStr(data);
				} else if (t === 'number') {
					s = Object.is(data, -0) ? '-0' : data.toString();
				} else if (t === 'bigint') {
					s = data + 'n';
				} else if (t === 'symbol') {
					s = Symbol.keyFor(data);
					if (typeof s === 'string') {
						s = 'Symbol.for(' + escapeStr(s) + ')';
					} else {
						if ('description' in Symbol.prototype) {
							s = data.description;
						} else {
							s = data.toString();
							s = s.length > 8 ? s.substring(7, s.length - 1) : '';
						}
						if (!(t = s.match(/^Symbol\.([\w$][\d\w$]*)$/)) || Symbol[t[1]] !== data) {
							s = 'Symbol(' + (s ? escapeStr(s) : '') + ')';
						}
					}
				} else if (t === 'function') {
					let v = data.toString();
					if (/\{\s*\[\w+(?: \w+)+\]\s*\}$/.test(v)) {
						if (options.debug) throw TypeError('unable to serialize native function');
					} else if (/^class(?![\d\w$])/.test(v)) {
						if (options.implicitConversion) {
							s = escapeStr(v);
						} else if (options.debug) {
							throw TypeError('class is not supported by default');
						}
					} else {
						//these constructors are not global by default
						const c = {
							AsyncFunction: '(async()=>{}).constructor',
							GeneratorFunction: 'function*(){}.constructor',
							AsyncGeneratorFunction: 'async function*(){}.constructor',
							__proto__: null
						};
						t = getRealType(data);
						if (t[0] === 'A') {
							v = v.replace(/^async(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/|\/\/.*)*/, '');
						}
						v = v.replace(/^(?:function(?![\d\w$])(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/|\/\/.*)*)?(?:\*(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/|\/\/.*)*)?/, '');
						if (v[0] === '[') {
							v = v.substring(sectionlength(v, 0, 0));
							v = v.substring(blanklength(v));
						} else {
							v = v.replace(/(?:[\w$][\d\w$]*(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/|\/\/.*)*(?=\())?/, '');
						}
						if (v[0] === '(') {
							const l = sectionlength(v, 1, 0);
							s = v.substring(0, l).replace(/^\(\s*|\s*\)$/g, '');
							v = v.substring(l);
						} else {
							s = v.match(/^[\w$][\d\w$]*/)[0];
							v = v.substring(s.length);
						}
						v = v.substring(blanklength(v)).replace(/^=>(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/|\/\/.*)*/, '');
						v = v[0] === '{' ? v.replace(/^\{\s*|\s*\}$/g, '') : 'return ' + v;
						s = (t in c ? c[t] : 'Function') + (v ? `(${s ? escapeStr(s) + ',' : ''}${escapeStr(v)})` : '()');
					}
				} else {
					t = getRealType(data);
					if (t === 'RegExp') {
						s = data.toString().replace(/[\ud800-\udbff][\udc00-\udfff]|([\ud800-\udfff])/g, (p0, p1) => p1 ? '\\u' + p1.charCodeAt(0).toString(16) : p0);
					} else if (t === 'Date') {
						s = 'new Date(' + data.getTime() + ')';
					} else if (t === 'Error' && data.name !== 'AggregateError') {
						s = (['EvalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError'].includes(data.name) ? data.name : t) + '(';
						if (data.message) {
							s += escapeStr(data.message);
						}
						s += ')';
					} else if (log.has(data)) {
						if (options.debug) throw TypeError('circular structure detected');
					} else {
						log.add(data);
						if (t === 'Map') {
							const c = [];
							for (const n of data) {
								const v = realToJsex(n[0], options, log);
								if (v !== undefined) {
									const m = realToJsex(n[1], options, log);
									if (m !== undefined) {
										c.push('[' + v + ',' + m + ']');
									}
								}
							}
							s = 'new Map' + (c.length ? '([' + c.join(',') + '])' : '');
						} else if (t === 'Set') {
							const c = [];
							for (const n of data) {
								const v = realToJsex(n, options, log);
								if (v !== undefined) {
									c.push(v);
								}
							}
							if (options.sorting) {
								c.sort();
							}
							s = 'new Set' + (c.length ? '([' + c.join(',') + '])' : '');
						} else if (t === 'Error') {
							if (Array.isArray(data.errors)) {
								const v = realToJsex(data.errors, options, log);
								if (v !== undefined) {
									s = 'AggregateError(' + v;
									if (data.message) {
										s += ',' + escapeStr(data.message);
									}
									s += ')';
								}
							} else if (options.debug) {
								throw TypeError('bad AggregateError');
							}
						} else if (['Array', 'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'BigInt64Array', 'BigUint64Array'].includes(t)) {
							s = '[';
							for (let i = 0; i < data.length; ++i) {
								if (i > 0) {
									s += ',';
								}
								const v = realToJsex(data[i], options, log);
								s += options.jsonCompatible && v === undefined ? 'null' : v;
							}
							s += ']';
							if (t !== 'Array') {
								s = 'new ' + t + '(' + s + ')';
							}
						} else if (options.implicitConversion && typeof data.valueOf === 'function' && (t = data.valueOf()) !== data) {
							s = realToJsex(t, options, log);
						} else {
							const n = Object.getOwnPropertyNames(data),
								m = Object.getOwnPropertySymbols(data);
							let i = 0;
							while (i < n.length) {
								const v = realToJsex(data[n[i]], options, log);
								if (v === undefined) {
									n.splice(i, 1);
								} else {
									n[i] = (options.jsonCompatible ? escapeStrJson(n[i]) : n[i] === '__proto__' ? '["__proto__"]' : escapeStr(n[i])) + ':' + v;
									++i;
								}
							}
							i = 0;
							while (i < m.length) {
								const v = realToJsex(data[m[i]], options, log);
								if (v === undefined) {
									m.splice(i, 1);
								} else {
									m[i] = '[' + realToJsex(m[i]) + ']:' + v;
									++i;
								}
							}
							if (options.sorting) {
								n.sort();
								m.sort();
							}
							s = '{' + n.join(',');
							if (n.length && m.length) {
								s += ',';
							}
							s += m.join(',');
							if (!options.jsonCompatible) {
								if (n.length || m.length) {
									s += ',';
								}
								s += '"__proto__":null';
							}
							s += '}';
						}
						log.delete(data);
					}
				}
			}
			return s;
		};

	//serialize to jsex
	//sorting: whether sorting keys in Map, Set and Object
	//implicitConversion: Whether trying to resolve unrecognized type by calling its valueOf method
	//jsonCompatible: whether generate JSON compatible string. this argument makes sance only if data doesn't contain extended types
	//debug: whether throw error when meet unexpected data
	globalThis.toJsex = (data, options = { __proto__: null }) => realToJsex(data, options, new Set);

	//deserialize jsex, support JSON string
	String.prototype.parseJsex = function (forbiddenMethods = ['toString', 'toJSON', 'valueOf', Symbol.asyncIterator, Symbol.hasInstance, Symbol.iterator, Symbol.matchAll, Symbol.replace, Symbol.search, Symbol.split, Symbol.toPrimitive]) {
		const p = blanklength(this),
			str = this.substring(p);
		let m, l, r;
		if (str.substring(0, l = 4) === 'null') {
			r = {
				__proto__: null,
				length: l + p,
				value: null
			};
		} else if (str.substring(0, l = 9) === 'undefined') {
			r = {
				__proto__: null,
				length: l + p,
				value: undefined
			};
		} else if (str.substring(0, l = 3) === 'NaN') {
			r = {
				__proto__: null,
				length: l + p,
				value: NaN
			};
		} else if (str.substring(0, l = 4) === 'true') {
			r = {
				__proto__: null,
				length: l + p,
				value: true
			};
		} else if (str.substring(0, l = 5) === 'false') {
			r = {
				__proto__: null,
				length: l + p,
				value: false
			};
		} else if (str.substring(0, l = 9) === 'new Date(') {
			m = str.substring(l).parseJsex(forbiddenMethods);
			if (m && typeof m.value === 'number' && str[l += m.length] === ')') {
				r = {
					__proto__: null,
					length: l + p + 1,
					value: new Date(m.value)
				};
			}
		} else if (str.substring(0, l = 15) === 'AggregateError(') {
			const n = str.substring(l).parseJsex(forbiddenMethods);
			if (n && Array.isArray(n.value)) {
				l += n.length;
				if (str[l] === ',') {
					l += 1;
					m = str.substring(l).parseJsex(forbiddenMethods);
					if (m && typeof m.value === 'string') {
						l += m.length;
						if (str[l] === ')') {
							r = {
								__proto__: null,
								length: l + p + 1,
								value: AggregateError(n.value, m.value)
							};
						}
					}
				} else if (str[l] === ')') {
					r = {
						__proto__: null,
						length: l + p + 1,
						value: AggregateError(n.value)
					};
				}
			}
		} else if (str.substring(0, l = 7) === 'new Set') {
			if (str[l] === '(') {
				l += 1;
				m = str.substring(l).parseJsex(forbiddenMethods);
				if (m && Array.isArray(m.value) && str[l += m.length] === ')') {
					r = {
						__proto__: null,
						length: l + p + 1,
						value: new Set(m.value)
					};
				}
			} else {
				r = {
					__proto__: null,
					length: l + p,
					value: new Set
				};
			}
		} else if (str.substring(0, l = 7) === 'new Map') {
			if (str[l] === '(') {
				l += 1;
				m = str.substring(l).parseJsex(forbiddenMethods);
				if (m && Array.isArray(m.value) && str[l += m.length] === ')') {
					for (const i of m.value) {
						if (!Array.isArray(i) || i.length !== 2) {
							m = undefined;
							break;
						}
					}
					if (m) {
						r = {
							__proto__: null,
							length: l + p + 1,
							value: new Map(m.value)
						};
					}
				}
			} else {
				r = {
					__proto__: null,
					length: l + p,
					value: new Map
				};
			}
		} else if (str.substring(0, l = 6) === 'Symbol') {
			if (str[l] === '(') {
				l += 1;
				if (str[l] === ')') {
					r = {
						__proto__: null,
						length: l + p + 1,
						value: Symbol()
					};
				} else {
					m = str.substring(l).parseJsex(forbiddenMethods);
					if (m && typeof m.value === 'string') {
						l += m.length;
						if (str[l] === ')') {
							r = {
								__proto__: null,
								length: l + p + 1,
								value: Symbol(m.value)
							};
						}
					}
				}
			} else if (str.substring(l, l + 5) === '.for(') {
				l += 5;
				m = str.substring(l).parseJsex(forbiddenMethods);
				if (m && typeof m.value === 'string') {
					l += m.length;
					if (str[l] === ')') {
						r = {
							__proto__: null,
							length: l + p + 1,
							value: Symbol.for(m.value)
						};
					}
				}
			} else if ((m = str.substring(l).match(/^\.([\w$][\d\w$]*)/)) && typeof Symbol[m[1]] === 'symbol') {
				r = {
					__proto__: null,
					length: l + p + m[0].length,
					value: Symbol[m[1]]
				};
			}
		} else if (str[0] === '[') {
			let mf,
				ml = true,
				me = true,
				mq = false,
				mn = false;
			l = 1;
			m = [];
			while (!(mn || (me && str[l] === ']'))) {
				if (mq) {
					if (str[l] === ',') {
						l += 1;
						ml = true;
						me = mq = false;
						continue;
					}
				} else if (ml) {
					mf = str.substring(l).parseJsex(forbiddenMethods);
					if (mf) {
						l += mf.length;
						l += blanklength(str.substring(l));
						m.push(mf.value);
						ml = false;
						me = mq = true;
						continue;
					}
				}
				mn = true;
			}
			if (!mn) {
				r = {
					__proto__: null,
					length: l + p + 1,
					value: m
				};
			}
		} else if (str[0] === '{') {
			let mf, mm,
				ml = true,
				me = true,
				mq = false,
				mn = false;
			l = 1;
			m = { __proto__: null };
			while (!(mn || (me && str[l] === '}'))) {
				if (mq) {
					if (str[l] === ',') {
						l += 1;
						ml = true;
						me = mq = false;
						continue;
					}
				} else if (ml) {
					mf = str.substring(l).parseJsex(forbiddenMethods);
					if (mf && (mm = typeof mf.value === 'string') || (Array.isArray(mf.value) && mf.value.length === 1 && ['symbol', 'string'].includes(typeof mf.value[0]))) {
						l += mf.length;
						l += blanklength(str.substring(l));
						mm = mm ? mf.value === '__proto__' ? null : mf.value : mf.value[0];
						if (str[l] === ':') {
							l += 1;
							mf = str.substring(l).parseJsex(forbiddenMethods);
							if (mf) {
								l += mf.length;
								l += blanklength(str.substring(l));
								if (mm !== null && (typeof mf.value !== 'function' || !Array.isArray(forbiddenMethods) || !forbiddenMethods.includes(mm))) {
									m[mm] = mf.value;
								}
								ml = false;
								me = mq = true;
								continue;
							}
						}
					}
				}
				mn = true;
			}
			if (!mn) {
				r = {
					__proto__: null,
					length: l + p + 1,
					value: m
				};
			}
		} else if (m = str.match(/^(-?)([1-9]\d*|0(?:[bB][01]+|[oO][0-7]+|[xX][\dA-Fa-f]+)?)n/)) {
			r = {
				__proto__: null,
				length: m[0].length + p,
				value: m[1] ? -BigInt(m[2]) : BigInt(m[2])
			};
		} else if (m = str.match(/^(-?)(Infinity|0(?:[bB][01]+|[oO][0-7]+|[xX][\dA-Fa-f]+)|[1-9](?:\.\d+)?[eE][-+]?[1-9]\d*|(?:[1-9]\d*|0)(?:\.\d+)?)/)) {
			r = {
				__proto__: null,
				length: m[0].length + p,
				value: m[1] ? -m[2] : +m[2]
			};
		} else if (m = str.match(/^"((?:[^\r\n"\\]|\\(?:\r\n?|[^\r]))*)"/)) {
			try {
				r = {
					__proto__: null,
					length: m[0].length + p,
					value: m[1].replace(/\\(?:([0-3]?[0-7]{1,2})|x([\dA-Fa-f]{2})|u(?:([\dA-Fa-f]{4})|\{((?:10|[\dA-Fa-f])?[\dA-Fa-f]{1,4})\})|(\r\n?|\n)|([^\r\n]))/g, (p0, p1, p2, p3, p4, p5, p6) => {
						if (p1) {
							return String.fromCharCode('0o' + p1);
						} else if (p2 || p3) {
							return String.fromCharCode('0x' + (p2 | p3));
						} else if (p4) {
							return String.fromCodePoint('0x' + p4);
						} else if (p5) {
							return '';
						} else if (p6 === 'b') {
							return '\b';
						} else if (p6 === 't') {
							return '\t';
						} else if (p6 === 'n') {
							return '\n';
						} else if (p6 === 'v') {
							return '\v';
						} else if (p6 === 'f') {
							return '\f';
						} else if (p6 === 'r') {
							return '\r';
						} else if ('ux'.includes(p6)) {
							throw SyntaxError('Invalid Unicode escape sequence');
						} else {
							return p6;
						}
					})
				};
			} catch (e) { }
		} else if (m = str.match(/^\/(?!\*)((?:[^[/\\\r\n\u2028\u2029]|\\.|\[(?:[^\r\n\u2028\u2029\]\\]|\\.)*\])+)\/(g?i?m?s?u?y?)/)) {
			try {
				r = {
					__proto__: null,
					length: m[0].length + p,
					value: RegExp(m[1], m[2])
				};
			} catch (e) { }
		} else if (m = str.match(/^new (Int8|Uint8|Uint8Clamped|Int16|Uint16|Int32|Uint32|Float32|Float64|BigInt64|BigUint64)Array\(/)) {
			l = m[0].length;
			const f = str.substring(l).parseJsex(forbiddenMethods);
			if (f && Array.isArray(f.value) && str[l += f.length] === ')') {
				try {
					r = {
						__proto__: null,
						length: l + p + 1,
						value: new globalThis[m[1] + 'Array'](f.value)
					};
				} catch (e) { }
			}
		} else if (m = str.match(/^(?:((?:Eval|Range|Reference|Syntax|Type|URI)?Error|Function)|(?:(\(async ?\( ?\) ?=> ?\{ ?\}\))|(async )?function\* ?\( ?\) ?\{ ?\})\.constructor)\(/)) {
			l = m[0].length;
			const c = m[1] ? globalThis[m[1]] : m[2] ? (async () => { }).constructor : m[3] ? async function* () { }.constructor : function* () { }.constructor;
			if (str[l] === ')') {
				r = {
					__proto__: null,
					length: l + p + 1,
					value: c()
				};
			} else {
				const n = str.substring(l).parseJsex(forbiddenMethods);
				if (n && typeof n.value === 'string') {
					l += n.length;
					if (str[l] === ')') {
						try {
							r = {
								__proto__: null,
								length: l + p + 1,
								value: c(n.value)
							};
						} catch (e) { }
					} else if (str[l] === ',') {
						l += 1;
						const b = str.substring(l).parseJsex(forbiddenMethods);
						if (b && typeof b.value === 'string') {
							l += b.length;
							if (str[l] === ')') {
								try {
									r = {
										__proto__: null,
										length: l + p + 1,
										value: c(n.value, b.value)
									};
								} catch (e) { }
							}
						}
					}
				}
			}
		}
		return r;
	};
})();
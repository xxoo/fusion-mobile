/* touchSlider 0.1
 * usage:
 *		var touchslider = require('path/to/touchslider');
 *		var slider = [new] touchsilder([container_dom]);
 *		slider.add(content_com);
 *		slider.onchange = function(){
 *			var current = slider.current;
 *			...
 *		};
 */

'use strict';
define(['common/pointerevents/pointerevents'], function(pointerevents) {
	var touchslider, tmp, tmp1;
	if ('transition' in document.documentElement.style) {
		tmp1 = 'transition';
		tmp = 'transitionend';
	} else {
		tmp1 = 'webkitTransition';
		tmp = 'webkitTransitionEnd';
	}
	touchslider = function(container, contents, idx) {
		if (this instanceof touchslider) {
			var i, peo,
				self = this,
				vars = {};
			this.pushStack = []; //for adding elements while sliding
			this.removeStack = []; //for removing elements while sliding
			if (container) {
				this.container = container;
				if (getComputedStyle(container).position === 'static') {
					container.style.position = 'relative';
				}
			} else {
				this.container = document.createElement('div');
				this.container.style.position = 'relative';
			}
			this.container.style.overflow = 'hidden';
			this.container.style.userSelect = 'none';
			this.invisible = this.container.appendChild(document.createElement('div'));
			this.invisible.style.position = 'absolute';
			this.invisible.style.visibility = 'hidden';
			this.subcontainer = this.container.appendChild(document.createElement('div'));
			this.subcontainer.style.position = 'absolute';
			this.subcontainer.style.width = '200%';
			this.subcontainer.style.height = '100%';
			this.subcontainer.style.left = this.subcontainer.style.top = 0;
			this.subcontainer.addEventListener(tmp, function(evt) {
				slided.call(this, evt, self);
			}, false);
			this.container.addEventListener('dragstart', cancelEvt, false);
			this.container.addEventListener('scroll', noscroll, false);
			this.container.addEventListener('click', chkClick, true);
			peo = pointerevents(this.container, touchBegin);
			if (contents instanceof Array && contents.length > 0) {
				this.children = contents;
				if (typeof idx === 'number' && idx >= 0 && idx < contents.length) {
					this.current = idx;
				} else {
					this.current = 0;
				}
				for (i = 0; i < contents.length; i++) {
					contents[i].style.width = '50%';
					contents[i].style.height = '100%';
					contents[i].style.display = 'inline-block';
					if (i === this.current) {
						this.subcontainer.appendChild(contents[i]);
					} else {
						this.invisible.appendChild(contents[i]);
					}
				}
			} else {
				this.current = undefined;
				this.children = [];
			}
		} else {
			return new touchslider(container);
		}

		function touchBegin(evt) {
			return bg(evt, self, peo, vars);
		}

		function chkClick(evt) {
			if (self.sliding) {
				evt.preventDefault();
				evt.stopPropagation();
			}
		}
	};
	touchslider.prototype.rate = 4000;
	//animation duration
	touchslider.prototype.duration = 400;
	//the minimal touch movement in x to start sliding.
	//if sliding begins, scrolling will be disabled in the entire document till it is end
	touchslider.prototype.minVal = 5;
	touchslider.prototype.add = function(o) {
		var result;
		if (this.sliding) { //will push to children when sliding ends
			this.pushStack.push(o);
		} else {
			result = this.children.length;
			o.style.width = '50%';
			o.style.height = '100%';
			o.style.display = 'inline-block';
			this.children.push(o);
			if (result) {
				if (this.subcontainer.childNodes.length === 2) {
					if (this.current === result - 1 && this.subcontainer.firstChild === this.children[this.current]) {
						this.invisible.appendChild(this.subcontainer.firstChild);
						this.subcontainer.insertBefore(o, this.subcontainer.lastChild);
					} else if (this.current === 0 && this.subcontainer.lastChild === this.children[this.current]) {
						this.invisible.appendChild(this.subcontainer.lastChild);
						this.subcontainer.appendChild(o);
					} else {
						this.invisible.appendChild(o);
					}
				} else {
					this.invisible.appendChild(o);
				}
				fireEvent(this, 'change', {
					length: true
				});
			} else {
				this.subcontainer.appendChild(o);
				this.current = 0;
				fireEvent(this, 'change', {
					current: true,
					length: true
				});
			}
		}
		return result;
	};
	touchslider.prototype.remove = function(i) {
		var result;
		if (this.sliding) {
			if (typeof i === 'number') {
				i = this.children[i];
			}
			if (this.removeStack.indexOf(i) < 0) {
				this.removeStack.push(i);
			}
		} else if (this.children.length > 0) {
			if (typeof i !== 'number') {
				i = this.children.indexOf(i);
			}
			i = getPos(i, this.children.length);
			result = this.children.splice(i, 1)[0];
			if (this.current === i) {
				if (this.subcontainer.childNodes.length === 2) {
					if (this.children.length > 1) {
						if (result === this.subcontainer.firstChild) {
							this.current = getPos(i - 1, this.children.length);
							this.subcontainer.insertBefore(this.children[this.current], result);
						} else {
							this.current = getPos(i, this.children.length);
							this.subcontainer.appendChild(this.children[this.current]);
						}
					} else {
						this.current = 0;
						this.subcontainer.style.left = 0;
					}
				} else {
					if (this.children.length > 0) {
						this.current = getPos(i, this.children.length);
						this.subcontainer.appendChild(this.children[this.current]);
					} else {
						this.current = undefined;
					}
				}
				this.subcontainer.removeChild(result);
				fireEvent(this, 'change', {
					current: true,
					length: true
				});
			} else {
				if (result.parentNode === this.subcontainer) {
					if (this.children.length > 1) {
						if (result === this.subcontainer.firstChild) {
							this.subcontainer.insertBefore(this.children[getPos(i - 1, this.children.length)], result);
						} else {
							this.subcontainer.appendChild(this.children[getPos(i, this.children.length)]);
						}
					} else {
						this.subcontainer.removeChild(result);
						this.subcontainer.style.left = 0;
					}
					this.subcontainer.removeChild(result);
				} else {
					this.invisible.removeChild(result);
				}
				if (this.current > i) {
					this.current -= 1;
					fireEvent(this, 'change', {
						current: true,
						length: true
					});
				} else {
					fireEvent(this, 'change', {
						length: true
					});
				}
			}
		}
		return result;
	};
	touchslider.prototype.clear = function() {
		var i;
		if (this.sliding) {
			this.removeStack = this.children.slice(0);
			this.pushStack = [];
		} else {
			while (this.children.length) {
				this.remove(0);
			}
		}
	};
	touchslider.prototype.slideTo = function(i, silent) {
		var result;
		if (this.subcontainer.childNodes.length === 1 && this.children.length > 1) {
			i = getPos(i, this.children.length);
			if (i !== this.current) {
				if (silent) {
					this.invisible.appendChild(this.children[this.current]);
					this.subcontainer.appendChild(this.children[i]);
				} else {
					if ((i === 0 && this.current === this.children.length - 1) || i > this.current) {
						this.subcontainer.appendChild(this.children[i]);
						beginSlide(this, false);
					} else {
						this.subcontainer.insertBefore(this.children[i], this.children[this.current]);
						this.subcontainer.style.left = '-100%';
						beginSlide(this, true);
					}
				}
				this.current = i;
				fireEvent(this, 'change', {
					current: true
				});
			}
			result = true;
		} else {
			result = false;
		}
		return result;
	};
	touchslider.prototype.startPlay = function(delay) {
		this.stopPlay();
		this.delay = delay;
		restartTimer(this);
	};
	touchslider.prototype.stopPlay = function() {
		var result;
		if (this.delay) {
			delete this.delay;
			if (this.timer) {
				clearTimeout(this.timer);
				delete this.timer;
			}
			result = true;
		} else {
			result = false;
		}
		return result;
	};
	return touchslider;

	function beginSlide(obj, r) {
		var t, n;
		if (r) {
			t = Math.round(Math.sqrt(obj.subcontainer.offsetLeft * -1 / obj.container.clientWidth) * obj.duration);
			n = 0;
		} else {
			t = Math.round(Math.sqrt((obj.container.offsetWidth + obj.subcontainer.offsetLeft) / obj.container.clientWidth) * obj.duration);
			n = '-100%';
		}
		if (t > 0) {
			obj.sliding = true;
			obj.subcontainer.style[tmp1] = 'left ' + t + 'ms ease-in-out';
			obj.subcontainer.style.left = n;
		} else {
			restartTimer(obj);
		}
	}

	function slided(evt, obj) {
		if (evt.target === this) { //ios also captures this event on subnodes
			obj.invisible.appendChild(this.style.left === '-100%' ? this.firstChild : this.lastChild);
			this.style[tmp1] = '';
			this.style.left = 0;
			obj.sliding = false;
			while (obj.removeStack.length > 0) {
				obj.remove(obj.removeStack.shift());
			}
			while (obj.pushStack.length > 0) {
				obj.add(obj.pushStack.shift());
			}
			fireEvent(obj, 'slidend');
			restartTimer(obj);
		}
	}

	function bg(evt, obj, peo, vars) {
		if (evt.type === 'start') {
			if (!peo.pointers.length && obj.children.length > 1 && !obj.sliding) {
				if (obj.timer) {
					clearTimeout(obj.timer);
					delete obj.timer;
				}
				vars.ox = vars.nx = vars.x = evt.x;
				vars.ot = vars.nt = evt.domEvent.timeStamp;
				vars.sl = function(evt) {
					document.removeEventListener('scroll', vars.sl, true);
					delete vars.sl;
				};
				document.addEventListener('scroll', vars.sl, true);
				return true;
			}
		} else if (obj.moving || vars.sl) {
			if (evt.type === 'move') {
				mv(evt, obj, vars);
			} else if (evt.type === 'end') {
				ed(evt, obj, vars);
			} else {
				cl(obj, vars);
			}
		}
	}

	function mv(evt, obj, vars) {
		var v, n, n1;
		if (obj.children.length > 1 && !obj.sliding) {
			vars.ox = vars.nx;
			vars.ot = vars.nt;
			vars.nx = evt.x;
			vars.nt = evt.domEvent.timeStamp;
			if (!obj.moving && Math.abs(vars.nx - vars.x) > obj.minVal) {
				obj.moving = true;
				vars.sl();
			}
			if (obj.moving) {
				v = vars.nx - vars.x;
				if (vars.nx > vars.x) {
					n = Math.floor(v / obj.container.clientWidth);
				} else {
					n = Math.ceil(v / obj.container.clientWidth);
				}
				v = v % obj.container.clientWidth;
				if (n === 0) {
					n = obj.current;
				} else {
					vars.x += n * obj.container.clientWidth;
					n = getPos(obj.current - n, obj.children.length);
				}
				if (v === 0) {
					n1 = n;
				} else {
					n1 = getPos(v > 0 ? n - 1 : n + 1, obj.children.length);
				}
				if (obj.children[n] !== obj.subcontainer.firstChild && obj.children[n1] !== obj.subcontainer.firstChild) {
					obj.invisible.appendChild(obj.subcontainer.firstChild);
				}
				if (obj.subcontainer.lastChild && obj.children[n] !== obj.subcontainer.lastChild && obj.children[n1] !== obj.subcontainer.lastChild) {
					obj.invisible.appendChild(obj.subcontainer.lastChild);
				}
				if (obj.children[n].parentNode !== obj.subcontainer) {
					if (obj.subcontainer.childNodes.length > 0 && v < 0) {
						obj.subcontainer.insertBefore(obj.children[n], obj.children[n1]);
					} else {
						obj.subcontainer.appendChild(obj.children[n]);
					}
				}
				if (v > 0) {
					if (obj.subcontainer.firstChild !== obj.children[n1]) {
						obj.subcontainer.insertBefore(obj.children[n1], obj.children[n]);
					}
					obj.subcontainer.style.left = v - obj.container.clientWidth + 'px';
				} else if (v < 0) {
					if (obj.subcontainer.lastChild !== obj.children[n1]) {
						obj.subcontainer.appendChild(obj.children[n1]);
					}
					obj.subcontainer.style.left = v + 'px';
				} else {
					obj.subcontainer.style.left = 0;
				}
				if (n !== obj.current) {
					obj.current = n;
					fireEvent(obj, 'change', {
						current: true
					});
				}
			}
		}
		if (obj.moving) {
			evt.domEvent.preventDefault();
		}
	}

	function ed(evt, obj, vars) {
		var speed, s;
		if (obj.subcontainer.childNodes.length === 2) {
			speed = (evt.x - vars.ox) / (evt.domEvent.timeStamp - vars.ot);
			s = Math.pow(speed, 2) * obj.rate;
			if (speed < 0) {
				s = s * -1;
			}
			if (obj.children[obj.current] === obj.subcontainer.firstChild) {
				if (obj.subcontainer.offsetLeft + s < obj.container.offsetWidth * -0.5) {
					beginSlide(obj, false);
					obj.current = getPos(obj.current + 1, obj.children.length);
					fireEvent(obj, 'change', {
						current: true
					});
				} else {
					beginSlide(obj, true);
				}
			} else {
				if (obj.subcontainer.offsetLeft + s > obj.container.offsetWidth * -0.5) {
					beginSlide(obj, true);
					obj.current = getPos(obj.current - 1, obj.children.length);
					fireEvent(obj, 'change', {
						current: true
					});
				} else {
					beginSlide(obj, false);
				}
			}
		} else {
			restartTimer(obj);
		}
		rst(obj, vars);
	}

	function cl(obj, vars) {
		if (obj.subcontainer.childNodes.length === 2) {
			beginSlide(obj, obj.children[obj.current] === obj.subcontainer.firstChild);
		} else {
			restartTimer(obj);
		}
		rst(obj, vars);
	}

	function rst(obj, vars) {
		if (obj.moving) {
			obj.moving = false;
		} else if (vars.sl) {
			vars.sl();
		}
	}

	function getPos(c, t) {
		var s = c % t;
		if (s < 0) {
			s += t;
		}
		return s;
	}

	function fireEvent(obj, name, props) {
		var funcName = 'on' + name;
		if (typeof obj[funcName] === 'function') {
			var a =
			obj[funcName]({
				type: name,
				__proto__: props
			});
		}
	}

	function cancelEvt(evt) {
		evt.preventDefault();
	}

	function restartTimer(obj) {
		if (obj.delay) {
			obj.timer = setTimeout(function() {
				delete obj.timer;
				obj.slideTo(obj.current + 1);
			}, obj.delay);
		}
	}

	function noscroll(evt) {
		if (evt.target === this) {
			this.scrollLeft = this.scrollTop = 0;
		}
	}
});
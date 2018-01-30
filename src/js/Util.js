import Promise from 'promise-polyfill';

export default class Util {
	static addClass(el, className) {
		const classes = className.split(' ');
		classes.forEach(item => {
			el.classList.add(item);
		});
	}

	static removeClass(el, className) {
		const classes = className.split(' ');
		classes.forEach(item => {
			el.classList.remove(item);
		});
	}

	static hasClass(el, className) {
		return el.classList.contains(className);
	}

	static hide(el, immediate) {
		Util.removeClass(el, 'active');
		if (immediate) {
			el.style.display = 'none';
		} else {
			setTimeout(() => {
				el.style.display = 'none';
			}, 350);
		}
	}

	static notVisible(el, immediate) {
		if (immediate) {
			el.style.visibility = 'hidden';
		} else {
			setTimeout(() => {
				el.style.visibility = 'hidden';
			}, 350);
		}
	}

	static show(el) {
		el.style.display = 'flex';
		setTimeout(() => {
			Util.addClass(el, 'active');
		}, 0);
	}

	static visible(el) {
		el.style.visibility = 'visible';
	}

	static showBlockTablet(el) {
		if (window.matchMedia('(min-width:1125px)').matches) {
			el.style.display = 'flex';
		} else {
			el.style.display = 'block';
		}

		setTimeout(() => {
			Util.addClass(el, 'active');
		}, 0);
	}

	static viewport() {
		if (window.matchMedia('(min-width:1125px)').matches) {
			return 'desktop';
		} else if (window.matchMedia('(min-width:741px)').matches) {
			return 'tablet';
		} else {
			return 'mobile';
		}
	}

	static findParent(el, className) {
		while ((el = el.parentElement) && !el.classList.contains(className));
		return el;
	}

	static getWindowWidth() {
		return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}

	static isDesktop() {
		return this.getWindowWidth() > 1125;
	}

	static isTablet() {
		return this.getWindowWidth() > 767;
	}

	static isIe11() {
		return (!window.ActiveXObject && 'ActiveXObject' in window);
	}

	static  removeHtml(s){
		let t = s.toString().replace(/[<>=;]/g,'');
		return t;
	}

	static debounce(fn, delay) {
		let timer = null;
		return () => {
			const context = this, args = arguments;
			clearTimeout(timer);
			timer = setTimeout( () => {
				fn.apply(context, args);
			}, delay);
		};
	}

	static toggleItem(elem, className) {
		[...elem].forEach((el) => {
			el.addEventListener('click', (e) => {
				e.preventDefault();
				[...elem].forEach(item => {
					if (el !== item || this.hasClass(el, className)) {
						this.removeClass(item, className);
					} else {
						this.addClass(el, className);
					}
				});
			});
		});
	}

	static callurl(url) {
		return new Promise((resolve, reject) => {
			const statusBar = document.getElementsByClassName('search-status')[0];
			let xhr = new XMLHttpRequest();
			xhr.open('GET',url);
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4 && xhr.status === 200) {
					resolve(JSON.parse(xhr.responseText));

				}
			};

			xhr.addEventListener('loadstart', () => {
				Util.addClass(statusBar, 'search-loadstart');
			});
			xhr.addEventListener('progress', () => {
				Util.addClass(statusBar, 'search-progress');
				Util.removeClass(statusBar, 'search-loadstart');
			});
			xhr.addEventListener('load', () => {
				Util.addClass(statusBar, 'search-load');
				Util.removeClass(statusBar, 'search-progress');
			});
			xhr.addEventListener('loadend', () => {
				Util.addClass(statusBar, 'search-loadend');
				Util.removeClass(statusBar, 'search-load');
				setTimeout(() => {
					Util.addClass(statusBar, 'search-load-complete');
					Util.removeClass(statusBar, 'search-loadend');
					setTimeout(() => {
						Util.removeClass(statusBar, 'search-load-complete');
					}, 400);
				}, 400);
			});
			xhr.send();
			xhr.onerror = reject;
		});
	}


}
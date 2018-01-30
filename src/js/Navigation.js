import 'whatwg-fetch';

import Util from './Util';

export default class Navigation {
	constructor() {
		this.viewport = Util.viewport();
		this.searched = false;
	}

	init() {
		this.$element = document.getElementById('unique-nav');
		// const searchInput = document.getElementById('searchInput');x

		if (Util.isIe11()) {
			Util.addClass(this.$element, 'isIE11');
		}

		this.dropdown();
		this.vehicleDropdown();
		this.linksDropdown();
		this.mobileNav();
		this.closeDropdown();
		this.level2NavClose();
		this.level2NavOpen();
		this.breadcrumbs();
		this.resize();
		this.searchClickHandler();
		this.searchFormSubmit();
		this.checkSearchInput();
		this.popOutMenu();
	}

	resize() {
		const rootNav = document.getElementById('unique-nav');

		window.addEventListener('resize', () => {
			const viewport = Util.viewport();

			this.setHeightOnDropdown();

			if (viewport !== this.viewport) {
				this.viewport = viewport;
				Util.addClass(rootNav, 'resizing');

				let timeout = this.resizeTimeout(rootNav);

				if (Util.hasClass(rootNav, 'resizing')) {
					clearTimeout(timeout);
					this.resizeTimeout(rootNav);
				}
			}
		});
	}

	resizeTimeout(el) {
		setTimeout(() => {
			Util.removeClass(el, 'resizing');
		}, 670);
	}

	searchFormSubmit() {
		const searchForm = document.getElementById('nav__search-form');
		const searchResults = document.getElementsByClassName('suggestions')[0];
		const results = document.getElementsByClassName('search__results')[0];

		searchForm.addEventListener('submit', (e) => {
			const input = document.getElementById('searchInput');
			e.preventDefault();

			if(input.value.length >= 2){
				this.siteSearch(input.value, searchResults, results);
				Util.removeClass(input, 'pulse');
			} else {
				Util.addClass(input, 'pulse');
			}

		});
	}

	checkSearchInput() {
		const searchResults = document.getElementsByClassName('suggestions')[0];
		const searchResultsContainer = document.getElementsByClassName('search__results')[0];
		const input = document.getElementById('searchInput');
		input.value = '';

		const inputCallback = () =>	{
			const value = input.value;
			const cleanValue = Util.removeHtml(value);
			Util.removeClass(input, 'pulse');

			if (value.length >= 2) {

				this.searchSuggestions(cleanValue, searchResults);
				Util.removeClass(searchResultsContainer, 'active');
			}
		};


		const clickCallback = () => {
			Util.removeClass(input, 'pulse');
		};


		input.addEventListener('input', Util.debounce(inputCallback, 300));
		input.addEventListener('click', clickCallback );
	}

	searchSuggestions(searchValue, suggestionsResults){
		const searchTerm = searchValue;
		const searchUrls = document.getElementById('search');
		const surl = searchUrls.getAttribute('data-search-suggestions-url');
		const rurl = searchUrls.getAttribute('data-search-results-url');
		const suggestionsUrl = `${surl}&query=${searchTerm}`;
		const suggestionsContainer = document.getElementsByClassName('suggestions')[0];
		const suggestions = suggestionsContainer.getElementsByClassName('suggestions__results')[0];
		const resultsUrl = `${rurl}&query=${searchTerm}`;
		const seeAll = document.getElementsByClassName('see-all')[0];
		const next = document.getElementsByClassName('search__next')[0];
		const prev = document.getElementsByClassName('search__prev')[0];
		const searchResultsContainer = document.getElementsByClassName('search-results-container')[0];

		seeAll.setAttribute('href', resultsUrl);

		const onClickCallback = (e) => {
			e.preventDefault();
			const results = document.getElementsByClassName('search__results')[0];
			this.siteSearch(searchValue, suggestionsContainer, results);
			seeAll.removeEventListener('click', onClickCallback);
		};

		seeAll.removeEventListener('click', onClickCallback);
		seeAll.addEventListener('click', onClickCallback);

		fetch(suggestionsUrl).then(response => {
			if (response.status !== 200) {
				return;
			}

			return response.json();
		}).then(data => {
			const results = data.suggestions;
			const seeAllLink = document.getElementsByClassName('see-all')[0];
			const noResults = document.getElementsByClassName('no__results')[0];
			const resultsContent = document.getElementsByClassName('search__results-content')[0];
			const resultsFooter = document.getElementsByClassName('search__results-footer')[0];

			if (this.searched) {
				next.outerHTML = next.outerHTML;
				prev.outerHTML = prev.outerHTML;
				this.searched = false;
			}

			if (results.length > 0) {
				suggestions.innerHTML = '';
				Util.removeClass(noResults, 'active');
				Util.removeClass(resultsContent, 'hide');
				Util.removeClass(resultsFooter, 'hide');

				[...results].forEach(r => {
					const listItem = document.createElement('li');
					const link = document.createElement('a');
					const suggestion = document.createElement('span');
					const url = `${rurl}&query=${r.query}`;

					listItem.appendChild(link);
					link.appendChild(suggestion);
					suggestions.appendChild(listItem);
					link.setAttribute('data-search-term', url);
					link.setAttribute('href', url);
					link.setAttribute('class', 'suggestion');
					suggestion.textContent = r.query;
					Util.addClass(seeAllLink, 'active');

					const linkClickCallback = (e) => {
						e.preventDefault();
						const results = document.getElementsByClassName('search__results')[0];
						const searchInput = document.getElementById('searchInput');
						searchInput.value = r.query;
						this.siteSearch(r.query, suggestionsContainer, results);
					};

					link.addEventListener('click', linkClickCallback);
				});

				Util.addClass(suggestionsResults, 'active search-no-opacity');

				setTimeout(() => {
					Util.addClass(searchResultsContainer, 'active');

					setTimeout(() => {
						suggestionsResults.classList.remove('search-no-opacity');
					}, 300);
				}, 100);

			} else {
				const noResult = document.getElementsByClassName('no__results')[0];
				const suggestionsContainer = document.getElementsByClassName('suggestions')[0];
				Util.addClass(searchResultsContainer, 'active');
				Util.addClass(noResult, 'active');
				Util.removeClass(suggestionsContainer, 'active');
			}
		}).catch(() => {

		});
	}

	siteSearch(searchValue, suggestions, res) {
		const searchUrls = document.getElementById('search');
		const searchInput = document.getElementById('searchInput');
		const rurl = searchUrls.getAttribute('data-search-results-url');
		const seeAllLink = document.getElementsByClassName('see-all')[0];
		const currentPage = document.getElementsByClassName('nav__search-currentPage')[0];
		const maxPage = document.getElementsByClassName('nav__search-maxPage')[0];
		const resultsUrl = `${rurl}&query=${searchValue}`;
		const next = document.getElementsByClassName('search__next')[0];
		const container = document.getElementsByClassName('nav__search-container')[0];
		const resultsContent = document.getElementsByClassName('search__results-content')[0];
		const resultsFooter = document.getElementsByClassName('search__results-footer')[0];
		const searchResults = document.getElementsByClassName('search-results-container')[0];

		Util.callurl(resultsUrl).then( data => {
			const resultsCount = document.getElementsByClassName('results-count')[0];
			const searchResultsContainer = document.getElementById('search-result');


			Util.addClass(suggestions, 'search-no-opacity');
			setTimeout(() => {
				Util.removeClass(suggestions, 'active');
				Util.addClass(res, 'active');
			}, 300);

			resultsCount.textContent  = `${data.resultsTitleText}`;
			searchResultsContainer.innerHTML = ' ';
			Util.addClass(searchResults, 'active');

			this.searched = true;

			if (data.results.length === 0) {
				Util.addClass(resultsContent, 'hide');
				Util.addClass(resultsFooter, 'hide');
			}

			if (data.maxPage > 0) {
				searchInput.value = searchValue;
				Util.removeClass(seeAllLink, 'active');
				Util.removeClass(resultsContent, 'hide');
				Util.removeClass(resultsFooter, 'hide');

				const searchResults = data.results;
				[...searchResults].forEach(result => {
					const searchResult = Navigation.getTemplate(result);

					const sr = document.createElement('div');
					sr.innerHTML = searchResult;
					searchResultsContainer.appendChild(sr);
				});

				const relatedSearchElement = document.createElement('div');
				relatedSearchElement.setAttribute('id','rs');

				const relatedSearchesResultContainer = document.getElementsByClassName('related-search-term-container')[0];
				const relatedSearches = data.suggestions;
				const relatedSearchResults = document.getElementsByClassName('related-search-results')[0];

				if (relatedSearches.length === 0) {
					Util.addClass(relatedSearchResults, 'search-no-opacity');
				} else {
					Util.removeClass(relatedSearchResults, 'search-no-opacity');
				}

				const nextPageCallback = () => {
					if (data.maxPage > data.page) {
						this.changePage(resultsUrl, data, true);
						next.removeEventListener('click', nextPageCallback);
					}
				};

				next.removeEventListener('click', nextPageCallback);
				next.addEventListener('click', nextPageCallback);

				relatedSearchesResultContainer.innerHTML ='';
				[...relatedSearches].forEach(rs => {
					const suggestionTitle = document.createElement('a');
					const suggestionsContainer = document.getElementsByClassName('suggestions')[0];
					const results = document.getElementsByClassName('search__results')[0];

					suggestionTitle.setAttribute('data-term', rs.query);
					suggestionTitle.setAttribute('class', 'search-suggestion');
					suggestionTitle.setAttribute('href', '#');
					suggestionTitle.textContent = rs.query;

					relatedSearchesResultContainer.appendChild(suggestionTitle);

					const onClickCallback = (e) => {
						e.preventDefault();
						const link = suggestionTitle.getAttribute('data-term');

						next.removeEventListener('click', nextPageCallback);
						//this.updateResults(link);
						this.siteSearch(link, suggestionsContainer, results);

					};

					suggestionTitle.addEventListener('click', onClickCallback);
				});

				Navigation.pagination(data);

				currentPage.innerHTML = data.page;
				maxPage.innerHTML = data.maxPage;

				if (Util.viewport() === 'mobile') {
					const onScrollCallback = () => {
						const windowHeight = window.outerHeight;
						// console.log('scrolled'); // es-lint-disable-line

						// console.log('container - window', container.scrollHeight - windowHeight - 400); // es-lint-disable-line
						// console.log('scrolltop', container.scrollTop); // es-lint-disable-line
						if (container.scrollHeight - windowHeight - 400 < container.scrollTop && data.maxPage > data.page) {
							this.updateMobilePage(resultsUrl, data);
							container.removeEventListener('scroll', onScrollCallback);
						}
					};

					container.addEventListener('scroll', onScrollCallback);
				}
			}
		});
	}


	changePage(url, data, isNext = true) {
		const currentPage = document.getElementsByClassName('nav__search-currentPage')[0];
		const next = document.getElementsByClassName('search__next')[0];
		const prev = document.getElementsByClassName('search__prev')[0];
		const pageString = '&page';
		let newUrl = url;

		if (newUrl.includes(pageString)) {
			newUrl = url.substring(0, newUrl.indexOf(pageString));
		}

		newUrl = isNext ? `${newUrl}&page=${data.page + 1}` : `${newUrl}&page=${data.page - 1}`;

		Util.callurl(newUrl).then( newData => {
			const searchResultsContainer = document.getElementById('search-result');
			const {results} = newData;

			searchResultsContainer.innerHTML = '';

			const nextPageCallback = () => {
				next.removeEventListener('click', nextPageCallback);
				if (newData.page !== newData.maxPage) {
					this.changePage(newUrl, newData, true);
					prev.removeEventListener('click', prevPageCallback);
				}
			};

			const prevPageCallback = () => {
				if (newData.page > 1) {
					this.changePage(newUrl, newData, false);
					next.removeEventListener('click', nextPageCallback);
				}
				prev.removeEventListener('click', prevPageCallback);
			};

			[...results].forEach(result => {

				const searchResult = Navigation.getTemplate(result);

				const sr = document.createElement('div');
				sr.innerHTML = searchResult;
				searchResultsContainer.appendChild(sr);
			});

			Navigation.pagination(newData);

			next.removeEventListener('click', nextPageCallback);
			prev.removeEventListener('click', prevPageCallback);
			next.addEventListener('click', nextPageCallback);
			prev.addEventListener('click', prevPageCallback);
			currentPage.innerHTML = newData.page;
		});
	}

	updateMobilePage(url, data) {
		const container = document.getElementsByClassName('nav__search-container')[0];
		const windowHeight = window.outerHeight;

		const pageString = '&page';
		let newUrl = url;

		if (newUrl.includes(pageString)) {
			newUrl = url.substring(0, newUrl.indexOf(pageString));
		}

		newUrl = `${newUrl}&page=${data.page + 1}`;

		Util.callurl(newUrl).then( newData => {
			const searchResultsContainer = document.getElementById('search-result');
			const {results} = newData;

			[...results].forEach(result => {

				const searchResult = Navigation.getTemplate(result);

				const sr = document.createElement('div');
				sr.innerHTML = searchResult;
				searchResultsContainer.appendChild(sr);
			});

			const onScrollCallback = () => {
				if (container.scrollHeight - windowHeight - 400 < container.scrollTop && newData.maxPage > newData.page) {
					this.updateMobilePage(newUrl, newData);
					container.removeEventListener('scroll', onScrollCallback);
				}
			};

			container.addEventListener('scroll', onScrollCallback);
		}).catch(() => {

		});
	}

	dropdown() {
		const elements = document.getElementsByClassName('has-dropdown-js');
		const rootNav = document.getElementById('unique-nav');
		const searchResultsContainer = document.getElementsByClassName('search-results-container')[0];
		const searchResults = searchResultsContainer.getElementsByClassName('search__results')[0];
		const suggestions = searchResultsContainer.getElementsByClassName('suggestions')[0];
		const search = document.getElementById('search');

		[...elements].forEach( el => {
			const dropdownId = el.getAttribute('data-dropdown');
			const dropdown = document.getElementById(dropdownId);

			el.addEventListener('click', (e) => {
				e.preventDefault();
				Util.removeClass(rootNav, 'search-active');
				Util.removeClass(searchResults, 'active');
				Util.removeClass(suggestions, 'active');
				Util.removeClass(searchResultsContainer, 'active');
				if (Util.hasClass(search, 'active')) {
					Navigation.closeSearch();
				}

				if (Util.hasClass(el, 'active')) {
					this.openCloseDropdown(dropdown, true);
				} else {
					this.openCloseDropdown(dropdown, false);
					Navigation.resetSearch();
					Util.removeClass(rootNav, 'dropdown-level-2-active');
				}
			});
		});

		Util.toggleItem(elements, 'active');
	}

	vehicleDropdown() {
		const elements = document.getElementsByClassName('vehicle-selector-js');

		[...elements].forEach( el => {
			const vehicleId = el.getAttribute('data-vehicle-id');
			const vehicleContent = document.getElementById(vehicleId);

			const onCallback = () => {
				[...elements].forEach( el => {
					Util.removeClass(el, 'active');
				});
				Util.addClass(el, 'active');

				//Hide all other vehicles
				const vehicleCards = document.getElementsByClassName('vehicle-info-wrapper__item');
				[...vehicleCards].forEach( vehicleCard => {
					if (Util.hasClass(vehicleCard, 'active')) {
						Util.hide(vehicleCard, true);
					}
				});

				//Show current vehicle
				Util.showBlockTablet(vehicleContent);
			};

			const onClickCallback = () => {
				if (!Util.isTablet()) {
					onCallback();
				}
			};

			const onHoverCallback = () => {
				if (Util.isTablet()) {
					onCallback();
					setTimeout(() => {
						this.setHeightOnDropdown();
					}, 10);
				}
			};

			el.addEventListener('mouseenter', onHoverCallback);
			el.addEventListener('click', onClickCallback);

		});
	}

	setHeightOnDropdown() {
		const navDropdown = document.querySelector('.nav__dropdown');
		const dropdowns = document.getElementsByClassName('dropdown');
		const vehicleInfoItems = document.getElementsByClassName('vehicle-info-wrapper__item');
		const dropdownCloseButton = document.getElementsByClassName('dropdown__close-button')[0];
		const dropdownContainer = document.getElementsByClassName('nav__dropdown-container')[0];
		let dropdownHeight = '';
		let dropdownContainerHeight = '';

		[...dropdowns].forEach( dropdown => {
			if (Util.hasClass(dropdown, 'active')) {
				if (Util.viewport() !== 'mobile') {
					if (dropdown.id.includes('vehicle')) {
						const vehicleList = dropdown.getElementsByClassName('vehicle-nav')[0];
						const vehicleListHeight = vehicleList.offsetHeight + dropdownCloseButton.offsetHeight;

						dropdownHeight = `${vehicleListHeight}px`;
						dropdownContainerHeight = `${vehicleListHeight + 72}px`;

						[...vehicleInfoItems].forEach(item => {
							if (Util.hasClass(item, 'active')) {
								const height = item.offsetHeight + dropdownCloseButton.offsetHeight;

								dropdownHeight = `${height > vehicleListHeight ? height : vehicleListHeight}px`;
								dropdownContainerHeight = `${height > vehicleListHeight ? height + 72 : vehicleListHeight + 72}px`;

							}
						});

						navDropdown.style.height = dropdownHeight;
						dropdownContainer.style.height = dropdownContainerHeight;
					} else if (dropdown.id.includes('dropdown')) {
						const linksDropdownContainer = dropdown.getElementsByClassName('links-dropdown__container');
						dropdownHeight = `${linksDropdownContainer[0].offsetHeight}px`;
						dropdownContainerHeight = `${linksDropdownContainer[0].offsetHeight + 72}px`;
						navDropdown.style.height = dropdownHeight;
						dropdownContainer.style.height = dropdownContainerHeight;
					}
				}
			}
		});
	}

	linksDropdown() {
		const elements = document.getElementsByClassName('subnav-js');

		[...elements].forEach( el => {
			const onClickCallback = () => {
				const subNav = Array.prototype.filter.call(el.parentNode.children, function(child) {
					return child !== el;
				});

				[...elements].forEach( el => {
					const subNav = Array.prototype.filter.call(el.parentNode.children, function(child) {
						return child !== el;
					});

					[...subNav].forEach( sub => {
						Util.removeClass(sub, 'active');
					});
				});

				[...subNav].forEach((sub) => {
					Util.addClass(sub, 'active');
				});
			};

			el.addEventListener('click', onClickCallback);
		});
	}

	mobileNav() {
		const hamburgerLink = document.getElementById('open-nav-js');
		const searchLink = document.getElementById('search');
		const topNav = document.getElementById('unique-nav');
		const searchContainer = document.getElementById('nav__search');

		const onClickCallback = (e) => {
			e.preventDefault();

			const nav = document.getElementById('unique-nav');

			if (Util.hasClass(nav, 'active')) {
				Util.removeClass(nav, 'active');
			} else {
				Util.addClass(nav, 'active');
			}

			if (Util.isTablet() === true && searchLink.classList.contains('active')) {
				Util.removeClass(searchLink, 'active');
				Util.removeClass(searchContainer, 'active');
				Util.removeClass(topNav, 'dropdown-active');
			}
		};

		hamburgerLink.addEventListener('click', onClickCallback);
	}

	searchClickHandler() {
		const search = document.getElementById('search');
		const close = document.getElementById('close-search');
		const searchInput = document.getElementById('searchInput');

		search.addEventListener('click', (e) => {
			e.preventDefault();

			if (Util.hasClass(search, 'active')) {
				Navigation.closeSearch();
			} else {
				searchInput.focus();
				this.openSearch();
			}

		});

		close.addEventListener('click', (e) => {
			e.preventDefault();
			Navigation.closeSearch();
		});
	}

	openSearch() {
		const search = document.getElementById('search');
		const menuButton = document.getElementById('unique-nav');
		const dropdownId = search.getAttribute('data-dropdown');
		const dropdown = document.getElementById(dropdownId);
		const primaryNav = document.getElementsByClassName('nav__primary')[0];
		const primaryNavItems = primaryNav.getElementsByClassName('has-dropdown-js');

		Util.addClass(search,'active');
		Util.removeClass(menuButton, 'dropdown-level-2-active');
		Util.addClass(menuButton, 'active search-active');

		[...primaryNavItems].forEach(item => {
			Util.removeClass(item, 'active');
		});

		if (Util.hasClass(search, 'active')) {
			this.openCloseDropdown(dropdown, true);
		} else {
			this.openCloseDropdown(dropdown, false);
			Util.removeClass(menuButton, 'dropdown-level-2-active');
		}

		if(Util.isTablet()) {
			Util.removeClass(menuButton,'active');
		}
	}

	openCloseDropdown(dropdown, isActive) {
		const rootNav = document.getElementById('unique-nav');
		const primaryNav = document.getElementsByClassName('nav__primary')[0];

		if (isActive) {
			Util.removeClass(rootNav, 'dropdown-active active');
		} else {
			Util.addClass(rootNav, 'dropdown-active active');

			if (Util.viewport() === 'tablet') {
				Util.notVisible(primaryNav, false);
			}
		}

		const dropdowns = document.getElementsByClassName('dropdown');
		[...dropdowns].forEach( drop => {
			if (Util.hasClass(drop, 'active')) {
				Util.removeClass(drop, 'active');
			}
		});

		Util.addClass(dropdown, 'active');
		this.setHeightOnDropdown();
	}

	closeDropdown() {
		const rootNav = document.getElementById('unique-nav');
		const dropdownLinks = document.getElementsByClassName('close-dropdown-js');
		const primaryNavItems = document.getElementsByClassName('has-dropdown-js');
		const dropdownContainer = document.getElementsByClassName('nav__dropdown-container')[0];
		const dropdown = document.getElementsByClassName('nav__dropdown')[0];
		const vehicleNavItems = document.getElementsByClassName('vehicle-selector-js');
		const vehicleInfoItems = document.getElementsByClassName('vehicle-info-wrapper__item');
		const primaryNav = document.getElementsByClassName('nav__primary')[0];


		[...dropdownLinks].forEach((dropdownLink) => {
			const onClickCallback = (e) => {
				e.preventDefault();
				const parent = Util.findParent(dropdownLink, 'dropdown');

				[...primaryNavItems].forEach( item => {
					Util.removeClass(item, 'active');
				});

				Util.removeClass(parent, 'active');
				Util.removeClass(rootNav, 'dropdown-active dropdown-level-2-active');
				Util.visible(primaryNav);

				dropdownContainer.style.height = '';
				dropdown.style.height = '';

				[...vehicleNavItems].forEach(item => {
					Util.removeClass(item, 'active');
				});

				[...vehicleInfoItems].forEach( item => {
					if (Util.hasClass(item, 'active')) {
						Util.removeClass(item, 'active');
						Util.hide(item, true);
					}
				});
			};

			dropdownLink.addEventListener('click', onClickCallback);
		});
	}

	level2NavClose() {
		const rootNav = document.getElementById('unique-nav');
		const closeDropdownLinks = document.getElementsByClassName('close-dropdown-level-2-js');
		const vehicleInfoItems = document.getElementsByClassName('vehicle-info-wrapper__item');

		[...closeDropdownLinks].forEach( dropdownLink => {
			const onClickCallback = (e) => {
				e.preventDefault();
				Util.removeClass(rootNav, 'dropdown-level-2-active');

				[...vehicleInfoItems].forEach(item => {
					if (Util.hasClass(item, 'active')) {
						Util.removeClass(item, 'active');
						Util.hide(item, false);
					}
				});
			};

			dropdownLink.addEventListener('click', onClickCallback);
		});
	}

	level2NavOpen() {
		const rootNav = document.getElementById('unique-nav');
		const openDropdownLinks = document.getElementsByClassName('open-dropdown-level-2-js');

		[...openDropdownLinks].forEach( dropdownLink => {
			const onClickCallback = (e) => {
				e.preventDefault();
				Util.addClass(rootNav, 'dropdown-level-2-active');
			};

			const onHoverCallback = () => {
				if (Util.isTablet() && Util.hasClass(dropdownLink, 'vehicle-selector-js')) {
					Util.addClass(rootNav, 'dropdown-level-2-active');
				}
			};

			dropdownLink.addEventListener('mouseenter', onHoverCallback);
			dropdownLink.addEventListener('click', onClickCallback);
		});
	}

	breadcrumbs() {

		const breadcrumbs = document.getElementsByClassName('nav__breadcrumbs');
		const breadcrumb = document.getElementsByClassName('nav__breadcrumb');

		Util.toggleItem(breadcrumb, 'active');

		if (breadcrumbs.length === 0) {
			return;
		}

		let siteMap = JSON.parse(breadcrumbs[0].getAttribute('data-site-map'));
		let fullUrl = '';

		[...document.getElementsByClassName('nav__breadcrumb')].forEach(crumb => {

			const linkPart = crumb.getAttribute('data-breadcrumb-link-part');

			siteMap = siteMap.children.find(child => child.linkPart === linkPart);

			if (siteMap.children && siteMap.children.length) {

				fullUrl = '/' + linkPart;

				crumb.innerHTML += `<ol class="nav__breadcrumb-dropdown" data-name="${linkPart}" >` + siteMap.children.map(child => {

					const url = child.authoredLink || (fullUrl + '/' + child.linkPart);

					return `<li data-name="${child.linkPart}"><a href="${url}">${child.title}</a></li>`;

				}).join('') + '</ol>';
			}

		});
	}

	popOutMenu() {
		const dropDown = document.getElementsByClassName('nav__breadcrumb-dropdown');
		[...dropDown].forEach(dd => {
			const items = dd.getElementsByTagName('LI');
			[...items].forEach( item => {
			   const hoverCallback = ()=> {
				   const target = item.getAttribute('data-name');
				   this.createTree(target);
				   //console.log(target);
			   }
				item.addEventListener('mouseover', hoverCallback);
			});
		});
	}

	createTree(key) {
		const dropDown = document.getElementsByClassName('nav__breadcrumb-dropdown');
		const breadcrumbs = document.getElementsByClassName('nav__breadcrumbs');
console.log(key);
		[...dropDown].forEach( dd => {
			const title = dd.getAttribute('data-name');
			//console.log(title + 'look');
		});

		let siteMap = JSON.parse(breadcrumbs[0].getAttribute('data-site-map'));
		const menu = siteMap.children;
		//console.log(siteMap.children[0].children[0].title) ;

		[...menu].forEach(m => {
		    console.log(m.linkPart);
			if (key === m.linkPart) {
			    console.log(m.linkPart);
			    console.log('match');
            }
		});


		//console.log(menu);
	}

	/**** Static Methods ****/

	static closeSearch() {
		const mainNav = document.getElementById('unique-nav');
		const searchContainer = document.getElementById('nav__search');
		const searchButton =  document.getElementById('search');
		const searchResults = document.getElementsByClassName('search__results')[0];
		const searchResultsContainer = document.getElementsByClassName('search-results-container')[0];

		Util.removeClass(searchResultsContainer,'active');
		Util.removeClass(searchResults,'active');
		Util.removeClass(searchContainer,'active');
		Util.removeClass(searchButton,'active');
		Util.removeClass(mainNav, 'dropdown-active search-active');
		const suggestionsContainer = document.getElementsByClassName('suggestions')[0];
		Util.removeClass(suggestionsContainer, 'active');
		const noResult = document.getElementsByClassName('no__results')[0];
		Util.removeClass(noResult, 'active');
		Navigation.resetSearch();
	}

	static getTemplate(result) {
		const { title, summary, link } = result;

		return `<div class="search-result">
					<div class="result-title"><h3>${title}</h3></div>
					<div class="result-desc">${summary}</div>
					<a class="result-url" href="${link.url}">${link.url}</a>
				</div>`;
	}

	static pagination(data) {
		const prev = document.getElementsByClassName('search__prev')[0];
		const next = document.getElementsByClassName('search__next')[0];



		const { page, maxPage } = data;

		if (page === 1) {

			Util.addClass(prev, 'disabled');
		} else {
			Util.removeClass(prev, 'disabled');
		}

		if (maxPage === page) {

			Util.addClass(next, 'disabled');
		} else {
			Util.removeClass(next, 'disabled');
		}
	}

	static resetSearch() {
		const input = document.getElementById('searchInput');
		const searchResults = document.getElementsByClassName('search-results')[0];
		input.value = '';
		Util.removeClass(searchResults,'active');
	}
}
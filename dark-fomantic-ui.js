/**
 * MIT License
 *
 * Copyright (c) 2020 Jonathan Barda
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

"use strict";

// Manual selection
window.init = {
	theme: ''
};

// Boot stuff when DOM is loaded
$(function () {
	console.group('Dark Fomantic-UI');
	console.log('DOM Loaded.');

	// ui theme elements
	var $themeElements = [
		{ name: 'dividingHeaders', target: $('.ui.dividing.header').not('.inverted') },
		{ name: 'iconHeaders', target: $('.ui.icon.header').not('.inverted') },
		{ name: 'headers', target: $('.ui.header').not('.inverted') },
		{ name: 'forms', target: $('.ui.form').not('.inverted') },
		{ name: 'tooltippedIcons', target: $('.tooltipped.icon') },
		{ name: 'cardsContainer', target: $('.ui.cards') },
		{ name: 'cards', target: $('.ui.card') },
		{ name: 'dropdowns', target: $('.ui.dropdown') },
		{ name: 'fixedMenu', target: $('.ui.top.fixed.menu') },
		{ name: 'breadcrumb', target: $('.ui.breadcrumb') },
		{ name: 'accordions', target: $('.ui.accordion').not('.styled').not('.inverted') },
		{ name: 'tables', target: $('.ui.table') },
		{ name: 'segments', target: $('.ui.segment').not('.inverted') },
		{ name: 'placeholders', target: $('.ui.placeholder') }
	];
	var $themeValue = $('#theme-value');
	var $darkThemeButton = $('div.right.menu div#dark-theme');
	var $lightThemeButton = $('div.right.menu div#light-theme');

	// query light / dark theme selection
	if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
		console.log('🎉 Dark mode is supported');

		// detect dark mode
		var darkMatcher = window.matchMedia('(prefers-color-scheme: dark)');

		// attach dark mode listener
		darkMatcher.addListener(onUpdate);

		// remove listener on window unload
		window.unload = function (event) {
			console.log('window unloaded.', event);
			console.log('removing listeners.');

			darkMatcher.removeListener(onUpdate);
		}

		// set and display initial theme value
		$themeValue.text((darkMatcher.matches === true ? 'dark' : 'light') + ' (media-query)');
		window.init.theme = (darkMatcher.matches === true ? 'dark' : 'light');

		// try to restore existing user selection first
		if (storageAvailable('sessionStorage')) {
			// Great! We can use sessionStorage awesomeness
			restoreState();
		}

		// apply detected theme anyway
		else {
			// Too bad, no sessionStorage for us
			console.warn('Storage [sessionStorage] no available. Applying detected theme.');
		}

		// initial theme buttons state
		if (darkMatcher.matches === true || window.init.theme === 'dark') {
			$lightThemeButton.toggleClass('hide');
		}
		else {
			$darkThemeButton.toggleClass('hide');
		}

		// apply defined theme
		applyTheme();
	}

	console.groupEnd();

	// light / dark theme buttons
	$darkThemeButton.on('click', function (event) {
		console.group('Dark Fomantic-UI');
		console.log('Theme selector clicked.', event);

		// inverted logic because of animated buttons
		window.init.theme = 'light';

		// display active theme
		$themeValue.text(window.init.theme + ' (user-event)');

		// delayed button change
		var toggleState = setTimeout(function(){
			switchButtons();
			clearTimeout(toggleState);
		}, 600);

		// refresh DOM elements
		// refresh();

		// apply defined theme
		applyTheme();

		console.groupEnd();
	});
	$lightThemeButton.on('click', function (event) {
		console.group('Dark Fomantic-UI');
		console.log('Theme selector clicked.', event);

		// inverted logic because of animated buttons
		window.init.theme = 'dark';

		// display active theme
		$themeValue.text(window.init.theme + ' (user-event)');

		// delayed button change
		var toggleState = setTimeout(function(){
			switchButtons();
			clearTimeout(toggleState);
		}, 600);

		// refresh DOM elements
		// refresh();

		// apply defined theme
		applyTheme();

		console.groupEnd();
	});

	// light / dark theme event handler
	function onUpdate(event) {
		console.group('Dark Fomantic-UI');
		console.log('Theme changed.', event);
		console.log('Previous theme value:', window.init.theme);

		// set and display gathered theme value
		window.init.theme = (event.matches === true ? 'dark' : 'light');
		$themeValue.text(window.init.theme + ' (media-event)');

		// toggle theme buttons
		switchButtons();

		// apply gathered theme
		applyTheme();

		console.groupEnd();
	}

	// light / dark theme button toggler
	function switchButtons() {
		$darkThemeButton.toggleClass('hide');
		$lightThemeButton.toggleClass('hide');
	}

	// light / dark theme apply
	function applyTheme() {
		console.log('Theme applied.', (!event ? '(auto/session)' : event));
		console.log('New theme value:', window.init.theme);
		console.log('Dark mode is ' + (window.init.theme === 'dark' ? '🌒 on' : '☀️ off') + '.');
		console.log('Theme elements:');
		console.table($themeElements);
		$($themeElements).each(function () {
			console.log('Styling element [' + $(this)[0].name + ']:', $(this)[0].target);
		});

		switch (window.init.theme) {
			case 'dark':
				$($themeElements).each(function () {
					var $target = $(this)[0].target;

					// Apply dark theme
					$target.addClass('inverted');

					// Remove uggly extra shadow
					if ($target.hasClass('floating')) {
						$target.removeClass('floating');
						$target.addClass('floating-disabled');
					}
				});

				// Apply dark theme on tooltips
				$('.tooltipped').attr('data-variation', 'inverted');
				break;
		
			case 'light':
			default:
				$($themeElements).each(function () {
					var $target = $(this)[0].target;
					
					// Remove dark theme
					$target.removeClass('inverted');

					// Add nice floating shadow
					if ($target.hasClass('floating-disabled')) {
						$target.removeClass('floating-disabled');
						$target.addClass('floating');
					}
				});

				// Remove dark theme on tooltips
				$('.tooltipped').attr('data-variation', '');
				break;
		}

		// Save user selection
		saveState(window.init.theme);
	}

	// Detect dynamic elements
	function refresh() {
		$themeElements = null;
		$themeElements = [
			{ name: 'dividingHeaders', target: $('.ui.dividing.header') },
			{ name: 'iconHeaders', target: $('.ui.icon.header') },
			{ name: 'tooltippedIcons', target: $('.tooltipped.icon') },
			{ name: 'cardsContainer', target: $('.ui.cards') },
			{ name: 'cards', target: $('.ui.card') },
			{ name: 'dropdowns', target: $('.ui.dropdown') },
			{ name: 'fixedMenu', target: $('.ui.top.fixed.menu') },
			{ name: 'breadcrumb', target: $('.ui.breadcrumb') },
			{ name: 'accordions', target: $('.ui.accordion').not('.styled').not('.inverted') },
			{ name: 'tables', target: $('.ui.table') },
			{ name: 'segments', target: $('.ui.segment').not('.inverted') },
			{ name: 'placeholders', target: $('.ui.placeholder') }
		];
	}

	// Detect if the Web Storage API is available
	// Taken from: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
	function storageAvailable(type) {
		var storage;
		try {
			storage = window[type];
			var x = '__storage_test__';
			storage.setItem(x, x);
			storage.removeItem(x);
			return true;
		}
		catch(e) {
			return e instanceof DOMException && (
				// everything except Firefox
				e.code === 22 ||
				// Firefox
				e.code === 1014 ||
				// test name field too, because code might not be present
				// everything except Firefox
				e.name === 'QuotaExceededError' ||
				// Firefox
				e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
				// acknowledge QuotaExceededError only if there's something already stored
				(storage && storage.length !== 0);
		}
	}

	// Store user selection in sessionStorage
	function restoreState() {
		if (storageAvailable('sessionStorage')) {
			// Great! We can use sessionStorage awesomeness
			console.log('Restoring user selection from session storage.');
			window.init.theme = sessionStorage.getItem('currentTheme');

			// toggle theme buttons
			// switchButtons();
		}
		else {
			// Too bad, no sessionStorage for us
			console.warn('Storage [sessionStorage] no available. Can\'t restore user selected theme.');
		}
	}

	// Store user selection in sessionStorage
	function saveState(theme) {
		if (storageAvailable('sessionStorage')) {
			// Great! We can use sessionStorage awesomeness
			if (theme !== null) {
				console.log('Saving user selection to session storage.');
				sessionStorage.setItem('currentTheme', theme);
			}
		}
		else {
			// Too bad, no sessionStorage for us
			console.warn('Storage [sessionStorage] no available. Can\'t store user selected theme.');
		}
	}
});
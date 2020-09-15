"use strict";

// app ui - Boot stuff when DOM is loaded
$(function () {
	console.group('UI');
	console.log('DOM Loaded.');
	console.log('Based on Fomantic-UI.');
	console.log('Loaded modules:', (typeof $.site.settings !== undefined ? $.site.settings.modules : null));
	console.log('Available hooks:', (typeof window.UI !== undefined ? window.UI : null));
	console.groupEnd();

	// Disabled links
	$('a[href="#!"]').on('click', function(event) {
		event.preventDefault();
	});

	// Fix top menu when passed
	$('.ui.large.secondary.inverted.menu').visibility({
		once: false,
		onBottomPassed: function() {
			$('.fixed.menu').transition('fade in');
		},
		onBottomPassedReverse: function() {
			$('.fixed.menu').transition('fade out');
		}
	});

	// Create sidebar and attach to menu open
	$('.ui.sidebar')
		// .sidebar('setting', { transition: 'scale down', mobileTransition: 'scale down' })
		.sidebar('setting', { transition: 'overlay', mobileTransition: 'overlay' })
		.sidebar('attach events', '.toc.item');

	// Dropdowns
	$('.ui.dropdown').dropdown({
		on: 'hover'
	});

	// Accordions
	$('.ui.accordion').accordion();

	// Checkboxes
	$('.ui.checkbox').checkbox()

	// Dismissable messages
	$('.message .close').on('click', function() {
		$(this).closest('.message').transition('fade');
	});

	// Modals
	$('.ui.modal').modal();

	// Tooltips
	$('.tooltipped').popup();

	// Scrolling tables
	// TODO: Add throttling...
	$('.scrolling-table').on('scroll', function (event) {
		// console.log('User is scrolling the table content.', event);
		// console.info('Scroll position:', event.target.scrollTop);
		// console.info('This:', $(this));
		// console.info('Table header:', $(this).find('.ui.table.sticky-headed thead tr:first-child > th'));

		// Store scroll position
		var pos = event.target.scrollTop;

		// Target next table with sticky headers
		var $tableHeaders = $(this).find('.ui.table.sticky-headed thead tr:first-child > th');

		// Set a darker background color when user is scrolling table content
		if (pos !== 0) {
			if (!$tableHeaders.hasClass('darken')) {
				$tableHeaders.addClass('darken');
			}
		}
		else {
			if ($tableHeaders.hasClass('darken')) {
				$tableHeaders.removeClass('darken');
			}
		}
	});
});

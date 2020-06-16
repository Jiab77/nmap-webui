"use strict";

// app code - Boot stuff when DOM is loaded
$(function () {
	console.group('App');
	console.log('DOM Loaded.');
	console.log('Settings:', (typeof $.site.settings !== undefined ? $.site.settings : null));
	console.groupEnd();

	// Configure Fomantic-UI API
	$.fn.api.settings.api = {
		'scan target': 'http://localhost:8000/scan/{target}',
		'get report': 'http://localhost:8000/report'
	};

	// Scan buttons
	$('#start-scan').on('click', function(event) {
		event.preventDefault();

		console.group('App');
		console.log('Initializing scan...');

		var $target = $('#scan-target').val();

		if ($target !== '') {
			// Enable stop button
			$('#stop-scan').removeClass('disabled');
	
			// Show loading state on button
			$('#start-scan i').removeClass('play icon');
			$('#start-scan i').addClass('spinner loading icon');

			// Show loading state on parsed data segment
			$('#scan-output-segment').addClass('loading');
			$('#parsed-output-segment').addClass('loading');

			// Display test dialog
			UI.createDialog('Scanning ' + $target + '...');
			
			// Send scan request
			console.log('Target:', $target);
			console.log('This:', $(this));

			$(this).api({
				action: 'scan target',
				stateContext: '#scan-target',
				urlData: {
					target: btoa($target)
				},
				method: 'post',
				dataType: 'text',
				on: 'now',
				onResponse: function(response) {
					// Debug
					console.group('Parser');
					console.log('Got raw output:', response);
					console.groupEnd();

					// Display server response
					$('#raw-scan-output').text(response);
					$('#scan-output-accordion').accordion('open', 0);

					// Remove loading state on button
					$('#start-scan i').removeClass('spinner loading icon');
					$('#start-scan i').addClass('play icon');

					// Remove loading state on parsed data segment
					$('#scan-output-segment').removeClass('loading');
					$('#parsed-output-segment').removeClass('loading');

					// Disabling self once clicked
					$('#stop-scan').addClass('disabled');

					// Display test dialog
					UI.createDialog('Scan finished.');

					// test sub request
					displayReport();
				},
				onFailure: function(response, element, xhr) {
					// Request failed, or valid response but response.success = false
					UI.createDialog('Request failed.', 'error');

					// Debug
					console.group('Parser');
					console.error(response, element, xhr);
					console.groupEnd();

					// Remove loading state on button
					$('#start-scan i').removeClass('spinner loading icon');
					$('#start-scan i').addClass('play icon');

					// Remove loading state on parsed data segment
					$('#scan-output-segment').removeClass('loading');
					$('#parsed-output-segment').removeClass('loading');

					// Disabling self once clicked
					$('#stop-scan').addClass('disabled');
				},
				onError: function(errorMessage, element, xhr) {
					// Invalid response
					UI.createDialog(errorMessage, 'error');

					// Debug
					console.group('Parser');
					console.error(errorMessage, element, xhr);
					console.groupEnd();

					// Remove loading state on button
					$('#start-scan i').removeClass('spinner loading icon');
					$('#start-scan i').addClass('play icon');

					// Remove loading state on parsed data segment
					$('#scan-output-segment').removeClass('loading');
					$('#parsed-output-segment').removeClass('loading');

					// Disabling self once clicked
					$('#stop-scan').addClass('disabled');
				},
				onAbort: function(errorMessage, element, xhr) {
					// Navigated to a new page, CORS issue, or user canceled request
					UI.createDialog(errorMessage, 'warning');

					// Debug
					console.group('Parser');
					console.warn(errorMessage, element, xhr);
					console.groupEnd();

					// Remove loading state on button
					$('#start-scan i').removeClass('spinner loading icon');
					$('#start-scan i').addClass('play icon');

					// Remove loading state on parsed data segment
					$('#scan-output-segment').removeClass('loading');
					$('#parsed-output-segment').removeClass('loading');

					// Disabling self once clicked
					$('#stop-scan').addClass('disabled');
				}
			});
		}
		else {
			// Display test error dialog
			UI.createDialog('Target not defined.', 'error');

			// Display error in console
			console.group('App');
			console.error('Target not defined.', $target);
			console.groupEnd();
		}

		console.groupEnd();
	});

	$('#stop-scan').on('click', function(event) {
		event.preventDefault();

		console.group('App');
		console.log('Stopping current scan...');
		console.groupEnd();

		// Stopping scan
		$('#scan-target').api('abort');

		// Remove loading state on button
		$('#start-scan i').removeClass('spinner loading icon');
		$('#start-scan i').addClass('play icon');

		// Disabling self once clicked
		$('#stop-scan').addClass('disabled');

		// Display test dialog
		UI.createDialog('Scan stopped...');
	});

	function displayReport() {
		// parsing report
		if ($('#scan-target').api('was successful')) {
			$('#scan-target').api({
				action: 'get report',
				dataType: 'xml',
				on: 'now',
				onResponse: function(response) {
					// Debug
					console.group('Parser');
					console.log('Got raw output:', response);
					
					// Parse server response
					Report.parseFile(response, '#parsed-output');

					// Display server response
					$('#json-scan-output code').text(JSON.stringify(Report.converted));
					$('#scan-output-accordion').accordion('open', 1);

					// Code highlighting
					console.log('Highlighting JSON...');
					hljs.configure({useBR: true});
					document.querySelectorAll('#json-scan-output code').forEach((block) => {
						hljs.highlightBlock(block);
					});

					console.groupEnd();

					// Display test dialog
					UI.createDialog('Report received.');
				},
				onFailure: function(response, element, xhr) {
					// Request failed, or valid response but response.success = false
					UI.createDialog('Request failed.', 'error');

					// Debug
					console.group('Parser');
					console.error(response, element, xhr);
					console.groupEnd();
				},
				onError: function(errorMessage, element, xhr) {
					// Invalid response
					UI.createDialog(errorMessage, 'error');

					// Debug
					console.group('Parser');
					console.error(errorMessage, element, xhr);
					console.groupEnd();
				},
				onAbort: function(errorMessage, element, xhr) {
					// Navigated to a new page, CORS issue, or user canceled request
					UI.createDialog(errorMessage, 'warning');

					// Debug
					console.group('Parser');
					console.warn(errorMessage, element, xhr);
					console.groupEnd();
				}
			});
		}
	}
});
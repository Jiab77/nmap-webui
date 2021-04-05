"use strict";

// Boot stuff when DOM is loaded
$(function () {
	// Bootstrap
	console.group('Parser');
	console.log('DOM Loaded.');
	console.groupEnd();

	// Loading XML content
	// Using jquery to be quick as it's already needed by Fomantic-UI
	var Report = {
		converted: null,
		url: '',
		settings: {
			'debug': true,
			'dialogTimeout': 4000,
			'materialize': (typeof Materialize !== 'undefined' ? true : false),
			'fomantic-ui': (typeof $.site.settings !== 'undefined' ? true : false),
			'semantic-ui': (typeof $.site.settings !== 'undefined' ? true : false)
		},
		createDialog: function (message, type) {
			if (!message) {
				if (Report.settings.materialize === true) {
					// TODO: Add support for dialog types
					Materialize.toast('The "message" argument must be defined.', Report.settings.dialogTimeout, 'rounded');
				}
				else if (Report.settings["fomantic-ui"] === true || Report.settings["semantic-ui"] === true) {
					$('body').toast({
						title: 'Error',
						class: 'error',
						displayTime: Report.settings.dialogTimeout,
						showProgress: 'bottom',
						classProgress: 'red',
						message: 'The "message" argument must be defined.'
					});
				}
				else {
					alert('The "message" argument must be defined.');
				}
			}
			else {
				if (Report.settings.materialize === true) {
					Materialize.toast(message, Report.settings.dialogTimeout, 'rounded');
				}
				else if (Report.settings["fomantic-ui"] === true || Report.settings["semantic-ui"] === true) {
					$('body').toast({
						title: (typeof type !== undefined ? (type === 'error' ? 'Error' : 'Info') : ''),
						class: (typeof type !== undefined ? (type === 'error' ? 'error' : 'success') : ''),
						displayTime: Report.settings.dialogTimeout,
						showProgress: 'bottom',
						classProgress: (typeof type !== undefined ? (type === 'error' ? 'orange' : 'teal') : 'blue'),
						// classProgress: 'orange',
						message: message
					});
				}
				else {
					alert(message);
				}
			}
		},
		fetch: function (url, container) {
			if (url && url === '') {
				Report.createDialog("The URL argument must be defined!", 'error');
			}
			else if (container && container === undefined) {
				Report.createDialog("The HTML container must be defined!", 'error');
			}
			else {
				$.ajax({
					type: "GET",
					url: url,
					crossDomain: true,
					headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' },
					// headers: { 'Access-Control-Allow-Origin': window.location.href },
					dataType: "xml"
				}).done(function(response) {
					Report.hidePreloader();

					Report.createDialog("XML report loaded.", 'success');

					if (Report.settings.debug === true) {
						console.info('Got XML Document:', response);
					}

					var x2js = new X2JS();
					var jsonObj = x2js.xml2json(response);
					Report.converted = jsonObj;

					if (typeof jsonObj === 'object') {
						if (Report.settings.debug === true) {
							console.info('Got JSON Object:', jsonObj);
							console.info('Building HTML...');
						}
						Report.build(jsonObj, container);
						Report.createDialog("XML report converted.", 'success');
					}
				}).fail(function(jqXHR) {
					Report.hide();

					Report.createDialog("Can't fetch the XML report!", 'error');

					if (Report.settings.debug === true) {
						console.error("Can't fetch the XML report!", jqXHR);
					}
				});
			}
		},
		parseFile: function (data, container) {
			if (data && data === '') {
				Report.createDialog("The data argument must be defined!", 'error');
			}
			else if (container && container === undefined) {
				Report.createDialog("The HTML container must be defined!", 'error');
			}
			else {
				Report.hidePreloader();

				Report.createDialog("XML report loaded.", 'success');

				if (Report.settings.debug === true) {
					console.info('Got XML data:', data);
				}

				var x2js = new X2JS();
				var jsonObj = x2js.xml2json(data);
				Report.converted = jsonObj;

				if (typeof jsonObj === 'object') {
					if (Report.settings.debug === true) {
						console.info('Got JSON Object:', jsonObj);
						console.info('Building HTML...');
					}
					Report.build(jsonObj, container);
					Report.createDialog("XML report parsed.", 'success');
				}
			}
		},
		parseString: function (data, container) {
			if (data && data === '') {
				Report.createDialog("The data argument must be defined!", 'error');
			}
			else if (container && container === undefined) {
				Report.createDialog("The HTML container must be defined!", 'error');
			}
			else {
				Report.hidePreloader();

				Report.createDialog("XML report loaded.", 'success');

				if (Report.settings.debug === true) {
					console.info('Got XML data:', data);
				}

				var x2js = new X2JS();
				var jsonObj = x2js.xml_str2json(data);
				Report.converted = jsonObj;

				if (typeof jsonObj === 'object') {
					if (Report.settings.debug === true) {
						console.info('Got JSON Object:', jsonObj);
						console.info('Building HTML...');
					}
					Report.build(jsonObj, container);
					Report.createDialog("XML report parsed.", 'success');
				}
			}
		},
		// Escape special characters by encoding them into HTML entities
		// https://stackoverflow.com/a/46685127
		escapeHtml: function (str) {
			var div = document.createElement('div');
			div.innerText = str;
			return div.innerHTML;
		},
		show: function () {
			if (Report.settings.debug === true) {
				console.info('Showing report container...');
			}
			// Components.report.show();
			Report.showPreloader();
		},
		hide: function () {
			if (Report.settings.debug === true) {
				console.info('Hiding report container...');
			}
			Report.hidePreloader();
			// Components.report.hide();
		},
		showPreloader: function () {
			if (Report.settings.debug === true) {
				console.info('Showing preloader...');
			}
			// Framework.progressBar.eq(0).show('slow');
		},
		hidePreloader: function () {
			if (Report.settings.debug === true) {
				console.info('Hidding preloader...');
			}
			// Framework.progressBar.eq(0).hide('slow');
		},
		readFile: function (file, container) {
			var reader = new FileReader();
			reader.onload = function (event) {
				if (Report.settings.debug === true) {
					console.info('File loaded.', event);
				}
				Report.parseXml(event.target.result, container);
			}
			reader.onerror = function (event) {
				Report.hide();

				Report.createDialog("Can't load the XML file.", 'error');

				if (Report.settings.debug === true) {
					console.error("Can't load the XML file.", event);
				}
			}
			if (Report.settings.debug === true) {
				console.info('Reading given XML file:', file);
			}
			reader.readAsText(file);
		},
		updateFileSize: function (fileList, display) {
			// Taken from Mozilla MDN and modified for this project
			// https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications#Example_Showing_file(s)_size
			var nBytes = 0,
				oFiles = fileList,
				nFiles = oFiles.length;

			for (var nFileId = 0; nFileId < nFiles; nFileId++) {
				nBytes += oFiles[nFileId].size;
			}
			var sOutput = nBytes + " bytes";
			// optional code for multiples approximation
			for (var aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
				sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
			}
			// end of optional code

			// display values
			if (display && display === true) {
				document.getElementById("fileNum").innerHTML = nFiles;
				document.getElementById("fileSize").innerHTML = sOutput;
			}

			// dirty addition
			document.getElementById("report-upload-details").style.display = 'block';
		},
		check: function () {
			if (Report.settings.debug === true) {
				console.info('Browser:', window.location);
			}
			var safeEnv = true;
			if (window.location.protocol === 'file:') {
				safeEnv = false;
			}
			return safeEnv;
		},
		build: function (obj, container) {
			if (!container) {
				Report.createDialog("Container not defined.");

				if (Report.settings.debug === true) {
					console.error("Container not defined.");
				}
				return false;
			}
			else {
				container = $(container);
				if (Report.settings.debug === true) {
					console.info('Got container:', container);
				}
			}

			if (!obj) {
				Report.createDialog("Object not defined.");

				if (Report.settings.debug === true) {
					console.error("Object not defined.");
				}
				return false;
			}
			else {
				// Generate the HTML with the parse function
				Report.generate(obj.nmaprun, container);

				// Call UI convertion hooks
				Report.convertionHooks();
			}
		},
		generate: function (data, container) {
			var html;

			// Main Container (can't be inverted because of 'styled' class)
			html  = '<div class="ui styled fluid accordion">';
			html += '<div class="active title">';
			html += '<i class="dropdown icon"></i>';
			html += data._args;
			html += '</div>';

			// Start Content
			html += '<div class="active content">';

			// Report Table
			html += '<table class="ui celled inverted table">';
			html += '<thead>';
			html += '<tr>';
			html += '<th>IP</th>';
			html += '<th>MAC</th>';
			html += '<th>Hostname</th>';
			html += '<th>Ports</th>';
			html += '<th>Start</th>';
			html += '<th>End</th>';
			html += '<th>Elapsed (seconds)</th>';
			html += '<th>Status</th>';
			html += '</tr>';
			html += '</thead>';
			html += '<tbody>';

			if (Array.isArray(data.host)) {
				for (let index = 0; index < data.host.length; index++) {
					const scannedHost = data.host[index];

					console.log(scannedHost);

					html += '<tr>';

					// IP
					html += '<td>' + (
						Array.isArray(scannedHost.address)
							? scannedHost.address[0]._addr
							: scannedHost.address._addr
					) + '</td>';

					// MAC
					html += '<td>' + (
						Array.isArray(scannedHost.address) && scannedHost.address.length > 1
							? scannedHost.address[1]._addr
							: 'N/A'
					) + '</td>';

					// Hostname
					html += '<td><a href="#!" onclick="$(\'.ui.modal\').modal(\'show\');">' + (
						Array.isArray(scannedHost.hostnames.hostname)
							? scannedHost.hostnames.hostname[0]._name
							: scannedHost.hostnames.hostname._name
					) + '</a></td>';

					// Port(s)
					html += '<td class="center aligned"><a href="#!" onclick="$(\'.ui.modal\').modal(\'show\');">' + (
						Array.isArray(scannedHost.ports.port)
							? scannedHost.ports.port.length
							: scannedHost.ports.port._portid + '/' + scannedHost.ports.port._protocol + ' (' + scannedHost.ports.port.service._name + ')'
					) + '</a></td>';

					// Date start
					html += '<td>' + data._startstr + '</td>';

					// Date end
					html += '<td>' + data.runstats.finished._timestr + '</td>';

					// Time elapsed
					html += '<td class="center aligned">' + data.runstats.finished._elapsed + '</td>';

					// Exit status
					html += '<td>' + data.runstats.finished._exit + '</td>';
					html += '</tr>';
				}
			}
			else {
				const scannedHost = data.host;

				console.log(scannedHost);

				html += '<tr>';

				// IP
				html += '<td>' + (
					Array.isArray(scannedHost.address)
						? scannedHost.address[0]._addr
						: scannedHost.address._addr
				) + '</td>';

				// MAC
				html += '<td>' + (
					Array.isArray(scannedHost.address) && scannedHost.address.length > 1
						? scannedHost.address[1]._addr
						: 'N/A'
				) + '</td>';

				// Hostname
				html += '<td><a href="#!" onclick="$(\'.ui.modal\').modal(\'show\');">' + (
					Array.isArray(scannedHost.hostnames.hostname)
						? scannedHost.hostnames.hostname[0]._name
						: scannedHost.hostnames.hostname._name
				) + '</a></td>';

				// Port(s)
				html += '<td class="center aligned"><a href="#!" onclick="$(\'.ui.modal\').modal(\'show\');">' + (
					Array.isArray(scannedHost.ports.port)
						? scannedHost.ports.port.length
						: scannedHost.ports.port._portid + '/' + scannedHost.ports.port._protocol + ' (' + scannedHost.ports.port.service._name + ')'
				) + '</a></td>';

				// Date start
				html += '<td>' + data._startstr + '</td>';

				// Date end
				html += '<td>' + data.runstats.finished._timestr + '</td>';

				// Time elapsed
				html += '<td class="center aligned">' + data.runstats.finished._elapsed + '</td>';

				// Exit status
				html += '<td>' + data.runstats.finished._exit + '</td>';
				html += '</tr>';
			}

			html += '</tbody>';
			html += '</table>';

			// End Content
			html += '</div>';

			// Scan modal
			html += '<div class="ui inverted modal">';
			html += '<div class="header">Scan details</div>';
			html += '<div class="content">';
			html += '<table class="ui celled inverted table">';
			html += '<thead>';
			html += '<tr>';
			html += '<th>Port</th>';
			html += '<th>State</th>';
			html += '<th>Service</th>';
			html += '<th>Method</th>';
			html += '<th>TTL</th>';
			html += '<th>Product</th>';
			html += '</tr>';
			html += '</thead>';
			html += '<tbody>';

			if (Array.isArray(data.host.ports.port)) {
				for (let index = 0; index < data.host.ports.port.length; index++) {
					const port = data.host.ports.port[index];

					console.log(port);

					html += '<tr>';
					html += '<td>' + port._portid + '/' + port._protocol + '</td>';
					html += '<td>' + port.state._state + '</td>';
					html += '<td>' + port.service._name + '</td>';
					html += '<td>' + port.state._reason + '</td>';
					html += '<td>' + port.state._reason_ttl + '</td>';
					if (port.service._product && port.service._version) {
						html += '<td>' + port.service._product + ' ' + port.service._version + '</td>';
					}
					else if (port.service._product && !port.service._version) {
						html += '<td>' + port.service._product + '</td>';
					}
					else if (port.service._extrainfo && port.service._extrainfo !== "access denied") {
						html += '<td>' + port.service._extrainfo + '</td>';
					}
					else {
						html += '<td>' + port.service._name + '</td>';
					}
					html += '</tr>';
				}
			}
			else {
				const port = data.host.ports.port;

				console.log(port);

				html += '<tr>';
				html += '<td>' + port._portid + '/' + port._protocol + '</td>';
				html += '<td>' + port.state._state + '</td>';
				html += '<td>' + port.service._name + '</td>';
				html += '<td>' + port.state._reason + '</td>';
				html += '<td>' + port.state._reason_ttl + '</td>';
				if (port.service._product && port.service._version) {
					html += '<td>' + port.service._product + ' ' + port.service._version + '</td>';
				}
				else if (port.service._product && !port.service._version) {
					html += '<td>' + port.service._product + '</td>';
				}
				else if (port.service._extrainfo && port.service._extrainfo !== "access denied") {
					html += '<td>' + port.service._extrainfo + '</td>';
				}
				else {
					html += '<td>' + port.service._name + '</td>';
				}
				html += '</tr>';
			}

			html += '</table>';
			html += '</div>';
			html += '<div class="actions">';
			html += '<div class="ui ok green inverted button">Close</div>';
			// html += '<div class="ui cancel button">Cancel</div>';
			html += '</div>';
			html += '</div>';

			// End Container
			html += '</div>';

			// Clean previous container content
			container.html('');

			// Assign HTML code to container
			container.html(html);
		},
		convertionHooks: function () {
			if (Report.settings["fomantic-ui"] === true || Report.settings["semantic-ui"] === true) {
				// Refresh accordions
				$('.ui.accordion').accordion('refresh');

				// Refresh disabled links
				$('a[href="#!"]').on('click', function(event) {
					event.preventDefault();
				});

				// Refresh modals
				$('.ui.modal').modal('refresh');
			}
		},
		getStructure: function () {
			console.group('Parser');
			console.info('Config:', Report);
			console.groupEnd();
		},
		toObject: function () {
			return Report.converted;
		},
		toJSON: function () {
			return JSON.stringify(Report.converted);
		}
	};

	// Display state of the main oject
	if (Report.settings.debug === true) {
		Report.getStructure();
	}

	// Store to the global window object
	window.Report = Report;
});

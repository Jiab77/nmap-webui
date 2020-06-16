"use strict";

(function () {
	var UI = {
		settings: {
			'debug': true,
			'dialogTimeout': 4000,
			'materialize': (typeof Materialize !== 'undefined' ? true : false),
			'fomantic-ui': (typeof $.site.settings !== 'undefined' ? true : false),
			'semantic-ui': (typeof $.site.settings !== 'undefined' ? true : false)
		},
		browserSafeCheck: function () {
			if (self.settings.debug === true) {
				console.info('Browser:', window.location);
			}
			var safeEnv = true;
			if (window.location.protocol === 'file:') {
				safeEnv = false;
			}
			return safeEnv;
		},
		createDialog: function (message, type) {
			if (!message) {
				if (self.settings.materialize === true) {
					// TODO: Add support for dialog types
					Materialize.toast('The "message" argument must be defined.', self.settings.dialogTimeout, 'rounded');
				}
				else if (self.settings["fomantic-ui"] === true || self.settings["semantic-ui"] === true) {
					$('body').toast({
						title: 'Error',
						class: 'error',
						displayTime: self.settings.dialogTimeout,
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
				if (self.settings.materialize === true) {
					Materialize.toast(message, self.settings.dialogTimeout, 'rounded');
				}
				else if (self.settings["fomantic-ui"] === true || self.settings["semantic-ui"] === true) {
					$('body').toast({
						title: (typeof type !== undefined ? (type === 'error' ? 'Error' : (type === 'warning' ? 'Warning' : 'Info')) : ''),
						class: (typeof type !== undefined ? (type === 'error' ? 'error' : (type === 'warning' ? 'warning' : 'success')) : ''),
						displayTime: self.settings.dialogTimeout,
						showProgress: 'bottom',
						classProgress: (typeof type !== undefined ? (type === 'error' ? 'orange' : (type === 'warning' ? 'red' : 'teal')) : 'blue'),
						message: message
					});
				}
				else {
					alert(message);
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
		showPreloader: function () {
			if (self.settings.debug === true) {
				console.info('Showing preloader...');
			}
			// Framework.progressBar.eq(0).show('slow');
		},
		hidePreloader: function () {
			if (self.settings.debug === true) {
				console.info('Hidding preloader...');
			}
			// Framework.progressBar.eq(0).hide('slow');
		},
		readFile: function (file, callback) {
			var reader = new FileReader();
			reader.onload = function (event) {
				if (self.settings.debug === true) {
					console.info('File loaded.', event);
				}
				if (callback && typeof callback === 'function') {
					callback();
				}
			}
			reader.onerror = function (event) {
				self.createDialog("Can't load the file.", 'error');

				if (self.settings.debug === true) {
					console.error("Can't load the file.", event);
				}
			}
			if (self.settings.debug === true) {
				console.info('Reading given file:', file);
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
		},
	}

	// Making 'self' refer to the main object
	var self = UI;

	// Store to the global window object
	window.UI = UI;
})();
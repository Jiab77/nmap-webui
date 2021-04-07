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

 (function () {
	 var UI = {
		 settings: {
			 debug: true,
			 toasts: {
				 options: {},
				 style: {
					 alternative: false
				 },
				 theme: {
					 class: null,
					 classProgress: null,
					 title: null
				 },
				 timeout: 4000
			 },
			 materialize: (typeof Materialize !== 'undefined' ? true : false),
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
		 createToast: function (message, type) {
			 if (!message) {
				 if (self.settings.materialize === true) {
					 // TODO: Add support for toast types
					 Materialize.toast('The "message" argument must be defined.', self.settings.toasts.timeout, 'rounded');
				 }
				 else if (self.settings["fomantic-ui"] === true || self.settings["semantic-ui"] === true) {
					 if (self.settings.toasts.style.alternative === true) {
						 $('body').toast({
							 displayTime: self.settings.toasts.timeout,
							 showProgress: 'bottom',
							 class: 'error',
							 className: {
								 toast: 'ui message'
							 },
							 classProgress: 'red',
							 // showIcon: 'exclamation circle',
							 title: 'Error',
							 message: 'The "message" argument must be defined.'
						 });
					 }
					 else {
						 $('body').toast({
							 displayTime: self.settings.toasts.timeout,
							 showProgress: 'bottom',
							 class: 'error',
							 classProgress: 'red',
							 // showIcon: 'exclamation circle',
							 title: 'Error',
							 message: 'The "message" argument must be defined.'
						 });
					 }
				 }
				 else {
					 alert('The "message" argument must be defined.');
				 }
			 }
			 else {
				 if (self.settings.materialize === true) {
					 Materialize.toast(message, self.settings.toasts.timeout, 'rounded');
				 }
				 else if (self.settings["fomantic-ui"] === true || self.settings["semantic-ui"] === true) {
					 // Define theme values
					 switch (type) {
						 case 'error':
							 self.settings.toasts.theme.class = 'error';
							 self.settings.toasts.theme.classProgress = 'orange';
							 self.settings.toasts.theme.title = 'Error';
							 break;

						 case 'warning':
							 self.settings.toasts.theme.class = 'warning';
							 self.settings.toasts.theme.classProgress = 'red';
							 self.settings.toasts.theme.title = 'Warning';
							 break;

						 case 'success':
							 self.settings.toasts.theme.class = 'success';
							 self.settings.toasts.theme.classProgress = 'teal';
							 self.settings.toasts.theme.title = 'Success';
							 break;

						 case 'info':
						 default:
							 self.settings.toasts.theme.class = 'info';
							 self.settings.toasts.theme.classProgress = 'blue';
							 self.settings.toasts.theme.title = 'Info';
							 break;
					 }

					 // Define toast display style
					 if (self.settings.toasts.style.alternative === true) {
						 self.settings.toasts.options = {
							 displayTime: self.settings.toasts.timeout,
							 showProgress: 'bottom',
							 class: self.settings.toasts.theme.class,
							 className: {
								 toast: 'ui message'
							 },
							 classProgress: self.settings.toasts.theme.classProgress,
							 // showIcon: (typeof type !== undefined ? (type === 'error' ? 'exclamation circle' : (type === 'warning' ? 'exclamation triangle' : 'info circle')) : 'blue'),
							 title: self.settings.toasts.theme.title,
							 message: message
						 };
					 }
					 else {
						 self.settings.toasts.options = {
							 displayTime: self.settings.toasts.timeout,
							 showProgress: 'bottom',
							 class: self.settings.toasts.theme.class,
							 classProgress: self.settings.toasts.theme.classProgress,
							 // showIcon: (typeof type !== undefined ? (type === 'error' ? 'exclamation circle' : (type === 'warning' ? 'exclamation triangle' : 'info circle')) : 'blue'),
							 title: self.settings.toasts.theme.title,
							 message: message
						 };
					 }

					 $('body').toast(self.settings.toasts.options);
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
				 self.createToast("Can't load the file.", 'error');

				 if (self.settings.debug === true) {
					 console.error("Can't load the file.", event);
				 }
			 }
			 if (self.settings.debug === true) {
				 console.info('Reading given file:', file);
			 }
			 reader.readAsText(file);
		 },
		 setCurrentLocation: function (url) {
			 self.location = new URL(!url ? window.location.href : url);
			 return (typeof self.location === "object");
		 },
		 getCurrentLocation: function () {
			 return new URL(window.location.href);
		 },
		 getFileSize: function (fileInput, formatted) {
			 // Taken from Mozilla MDN and modified for this project
			 // https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications#Example_Showing_file(s)_size

			 // console.log('FileInput:', fileInput.id);

			 var nBytes = 0,
				 oFiles = fileInput.files,
				 nFiles = oFiles.length;

			 // console.log('Files:', oFiles);

			 for (var nFileId = 0; nFileId < nFiles; nFileId++) {
				 nBytes += oFiles[nFileId].size;
			 }

			 // console.log('Size:', nBytes);

			 var sOutput = nBytes + " bytes";

			 // optional code for multiples approximation
			 for (var aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
				 sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
			 }
			 // end of optional code

			 // display values
			 return {
				 "files": oFiles,
				 "length": nFiles,
				 "size": (!formatted ? nBytes : sOutput)
			 };
		 },
		 updateFileSize: function (fileInput, formatted, elements) {
			 // Taken from Mozilla MDN and modified for this project
			 // https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications#Example_Showing_file(s)_size

			 console.log('FileInput:', fileInput.id);

			 var nBytes = 0,
				 oFiles = fileInput.files,
				 nFiles = oFiles.length;

			 console.log('Files:', oFiles);

			 for (var nFileId = 0; nFileId < nFiles; nFileId++) {
				 nBytes += oFiles[nFileId].size;
			 }

			 console.log('Size:', nBytes);

			 var sOutput = nBytes + " bytes";

			 // optional code for multiples approximation
			 for (var aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
				 sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
			 }
			 // end of optional code

			 // display values
			 if (elements) {
				 if (elements.entry) {
					 document.getElementById(elements.entry).innerHTML = nFiles;
				 }
				 if (elements.size) {
					 document.getElementById(elements.size).innerHTML = (!formatted ? nBytes : sOutput);
				 }
			 }
			 else {
				 document.getElementById("fileNum").innerHTML = nFiles;
				 document.getElementById("fileSize").innerHTML = (!formatted ? nBytes : sOutput);
			 }
		 },
		 handleFiles: function (files) {
			 for (var i = 0; i < files.length; i++) {
				 var file = files[i];

				 if (!file.type.startsWith('image/')){ continue }

				 var img = document.createElement("img");
				 img.classList.add("obj");
				 img.file = file;
				 preview.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.

				 var reader = new FileReader();
				 reader.onload = (function(aImg) { return function(event) { aImg.src = event.target.result; }; })(img);
				 reader.readAsDataURL(file);
			 }
		 },
		 sendFiles: function (files, dest, form, formInputName) {
			 for (let i = 0; i < files.length; i++) {
				 if (form && formInputName) {
					 new self.FileUpload(files[i], dest, form, formInputName);
				 }
				 else {
					 new self.FileUpload(files[i], dest);
				 }
			 }
		 },
		 FileUpload: function (file, dest, form, formInputName) {
			 console.group('File Upload');
			 // console.log('New upload request:', img, file, dest);
			 console.log('New upload request:', file, dest);
			 console.groupEnd();

			 var reader = new FileReader();
			 // this.ctrl = createThrobber(img);
			 var xhr = new XMLHttpRequest();
			 var fd = (!form ? new FormData() : new FormData(form));
			 var fdInputName = (!formInputName ? 'myFile' : formInputName);
			 this.xhr = xhr;

			 var _this = this;
			 this.xhr.upload.addEventListener("progress", function(event) {
				 if (event.lengthComputable) {
					 var percentage = Math.round((event.loaded * 100) / event.total);
					 // _this.ctrl.update(percentage);

					 console.group('File Upload');
					 console.log('Upload progress: ' + percentage + '%');
					 console.groupEnd();
				 }
			 }, false);

			 xhr.upload.addEventListener("load", function(event){
				 // _this.ctrl.update(100);
				 // const canvas = _this.ctrl.ctx.canvas;
				 // canvas.parentNode.removeChild(canvas);

				 console.group('File Upload');
				 // console.log('Upload progress: 100%');
				 console.log('Uploaded.', event);
				 console.groupEnd();
			 }, false);

			 xhr.open("POST", dest, true);
			 // xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
			 // xhr.overrideMimeType(file.type);
			 xhr.onreadystatechange = function(event) {
				 console.group('File Upload');
				 console.log('event:', event);
				 console.groupEnd();

				 if (xhr.readyState == 4 && xhr.status == 200) {
					 alert(xhr.responseText); // handle response.
				 }
			 };

			 // Using FormData API
			 if (form && formInputName) {
				 fd.append(fdInputName, file);
				 xhr.send(fd);
			 }

			 // Using FileReader API
			 else {
				 reader.onload = function(event) {
					 console.group('File Upload');
					 console.log('Data type:', typeof event.target.result);
					 console.groupEnd();

					 xhr.send(event.target.result);
				 };
				 reader.readAsBinaryString(file);
			 }
		 }
	 }

	 // Making 'self' refer to the main object
	 var self = UI;

	 // Store to the global window object
	 window.UI = UI;
 })();

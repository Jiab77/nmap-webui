<?php
// Using F3 Framework as middleware
$f3 = require(__DIR__ . '/fatfree-master/lib/base.php');

// CORS
$f3->set('CORS.origin', '*');
$f3->set('CORS.headers', '*');
/* if ($f3->get('HEADERS.Origin') !== '') {
	$f3->copy('HEADERS.Origin','CORS.origin');
}
else {
	$f3->set('CORS.origin', '*');
} */

// Defining authorized routes
$f3->route('GET /',
	function() {
		readfile(__DIR__ . '/index.html');
	}
);
$f3->route('GET /debug',
	function($f3) {
		echo '<pre>' . PHP_EOL;
		print_r($f3);
		echo '</pre>' . PHP_EOL;
	}
);
$f3->route('GET /info',
	function() {
		phpinfo();
	}
);
$f3->run();

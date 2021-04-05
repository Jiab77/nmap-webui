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
		echo 'Hello, world!';
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
$f3->route('GET /queue',
	function() {
		echo '<pre>' . PHP_EOL;
		echo 'Showing nmap process queue:' . PHP_EOL . PHP_EOL;
		passthru('ps -efH | grep -v grep | grep nmap');
		echo '</pre>' . PHP_EOL;
	}
);
$f3->route('GET /report',
	function($f3) {
		header('Content-Type: text/xml');
		$report = $f3->read(sys_get_temp_dir() . '/report.xml');
		echo $report;
	}
);
$f3->route('GET /report/@format',
	function($f3, $params) {
		switch ($params['format']) {
			case 'html':
				echo '<pre>' . PHP_EOL;
				echo 'Reading XML report: ' . sys_get_temp_dir() . '/report.xml' . PHP_EOL;
				passthru('file ' . sys_get_temp_dir() . '/report.xml');
				echo PHP_EOL . htmlentities($f3->read(sys_get_temp_dir() . '/report.xml'));
				echo '</pre>' . PHP_EOL;
				break;

			case 'raw':
				echo 'Reading XML report: ' . sys_get_temp_dir() . '/report.xml' . PHP_EOL;
				passthru('file ' . sys_get_temp_dir() . '/report.xml');
				echo PHP_EOL . $f3->read(sys_get_temp_dir() . '/report.xml') . PHP_EOL;
				break;
			
			default:
				echo 'Unsupported format.' . PHP_EOL;
				break;
		}
	}
);
$f3->route('GET /help',
	function() {
		echo '<pre>' . PHP_EOL;
		echo 'Running cmd: /usr/bin/nmap --help' . PHP_EOL . PHP_EOL;
		passthru('/usr/bin/nmap --help');
		echo '</pre>' . PHP_EOL;
	}
);
$f3->route('POST /scan/@target',
	function($f3, $params) {
		// passthru('sudo /usr/bin/nmap -A -sS -vv -Pn localhost -oX /tmp/report.xml 2>&1 &');
		// passthru('sudo /usr/bin/nmap -A -sS -vv -Pn localhost -oX /tmp/report.xml 2>&1');
		if (!empty($params['target'])) {
			passthru('sudo /usr/bin/nmap -A -sS -vv -Pn ' . escapeshellarg(base64_decode($params['target'])) . ' -oX /tmp/report.xml 2>&1');
		}
		else {
			echo 'Host not defined.' . PHP_EOL;
		}
	}
);
$f3->run();
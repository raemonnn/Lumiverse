<?php
require __DIR__ . '/vendor/autoload.php';

use Kreait\Firebase\Factory;

$factory = (new Factory)->withServiceAccount(__DIR__.'/firebase_credentials.json');

$auth = $factory->createAuth();
$database = $factory->createDatabase('https://lumiverse-6083d-default-rtdb.firebaseio.com');




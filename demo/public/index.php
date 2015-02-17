<?php

define('BASE_DIR', realpath(dirname(__FILE__) . '/../..'));


require_once( BASE_DIR . '/serverLib/NLoader.php');
$nLoader = new Chiara\NLoader();
$nLoader->letsInclude( BASE_DIR . '/demo/application/Config/defines.php');
$nLoader->addNamespace( 'App',  BASE_DIR . '/demo/application');
$nLoader->load();

$app = new App\Init(__FILE__);
$app->setConfiguration(BASE_DIR . '/demo/application/Config/configuration.php', 'ARRAY');
$app->setViewsDir(BASE_DIR . '/demo/application/Views');
$app->setLayoutsDir(BASE_DIR . '/demo/application/Layouts');
$app->run();

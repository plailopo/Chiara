<?php 

$config = array(
	'config' => array(
		"controllerAccess" 	=> "ctrl", # post controller param name
		"actionAccess" 	=> "act", # post action param name
		"controllers" 		=> array( # Exposed controller 
			array("classname" => "App\\Controllers\\SiteCtrl", "context" => "/"),
			array("classname" => "App\\Controllers\\SiteCtrl", "context" => "/site"),
			array("classname" => "App\\Controllers\\ErrorCtrl", "context" => "/error"),
			array("classname" => "App\\Controllers\\TestCtrl", "context" => "/test")
		),
		"params" 			=> array(
				"Param1" 	=> true,
				"Param2" 	=> 34,
				'ConfigFile' 	=> BASE_DIR . '/demo/application/config/demo.config.ini',
				'LogFile' 	=> BASE_DIR . '/demo/demo.log'
		)
	)
);
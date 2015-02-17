<?php 

$config = array(
	'config' => array(
		"controllerAccess" 	=> "ctrl", # post controller param name
		"actionAccess" 	=> "act", # post action param name
		"controllers" 		=> array( # Exposed controller 
			array("classname" => "App\\Controllers\\SiteCtrl", "context" => "/"),
			array("classname" => "App\\Controllers\\SiteCtrl", "context" => "/site"),
			array("classname" => "App\\Controllers\\ErrorCtrl", "context" => "/error"),
			array("classname" => "App\\Controllers\\ClientCtrl", "context" => "/client"),
			array("classname" => "App\\Controllers\\ServerCtrl", "context" => "/server")
		),
		"params" 			=> array(
				"Param1" 	=> true,
				"Param2" 	=> 34,
				'ConfigFile' 	=> BASE_DIR . '/demo/application/Config/demo.config.ini',
				'LogFile' 	=> BASE_DIR . '/demo/data/demo.log'
		)
	)
);
<?php

namespace Chiara\Core;

$nFW_GLOBALS = array();

class Globals{
	
	
	public function __construct(){
		
	}
	
	public static function setParam($name, $value){
		global $nFW_GLOBALS;
		$nFW_GLOBALS[$name] = $value;
	}
	
	public static function getParam($name, $default = 0){
		global $nFW_GLOBALS;
		if(isset($nFW_GLOBALS[$name]))
			return $nFW_GLOBALS[$name];
		else
			return $default;
	}

	public static function exist($name){
		global $nFW_GLOBALS;
		return isset($nFW_GLOBALS[$name]);
	}
}
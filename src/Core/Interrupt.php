<?php

namespace Chiara\Core;

$nFW_INTPT = array();

class Interrupt{
	
	
	public function __construct(){
		
	}
	
	public static function lock($name, $data=array()){
		if(self::isLocked($name)) return false;
		global $nFW_INTPT;
		$nFW_INTPT[$name] = true;
		$nFW_INTPT[$name.'_data'] = $data;
		return true;
	}
	
	public static function waitAndLock($name, $data=array(), $time=3000){
		while(true){
			if(self::isLocked($name) && $time>0){
				$time -= 100;
				usleep(100*1000);
			}else if($time<0){
				return false;
			}else if(!self::isLocked($name)){
				global $nFW_INTPT;
				$nFW_INTPT[$name] = true;
				$nFW_INTPT[$name.'_data'] = $data;
				return true;
			}
		}
		
	}
	
	public static function isLocked($name){
		global $nFW_INTPT;
		if(isset($nFW_INTPT[$name]))
			return $nFW_INTPT[$name];
		else
			return false;
	}

	public static function unlock($name){
		global $nFW_INTPT;
		$nFW_INTPT[$name] = false;
		return true;
	}
	
	public static function getData($name){
		global $nFW_INTPT;
		if(isset($nFW_INTPT[$name.'_data']))
			return $nFW_INTPT[$name.'_data'];
		else
			return false;
	}
}
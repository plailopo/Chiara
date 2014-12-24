<?php

namespace Chiara\Core;


class Cache{

	private $defaultTTL = 3600;
	
	public static function setParam($name, $value, $ttl=0){
		
		if (apc_exists($name)) {
			apc_delete($name);
		}
		if($ttl==0) $ttl = $this->defaultTTL;
		apc_store( $name, $value, $ttl);
	}
	
	public static function getParam($name){
		return apc_fetch($name);
	}

	public static function exist($name){
		return apc_exists($name);
	}

}
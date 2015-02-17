<?php

namespace App\Models;

use Chiara\Core\Globals;
use Chiara\Commons\DBDriver;

class ConfigDB{

	private static $cache = array();
	
	/**
	 * get one
	 * @param unknown_type $name
	 * @return unknown|boolean
	 */
	public static function get($name, $default=false){
		
		if(isset(self::$cache[$name])) return self::$cache[$name];
		
		$db = Globals::getParam('DB');
		$p = $db->query('SELECT * FROM configuration WHERE name = ?', array($name), DBDriver::QUERY_PREPARED_MARKED);
		if(is_array($p) && count($p)>0){
			self::$cache[$name] = $p[0]['value'];
			return $p[0]['value'];
		}
		return $default;
	}
	
	/**
	 * get by email
	 * @param unknown_type $name
	 */
	public static function set($name, $value){
		
		$exist = self::get($name, false);
		
		$db = Globals::getParam('DB');
		$data = array();
		if($exist){
			$db->update('configuration', ['value' => $value], ['name[=]' => $name]);
		}else{
			$db->insert('configuration', ['value' => $value, 'name' => $name]);
		}
		
		self::$cache[$name] = $value;
		
		return Def::OK;
	}

			
}
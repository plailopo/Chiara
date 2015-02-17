<?php

namespace Chiara\Core;


class Session{
	
	
	public function __construct(){
	}
	
	public function open($name = 'nFSESSION', $id=''){
		session_name($name);
		session_start();
		if($id!='') $this->setID($id);
	}
	
	public function destroy(){
		session_unset();
		session_destroy();
	}
	
	public function regenerateID(){
		session_regenerate_id();
	}
	
	public function setID($id=''){
		if($id!='')
			session_id($id);
	}
	
	public function existParam($name){
		return isset($_SESSION[$name]);
	}
	
	public function setParam($name, $value){
		$_SESSION[$name] = $value;
	}
	
	public function getParam($name, $default=''){
		if(isset($_SESSION[$name]))
			return $_SESSION[$name];
		
		return $default;
	}
	
}
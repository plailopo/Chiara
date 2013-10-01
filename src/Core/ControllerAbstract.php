<?php

namespace Chiara\Core;

abstract class ControllerAbstract{

	
	public function __construct(){
		
		$methods = get_class_methods($this);
		if(is_array($methods) && count($methods)>0 ) foreach($methods as $m){
			if( substr($m, 0, 4) == 'init' ) $this->$m();
		}
		
	}
	
	public function forward($act, $ctrl=null){
		Globals::getParam('Router')->forward($act, $ctrl==null ? get_class($this) : $ctrl);
	}
	
	public function redirect($act, $ctrl=null){
		Globals::getParam('Router')->redirect($act, $ctrl==null ? get_class($this) : $ctrl);
	}
	
	public function getParamPost($name, $default){
		if(isset($_POST[$name])) return $_POST[$name];
		return $default;
	}
	
	public function getParamGet($name, $default){
		if(isset($_GET[$name])) return $_GET[$name];
		return $default;
	}
	
	public function getParam($name, $default){
		if(isset($_POST[$name])) return $_POST[$name];
		if(isset($_GET[$name])) return $_GET[$name];
		return $default;
	}
	
	public function getFile($name){
		if(isset($_FILES[$name])) return $_FILES[$name];
		return false;
	}
}
<?php

namespace Chiara\Core;

use Chiara\Core\Router;

abstract class InitAbstract{
	
	private $params;
	public static $viewDir = '/';
	public static $layoutDir = '/';
	
	public function __construct($indexStart){
		$this->params = array();
	}
	
	public function setConfiguration($file, $type='JSON'){
		$this->params['configurationFile'] = $file;
		$this->params['configurationType'] = $type;
	}
	
	public function setViewsDir($path){
		self::$viewDir = $path;
	}
	
	public function setLayoutsDir($path){
		self::$layoutDir = $path;
	}
	
	public function run(){
		Router::init();
		
		// configuration file
		$this->__loadConf();
		
		// run init functions
		$methods = get_class_methods($this);
		if(is_array($methods) && count($methods)>0 ) foreach($methods as $m){
			if( substr($m, 0, 4) == 'init' ) $this->$m();
		}
		
		Router::dispatch();
	}
	
	/****************  Dirty jobs *****************/
	
	private function __loadConf(){
		
		if(!file_exists($this->params['configurationFile'])) return false;
		
		$conf = array();
		if($this->params['configurationType']=='JSON'){
			$json = json_decode(file_get_contents($file), true);
			$conf = $json['config'];
		}else if($this->params['configurationType']=='ARRAY'){
			include($this->params['configurationFile']);
			$conf = $config['config'];
		}
		
		Router::setControllerAccess( isset($conf['controllerAccess']) ? $conf['controllerAccess'] : 'ctrl');
		Router::setActionAccess( isset($conf['actionAccess']) ? $conf['actionAccess'] : 'act');
		Router::setControllersList( isset($conf['controllers']) ? $conf['controllers'] : array());
		
		if(isset($conf['params']) && is_array($conf['params']) && count($conf['params'])>0 ){
			foreach ($conf['params'] as $k => $v){
				Globals::setParam($k, $v);
			}
		}
		
	}

}
<?php

namespace Chiara\Core;

use Chiara\Core\Router;

abstract class InitAbstract{
	
	private $routerIstance;
	private $params;
	
	public function __construct($indexStart){
		$this->params = array();
	}
	
	public function setConfiguration($file, $type='JSON'){
		$this->params['configurationFile'] = $file;
		$this->params['configurationType'] = $type;
	}
	
	public function setViewsDir($path){
		Globals::setParam('viewsDir', $path);
	}
	
	public function setLayoutsDir($path){
		Globals::setParam('layoutsDir', $path);
	}
	
	public function run(){
		$router = new Router();
		$this->routerIstance = $router;
		Globals::setParam('Router', $router);
		
		// configuration file
		$this->__loadConf();
		
		// run init functions
		$methods = get_class_methods($this);
		if(is_array($methods) && count($methods)>0 ) foreach($methods as $m){
			if( substr($m, 0, 4) == 'init' ) $this->$m();
		}
		
		$router->dispatch();
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
		
		$this->routerIstance->setControllerAccess( isset($conf['controllerAccess']) ? $conf['controllerAccess'] : 'ctrl');
		$this->routerIstance->setActionAccess( isset($conf['actionAccess']) ? $conf['actionAccess'] : 'act');
		$this->routerIstance->setControllersList( isset($conf['controllers']) ? $conf['controllers'] : array());
		
		if(isset($conf['params']) && is_array($conf['params']) && count($conf['params'])>0 ){
			foreach ($conf['params'] as $k => $v){
				Globals::setParam($k, $v);
			}
		}
		
	}

}
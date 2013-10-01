<?php

namespace Chiara\Core;


class ViewModel{
	
	private $params;
	private $layout;
	
	private $viewName;
	
	public function __construct($vars=array()){
		$this->params = $vars;
		$this->layout = '';
	}
	
	
	public static function renderHTMLOnFly($name, $data=array()){
		$vm = new ViewModel();
		$vm->assign($data);
		return $vm->renderHTML($name, true);
	}
	
	/**
	 * assign associative array or single param/value
	 * @param unknown_type $param
	 * @param unknown_type $value
	 */
	public function assign($param, $value=''){
		if(is_array($param)){
			foreach ($param as $k=>$v){
				$this->params[$k] = $v;
			}
		}else{
			$this->params[$param] = $value;
		}
	}
	
	public function param($param){
		if(isset($this->params[$param]))
			return $this->params[$param];
		return '';
	}
	
	public function setLayout($name){
		$this->layout = $name;
	}
	
	public function renderJSON(){
		header('Content-Type: application/json');
		$rsp = json_encode($this->params);
		if(isset($_GET['fnc']) && preg_match('/[A-Za-z_.]*/',$_GET['fnc'])!=0){
			$rsp = $_GET['fnc'] . '(' . $rsp . ')';
		}
		echo $rsp;
	}
	
	public function renderHTML($name, $asString = false){
		
		$this->viewName = $name;
		if($asString) ob_start();
			
		if($this->layout != ''){
			$file  = Globals::getParam('layoutsDir', '/');
			$file .= '/' . $this->layout . '.phtml';
			include realpath($file);
		}
		else{
			$this->getContents();
		}
		
		if($asString) return ob_get_clean();
		
	}
	
	private function getContents(){
		
		$file  = Globals::getParam('viewsDir', '/');
		$file .= '/' . $this->viewName . '.phtml';
		
		include realpath($file);
	}
	
	private function getOption($name){
		
		switch ($name){
			case 'urlbase':
				return Globals::getParam('Http')->getBaseUrl();
			case 'abs_urlbase':
				return Globals::getParam('Http')->getScheme() .'://'. $_SERVER['SERVER_NAME'] . Globals::getParam('Http')->getBaseUrl();
			case 'http_abs_urlbase':
				return 'http://'. $_SERVER['SERVER_NAME'] . Globals::getParam('Http')->getBaseUrl();
			case 'https_abs_urlbase':
				return 'https://'. $_SERVER['SERVER_NAME'] . Globals::getParam('Http')->getBaseUrl();
			default:
				return '';
		}
		
	}

}
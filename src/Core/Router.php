<?php

namespace Chiara\Core;


class Router{
	
	private $controllerAccess;
	private $actionAccess;
	private $controllerList;
	private $paramContext;
	private $paramAction;
	private $stack;
	
	private $dispatchedFirst;
	
	public function __construct(){
		$this->stack = array();
		$this->controllerList = array();
		$this->actionAccess = 'act';
		$this->controllerAccess = 'ctx';
		$this->paramAction = '';
		$this->paramContext = '';
		$this->dispatchedFirst = false;
		$this->checkRequest();
	}
	
	public function addToStack($txt){
		$this->stack[] = $txt;
	}
	
	public function getStack(){
		return $this->stack;
	}
	
	public function checkRequest(){
		
		$ctrl = isset($_GET[$this->controllerAccess]) ? $_GET[$this->controllerAccess] : '/';
		$act = isset($_GET[$this->actionAccess]) ? $_GET[$this->actionAccess] : 'index';
		$ctrl = isset($_POST[$this->controllerAccess]) ? $_POST[$this->controllerAccess] : $ctrl;
		$act = isset($_POST[$this->actionAccess]) ? $_POST[$this->actionAccess] : $act;
		
		//$length = strlen($_SERVER['SERVER_NAME']);
		$req = substr(Http::getRequestUri(), strpos(Http::getRequestUri(), Http::getServer('SERVER_NAME')));
		
		if(Http::getBaseUrl()!='')
			$req = str_replace(Http::getBaseUrl().'/', '', $req);
		if(substr($req, 0, 1) == '/') $req = substr($req, 1);
		$req_par = explode('?',$req);
		$contextDescriptor = explode('/',$req_par[0]);
		
		if(isset($contextDescriptor[0]) && $contextDescriptor[0]!='') $ctrl = $contextDescriptor[0];
		if(isset($contextDescriptor[1]) && $contextDescriptor[1]!='') $act = $contextDescriptor[1];
		
		$this->paramContext = $ctrl;
		$this->paramAction  = $act;
		
		if(count($contextDescriptor)>2){
			for($i=2; $i < count($contextDescriptor); $i++){
				$c = $i-2;
				Http::setParam('URL_PARAM'.$c, $contextDescriptor[$i]);
			}
		}
		
	}
	
	public function dispatch(){

		$foundDot = strripos($this->paramAction, '.');
		
		if($foundDot!=false && $foundDot>0) $this->paramAction = substr($this->paramAction, 0, $foundDot );
		
		
		$this->dispatchedFirst = true;
		$this->addToStack('Dispatch: '.$this->paramAction.', context: '.$this->paramContext);
		$ctrlObj = null;
		foreach ($this->controllerList as $c){
			$c['context'] = $c['context']!='/' ? trim($c['context'], '/') : $c['context'];
			if( $c['context'] == $this->paramContext ){
				$ctrlObj = new $c['classname']();
				break;
			}
		
			if( $c['classname'] == $this->paramContext ){
				$ctrlObj = new $c['classname']();
				break;
			}
		}
		
		if(!is_object($ctrlObj)) {
			Globals::getParam('Router')->forward('notFound', 'error');
		}
		
		$action = $this->paramAction.'Action';
		
		if(!method_exists($ctrlObj, $action) ) {
			Globals::getParam('Router')->forward('notFound', 'error');
		}
		
		$ctrlObj->$action();
	}
	
	public function forward($action, $context){
		
		$this->paramContext = $context;
		$this->paramAction  = $action;

		if($this->dispatchedFirst)
			$this->dispatch();
		
	}
	
	public function redirect($action, $context){
		$url = $this->getUrlFor($action, $context);
		header('Location: '.$url);
	}
	
	public function getUrlFor($action, $context, $params=array()){
		
		$url =  Http::getScheme().'://'. $_SERVER['HTTP_HOST'] . Http::getBaseUrl();
		
		//if(substr($url, strlen($url)-1, strlen($url)) === '/') $url = substr($url, 0, strlen($url)-1);
		$url .= (substr($context, 0, 1)==='/' ? '' : '/') . $context;
		
		//if(substr($url, strlen($url)-1, strlen($url)) === '/') $url = substr($url, 0, strlen($url)-1);
		$url .= (substr($action, 0, 1)==='/' ? '' : '/') . $action;
		
		if(is_array($params) && count($params)>0){
			$url .= '?';
			foreach($params as $par => $val){
				$url .= $par . '=' . $val . '&' ;
			}
		}
		
		return $url;
	}
	
	
	public function closeRequest(){
		exit(0);
	} 
	
	public function setControllersList($list){
		
		$this->controllerList = array();
		
		$foundMain = false;
		foreach ($list as $c){
			
			if(!is_array($c)) continue;
			
			if(!isset($c['classname']) || !isset($c['context'])) continue;
			if( $c['context']=='/' ) $foundMain=true;
			
			$this->controllerList[] = $c;
		}
		
		if(!$foundMain){
			$this->controllerList = array_merge(array('classname' => 'IndexController', 'context' => '/'), $this->controllerList);
		}
	}

	public function setControllerAccess($param){
		$this->controllerAccess = $param;
	}
	
	public function setActionAccess($param){
		$this->actionAccess = $param;
	}

}
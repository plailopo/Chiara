<?php

namespace Chiara\Core;


class Router{
	
	private static $controllerAccess;
	private static $actionAccess;
	private static $controllerList;
	private static $paramContext;
	private static $paramAction;
	private static $stack;
	
	public static function init(){
		Router::$stack = array();
		Router::$controllerList = array();
		Router::$actionAccess = 'act';
		Router::$controllerAccess = 'ctx';
		Router::$paramAction = '';
		Router::$paramContext = '';
		Router::checkRequest();
	}
	
	public static function addToStack($txt){
		Router::$stack[] = $txt;
	}
	
	public static function getStack(){
		return Router::$stack;
	}
	
	public static function checkRequest(){
		
		$ctrl = isset($_GET[Router::$controllerAccess]) ? $_GET[Router::$controllerAccess] : '/';
		$act = isset($_GET[Router::$actionAccess]) ? $_GET[Router::$actionAccess] : 'index';
		$ctrl = isset($_POST[Router::$controllerAccess]) ? $_POST[Router::$controllerAccess] : $ctrl;
		$act = isset($_POST[Router::$actionAccess]) ? $_POST[Router::$actionAccess] : $act;
		
		$req = substr(Http::getRequestUri(), strpos(Http::getRequestUri(), Http::getServer('SERVER_NAME')));
		
		if(Http::getBaseUrl()!='')
			$req = str_replace(Http::getBaseUrl().'/', '', $req);
		if(substr($req, 0, 1) == '/') $req = substr($req, 1);
		$req_par = explode('?',$req);
		$contextDescriptor = explode('/',$req_par[0]);
		
		if(isset($contextDescriptor[0]) && $contextDescriptor[0]!='') $ctrl = $contextDescriptor[0];
		if(isset($contextDescriptor[1]) && $contextDescriptor[1]!='') $act = $contextDescriptor[1];
		
		Router::$paramContext = $ctrl;
		Router::$paramAction  = $act;
		
		if(count($contextDescriptor)>2){
			for($i=2; $i < count($contextDescriptor); $i++){
				$c = $i-2;
				Http::setParam('URL_PARAM'.$c, $contextDescriptor[$i]);
			}
		}
		
	}
	
	public static function dispatch(){

		$foundDot = strripos(Router::$paramAction, '.');
		
		if($foundDot!=false && $foundDot>0) Router::$paramAction = substr(Router::$paramAction, 0, $foundDot );
		
		
		Router::addToStack('Dispatch: '.Router::$paramAction.', context: '.Router::$paramContext);
		$ctrlObj = null;
		foreach (Router::$controllerList as $c){
			$c['context'] = $c['context']!='/' ? trim($c['context'], '/') : $c['context'];
			if( $c['context'] == Router::$paramContext ){
				$ctrlObj = new $c['classname']();
				break;
			}
		
			if( $c['classname'] == Router::$paramContext ){
				$ctrlObj = new $c['classname']();
				break;
			}
		}
		
		if(!is_object($ctrlObj)) {
			Router::forward('notFound', 'error');
		}
		
		$action = Router::$paramAction.'Action';
		
		if(!method_exists($ctrlObj, $action) ) {
			Router::forward('notFound', 'error');
		}
		
		$ctrlObj->$action();
	}
	
	public static function forward($action, $context){
		
		Router::$paramContext = $context;
		Router::$paramAction  = $action;
		
		Router::dispatch();
		
	}
	
	public static function redirect($action, $context){
		$url = Router::getUrlFor($action, $context);
		header('Location: '.$url);
	}
	
	public static function getUrlFor($action, $context, $params=array()){
		
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
	
	
	public static function closeRequest(){
		exit(0);
	} 
	
	public static function setControllersList($list){
		
		Router::$controllerList = array();
		
		$foundMain = false;
		foreach ($list as $c){
			
			if(!is_array($c)) continue;
			
			if(!isset($c['classname']) || !isset($c['context'])) continue;
			if( $c['context']=='/' ) $foundMain=true;
			
			Router::$controllerList[] = $c;
		}
		
		if(!$foundMain){
			Router::$controllerList = array_merge(array('classname' => 'IndexController', 'context' => '/'), Router::$controllerList);
		}
	}

	public static function setControllerAccess($param){
		Router::$controllerAccess = $param;
	}
	
	public static function setActionAccess($param){
		Router::$actionAccess = $param;
	}

}
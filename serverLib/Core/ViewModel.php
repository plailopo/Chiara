<?php

namespace Chiara\Core;


use Chiara\Message\UserMessage;
use Chiara\Message\UserMessageMapper;
use App\Init;
class ViewModel{
	
	// Accesso statico ai parametri
	private static $params;
	
	private static $preRenderingCallback = '';
	private static $layout;
	private static $viewName;
	
	public function __construct($vars=array()){
		self::$params = $vars;
		$this->layout = '';
	}
	
	/**
	 * assign associative array or single param/value
	 * @param unknown_type $param
	 * @param unknown_type $value
	 */
	public static function assign($param, $value=''){
		if(is_array($param)){
			foreach ($param as $k=>$v){
				self::$params[$k] = $v;
			}
		}else{
			self::$params[$param] = $value;
		}
	}
	
	public static function param($param){
		if(isset(self::$params[$param]))
			return self::$params[$param];
		return '';
	}
	
	public static function setLayout($name){
		self::$layout = $name;
	}
	
	public static function renderJSON($contentType='application/json'){
		
		self::callPreRenderingCallback();
		
		header('Content-Type: '.$contentType);
		header('Access-Control-Allow-Origin: *');
		$rsp = json_encode(self::$params);
		if(isset($_GET['fnc']) && preg_match('/[A-Za-z_.]*/',$_GET['fnc'])!=0){
			$rsp = $_GET['fnc'] . '(' . $rsp . ')';
		}
		echo $rsp;
	}
	
	public static function renderHTML($name, $asString = false, $callback=""){
	
		self::callPreRenderingCallback();
	
		self::$viewName = $name;
		
		if($asString) ob_start();
		
		if(isset(self::$layout) && self::$layout != ''){
			$file  = Init::$layoutDir;
			$file .= '/' . self::$layout . '.phtml';			
			if(file_exists($file))
				include realpath($file);
			else
				throw new Exception("File not found");
		}
		else{
			self::getContents();
		}
	
		if($asString) return ob_get_clean();
	
	}
	
	public static function getContents($name=false){
		
		$file  = Init::$viewDir;
		if($name) 
			$file .= '/' . $name . '.phtml';
		else 
			$file .= '/' . self::$viewName . '.phtml';
		
		if(file_exists($file))
			include realpath($file);
	}
	
	public static function getOption($name){
		
		switch ($name){
			case 'urlbase':
				return Http::getBaseUrl();
			case 'abs_urlbase':
				return Http::getScheme() .'://'. $_SERVER['HTTP_HOST'] . Http::getBaseUrl();
			case 'http_abs_urlbase':
				return 'http://'. $_SERVER['HTTP_HOST'] . Http::getBaseUrl();
			case 'https_abs_urlbase':
				return 'https://'. $_SERVER['HTTP_HOST'] . Http::getBaseUrl();
			default:
				return '';
		}
		
	}
	
	public static function setPreRenderingCallback($fnc, $param){
		self::$preRenderingCallback = array('name' => $fnc, 'params' => $param);
	}
	
	public static function callPreRenderingCallback(){
		if(is_array(self::$preRenderingCallback) && isset(self::$preRenderingCallback['name'])){
			if(isset(self::$preRenderingCallback['params'])){
				call_user_func_array(self::$preRenderingCallback['name'], array());
			}
			else{
				call_user_func_array(self::$preRenderingCallback['name'], self::$preRenderingCallback['params']);
			}
		}
	}
	
	public static function paginator($list, $page, $rows, $total){
		
		$ret = array(
				'list' => $list,
				'currentPage' => $page,
				'pgTotalPage' => ceil($total/$rows),
				'rowsPerPage' => $rows,
				'pgTotalItem' => $total
		);
	
		return $ret;
	}

	/** PARSING SPECIAL TAG
	 example {#label asdasd ITA}
	 \{\#label ([a-z\.\-_]*) ([a-zA-Z]*)\}\U
	public static function parseSpecialTag($string){
	
		preg_match_all("|{\#(.*)\}|U", $string, $result);
		
		$conversion = [];
		if(is_array($result)) for($i=0; $i<count($result[0]); $i++){
			$func = explode(" ", $result[1][$i], 1);
			
			if($func == '')
		}
	
	}
	*/
}
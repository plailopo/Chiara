<?php

namespace Chiara;

class NLoader{
	
	private $paths;
	private $namespaces;
	
	public function __construct(){
		$this->paths = array();
		$this->namespaces = array();
		$this->addNamespace('Chiara', realpath(dirname(__FILE__)));
	}
	
	/**
	 *	Load cirectly
	 */
	public function letsInclude($path){
		if(file_exists($path))
			return require_once($path);
	}
	
	
	public static function includeOneShot($path){
		if(file_exists($path))
			return require_once($path);
	}
	
	/**
	 *	Add path
	 */
	public function addPath($path){
		$this->paths = array_merge($this->paths, $this->getDirList($path));
	}
	
	/**
	 *	Add namespaces
	 */
	public function addNamespace($ns, $path){
		$this->namespaces[$ns] = $path;
	}
	
	public function load(){
		spl_autoload_register(array($this, 'loader'));
	}
	
	public function loader($classname){
		$pathClass = explode('\\', $classname);
		

		foreach ($this->namespaces as $n => $p){
			
			if( stripos($classname, $n) !==0 ) continue;
			$pathNamespace = explode('\\', $n);
			
			
			$absClassPath = $p . '/' . implode('/', array_slice($pathClass, count($pathNamespace)) ) . '.php';
			if(file_exists($absClassPath)){
				return require_once($absClassPath);
			}	
		}
		
		foreach ($this->paths as $item){

			$path = $item;
			if(is_dir($item)){
				$path = $item . '/' . $classname . '.php';
			}
			
			if(file_exists($path)){
				return require_once($path);
			}
		}
	}
	
	private function getDirList($path){
		if(!file_exists($path)) return array();
		$dirs = array($path);
		
		if ($handle = opendir($path)){
			while (false !== ($file = readdir($handle))) {
				if ($file != "." && $file != "..") {
					$absFile = realpath($path.'/'.$file);
					if(is_dir($absFile)){
						$dirs = array_merge($dirs, $this->getDirList($absFile));
					}
				}
			}
			closedir($handle);
		}
		return $dirs;
	}
}
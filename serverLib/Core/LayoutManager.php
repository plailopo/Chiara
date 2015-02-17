<?php

namespace Chiara\Core;


class LayoutManager{
	
	private $layouts;
	
	public function __construct(){
	}
	
	public function add($name){
		$this->layouts = $value;
	}
	
	public function renderJSON(){
		echo json_encode($this->params);
	}
	
	public function renderHTML($name){
		
		$file  = Globals::getParam('viewsDir', '/');
		$file .= '/' . $name . '.phtml';
		
		include $file;
		
	}

}
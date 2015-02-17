<?php

namespace Chiara\Commons;

class MessageButton{

	private $value;
	private $type;
	private $action;
	
    public function __construct($value='', $type='', $action=''){
        $this->value = $value;
        $this->type = $type;
        $this->action = $action;
    }
    
    public function getValue(){
    	return $this->value;
    }
    
    public function setValue($value){
    	$this->value = $value;
    }
    
    public function getType(){
    	return $this->type;
    }
    
    public function setType($value){
    	$this->type = $value;
    }
    
    public function getAction(){
    	return $this->action;
    }
    
    public function setAction($value){
    	$this->action = $value;
    }
    
    
}


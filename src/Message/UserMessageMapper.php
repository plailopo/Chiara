<?php
namespace Chiara\Message;


class UserMessageMapper{

	private $list;
	
    public function __construct(){
        $this->list = array();
    }
    
    public function pushMsg($msg){
    	 
    	if(!is_array($this->list)){
    		$this->list = array();
    	}
    	 
    	if($msg instanceof UserMessage){
    		array_push($this->list, $msg);
    	}
    }
    
    public function push($text, $level=UserMessage::INFO, $type='fast', $description='', $buttons=array()){
    	$msg = new UserMessage($text, $level, $type, $description, $buttons);
    	
    	if(!is_array($this->list)){
    		$this->list = array();
    	}
    	
    	array_push($this->list, $msg);
    }

    public function getList($level=-1){
    	if($level<0)
    		return $this->list;
    	
    	$tmp = array();
    	foreach ($this->list as $m){
    		if($m->getLevel()<=$level) array_push($tmp, $m);
    	}
    	return $tmp;
    }
    
    public function messagesOnView($view, $level=-1){
    	$view->messages = $this->getArray();
    }
    
    public function getJSONArray($level=-1){
    	return json_encode($this->getArray($level));
    }
    
    public function getArray($level=-1){
    	$list = $this->getList($level);
    	
    	$tmp = array();
    	foreach ($list as $m){
    		array_push($tmp, array(
    						'type' => $m->getType(),
    						'text' => $m->getText(),
		    				'level' => $m->getLevel(),
		    				'description' => $m->getDescription(),
		    				'buttons' => $this->buttonsToArray($m->getButtons()),
		    				'timestamp' => $m->getTimestamp()
    				));
    	}
    	return $tmp;
    }
    
    public function flush(){
    	$this->list = array();
    }
    
    private function buttonsToArray($btns){
    	
    	$ret = array();
    	if(is_array($btns)){
    		foreach($btns as $b){
    			if($b instanceof UserMessageButton){
    				array_push($ret, array(
    							'value' => $b->getValue(),
    							'type' => $b->getType(),
    							'action' => $b->getAction()
    						));
    			}
    		}
    	}
    	
    	return $ret;
    	
    }
    
    private function getJSONButtons($btns){
    	return json_encode($this->buttonsToArray($btns));
    }
}


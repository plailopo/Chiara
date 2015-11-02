<?php
namespace Chiara\Commons;


use Chiara\Core\ViewModel;
class MessageMapper{

	private static $list = array();
    
    public static function pushMsg($msg){
    	
    	if($msg instanceof Message){
    		array_push(self::$list, $msg);
    	}
    }
    
    public static function push($text, $level=Message::INFO, $type=Message::TYPE_FAST, $description='', $buttons=array(), $field=null){
    	$msg = new Message($text, $level, $type, $description, $buttons, $field);
    	array_push(self::$list, $msg);
    }

    public static function getList($level=-1){
    	if($level<0)
    		return self::$list;
    	
    	$tmp = array();
    	foreach (self::$list as $m){
    		if($m->getLevel()<=$level) array_push($tmp, $m);
    	}
    	return $tmp;
    }
    
    public static function getJSONArray($level=-1){
    	return json_encode(self::getArray($level));
    }
    
    public static function getArray($level=-1){
    	$list = self::getList($level);
    	
    	$tmp = array();
    	foreach ($list as $m){
    		array_push($tmp, array(
    						'type' => $m->getType(),
    						'text' => $m->getText(),
		    				'level' => $m->getLevel(),
		    				'field' => $m->getField(),
		    				'description' => $m->getDescription(),
		    				'buttons' => self::buttonsToArray($m->getButtons()),
		    				'timestamp' => $m->getTimestamp()
    				));
    	}
    	return $tmp;
    }
    
    public static function flush(){
    	self::$list = array();
    }
    
    private static function buttonsToArray($btns){
    	
    	$ret = array();
    	if(is_array($btns)){
    		foreach($btns as $b){
    			if($b instanceof MessageButton){
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
    
    private static function getJSONButtons($btns){
    	return json_encode($this->buttonsToArray($btns));
    }
}


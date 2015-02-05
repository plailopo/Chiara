<?php

namespace Chiara\Commons;

abstract class Log{
	
	
	public $options;
	
	const EMERG   = 0;  // Emergency: system is unusable
    const ALERT   = 1;  // Alert: action must be taken immediately
    const CRIT    = 2;  // Critical: critical conditions
    const ERR     = 3;  // Error: error conditions
    const WARN    = 4;  // Warning: warning conditions
    const NOTICE  = 5;  // Notice: normal but significant condition
    const INFO    = 6;  // Informational: informational messages
    const DEBUG   = 7;  // Debug: debug messages
    
    
	public function __construct($opt = NULL){
		if(is_array($opt)) $this->configure($opt);
	}
	
	/**
	 * write
	 * @param string $msg
	 * @param const $level
	 */
	public function write($msg, $level=self::INFO){}
	
	
	public function configure($conf){
		
		if(!is_array($conf)) return false;
		$this->options = $conf;
		
	}

}
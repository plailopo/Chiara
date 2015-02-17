<?php

namespace Chiara\Commons;

class LogFile extends Log{
	
	/**
	 * write
	 * @param string $msg
	 * @param const $level
	 */
	public function write($msg, $level=self::INFO){
		
		if(!is_array($this->options)) return;
		
		if(isset($this->options['dataformat'])){
			$msg = date($this->options['dataformat']) . $msg;
		}
		
		$msg = $level . ' ' . $msg;
		
		file_put_contents($this->options['filepath'], $msg."\n", FILE_APPEND);
		
	}

}
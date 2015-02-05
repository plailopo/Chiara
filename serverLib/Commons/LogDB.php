<?php

namespace Chiara\Commons;

class LogDB extends Log{
	
	/**
	 * write
	 * @param string $msg
	 * @param const $level
	 */
	public function write($msg, $level=self::INFO, $id_user=0){
		
		if(!is_array($this->options)) return;
		
		$sql = "INSERT INTO ";
		$sql .= $this->options['tabelname'];
		$sql .= " (time, level, text, id_user) ";
		$sql .= " VALUES(?, ?, ?, ?) ";
		$prm = array(microtime(true), $level, $msg, $id_user);
		
		$this->options['db']->query($sql, $prm);
		
	}

}
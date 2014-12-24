<?php

namespace Chiara\Utils;

class Code{
	
	
	/**
	 * Create fixed length random code with id
	 * 
	 */
	public static function fixedLengthID($id, $length){
	
		$id36  = base_convert($id, 10, 36); 
		$padLength = $length - ( strlen($id36) + 1);
		$pad = '';
		for($i=0; $i<$padLength; $i++ ){
			$char = rand(1, 35);
			$pad .= base_convert($char, 10, 36);
		}
		
		$fixedID = $pad . '0' . $id36;
		
		return strtoupper($fixedID);
	
	}
	
	/**
	 * 
	 * @param unknown $code
	 * @return string
	 */
    public static function retriveID($code){
    	
    	$id36 = substr($code, strrpos($code, '0'));
    	
    	return base_convert($id36, 36, 10);
    	
    }
    
}


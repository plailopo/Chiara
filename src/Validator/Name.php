<?php

namespace Chiara\Validator;

class Name extends Validator{
	
	public static function isValid($str){

		if( strlen($str) < 4 ) return false;
		$m = preg_match('/^[A-Za-z][A-Za-z\'\- ]*$/',$str);
		return $m==0 || $m===false ? false : true;
	}
	
}
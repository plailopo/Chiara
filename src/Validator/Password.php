<?php

namespace Chiara\Validator;

class Password extends Validator{
	
	public static function isValid($str){

		if( strlen($str) < 6 ) return false;
		return true;
		
	}
	
}
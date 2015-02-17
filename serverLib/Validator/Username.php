<?php

namespace Chiara\Validator;

class Username extends Validator{
	
	public static function isValid($str){

		if( strlen($str) < 4 ) return false;
		return preg_match('/^[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)*$/',$str)==0 ? false : true;
	}
	
}
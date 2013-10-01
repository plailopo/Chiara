<?php

namespace Chiara\Validator;

class Phone extends Validator{
	
	public static function isValid($str){

		if( strlen($str) < 4 ) return false;
		return preg_match('/[A-Za-z0-9\+\-\#\* ]*/',$str)==0 ? false : true;
	}
	
}
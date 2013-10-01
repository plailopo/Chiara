<?php

namespace Chiara\Date;

class Utils{
	
	const DATE_FORMAT_DB			= 'Y-m-d';
	const DATE_FORMAT_USER_IT		= 'd/m/Y';
	
	const DATETIME_FORMAT_DB		= 'Y-m-d H:i:s';
	const DATETIME_FORMAT_USER_IT	= 'd/m/Y H:i:s';

	public static function formatDate($date, $initFormat=self::DATE_FORMAT_DB, $endFormat=self::DATE_FORMAT_USER_IT){
		$d = \DateTime::createFromFormat($initFormat, $date);
		return $d->format($endFormat);
	}
	
	
}
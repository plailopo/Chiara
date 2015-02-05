<?php

namespace Chiara\Commons;

use Chiara\Core\Exception;

class DateHelper{
	
	const DATE_COMPRESS				= 'Ymd';
	
	const DATE_FORMAT_DB			= 'Y-m-d';
	const DATE_FORMAT_USER_IT		= 'd/m/Y';
	
	const TIME_FORMAT				= 'H:i:s';
	const TIME_FORMAT_HUMAN			= 'G:i';
	
	const DATETIME_FORMAT_DB		= 'Y-m-d H:i:s';
	const DATETIME_FORMAT_USER_IT	= 'd/m/Y H:i';
	
	const WEEK_DAY					= 'w';
	const TIMESTAMP					= 'U';
	const DAY_1_31					= 'j';
	
	
	public static function formatToDB($date, $from = self::DATE_FORMAT_USER_IT){
		if(strlen($date)>10)
			return self::formatDate($date, $from, self::DATETIME_FORMAT_DB);
		return self::formatDate($date, $from, self::DATE_FORMAT_DB);
	}
	
	public static function formatToUser($date, $from=self::DATE_FORMAT_DB){
		if(strlen($date)>10)
			return self::formatDate($date, $from, self::DATETIME_FORMAT_USER_IT);
		return self::formatDate($date, $from, self::DATE_FORMAT_USER_IT);
	}

	public static function formatDate($date, $initFormat=self::DATE_FORMAT_DB, $endFormat=self::DATE_FORMAT_USER_IT){
		
		if(self::checkFormatDate($date, $initFormat)){
			$d = \DateTime::createFromFormat($initFormat, $date);
			if($d!==false){
				$exitDate = $d->format($endFormat);
				//if(self::checkFormatDate($exitDate, $endFormat)) return $exitDate;
				return $exitDate;
			}
		}
		
		return false;
	}
	
	public static function checkFormatDate( $date, $format ) {
		
		if($format == self::DATE_FORMAT_DB){
			if ( preg_match("/^[0-9][0-9]{3}-[01][0-9]-[0-3][0-9]$/",$date) ) {
				list( $year , $month , $day ) = explode('-',$date);
				return( checkdate( $month , $day , $year ) );
			} else {
				return( false );
			}
		}else if($format == self::DATE_FORMAT_USER_IT){
			if ( preg_match("/^[0-3][0-9]\/[01][0-9]\/[0-9]{4}$/",$date) ) {
				list( $day , $month , $year ) = explode('/',$date);
				return( checkdate( $month , $day , $year ) );
			} else {
				return( false );
			}
		}else if($format == self::TIME_FORMAT){
			if ( preg_match("/^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]([0-9.])*/",$date) ) {
				return true;
			} else {
				return( false );
			}
		}else if($format == self::TIME_FORMAT_HUMAN){
			if ( preg_match("/^([01][0-9]|2[0-3]):[0-5][0-9]/",$date) ||
				 preg_match("/^([0-9]|1[0-9]|2[0-3]):[0-5][0-9]/",$date) ) {
				return true;
			} else {
				return( false );
			}
		}else if($format == self::DATE_COMPRESS){
			if ( preg_match("/^[0-9][0-9]{3}[01][0-9][0-3][0-9]$/",$date) ) {
				return true;
			} else {
				return( false );
			}
		}else if($format == self::DATETIME_FORMAT_DB){
			list( $dt , $hr ) = explode(' ',$date);
			return self::checkFormatDate($dt, self::DATE_FORMAT_DB) && self::checkFormatDate($hr, self::TIME_FORMAT);
		}else if($format == self::DATETIME_FORMAT_USER_IT){
			if(strlen($date) < 10 ) return false;
			list( $dt , $hr ) = explode(' ',$date);
			return self::checkFormatDate($dt, self::DATE_FORMAT_USER_IT) && self::checkFormatDate($hr, self::TIME_FORMAT_HUMAN);
		}
		
	}
	
	
}
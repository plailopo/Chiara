<?php

namespace App;


use Chiara\Core\Exception;
use Chiara\Core\Session;
use Chiara\Core\Globals;
use Chiara\Core\ViewModel;
use Chiara\Core\InitAbstract;
use Chiara\Commons\MessageMapper;
use Chiara\Commons\Message;
use Chiara\Commons\Log;
use Chiara\Commons\LogFile;
use Chiara\Commons\LogDB;
use Chiara\Commons\DBDriver;
use Chiara\Core\Router;


class Init extends InitAbstract{
	
	
	public function initError() {
		
		set_error_handler ( function ($errno, $errstr, $errfile, $errline) {
			
			if (! error_reporting ())
				return;
			if (Globals::exist ( 'LOG' ))
				Globals::getParam ( 'LOG' )->write ( $errstr . " in $errfile:$errline" . $errno, Log::ERR );
			
			ViewModel::assign ( 'ERRNO', $errno );
			ViewModel::assign ( 'ERRSTR', $errstr );
			ViewModel::assign ( 'ERRFILE', $errfile );
			ViewModel::assign ( 'ERRLINE', $errline );
			
			Router::forward ( 'error', 'error' );
		} );
		
		set_exception_handler ( function ($ex) {
			
			ViewModel::assign ( 'SYSTEM_ERR', nl2br ( $ex ) );
			
			switch(get_class($ex)){
				case 'PDOException':
					Router::forward('dbConnection', 'error');
					break;
				default:
					Router::forward('error', 'error');
					break;
			}
						
			Router::closeRequest();
			
		} );
		 
	    
	}
	
	public function initConfiguration(){
		
		$data   = parse_ini_file(Globals::getParam('ConfigFile', false), true);
		
		Globals::setParam('CONF', $data);
	}
	
	public function initTime(){
		Globals::setParam('DATE', new \DateTime());
	}
	
	public function initLog(){
		$log = new LogFile(array('filepath'=> Globals::getParam('LogFile', false), 'dataformat' => 'Y-m-d H:i:s - '));
		Globals::setParam('LOG', $log);
		//$log->write("Open request", Log::INFO);
	}
	
	public function initInterface(){
	
		ViewModel::setLayout('portal');
	
		ViewModel::setPreRenderingCallback('App\Init::finalCallBack', array());
	
	}
	
	/*
	public function initDB(){
		
		$conf = Globals::getParam('CONF', false);
		
		if(!$conf) 
			throw new Exception('DB Configuration not found');
		
		$dbConf = $conf['DB']; 
		
		$dbn = 1;
		$adapter = false;
		
		while (1){
			$nameConf = 'db'.$dbn;
			
			if(!isset($dbConf[$nameConf.'.type'])) break;
			
			try{
				$adapter = new DBDriver([
					'database_type' => $dbConf[$nameConf.'.type'],
					'database_name' => $dbConf[$nameConf.'.name'],
					'server' => $dbConf[$nameConf.'.host'],
					'username' => $dbConf[$nameConf.'.user'],
					'password' => $dbConf[$nameConf.'.pswd'],
				]);
			}
			catch (Exception $e) {}
			
			$dbn++;
		} 	
		
		if(!$adapter)
			Router::forward('dbConnection', 'error');
		
		Globals::setParam('DB', $adapter);
		
	}
	*/
	
	public static function finalCallBack(){
		
		ViewModel::assign('messages', MessageMapper::getArray());
	}
	
}


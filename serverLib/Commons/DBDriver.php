<?php

namespace Chiara\Commons;

use \PDO;

class DBDriver{
	
	const QUERY_DIRECT				= 0;
	const QUERY_PREPARED_NAMED		= 1;
	const QUERY_PREPARED_MARKED		= 2;
	
	protected $database_type;

	// For MySQL, MariaDB, MSSQL, Sybase, PostgreSQL, Oracle
	protected $server;

	protected $username;

	protected $password;

	// For SQLite
	protected $database_file;

	// For MySQL or MariaDB with unix_socket
	protected $socket;

	// Optional
	protected $port;

	protected $charset;

	protected $database_name;

	protected $option = array();
	
	// Variable 
	protected $logs = array();
	
	
	
	public function __construct($options = null){
		if($options) $this->connect($options);
	}
	
	public function connect($options){

		try {
			$commands = array();
		
			if (is_string($options) && !empty($options)){
				
				if (strtolower($this->database_type) == 'sqlite'){
					$this->database_file = $options;
				}else{
					$this->database_name = $options;
				}
				
			}elseif (is_array($options)){
				foreach ($options as $option => $value){
					$this->$option = $value;
				}
			}
		
			if ( isset($this->port) && is_int($this->port * 1) ){
				$port = $this->port;
			}
		
			$type = strtolower($this->database_type);
			$is_port = isset($port);
		
			switch ($type){
				case 'mariadb':
					$type = 'mysql';
		
				case 'mysql':
					if ($this->socket){
						$dsn = $type . ':unix_socket=' . $this->socket . ';dbname=' . $this->database_name;
					}else{
						$dsn = $type . ':host=' . $this->server . ($is_port ? ';port=' . $port : '') . ';dbname=' . $this->database_name;
					}
		
					// Make MySQL using standard quoted identifier
					$commands[] = 'SET SQL_MODE=ANSI_QUOTES';
					break;
		
				case 'pgsql':
					$dsn = $type . ':host=' . $this->server . ($is_port ? ';port=' . $port : '') . ';dbname=' . $this->database_name;
					break;
		
				case 'sybase':
					$dsn = 'dblib:host=' . $this->server . ($is_port ? ':' . $port : '') . ';dbname=' . $this->database_name;
					break;
		
				case 'oracle':
					$dbname = $this->server ?
					'//' . $this->server . ($is_port ? ':' . $port : ':1521') . '/' . $this->database_name :
					$this->database_name;
		
					$dsn = 'oci:dbname=' . $dbname . ($this->charset ? ';charset=' . $this->charset : '');
					break;
		
				case 'mssql':
					$dsn = strstr(PHP_OS, 'WIN') ?
					'sqlsrv:server=' . $this->server . ($is_port ? ',' . $port : '') . ';database=' . $this->database_name :
					'dblib:host=' . $this->server . ($is_port ? ':' . $port : '') . ';dbname=' . $this->database_name;
		
					// Keep MSSQL QUOTED_IDENTIFIER is ON for standard quoting
					$commands[] = 'SET QUOTED_IDENTIFIER ON';
					break;
		
				case 'sqlite':
					$dsn = $type . ':' . $this->database_file;
					$this->username = null;
					$this->password = null;
					break;
			}
		
			if (   in_array($type, explode(' ', 'mariadb mysql pgsql sybase mssql')) && $this->charset ){
				$commands[] = "SET NAMES '" . $this->charset . "'";
			}
		
			$this->pdo = new PDO(
					$dsn,
					$this->username,
					$this->password,
					$this->option
			);
		
			foreach ($commands as $value){
				$this->pdo->exec($value);
			}
		}catch (PDOException $e) {
			throw new Exception($e->getMessage());
		}
	}
	
	
	public function queryMarked($sql, $params = array()){
		return self::query($sql, $params, DBDriver::QUERY_PREPARED_MARKED);
	}
	
	public function queryNamed($sql, $params = array()){
		return self::query($sql, $params, DBDriver::QUERY_PREPARED_NAMED);
	}
	
	
	/**
	* Execute query
	*/
	public function query($sql, $params = array(), $type = DBDriver::QUERY_DIRECT){
		
		array_push($this->logs, $sql . ' - Params: ' . print_r($params, true));
		
		$sth = null;
		if($type == DBDriver::QUERY_PREPARED_NAMED){
		
			$sth = $this->pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
			$sth->execute($params);
			
		}else if($type == DBDriver::QUERY_PREPARED_MARKED){
			
			$sth = $this->pdo->prepare($sql);
			$sth->execute($params);
			
		}else{
			$sth = $this->pdo->exec($sql);
		}
		
		if(!$sth){
			return false;
		}
		
		if( preg_match("/^(insert|update|delete)/i", trim($sql)) ){
			return $sth->rowCount();
		}
		
		return $sth->fetchAll(PDO::FETCH_ASSOC);
		
		
	}
	
	/**
	* Execute query and return first element
	*/
	public function queryOne($sql, $params = array(), $type = DBDriver::QUERY_DIRECT){
		$rslt = $this->query($sql, $params, $type);
		if($rslt && count($rslt)>0) return $rslt[0];
	}
	
	public function getLog(){
		return $this->logs;
	} 
	
	public function getLastLog(){
		return $this->logs[count($this->logs)-1];
	}
	
	public function getLastInsertedId(){
		return $this->pdo->lastInsertId();
	}

}
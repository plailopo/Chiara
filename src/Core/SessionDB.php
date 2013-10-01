<?php

namespace Chiara\Core;

use Chiara\Log\Log;
use Chiara\Log\LogFile;
use Chiara\Log\LogDB;

class SessionDB{
	
	private $db;
	private $session = false;
	private $data = array();
	
	
	public function __construct($dbConnection){
		$this->db = $dbConnection;
	}
	
	public function open($name='nFSESSION'){
		
		session_name($name);
		session_start();
		
		if($this->retrive()===false){
			$this->create();
		}
		
	}
	
	private function retrive($id=''){
	
		if($id=='')
			$s = $this->db->queryArrayOne("SELECT * FROM session WHERE id_session=? LIMIT 0,1", array(session_id()));
		else 
			$s = $this->db->queryArrayOne("SELECT * FROM session WHERE id=? LIMIT 0,1", array($id));
		
	
		if(is_array($s) && count($s)>0){
			$this->session = $s;
			$this->data = json_decode($s['data'], true);
			if(!is_array($this->data)) $this->data = array();
			return true;
		}
		
		return false;
	}
	
	private function create(){
	
		$http = new Http();
		$ip = $http->getClientIp();
		
		$id = uniqid('SES');
		
		$s = $this->db->query("INSERT INTO session (id, id_session, ip, last_request) VALUES(?,?,?,NOW())",
				array($id, session_id(), $ip));
		
		$this->retrive($id);
	}
	
	public function regenerateID(){
		if($this->session===false) return;
		
		session_regenerate_id();
		$s = $this->db->query("UPDATE session SET last_request=NOW(), id_session=? WHERE id=? ",
				array(session_id(), $this->session['id']));
	}
	
	
	public function destroy(){
		session_unset();
		if($this->session===false) return;
		$this->data = array();
		$this->updateValues();
	}
	
	public function getID(){
		return $this->session['id'];
	}
	
	/****************** MANAGE VALUES ***********/
	public function getParam($name, $default=''){
		if($this->session===false) $default;
		return is_array($this->data) && isset($this->data[$name]) ? $this->data[$name] : $default;
	}
	
	public function setParam($name, $value){
		if(is_array($this->data)){
			$this->data[$name] = $value;
			$this->updateValues();
		}
	}
	
	public function existParam($name){
		return is_array($this->data) && isset($this->data[$name]);
	}
	
	private function updateValues(){
		if($this->session===false) return;
		$data = json_encode($this->data);
		$s = $this->db->query("UPDATE session SET data=?, last_request=NOW() WHERE id=? ",
				array($data, $this->session['id']));
	}
	

	
}
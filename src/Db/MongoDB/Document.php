<?php

namespace Chiara\Db\MongoDB;

use \MongoId;

class Document extends \MongoCollection{

	/**
	 * Collection name
	 */
	protected $_collectionName;
	
	protected $_requirement;
	
	private $_db;
	
	
	/**
	 * call the parent construct padding collectionName
	 * @param unknown_type $db
	 */
	public function __construct($db, $name='', $req=array()){
		$this->_db = $db;
		$this->_collectionName = $name;
		$this->_requirement = $req;
		return parent::__construct($db, $name);
	}
	
	
	/**
	 * find a document by id
	 * @param unknown_type $id
	 */
	public function findOneById($id){
		return $this->findOne(array('_id' => new MongoId($id)));
	}
	
	/**
	 * remove a document by id
	 * @param unknown_type $id
	 */
	public function removeById($id){
		return $this->remove(array('_id' => new MongoId($id)));
	}
	
	/**
	 * 
	 * @param array|object $a
	 * @param array $options
	 * @return boolean
	 */
	public function insert($array_of_fields_OR_object, array $options = array()){
		
		if($this->checkRequirement($array_of_fields_OR_object))
			return parent::insert($array_of_fields_OR_object, $options);
		
		return false;
	}
	
	/**
	 *
	 */
	public function checkRequirement($data){
		
		if(!is_array($data)) 
			throw new ExceptionMongo('Data is not an array');
		
		foreach ($this->_requirement as $n=>$p){
			if(!is_array($p)) continue;
			
			// Required param
			if(isset($p['required']) && $p['required']===true){
				$foundR=false;
				foreach ($data as $k=>$v){
					if($k==$n){$foundR=true;break;}
				}
				if(!$foundR) return false;
			}
		}
		return true;
	}
	
}
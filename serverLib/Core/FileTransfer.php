<?php

namespace Chiara\Core;

class FileTransfer{

	
	public function __construct(){
	}
	
	public function hasFile(){
		return isset($_FILES) && is_array($_FILES) ? count($_FILES) : 0;
	}
	
	public function getNameList(){
		return isset($_FILES) && is_array($_FILES) ? $_FILES : array();
	}
	
	public function save($name, $destination){
		
		if(!isset($_FILES[$name])) 
			throw new Exception('File not found');
		
		if($_FILES[$name]['error'] != UPLOAD_ERR_OK) 
			throw new Exception('Error on upload: '.$_FILES[$name]['error']);
		
		if (!move_uploaded_file($_FILES[$name]['tmp_name'], $destination)) {
			throw new Exception('Error saving file');
		}
		
		return true;
	}
	
	
	public function tempStore($name){
	
		if(!isset($_FILES[$name]))
			throw new Exception('File not found');
	
		if($_FILES[$name]['error'] != UPLOAD_ERR_OK)
			throw new Exception('Error on upload: '.$_FILES[$name]['error']);
	
		$destination = tempnam ( TMP_DIR , "TMP".date('u') );
		if (!move_uploaded_file($_FILES[$name]['tmp_name'], $destination)) {
			throw new Exception('Error saving file');
		}
	
		return $destination;
	}
	
	
	public static function download($filepath, $mimetype='text/plain', $filename='download.txt'){
		
		header("Cache-Control: public");
		header('Content-Type: ' . $mimetype);
		header("Content-Description: File Transfer");
		header('Content-Disposition: attachment; filename="' . $filename . '"');
		header("Content-Transfer-Encoding: binary");
		
		readfile($filepath);
		
		exit;
	}
	
	public static function read($filepath, $mimetype='text/plain'){
	
		header("Cache-Control: public");
		header('Content-Type: ' . $mimetype);
		header("Content-Description: File Transfer");
	
		readfile($filepath);
	
		exit;
	}
}
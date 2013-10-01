<?php

namespace Chiara\Core;

class FileSystem{
	
	
	public static function deleteDir($dir){
	
		if(!file_exists($dir)) return false;
		if ($handle = opendir($dir)){
	
			while (false !== ($file = readdir($handle))) {
				if ($file != "." && $file != "..") {
					$absFile = realpath($dir.'/'.$file);
					if(is_dir($absFile)){
						if(!@rmdir($absFile)){
							Application_Model_Utils::deleteDir($absFile.'/');
						}
					}
					else{
						@unlink($absFile);
					}
				}
			}
			closedir($handle);
			rmdir($dir);
		}
	
		return true;
	}

}
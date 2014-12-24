<?php

namespace Chiara\I18n;

class Translator{

	const TRASLATOR_VARIABLE = 'DICTIONARY';
	private $defaultLang = '';
	private $languages = [];
	private $timeToLive = 86400; // one day
	private $tempDictionary = [];
	
    public function __construct($set = array()){
    	if(!is_array($set) || count($set)==0) return;
		
		foreach($set as $lang => $file){
			$this->addMapper($file, $lang);
		}
		
		$this->load();
    }

	public function addMapper($file, $language){
	
		if(!is_array($this->languages)) $this->languages = [];
		
		$this->languages[$language] = $file;
		
	}
	
    public function load(){
		foreach($this->languages as $lang => $file){
		
			if( Cache::exist(getCachedParamName($lang)) ) continue;
		
			$this->loadFromINI($lang, $file);
		}
	}
	
	private function loadFromINI($language, $file){
		
		$ini = parse_ini_file($file);
		
		Cache::setParam(getCachedParamName($language), $ini, $this->timeToLive);
	
	}
	
	private function getCachedParamName($language){
		return self::TRASLATOR_VARIABLE . '_' . $language;
	}
	
	public function get($label, $language){
	
		$dictionary = [];
	
		if(isset($this->tempDictionary[$language])){
			$dictionary = $this->tempDictionary[$language];
		}else{
			$dictionary = Cache::getParam(getCachedParamName($language));
			$this->tempDictionary[$language] = $dictionary;
		}
		
		if(isset($dictionary) && isset($dictionary[$label])) return $dictionary[$label];
		else return '?' . $label . '?';
	}
	
	public function getLanguageList(){
		return array_keys($this->languages);
	}
	
	public function setDefault($language){$this->defaultLang = $language;}
	public function getDefault(){return $this->defaultLang;}
	
	public function setTimeToLive($TimeToLive){$this->timeToLive = $TimeToLive;}
	public function getTimeToLive(){return $this->timeToLive;}
    
	
}


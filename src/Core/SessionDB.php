<?php

namespace Chiara\Core;

use Chiara\Log\Log;
use Chiara\Log\LogFile;
use Chiara\Log\LogDB;

class SessionDB{
	
	private $db;
	private $session = false;
	private $data = array();
	private $userAgent = null;
	private $clientInfo = array();
	
	
	public function __construct($dbConnection){
		$this->db = $dbConnection;
	}
	
	public function open($name='nFSESSION', $sesId=''){
		
		session_name($name);
		session_start();
		
		$this->userAgent = $_SERVER['HTTP_USER_AGENT'];
		$this->clientInfo = self::parse_user_agent();
		
		//echo 'session: '.UserManager::getSessionId().'___';
		if($this->retrive($sesId)===false){
			$this->create();
		}
		
	}
	
	/**
	 * 
	 * @param string $id
	 * @return boolean
	 */
	private function retrive($id=''){
	
		if($id=='')
			$s = $this->db->select('session', '*', ['id_session[=]' => session_id(), 'ORDER' => 'last_request DESC', 'LIMIT' => 1]);
		else 
			$s = $this->db->select('session', '*', ['id_session[=]' => $id, 'ORDER' => 'last_request DESC', 'LIMIT' => 1]);
		
		if(is_array($s) && count($s)>0){
			$this->session = $s[0];
			$this->data = \json_decode($s[0]['data'], true);
			if(!is_array($this->data)) $this->data = array();
			return true;
		}
		
		return false;
	}
	
	/**
	 * 
	 */
	private function create(){
	
		$ip = Http::getClientIp();
		$hostname = gethostname();
		$hostnameChar = strtoupper(substr($hostname, 0, 1));
		$id = str_replace(".", "", uniqid($hostnameChar, true));
		$accMode = Http::getPost('modeReq', 'DEFAULT');
		
		$ua = $this->userAgent ? $this->userAgent : '';
		$co = isset($this->clientInfo['platform']) ? $this->clientInfo['platform'] : '';
		$cb = isset($this->clientInfo['browser']) ? $this->clientInfo['browser'] : '';
		$cbv = isset($this->clientInfo['version']) ? $this->clientInfo['version'] : '';
		
		$this->db->query("INSERT INTO session (id, hostname, id_session, ip, last_request, access_mode, useragent, client_os, client_browser, client_browser_version) VALUES(?,?,?,?,NOW(),?,?,?,?,?)",
				array($id, $hostname, session_id(), $ip, $accMode, $ua, $co, $cb, $cbv));
		$s = $this->db->update("session", ['id' => $id,
					
			]);
		$this->retrive($id);
	}
	
	/**
	 * 
	 */
	public function regenerateID(){
		if($this->session===false) return;
		
		session_regenerate_id();
		$s = $this->db->query("UPDATE session SET last_request=NOW(), id_session=? WHERE id=? ",
				array(session_id(), $this->session['id']));
	}
	
	/**
	 * 
	 */
	public function destroy(){
		session_unset();
		if($this->session===false) return;
		$this->data = array();
		$this->updateValues();
	}
	
	/**
	 * 
	 * @return boolean
	 */
	public function getID(){
		return $this->session['id'];
	}
	
	/**
	 *
	 */
	public function getClientInfo(){
		return $this->clientInfo;
	}
	
	/*
	 * 
	 */
	public function updateUser($id){
		if($this->session===false) return;
		$s = $this->db->update("session", ['id_user' => $id], ['id[=]' => $this->session['id']]);
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
		$s = $this->db->update("session", ['data' => $data, '#last_request' => 'NOW()'], ['id[=]' => $this->session['id']]);
	}
	
	/**
	 * Parses a user agent string into its important parts
	 *
	 * @author Jesse G. Donat <donatj@gmail.com>
	 * @link https://github.com/donatj/PhpUserAgent
	 * @link http://donatstudios.com/PHP-Parser-HTTP_USER_AGENT
	 * @param string|null $u_agent User agent string to parse or null. Uses $_SERVER['HTTP_USER_AGENT'] on NULL
	 * @throws InvalidArgumentException on not having a proper user agent to parse.
	 * @return array an array with browser, version and platform keys
	 */
	public static function parse_user_agent( $u_agent = null ) {
		if( is_null($u_agent) ) {
			if( isset($_SERVER['HTTP_USER_AGENT']) ) {
				$u_agent = $_SERVER['HTTP_USER_AGENT'];
			} else {
				throw new \InvalidArgumentException('parse_user_agent requires a user agent');
			}
		}
	
		$platform = null;
		$browser  = null;
		$version  = null;
	
		$empty = array( 'platform' => $platform, 'browser' => $browser, 'version' => $version );
	
		if( !$u_agent ) return $empty;
	
		if( preg_match('/\((.*?)\)/im', $u_agent, $parent_matches) ) {
	
			preg_match_all('/(?P<platform>BB\d+;|Android|CrOS|iPhone|iPad|Linux|Macintosh|Windows(\ Phone)?|Silk|linux-gnu|BlackBerry|PlayBook|Nintendo\ (WiiU?|3DS)|Xbox(\ One)?)
				(?:\ [^;]*)?
				(?:;|$)/imx', $parent_matches[1], $result, PREG_PATTERN_ORDER);
	
			$priority           = array( 'Android', 'Xbox One', 'Xbox' );
			$result['platform'] = array_unique($result['platform']);
			if( count($result['platform']) > 1 ) {
				if( $keys = array_intersect($priority, $result['platform']) ) {
					$platform = reset($keys);
				} else {
					$platform = $result['platform'][0];
				}
			} elseif( isset($result['platform'][0]) ) {
				$platform = $result['platform'][0];
			}
		}
	
		if( $platform == 'linux-gnu' ) {
			$platform = 'Linux';
		} elseif( $platform == 'CrOS' ) {
			$platform = 'Chrome OS';
		}
	
		preg_match_all('%(?P<browser>Camino|Kindle(\ Fire\ Build)?|Firefox|Iceweasel|Safari|MSIE|Trident/.*rv|AppleWebKit|Chrome|IEMobile|Opera|OPR|Silk|Lynx|Midori|Version|Wget|curl|NintendoBrowser|PLAYSTATION\ (\d|Vita)+)
			(?:\)?;?)
			(?:(?:[:/ ])(?P<version>[0-9A-Z.]+)|/(?:[A-Z]*))%ix',
				$u_agent, $result, PREG_PATTERN_ORDER);
	
	
		// If nothing matched, return null (to avoid undefined index errors)
		if( !isset($result['browser'][0]) || !isset($result['version'][0]) ) {
			return $empty;
		}
	
		$browser = $result['browser'][0];
		$version = $result['version'][0];
	
		$find = function ( $search, &$key ) use ( $result ) {
			$xkey = array_search(strtolower($search), array_map('strtolower', $result['browser']));
			if( $xkey !== false ) {
				$key = $xkey;
	
				return true;
			}
	
			return false;
		};
	
		$key = 0;
		if( $browser == 'Iceweasel' ) {
			$browser = 'Firefox';
		} elseif( $find('Playstation Vita', $key) ) {
			$platform = 'PlayStation Vita';
			$browser  = 'Browser';
		} elseif( $find('Kindle Fire Build', $key) || $find('Silk', $key) ) {
			$browser  = $result['browser'][$key] == 'Silk' ? 'Silk' : 'Kindle';
			$platform = 'Kindle Fire';
			if( !($version = $result['version'][$key]) || !is_numeric($version[0]) ) {
				$version = $result['version'][array_search('Version', $result['browser'])];
			}
		} elseif( $find('NintendoBrowser', $key) || $platform == 'Nintendo 3DS' ) {
			$browser = 'NintendoBrowser';
			$version = $result['version'][$key];
		} elseif( $find('Kindle', $key) ) {
			$browser  = $result['browser'][$key];
			$platform = 'Kindle';
			$version  = $result['version'][$key];
		} elseif( $find('OPR', $key) ) {
			$browser = 'Opera Next';
			$version = $result['version'][$key];
		} elseif( $find('Opera', $key) ) {
			$browser = 'Opera';
			$find('Version', $key);
			$version = $result['version'][$key];
		} elseif( $find('Midori', $key) ) {
			$browser = 'Midori';
			$version = $result['version'][$key];
		} elseif( $browser == 'MSIE' || strpos($browser, 'Trident') !== false ) {
			if( $find('IEMobile', $key) ) {
				$browser = 'IEMobile';
			} else {
				$browser = 'MSIE';
				$key     = 0;
			}
			$version = $result['version'][$key];
		} elseif( $find('Chrome', $key) ) {
			$browser = 'Chrome';
			$version = $result['version'][$key];
		} elseif( $browser == 'AppleWebKit' ) {
			if( ($platform == 'Android' && !($key = 0)) ) {
				$browser = 'Android Browser';
			} elseif( strpos($platform, 'BB') === 0 ) {
				$browser  = 'BlackBerry Browser';
				$platform = 'BlackBerry';
			} elseif( $platform == 'BlackBerry' || $platform == 'PlayBook' ) {
				$browser = 'BlackBerry Browser';
			} elseif( $find('Safari', $key) ) {
				$browser = 'Safari';
			}
	
			$find('Version', $key);
	
			$version = $result['version'][$key];
		} elseif( $key = preg_grep('/playstation \d/i', array_map('strtolower', $result['browser'])) ) {
			$key = reset($key);
	
			$platform = 'PlayStation ' . preg_replace('/[^\d]/i', '', $key);
			$browser  = 'NetFront';
		}
	
		return array( 'platform' => $platform, 'browser' => $browser, 'version' => $version );
	
	}
	

	
}
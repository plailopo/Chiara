<?php

namespace App\Controllers;

use Chiara\Core\Globals;
use Chiara\Core\ViewModel;
use Chiara\Core\ControllerAbstract;


class SiteCtrl extends ControllerAbstract{
	
	private $usermanager;
	private $view;
	
	public function init(){
		
	}
	
	public function indexAction(){
		
		ViewModel::renderHTML('site/home');
		
	}
	
	
	
}

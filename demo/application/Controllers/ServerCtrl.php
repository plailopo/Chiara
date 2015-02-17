<?php

namespace App\Controllers;

use Chiara\Core\Globals;
use Chiara\Core\ViewModel;
use Chiara\Core\ControllerAbstract;

class ServerCtrl extends ControllerAbstract{
	
	private $view;
	
	public function init(){
		ViewModel::assign('section', 'server');
	}
	
	public function indexAction(){
		
		ViewModel::assign('menu', 'style');
		ViewModel::renderHTML('test/style');
		
	}
	
	public function clientAction(){
		
		ViewModel::assign('menu', 'client');
		ViewModel::renderHTML('test/client');
		
	}
	
	public function serverAction(){
		
		ViewModel::assign('menu', 'server');
		ViewModel::renderHTML('test/server');
		
	}
	
}

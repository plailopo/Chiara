<?php

namespace App\Controllers;

use Chiara\Core\Globals;
use Chiara\Core\ViewModel;
use Chiara\Core\ControllerAbstract;

class ClientCtrl extends ControllerAbstract{
	
	private $view;
	
	public function init(){
		ViewModel::assign('section', 'client');
	}
	
	public function indexAction(){
		
		
		
	}
	
	public function ajaxAction(){
		ViewModel::assign('menu', 'ajax');
		ViewModel::renderHTML('client/ajax');
		
	}
	
	public function serverAction(){
		
		ViewModel::assign('menu', 'server');
		ViewModel::renderHTML('test/server');
		
	}
	
}

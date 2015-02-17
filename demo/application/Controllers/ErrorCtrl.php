<?php

namespace App\Controllers;

use Chiara\Core\Globals;
use Chiara\Core\ViewModel;
use Chiara\Core\ControllerAbstract;
use Chiara\Core\Router;

class ErrorCtrl extends ControllerAbstract{
	
	private $usermanager;
	private $view;
	
	
	public function init(){
		
	}
	public function indexAction(){
		
	}

	public function notFoundAction(){
		ViewModel::assign(array('stack' => Router::getStack()));
		ViewModel::renderHTML('error/error404');
		Router::closeRequest();
	}
	
	public function dbConnectionAction(){
		ViewModel::assign(array('stack' => Router::getStack()));
		ViewModel::renderHTML('error/errorDB');
		Router::closeRequest();
	}
	
	public function errorAction(){
		ViewModel::assign(array('stack' => Router::getStack()));
		ViewModel::renderHTML('error/error');
		Router::closeRequest();
	}
	
}

<?php

namespace App\Controllers;

use Chiara\Core\Globals;
use Chiara\Core\ViewModel;
use Chiara\Core\ControllerAbstract;

class ErrorCtrl extends ControllerAbstract{
	
	private $usermanager;
	private $view;
	
	
	public function init(){
		
	}
	public function indexAction(){
		
	}

	public function notFoundAction(){
		ViewModel::assign(array('stack' => Globals::getParam('Router')->getStack()));
		ViewModel::renderHTML('error/error404');
		Globals::getParam('Router')->closeRequest();
	}
	
	public function dbConnectionAction(){
		ViewModel::assign(array('stack' => Globals::getParam('Router')->getStack()));
		ViewModel::renderHTML('error/errorDB');
		Globals::getParam('Router')->closeRequest();
	}
	
	public function errorAction(){
		ViewModel::assign(array('stack' => Globals::getParam('Router')->getStack()));
		ViewModel::renderHTML('error/error');
		Globals::getParam('Router')->closeRequest();
	}
	
}

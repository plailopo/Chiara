<?php

namespace App\Controllers;

use Chiara\Core\Globals;
use Chiara\Core\ViewModel;
use Chiara\Core\ControllerAbstract;
use Chiara\Core\Router;

class ClientCtrl extends ControllerAbstract{
	
	private $view;
	
	public function init(){
		ViewModel::assign('section', 'client');
	}
	
	public function indexAction(){
		$this->introAction();
	}
	
	public function introAction(){
		ViewModel::assign('menu', 'cintro');
		ViewModel::renderHTML('client/intro');
	
	}
	
	public function ajaxAction(){
		ViewModel::assign('menu', 'ajax');
		ViewModel::renderHTML('client/ajax');
		
	}
	
	public function linkAction(){
		ViewModel::assign('menu', 'link');
		ViewModel::renderHTML('client/link');
	
	}
	
	public function paginatorAction(){
		ViewModel::assign('menu', 'paginator');
		ViewModel::renderHTML('client/paginator');
	
	}
	
	public function fastAction(){
		ViewModel::assign('menu', 'fast');
		ViewModel::renderHTML('client/fast');
	
	}
	
	public function overAction(){
		ViewModel::assign('menu', 'over');
		ViewModel::renderHTML('client/over');
	
	}
	
	public function modalAction(){
		ViewModel::assign('menu', 'modal');
		ViewModel::renderHTML('client/modal');
	
	}
	
	public function scrollAction(){
		ViewModel::assign('menu', 'scroll');
		ViewModel::renderHTML('client/scroll');
	
	}
	
	public function offAction(){
		ViewModel::assign('menu', 'off');
		ViewModel::renderHTML('client/off');
	
	}
	
	public function checkAction(){
		ViewModel::assign('menu', 'check');
		ViewModel::renderHTML('client/check');
	
	}
	
	public function searchAction(){
		ViewModel::assign('menu', 'search');
		ViewModel::renderHTML('client/search');
	
	}
	
	public function formAction(){
		ViewModel::assign('menu', 'form');
		ViewModel::renderHTML('client/form');
	
	}
	
	public function styleAction(){
		ViewModel::assign('menu', 'style');
		ViewModel::renderHTML('client/style');
	
	}
	
	
}

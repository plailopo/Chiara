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
		$this->introAction();
		
	}
	
	public function introAction(){
		ViewModel::assign('menu', 'sintro');
		
		ViewModel::renderHTML('server/intro');
	
	}
	
	public function folderAction(){
		ViewModel::assign('menu', 'folder');
		ViewModel::renderHTML('server/folder');
	
	}

	public function configAction(){
		ViewModel::assign('menu', 'config');
		ViewModel::renderHTML('server/config');
	
	}

	public function loaderAction(){
		ViewModel::assign('menu', 'loader');
		ViewModel::renderHTML('server/loader');
	
	}

	public function routingAction(){
		ViewModel::assign('menu', 'routing');
		ViewModel::renderHTML('server/routing');
	
	}

	public function initAction(){
		ViewModel::assign('menu', 'init');
		ViewModel::renderHTML('server/init');
	
	}

	public function controllerAction(){
		ViewModel::assign('menu', 'controller');
		ViewModel::renderHTML('server/controller');
	
	}

	public function viewAction(){
		ViewModel::assign('menu', 'view');
		ViewModel::renderHTML('server/view');
	
	}

	public function layoutAction(){
		ViewModel::assign('menu', 'layout');
		ViewModel::renderHTML('server/layout');
	
	}

	public function modelAction(){
		ViewModel::assign('menu', 'model');
		ViewModel::renderHTML('server/model');
	
	}

	public function sessionAction(){
		ViewModel::assign('menu', 'session');
		ViewModel::renderHTML('server/session');
	
	}

	public function cacheAction(){
		ViewModel::assign('menu', 'cache');
		ViewModel::renderHTML('server/cache');
	
	}

	public function globalsAction(){
		ViewModel::assign('menu', 'globals');
		ViewModel::renderHTML('server/globals');
	
	}

	public function httpAction(){
		ViewModel::assign('menu', 'http');
		ViewModel::renderHTML('server/http');
	
	}

	public function transfAction(){
		ViewModel::assign('menu', 'transf');
		ViewModel::renderHTML('server/transf');
	
	}

	public function validAction(){
		ViewModel::assign('menu', 'valid');
		ViewModel::renderHTML('server/valid');
	
	}

	public function dateAction(){
		ViewModel::assign('menu', 'date');
		ViewModel::renderHTML('server/date');
	
	}

	public function dbAction(){
		ViewModel::assign('menu', 'db');
		ViewModel::renderHTML('server/db');
	
	}

	public function fileAction(){
		ViewModel::assign('menu', 'file');
		ViewModel::renderHTML('server/file');
	
	}

	public function logAction(){
		ViewModel::assign('menu', 'log');
		ViewModel::renderHTML('server/log');
	
	}

	public function msgAction(){
		ViewModel::assign('menu', 'msg');
		ViewModel::renderHTML('server/msg');
	
	}

	public function tranlatorAction(){
		ViewModel::assign('menu', 'tranlator');
		ViewModel::renderHTML('server/tranlator');
	
	}
	
}

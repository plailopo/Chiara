<?php

namespace Chiara\Db\MongoDB;

use Chiara\Core\Exception;

class ExceptionMongo extends Exception{
	
    protected $message = 'Unknown exception';   // exception message
    private   $string;                          // __toString cache
    protected $code = 0;                        // user defined exception code
    protected $file;                            // source filename of exception
    protected $line;                            // source line of exception
    private   $trace;                           // backtrace
    private   $previous;                        // previous exception if nested exception

    public function __construct($message = null, $code = 0, Exception $previous = null){
		parent::__construct('MongoException - '.$message, $code, $previous);
    }
    
}
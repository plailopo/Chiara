<?php

namespace Chiara\Core;

class Http{
	/**
	 * Scheme for http
	 *
	 */
	const SCHEME_HTTP  = 'http';

	/**
	 * Scheme for https
	 *
	 */
	const SCHEME_HTTPS = 'https';

	/**
	 * Allowed parameter sources
	 * @var array
	 */
	private static $_paramSources = array('_GET', '_POST');

	/**
	 * REQUEST_URI
	 * @var string;
	 */
	private static $_requestUri;

	/**
	 * Base URL of request
	 * @var string
	 */
	private static $_baseUrl = null;

	/**
	 * Base path of request
	 * @var string
	 */
	private static $_basePath = null;

	/**
	 * PATH_INFO
	 * @var string
	 */
	private static $_pathInfo = '';

	/**
	 * Instance parameters
	 * @var array
	 */
	private static $_params = array();

	/**
	 * Raw request body
	 * @var string|false
	 */
	private static $_rawBody;

	/**
	 * Alias keys for request parameters
	 * @var array
	 */
	private static $_aliases = array();


	/**
	 * Access values contained in the superglobals as public members
	 * Order of precedence: 1. GET, 2. POST, 3. COOKIE, 4. SERVER, 5. ENV
	 *
	 * @see http://msdn.microsoft.com/en-us/library/system.web.httprequest.item.aspx
	 * @param string $key
	 * @return mixed
	 */
	public static function get($key)
	{
		switch (true) {
			case isset(self::$_params[$key]):
				return self::$_params[$key];
			case isset($_GET[$key]):
				return $_GET[$key];
			case isset($_POST[$key]):
				return $_POST[$key];
			case isset($_COOKIE[$key]):
				return $_COOKIE[$key];
			case ($key == 'REQUEST_URI'):
				return self::getRequestUri();
			case ($key == 'PATH_INFO'):
				return self::getPathInfo();
			case isset($_SERVER[$key]):
				return $_SERVER[$key];
			case isset($_ENV[$key]):
				return $_ENV[$key];
			default:
				return null;
		}
	}

	/**
	 * Check to see if a property is set
	 *
	 * @param string $key
	 * @return boolean
	 */
	public static function exist($key)
	{
		switch (true) {
			case isset(self::$_params[$key]):
				return true;
			case isset($_GET[$key]):
				return true;
			case isset($_POST[$key]):
				return true;
			case isset($_COOKIE[$key]):
				return true;
			case isset($_SERVER[$key]):
				return true;
			case isset($_ENV[$key]):
				return true;
			default:
				return false;
		}
	}

	/**
	 * Set GET values
	 *
	 * @param  string|array $spec
	 * @param  null|mixed $value
	 * @return Zend_Controller_Request_Http
	 */
	public static function setQuery($spec, $value = null)
	{
		if ((null === $value) && !is_array($spec)) {
			require_once 'Zend/Controller/Exception.php';
			throw new Zend_Controller_Exception('Invalid value passed to setQuery(); must be either array of values or key/value pair');
		}
		if ((null === $value) && is_array($spec)) {
			foreach ($spec as $key => $value) {
				self::setQuery($key, $value);
			}
			return true;
		}
		$_GET[(string) $spec] = $value;
		return true;
	}

	/**
	 * Retrieve a member of the $_GET superglobal
	 *
	 * If no $key is passed, returns the entire $_GET array.
	 *
	 * @todo How to retrieve from nested arrays
	 * @param string $key
	 * @param mixed $default Default value to use if key not found
	 * @return mixed Returns null if key does not exist
	 */
	public static function getQuery($key = null, $default = null)
	{
		if (null === $key) {
			return $_GET;
		}

		return (isset($_GET[$key])) ? $_GET[$key] : $default;
	}

	/**
	 * Set POST values
	 *
	 * @param  string|array $spec
	 * @param  null|mixed $value
	 * @return Zend_Controller_Request_Http
	 */
	public static function setPost($spec, $value = null)
	{
		if ((null === $value) && !is_array($spec)) {
			require_once 'Zend/Controller/Exception.php';
			throw new Zend_Controller_Exception('Invalid value passed to setPost(); must be either array of values or key/value pair');
		}
		if ((null === $value) && is_array($spec)) {
			foreach ($spec as $key => $value) {
				self::setPost($key, $value);
			}
			return true;
		}
		$_POST[(string) $spec] = $value;
		return true;
	}

	/**
	 * Retrieve a member of the $_POST superglobal
	 *
	 * If no $key is passed, returns the entire $_POST array.
	 *
	 * @todo How to retrieve from nested arrays
	 * @param string $key
	 * @param mixed $default Default value to use if key not found
	 * @return mixed Returns null if key does not exist
	 */
	public static function getPost($key = null, $default = null)
	{
		if (null === $key) {
			return $_POST;
		}

		return (isset($_POST[$key])) ? $_POST[$key] : $default;
	}

	/**
	 * Retrieve a member of the $_COOKIE superglobal
	 *
	 * If no $key is passed, returns the entire $_COOKIE array.
	 *
	 * @todo How to retrieve from nested arrays
	 * @param string $key
	 * @param mixed $default Default value to use if key not found
	 * @return mixed Returns null if key does not exist
	 */
	public static function getCookie($key = null, $default = null)
	{
		if (null === $key) {
			return $_COOKIE;
		}

		return (isset($_COOKIE[$key])) ? $_COOKIE[$key] : $default;
	}

	/**
	 * Retrieve a member of the $_SERVER superglobal
	 *
	 * If no $key is passed, returns the entire $_SERVER array.
	 *
	 * @param string $key
	 * @param mixed $default Default value to use if key not found
	 * @return mixed Returns null if key does not exist
	 */
	public static function getServer($key = null, $default = null)
	{
		if (null === $key) {
			return $_SERVER;
		}

		return (isset($_SERVER[$key])) ? $_SERVER[$key] : $default;
	}

	/**
	 * Retrieve a member of the $_ENV superglobal
	 *
	 * If no $key is passed, returns the entire $_ENV array.
	 *
	 * @param string $key
	 * @param mixed $default Default value to use if key not found
	 * @return mixed Returns null if key does not exist
	 */
	public static function getEnv($key = null, $default = null)
	{
		if (null === $key) {
			return $_ENV;
		}

		return (isset($_ENV[$key])) ? $_ENV[$key] : $default;
	}

	/**
	 * Set the REQUEST_URI on which the instance operates
	 *
	 * If no request URI is passed, uses the value in $_SERVER['REQUEST_URI'],
	 * $_SERVER['HTTP_X_REWRITE_URL'], or $_SERVER['ORIG_PATH_INFO'] + $_SERVER['QUERY_STRING'].
	 *
	 * @param string $requestUri
	 * @return Zend_Controller_Request_Http
	 */
	public static function setRequestUri($requestUri = null)
	{
		if ($requestUri === null) {
			if (isset($_SERVER['HTTP_X_REWRITE_URL'])) { // check this first so IIS will catch
				$requestUri = $_SERVER['HTTP_X_REWRITE_URL'];
			} elseif (
			// IIS7 with URL Rewrite: make sure we get the unencoded url (double slash problem)
					isset($_SERVER['IIS_WasUrlRewritten'])
					&& $_SERVER['IIS_WasUrlRewritten'] == '1'
					&& isset($_SERVER['UNENCODED_URL'])
					&& $_SERVER['UNENCODED_URL'] != ''
			) {
				$requestUri = $_SERVER['UNENCODED_URL'];
			} elseif (isset($_SERVER['REQUEST_URI'])) {
				$requestUri = $_SERVER['REQUEST_URI'];
				// Http proxy reqs setup request uri with scheme and host [and port] + the url path, only use url path
				$schemeAndHttpHost = self::getScheme() . '://' . self::getHttpHost();
				if (strpos($requestUri, $schemeAndHttpHost) === 0) {
					$requestUri = substr($requestUri, strlen($schemeAndHttpHost));
				}
			} elseif (isset($_SERVER['ORIG_PATH_INFO'])) { // IIS 5.0, PHP as CGI
				$requestUri = $_SERVER['ORIG_PATH_INFO'];
				if (!empty($_SERVER['QUERY_STRING'])) {
					$requestUri .= '?' . $_SERVER['QUERY_STRING'];
				}
			} else {
				return false;
			}
		} elseif (!is_string($requestUri)) {
			return false;
		} else {
			// Set GET items, if available
			if (false !== ($pos = strpos($requestUri, '?'))) {
				// Get key => value pairs and set $_GET
				$query = substr($requestUri, $pos + 1);
				parse_str($query, $vars);
				self::setQuery($vars);
			}
		}

		self::$_requestUri = $requestUri;
		return true;
	}

	/**
	 * Returns the REQUEST_URI taking into account
	 * platform differences between Apache and IIS
	 *
	 * @return string
	 */
	public static function getRequestUri()
	{
		if (empty(self::$_requestUri)) {
			self::setRequestUri();
		}

		return self::$_requestUri;
	}

	/**
	 * Set the base URL of the request; i.e., the segment leading to the script name
	 *
	 * E.g.:
	 * - /admin
	 * - /myapp
	 * - /subdir/index.php
	 *
	 * Do not use the full URI when providing the base. The following are
	 * examples of what not to use:
	 * - http://example.com/admin (should be just /admin)
	 * - http://example.com/subdir/index.php (should be just /subdir/index.php)
	 *
	 * If no $baseUrl is provided, attempts to determine the base URL from the
	 * environment, using SCRIPT_FILENAME, SCRIPT_NAME, PHP_SELF, and
	 * ORIG_SCRIPT_NAME in its determination.
	 *
	 * @param mixed $baseUrl
	 * @return Zend_Controller_Request_Http
	 */
	public static function setBaseUrl($baseUrl = null)
	{
		if ((null !== $baseUrl) && !is_string($baseUrl)) {
			return false;
		}

		if ($baseUrl === null) {
			$filename = (isset($_SERVER['SCRIPT_FILENAME'])) ? basename($_SERVER['SCRIPT_FILENAME']) : '';

			if (isset($_SERVER['SCRIPT_NAME']) && basename($_SERVER['SCRIPT_NAME']) === $filename) {
				$baseUrl = $_SERVER['SCRIPT_NAME'];
			} elseif (isset($_SERVER['PHP_SELF']) && basename($_SERVER['PHP_SELF']) === $filename) {
				$baseUrl = $_SERVER['PHP_SELF'];
			} elseif (isset($_SERVER['ORIG_SCRIPT_NAME']) && basename($_SERVER['ORIG_SCRIPT_NAME']) === $filename) {
				$baseUrl = $_SERVER['ORIG_SCRIPT_NAME']; // 1and1 shared hosting compatibility
			} else {
				// Backtrack up the script_filename to find the portion matching
				// php_self
				$path    = isset($_SERVER['PHP_SELF']) ? $_SERVER['PHP_SELF'] : '';
				$file    = isset($_SERVER['SCRIPT_FILENAME']) ? $_SERVER['SCRIPT_FILENAME'] : '';
				$segs    = explode('/', trim($file, '/'));
				$segs    = array_reverse($segs);
				$index   = 0;
				$last    = count($segs);
				$baseUrl = '';
				do {
					$seg     = $segs[$index];
					$baseUrl = '/' . $seg . $baseUrl;
					++$index;
				} while (($last > $index) && (false !== ($pos = strpos($path, $baseUrl))) && (0 != $pos));
			}

			// Does the baseUrl have anything in common with the request_uri?
			$requestUri = self::getRequestUri();

			if (0 === strpos($requestUri, $baseUrl)) {
				// full $baseUrl matches
				self::$_baseUrl = $baseUrl;
				return true;
			}

			if (0 === strpos($requestUri, dirname($baseUrl))) {
				// directory portion of $baseUrl matches
				self::$_baseUrl = rtrim(dirname($baseUrl), '/');
				return true;
			}

			$truncatedRequestUri = $requestUri;
			if (($pos = strpos($requestUri, '?')) !== false) {
				$truncatedRequestUri = substr($requestUri, 0, $pos);
			}

			$basename = basename($baseUrl);
			if (empty($basename) || !strpos($truncatedRequestUri, $basename)) {
				// no match whatsoever; set it blank
				self::$_baseUrl = '';
				return true;
			}

			// If using mod_rewrite or ISAPI_Rewrite strip the script filename
			// out of baseUrl. $pos !== 0 makes sure it is not matching a value
			// from PATH_INFO or QUERY_STRING
			if ((strlen($requestUri) >= strlen($baseUrl))
					&& ((false !== ($pos = strpos($requestUri, $baseUrl))) && ($pos !== 0)))
			{
				$baseUrl = substr($requestUri, 0, $pos + strlen($baseUrl));
			}
		}

		self::$_baseUrl = rtrim($baseUrl, '/');
		return true;
	}

	/**
	 * Everything in REQUEST_URI before PATH_INFO
	 * <form action="<?=$baseUrl?>/news/submit" method="POST"/>
	 *
	 * @return string
	 */
	public static function getBaseUrl($raw = false)
	{
		if (null === self::$_baseUrl) {
			self::setBaseUrl();
		}

		return (($raw == false) ? urldecode(self::$_baseUrl) : self::$_baseUrl);
	}

	/**
	 * Set the base path for the URL
	 *
	 * @param string|null $basePath
	 * @return Zend_Controller_Request_Http
	 */
	public static function setBasePath($basePath = null)
	{
		if ($basePath === null) {
			$filename = (isset($_SERVER['SCRIPT_FILENAME']))
			? basename($_SERVER['SCRIPT_FILENAME'])
			: '';

			$baseUrl = self::getBaseUrl();
			if (empty($baseUrl)) {
				self::$_basePath = '';
				return true;
			}

			if (basename($baseUrl) === $filename) {
				$basePath = dirname($baseUrl);
			} else {
				$basePath = $baseUrl;
			}
		}

		if (substr(PHP_OS, 0, 3) === 'WIN') {
			$basePath = str_replace('\\', '/', $basePath);
		}

		self::$_basePath = rtrim($basePath, '/');
		return true;
	}

	/**
	 * Everything in REQUEST_URI before PATH_INFO not including the filename
	 * <img src="<?=$basePath?>/images/zend.png"/>
	 *
	 * @return string
	 */
	public static function getBasePath()
	{
		if (null === self::$_basePath) {
			self::setBasePath();
		}

		return self::$_basePath;
	}

	/**
	 * Set the PATH_INFO string
	 *
	 * @param string|null $pathInfo
	 * @return Zend_Controller_Request_Http
	 */
	public static function setPathInfo($pathInfo = null)
	{
		if ($pathInfo === null) {
			$baseUrl = self::getBaseUrl(); // this actually calls setBaseUrl() & setRequestUri()
			$baseUrlRaw = self::getBaseUrl(false);
			$baseUrlEncoded = urlencode($baseUrlRaw);

			if (null === ($requestUri = self::getRequestUri())) {
				return false;
			}

			// Remove the query string from REQUEST_URI
			if ($pos = strpos($requestUri, '?')) {
				$requestUri = substr($requestUri, 0, $pos);
			}

			if (!empty($baseUrl) || !empty($baseUrlRaw)) {
				if (strpos($requestUri, $baseUrl) === 0) {
					$pathInfo = substr($requestUri, strlen($baseUrl));
				} elseif (strpos($requestUri, $baseUrlRaw) === 0) {
					$pathInfo = substr($requestUri, strlen($baseUrlRaw));
				} elseif (strpos($requestUri, $baseUrlEncoded) === 0) {
					$pathInfo = substr($requestUri, strlen($baseUrlEncoded));
				} else {
					$pathInfo = $requestUri;
				}
			} else {
				$pathInfo = $requestUri;
			}

		}

		self::$_pathInfo = (string) $pathInfo;
		return true;
	}

	/**
	 * Returns everything between the BaseUrl and QueryString.
	 * This value is calculated instead of reading PATH_INFO
	 * directly from $_SERVER due to cross-platform differences.
	 *
	 * @return string
	 */
	public static function getPathInfo()
	{
		if (empty(self::$_pathInfo)) {
			self::setPathInfo();
		}

		return self::$_pathInfo;
	}

	/**
	 * Set allowed parameter sources
	 *
	 * Can be empty array, or contain one or more of '_GET' or '_POST'.
	 *
	 * @param  array $paramSoures
	 * @return Zend_Controller_Request_Http
	 */
	public static function setParamSources(array $paramSources = array())
	{
		self::$_paramSources = $paramSources;
		return true;
	}

	/**
	 * Get list of allowed parameter sources
	 *
	 * @return array
	 */
	public static function getParamSources()
	{
		return self::$_paramSources;
	}

	/**
	 * Set a userland parameter
	 *
	 * Uses $key to set a userland parameter. If $key is an alias, the actual
	 * key will be retrieved and used to set the parameter.
	 *
	 * @param mixed $key
	 * @param mixed $value
	 * @return Zend_Controller_Request_Http
	 */
	public static function setParam($key, $value)
	{
		$alias = self::getAlias($key);
		$key = (null !== $alias) ? $alias : $key;
		self::$_params[$key] = $value;
		return true;
	}

	/**
	 * Retrieve a parameter
	 *
	 * Retrieves a parameter from the instance. Priority is in the order of
	 * userland parameters (see {@link setParam()}), $_GET, $_POST. If a
	 * parameter matching the $key is not found, null is returned.
	 *
	 * If the $key is an alias, the actual key aliased will be used.
	 *
	 * @param mixed $key
	 * @param mixed $default Default value to use if key not found
	 * @return mixed
	 */
	public static function getParam($key, $default = null)
	{
		$keyName = (null !== ($alias = self::getAlias($key))) ? $alias : $key;

		$paramSources = self::getParamSources();
		if (isset(self::$_params[$keyName])) {
			return self::$_params[$keyName];
		} elseif (in_array('_GET', $paramSources) && (isset($_GET[$keyName]))) {
			return $_GET[$keyName];
		} elseif (in_array('_POST', $paramSources) && (isset($_POST[$keyName]))) {
			return $_POST[$keyName];
		}

		return $default;
	}

	/**
	 * Retrieve an array of parameters
	 *
	 * Retrieves a merged array of parameters, with precedence of userland
	 * params (see {@link setParam()}), $_GET, $_POST (i.e., values in the
	 * userland params will take precedence over all others).
	 *
	 * @return array
	 */
	public static function getParams()
	{
		$return       = self::$_params;
		$paramSources = self::getParamSources();
		if (in_array('_GET', $paramSources)
				&& isset($_GET)
				&& is_array($_GET)
		) {
			$return += $_GET;
		}
		if (in_array('_POST', $paramSources)
				&& isset($_POST)
				&& is_array($_POST)
		) {
			$return += $_POST;
		}
		return $return;
	}

	/**
	 * Set parameters
	 *
	 * Set one or more parameters. Parameters are set as userland parameters,
	 * using the keys specified in the array.
	 *
	 * @param array $params
	 * @return Zend_Controller_Request_Http
	 */
	public static function setParams(array $params)
	{
		foreach ($params as $key => $value) {
			self::setParam($key, $value);
		}
		return true;
	}

	/**
	 * Set a key alias
	 *
	 * Set an alias used for key lookups. $name specifies the alias, $target
	 * specifies the actual key to use.
	 *
	 * @param string $name
	 * @param string $target
	 * @return Zend_Controller_Request_Http
	 */
	public static function setAlias($name, $target)
	{
		self::$_aliases[$name] = $target;
		return true;
	}

	/**
	 * Retrieve an alias
	 *
	 * Retrieve the actual key represented by the alias $name.
	 *
	 * @param string $name
	 * @return string|null Returns null when no alias exists
	 */
	public static function getAlias($name)
	{
		if (isset(self::$_aliases[$name])) {
			return self::$_aliases[$name];
		}

		return null;
	}

	/**
	 * Retrieve the list of all aliases
	 *
	 * @return array
	 */
	public static function getAliases()
	{
		return self::$_aliases;
	}

	/**
	 * Return the method by which the request was made
	 *
	 * @return string
	 */
	public static function getMethod()
	{
		return self::getServer('REQUEST_METHOD');
	}

	/**
	 * Was the request made by POST?
	 *
	 * @return boolean
	 */
	public static function isPost()
	{
		if ('POST' == self::getMethod()) {
			return true;
		}

		return false;
	}

	/**
	 * Was the request made by GET?
	 *
	 * @return boolean
	 */
	public static function isGet()
	{
		if ('GET' == self::getMethod()) {
			return true;
		}

		return false;
	}

	/**
	 * Was the request made by PUT?
	 *
	 * @return boolean
	 */
	public static function isPut()
	{
		if ('PUT' == self::getMethod()) {
			return true;
		}

		return false;
	}

	/**
	 * Was the request made by DELETE?
	 *
	 * @return boolean
	 */
	public static function isDelete()
	{
		if ('DELETE' == self::getMethod()) {
			return true;
		}

		return false;
	}

	/**
	 * Was the request made by HEAD?
	 *
	 * @return boolean
	 */
	public static function isHead()
	{
		if ('HEAD' == self::getMethod()) {
			return true;
		}

		return false;
	}

	/**
	 * Was the request made by OPTIONS?
	 *
	 * @return boolean
	 */
	public static function isOptions()
	{
		if ('OPTIONS' == self::getMethod()) {
			return true;
		}

		return false;
	}

	/**
	 * Is the request a Javascript XMLHttpRequest?
	 *
	 * Should work with Prototype/Script.aculo.us, possibly others.
	 *
	 * @return boolean
	 */
	public static function isXmlHttpRequest()
	{
		return (self::getHeader('X_REQUESTED_WITH') == 'XMLHttpRequest');
	}

	/**
	 * Is this a Flash request?
	 *
	 * @return boolean
	 */
	public static function isFlashRequest()
	{
		$header = strtolower(self::getHeader('USER_AGENT'));
		return (strstr($header, ' flash')) ? true : false;
	}

	/**
	 * Is https secure request
	 *
	 * @return boolean
	 */
	public static function isSecure()
	{
		return (self::getScheme() === self::SCHEME_HTTPS);
	}

	/**
	 * Return the raw body of the request, if present
	 *
	 * @return string|false Raw body, or false if not present
	 */
	public static function getRawBody()
	{
		if (null === self::$_rawBody) {
			$body = file_get_contents('php://input');

			if (strlen(trim($body)) > 0) {
				self::$_rawBody = $body;
			} else {
				self::$_rawBody = false;
			}
		}
		return self::$_rawBody;
	}

	/**
	 * Return the value of the given HTTP header. Pass the header name as the
	 * plain, HTTP-specified header name. Ex.: Ask for 'Accept' to get the
	 * Accept header, 'Accept-Encoding' to get the Accept-Encoding header.
	 *
	 * @param string $header HTTP header name
	 * @return string|false HTTP header value, or false if not found
	 * @throws Zend_Controller_Request_Exception
	 */
	public static function getHeader($header)
	{
		if (empty($header)) {
			require_once 'Zend/Controller/Request/Exception.php';
			throw new Zend_Controller_Request_Exception('An HTTP header name is required');
		}

		// Try to get it from the $_SERVER array first
		$temp = 'HTTP_' . strtoupper(str_replace('-', '_', $header));
		if (isset($_SERVER[$temp])) {
			return $_SERVER[$temp];
		}

		// This seems to be the only way to get the Authorization header on
		// Apache
		if (function_exists('apache_request_headers')) {
			$headers = apache_request_headers();
			if (isset($headers[$header])) {
				return $headers[$header];
			}
			$header = strtolower($header);
			foreach ($headers as $key => $value) {
				if (strtolower($key) == $header) {
					return $value;
				}
			}
		}

		return false;
	}

	/**
	 * Get the request URI scheme
	 *
	 * @return string
	 */
	public static function getScheme()
	{
		return (self::getServer('HTTPS') == 'on') ? self::SCHEME_HTTPS : self::SCHEME_HTTP;
	}

	/**
	 * Get the HTTP host.
	 *
	 * "Host" ":" host [ ":" port ] ; Section 3.2.2
	 * Note the HTTP Host header is not the same as the URI host.
	 * It includes the port while the URI host doesn't.
	 *
	 * @return string
	 */
	public static function getHttpHost()
	{
		$host = self::getServer('HTTP_HOST');
		if (!empty($host)) {
			return $host;
		}

		$scheme = self::getScheme();
		$name   = self::getServer('SERVER_NAME');
		$port   = self::getServer('SERVER_PORT');

		if(null === $name) {
			return '';
		}
		elseif (($scheme == self::SCHEME_HTTP && $port == 80) || ($scheme == self::SCHEME_HTTPS && $port == 443)) {
			return $name;
		} else {
			return $name . ':' . $port;
		}
	}

	/**
	 * Get the client's IP addres
	 *
	 * @param  boolean $checkProxy
	 * @return string
	 */
	public static function getClientIp($checkProxy = true)
	{
		if ($checkProxy && self::getServer('HTTP_CLIENT_IP') != null) {
			$ip = self::getServer('HTTP_CLIENT_IP');
		} else if ($checkProxy && self::getServer('HTTP_X_FORWARDED_FOR') != null) {
			$ip = self::getServer('HTTP_X_FORWARDED_FOR');
		} else {
			$ip = self::getServer('REMOTE_ADDR');
		}

		return $ip;
	}
}

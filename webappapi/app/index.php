<?php
require_once "../Slim/Slim.php";
Slim\Slim::registerAutoloader ();
/*dont put multiple class in the same file*/
$app = new \Slim\Slim (); // slim run-time object

require_once "conf/config.inc.php";

function authenticate(\slim\Route $route){
	$app = \Slim\Slim::getInstance ();
	$credentials["userid"] = $app->request->headers["userid"];
	$credentials["password"] = $app->request->headers["password"];
	$credentials["content"] = null;
	$action = ACTION_AUTHENTICATE_USER;
	
	$obj = new loadRunMVCComponents ( "UserModel", "UserController", "allView", $action, $app, $credentials );
	if ($obj->controller->answer == true)
	return true;
	else $app -> halt(HTTPSTATUS_UNAUTHORIZED);
}

//added in class
/*$app->map ( "/users/search(/:prefix)", function ($prefix = null) use($app) {
 if (($userID == null) or is_numeric ( $userID )) {
 switch ($httpMethod) {
 case "GET" :
 })->via ( "GET");*/

$app->map ( "/users(/:id)", "authenticate", function ($userID = null) use($app) {

	$httpMethod = $app->request->getMethod ();
	$action = null;
	$parameters["id"] = $userID; // prepare parameters to be passed to the controller (example: ID)
	$parameters["content"] = $app->request->headers["content-type"];
	//var_dump($app->request->headers["content-type"]);

	if (($userID == null) or is_numeric ( $userID ) or is_string($userID)){
		switch ($httpMethod) {
			case "GET" :
				if ( is_numeric( $userID ) or $userID == null ) //is_numeric(25) = FALSE but is_string(25)=TRUE
				$action = ACTION_GET_USER;
				else
				$action = ACTION_SEARCH_USERS;
				break;
			case "POST" :
				$action = ACTION_CREATE_USER;
				break;
			case "PUT" :
				if (is_numeric($userID))
				$action = ACTION_UPDATE_USER;
				break;
			case "DELETE" :
				if (is_numeric($userID))
				$action = ACTION_DELETE_USER;
				break;
			default :
		}
	}
	//	return new loadRunMVCComponents ( "UserModel", "UserController", "jsonView", $action, $app, $parameters );
	return new loadRunMVCComponents ( "UserModel", "UserController", "allView", $action, $app, $parameters );
} )->via ( "GET", "POST", "PUT", "DELETE" );

$app->map ( "/books(/:id)", "authenticate", function ($bookID = null) use($app) {

	$httpMethod = $app->request->getMethod ();
	$action = null;
	$parameters["id"] = $bookID; // prepare parameters to be passed to the controller (example: ID)
	$parameters["content"] = $app->request->headers["content-type"];
	
	if (($bookID == null) or is_numeric ( $bookID ) or is_string($bookID)){
		switch ($httpMethod) {
			case "GET" :
				if (is_numeric($bookID) or ($bookID == null)) //is_numeric(25) = FALSE but is_string(25)=TRUE
				$action = ACTION_GET_BOOK;
				else
				$action = ACTION_SEARCH_BOOKS;
				break;
			case "POST" :
				$action = ACTION_CREATE_BOOK;
				break;
			case "PUT" :
				if (is_numeric($bookID))
				$action = ACTION_UPDATE_BOOK;
				break;
			case "DELETE" :
				if (is_numeric($bookID))
				$action = ACTION_DELETE_BOOK;
				break;
			default :
		}
	}
	return new loadRunMVCComponents ( "BookModel", "BookController", "allView", $action, $app, $parameters );
} )->via ( "GET", "POST", "PUT", "DELETE" );

$app->map ( "/shelves(/:id)", "authenticate", function ($shelfID = null) use($app) {

	$httpMethod = $app->request->getMethod ();
	$action = null;
	$parameters["id"] = $shelfID; // prepare parameters to be passed to the controller (example: ID)
	$parameters["content"] = $app->request->headers["content-type"];
	
	if (($shelfID == null) or is_numeric ( $shelfID ) or is_string($shelfID)){
		switch ($httpMethod) {
			case "GET" :
				if (is_numeric($shelfID) or ($shelfID == null)) //is_numeric(25) = FALSE but is_string(25)=TRUE
				$action = ACTION_GET_SHELF;
				else
				$action = ACTION_SEARCH_SHELVES;
				break;
			case "POST" :
				$action = ACTION_CREATE_SHELF;
				break;
			case "PUT" :
				if (is_numeric($shelfID))
				$action = ACTION_UPDATE_SHELF;
				break;
			case "DELETE" :
				if (is_numeric($shelfID))
				$action = ACTION_DELETE_SHELF;
				break;
			default :
		}
	}
	return new loadRunMVCComponents ( "ShelfModel", "ShelfController", "allView", $action, $app, $parameters );
} )->via ( "GET", "POST", "PUT", "DELETE" );

$app->map ( "/viewshelves(/:id)", "authenticate", function ($shelfID = null) use($app) {

	$httpMethod = $app->request->getMethod ();
	$action = null;
	$parameters["id"] = $shelfID; // prepare parameters to be passed to the controller (example: ID)
	$parameters["content"] = $app->request->headers["content-type"];
	
	if (($shelfID == null) or is_numeric ( $shelfID ) or is_string($shelfID)){
		switch ($httpMethod) {
			case "GET" :
				if (is_numeric($shelfID) or ($shelfID == null)) //is_numeric(25) = FALSE but is_string(25)=TRUE
				$action = ACTION_VIEW_SHELF;
				else
				$action = ACTION_SEARCH_VIEW_SHELVES;
				break;
			default :
		}
	}
	return new loadRunMVCComponents ( "ShelfModel", "ShelfController", "allView", $action, $app, $parameters );
} )->via ( "GET");
				
$app->run ();
/*this class avoids repetition of code*/
class loadRunMVCComponents {
	public $model, $controller, $view;
	public function __construct($modelName, $controllerName, $viewName, $action, $app, $parameters = null) {
		include_once "models/" . $modelName . ".php";
		include_once "controllers/" . $controllerName . ".php";
		include_once "views/" . $viewName . ".php";
		/*put the body into an associative array (whether empty or wrong and send it to the controller for validation in an associative array*/
		$this->model = new $modelName (); // common model
		$this->controller = new $controllerName ( $this->model, $action, $app, $parameters );
		$this->view = new $viewName ( $this->controller, $this->model, $app, $parameters); // , $app->headers
		//$this->view->output (); // this returns the response to the requesting client
	}
}

?>
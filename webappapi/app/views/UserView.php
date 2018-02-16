<?php
class UserView
{
	private $model, $controller, $slimApp;

	public function __construct($controller, $model, $slimApp, $parameters = null) {
		$this->controller = $controller;
		$this->model = $model;
		$this->slimApp = $slimApp;		
	
		if (! empty ( $parameters ["content"] ))
		$content = strtoupper($parameters ["content"]);

		switch ($content) {
			case "JSON" :
				$this->json ();
				break;
			case "HTML" :
				$this->html ();
				break;
		}		
	}

	private function json(){
		//prepare json response
		$jsonResponse = json_encode($this->model->apiResponse);
		$this->slimApp->response->write($jsonResponse);
	}
	
	private function html(){
		//prepare html response
		$htmlResponse = $this->model->apiResponse;
		$this->slimApp->response->write($htmlResponse);
	}
}
?>

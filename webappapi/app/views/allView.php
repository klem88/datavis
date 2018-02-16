<?php
class allView
{
	private $controller, $model,  $slimApp;
	
	public function __construct($controller, $model, $slimApp, $parameters = null) {
		$this->controller = $controller;
		$this->model = $model;
		$this->slimApp = $slimApp;
		
		$content = strtoupper($parameters ["content"]);
		//$parameters ["content"] is null when authentication is performed
		switch ($content) {
			case "JSON" :
				$this->json ();
				break;
			case "XML" :
				$this->xml ();
				break;
		}
	}

	private function json(){
		//prepare json response
		$jsonResponse = json_encode($this->model->apiResponse);
		$this->slimApp->response->write($jsonResponse);
	}
	
	//function definition to convert array to xml
	private function array_to_xml($array, &$xml_object) {
	    foreach($array as $key => $value) {
	        if(is_array($value)) { 
	            if(!is_numeric($key)){
	                $subnode = $xml_object->addChild("$key");
	                $this->array_to_xml($value, $subnode);
	            } else{
	                $subnode = $xml_object->addChild("item$key");
	                $this->array_to_xml($value, $subnode);
	            }
	        }else {
	            $xml_object->addChild("$key",htmlspecialchars("$value"));
	        }
	    }
	}
	
	private function xml(){
		//creating object of SimpleXMLElement
		$xml_object = new SimpleXMLElement( "<?xml version=\"1.0\"?><API_answer></API_answer>" );
		//function call to fill in the SimpleXMLElement
		$this->array_to_xml( $this->model->apiResponse, $xml_object );
		//convert the SimpleXMLElement into XML format
		$xmlResponse = $xml_object->asXML();
		$this->slimApp->response->write($xmlResponse);
	}
}
?>
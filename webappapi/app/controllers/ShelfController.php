<?php
class ShelfController {
	private $slimApp;
	private $model;
	private $requestBody;
	public $answer;
	public function __construct($model, $action = null, $slimApp, $parameters = null) {
		$this->model = $model;
		$this->slimApp = $slimApp;
		/*change because it depends on the format*/
		$this->requestBody = json_decode ( $this->slimApp->request->getBody (), true ); // this must contain the representation of the new user

		
		if ( empty ( $parameters ["id"] )){
			$parameters["id"] = null;
		}
		$id = $parameters ["id"];
		
		switch ($action) {
			case ACTION_GET_SHELF :
				$this->getShelf ( $id );
				break;
			case ACTION_UPDATE_SHELF :
				$this->updateShelf ( $id, $this->requestBody );
				break;
			case ACTION_CREATE_SHELF :
				$this->createNewShelf ( $this->requestBody );
				break;
			case ACTION_DELETE_SHELF:
				$this->deleteShelf ( $id );
				break;
			case ACTION_SEARCH_SHELVES :
				$this->searchShelves ( $id );
				break;
			case ACTION_VIEW_SHELF :
				$this->viewShelf( $id );
				break;
			case ACTION_SEARCH_VIEW_SHELVES :
				$this->searchShelvesView( $id );
				break;
			case null:
				$this->slimApp->response ()->setStatus ( HTTPSTATUS_BADREQUEST );
				$Message = array (
				GENERAL_MESSAGE_LABEL => GENERAL_CLIENT_ERROR
				);
				$this->model->apiResponse = $Message;
				break;
		}
	}

	private function getShelf( $id ) {
		$answer = $this->model->getShelf ( $id );
		if ( $answer != null ) {
			$this->slimApp->response ()->setStatus ( HTTPSTATUS_OK );
			$this->model->apiResponse = $answer;
		} else {
				
			$this->slimApp->response ()->setStatus ( HTTPSTATUS_NOCONTENT );
			$Message = array (
			GENERAL_MESSAGE_LABEL => GENERAL_NOCONTENT_MESSAGE
			);
			$this->model->apiResponse = $Message;
		}
	}
	
	private function viewShelf( $id ) {
		$answer = $this->model->viewShelf ( $id );
		if ( $answer != null ) {
			$this->slimApp->response ()->setStatus ( HTTPSTATUS_OK );
			$this->model->apiResponse = $answer;
		} else {
				
			$this->slimApp->response ()->setStatus ( HTTPSTATUS_NOCONTENT );
			$Message = array (
			GENERAL_MESSAGE_LABEL => GENERAL_NOCONTENT_MESSAGE
			);
			$this->model->apiResponse = $Message;
		}
	}

	private function createNewShelf( $newShelf ) {
		if(!($this->model->checkUser( $newShelf["userid"] ) == true &&
		$this->model->checkDoc( $newShelf["docid"] ) == true)) {
			$this->slimApp->response ()->setStatus ( HTTPSTATUS_BADREQUEST );
			$Message = array (
			GENERAL_MESSAGE_LABEL => GENERAL_INVALIDFOREIGN_KEY
			);
			$this->model->apiResponse = $Message;
		}
		elseif ( $newID = $this->model->createNewShelf ( $newShelf ) ) {
			$this->slimApp->response ()->setStatus ( HTTPSTATUS_CREATED );
			$Message = array (
			GENERAL_MESSAGE_LABEL => GENERAL_RESOURCE_CREATED,
					"id" => "$newID" 
			);
			$this->model->apiResponse = $Message;
		} else {
			$this->slimApp->response ()->setStatus ( HTTPSTATUS_BADREQUEST );
			$Message = array (
			GENERAL_MESSAGE_LABEL => GENERAL_INVALIDBODY
			);
			$this->model->apiResponse = $Message;
		}
	}
	private function deleteShelf( $id ) {
		if ( $id != null ){
			if ($result = $this->model->deleteShelf( $id )) {
				$this->slimApp->response ()->setStatus ( HTTPSTATUS_OK );
				$Message = array (
				GENERAL_MESSAGE_LABEL => GENERAL_RESOURCE_DELETED,
						"id" => "$id"
				);
				$this->model->apiResponse = $Message;
			} else {
				$this->slimApp->response ()->setStatus ( HTTPSTATUS_BADREQUEST );
				$Message = array (
				GENERAL_MESSAGE_LABEL => GENERAL_INVALIDTOKEN_ERROR
				);
				$this->model->apiResponse = $Message;
			}
		} else	{
			$this->slimApp->response ()->setStatus ( HTTPSTATUS_BADREQUEST );
			$Message = array (
			GENERAL_MESSAGE_LABEL => GENERAL_INVALIDROUTE
			);
			$this->model->apiResponse = $Message;
		}
	}

	private function updateShelf( $shelfID, $shelfNewRepresentation ) {
		if(!($this->model->checkUser( $shelfNewRepresentation["userid"] ) == true &&
		$this->model->checkDoc( $shelfNewRepresentation["docid"] ) == true)) {
			$this->slimApp->response ()->setStatus ( HTTPSTATUS_BADREQUEST );
			$Message = array (
			GENERAL_MESSAGE_LABEL => GENERAL_INVALIDFOREIGN_KEY
			);
			$this->model->apiResponse = $Message;
		}
		elseif ($updatedID = $this->model->updateShelves( $shelfID, $shelfNewRepresentation )) {
			$this->slimApp->response ()->setStatus ( HTTPSTATUS_OK );
			$Message = array (
			GENERAL_MESSAGE_LABEL => GENERAL_RESOURCE_UPDATED,
				"id" => "$shelfID"
			);
			$this->model->apiResponse = $Message;
		} else {
			$this->slimApp->response ()->setStatus ( HTTPSTATUS_BADREQUEST );
			$Message = array (
			GENERAL_MESSAGE_LABEL => GENERAL_INVALIDBODY
			);
			$this->model->apiResponse = $Message;
		}
	}
	private function searchShelves( $searchString ) {
			$answer = $this->model->searchShelves( $searchString );
		if ($answer != null) {
			$this->slimApp->response ()->setStatus ( HTTPSTATUS_OK );
			$this->model->apiResponse = $answer;
		} else {
				
			$this->slimApp->response ()->setStatus ( HTTPSTATUS_NOCONTENT );
			$Message = array (
			GENERAL_MESSAGE_LABEL => GENERAL_NOCONTENT_MESSAGE
			);
			$this->model->apiResponse = $Message;
		}
	}
	
	private function searchShelvesView( $searchString ) {
			$answer = $this->model->searchShelvesView( $searchString );
		if ($answer != null) {
			$this->slimApp->response ()->setStatus ( HTTPSTATUS_OK );
			$this->model->apiResponse = $answer;
		} else {
				
			$this->slimApp->response ()->setStatus ( HTTPSTATUS_NOCONTENT );
			$Message = array (
			GENERAL_MESSAGE_LABEL => GENERAL_NOCONTENT_MESSAGE
			);
			$this->model->apiResponse = $Message;
		}
	}
	
}
?>
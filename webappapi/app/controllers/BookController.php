<?php
class BookController {
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
			case ACTION_GET_BOOK :
				$this->getBook ( $id );
				break;
			case ACTION_UPDATE_BOOK :
				$this->updateBook ( $id, $this->requestBody );
				break;
			case ACTION_CREATE_BOOK :
				$this->createNewBook ( $this->requestBody );
				break;
			case ACTION_DELETE_BOOK:
				$this->deleteBook ( $id );
				break;
			case ACTION_SEARCH_BOOKS :
				$this->searchBooks ( $id );
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

	private function getBook( $id ) {
		$answer = $this->model->getBook ( $id );
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

	private function createNewBook( $newBook ) {
		if ( $newID = $this->model->createNewBook ( $newBook )) {
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
	private function deleteBook( $id ) {
		if ( $id != null ){
			if ($result = $this->model->deleteBook( $id )) {
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

	private function updateBook( $bookID, $bookNewRepresentation ) {
		if ($updatedID = $this->model->updateBooks( $bookID, $bookNewRepresentation )) {
			$this->slimApp->response ()->setStatus ( HTTPSTATUS_OK );
			$Message = array (
			GENERAL_MESSAGE_LABEL => GENERAL_RESOURCE_UPDATED,
				"id" => "$bookID"
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
	private function searchBooks( $searchString ) {
			$answer = $this->model->searchBooks( $searchString );
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
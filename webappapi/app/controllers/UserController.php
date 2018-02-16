<?php
class UserController {
	private $slimApp;
	private $model;
	private $requestBody;
	public $answer;
	public function __construct($model, $action = null, $slimApp, $parameters = null) {
		$this->model = $model;
		$this->slimApp = $slimApp;
		/*change because it depends on the format*/
		$this->requestBody = json_decode ( $this->slimApp->request->getBody (), true ); // this must contain the representation of the new user

		if ( empty( $parameters ["id"] ))
		$parameters["id"] = null;
		$id = $parameters ["id"];
		
		if ( empty( $parameters ["userid"] ))
		$parameters ["userid"] = null;
		$userid = $parameters ["userid"];

		if ( empty( $parameters ["password"] ))
		$parameters ["password"] = null;
		$password = $parameters ["password"];
		
		switch ($action) {
			case ACTION_GET_USER :
				$this->getUser ( $id );
				break;
			case ACTION_UPDATE_USER :
				$this->updateUser ( $id, $this->requestBody );
				break;
			case ACTION_CREATE_USER :
				$this->createNewUser ( $this->requestBody );
				break;
			case ACTION_DELETE_USER:
				$this->deleteUser ( $id );
				break;
			case ACTION_SEARCH_USERS :
				$this->searchUsers ( $id );
				break;
			case ACTION_AUTHENTICATE_USER :
				$this->athenticateUser ( $userid, $password );
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

	public function athenticateUser( $userid, $password ) {
		$answer = $this->model->getUser ($userid);
		if ( $answer != null )
		if ( $answer["0"]["password"] == $password )
		$this->answer = true;
	}

	private function getUser( $id = null) {
		$answer = $this->model->getUser ( $id );
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

	private function createNewUser( $newUser ) {
		if ( $newID = $this->model->createNewUser ( $newUser )) {
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
	private function deleteUser( $id ) {
		if ( $id != null ){
			if ($result = $this->model->deleteUser( $id )) {
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

	private function updateUser( $userID, $userNewRepresentation ) {
		if ($updatedID = $this->model->updateUsers( $userID, $userNewRepresentation )) {
			$this->slimApp->response ()->setStatus ( HTTPSTATUS_OK );
			$Message = array (
			GENERAL_MESSAGE_LABEL => GENERAL_RESOURCE_UPDATED,
				"id" => "$userID"
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
	private function searchUsers( $searchString ) {
		$answer = $this->model->searchUsers( $searchString );
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
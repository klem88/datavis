<?php
require_once "DB/pdoDbManager.php";
require_once "DB/DAO/UsersDAO.php";
require_once "Validation.php";
class UserModel {
	private $UsersDAO; // list of DAOs used by this model
	private $dbmanager; // dbmanager
	/*public because used by the controller*/
	public $apiResponse; // api response
	private $validationSuite; // contains functions for validating inputs
	public function __construct() {
		$this->dbmanager = new pdoDbManager ();
		$this->UsersDAO = new UsersDAO ( $this->dbmanager );
		$this->dbmanager->openConnection ();
		$this->validationSuite = new Validation ();
	}

	public function getUser( $userID = null ) {
		if ($userID != null && (is_numeric ( $userID )))
		return ($this->UsersDAO->get ( $userID ));
		else 
		return ($this->UsersDAO->get ());
	}
	/**
	 *
	 * @param array $UserRepresentation:
	 *        	an associative array containing the detail of the new user
	 */
	public function createNewUser( $newUser ) {
		if ( $this->preValidation( $newUser ) == TRUE ) {
			if ($newId = $this->UsersDAO->insert ( $newUser ))
			return ($newId);
		}
		return FALSE;
	}
	
	public function updateUsers( $userID, $userNewRepresentation ) {
		if ( $this->preValidation( $userNewRepresentation ) == TRUE ) {
			if ($result = $this->UsersDAO->update( $userID, $userNewRepresentation ))
			return ( $result );
		} return FALSE;
	}

	private function preValidation($user) {
		if (! empty ( $user ["name"] ) &&
		! empty ( $user ["surname"] ) &&
		! empty ( $user ["email"] ) &&
		! empty ( $user ["password"] )) {
			if (
			($this->validationSuite->isLengthStringValid ( $user ["name"], TABLE_USER_NAME_LENGTH )) &&
			($this->validationSuite->isLengthStringValid ( $user ["surname"], TABLE_USER_SURNAME_LENGTH )) &&
			($this->validationSuite->isLengthStringValid ( $user ["email"], TABLE_USER_EMAIL_LENGTH )) &&
			($this->validationSuite->isLengthStringValid ( $user ["password"], TABLE_USER_PASSWORD_LENGTH ))
			){
				return TRUE;
			}
		} return FALSE;
	}

	public function searchUsers($string) {
		if (is_string($string))
		return ($this->UsersDAO->search($string));
	}

	public function deleteUser($userID) {
		if ($result = $this->UsersDAO->delete($userID)){
			return $result;
		}
		return (false);
	}

	public function __destruct() {
		$this->UsersDAO = null;
		$this->dbmanager->closeConnection ();
	}
}
?>
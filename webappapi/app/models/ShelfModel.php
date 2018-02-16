<?php
require_once "DB/pdoDbManager.php";
require_once "DB/DAO/ShelvesDAO.php";
require_once "Validation.php";
class ShelfModel {
	private $ShelvesDAO; // list of DAOs used by this model
	private $dbmanager; // dbmanager
	/*public because used by the controller*/
	public $apiResponse; // api response
	private $validationSuite; // contains functions for validating inputs
	public function __construct() {
		$this->dbmanager = new pdoDbManager ();
		$this->ShelvesDAO = new ShelvesDAO ( $this->dbmanager );
		$this->dbmanager->openConnection ();
		$this->validationSuite = new Validation ();
	}

	public function getShelf($shelfID = null) {
		if ($shelfID != null && (is_numeric ( $shelfID )))
		return ($this->ShelvesDAO->get ( $shelfID ));
		else
		return ($this->ShelvesDAO->get ());
	}
	
	public function viewShelf($shelfID = null) {
		if ($shelfID != null && (is_numeric ( $shelfID )))
		return ($this->ShelvesDAO->getView ( $shelfID ));
		else
		return ($this->ShelvesDAO->getView ());
	}
	/**
	 *
	 * @param array $ShelfRepresentation:
	 *        	an associative array containing the detail of the new shelf
	 */
	public function createNewShelf($newShelf) {
		if ( $this -> preValidation($newShelf) == TRUE ) {
			if ($newId = $this->ShelvesDAO->insert ( $newShelf ))
			return ($newId);
		}
		return FALSE;
	}

	public function updateShelves($shelfID, $shelfNewRepresentation) {
		if ($this -> preValidation($shelfNewRepresentation) == TRUE) {
			if ($result = $this->ShelvesDAO->update($shelfID, $shelfNewRepresentation))
			return ($result);
		}
		return FALSE;
	}

	public function searchShelves($string) {
		if (is_string($string))
		return ($this->ShelvesDAO->search($string));
	}
	
	public function searchShelvesView($string) {
		if (is_string($string))
		return ($this->ShelvesDAO->searchView($string));
	}

	public function deleteShelf($shelfID) {
		if ($result = $this->ShelvesDAO->delete($shelfID)){
			return $result;
		}
		return (false);
	}

	public function __destruct() {
		$this->ShelvesDAO = null;
		$this->dbmanager->closeConnection ();
	}
	
	private function preValidation($shelf) {
		if ( ! empty ( $shelf ["shelf"] ) ) {
			if (
			($this->validationSuite->isLengthStringValid ( $shelf ["shelf"], TABLE_SHELVES_SHELF_LENGTH ))
			){
				return true;
			}
		} return false;
	}

	public function checkUser ( $userid ) {
		if ( $this->ShelvesDAO->getUser ( $userid ) != null )
		return true;
		else
		return false;
	}

	public function checkDoc ( $docid ) {
		if ( $this->ShelvesDAO->getDoc ( $docid ) != null )
		return true;
		else
		return false;
	}
}
?>
<?php
require_once "DB/pdoDbManager.php";
require_once "DB/DAO/BooksDAO.php";
require_once "Validation.php";
class BookModel {
	private $BooksDAO; // list of DAOs used by this model
	private $dbmanager; // dbmanager
	/*public because used by the controller*/
	public $apiResponse; // api response
	private $validationSuite; // contains functions for validating inputs
	public function __construct() {
		$this->dbmanager = new pdoDbManager ();
		$this->BooksDAO = new BooksDAO ( $this->dbmanager );
		$this->dbmanager->openConnection ();
		$this->validationSuite = new Validation ();
	}

	public function getBook($bookID = null) {
		if ($bookID != null && (is_numeric ( $bookID )))
		return ($this->BooksDAO->get ( $bookID ));
		else
		return ($this->BooksDAO->get ());
	}
	/**
	 *
	 * @param array $BookRepresentation:
	 *        	an associative array containing the detail of the new book
	 */
	public function createNewBook($newBook) {
		if ($this -> preValidation($newBook) == TRUE) {
			if ($newId = $this->BooksDAO->insert ( $newBook ))
			return ($newId);
		}
		return FALSE;
	}

	public function updateBooks($bookID, $bookNewRepresentation) {
		if ($this -> preValidation($bookNewRepresentation) == TRUE) {
			if ($result = $this->BooksDAO->update($bookID, $bookNewRepresentation))
			return ($result);
		}
		return FALSE;
	}

	private function preValidation($book) {
		if (! empty ( $book ["title"] ) &&
		! empty ( $book ["contributor"] )) {
			if (
			($this->validationSuite->isLengthStringValid ( $book ["title"], TABLE_BOOK_TITLE_LENGTH )) &&
			($this->validationSuite->isLengthStringValid ( $book ["contributor"], TABLE_BOOK_CONTRIBUTOR_LENGTH ))
			){
				return TRUE;
			}
		} return FALSE;
	}

	public function searchBooks($string) {
		if (is_string($string))
		return ($this->BooksDAO->search($string));
	}

	public function deleteBook($bookID) {
		if ($result = $this->BooksDAO->delete($bookID)){
			return $result;
		}
		return (false);
	}

	public function __destruct() {
		$this->BooksDAO = null;
		$this->dbmanager->closeConnection ();
	}
}
?>
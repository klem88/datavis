<?php
/**
 * @author Clement
 * definition of the Books DAO (database access object)
 */
class BooksDAO {
	private $dbManager;
	function BooksDAO($DBMngr) {
		$this->dbManager = $DBMngr;
	}
	public function get($id = null) {
		$sql = "SELECT * ";
		$sql .= "FROM books ";
		if ($id != null)
			$sql .= "WHERE books.docid = ? ";
		$sql .= "ORDER BY books.title";
		
		$stmt = $this->dbManager->prepareQuery ( $sql );
		$this->dbManager->bindValue ( $stmt, 1, $id, $this->dbManager->INT_TYPE );
		$this->dbManager->executeQuery ( $stmt );
		//$rows = array();
		$rows = $this->dbManager->fetchResults ( $stmt );
		//var_dump($rows);
		return ($rows);
	}
	public function insert($parametersArray) {
		// insertion assumes that all the required parameters are defined and set
		$sql = "INSERT INTO books (title, contributor) ";
		$sql .= "VALUES (?,?) ";
		
		$stmt = $this->dbManager->prepareQuery ( $sql );
		$this->dbManager->bindValue ( $stmt, 1, $parametersArray ["title"], $this->dbManager->STRING_TYPE );
		$this->dbManager->bindValue ( $stmt, 2, $parametersArray ["contributor"], $this->dbManager->STRING_TYPE );
		$this->dbManager->executeQuery ( $stmt );
		
		return ($this->dbManager->getLastInsertedID ());
	}
	
	function update($docID, $parametersArray) {
		$sql = "UPDATE books ";
		$sql .= "SET title = :title, contributor = :contributor WHERE docid = :id";
		
		$stmt = $this->dbManager->prepareQuery($sql);
		$this->dbManager->bindvalue($stmt, ":title", $parametersArray["title"], $this->dbManager->STRING_TYPE);
		$this->dbManager->bindvalue($stmt, ":contributor", $parametersArray["contributor"], $this->dbManager->STRING_TYPE);
		$this->dbManager->bindValue($stmt, ":id", $docID, $this->dbManager->INT_TYPE);
		$this->dbManager->executeQuery($stmt);
		
		return ($this->dbManager->getNumberOfAffectedRows($stmt));
	}

	public function delete($docID) {
		$sql = "DELETE FROM books WHERE docid = :id";
		$stmt = $this->dbManager->prepareQuery($sql);
		$this->dbManager->bindValue($stmt, ":id", $docID, $this->dbManager->INT_TYPE);
		$this->dbManager->executeQuery($stmt);
		return ($this->dbManager->getNumberOfAffectedRows($stmt)); //getNumberOfAffectedRows = 1 if the deletion is ok
	}
	
	public function search($searchString) {
		$sql = "SELECT * ";
		$sql .= "FROM books ";
		$sql .= "WHERE books.title LIKE :searchString ";
		$sql .= "OR books.contributor LIKE :searchString ";
		$sql .= "ORDER BY books.title";
		
		$stmt = $this->dbManager->prepareQuery ( $sql );
		$this->dbManager->bindValue($stmt, ":searchString", "%$searchString%", $this->dbManager->STRING_TYPE) ;
		$this->dbManager->executeQuery ( $stmt );
		$rows = $this->dbManager->fetchResults ( $stmt );
		
		return ($rows);
	}
}
?>

<?php
/**
 * @author Clement
 * definition of the Shelves DAO (database access object)
 */
class ShelvesDAO {
	private $dbManager;
	function ShelvesDAO($DBMngr) {
		$this->dbManager = $DBMngr;
	}

	public function get($id = null) {
		$sql = "SELECT * ";
		$sql .= "FROM shelves ";
		if ($id != null)
		$sql .= "WHERE shelves.shelfid = ? ";
		$sql .= "ORDER BY shelves.shelf";

		$stmt = $this->dbManager->prepareQuery ( $sql );
		$this->dbManager->bindValue ( $stmt, 1, $id, $this->dbManager->INT_TYPE );
		$this->dbManager->executeQuery ( $stmt );

		$rows = $this->dbManager->fetchResults ( $stmt );

		return ($rows);
	}

	public function getView( $id = null ) {
		$sql = "SELECT shelves.shelfid, shelves.shelf, books.title, books.contributor, users.name, users.surname ";
		$sql .= "FROM shelves, users, books ";
		$sql .= "WHERE ";
		if ($id != null)
		$sql .= "shelves.shelfid = ? AND ";
		$sql .= "shelves.userid = users.userid AND shelves.docid = books.docid ";
		$sql .= "ORDER BY shelves.shelf";

		$stmt = $this->dbManager->prepareQuery ( $sql );
		$this->dbManager->bindValue ( $stmt, 1, $id, $this->dbManager->INT_TYPE );
		$this->dbManager->executeQuery ( $stmt );

		$rows = $this->dbManager->fetchResults ( $stmt );

		return ($rows);
	}
	public function insert($parametersArray) {

		$sql = "INSERT INTO shelves (shelf, docid, userid) ";
		$sql .= "VALUES (?,?,?) ";

		$stmt = $this->dbManager->prepareQuery ( $sql );
		$this->dbManager->bindValue ( $stmt, 1, $parametersArray ["shelf"], $this->dbManager->STRING_TYPE );
		$this->dbManager->bindValue ( $stmt, 2, $parametersArray ["docid"], $this->dbManager->INT_TYPE );
		$this->dbManager->bindValue ( $stmt, 3, $parametersArray ["userid"], $this->dbManager->INT_TYPE );
		$this->dbManager->executeQuery ( $stmt );

		return ($this->dbManager->getLastInsertedID ());
	}

	function update($shelfID, $parametersArray) {
		$sql = "UPDATE shelves ";
		$sql .= "SET shelf = :shelf, docid = :docid, userid = :userid WHERE shelfid = :id";

		$stmt = $this->dbManager->prepareQuery($sql);
		$this->dbManager->bindvalue($stmt, ":shelf", $parametersArray["shelf"], $this->dbManager->STRING_TYPE);
		$this->dbManager->bindvalue($stmt, ":docid", $parametersArray["docid"], $this->dbManager->INT_TYPE);
		$this->dbManager->bindvalue($stmt, ":userid", $parametersArray["userid"], $this->dbManager->INT_TYPE);
		$this->dbManager->bindValue($stmt, ":id", $shelfID, $this->dbManager->INT_TYPE);
		$this->dbManager->executeQuery($stmt);

		return ($this->dbManager->getNumberOfAffectedRows($stmt));
	}

	public function delete($shelfID) {
		$sql = "DELETE FROM shelves WHERE shelfid = :id";
		$stmt = $this->dbManager->prepareQuery($sql);
		$this->dbManager->bindValue($stmt, ":id", $shelfID, $this->dbManager->INT_TYPE);
		$this->dbManager->executeQuery($stmt);
		return ($this->dbManager->getNumberOfAffectedRows($stmt)); //getNumberOfAffectedRows = 1 if the deletion is ok
	}

	public function search($searchString) {
		$sql = "SELECT * ";
		$sql .= "FROM shelves ";
		$sql .= "WHERE shelves.shelf LIKE :searchString ";
		$sql .= "OR shelves.docid LIKE :searchString ";
		$sql .= "ORDER BY shelves.shelf";

		$stmt = $this->dbManager->prepareQuery ( $sql );
		$this->dbManager->bindValue($stmt, ":searchString", "%$searchString%", $this->dbManager->STRING_TYPE) ;
		$this->dbManager->executeQuery ( $stmt );
		$rows = $this->dbManager->fetchResults ( $stmt );

		return ($rows);
	}
	
	public function searchView($searchString) {
		$sql = "SELECT shelves.shelfid, shelves.shelf, books.title, books.contributor, users.name, users.surname ";
		$sql .= "FROM shelves , users, books ";
		$sql .= "WHERE ";
		$sql .= "shelves.userid = users.userid AND shelves.docid = books.docid AND ";
		$sql .= "(shelves.shelf LIKE :searchString ";
		$sql .= "OR users.name LIKE :searchString ";
		$sql .= "OR users.surname LIKE :searchString ";
		$sql .= "OR books.title LIKE :searchString ";
		$sql .= "OR books.contributor LIKE :searchString) ";
		$sql .= "ORDER BY shelves.shelf";

		$stmt = $this->dbManager->prepareQuery ( $sql );
		$this->dbManager->bindValue($stmt, ":searchString", "%$searchString%", $this->dbManager->STRING_TYPE) ;
		$this->dbManager->executeQuery ( $stmt );
		$rows = $this->dbManager->fetchResults ( $stmt );

		return ($rows);
	}

	public function getUser($userid) {
		$sql = "SELECT * ";
		$sql .= "FROM users ";
		$sql .= "WHERE users.userid = ? ";

		$stmt = $this->dbManager->prepareQuery ( $sql );
		$this->dbManager->bindValue ( $stmt, 1, $userid, $this->dbManager->INT_TYPE );
		$this->dbManager->executeQuery ( $stmt );

		$rows = $this->dbManager->fetchResults ( $stmt );

		return ($rows);
	}

	public function getDoc($docid) {
		$sql = "SELECT * ";
		$sql .= "FROM books ";
		$sql .= "WHERE books.docid = ? ";

		$stmt = $this->dbManager->prepareQuery ( $sql );
		$this->dbManager->bindValue ( $stmt, 1, $docid, $this->dbManager->INT_TYPE );
		$this->dbManager->executeQuery ( $stmt );

		$rows = $this->dbManager->fetchResults ( $stmt );

		return ($rows);
	}
}
?>
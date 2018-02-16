<?php
/**
 * @author Clement
 * definition of the Users DAO (database access object)
 */
class UsersDAO {
	private $dbManager;
	function UsersDAO($DBMngr) {
		$this->dbManager = $DBMngr;
	}
	public function get($id = null) {
		$sql = "SELECT * ";
		$sql .= "FROM users ";
		if ($id != null)
			$sql .= "WHERE users.userid=? ";
		$sql .= "ORDER BY users.name ";
		
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
		$sql = "INSERT INTO users (name, surname, email, password) ";
		$sql .= "VALUES (?,?,?,?) ";
		
		$stmt = $this->dbManager->prepareQuery ( $sql );
		$this->dbManager->bindValue ( $stmt, 1, $parametersArray ["name"], $this->dbManager->STRING_TYPE );
		$this->dbManager->bindValue ( $stmt, 2, $parametersArray ["surname"], $this->dbManager->STRING_TYPE );
		$this->dbManager->bindValue ( $stmt, 3, $parametersArray ["email"], $this->dbManager->STRING_TYPE );
		$this->dbManager->bindValue ( $stmt, 4, $parametersArray ["password"], $this->dbManager->STRING_TYPE );
		$this->dbManager->executeQuery ( $stmt );
		
		return ($this->dbManager->getLastInsertedID ());
	}
	
	function update($userID, $parametersArray) {
		$sql = "UPDATE users ";
		$sql .= "SET name = :name, surname = :surname, email = :email, password = :password WHERE userid = :id";
		
		$stmt = $this->dbManager->prepareQuery($sql);
		$this->dbManager->bindvalue($stmt, ":name", $parametersArray["name"], $this->dbManager->STRING_TYPE);
		$this->dbManager->bindvalue($stmt, ":surname", $parametersArray["surname"], $this->dbManager->STRING_TYPE);
		$this->dbManager->bindvalue($stmt, ":email", $parametersArray["email"], $this->dbManager->STRING_TYPE);
		$this->dbManager->bindValue($stmt, ":password", $parametersArray["password"], $this->dbManager->STRING_TYPE);
		$this->dbManager->bindValue($stmt, ":id", $userID, $this->dbManager->INT_TYPE);
		$this->dbManager->executeQuery($stmt);
		
		return ($this->dbManager->getNumberOfAffectedRows($stmt));
	}

	public function delete($userID) {
		$sql = "DELETE FROM users WHERE userid = :id";
		$stmt = $this->dbManager->prepareQuery($sql);
		$this->dbManager->bindValue($stmt, ":id", $userID, $this->dbManager->INT_TYPE);
		$this->dbManager->executeQuery($stmt);
		return ($this->dbManager->getNumberOfAffectedRows($stmt)); //getNumberOfAffectedRows = 1 if the deletion is ok
	}
	
	public function search($searchString) {
		$sql = "SELECT * ";
		$sql .= "FROM users ";
		$sql .= "WHERE users.name LIKE :searchString ";
		$sql .= "OR users.surname LIKE :searchString ";
		$sql .= "OR users.email LIKE :searchString ";
		$sql .= "ORDER BY users.name";
		
		$stmt = $this->dbManager->prepareQuery ( $sql );
		$this->dbManager->bindValue($stmt, ":searchString", "%$searchString%", $this->dbManager->STRING_TYPE) ;
		$this->dbManager->executeQuery ( $stmt );
		$rows = $this->dbManager->fetchResults ( $stmt );
		
		return ($rows);
	}
}
?>

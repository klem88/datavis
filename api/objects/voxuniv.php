<?php
class voxuniv{
 
    // database connection and table name
    private $conn;
    private $table_name = "voxuniv";
 
    // object properties
    public $docid;
    public $simdocid;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

   // read products
    function read(){
     
        // select all query
        $query = "SELECT
                    v.docid, v.simdocid
                FROM
                    " . $this->table_name . " v
                LIMIT 10" ;
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
        
        // execute query
        $stmt->execute();
     
        return $stmt;
    }

    function readOne(){
 
        // query to read single record
        $query = "SELECT
                    v.simdocid
                FROM
                    " . $this->table_name . " v
                WHERE
                    v.docid = ?";
     
        // prepare query statement
        $stmt = $this->conn->prepare( $query );
    
        // bind id of product to be updated
        $stmt->bindParam(1, $this->docid);

        // execute query
        $stmt->execute();

        return $stmt;
    }
}
?>
<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/voxuniv.php';
 
// instantiate database and product object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$simdocid = new voxuniv($db);
 
// query products
$stmt = $simdocid->read();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
 
    // products array
    $simdocid_arr=array();
    $simdocid_arr["records"]=array();
 
    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
 
        $simdocid_item=array(
            "docid" => $docid,
            "simdocid" => $simdocid
        );
 
        array_push($simdocid_arr["records"], $simdocid_item);
    }
 
    echo json_encode($simdocid_arr);
}
 
else{
    echo json_encode(
        array("message" => "No products found.")
    );
}
?>
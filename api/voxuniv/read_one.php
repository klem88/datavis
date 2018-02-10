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

$simdocid->docid = isset($_GET['docid']) ? $_GET['docid'] : die();
 
// query products
$stmt = $simdocid->read();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num==1){
    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        $record = explode (",", $row['simdocid']);
    }
    print_r(json_encode(
    	array('simdocid' => $record)
	));
}
else if($num==0){
    print_r(json_encode(
            array("message" => "No docid found")
        ));
}
else if($num>1){
    print_r(json_encode(
            array("message" => "Multiple docid found")
        ));
}
?>
<?php 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Authorization, X-Requested-With');

$data = json_decode(file_get_contents("php://input"), true);
$studentId = $data["sid"];

require_once "../config.php";

$sql = "DELETE FROM students WHERE id = :id";
$statement = $connection->prepare($sql);
$query = $statement->execute(array(":id" => $studentId));
if($query && $statement->rowCount()){
    $response = array("status" => 1, "message" => "Record Successfully Deleted");
    echo json_encode($response);
}else{
    $response = array("status" => 0, "message" => "Record failed to be Deleted");
    echo json_encode($response);
}
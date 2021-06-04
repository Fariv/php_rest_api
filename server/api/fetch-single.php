<?php 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

$data = json_decode(file_get_contents("php://input"), true);
$studentId = $data["sid"];

require_once "../config.php";

$sql = "SELECT * FROM students WHERE id = :id";
$statement = $connection->prepare($sql);
$statement->execute(array(':id' => $studentId));
$results = $statement->fetch(PDO::FETCH_ASSOC);

if(!empty($results) > 0){
    $response = array("status" => 1, "data" => $results);
    echo json_encode($response);
}else{
    $response = array("status" => 0, "data" => new stdClass, "message" => "No record found");
    echo json_encode($response);
}
<?php 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

$data = json_decode(file_get_contents("php://input"), true);
$search = strtolower(urldecode($_GET["search"]));

require_once "../config.php";

$sql = "SELECT * FROM students WHERE LOWER(name) LIKE :search OR ";
$sql .= "LOWER(city) LIKE :search OR ";
$sql .= "LOWER(department) LIKE :search OR ";
$sql .= "LOWER(age) LIKE :search";
$statement = $connection->prepare($sql);
$statement->execute(array(':search' => "%".$search."%"));
$results = $statement->fetchAll(PDO::FETCH_ASSOC);

if(!empty($results)){
    $response = array("status" => 1, "data" => $results);
    echo json_encode($response);
}else{
    $response = array("status" => 0, "data" => new stdClass, "message" => "No Search result");
    echo json_encode($response);
}
<?php 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once "../config.php";
$search = trim(strip_tags(strtolower(urldecode(@$_GET["search"]))));
$params = null;
$sql = "SELECT * FROM students";
if(!is_null($search) && strlen($search) > 0){
    $sql .= "WHERE (LOWER(name) LIKE :search OR ";
    $sql .= "LOWER(city) LIKE :search OR ";
    $sql .= "LOWER(department) LIKE :search OR ";
    $sql .= "LOWER(age) LIKE :search);";
    $params = array(':search' => "%".$search."%");
}
$statement = $connection->prepare($sql);
$statement->execute($params);
$results = $statement->fetchAll(PDO::FETCH_ASSOC);

if(!empty($results)){
    $response = array("status" => 1, "data" => $results);
    echo json_encode($response);
}else{
    $response = array("status" => 0, "data" => array(), "message" => "No record found");
    echo json_encode($response);
}
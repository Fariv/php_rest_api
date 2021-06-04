<?php 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Authorization, X-Requested-With');

$data = json_decode(file_get_contents("php://input"), true);

require_once "../config.php";

$sid = trim(strip_tags($data["sid"]));
$sname = trim(strip_tags($data["sname"]));
$scity = trim(strip_tags($data["scity"]));
$sage = trim(strip_tags($data["sage"]));
$sdepartment = trim(strip_tags($data["sdepartment"]));

if(strlen($sname)>0 && strlen($sage)>0 && strlen($sdepartment)>0){

    $sql = "UPDATE students SET name = :name, city = :city, age = :age, department = :department";
    $sql .= " WHERE id = :id";
    
    $statement = $connection->prepare($sql);
    $parameters = array(
        ":name" => $sname,
        ":city" => $scity,
        ":age" => $sage,
        ":department" => $sdepartment,
        ":id" => $sid,
    );
    if($statement->execute($parameters) && $statement->rowCount()){
        $response = array("status" => 1, "message" => "Record Successfully Updated");
        echo json_encode($response);
    }else{
        $response = array("status" => 0, "message" => "Record failed to be Updated");
        echo json_encode($response);
    }
}else{
    $message = "Age field value is mandatory";
    if(strlen($sname)==0){
        $message = "Name field value is mandatory";
    }else if(strlen($sdepartment)==0){
        $message = "Department field value is mandatory";
    }
    $response = array("status" => 0, "message" => $message);
    echo json_encode($response);
}
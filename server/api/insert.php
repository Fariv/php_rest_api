<?php 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Authorization, X-Requested-With');

$data = json_decode(file_get_contents("php://input"), true);

require_once "../config.php";
$sname = trim(strip_tags($data["sname"]));
$scity = trim(strip_tags($data["scity"]));
$sage = trim(strip_tags($data["sage"]));

if(strlen($sname)>0 && strlen($sage)>0){
    $sql = "INSERT INTO `students` (`name`,`city`,`age`) VALUES(:name, :city, :age)";
    $statement = $connection->prepare($sql);
    $parameters = array(
        ":name" => $sname,
        ":city" => $scity,
        ":age" => $sage,
    );
    $query = $statement->execute($parameters);
    if($query && $statement->rowCount()){
        $response = array("status" => 1, "message" => "Record Successfully Inserted");
        echo json_encode($response);
    }else{
        $response = array("status" => 0, "message" => "Record failed to be Inserted");
        echo json_encode($response);
    }
}else{
    $message = "Age field value is mandatory";
    if(strlen($sname)==0){
        $message = "Name field value is mandatory";
    }
    $response = array("status" => 0, "message" => $message);
    echo json_encode($response);
}
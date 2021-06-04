<?php 
$hostname = "";
$username = "";
$password = "";
$database = "";
$port = 3306;
$dbdriver="mysql";
try{
    $connection = new PDO("$dbdriver:host=$hostname;dbname=$database;port=$port", $username, $password);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}catch(PDOException $e){
    echo "Connection failed: " . $e->getMessage();
    exit();
}
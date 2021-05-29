<?php 
$hostname = "localhost";
$username = "root";
$password = "";
$database = "rest_api_1";
$port = 3306;
// $connection = mysqli_connect($hostname, $username, $password, $database, $port) or die("Database Connection Failed");
try{
    $connection = new PDO("mysql:host=$hostname;dbname=$database;port=$port", $username, $password);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}catch(PDOException $e){
    echo "Connection failed: " . $e->getMessage();
    exit();
}
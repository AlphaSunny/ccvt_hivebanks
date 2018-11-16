<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);



//等级提升程序

$db = new DB_COM();

$sql = "select * from us_asset WHERE 1";
$db->query($sql);
$rows = $db->fetchAll();
if ($rows){
    
}
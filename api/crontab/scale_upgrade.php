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
    $unit = la_unit();
    //积分
    foreach ($rows as $k=>$v){
        set_time_limit(0);
        $scale = $v['base_amount']/$unit;
        echo $scale;
    }
}

//la汇率
function la_unit(){
    $db = new DB_COM();
    $sql = "select unit from la_base limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows['unit'];
}
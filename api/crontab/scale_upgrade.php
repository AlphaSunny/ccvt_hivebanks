<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);



//等级提升程序

$db = new DB_COM();

$sql = "select * from us_asset WHERE asset_id='GLOP'";
$db->query($sql);
$rows = $db->fetchAll();
if ($rows){
    $unit = la_unit();
    //积分
    foreach ($rows as $k=>$v){
        set_time_limit(0);
        $scale = $v['base_amount']/$unit;
        //判断等级提升
        scale_upgrade($v['us_id'],$scale);
    }
}

function scale_upgrade($us_id,$scale){

    //判断是否可以升级
    $us_scale = get_us_base($us_id)['scale']+1;
    //获取当前积分的等级
    $sca = get_scale_info($scale);
    print_r($sca);
    echo $scale."<br />";
    if($scale>$sca['integral']){

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

//获取等级信息
function get_scale_info($scale){
    $db = new DB_COM();
    $sql = "select * from us_scale WHERE integral<='{$scale}' ORDER BY integral DESC limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}

//获取用户信息
function get_us_base($us_id){
    $db = new DB_COM();
    $sql = "select * from us_base WHERE us_id='{$us_id}'";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
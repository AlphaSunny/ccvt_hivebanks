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
        scale_upgrade($v['us_id'],$scale,$v['us_account']);
    }
}

echo "OK";

function scale_upgrade($us_id,$scale,$us_account){

    //判断是否可以升级
    $us_scale = get_us_base($us_id)['scale'];
    //获取当前积分的等级
    $sca = get_scale_info($scale);
    if($us_scale<$sca['scale']){
        $db = new DB_COM();
        $pInTrans = $db->StartTrans();  //开启事务
        //升级记录表
        $data['change_id'] = get_guid();
        $data['us_id'] = $us_id;
        $data['before_scale'] = $us_scale;
        $data['after_scale'] = $sca['scale'];
        $data['utime'] = time();
        $data['ctime'] = date('Y-m-d H:i:s');
        $sql = $db->sqlInsert("us_scale_changes", $data);
        $id = $db->query($sql);
        if (!$id){
            $db->Rollback($pInTrans);
            echo "添加记录失败";
        }

        //修改用户等级
        $sql = "update us_base set scale='{$sca['scale']}' WHERE us_id='{$us_id}'";
        $db -> query($sql);
        if (!$db->affectedRows()){
            $db->Rollback($pInTrans);
            echo "修改用户等级失败";
        }
        $db->Commit($pInTrans);
        echo "升级完成&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".$us_account."<br />";
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
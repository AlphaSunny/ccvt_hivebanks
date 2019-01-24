<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);




//等级提升程序(每次只能升一级)

$db = new DB_COM();
$unit = get_la_base_unit();

$sql = "select scale from us_base group by scale order by scale desc";
$db->query($sql);
$scale_list = $db->fetchAll();
if ($scale_list){
    foreach ($scale_list as $k=>$v){
        set_time_limit(0);
        //获取下一级所需荣耀积分
        $next_glory = get_next_glory($v['scale']);
        $sql = "select us_id,us_nm,us_account,base_amount/'{$unit}' as base_amount,(select wechat from us_base where us_id=a.us_id) as wechat from us_asset as a where asset_id='GLOP' and  base_amount/'{$unit}' >='{$next_glory['integral']}' and us_id in (select us_id from us_base where scale='{$v['scale']}') order by base_amount desc";
        $db->query($sql);
        $two_rows = $db->fetchAll();
//        echo "升级".$v['scale']+1;
        echo count($two_rows)."<br />";
//        print_r($two_rows);
        foreach ($two_rows as $a=>$b){
            set_time_limit(0);
            //判断等级提升
            $us_scale = get_us_base($b['us_id'])['scale'];
            if ($us_scale!=($v['scale']+1)){
                scale_upgrade($v['us_id'],$v['scale'],$v['scale']+1,$v['base_amount']);
            }
        }
    }
}

echo "OK";


////1-2
//$sql = "select us_id,us_nm,us_account,base_amount/'{$unit}' as base_amount,(select wechat from us_base where us_id=a.us_id) as wechat from us_asset as a where asset_id='GLOP' and  base_amount/'{$unit}' >= 300 and us_id in (select us_id from us_base where scale=1) order by base_amount desc";
//$db->query($sql);
//$two_rows = $db->fetchAll();
//foreach ($two_rows as $k=>$v){
//    set_time_limit(0);
//    //判断等级提升
//    $us_scale = get_us_base($v['us_id'])['scale'];
//    if ($us_scale!=2){
//        scale_upgrade($v['us_id'],1,2,$v['base_amount']);
//    }
//}
//
//
////0-1
//$sql = "select us_id,us_nm,us_account,base_amount/'{$unit}' as base_amount,(select wechat from us_base where us_id=a.us_id) as wechat from us_asset as a where asset_id='GLOP' AND base_amount/'{$unit}' >= 100 and us_id not in (select us_id from us_base where scale=1) order by base_amount desc";
//$db->query($sql);
//$one_rows = $db->fetchAll();
//foreach ($one_rows as $k=>$v){
//    set_time_limit(0);
//    //判断等级提升
//    $us_scale = get_us_base($v['us_id'])['scale'];
//    if ($us_scale!=1){
//        scale_upgrade($v['us_id'],0,1,$v['base_amount']);
//    }
//}


function scale_upgrade($us_id,$before_scale,$after_scale,$scale){
        $db = new DB_COM();
        $pInTrans = $db->StartTrans();  //开启事务
        //升级记录表
        $data2['change_id'] = get_guid();
        $data2['us_id'] = $us_id;
        $data2['before_scale'] = $before_scale;
        $data2['after_scale'] = $after_scale;
        $data2['scale'] = $scale;
        $data2['utime'] = time();
        $data2['ctime'] = date('Y-m-d H:i:s');
        $sql = $db->sqlInsert("us_scale_changes", $data2);
        $id = $db->query($sql);
        if (!$id){
            $db->Rollback($pInTrans);
            echo "添加记录失败";
        }

        //修改用户等级
//        $sql = "update us_base set scale='{$after_scale}' WHERE us_id='{$us_id}'";
//        $db -> query($sql);
//        if (!$db->affectedRows()){
//            $db->Rollback($pInTrans);
//            echo "修改用户等级失败";
//        }

        $db->Commit($pInTrans);
}


//获取下一级所需荣耀积分
function get_next_glory($scale){
    $db = new DB_COM();
    $sql = "select * from us_scale WHERE scale='{$scale}'+1";
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

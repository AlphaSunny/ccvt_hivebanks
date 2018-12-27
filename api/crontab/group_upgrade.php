<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);


//群等级提升程序(每次只能升一级)


$db = new DB_COM();
//群
$sql = "select id,name from bot_group WHERE scale=1";
$db->query($sql);
$group_rows = $db->fetchAll();
foreach ($group_rows as $k=>$v){
    $sql = "select count(*) as count from us_bind where bind_name='group' and bind_info='{$v['id']}'";
    $db->query($sql);
    $group_rows[$k]['bind_count'] = $db->getField($sql,'count');
    $sql = "select count(*) as count from us_base WHERE scale=1 AND us_id in (select us_id from us_bind WHERE bind_name='group' AND bind_info='{$v['id']}')";
    $db->query($sql);
    $group_rows[$k]['us_one_scale_count'] = $db->getField($sql,'count');
}

print_r($group_rows);die;



echo "OK";

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
        $sql = "update us_base set scale='{$after_scale}' WHERE us_id='{$us_id}'";
        $db -> query($sql);
        if (!$db->affectedRows()){
            $db->Rollback($pInTrans);
            echo "修改用户等级失败";
        }

        $db->Commit($pInTrans);
}



//获取用户信息
function get_us_base($us_id){
    $db = new DB_COM();
    $sql = "select * from us_base WHERE us_id='{$us_id}'";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}

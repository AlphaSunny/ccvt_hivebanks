<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

//绑定群昵称

$db = new DB_COM();

$sql = "select * from us_base WHERE wechat!=''";
$db->query($sql);
$rows = $db->fetchAll();
print_r($rows);die;
if ($rows){
    $pInTrans = $db->StartTrans();  //开启事务
    foreach ($rows as $k=>$v){
        //判断是否绑定过
        $check_bind = check_bind($v['us_id']);
        if ($check_bind){
            continue;
        }
        $vail = 'group';
        $us_bind['bind_id'] = get_guid();
        $us_bind['us_id'] = $v['us_id'];
        $us_bind['bind_type'] = 'text';
        $us_bind['bind_name'] = $vail;
        $us_bind['bind_info'] = 1;
        $us_bind['bind_flag'] = 1;
        $us_bind['utime'] = time();
        $us_bind['ctime'] = date('Y-m-d H:i:s');
        $sql = $db->sqlInsert("us_bind", $us_bind);
        if (!$db->query($sql)) {
            $db->Rollback($pInTrans);
            echo "失败";
        }
    }
    $db->Commit($pInTrans);
}

echo "OK";

//判断是否绑定过群组
function check_bind($us_id){
    $db = new DB_COM();
    $sql = "select * from us_bind WHERE us_id='{$us_id}' AND bind_name='group'";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
<?php
require_once '../inc/common.php';
php_begin();

$content  = file_get_contents("php://input");


$db = new DB_COM();

$json = json_decode($content,true);

$members = explode(",", $json['members']);


$time = time()-5*60;
$sql = "select count(member_id) as count from bot_group_members WHERE group_id='{$json['group_id']}' AND intime<'{$time}'";
$db->query($sql);
$count = $db->getField($sql,'count');
if ($count>0){
    echo 222;die;
    foreach ($members as $k=>$v){
        $sql = "select * from bot_group_members WHERE group_id='{$json['group_id']}' AND name='{$v}' AND intime<'{$time}'";
        $db->query($sql);
        $row = $db->fetchRow();
        if (!$row){
            //新用户
            $date['name'] = $v;
            $date['group_id'] = $json['group_id'];
            $date['group_name'] = $json['group_name'];
            $date['ctime'] = date('Y-m-d H:i:s');
            $date['type'] = 1;
            $sql = $db->sqlInsert("bot_memeber_change_record",$date);
            $db->query($sql);
        }else{
            $sql = "update bot_group_members set is_check=2 WHERE group_id='{$json['group_id']}' AND name='{$v}' AND intime<'{$time}'";
            $db->query($sql);
        }
    }
}
//批量插入
$sql= "insert into bot_group_members (member_id,name,group_id,group_name,intime) values ";
foreach ($members as $k=>$value){
    $sql .= "('".get_guid()."','".$value."','".$json['group_id']."','".$json['group_name']."','".time()."'),";
}
$sql = substr($sql,0,strlen($sql)-1);
$q_id = $db->query($sql);
if ($q_id == 0)
    exit_error('125','错误');


// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);





?>

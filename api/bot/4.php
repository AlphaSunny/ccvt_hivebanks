<?php
require_once '../inc/common.php';
php_begin();

$args = array("content");
chk_empty_args('POST', $args);
$data = array();

$content  = $_POST['content'];


$db = new DB_COM();

$json = json_decode($content,true);

$members = explode(",", $json['members']);

foreach ($members as $k=>$v){
    echo $v;
}

die;


$time = time()-30*60;
$sql = "select count(member_id) as count from bot_group_members WHERE group_id='{$json['group_id']}' AND intime<'{$time}'";
$db->query($sql);
$count = $db->getField($sql,'count');
if ($count>0){
    foreach ($members as $k=>$v){
        $sql = "select * from bot_group_members WHERE group_id='{$json['group_id']}' AND name='{$v}' AND intime<'{$time}'";
        $db->query($sql);
        $row = $db->fetchRow();
        if (!$row){
            //新用户
            $date['name'] = $json['name'];
            $date['group_id'] = $json['group_id'];
            $date['group_name'] = $json['group_name'];
            $date['ctime'] = date('Y-m-d H:i:s');
            $date['type'] = 1;
            $sql = $db->sqlInsert("bot_memeber_change_record",$date);
            $db->query($sql);
        }else{
            $sql = "update bot_group_members set is_check=2 WHERE group_id='{$data['group_id']}' AND name='{$data['name']}' AND intime<'{$time}'";
            $db->query($sql);
        }
    }
}
$sql = $db->sqlInsert("bot_group_members", $data);
$q_id = $db->query($sql);
if ($q_id == 0)
    return false;
return true;


print_r(json_decode($content,true));





?>

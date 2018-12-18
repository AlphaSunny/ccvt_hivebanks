<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

$db = new DB_COM();
$sql = "select * from bot_message WHERE group_id=0";
$db->query($sql);
$rows = $db->fetchAll();
foreach ($rows as $k=>$v){
    set_time_limit(0);
    $sql = "select id from bot_group where name='{$v['group_name']}'";
    $db->query($sql);
    $group_id = $db->getField($sql,'id');
    if ($group_id){
        $sql = "update bot_message set group_id='{$group_id}' WHERE bot_message_id='{$v['bot_message_id']}'";
        $db->query($sql);
    }
}

echo "OK";
?>
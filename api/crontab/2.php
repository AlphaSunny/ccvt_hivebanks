<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

$db = new DB_COM();
$sql = "select name,(select count(bot_message_id) from bot_message where bot_nickname=name) as count from bot_group_members WHERE group_id=9 ORDER BY count DESC ";

$db->query($sql);
$rows = $db->fetchAll();
foreach ($rows as $k=>$v){
    echo $v['name']."&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;发言数".$v['count']."<br />";
}

?>
<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

$db = new DB_COM();
$sql = "select name,(select count(bot_message_id) from bot_message where bot_nickname=name) as count from bot_group_members WHERE group_id=1";
$db->query($sql);
$rows = $db->fetchAll();
print_r($rows);

?>
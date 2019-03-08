<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 检查群聊是否一段时间内如果没人聊天,删除群 ==========================
GET参数
  group_name         group_name


返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

check_chat_to_group();


?>

<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 单聊开关 ==========================

*/

php_begin();
$args = array('us_id');
chk_empty_args('GET', $args);

//机器人用户id
$us_id = get_arg_str('GET','us_id');
//获取答案
$rows = get_chat_switch($us_id);

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>

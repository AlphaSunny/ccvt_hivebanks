<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 微信机器人定时任务返回接口 ==========================
GET参数
  ba_id         ba_id

返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('group_id');
chk_empty_args('GET', $args);

//查询定时任务
$group_id = get_arg_str('GET', 'group_id');
$rows = search_timer($group_id);

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>

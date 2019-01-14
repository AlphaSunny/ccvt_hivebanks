<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 修改定时任务里面图片下载完成的定时任务 ==========================
GET参数
  timer_id         timer_id

返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('timer_id');
chk_empty_args('GET', $args);

//查询定时任务
$timer_id = get_arg_str('GET', 'timer_id');

$rows = change_timer($timer_id);

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>

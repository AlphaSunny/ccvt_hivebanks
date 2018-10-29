<?php

require_once '../inc/common.php';
require_once 'db/bot.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 统计当日发言数,发币数,总发言数 ==========================
GET参数
  timer_id          任务id

返回
  errcode = 0     请求成功
*/

php_begin();
$args = array('token','timer_id');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
// 群组名称
$timer_id = get_arg_str('GET', 'timer_id');
//验证token
$ba_id = check_token($token);

// 添加群组
$row = get_timer_info($timer_id);

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['row'] = $row;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


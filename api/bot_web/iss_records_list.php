<?php

require_once '../inc/common.php';
require_once 'db/bot.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 聊天奖励列表 ==========================
GET参数
  token                用户token

返回
  errcode = 0     请求成功
  rows                 记录数组
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
//验证token
$ba_id = check_token($token);

// 时间
$start_time = get_arg_str('GET', 'start_time');
$end_time = get_arg_str('GET', 'end_time');

//昵称
$nickname = get_arg_str('GET', 'nickname');

$da['ba_id'] = $ba_id;
$da['start_time'] = $start_time;
$da['end_time'] = $end_time;
$da['nickname'] = $nickname;

// 交易记录数组
$rows = iss_records_list($da);


// 返回数据做成
$rtn_ary = array();
//$rtn_ary['errcode'] = '0';
//$rtn_ary['errmsg'] = '';
//$rtn_ary['count'] = count($rows);
$rtn_ary['data'] = $rows['rows'];
$rtn_ary['all_amount'] = $rows['all_amount'];
$rtn_ary['all_chat'] = $rows['all_chat'];
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


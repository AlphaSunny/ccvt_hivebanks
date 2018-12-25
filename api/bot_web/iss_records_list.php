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
$us_id = check_token($token);

// 时间
$start_time = get_arg_str('GET', 'start_time');
$end_time = get_arg_str('GET', 'end_time');

//昵称
$nickname = get_arg_str('GET', 'nickname');

// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');


$da['us_id'] = $us_id;
$da['start_time'] = $start_time;
$da['end_time'] = $end_time;
$da['nickname'] = $nickname;

// 获取总记录
$total = get_iss_record_total($da);

// 交易记录数组
$rows = iss_records_list($da,$offset,$limit);


// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows['rows'];
$rtn_ary['all_amount'] = $rows['all_amount'];
$rtn_ary['all_chat'] = $rows['all_chat'];
$rtn_ary['all_cashback'] = $rows['all_cashback'];
$rtn_ary['all_bind_count'] = $rows['all_bind_count'];
$rtn_ary['total'] = $total;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


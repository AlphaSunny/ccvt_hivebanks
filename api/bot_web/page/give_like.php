<?php

require_once '../../inc/common.php';
require_once 'db/page.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 点赞功能 ==========================
GET参数
  token                用户token
  us_id              点赞的用户id

返回
  errcode = 0     请求成功
*/

php_begin();
$args = array('token','give_us_id','give_num');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
// 用户id
$give_us_id = get_arg_str('GET', 'give_us_id');
//验证token
$us_id = check_token($token);

$data['us_id'] = $us_id;
$data['give_us_id'] = $give_us_id;
$data['give_num'] = get_arg_str('GET', 'give_num');

// 添加群组
$row = give_like_us($data);

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['row'] = $row;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


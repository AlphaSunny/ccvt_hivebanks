<?php

require_once '../inc/common.php';
require_once 'db/us_asset.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 已点赞(点踩),最高多少 ==========================
GET参数
  token                用户token
  us_id              点赞(踩)的用户id

返回
  errcode = 0     请求成功
*/

php_begin();

//$args = array('token');
//chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);

//验证token
//$us_id = check_token($token);

$us_id = "1079FD63-69C1-8BFD-9DB3-B18C9141732C";

// 数据
$rows = praise_or_pointon_num($us_id);

$rows = array_merge($rows,get_praise_pointon_maxnum());

print_r($rows);

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


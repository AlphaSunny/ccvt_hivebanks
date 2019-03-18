<?php

require_once '../../inc/common.php';
require_once 'db/bot.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 群组信息 ==========================
GET参数
  token                用户token
  group_id          群组id

返回
  errcode = 0     请求成功
*/

php_begin();
$args = array('token','group_id');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
// 群组名称
$group_id = get_arg_str('GET', 'group_id');
//验证token
$la_id = la_user_check($token);

// 添加群组
$row = get_group_info($group_id);

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['row'] = $row;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


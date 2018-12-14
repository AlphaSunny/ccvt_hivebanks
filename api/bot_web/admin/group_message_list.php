<?php

require_once '../../inc/common.php';
require_once 'db/bot.php';
require_once 'db/la_admin.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 聊天记录查询 ==========================
GET参数
  token                用户token
  group_id          群组id
  status            1:今日 2:昨天  3:3天内  4:七天内

返回
  errcode = 0     请求成功
  rows                 记录数组
*/

php_begin();
$args = array('token','group_id','status');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
//验证token
$la_id = la_user_check($token);

// 群组id
$group_id = get_arg_str('GET', 'group_id');
// status
$status = get_arg_str('GET', 'status');

// 记录数组
$rows = get_message_list($group_id,$status);


// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


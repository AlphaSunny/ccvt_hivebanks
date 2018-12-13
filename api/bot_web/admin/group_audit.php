<?php

require_once '../../inc/common.php';
require_once 'db/bot.php';
require_once 'db/la_admin.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 群组审核 ==========================
GET参数
  token                用户token

返回
  errcode = 0     请求成功
  rows                 记录数组
*/

php_begin();
$args = array('token','group_id','is_audit');
chk_empty_args('GET', $args);

// token
$token = get_arg_str('GET', 'token',128);

// 群组id
$group_id = get_arg_str('GET', 'group_id');

// 审核 2:成功  3:失败
$is_audit= get_arg_str('GET', 'is_audit');

if ($is_audit!=2 || $is_audit!=3){
    exit_error('139','传值错误');
}

// 失败原因
$why = get_arg_str('GET', 'why');

//验证token
$la_id = la_user_check($token);

// 数组
$date['group_id'] = $group_id;
$date['is_audit'] = $is_audit;
$date['why'] = $why;
//修改群组
$row = audit_group($date);
if (!$row){
    exit_error('109','失败');
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


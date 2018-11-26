<?php
require_once '../inc/common.php';
require_once 'db/us_base.php';
require_once 'db/us_integral_change_log.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 荣耀积分变动记录 ==========================
GET参数
  token            token

返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('token');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',100);

// 验证token
$us_id = check_token($token);


//数据
$rows = us_integral_change_log($us_id);

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] =$rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


?>

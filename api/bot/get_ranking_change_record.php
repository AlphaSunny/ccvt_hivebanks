<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取专属地址昵称code ==========================
GET参数
  wechat         wechat

返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('wechat');
chk_empty_args('GET', $args);

$wechat = get_arg_str('GET', 'wechat');

//获取专属地址昵称code
$code = get_exclusive_code($wechat);

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = $code;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>

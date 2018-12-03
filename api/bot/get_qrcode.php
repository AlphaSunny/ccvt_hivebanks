<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取二维码地址 ==========================

*/

php_begin();

//端口
$port = get_arg_str('GET','port');

//用户id
$us_id = get_arg_str('GET','us_id');

//查询群组列表
$rows = get_qrcode($port,$us_id);

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>

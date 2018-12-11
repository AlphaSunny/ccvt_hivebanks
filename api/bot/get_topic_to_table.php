<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取话题存入数据库 ==========================

*/

php_begin();

$args = array("name","type");
chk_empty_args('POST', $args);

$data['name'] = get_arg_str('POST','name');
$data['type'] = get_arg_str('POST','type');
$data['ctime'] = time();
//存入数据库
$rows = to_topic_table($data);

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>

<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取最新话题 ==========================

*/

php_begin();

//群名
$group_name = get_arg_str('GET','group_name');

//问题
$ask = get_arg_str('GET','ask');

//获取最新文章
$rows = get_topic($group_name,$ask);

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['content'] = $rows['name'];
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>

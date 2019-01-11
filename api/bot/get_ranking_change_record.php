<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取积分排名变化的用户通知 ==========================
GET参数
     group_id
     通知10分钟内的
返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('group_id');
chk_empty_args('GET', $args);

$group_id = get_arg_str('GET', 'group_id');

//获取积分排名变化的用户
$rows = get_rank_change_record($group_id);


$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>

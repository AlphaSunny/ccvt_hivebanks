<?php

require_once '../inc/common.php';
require_once 'db/db_group.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 群信息 ==========================
GET参数

返回
  total                总记录数
  rows                 记录数组

说明
*/

php_begin();
$args = array('group_id');
chk_empty_args('GET', $args);

$group_id = get_arg_str('GET','group_id');

// 记录数组
$rows = get_group_info($group_id);

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['row'] = $rows['row'];
$rtn_ary['bind_rows'] = $rows['bind_rows'];
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

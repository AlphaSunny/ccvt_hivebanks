<?php

require_once '../inc/common.php';
require_once 'db/db_group.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 绑定列表 ==========================
GET参数
  limit                分页记录
  offset               分页偏移量
  group_id
返回
  total                总记录数
  rows                 记录数组

说明
*/

php_begin();

$args = array('group_id');
chk_empty_args('GET', $args);

// 群id
$group_id = get_arg_str('GET', 'group_id');

// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');

// 记录数组总数
$total = get_bnd_total($group_id);
// 记录数组
$rows = bnd_list($group_id,$offset,$limit);

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

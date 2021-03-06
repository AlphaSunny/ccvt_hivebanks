<?php

require_once '../inc/common.php';
require_once 'db/db_group.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 群信息列表 ==========================
GET参数
  limit                分页记录
  offset               分页偏移量
返回
  total                总记录数
  rows                 记录数组

说明
*/

php_begin();
// 搜索名称
$search_name = get_arg_str('GET', 'search_name');

// 搜索等级
$scale = get_arg_str('GET', 'scale');

// 搜索类型(id)
$type_id = get_arg_str('GET', 'type_id');

// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');
// 获取当前总记录
$total = get_group_list_total($search_name,$scale,$type_id);
// 记录数组
$rows = get_group_list($offset,$limit,$search_name,$scale,$type_id);

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_ary['total'] = $total;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

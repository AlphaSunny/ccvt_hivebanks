<?php

require_once '../inc/common.php';
require_once 'db/us_asset.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 荣耀积分排行榜记录 ==========================
GET参数
  limit                分页记录
  offset               分页偏移量
返回
  total                总记录数
  rows                 记录数组

说明
*/

php_begin();

//get_ranking();

// 搜索内容
$search_content = get_arg_str('GET', 'search_content');

// 群id
$group_id = get_arg_str('GET', 'group_id');

// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');
// 获取当前用户的交易总记录
$total = get_leaderboard_total($search_content,$group_id);
// 交易记录数组
$rows = get_leaderboard($offset,$limit,$search_content,$group_id);

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_ary['total'] = $total;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

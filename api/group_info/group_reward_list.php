<?php

require_once '../inc/common.php';
require_once 'db/db_group.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 群成员奖励列表 ==========================
GET参数
  limit                分页记录
  offset               分页偏移量
返回
  total                总记录数
  rows                 记录数组

说明
*/

php_begin();
$args = array('group_id');
chk_empty_args('GET', $args);

//群id
$group_id = get_arg_str('GET','group_id');

// 时间
$start_time = get_arg_str('GET', 'start_time');
$end_time = get_arg_str('GET', 'end_time');

//昵称
$nickname = get_arg_str('GET', 'nickname');

$da['group_id'] = $group_id;
$da['start_time'] = $start_time;
$da['end_time'] = $end_time;
$da['nickname'] = $nickname;

// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');
// 获取当前总记录
$total = get_group_reward_total($da);
// 记录数组
$rows = get_group_reward_list($offset,$limit,$da);

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_ary['total'] = $total;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

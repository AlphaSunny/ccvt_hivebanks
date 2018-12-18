<?php

require_once '../inc/common.php';
require_once 'db/us_asset.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 聊天记录 ==========================
GET参数
  limit                分页记录
  offset               分页偏移量
返回
  total                总记录数
  rows                 记录数组

说明
*/

php_begin();

//$args = array('wechat');
//chk_empty_args('GET', $args);

// 微信昵称
$wechat = get_arg_str('GET', 'wechat');

// 群id
$group_id = get_arg_str('GET', 'group_id');

// 搜索内容
$search_content = get_arg_str('GET', 'search_content');

// 获取当前用户的聊天总记录
$data['wechat'] = $wechat;
$data['search_content'] = $search_content;
$data['group_id'] = $group_id;

$total = get_chat_total($data);
// 交易记录数组
$rows = get_chat_list($data);

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_ary['total'] = $total;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

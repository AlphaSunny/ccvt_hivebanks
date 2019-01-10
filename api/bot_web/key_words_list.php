<?php

require_once '../inc/common.php';
require_once 'db/bot.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 关键词列表 ==========================
GET参数
  token                用户token

返回
  errcode = 0     请求成功
  rows                 记录数组
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
//验证token
$us_id = check_token($token);

//搜索关键词
$search_keywords = get_arg_str('GET', 'search_keywords');
// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');

// 获取总记录
$total = get_key_words_list_total($us_id,$search_keywords);

//获取总开关
$key_words_switch = get_key_words_switch($us_id);
// 交易记录数组
$rows = get_key_words_list($us_id,$offset,$limit,$search_keywords);


// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_ary['total'] = $total;
$rtn_ary['key_words_switch'] = $key_words_switch;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


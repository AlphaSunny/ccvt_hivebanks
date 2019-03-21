<?php

require_once '../inc/common.php';
require_once 'db/us_asset.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== top10留言列表 ==========================
GET参数

返回

  rows                 记录数组

说明
*/

php_begin();


// 记录数组
$rows = get_leave_message();

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

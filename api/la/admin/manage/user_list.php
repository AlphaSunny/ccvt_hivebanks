<?php

require_once "../../../inc/common.php";
require_once "db/us_base.php";
require_once "db/la_admin.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取us列表 ==========================
GET参数
token              用户token
返回
rows            信息数组
      us_id        用户ID
      us_nm         用户商编号（内部唯一）
      us_account    用户表示账号（内部唯一）
      base_amount   基准资产余额
      lock_amount   锁定余额
      us_type       用户类型
      us_level      用户等级
      security_level安全等级
      utime         更新时间
      ctime         创建时间

说明

*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);

$filter = get_arg_str('GET', 'funds_filter', 128);

$time_filter = get_arg_str('GET', 'time_filter', 128);

$user_id = la_user_check($token);

// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');

// 记录数组总数
$total = get_us_base_info_total();

$rows = get_us_base_info($offset,$limit,$filter,$time_filter);

//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['total'] = $total;
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

<?php

require_once '../inc/common.php';
require_once 'db/ca_rate_setting.php';
require_once 'db/ca_base.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取渠道列表以及最低充值汇率 ==========================
GET参数
  token            请求的用户token
  bit_amount       法定货币金额
返回
  errcode = 0     请求成功
   rows           符合的ca列表
    ca_channel    ca的渠道
    base_rate     汇率
说明
*/

php_begin();
$args = array("token","base_amount");
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
$base_amount = get_arg_str('GET', 'base_amount') * get_la_base_unit();

//验证token
$us_id = check_token($token);
$ca_id = get_ca_id();
$rows = sel_ca_asset_account_by_ca_id($ca_id);

//返回给前端数据
$rtn_data['errcode'] = '0';
$rtn_data['errmsg'] = '';
$rtn_data['rows'] = $row;
php_end(json_encode($rtn_data));

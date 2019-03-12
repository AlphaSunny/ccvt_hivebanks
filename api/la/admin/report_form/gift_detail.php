<?php

require_once "../../../inc/common.php";
require_once "db/us_base.php";
require_once "db/ba_base.php";
require_once "db/ca_base.php";
require_once "db/us_ba_recharge_request.php";
require_once "db/us_ba_withdraw_request.php";
require_once "db/us_ca_withdraw_request.php";
require_once "db/us_ca_recharge_request.php";
require_once  "db/la_admin.php";
require_once "../../db/la_func_common.php";


/*
========================== 统计报表 ==========================
GET参数
  token             用户token
返回
rows            信息数组
    (all信息都会被返回)
说明
*/

php_begin();
$args = array("token");
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);

//la用户检查
la_user_check($token);

// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');

// 记录数组总数
$total = gift_detail_total();

//ba赠送明细
$gift_detail = gift_detail($offset,$limit);

//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['total'] = $total;
$rtn_ary['rows'] = $gift_detail;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

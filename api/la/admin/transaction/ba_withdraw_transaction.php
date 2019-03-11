<?php

require_once  "../../../inc/common.php";
require_once  "db/ba_base.php";
require_once "db/la_admin.php";
require_once  "db/us_ba_withdraw_request.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取ba交易列表 ==========================
GET参数
token                用户token
返回
rows            信息数组
    recharge_ba   用户ba提现记录数组
      qa_id          请求ID
      us_id          用户ID
      ba_id          代理商ID
      asset_id       充值资产ID
      ba_account_id  代理商账号ID（Hash）
      bit_amount     数字货币金额
      base_amount    充值资产金额
      tx_hash        交易HASH
      tx_type        交易类型
      tx_detail      交易明细（JSON）
      tx_fee         交易手续费
      tx_time        请求时间戳
      qa_flag        订单状态
     withdraw_ba   用户ba充值记录数组
      qa_id           请求ID
      us_id           用户ID
      ba_id           代理商ID
      asset_id        提现资产ID
      us_account_id   用户账号ID（Hash）
      bit_amount      数字货币金额
      base_amount     提现资产金额
      tx_hash         交易HASH
      tx_type         交易类型
      tx_detail       交易明细（JSON）
      tx_fee          交易手续费
      tx_time         请求时间戳
      qa_flag         订单状态1:已处理，2拒绝，0：未处理

说明

*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
//la用户检查
la_user_check($token);

// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');

// 记录数组总数
$total = get_ba_withdraw_log_balance_total();
// 获取ba的交易记录
$withdraw_rows = get_ba_withdraw_log_balance($offset,$limit);

foreach ($withdraw_rows as $k=>$v){
    $withdraw_rows[$k]['tx_time'] = date("Y-m-d H:i:s",$v['tx_time']);
}

//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['total'] = $total;
$rtn_ary['rows'] = $withdraw_rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

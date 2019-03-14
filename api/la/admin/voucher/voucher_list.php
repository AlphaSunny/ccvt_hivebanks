<?php
/**
 * Created by PhpStorm.
 * User: Gavin
 */


require_once  "../../../inc/common.php";
require_once  "db/voucher.php";
require_once "../../db/la_func_common.php";


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取ba赠送列表 ==========================
GET参数
token                用户token
type                 赠送类型  1：注册赠送  2：邀请赠送  3：ba调账赠送   4:群聊奖励

返回
rows            信息数组
    amount      赠送数量
    tx_detail   奖励类型
    us_account  用户账号
    wechat      微信账号
    gift_time   赠送时间
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
$total = get_voucher_list_total();

$rows = get_voucher_list($offset,$limit);

//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['total'] = $total;
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


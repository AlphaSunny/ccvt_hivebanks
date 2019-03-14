<?php
/**
 * Created by PhpStorm.
 * User: Gavin
 */


require_once  "../../../inc/common.php";
require_once  "db/voucher.php";
require_once  "db/la_admin.php";
require_once "../../db/la_func_common.php";


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取兑换码列表 ==========================
GET参数
token                用户token

*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);


$is_effective = get_arg_str('GET', 'is_effective');
//la用户检查
la_user_check($token);

// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');

// 记录数组总数
$total = get_voucher_list_total($is_effective);

$rows = get_voucher_list($offset,$limit,$is_effective);

//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['total'] = $total;
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


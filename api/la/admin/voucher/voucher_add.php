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
========================== 生成兑换码 ==========================
GET参数
token                用户token


*/

php_begin();
$args = array('token','num','price','expiry_date');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);

$num = get_arg_str('GET', 'num');
$price = get_arg_str('GET', 'price');
$expiry_date = get_arg_str('GET', 'expiry_date');
//la用户检查
la_user_check($token);


$rows = voucher_add($num,$price,$expiry_date);
if (!$rows){
    exit_error('190','失败');
}

//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


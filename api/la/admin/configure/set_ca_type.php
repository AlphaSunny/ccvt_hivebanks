<?php

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

require_once "../../../inc/common.php";
require_once "db/com_option_config.php";
require_once "db/la_admin.php";

php_begin();
$args = array("token","option_key","option_value");
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
$option_key = get_arg_str('GET', 'option_key');
$option_value = get_arg_str('GET', 'option_value');

//判断la是否存在
$la_id = check_token($token);
$row = get_la_by_user($la_id);
if(!$row){
    exit_error('112','用户不存在');
}

$data = array();
$data["option_name"] = "ca_type";
$data["option_key"] = $option_key;
$data["option_value"] = $option_value;
$data["sub_id"] = "CA";
$data["status"] = "1";
$row = sel_ca_type_com_option_config_by_option_key($option_key);
if ($row){
    exit_error("103","重复添加");
}
if(!ins_ca_com_option_config($data))
    exit_error("101","插入错误");
$rows = sel_ca_com_option_config();
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;

$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

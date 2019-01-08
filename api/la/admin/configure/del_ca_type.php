<?php

require_once "../../../inc/common.php";
require_once "db/com_option_config.php";
require_once  "db/la_admin.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 删除ca的渠道 ==========================
GET参数
token             用户token
option_key         选项关键字
返回
  errcode = 0      请求成功
说明
*/

php_begin();
$args = array("token","option_key");
chk_empty_args('GET', $args);

$option_key = get_arg_str('GET', 'option_key');
// 用户token
$token = get_arg_str('GET', 'token', 128);

//验证
$la_id = check_token($token);
//判断la是否存在
$row = get_la_by_user($la_id);
if(!$row){
    exit_error('112','用户不存在');
}
$data = array();
$data["option_name"] = "bit_type";
$data["option_key"] = $option_key;
$data["sub_id"] = "CA";
$row = sel_ca_type_com_option_config_by_option_key($option_key);
if ($row["status"] == 9)
    exit_error("112","不存在或已经删除");
if(!upd_ca_com_option_config($option_key))
    exit_error("101","更新错误");
exit_ok();

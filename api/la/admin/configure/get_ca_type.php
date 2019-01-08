<?php

require_once "../../../inc/common.php";
require_once "db/com_option_config.php";
require_once  "db/la_admin.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取ca的渠道 ==========================
GET参数
    token             用户token
返回
  errcode = 0      请求成功
  rows             ba的type数组
    option_name        选项名称
    option_key         选项关键字
    option_value       选项值
    opyion_sort        选项排序
    sub_id             模块id
    status             有效标志
    option_src         选项图片
说明
*/

php_begin();
$args = array("token");
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);

$la_id = check_token($token);

$row = get_la_by_user($la_id);
if(!$row){
    exit_error('112','用户不存在');
}
$rows = sel_ca_type_com_option_config();
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
<?php

require_once '../inc/common.php';
require_once 'db/us_bind.php';
require_once 'db/us_base.php';
require_once 'db/us_log_bind.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 申请群 ==========================
GET参数
  token           用户TOKEN
返回
  errcode = 0     请求成功
说明

*/
php_begin();
$args = array('token','group_name','group_type_id');
chk_empty_args('GET', $args);

// 用户TOKEN
$token = get_arg_str('GET', 'token',128);

//群名称
$group_name = get_arg_str('GET','group_name');

//群类型id
$group_type_id = get_arg_str('GET','group_type_id');

//验证token
$us_id = check_token($token);

//判断名称是否已添加
$is_name = check_group_name($us_id,$group_name);
if ($is_name){
    exit_error('109','名称已存在');
}

//设置开关和金额
$row = application_group($us_id,$group_name,$group_type_id);
if (!$row){
    exit_error("109","错误");
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

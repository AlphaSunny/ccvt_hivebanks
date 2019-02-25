<?php

require_once '../inc/common.php';
require_once 'db/us_base.php';
require_once 'db/us_bind.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 用户给用户转账输入账号查询code,输入code查询账号 ==========================
GET参数
  token               用户TOKEN
返回

说明
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);
// 用户token
$token = get_arg_str('GET', 'token',100);

//账号
$account = get_arg_str('GET', 'account');

//识别码(邀请码)
$code = get_arg_str('GET', 'code');

if (!$account && !$code){
    exit_error("150","传值错误");
}

// 验证token
$us_id = check_token($token);
// 通过id获取用户基本信息
$row = transfer_sel_info($account,$code);
if (!$row){
    exit_error("150","用户不存在");
}


// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['result'] =$row['result'];
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

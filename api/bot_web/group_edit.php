<?php

require_once '../inc/common.php';
require_once 'db/bot.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 群组编辑 ==========================
GET参数
  token                用户token
  group_name          群组名称

返回
  errcode = 0     请求成功
*/

php_begin();
$args = array('token','group_name','del','flirt','group_id','send_address','bind_account_notice','is_welcome');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
// 群组id
$group_id = get_arg_str('GET', 'group_id');
// 群组名称
$group_name = get_arg_str('GET', 'group_name');

// 每天早上八点、晚上10推送当天统计    1：推送   2：不推送
$send_address = get_arg_str('GET', 'send_address');

// 是否绑定ccvt账号通知   1：通知   2：不通知
$bind_account_notice = get_arg_str('GET', 'bind_account_notice');

// 是否开启入群欢迎    1：开启   2：关闭
$is_welcome = get_arg_str('GET', 'is_welcome');

// 欢迎语
$welcome = get_arg_str('GET', 'welcome');


//验证token
$us_id = check_token($token);

$vail = 'edit';
//判断名称是否已添加
$is_name = check_group_name($group_name,$vail,$group_id);
if ($is_name){
    exit_error('109','名称已存在');
}

$date['group_id'] = $group_id;
$date['name'] = $group_name;
$date['is_del'] = get_arg_str('GET', 'del');
$date['is_flirt'] = get_arg_str('GET', 'flirt');
$date['send_address'] = $send_address;
$date['bind_account_notice'] = $bind_account_notice;
$date['is_welcome'] = $is_welcome;
$date['welcome'] = $welcome;
//修改群组
$row = save_group($date);
if (!$row){
    exit_error('109','修改失败');
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


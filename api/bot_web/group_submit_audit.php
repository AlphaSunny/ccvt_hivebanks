<?php

require_once '../inc/common.php';
require_once 'db/bot.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 群组提交审核 ==========================
GET参数
  token                用户token
  group_id             群组id
  group_type_id        类型id

返回
  errcode = 0          请求成功
*/

php_begin();
$args = array('token','group_id','group_type_id');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
//验证token
$us_id = check_token($token);

// 群组id
$group_id = get_arg_str('GET', 'group_id');
// 类型id
$group_type_id = get_arg_str('GET', 'group_type_id');

//判断是否已经提交过
$result = check_is_submit($group_id,$us_id);
if (!$result || $result['is_apply']==2){
    exit_error('139','已经提交过');
}

//判断名称是否已添加
$vail = 'edit';
$is_name = check_group_name($result['name'],$vail);
if ($is_name){
    exit_error('109','名称已存在');
}


$data['us_id'] = $us_id;
$data['group_id'] = $group_id;
//$data['group_name'] = $result['name'];
$data['group_type_id'] = $group_type_id;

// 提交
$audit = group_submit_audit($data);
if (!$audit){
    exit_error('139','提交失败');
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


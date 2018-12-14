<?php

require_once '../../inc/common.php';
require_once 'db/bot.php';
require_once 'db/la_admin.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 群组编辑 ==========================
GET参数
  token                token

返回
  errcode = 0     请求成功
*/

php_begin();
$args = array('token','admin_del','group_id');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
// 群组id
$group_id = get_arg_str('GET', 'group_id');
// 群主名称
$group_manager_name = get_arg_str('GET', 'group_manager_name');
//验证token
$la_id = la_user_check($token);

$date['group_id'] = $group_id;
$date['is_admin_del'] = get_arg_str('GET', 'admin_del');
$date['group_manager_name'] = $group_manager_name;
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


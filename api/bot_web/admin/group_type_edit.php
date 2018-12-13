<?php

require_once '../../inc/common.php';
require_once 'db/bot.php';
require_once 'db/la_admin.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 群组类别编辑 ==========================
GET参数
  token                用户token
  type_id          类别id
  name              类别名称

返回
  errcode = 0     请求成功
*/

php_begin();
$args = array('token','type_id','name');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
// 类别id
$type_id = get_arg_str('GET', 'type_id');
// 类别名称
$name = get_arg_str('GET', 'name');
//验证token
$la_id = la_user_check($token);

$data['id'] = $type_id;
$data['name'] = $name;
$data['utime'] = time();
// 编辑类别
$row = group_type_edit($data);
if (!$row){
    exit_error('109','编辑失败');
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


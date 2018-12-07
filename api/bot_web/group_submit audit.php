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
$ba_id = check_token($token);

// 交易记录数组
$rows = get_group_list($ba_id);
foreach ($rows as $k=>$v){
    $rows[$k]['del'] = $v['is_del']==1 ? "运行中" : "关闭";
    $rows[$k]['flirt'] = $v['is_flirt']==1 ? "运行中" : "关闭";
}

// 返回数据做成
$rtn_ary = array();
//$rtn_ary['errcode'] = '0';
//$rtn_ary['errmsg'] = '';
//$rtn_ary['count'] = count($rows);
$rtn_ary['data'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


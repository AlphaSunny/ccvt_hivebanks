<?php

require_once '../../inc/common.php';
require_once 'db/bot.php';
require_once 'db/la_admin.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 群组列表 ==========================
GET参数
  token                用户token

返回
  errcode = 0     请求成功
  rows                 记录数组
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

// token
$token = get_arg_str('GET', 'token',128);

// 审核状态
$is_audit = get_arg_str('GET', 'is_audit');

//验证token
$la_id = la_user_check($token);

// 交易记录数组
$rows = get_group_list($is_audit);
foreach ($rows as $k=>$v){

    if ($v['is_audit']==1){
        $audit = "待审核";
        $del = "关闭";
    }elseif ($v['is_audit']==2){
        $audit = "审核成功";
        $del = $v['is_admin_del']==1 ? "运行中" : "关闭";
    }else{
        $del = "关闭";
        $audit = "审核未通过";
    }
    $rows[$k]['del'] = $del;
    $rows[$k]['audit'] = $audit;
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


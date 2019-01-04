<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 审核群(判断群成员是否达到100人以上) ==========================
GET参数
  us_id         us_id
  status        1:获取要审核的群,  2:审核群

返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$args = array('status');
chk_empty_args('GET', $args);

$status = get_arg_str('GET', 'status');

if ($status==1){
    //获取要审核的群
    $args = array('us_id');
    chk_empty_args('GET', $args);
    $us_id = get_arg_str('GET', 'us_id');
    $group_list = get_group_list($us_id);
    $rtn_ary = array();
    $rtn_ary['errcode'] = '0';
    $rtn_ary['group_list'] = $group_list;
    $rtn_str = json_encode($rtn_ary);
    php_end($rtn_str);
}elseif ($status==2){
    //审核群
    $args = array('group_id','count');
    chk_empty_args('GET', $args);
    $group_id = get_arg_str('GET', 'group_id');
    $count = get_arg_str('GET', 'count');
    $result = audit_group($group_id,$count);
    $rtn_ary = array();
    $rtn_ary['errcode'] = '0';
    $rtn_ary['errmsg'] = '';
    $rtn_str = json_encode($rtn_ary);
    php_end($rtn_str);
}

?>

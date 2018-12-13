<?php

require_once '../inc/common.php';
require_once 'db/bot.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 群组成员列表 ==========================
GET参数
  token                用户token
  status            0:所有 1:今日 2:昨天  3:3天内  4:七天内     发言数

返回
  errcode = 0     请求成功
  rows                 记录数组
*/

php_begin();
$args = array('token','group_id');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
//验证token
$us_id = check_token($token);

// 群组id
$group_id = get_arg_str('GET', 'group_id');
//判断查询的群是否属于当前用户
$result = check_us_group($us_id,$group_id);
if (!$result){
    exit_error('139','非法操作');
}

// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');

// status
$status = get_arg_str('GET', 'status');

// 群组id
$group_id = get_arg_str('GET', 'group_id');

// 获取总记录
$total = get_group_members_list_total($group_id);

// 交易记录数组
$rows = get_group_members_list($group_id,$status,$offset,$limit);

// 返回数据做成
$rtn_ary = array();
//$rtn_ary['errcode'] = '0';
//$rtn_ary['errmsg'] = '';
//$rtn_ary['count'] = count($rows);
$rtn_ary['data'] = $rows;
$rtn_ary['total'] = $total;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


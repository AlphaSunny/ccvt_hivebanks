<?php

require_once '../inc/common.php';
require_once 'db/us_base.php';
require_once 'db/log_us_transfer.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 用户给用户转账ccvt列表 ==========================
GET参数
  token                用户token
  limit                分页记录
  offset               分页偏移量
  type                 1:待处理    2:已处理
返回

说明
*/

php_begin();
$args = array('token','type');
chk_empty_args('GET', $args);

// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');
// type 1:待处理    2:已处理
$type = get_arg_str('GET', 'type');
// 用户token
$token = get_arg_str('GET', 'token');
//验证token
$us_id = check_token($token);

if ($type!=1 && $type!=2){
    exit_error("150","非法请求");
}

// 总记录数
$total = get_transfer_ccvt_total($us_id,$type);

//获取数据
$rows = get_transfer_ccvt_list($us_id,$offset,$limit,$type);;


// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['total'] = $total;
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

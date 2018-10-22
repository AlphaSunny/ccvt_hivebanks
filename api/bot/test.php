<?php

require_once '../inc/common.php';
require_once 'db/bot_bind.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 任务添加 ==========================
GET参数
  token                用户token

返回
  errcode = 0     请求成功
*/

php_begin();

$data['intime'] = time();
$row = test_add($data);
if (!$row){
    exit_error('109','添加失败');
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


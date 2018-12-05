<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
==========================  机器人登录二维码保存数据库 ==========================
GET参数
  nickname        string类型
  content          string
  send_time       datatime

返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

//$args = array('qrcode');
//chk_empty_args('GET', $args);

//二维码地址
$qr_code = get_arg_str('GET','qrcode');

//微信昵称
$bot_name = get_arg_str('GET','bot_name');

//用户id
$us_id = get_arg_str('GET','us_id');

//信息
$data['qrcode'] = $qr_code;
$data['bot_name'] = $bot_name;
$data['us_id'] = $us_id;
$data['ctime'] = time();

// 添加群组
$row = bot_qrcode($data);
if (!$row){
    exit_error('109','失败');
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);





?>

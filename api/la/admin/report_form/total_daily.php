<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/11/20
 * Time: 下午4:09
 */


php_begin();
$args = array("token",'day');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
$day = get_arg_str('GET', 'day', 128);

$key = Config::TOKEN_KEY;
// 获取token并解密
$des = new Des();
$decryption_code = $des -> decrypt($token, $key);
$now_time = time();
$code_conf =  explode(',',$decryption_code);
// 获取token中的需求信息
$user = $code_conf[0];
$timestamp = $code_conf[1];
if($timestamp < $now_time){
    exit_error('114','Token timeout please retrieve!');
}
//判断la是否存在
$row = get_la_by_user($user);
if(!$row){
    exit_error('112','用户不存在');
}
//每天的注册用户数

$reg_daily = totol_daily($day);

//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $reg_daily;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
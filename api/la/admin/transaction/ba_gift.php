<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/11/8
 * Time: 下午3:22
 */


require_once  "../../../inc/common.php";
require_once  "db/ba_base.php";
require_once "db/la_admin.php";


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取ba赠送列表 ==========================
GET参数
token                用户token
type                 赠送类型  1：注册赠送  2：邀请赠送  3：ba调账赠送   4:群聊奖励

返回
rows            信息数组
    amount      赠送数量
    tx_detail   奖励类型
    us_account  用户账号
    wechat      微信账号
    gift_time   赠送时间
说明

*/

php_begin();
$args = array('token','type');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
$type = get_arg_str('GET', 'type', 128);
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
    exit_error('120','用户不存在');
}

// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');

// 获取当前总记录
$total = ba_gift_total($type);

// 获取ba的赠送记录
$gift_rows = ba_gift($offset,$limit,$type);

//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['total'] = $total;
$rtn_ary['rows'] = $gift_rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


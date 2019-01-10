<?php

require_once '../inc/common.php';
require_once 'db/ca_base.php';
require_once 'db/ca_bind.php';
require_once 'db/ca_asset_account.php';
require_once "db/com_option_config.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 添加ca资产账户 ==========================
GET参数
    token                ca的token
    ca_channel           ca法定货币渠道
    card_nm              账户卡号
    name                 姓名
    idNum                身份证号
    pass_word_hash       密码hash
返回
  errcode = 0           请求成功
说明
*/

php_begin();
$args = array('token', 'ca_channel', 'card_nm', 'name', 'pass_word_hash');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
// 地址
$ca_channel = get_arg_str('GET', 'ca_channel');
$card_nm = get_arg_str('GET', 'card_nm');
$name = get_arg_str('GET', 'name');
$pass_word_hash = get_arg_str('GET', 'pass_word_hash');

//验证token
$ca_id = check_token($token);
$row = get_ca_by_id($ca_id);
if(!$row)
    exit_error('101','该用户不存在');

// 获取pass_word_hash
if(get_pass_word_hash($ca_id,'password_login') != $pass_word_hash)
    exit_error("102","密码错误");

//验证该channel存不存在
if (!ca_channel_exist_or_not($ca_channel))
    exit_error("122","la不支持此代理类型");

//整理插入db数据
$lgl_addressArr = array();
$lgl_addressArr["card_nm"] = $card_nm;
$lgl_addressArr["name"] = $name;
$lgn_type = 'account';
$utime = time().rand(1000, 9999);
$ctime = date('Y-m-d H:i:s');
$us_ip = get_ip();

//插入数据
$data_bind_pass['account_id'] = hash('md5',$ca_id . $lgn_type . $us_ip .  $utime . $ctime);
$data_bind_pass['ca_id'] = $ca_id;
$data_bind_pass['ca_channel'] = $ca_channel;
$data_bind_pass['lgl_address'] = json_encode($lgl_addressArr,JSON_UNESCAPED_UNICODE);
$data_bind_pass['use_flag'] = "1";
$data_bind_pass['ctime'] = date("Y-m-d H:i:s");

//判断该渠道是否已经存在
if(sel_ca_asset_account_by_channel($ca_id,$ca_channel) )
    exit_error('103',"该渠道已经有银行卡号");

//插入
if (!ins_ca_asset_account_info($data_bind_pass)) {
    exit_error('101',"设置失败");
}

//成功后返回数据
$rtn_ary = array();
exit_ok();


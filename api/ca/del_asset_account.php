<?php



header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

require_once "../inc/common.php";
require_once "db/com_option_config.php";
require_once  "db/ca_base.php";
require_once "db/ca_asset_account.php";

php_begin();
$args = array("token", "channel");
chk_empty_args('GET', $args);

//验证登陆
$token = get_arg_str('GET', 'token', 128);
$channel = get_arg_str('GET', 'ca_channel', 30);
$ca_id = check_token($token);
$row = get_ca_base_info($ca_id);
if(!$row){
    exit_error('112','用户不存在');
}

//删除登陆
$row = select_channel_by_id_channel($channel, $ca_id);
if(!$row)
    exit_error('114', '并不存在这个渠道');
if($row['use_flag'] == '9')
    exit_error('115','这个渠道已经被删除');

//更新
if(!del_ca_asset_account_by_account_id($row['account_id']))
    exit_error('123', '更新失败');

//返回
$rtn_rows = get_ca_asset_account_ca_id($ca_id);
$data = array();
$data['errcode'] = '0';
$data['errmsg'] = '';
$data['rows'] = $rtn_rows;
$json = json_encode($data);
php_end($json);

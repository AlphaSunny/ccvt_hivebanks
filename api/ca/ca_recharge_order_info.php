<?php
/**
 * Created by IntelliJ IDEA.
 * User: pool
 * Date: 2019/1/15
 * Time: 11:27 AM
 */

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

require_once ('db/ca_asset_account.php');


php_begin();
$args = array('token', 'ca_id', 'ca_channel');

chk_empty_args('GET', $args);

//获取参数
$token = get_arg_str('GET', 'token', 128);
$ca_id = get_arg_str('GET', 'ca_id', 100);
$ca_channel = get_arg_str('GET', 'ca_channel', 30);

//验证token
$us_id = check_token($token);

//获得渠道
$row = sel_ca_asset_account_by_channel($ca_id, $ca_channel);
if(!$row)
    exit_error('115', '错误');
$data = $array();
$data['errcode'] = '0';
$data['errmsg'] = '';
$data['rows'] = $row;
$json = json_encode($data);
php_end($json);

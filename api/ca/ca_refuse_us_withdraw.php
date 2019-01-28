<?php
/**
 * Created by IntelliJ IDEA.
 * User: pool
 * Date: 2019/1/15
 * Time: 11:27 AM
 */

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

require_once ('../inc/common.php');
require_once ('db/ca_asset_account.php');

php_begin();
$args = array('token', 'tx_hash');

chk_empty_args('GET', $args);

$token = get_arg_str('GET', 'token', 150);
$tx_hash = get_arg_str('GET', 'tx_hash', 200);

$ca_id = check_token($token);
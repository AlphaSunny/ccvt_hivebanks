<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/12/6
 * Time: 下午3:24
 */

ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);


require_once '../inc/common.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

define('UNIT','100000000');
define('FLAG',10);
define('BA_ID','6C69520E-E454-127B-F474-452E65A3EE75');
lock_auto();


function lock_auto(){

    die('what do you want?');
    $db = new DB_COM();
    $sql = 'select phone,amount from big_account_lock ';
    $db->query($sql);
    $bInfo = $db->fetchAll();
    $flag = 1;
    foreach($bInfo as $k=>$v)
    {
        if($v['phone'] != '13735891094')
            continue;
        $tmp_phone = $v['phone'];
        $tmp_amount = $v['amount'];
        $sql = "select us_id from us_bind  where SUBSTR(bind_info,4,100) = {$tmp_phone}";
        $db->query($sql);
        $res = $db->fetchRow();
        if($res){
            if(!(ba_cut($tmp_amount)&&us_add($tmp_amount,$res['us_id'])&&log_com_base($res['us_id'],$tmp_amount)
            &&log_com_transfer($res['us_id'],$tmp_amount)&&log_info($tmp_phone)))
                die($flag.'failed');
        }
        $flag ++;
        die('XMRSB');
    }
    die($flag.'success');
}
//200000000000000000
function ba_cut($amount){
    $db = new DB_COM();
    $sql = "update ba_base set base_amount = base_amount - $amount*".UNIT." where  ba_id= '6C69520E-E454-127B-F474-452E65A3EE75'";
    $db->query($sql);
    $res = $db->affectedRows();
    if($res)
    {
        return true;
    }
    die('ba_cut');
    return false;
}
function us_add($amount,$us_id){
    $db = new DB_COM();
    $sql = "update us_base set lock_amount = lock_amount+ $amount * ".UNIT." where us_id='{$us_id}'";
    $db->query($sql);
    if($db->affectedRows())
        return true;
    die('us_add');
    return false;

}
function log_info($phone){
    $db = new DB_COM();
    $sql = "update big_account_lock set is_lock = 1 where phone = $phone";
    $db->query($sql);
    if($db->affectedRows())
        return true;
    die('log_info');
    return false;
}

function log_com_base($us_id,$amount){
    $db = new DB_COM();
    $data = array();
    $us_type = 'big_us_lock';
    $ctime = date('Y-m-d H:i:s');

    $data['hash_id'] = hash('md5', BA_ID . $us_type . get_ip() . mt() . rand(1000, 9999) . $ctime);
    $data['tx_id'] = hash('md5', BA_ID  . 'phone' . get_ip() . mt() . date('Y-m-d H:i:s'));;
    $data['prvs_hash'] = get_recharge_pre_hash(BA_ID);

    $data['prvs_hash'] = $data['prvs_hash'] == 0 ? $data['hash_id'] : $data['prvs_hash'];
    $data['debit_id'] = $us_id;
    $data['credit_id']= BA_ID;
    $data['tx_type'] = 'big_us_lock';
    $data["tx_amount"] = $amount*UNIT;
    $data["credit_balance"] = get_ba_account(BA_ID)-($amount*UNIT);
    $data["utime"] = time();
    $data["ctime"] = $ctime;
    $sql = $db->sqlInsert("com_base_balance", $data);

    $uata = array();
    $uata['hash_id'] = hash('md5', $us_id . $us_type . get_ip() . mt() . rand(1000, 9999) . $ctime);
    $uata['tx_id'] = hash('md5', BA_ID  . 'phone' . get_ip() . mt() . date('Y-m-d H:i:s'));;
    $uata['prvs_hash'] = get_recharge_pre_hash($us_id);
    $uata['prvs_hash'] = $uata['prvs_hash'] == 0 ? $uata['hash_id'] : $uata['prvs_hash'];

    $uata['credit_id'] = $us_id;
    $uata['debit_id']= BA_ID;
    $uata['tx_type'] = 'big_us_lock';
    $uata["tx_amount"] = $amount*UNIT;
    $uata["credit_balance"] = get_us_account($us_id)+($amount*UNIT);
    $uata["utime"] = time();
    $uata["ctime"] = $ctime;
    $uql = $db->sqlInsert("com_base_balance", $uata);

    if($db->query($sql)&&$db->query($uql))
        return true;
    die('com_base');
    return false;


}

function log_com_transfer($us_id,$amount){

    $db = new DB_COM();
    $data['hash_id'] = hash('md5', BA_ID . FLAG . get_ip() . mt() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash(BA_ID);
    $data['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
    $data['credit_id'] = BA_ID;
    $data['debit_id'] = $us_id;
    $data['tx_amount'] = $amount*UNIT;
    $data['credit_balance'] = get_ba_account(BA_ID)-($amount*UNIT);
    $data['tx_hash'] = hash('md5', BA_ID . FLAG . get_ip() . mt() . date('Y-m-d H:i:s'));
    $data['flag'] = FLAG;
    $data['transfer_type'] = 'ba-us';
    $data['transfer_state'] = 1;
    $data['tx_detail'] = '分配计划';
    $data['give_or_receive'] = 1;
    $data['ctime'] = time();
    $data['utime'] = date('Y-m-d H:i:s',time());
    $sql = $db->sqlInsert("com_transfer_request", $data);

    $dat['hash_id'] = hash('md5', $us_id . FLAG . get_ip() . mt() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($us_id);
    $dat['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
    $dat['credit_id'] = $us_id;
    $dat['debit_id'] = BA_ID;
    $dat['tx_amount'] = $amount*UNIT;
    $dat['credit_balance'] = get_us_account($us_id)+$dat['tx_amount'];
    $dat['tx_hash'] = hash('md5', $us_id . FLAG . get_ip() . mt() . date('Y-m-d H:i:s'));
    $dat['flag'] = FLAG;
    $dat['transfer_type'] = 'ba-us';
    $dat['transfer_state'] = 1;
    $dat['tx_detail'] = '分配计划';
    $dat['give_or_receive'] = 2;
    $dat['ctime'] = time();
    $dat['utime'] = date('Y-m-d H:i:s',time());
    $uql = $db->sqlInsert("com_transfer_request", $dat);

    if($db->query($sql)&&$db->query($uql))
        return true;
    die('com_transfer');
    return false;

}



//======================================
// 函数: 获取充值的前置hash
// 参数: ba_id                 baID
// 返回: hash_id               前置hashid
//======================================
function  get_recharge_pre_hash($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}' ORDER BY  tx_count DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}



//获取ba余额
function get_ba_account($ba_id){
    $db = new DB_COM();
    $sql = "select base_amount from ba_base WHERE ba_id='{$ba_id}' limit 1";
    $db->query($sql);
    $base_amount = $db -> getField($sql,'base_amount');
    if($base_amount == null)
        return 0;
    return $base_amount;
}



//======================================
// 函数: 获取上传交易hash
//======================================
function get_transfer_pre_hash($credit_id){
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_transfer_request WHERE credit_id = '{$credit_id}' ORDER BY  tx_count DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}


//获取用户余额
function get_us_account($us_id){
    $db = new DB_COM();
    $sql = "select (base_amount+lock_amount) as base_amount from us_base WHERE us_id='{$us_id}' limit 1";
    $db->query($sql);
    $base_amount = $db -> getField($sql,'base_amount');
    if($base_amount == null)
        return 0;
    return $base_amount;
}


function mt(){

    $time = explode (" ", microtime () );
    $time = $time [1] . ($time [0] * 1000);
    $time2 = explode ( ".", $time );
    $time = $time2 [0];
    return $time;
}

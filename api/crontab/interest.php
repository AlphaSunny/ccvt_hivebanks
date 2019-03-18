<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/12/11
 * Time: 上午9:43
 */


ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);
die('fuck off');
require_once '../inc/common.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

$d=mktime(20, 00, 00, 12, 28, 2018);
//var_dump($d);die;
define('BA_ID','6C69520E-E454-127B-F474-452E65A3EE75');
define('FLAG','11');
define('RATE',0.01);
define('UNIT',100000000);
define('CTIME',date('Y-m-d H:i:s',$d));
define('UTIME',$d);

interest_auto();

function interest_auto(){
    $db = new DB_COM();
    //获取利息用户
    $data = us_get();
    $flag = 1;
    //发放利息===BA扣除利息====US增加利息====利息记录表====COMBASE记录表====COMTRANSFER记录表
    foreach ($data as $k=>$v)
    {
        $phone = $v['phone'];
        $amount = $v['amount'];
        $sql = "select us_id from us_bind  where SUBSTR(bind_info,4,100) = {$phone}";
        echo '2';
        $db->query($sql);
        $res = $db->fetchRow();
        $us_id = $res['us_id'];

        if(!(ba_cut($amount)&&log_base($amount,$us_id)&&log_transfer($amount,$us_id)&&us_add($amount,$us_id)&&log_interest($amount,$us_id)))
            die('failed'.$flag);
        $flag++;
    }
    die('success'.$flag);
}

function us_get(){
    $db = new DB_COM();
    $sql = "select * from big_account_lock";
    echo '1';
    $res = $db->query($sql);
    $res = $db->fetchAll();
    if($res)
        return $res;
    die('us_get');

}

function ba_cut($amount){
    $db = new DB_COM();
    $sql = "update ba_base set base_amount = base_amount - $amount * 0.01 *".UNIT." where  ba_id= '6C69520E-E454-127B-F474-452E65A3EE75'";
    echo '1';
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
    $sql = "update us_base set base_amount = base_amount+ $amount * 0.01 *".UNIT." where us_id='{$us_id}'";
    $db->query($sql);
    if($db->affectedRows())
        return true;
    die('us_add');
    return false;
}

function log_interest($amount,$us_id){
    $db = new DB_COM();
    $data = array();
    $data['amount']  = $amount*UNIT*RATE;
    $data['ctime'] = CTIME;
    $data['us_id'] = $us_id;
    $data['log_id'] = get_guid();
    $data['interest_type'] = 'big_us_interest';
    $sql = $db->sqlInsert('big_account_interest',$data);echo '1';
    if(!($db->query($sql)))
        die('log_interest');
    return true;

}

function log_base($amount,$us_id){
    $db = new DB_COM();
    $data = array();
    $us_type = 'big_us_interest';
    $ctime = date('Y-m-d H:i:s');

    $data['hash_id'] = hash('md5', BA_ID . $us_type . get_ip() . mt() . rand(1000, 9999) . $ctime);
    $data['tx_id'] = hash('md5', BA_ID  . 'phone' . get_ip() . mt() . date('Y-m-d H:i:s'));;
    $data['prvs_hash'] = get_recharge_pre_hash(BA_ID);

    $data['prvs_hash'] = $data['prvs_hash'] == 0 ? $data['hash_id'] : $data['prvs_hash'];
    $data['debit_id'] = $us_id;
    $data['credit_id']= BA_ID;
    $data['tx_type'] = 'big_us_interest';
    $data["tx_amount"] = $amount*UNIT*RATE;
    $data["credit_balance"] = get_ba_account(BA_ID)-($amount*UNIT*RATE);
    $data["utime"] = UTIME;
    $data["ctime"] = CTIME;
    $sql = $db->sqlInsert("com_base_balance", $data);
    echo '1';
    $uata = array();
    $uata['hash_id'] = hash('md5', $us_id . $us_type . get_ip() . mt() . rand(1000, 9999) . $ctime);
    $uata['tx_id'] = hash('md5', BA_ID  . 'phone' . get_ip() . mt() . date('Y-m-d H:i:s'));;
    $uata['prvs_hash'] = get_recharge_pre_hash($us_id);
    $uata['prvs_hash'] = $uata['prvs_hash'] == 0 ? $uata['hash_id'] : $uata['prvs_hash'];

    $uata['credit_id'] = $us_id;
    $uata['debit_id']= BA_ID;
    $uata['tx_type'] = 'big_us_interest';
    $uata["tx_amount"] = $amount*UNIT*RATE;
    $uata["credit_balance"] = get_us_account($us_id)+($amount*UNIT*RATE);

    if($us_id == '8D5664EC-2722-B70B-7DF7-80EFE8118CFD')
    {
//        var_dump($uata["credit_balance"]);die;
    }
    $uata["utime"] = UTIME;
    $uata["ctime"] = CTIME;
    $uql = $db->sqlInsert("com_base_balance", $uata);
    echo '1';
    if($db->query($sql)&&$db->query($uql))
        return true;
    die('com_base');
    return false;
}
function log_transfer($amount,$us_id){
    $db = new DB_COM();
    $data['hash_id'] = hash('md5', BA_ID . FLAG . get_ip() . mt() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash(BA_ID);
    $data['prvs_hash'] = $prvs_hash == 0 ? $data['hash_id'] : $prvs_hash;
    $data['credit_id'] = BA_ID;
    $data['debit_id'] = $us_id;
    $data['tx_amount'] = $amount*UNIT*RATE;
    $data['credit_balance'] = get_ba_account(BA_ID)-($amount*UNIT*RATE);
    $data['tx_hash'] = hash('md5', BA_ID . FLAG . get_ip() . mt() . date('Y-m-d H:i:s'));
    $data['flag'] = FLAG;
    $data['transfer_type'] = 'ba-us';
    $data['transfer_state'] = 1;
    $data['tx_detail'] = '锁仓利息';
    $data['give_or_receive'] = 1;
    $data['ctime'] = UTIME;
    $data['utime'] = CTIME;
    $sql = $db->sqlInsert("com_transfer_request", $data);
    echo '8';
    $dat['hash_id'] = hash('md5', $us_id . FLAG . get_ip() . mt() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($us_id);
    $dat['prvs_hash'] = $prvs_hash == 0 ? $dat['hash_id'] : $prvs_hash;
    $dat['credit_id'] = $us_id;
    $dat['debit_id'] = BA_ID;
    $dat['tx_amount'] = $amount*UNIT*RATE;
    $dat['credit_balance'] = get_us_account($us_id)+$dat['tx_amount'];
    $dat['tx_hash'] = hash('md5', $us_id . FLAG . get_ip() . mt() . date('Y-m-d H:i:s'));
    $dat['flag'] = FLAG;
    $dat['transfer_type'] = 'ba-us';
    $dat['transfer_state'] = 1;
    $dat['tx_detail'] = '锁仓利息';
    $dat['give_or_receive'] = 2;
    $dat['ctime'] = UTIME;
    $dat['utime'] = CTIME;
    $uql = $db->sqlInsert("com_transfer_request", $dat);
//    var_dump($data);
//    var_dump($db->query($uql));die;
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
    $sql = "select sum(base_amount+lock_amount) as base_amount from us_base WHERE us_id='{$us_id}' limit 1";
    $db->query($sql);
    $base_amount = $db -> getField($sql,'base_amount');
//    var_dump($base_amount);
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

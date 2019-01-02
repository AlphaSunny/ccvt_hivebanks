<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2019/1/2
 * Time: 下午3:18
 */


ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);
//die('fuck off');
require_once '../inc/common.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

set_time_limit(0);
define('BA_ID','6C69520E-E454-127B-F474-452E65A3EE75');
define('FLAG','12');
define('UNIT',100000000);
define('CTIME',date('Y-m-d H:i:s',time()));
define('UTIME',time());
//intlcal_set_time_zone('Asia\shanghai');
reback();
function reback()
{
    $flag = 1;
    $db = new DB_COM();
    $day = date('Y-m-d',strtotime('-1 day'));var_dump($day);
    $sql = "select tx_amount/100000000 as amount,credit_id as us_id from com_base_balance where tx_amount/100000000 <= 20 and tx_type = 'give_like' and substr(ctime,1,10) = '$day' and debit_id ='50D2910C-6C38-344F-9D30-3289F945C2A6' order by ctime desc";
    $db->query($sql);
    $res_one = $db->fetchAll();var_dump($res_one);
    $counter = array();//前n次点赞/踩总和小于等于100
    foreach ($res_one as $k => $v)
    {

        $amount = $v['amount'];
        $us_id = $v['us_id'];
        if(isset($counter[$us_id])){
            $counter[$us_id] += $amount;
        }else{
            $counter[$us_id] = $v['amount'];
        }

        if($counter[$us_id]>100){
            $counter[$us_id] -= $amount;
            continue;
        }


        if(!(ba_cut($amount)&&log_base($amount,$us_id)&&log_transfer($amount,$us_id)&&us_add($amount,$us_id)))
            die('failed'.$flag);
        $flag++;
        var_dump($flag);
//        var_dump($counter);
    }
}



function us_add($amount,$us_id){
    $db = new DB_COM();
    $sql = "update us_base set base_amount = base_amount+ $amount  *".UNIT." where us_id='{$us_id}'";
    $db->query($sql);
    if($db->affectedRows())
        return true;
    die('us_add');
    return false;
}

function ba_cut($amount){
    $db = new DB_COM();
    $sql = "update ba_base set base_amount = base_amount - $amount * ".UNIT." where  ba_id= '6C69520E-E454-127B-F474-452E65A3EE75'";
//    echo '1';
    $db->query($sql);
    $res = $db->affectedRows();
    if($res)
    {
        return true;
    }
    die('ba_cut');
    return false;
}
function log_base($amount,$us_id){
    $db = new DB_COM();
    $data = array();
    $us_type = 'give_like_back';
    $ctime = date('Y-m-d H:i:s');

    $data['hash_id'] = hash('md5', BA_ID . $us_type . get_ip() . mt() . rand(1000, 9999) . $ctime);
    $data['tx_id'] = hash('md5', BA_ID  . 'phone' . get_ip() . mt() . date('Y-m-d H:i:s'));;
    $data['prvs_hash'] = get_recharge_pre_hash(BA_ID);

    $data['prvs_hash'] = $data['prvs_hash'] == 0 ? $data['hash_id'] : $data['prvs_hash'];
    $data['debit_id'] = $us_id;
    $data['credit_id']= BA_ID;
    $data['tx_type'] = 'give_like_back';
    $data["tx_amount"] = $amount*UNIT;
    $data["credit_balance"] = get_ba_account(BA_ID)-($amount*UNIT);
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
    $uata['tx_type'] = 'give_like_back';
    $uata["tx_amount"] = $amount*UNIT;
    $uata["credit_balance"] = get_us_account($us_id)+($amount*UNIT);

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
    $data['tx_amount'] = $amount*UNIT;
    $data['credit_balance'] = get_ba_account(BA_ID)-($amount*UNIT);
    $data['tx_hash'] = hash('md5', BA_ID . FLAG . get_ip() . mt() . date('Y-m-d H:i:s'));
    $data['flag'] = FLAG;
    $data['transfer_type'] = 'ba-us';
    $data['transfer_state'] = 1;
    $data['tx_detail'] = '点赞返还';
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
    $dat['tx_amount'] = $amount*UNIT;
    $dat['credit_balance'] = get_us_account($us_id)+$dat['tx_amount'];
    $dat['tx_hash'] = hash('md5', $us_id . FLAG . get_ip() . mt() . date('Y-m-d H:i:s'));
    $dat['flag'] = FLAG;
    $dat['transfer_type'] = 'ba-us';
    $dat['transfer_state'] = 1;
    $dat['tx_detail'] = '点赞返还';
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
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}' and tx_type = 'ba_send' ORDER BY  ctime DESC LIMIT 1";

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
    $sql = "SELECT hash_id FROM com_transfer_request WHERE credit_id = '{$credit_id}' ORDER BY  ctime DESC LIMIT 1";
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


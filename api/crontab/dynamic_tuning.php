<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2019/1/3
 * Time: 下午2:40
 */
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

require_once '../inc/common.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");
die('Who is Q++?');
//
//define('GONE_STAFF',array('15248165523',
//    '13816129726')
//);

define('UNIT',100000000);
define('FLAG',15);

define('BA_ID','6C69520E-E454-127B-F474-452E65A3EE75');
dynamic_tuning();


function dynamic_tuning()
{
    //减掉离职员工所扣金额
    staff_cut();

    //增加当月员工金额
//    staff_add();
}

function staff_cut()
{
    $db = new DB_COM();
    $sql = "select base_amount from ba_base";
    $db->query($sql);
    var_dump($db->fetchAll());

    if(lock_cut()) {
        $sql = "select base_amount from ba_base";
        $db->query($sql);
        var_dump($db->fetchAll());

        staff_add();
    }
}

//========================
function lock_cut()
{
//    $staff = array(array('phone'=>'15248165523','amount'=>7000000),
//        array('phone'=>'13816129726','amount'=>7500000)
//    );
    $db = new DB_COM();
    $sql = "select * from big_account_lock where phone in ('15248165523','13816129726')";
    $db->query($sql);
    $staff = $db->fetchAll();
    foreach ($staff as $k => $v)
    {
        $phone = $v['phone'];
        if($v['phone']  == '15248165523')
        {
            $sql = "update big_account_lock set amount = amount-7000000 where phone = '$phone'";
            $amount = 7000000;
        }
        else{
            $sql = "update big_account_lock set amount = amount-7500000 where phone = '$phone'";
            $amount = 7500000;
        }
        $db->query($sql);

        if(!$db->affectedRows())
            die('lock_cut----'.$v);

        if(!ba_add($amount))
            die('ba_add'.$v['phone']);
        if(!cut_log_com_base($v['us_id'],$amount))
            die('log_com_base'.$v['phone']);
        if(!cut_log_com_transfer($v['us_id'],$amount))
            die('log_com_transfer'.$v['phone']);
        if(!us_base_cut($v['us_id'],$amount))
            die('us_base_cut'.$v['phone']);
    }
    return true;
}

function us_base_cut($us_id,$amount){
    $db = new DB_COM();
    $sql = "update us_base set lock_amount = lock_amount- $amount * ".UNIT." where us_id='{$us_id}'";
    $db->query($sql);
    if($db->affectedRows())
        return true;
    die('us_add');
    return false;

}
function ba_add($amount)
{
    $db = new DB_COM();
    $sql = "update ba_base set base_amount = base_amount + $amount*".UNIT." where  ba_id= '6C69520E-E454-127B-F474-452E65A3EE75'";
    $db->query($sql);
    $res = $db->affectedRows();
    if($res)
    {
        return true;
    }
//    die('ba_cut');
    return false;
}

function cut_log_com_base($us_id,$amount){
    $db = new DB_COM();
    $data = array();
    $us_type = 'gone_staff';
    $ctime = date('Y-m-d H:i:s');

    $data['hash_id'] = hash('md5', BA_ID . $us_type . get_ip() . mt() . rand(1000, 9999) . $ctime);
    $data['tx_id'] = hash('md5', BA_ID  . 'phone' . get_ip() . mt() . date('Y-m-d H:i:s'));;
    $data['prvs_hash'] = get_recharge_pre_hash(BA_ID);

    $data['prvs_hash'] = $data['prvs_hash'] === 0 ? hash('md5',BA_ID) : $data['prvs_hash'];
    $data['debit_id'] = $us_id;
    $data['credit_id']= BA_ID;
    $data['tx_type'] = 'gone_staff';
    $data["tx_amount"] = $amount*UNIT;
    $data["credit_balance"] = get_ba_account(BA_ID)+($amount*UNIT);
    $data["utime"] = time();
    $data["ctime"] = $ctime;
    $sql = $db->sqlInsert("com_base_balance", $data);

    $uata = array();
    $uata['hash_id'] = hash('md5', $us_id . $us_type . get_ip() . mt() . rand(1000, 9999) . $ctime);
    $uata['tx_id'] = hash('md5', BA_ID  . 'phone' . get_ip() . mt() . date('Y-m-d H:i:s'));;
    $uata['prvs_hash'] = get_recharge_pre_hash($us_id);
    $uata['prvs_hash'] = $uata['prvs_hash'] === 0 ? hash('md5',$us_id) : $uata['prvs_hash'];

    $uata['credit_id'] = $us_id;
    $uata['debit_id']= BA_ID;
    $uata['tx_type'] = 'gone_staff';
    $uata["tx_amount"] = $amount*UNIT;
    $uata["credit_balance"] = get_us_account($us_id)-($amount*UNIT);
    $uata["utime"] = time();
    $uata["ctime"] = $ctime;
    $uql = $db->sqlInsert("com_base_balance", $uata);

    if($db->query($sql)&&$db->query($uql))
        return true;
    die('com_base');
    return false;


}

function cut_log_com_transfer($us_id,$amount){

    $db = new DB_COM();
    $data['hash_id'] = hash('md5', BA_ID . FLAG . get_ip() . mt() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash(BA_ID);
    $data['prvs_hash'] = $prvs_hash === 0 ? hash('md5',BA_ID) : $prvs_hash;
    $data['credit_id'] = BA_ID;
    $data['debit_id'] = $us_id;
    $data['tx_amount'] = $amount*UNIT;
    $data['credit_balance'] = get_ba_account(BA_ID)+($amount*UNIT);
    $data['tx_hash'] = hash('md5', BA_ID . FLAG . get_ip() . mt() . date('Y-m-d H:i:s'));
    $data['flag'] = FLAG;
    $data['transfer_type'] = 'us-ba';
    $data['transfer_state'] = 1;
    $data['tx_detail'] = '离职回收';
    $data['give_or_receive'] = 2;
    $data['ctime'] = time();
    $data['utime'] = date('Y-m-d H:i:s',time());
    $sql = $db->sqlInsert("com_transfer_request", $data);

    $dat['hash_id'] = hash('md5', $us_id . FLAG . get_ip() . mt() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($us_id);
    $dat['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$us_id) : $prvs_hash;
    $dat['credit_id'] = $us_id;
    $dat['debit_id'] = BA_ID;
    $dat['tx_amount'] = $amount*UNIT;
    $dat['credit_balance'] = get_us_account($us_id)-$dat['tx_amount'];
    $dat['tx_hash'] = hash('md5', $us_id . FLAG . get_ip() . mt() . date('Y-m-d H:i:s'));
    $dat['flag'] = FLAG;
    $dat['transfer_type'] = 'us-ba';
    $dat['transfer_state'] = 1;
    $dat['tx_detail'] = '离职回收';
    $dat['give_or_receive'] = 1;
    $dat['ctime'] = time();
    $dat['utime'] = date('Y-m-d H:i:s',time());
    $uql = $db->sqlInsert("com_transfer_request", $dat);

    if($db->query($sql)&&$db->query($uql))
        return true;
    die('com_transfer');
    return false;

}

//===============================
//===== =======   ======   ======
//==== = ====== === ==== === ====
//=== === ===== ==== === ==== ===
//==       ==== ==== === ==== ===
//= ======= === ==== === == =====
// ========= ==    =====   ======
//===============================
//===============================
//===============================


function staff_add()
{
    lock_add();
//    ba_cut();
//    log_com_base();
//    log_com_transfer();
//    us_base_add();
}

function lock_add(){
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
        $db->query($sql);
        $res = $db->fetchRow();
        $us_id = $res['us_id'];

        if(!(ba_cut($amount)&&add_log_com_base($us_id,$amount)&&add_log_transfer($us_id,$amount)&&us_add($amount,$us_id)&&log_lock($phone,$amount)))
            die('failed'.$flag);
        $flag++;
    }
    $sql = "select base_amount from ba_base";
    $db->query($sql);
    var_dump($db->fetchAll());

    die('success'.$flag);
}

function us_get(){

    return [
        ['phone'=>18137802080,'amount'=>11000000],//edwin
        ['phone'=>18321709102,'amount'=>8000000],//bruce
        ['phone'=>15248165523,'amount'=>7000000],//lilian
        ['phone'=>13816129726,'amount'=>2000000],//lvy
        ['phone'=>15601607210,'amount'=>10000000],//alan
        ['phone'=>15221563385,'amount'=>11000000],//sunny
        ['phone'=>15801075991,'amount'=>11000000],//gavin
        ['phone'=>15988394267,'amount'=>6000000],//karen
        ['phone'=>13901602243,'amount'=>9000000],//chan
    ];

}

function ba_cut($amount){
    $db = new DB_COM();
    $sql = "update ba_base set base_amount = base_amount - $amount *".UNIT." where  ba_id= '6C69520E-E454-127B-F474-452E65A3EE75'";
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
    $sql = "update us_base set lock_amount = lock_amount+ $amount *".UNIT." where us_id='{$us_id}'";
    $db->query($sql);
    if($db->affectedRows())
        return true;
    die('us_add');
    return false;
}


function log_lock($phone,$amount){
    $db = new DB_COM();
    $sql = "update big_account_lock set amount = amount+$amount  where phone = $phone";
    $db->query($sql);
    if($db->affectedRows())
        return true;
    die('log_info');
    return false;
}

function add_log_com_base($us_id,$amount){
    $db = new DB_COM();
    $data = array();
    $us_type = 'big_us_lock';
    $ctime = date('Y-m-d H:i:s');

    $data['hash_id'] = hash('md5', BA_ID . $us_type . get_ip() . mt() . rand(1000, 9999) . $ctime);
    $data['tx_id'] = hash('md5', BA_ID  . 'phone' . get_ip() . mt() . date('Y-m-d H:i:s'));;
    $data['prvs_hash'] = get_recharge_pre_hash(BA_ID);

    $data['prvs_hash'] = $data['prvs_hash'] === 0 ? hash('md5',BA_ID) : $data['prvs_hash'];
    $data['debit_id'] = $us_id;
    $data['credit_id']= BA_ID;
    $data['tx_type'] = 'dynamic_tuning';
    $data["tx_amount"] = $amount*UNIT;
    $data["credit_balance"] = get_ba_account(BA_ID)-($amount*UNIT);
    $data["utime"] = time();
    $data["ctime"] = $ctime;
    $sql = $db->sqlInsert("com_base_balance", $data);

    $uata = array();
    $uata['hash_id'] = hash('md5', $us_id . $us_type . get_ip() . mt() . rand(1000, 9999) . $ctime);
    $uata['tx_id'] = hash('md5', BA_ID  . 'phone' . get_ip() . mt() . date('Y-m-d H:i:s'));;
    $uata['prvs_hash'] = get_recharge_pre_hash($us_id);
    $uata['prvs_hash'] = $uata['prvs_hash'] === 0 ? hash('md5',$us_id) : $uata['prvs_hash'];

    $uata['credit_id'] = $us_id;
    $uata['debit_id']= BA_ID;
    $uata['tx_type'] = 'dynamic_tuning';
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

function add_log_transfer($us_id,$amount){

    $db = new DB_COM();
    $data['hash_id'] = hash('md5', BA_ID . FLAG . get_ip() . mt() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash(BA_ID);
    $data['prvs_hash'] = $prvs_hash === 0 ? hash('md5',BA_ID) : $prvs_hash;
    $data['credit_id'] = BA_ID;
    $data['debit_id'] = $us_id;
    $data['tx_amount'] = $amount*UNIT;
    $data['credit_balance'] = get_ba_account(BA_ID)-($amount*UNIT);
    $data['tx_hash'] = hash('md5', BA_ID . FLAG . get_ip() . mt() . date('Y-m-d H:i:s'));
    $data['flag'] = FLAG;
    $data['transfer_type'] = 'ba-us';
    $data['transfer_state'] = 1;
    $data['tx_detail'] = '员工动态调整';
    $data['give_or_receive'] = 1;
    $data['ctime'] = time();
    $data['utime'] = date('Y-m-d H:i:s',time());
    $sql = $db->sqlInsert("com_transfer_request", $data);

    $dat['hash_id'] = hash('md5', $us_id . FLAG . get_ip() . mt() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_transfer_pre_hash($us_id);
    $dat['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$us_id) : $prvs_hash;
    $dat['credit_id'] = $us_id;
    $dat['debit_id'] = BA_ID;
    $dat['tx_amount'] = $amount*UNIT;
    $dat['credit_balance'] = get_us_account($us_id)+$dat['tx_amount'];
    $dat['tx_hash'] = hash('md5', $us_id . FLAG . get_ip() . mt() . date('Y-m-d H:i:s'));
    $dat['flag'] = FLAG;
    $dat['transfer_type'] = 'ba-us';
    $dat['transfer_state'] = 1;
    $dat['tx_detail'] = '员工动态调整';
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


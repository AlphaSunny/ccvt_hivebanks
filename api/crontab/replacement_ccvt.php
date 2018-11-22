<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);


$db = new DB_COM();



$sql = "select b.us_id,b.ctime,b.`bind_info`,u.`us_nm`,u.`us_account`,u.`base_amount`/100000000 as base_amount from us_bind as b left join us_base as u on b.us_id=u.us_id where 
b.`bind_name`='cellphone' 
and b.`bind_info` in ('86-13901602243','86-15988394267','86-15801075991','86-15221563385','86-15601607210','86-13816129726',
'86-15248165523','86-18321709102','86-18137802080','86-13611900990','86-18930349573','86-13917403009','86-18647072738','86-13564242227')";

$db->query($sql);
$rows = $db->fetchAll();
if ($rows){
    foreach ($rows as $k=>$v){
        if ($v['base_amount']<1000){
            send_to_us_ccvt($v['us_id'],'reg_send','1000');
        }
    }
}

echo "ok";


//======================================
// 函数: 注册创建用户时给送糖果(ccvt)
// 参数: data        信息数组
// 返回: true         创建成功
//       false        创建失败
//======================================
function send_to_us_ccvt($us_id,$type,$money)
{
    $db = new DB_COM();
    //送币
    $unit = get_la_base_unit();
    $sql = "update us_base set base_amount=base_amount+'{$money}'*'{$unit}' WHERE us_id='{$us_id}'";
    $db -> query($sql);
    if (!$db->affectedRows()){
        return false;
    }

    //ba减钱
    $sql = "select * from ba_base ORDER BY ctime asc limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();

    $sql = "update ba_base set base_amount=base_amount-'{$money}'*'{$unit}' WHERE ba_id='{$rows['ba_id']}'";
    $db -> query($sql);
    if (!$db->affectedRows()){
        return false;
    }

    //增币记录
    $d['re_id'] = get_guid();
    $d['ba_id'] = $rows['ba_id'];
    $d['num'] = $money;
    $d['send_time'] = date('Y-m-d H:i:s',time());
    $d['create_time'] = time();
    $lgn_type = 'phone';
    $d['tx_hash'] = hash('md5', $rows['ba_id'] . $lgn_type . get_ip() . time() . date('Y-m-d H:i:s'));
    $d['us_id'] = $us_id;
    $sql = $db->sqlInsert("us_send_ccvt_records", $d);
    $id = $db->query($sql);
    if (!$id){
        return false;
    }


    //us添加基准资产变动记录
    $us_type = 'us_reg_send_balance';
    $ctime = date('Y-m-d H:i:s');
    $com_balance_us['hash_id'] = hash('md5', $us_id . $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_us['tx_id'] = $d['tx_hash'];
    $com_balance_us['prvs_hash'] = get_recharge_pre_hash($us_id);
    $com_balance_us["credit_id"] = $d['us_id'];
    $com_balance_us["debit_id"] = $rows['ba_id'];
    $com_balance_us["tx_type"] = $type;
    $com_balance_us["tx_amount"] = $money*$unit;
    $com_balance_us["credit_balance"] = get_us_account($us_id);
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = $ctime;

    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    if (!$db->query($sql)) {
        return false;
    }

    //ba添加基准资产变动记录
    $us_type = 'ba_reg_send_balance';
    $com_balance_ba['hash_id'] = hash('md5', $rows['ba_id']. $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_ba['tx_id'] = $d['tx_hash'];
    $com_balance_ba['prvs_hash'] = get_recharge_pre_hash($rows['ba_id']);
    $com_balance_ba["credit_id"] = $rows['ba_id'];
    $com_balance_ba["debit_id"] = $d['us_id'];
    $com_balance_ba["tx_type"] = $type;
    $com_balance_ba["tx_amount"] = $money*$unit;
    $com_balance_ba["credit_balance"] = get_ba_account($rows['ba_id']);
    $com_balance_ba["utime"] = time();
    $com_balance_ba["ctime"] = $ctime;

    $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
    if (!$db->query($sql)) {
        return false;
    }


    return true;


}
//获取用户余额
function get_us_account($us_id){
    $db = new DB_COM();
    $sql = "select base_amount from us_base WHERE us_id='{$us_id}' limit 1";
    $db->query($sql);
    $base_amount = $db -> getField($sql,'base_amount');
    if($base_amount == null)
        return 0;
    return $base_amount;
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
// 函数: 获取充值的前置hash
// 参数: ba_id                 baID
// 返回: hash_id               前置hashid
//======================================
function  get_recharge_pre_hash($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}' and tx_type = 'ba_in' ORDER BY  ctime DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}
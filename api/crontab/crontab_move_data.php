<?php
require_once "../inc/common.php";

if (time()>1538323200){

    $db = new DB_COM();
    $s = $s = "update com_option_config set option_value=1 WHERE option_name='user_lock'";
    $db -> query($s);

    echo "不运行";
    die();
}




$mysql_server="18.223.166.99";
$mysql_username="root";
$mysql_password="Windwin2018";
$mysql_database="hivebanks";
//建立数据库链接
$conn = mysql_connect($mysql_server,$mysql_username,$mysql_password) or die("数据库链接错误");
//选择某个数据库
mysql_select_db($mysql_database,$conn);
mysql_query("set names 'utf8'");
ini_set("display_errors", "off");
error_reporting(E_ALL | E_STRICT);

//执行MySQL语句
$sql = "SELECT * FROM us_base order by ctime ASC ";
$result=mysql_query($sql);
while ($row = mysql_fetch_assoc($result)) {
    $db = new DB_COM();
    $s = "SELECT * FROM us_base WHERE us_id='{$row['us_id']}'";
    $db -> query($s);
    $user = $db -> fetchRow();
    if (!$user){
        $d['us_id'] = $row['us_id'];
        $d['us_nm'] = $row['us_nm'];
        $d['us_account'] = $row['us_account'];
        $d['base_amount'] = $row['base_amount'];
        $d['lock_amount'] = $row['lock_amount'];
        $d['us_type'] = $row['us_type'];
        $d['us_level'] = $row['us_level'];
        $d['security_level'] = $row['security_level'];
        $d['utime'] = $row['utime'];
        $d['ctime'] = $row['ctime'];
        $sql = $db->sqlInsert("us_base", $d);
        $db->query($sql);
        send_to_us_ccvt($row['us_id']);
    }
}

//建立数据库链接
$conn = mysql_connect($mysql_server,$mysql_username,$mysql_password) or die("数据库链接错误");
//选择某个数据库
mysql_select_db($mysql_database,$conn);
mysql_query("set names 'utf8'");
ini_set("display_errors", "off");
error_reporting(E_ALL | E_STRICT);
//执行MySQL语句
$sql2 = "SELECT * FROM us_bind order by ctime ASC ";
$result2=mysql_query($sql2);
while ($row2 = mysql_fetch_assoc($result2)) {
    $db = new DB_COM();
    $s2 = "SELECT * FROM us_bind WHERE bind_id='{$row2['bind_id']}'";
    $db -> query($s2);
    $bind = $db -> fetchRow();
    if (!$bind){
        $d2['bind_id'] = $row2['bind_id'];
        $d2['us_id'] = $row2['us_id'];
        $d2['bind_type'] = $row2['bind_type'];
        $d2['bind_name'] = $row2['bind_name'];
        $d2['bind_info'] = $row2['bind_info'];
        $d2['bind_flag'] = $row2['bind_flag'];
        $d2['utime'] = $row2['utime'];
        $d2['ctime'] = $row2['ctime'];
        $sql3 = $db->sqlInsert("us_bind", $d2);
        $db->query($sql3);
    }
}

echo "已完成同步!";


//======================================
// 函数: 注册创建用户时给送糖果(ccvt)
// 参数: data        信息数组
// 返回: true         创建成功
//       false        创建失败
//======================================
function send_to_us_ccvt($us_id)
{
    $db = new DB_COM();
    //送币
    $unit = get_la_base_unit();
    $money = "1000";
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
    $com_balance_us["tx_type"] = "reg_send";
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
    $com_balance_ba["tx_type"] = "reg_send";
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
    $sql = "select (base_amount+lock_amount) as base_amount from us_base WHERE us_id='{$us_id}' limit 1";
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
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}' and tx_type = 'ba_in' ORDER BY  tx_count DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}


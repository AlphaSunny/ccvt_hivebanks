<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

$day_start = strtotime(date('Y-m-d 00:00:00',strtotime("-1 day"))); //昨日开始时间
$day_end = strtotime(date('Y-m-d 23:59:59',strtotime("-1 day")));    //昨日结束时间

$db = new DB_COM();

$pInTrans = $db->StartTrans();  //开启事务
//群聊微信用户及发言数
$group_name = "风赢科技绝密小分队";
$sql = "select wechat,count(bot_message_id) as count from bot_message where group_name='{$group_name}' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' group by wechat";
echo $sql;die;


//查询ba是否有余额且ba的余额是否够今日增送的额度
function sel_ba_amout($ba_id,$day_start,$day_end){
    $db = new DB_COM();
    $remark = 0;
    //ba余额
    $db->query("select base_amount from ba_base where ba_id='{$ba_id}'");
    $ba_amount = $db->fetchRow();
    if (!$ba_amount || $ba_amount['base_amount']<=0){
        $remark = -1;
    }
    $unit = la_unit();

    $ba_amount = $ba_amount['base_amount']<=0 ? $ba_amount['base_amount'] : $ba_amount['base_amount']/$unit;
    //这个ba微信用户今日发言数
    $db->query("select * from bot_message where ba_id='{$ba_id}' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}'");
    $count = $db->affectedRows();
    if ($ba_amount<$count){
        $remark = -1;
    }

    $data['remark'] = $remark;
    $data['ba_amount'] = $ba_amount;
    $data['message_count'] = $count;
    return $data;
}

//判断是否今日已经增过币
function send_money_if($ba_id,$wechat,$day_start,$day_end){
    $db = new DB_COM();
    $sql = "select * from bot_Iss_records WHERE ba_id='{$ba_id}' AND wechat='{$wechat}' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows;
}

//获取us_id
function get_us_id($wechat){
    $db = new DB_COM();
    $sql = "select us_id from us_base WHERE wechat='{$wechat}' limit 1";
    $db->query($sql);
    $us_id = $db -> getField($sql,'us_id');
    if($us_id == null)
        return 0;
    return $us_id;
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

//la汇率
function la_unit(){
    $db = new DB_COM();
    $sql = "select unit from la_base limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows['unit'];
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

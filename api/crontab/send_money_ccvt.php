<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

//$day_start = strtotime(date('Y-m-d 00:00:00',strtotime("-1 day"))); //昨日开始时间
//$day_end = strtotime(date('Y-m-d 23:59:59',strtotime("-1 day")));    //昨日结束时间

$day_start = strtotime(date('Y-m-d 08:00:00')); //早上八点
$day_end = strtotime(date('Y-m-d 20:00:00'));    //晚上十点

$db = new DB_COM();

//群聊微信用户及发言数
$group_name = "测试2";
$sql = "select ba_id from bot_group where name='{$group_name}'";
$db->query($sql);
$ba_id = $db->getField($sql,'ba_id');
//判断ba是否存在
$sql = "select * from ba_base where ba_id='{$ba_id}'";
$db->query($sql);
$ba_base = $db->fetchRow();
if (!$ba_base){
    echo "ba不存在";
    die;
}
$sql = "select wechat,count(bot_message_id) as count from bot_message where group_name='{$group_name}' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' group by wechat";
$db->query($sql);
$rows = $db->fetchAll();
if ($rows){
    $pInTrans = $db->StartTrans();  //开启事务
    foreach ($rows as $k=>$v){
        //判断用户表是否有这个微信
        $result = get_us_id($v['wechat']);
        if ($result==0){
            continue;
        }
        //判断今日是否已经增过币
        $send = send_money_if($ba_id,$v['wechat'],$day_start,$day_end);
        if ($send){
            $db->Rollback($pInTrans);
            echo $v['wechat']."已增过币";
            continue;
        }

        //送币
        $unit = la_unit();
        $give_account = $v['count'] >=5 ? 5 : $v['count'];
        echo $give_account;
//        $sql = "update us_base set base_amount=base_amount+'{$give_account}'*'{$unit}' WHERE wechat='{$v['wechat']}'";
//        $db -> query($sql);
//        if (!$db->affectedRows()){
//            $db->Rollback($pInTrans);
//            echo "us修改余额失败";
//            continue;
//        }

    }
}


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
    echo $sql;
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

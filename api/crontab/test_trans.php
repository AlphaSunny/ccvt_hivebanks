<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/12/4
 * Time: 下午2:00
 */


require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

$day_start = strtotime(date('Y-m-d 00:00:00',strtotime("-30 day"))); //昨日开始时间
$day_end = strtotime(date('Y-m-d 23:59:59',strtotime("-30 day")));    //昨日结束时间

$db = new DB_COM();

//查询所有ba
$sql = "select ba_id from bot_message WHERE bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' group by ba_id";
$db->query($sql);
$ba_list = $db->fetchAll();
foreach ($ba_list as $k=>$value){


    //判断当前ba是否有余额
    $data = sel_ba_amout($value['ba_id'],$day_start,$day_end);
    if ($data['remark']==-1){
        $data['ba_id'] = $value['ba_id'];
        $data['time'] = date('Y-m-d H:i:s',time());
        file_put_contents("ba_no_money.log",json_encode($data)."\n",FILE_APPEND);
        continue;
    }
    //循环ba,查询ba下微信用户及发言数
    $sql = "select wechat,count(bot_message_id) as count from bot_message where ba_id='{$value['ba_id']}' AND bot_create_time BETWEEN '{$day_start}' AND '{$day_end}' group by wechat";
    $db->query($sql);
    $rows = $db->fetchAll();
    foreach ($rows as $a=>$v){

        $pInTrans = $db->StartTrans();  //开启事务
        $result = get_us_id($v['wechat']);
        if ($result==0){
            continue;
        }

        //判断今日是否已经增过币
        $send = send_money_if($value['ba_id'],$v['wechat'],$day_start,$day_end);
        if ($send){
//            $db->Rollback($pInTrans);
            echo $value['ba_id']."已增过币";
            continue;
        }

        //送币
        $unit = get_la_base_unit();
        $sql = "update us_base set base_amount=base_amount+'{$v['count']}'*'{$unit}' WHERE wechat='{$v['wechat']}'";
        $db -> query($sql);
        $db->affectedRows();


        //ba减钱
        $sql = "update ba_base set base_amount=base_amount-'{$v['count']}'*'{$unit}' WHERE ba_id='{$value['ba_id']}'";
        $db->query($sql);




        //增币记录
        $d['bot_ls_id'] = get_guid();
        $d['ba_id'] = $value['ba_id'];
        $d['wechat'] = $v['wechat'];
        $d['num'] = $v['count'];
        $d['amount'] = $v['count']*$unit;
        $d['is_replacement'] = 0;
        $d['send_time'] = date('Y-m-d H:i:s',time());
        $d['bot_create_time'] = strtotime("-1 day");
        $lgn_type = 'phone';
        $d['tx_hash'] = hash('md5', $value['ba_id'] . $lgn_type . get_ip() . time() . date('Y-m-d H:i:s'));
        $d['us_id'] = get_us_id($v['wechat']);
        $sql = $db->sqlInsert("bot_Iss_records", $d);
        $db->query($sql);




        if(!$db->Commit($pInTrans))
            $db->Rollback($pInTrans);

        //us添加基准资产变动记录
        $us_type = 'us_send_balance';
        $ctime = date('Y-m-d H:i:s');
        $com_balance_us['hash_id'] = hash('md5', $d['us_id'] . $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
        $com_balance_us['tx_id'] = $d['tx_hash'];
        $com_balance_us['prvs_hash'] = get_recharge_pre_hash($d['us_id']);
        $com_balance_us["credit_id"] = $d['us_id'];
        $com_balance_us["debit_id"] = $value['ba_id'];
        $com_balance_us["tx_type"] = "ba_send";
        $com_balance_us["tx_amount"] = $v['count']*$unit;
        $com_balance_us["credit_balance"] = get_us_account($d['us_id'])+($v['count']*$unit);
        $com_balance_us["utime"] = time();
        $com_balance_us["ctime"] = $ctime;

        $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
        $db->query($sql);


        //ba添加基准资产变动记录
        $us_type = 'ba_send_balance';
        $com_balance_ba['hash_id'] = hash('md5', $value['ba_id']. $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
        $com_balance_ba['tx_id'] = $d['tx_hash'];
        $com_balance_ba['prvs_hash'] = get_recharge_pre_hash($value['ba_id']);
        $com_balance_ba["credit_id"] = $value['ba_id'];
        $com_balance_ba["debit_id"] = $d['us_id'];
        $com_balance_ba["tx_type"] = "ba_send";
        $com_balance_ba["tx_amount"] = $v['count']*$unit;
        $com_balance_ba["credit_balance"] = get_ba_account($value['ba_id'])-($v['count']*$unit);
        $com_balance_ba["utime"] = time();
        $com_balance_ba["ctime"] = $ctime;

        $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
        $db->query($sql);


    }
    }


echo "OK!";



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
    $unit = get_la_base_unit();

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
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}' ORDER BY  tx_count DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}

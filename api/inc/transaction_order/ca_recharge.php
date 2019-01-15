<?php

/**
 * Created by PhpStorm.
 * User: liangyi
 * Date: 2018/8/8
 * Time: 上午9:59
 */

function us_recharge_quest($data, $utime) {
    $db = new DB_COM();
    $pInTrans = $db->StartTrans();  //开启事务


// 查找ca余额
    $sql = "SELECT base_amount,lock_amount FROM ca_base WHERE ca_id = '{$data["ca_id"]}' limit 1";
    $db -> query($sql);
    $rows = $db -> fetchRow();

    //判断余额是否足够
    if ($rows["base_amount"] < $data["base_amount"]) {
        exit_error("132","无法达成交易，ca的保证金不足");
    }

    //计算改正后余额
    $new_base_amount = floatval($rows["base_amount"]-$data["base_amount"]);
    $new_lock_amount = floatval($rows["lock_amount"]+$data["base_amount"]);
    $sql = "UPDATE ca_base SET base_amount = '{$new_base_amount}', lock_amount = '{$new_lock_amount}' WHERE ca_id = '{$data["ca_id"]}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    if (!$count) {
        $db->Rollback($pInTrans);
        exit_error("132","交易失败");
    }

    //插入新的充值
    $sql = $db ->sqlInsert("us_ca_recharge_request", $data);
    $q_id = $db->query($sql);
    if (!$q_id){
        $db->Rollback($pInTrans);
        exit_error("133", "创建充值订单失败");
    }

    $db->Commit($pInTrans);


}
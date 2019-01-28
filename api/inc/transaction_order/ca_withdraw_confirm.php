<?php

/**
 * Created by PhpStorm.
 * User: liangyi
 * Date: 2018/8/8
 * Time: 下午2:52
 */

function withdraw_confirm($rows){

    //增加ca_base的该订单的base_amount
    $db = new DB_COM();
    $pInTrans = $db->StartTrans();

    $sql = "SELECT * FROM us_base WHERE us_id = '{$rows["us_id"]}' limit 1";
    $db->query($sql);
    $us_row = $db->fetchRow();

    $sql = "SELECT * FROM ca_base WHERE ca_id = '{$rows["ca_id"]}' limit 1";
    $db->query($sql);
    $ca_row = $db->fetchRow();

    $tx_detail = json_decode($rows["tx_detail"],true);
    $tx_detail = json_encode($tx_detail);
    $sql = "UPDATE us_ca_withdraw_request SET qa_flag = '1', tx_detail = '{$tx_detail}' WHERE ca_id = '{$rows["ca_id"]}' and qa_id = '{$rows["qa_id"]}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    if (!$count){
        exit_error('101',"处理失败");
    }

    $new_base_amount = $ca_row["base_amount"] + $rows["base_amount"];
    $sql = "UPDATE ca_base SET base_amount = '{$new_base_amount}' WHERE ca_id = '{$rows["ca_id"]}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    if (!$count){
        $db->Rollback($pInTrans);
        exit_error('101',"更新失败,请联系管理员");
    }


    //减掉us_base的该订单的lock_amount

    $new_lock_amount = $us_row["lock_amount"] - $rows["base_amount"];
    if ($new_lock_amount < 0){
        $db->Rollback($pInTrans);
        exit_error('134',"订单异常，金额不对,联系管理员");
    }

    $sql = "UPDATE us_base SET lock_amount = '{$new_lock_amount}' WHERE us_id = '{$rows["us_id"]}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    if (!$count){
        $db->Rollback($pInTrans);
        exit_error('101',"更新失败");
    }


    //base_amount值有所改变

    $sql = "SELECT * FROM us_base WHERE us_id = '{$rows["us_id"]}' limit 1";
    $db->query($sql);
    $new_us_row = $db->fetchRow();

    $sql = "SELECT * FROM ca_base WHERE ca_id = '{$rows["ca_id"]}' limit 1";
    $db->query($sql);
    $new_ca_row = $db->fetchRow();

    //创建交易记录
    $us_type = 'us_withdraw_balance';
    $ctime = date('Y-m-d H:i:s');
    $us_ip = get_ip();
    $com_balance_us['hash_id'] = hash('md5', $rows["us_id"] . $us_type . $us_ip . time().rand(1000,9999) . $ctime);
    $com_balance_us['tx_id'] = $rows["tx_hash"];
    $com_balance_us["credit_id"] = $rows["us_id"];
    $com_balance_us['prvs_hash'] = get_ca_withdraw_pre_hash($rows["us_id"]);
    $com_balance_us["debit_id"] = $rows["ca_id"];
    $com_balance_us["tx_type"] =    "ca_out";
    $com_balance_us["tx_amount"] =  -$rows["base_amount"];//FZG
    $com_balance_us["credit_balance"] = $new_us_row["base_amount"] + $new_us_row["lock_amount"];
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = $ctime;
    $com_balance_us["tx_count"] = base_get_pre_count($rows["us_id"]);//FZG

    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    $row = $db->query($sql);
    if (!$row){
        $db->Rollback($pInTrans);
        exit_error('101',"更新失败");
    }

    $us_type = 'ca_withdraw_balance';
    $com_balance_ba['hash_id'] = hash('md5', $rows["ca_id"] . $us_type . $us_ip . time().rand(1000,9999) . $ctime);
    $com_balance_ba['tx_id'] = $rows["tx_hash"];
    $com_balance_ba['prvs_hash'] = get_ca_withdraw_pre_hash($rows["ca_id"]);
    $com_balance_ba["credit_id"] = $rows["ca_id"];
    $com_balance_ba["debit_id"] = $rows["us_id"];
    $com_balance_ba["tx_type"] =    "ca_out";
    $com_balance_ba["tx_amount"] =  $rows["base_amount"];
    $com_balance_ba["credit_balance"] = $new_ca_row["base_amount"] + $new_ca_row["lock_amount"];
    $com_balance_ba["utime"] = time();
    $com_balance_ba["ctime"] = $ctime;
    $com_balance_ba["tx_count"] = base_get_pre_count($rows["ca_id"]);//FZG
    $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
    $row = $db->query($sql);
    if (!$row){
        $db->Rollback($pInTrans);
        exit_error('101',"更新失败");
    }
    $db->Commit($pInTrans);





}
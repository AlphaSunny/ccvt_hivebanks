<?php

//======================================
// 函数: 点赞功能
// 参数: account      账号
//      variable      绑定name
// 返回: row           最新信息数组
//======================================
function give_like_us($data)
{
    $db = new DB_COM();
    $pInTrans = $db->StartTrans();  //开启事务
    $unit = get_la_base_unit();

    //积分变动记录表
    $d['hash_id'] = hash('md5', $data['us_id'] . 'give_like_us' . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $d['credit_id'] = $data['us_id'];
    $d['debit_id'] = $data['give_us_id'];
    $d['tx_amount'] = $data['give_num']*$unit;
    $d['ctime'] = time();
    $d['utime'] = date('Y-m-d H:i:s');
    $d['state'] = $data['state'];
    $d['tx_detail'] = $data['state'] ==1 ? "点赞" : "点踩";
    $sql = $db->sqlInsert("us_glory_integral_change_log", $d);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return 0;
    }

    //用户减钱

    $sql = "update us_base set base_amount=base_amount-'{$data['give_num']}'*'{$unit}' WHERE us_id='{$data['us_id']}'";
    $db->query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return 0;
    }

    //la加钱
    $sql = "update la_base set base_amount=base_amount+'{$data['give_num']}'*'{$unit}' limit 1";
    $db->query($sql);
    if (!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return 0;
    }

    //增加荣耀积分(减少荣耀积分)
    $sql = "select * from us_asset WHERE asset_id='GLOP' AND us_id='{$data['give_us_id']}'";
    $db->query($sql);
    $asset_us = $db->fetchRow();
    if ($asset_us){
        $sql = "update us_asset set";
        if ($data['state']==1){
            $sql .= " base_amount=base_amount+'{$data['give_num']}'*'{$unit}'";
        }elseif ($data['state']==2){
            $sql .= " base_amount=base_amount-'{$data['give_num']}'*'{$unit}'";
        }
        $sql .= " WHERE asset_id='GLOP' AND us_id='{$data['give_us_id']}'";
        $db->query($sql);
        if (!$db->affectedRows()){
            $db->Rollback($pInTrans);
            return 0;
        }
    }else{
        $sql = "select * from us_base WHERE us_id='{$data['give_us_id']}'";
        $db->query($sql);
        $us_base = $db->fetchRow();
        $asset['asset_id'] = 'GLOP';
        $asset['us_id'] = $data['give_us_id'];
        $asset['us_nm'] = $us_base['us_nm'];
        $asset['us_account'] = $us_base['us_account'];
        $asset['base_amount'] = $data['give_num']*$unit;
        $asset['lock_amount'] = 0;
        $asset['utime'] = time();
        $asset['ctime'] = date('Y-m-d H:i:s');
        $sql = $db->sqlInsert("us_asset", $asset);
        $id = $db->query($sql);
        if (!$id){
            $db->Rollback($pInTrans);
            return 0;
        }
    }


    /******************************转账记录表***************************************************/
    $la_id = get_la_id();
    //赠送者
    $flag = $data['state'] == 1 ? 5 : 6;
    $transfer['hash_id'] = hash('md5', $data['us_id'] . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_pre_hash($data['us_id']);
    $transfer['prvs_hash'] = $prvs_hash == 0 ? $transfer['hash_id'] : $prvs_hash;
    $transfer['credit_id'] = $data['us_id'];
    $transfer['debit_id'] = $la_id;
    $transfer['tx_amount'] = $data['give_num']*$unit;
    $transfer['credit_balance'] = get_us_base_amount($transfer['credit_id'])-$transfer['tx_amount'];
    $transfer['tx_hash'] = hash('md5', $data['us_id'] . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $transfer['flag'] = $flag;
    $transfer['transfer_type'] = 'us-la';
    $transfer['transfer_state'] = 1;
    $transfer['tx_detail'] = $data['state']==1 ? '点赞消耗' : "踩人消耗";
    $transfer['give_or_receive'] = 1;
    $transfer['ctime'] = time();
    $transfer['utime'] = date('Y-m-d H:i:s');
    $sql = $db->sqlInsert("com_transfer_request", $transfer);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return 0;
    }

    //接收者(la)
    $dat['hash_id'] = hash('md5', $la_id . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash = get_pre_hash($la_id);
    $dat['prvs_hash'] = $prvs_hash == 0 ? $dat['hash_id'] : $prvs_hash;
    $dat['credit_id'] = $la_id;
    $dat['debit_id'] = $data['us_id'];
    $dat['tx_amount'] = $data['give_num']*$unit;
    $dat['credit_balance'] = get_la_base_amount($la_id)+$dat['tx_amount'];
    $dat['tx_hash'] = hash('md5', $la_id . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $dat['flag'] = $flag;
    $dat['transfer_type'] = 'us-la';
    $dat['transfer_state'] = 1;
    $dat['tx_detail'] = $data['state']==1 ? '点赞消耗' : "踩人消耗";
    $dat['give_or_receive'] = 2;
    $dat['ctime'] = time();
    $dat['utime'] = date('Y-m-d H:i:s');
    $sql = $db->sqlInsert("com_transfer_request", $dat);
    $id = $db->query($sql);
    if (!$id){
        $db->Rollback($pInTrans);
        return 0;
    }

    /***********************资金变动记录表***********************************/

    //us添加基准资产变动记录
    $us_type = 'us_get_balance';
    $ctime = date('Y-m-d H:i:s');
    $com_balance_us['hash_id'] = hash('md5', $data['us_id'] . $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_us['tx_id'] = $transfer['tx_hash'];
    $prvs_hash = get_recharge_pre_hash($data['us_id']);
    $com_balance_us['prvs_hash'] = $prvs_hash==0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_us["credit_id"] = $data['us_id'];
    $com_balance_us["debit_id"] = $la_id;
    $com_balance_us["tx_type"] = 'give_like';
    $com_balance_us["tx_amount"] = $data['give_num']*$unit;
    $com_balance_us["credit_balance"] = get_us_base_amount($data['us_id'])-$com_balance_us["tx_amount"];
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = date('Y-m-d H:i:s');

    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return 0;
    }

    //la添加基准资产变动记录
    $us_type = 'la_get_balance';
    $com_balance_ba['hash_id'] = hash('md5', $la_id. $us_type . get_ip() . time() . rand(1000, 9999) . $ctime);
    $com_balance_ba['tx_id'] = $dat['tx_hash'];
    $prvs_hash = get_recharge_pre_hash($la_id);
    $com_balance_ba['prvs_hash'] = $prvs_hash == 0 ? $com_balance_us['hash_id'] : $prvs_hash;
    $com_balance_ba["credit_id"] = $la_id;
    $com_balance_ba["debit_id"] = $data['us_id'];
    $com_balance_ba["tx_type"] = 'give_like';
    $com_balance_ba["tx_amount"] = $data['give_num']*$unit;
    $com_balance_ba["credit_balance"] = get_la_base_amount($la_id)+$com_balance_ba["tx_amount"];
    $com_balance_ba["utime"] = time();
    $com_balance_ba["ctime"] = $ctime;

    $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return 0;
    }



    $db->Commit($pInTrans);
    return true;
}


//======================================
// 函数: 获取上传交易hash
//======================================
function get_pre_hash($credit_id){
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_transfer_request WHERE credit_id = '{$credit_id}' ORDER BY  ctime DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}

//======================================
// 函数: 获取资金变动记录表的前置hash
// 参数: ba_id                 baID
// 返回: hash_id               前置hashid
//======================================
function  get_recharge_pre_hash($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}'  ORDER BY  ctime DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}

//获取la id
function get_la_id(){
    $db = new DB_COM();
    $sql = "select id from la_base limit 1";
    $db->query($sql);
    $id = $db->getField($sql,'id');
    return $id;
}

//获取la余额
function get_la_base_amount($la_id){
    $db = new DB_COM();
    $sql = "select base_amount from la_base WHERE id='{$la_id}'";
    $db->query($sql);
    $amount = $db->getField($sql,'base_amount');
    return $amount;
}

//获取us余额
function get_us_base_amount($us_id){
    $db = new DB_COM();
    $sql = "select (base_amount+lock_amount) as base_amount from us_base WHERE us_id='{$us_id}'";
    $db->query($sql);
    $amount = $db->getField($sql,'base_amount');
    return $amount;
}


//获取us可用余额
function get_us_base_true_amount($us_id){
    $db = new DB_COM();
    $sql = "select base_amount from us_base WHERE us_id='{$us_id}'";
    $db->query($sql);
    $amount = $db->getField($sql,'base_amount');
    return $amount;
}


//======================================
// 函数: 判断是否当日已经达到最大上限
//======================================
function check_max_give($us_id,$give_num,$state,$give_us_id)
{
    $db = new DB_COM();
    if ($state==1){
        $max = get_praise_pointon_maxnum()['max_give_like'];
    }elseif ($state==2){
        $max = get_praise_pointon_maxnum()['max_give_no_like'];
    }

    $unit = get_la_base_unit();
    $base_amount = get_us_base_true_amount($us_id)/$unit;
    if ($give_num>$base_amount){
        return 4;
        false;
    }


    $start = strtotime(date('Y-m-d 00:00:00'));
    $end  = strtotime(date('Y-m-d 23:59:59'));
    $sql = "SELECT sum(tx_amount)/'{$unit}' as give_all FROM us_glory_integral_change_log WHERE credit_id='{$us_id}' AND state='{$state}' AND ctime BETWEEN '{$start}' AND '{$end}'";
    $db -> query($sql);
    $give_all= $db -> getField($sql,'give_all');
    if ($give_all==$max){
        return 1;
    }elseif($give_num+$give_all>$max){
        return 2;
    }else{
//        if ($state==2){
//            $sql = "select * from us_asset WHERE asset_id='GLOP' AND us_id='{$give_us_id}'";
//            $db->query($sql);
//            $row = $db->fetchRow();
//            if (!$row || $row['base_amount']==0 || $give_num>($row['base_amount']/$unit)){
//                return 3;
//            }
//        }
    }
}


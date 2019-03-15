<?php

//ba_in,ba_out,ca_out,us_us_transfer_cancel,us_us_transfer_in,us_us_transfer_out
//die('done');

//require_once "../inc/common.php";
//$md5 = hash('md5', '6C69520E-E454-127B-F474-452E65A3EE75' . 1 . '127.0.0.1' . '2019-03-14 14:35:11' . rand(1000, 9999) . microtime());
//echo $md5."<br />";
//echo strlen($md5)."<br />";
//$sha = hash('sha256', '6C69520E-E454-127B-F474-452E65A3EE75' . 1 . '127.0.0.1' . '2019-03-14 14:35:11' . rand(1000, 9999) . microtime());
//echo $sha."<br />";
//echo strlen($sha)."<br />";
//die;
require_once "/alidata/www/ccvt/api/inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

$db = new DB_COM();

$unit = get_la_base_unit();

//**********************************************CA->US*******************************************//

//**********************************************BA -> US*******************************************//

//注册
$sql = "select us_id,ctime from us_base WHERE 1";
$db->query($sql);
$reg_user = $db->fetchAll();
foreach ($reg_user as $k=>$v){
    if ($v['ctime']<'2018-10-01 00:00:00'){
        $send_money = "1000"*$unit;
    }elseif($v['ctime']>='2018-10-01 00:00:00' and $v['ctime']<'2018-10-07 23:59:59'){
        $send_money = "500"*$unit;
    }else{
        $send_money = "50"*$unit;
    }
    $reg_user[$k]['send_money'] = $send_money;
    $reg_user[$k]['flag'] = 1;
    $reg_user[$k]['detail'] = "注册赠送";
    $reg_user[$k]['type'] = "reg_send";
    $reg_user[$k]['transfer_type'] = "ba-us";
    $reg_user[$k]['transfer_us_id'] = "0";
    $reg_user[$k]['qa_flag'] = "0";
}
//echo "注册:".count($reg_user)."<br />";


//邀请
$sql = "select b.us_id,a.ctime from us_base as a LEFT JOIN us_base as b on a.invite_code=b.us_nm WHERE a.invite_code!=0";
$db->query($sql);
$invite_rows = $db->fetchAll();
foreach ($invite_rows as $k=>$v){
    $invite_rows[$k]['send_money'] = "50"*$unit;
    $invite_rows[$k]['flag'] = 2;
    $invite_rows[$k]['detail'] = "邀请赠送";
    $invite_rows[$k]['type'] = "invite_send";
    $invite_rows[$k]['transfer_type'] = "ba-us";
    $invite_rows[$k]['transfer_us_id'] = "0";
    $invite_rows[$k]['qa_flag'] = "0";
}
//echo "邀请:".count($invite_rows)."<br />";


//二级邀请奖励
$sql = "select us_id,ctime from us_base WHERE 1";
$db->query($sql);
$two_invite_send = $db->fetchAll();
foreach ($two_invite_send as $k=>$v){
    $sql = "select count(us_id) as count from us_base WHERE invite_code in (select us_nm from us_base WHERE invite_code=(select us_nm from us_base WHERE us_id='{$v['us_id']}') GROUP BY us_nm)";
    $db->query($sql);
    $data = $db->fetchRow();
    if ($data['count']==0){
        unset($two_invite_send[$k]);
    }else{
        $two_invite_send[$k]['send_money'] = $data['count']*20*$unit;
        $two_invite_send[$k]['ctime'] = date('Y-m-d H:i:s',strtotime($v['ctime'])+(1*24*60*60));
        $two_invite_send[$k]['flag'] = 2;
        $two_invite_send[$k]['detail'] = "二级邀请赠送";
        $two_invite_send[$k]['type'] = "two_invite_send";
        $two_invite_send[$k]['transfer_type'] = "ba-us";
        $two_invite_send[$k]['transfer_us_id'] = "0";
        $two_invite_send[$k]['qa_flag'] = "0";
    }
}

//echo "二级邀请:".count($two_invite_send)."<br />";

//群聊奖励
$sql = "select us_id,send_time as ctime,amount as send_money from bot_Iss_records where 1";
$db->query($sql);
$bot_rows = $db->fetchAll();
foreach ($bot_rows as $k=>$v){
    $bot_rows[$k]['flag'] = 4;
    $bot_rows[$k]['detail'] = "聊天奖励";
    $bot_rows[$k]['type'] = "ba_send";
    $bot_rows[$k]['transfer_type'] = "ba-us";
    $bot_rows[$k]['transfer_us_id'] = "0";
    $bot_rows[$k]['qa_flag'] = "0";
}

//echo "群聊奖励:".count($bot_rows)."<br />";

//兑换码兑换
$sql = "select us_id,amount as send_money,exchange_time as ctime from us_voucher WHERE is_effective=2 and exchange_time!=''";
$db->query($sql);
$voucher = $db->fetchAll();
foreach ($voucher as $k=>$v){
    $voucher[$k]['send_money'] = $v['send_money']*$unit;
    $voucher[$k]['flag'] = 7;
    $voucher[$k]['detail'] = "兑换码兑换";
    $voucher[$k]['type'] = "voucher";
    $voucher[$k]['transfer_type'] = "ba-us";
    $voucher[$k]['transfer_us_id'] = "0";
    $voucher[$k]['qa_flag'] = "0";
}

//echo "兑换码兑换:".count($voucher)."<br />";


//ba调账(活动奖励啥的)
$sql = "select credit_id as us_id,flag,tx_amount as send_money,utime as ctime,tx_detail as detail from com_transfer_request2 WHERE flag=3 AND give_or_receive=2";
$db->query($sql);
$tiaozhang = $db->fetchAll();
foreach ($tiaozhang as $k=>$v){
    $tiaozhang[$k]['type'] = "ba_tran";
    $tiaozhang[$k]['transfer_type'] = "ba-us";
    $tiaozhang[$k]['transfer_us_id'] = "0";
    $tiaozhang[$k]['qa_flag'] = "0";
}

//echo "ba调账(活动奖励啥的):".count($tiaozhang)."<br />";

//升级返还
$sql = "select us_id,ctime from us_scale_changes WHERE ctime<'2018-12-01 19:50:02'";
$db->query($sql);
$scale_changes = $db->fetchAll();
foreach ($scale_changes as $k=>$v){
    $scale_changes[$k]['send_money'] = "50"*$unit;
    $scale_changes[$k]['flag'] = 9;
    $scale_changes[$k]['detail'] = "升级返还";
    $scale_changes[$k]['type'] = "up_retuen";
    $scale_changes[$k]['transfer_type'] = "ba-us";
    $scale_changes[$k]['transfer_us_id'] = "0";
    $scale_changes[$k]['qa_flag'] = "0";
}

//echo "升级返还:".count($scale_changes)."<br />";

//ba_in,数字货币充值(com_transfer_request不存)
$sql = "select us_id,base_amount as send_money,tx_time as ctime from us_ba_recharge_request where qa_flag=1";
$db->query($sql);
$ba_in = $db->fetchAll();
foreach ($ba_in as $k=>$v){
    $ba_in[$k]['flag'] = '0';
    $ba_in[$k]['ctime'] = date('Y-m-d H:i:s',$v['ctime']);
    $ba_in[$k]['detail'] = "数字货币充值";
    $ba_in[$k]['type'] = "ba_in";
    $ba_in[$k]['transfer_type'] = "ba-us";
    $ba_in[$k]['transfer_us_id'] = "0";
    $ba_in[$k]['qa_flag'] = "0";
}

//echo "数字货币充值:".count($ba_in)."<br />";


//群主返现
$sql = "select credit_id as us_id,flag,tx_amount as send_money,utime as ctime,tx_detail as detail from com_transfer_request2 WHERE flag=12 AND give_or_receive=2";
$db->query($sql);
$group_cashback = $db->fetchAll();
foreach ($group_cashback as $k=>$v){
    $group_cashback[$k]['type'] = "group_cashback";
    $group_cashback[$k]['transfer_type'] = "ba-us";
    $group_cashback[$k]['transfer_us_id'] = "0";
    $group_cashback[$k]['qa_flag'] = "0";
}

//echo "群主返现:".count($group_cashback)."<br />";

//踩赞返还
$sql = "select credit_id as us_id,flag,tx_amount as send_money,utime as ctime,tx_detail as detail from com_transfer_request2 WHERE flag=14 AND give_or_receive=2";
$db->query($sql);
$give_like_back = $db->fetchAll();
foreach ($give_like_back as $k=>$v){
    $give_like_back[$k]['type'] = "give_like_back";
    $give_like_back[$k]['transfer_type'] = "ba-us";
    $give_like_back[$k]['transfer_us_id'] = "0";
    $give_like_back[$k]['qa_flag'] = "0";
}

//echo "踩赞返还:".count($give_like_back)."<br />";



//锁仓(锁仓余额)
$sql = "select credit_id as us_id,flag,tx_amount as send_money,utime as ctime,tx_detail as detail from com_transfer_request2 WHERE flag=10 AND give_or_receive=2";
$db->query($sql);
$suocang = $db->fetchAll();
foreach ($suocang as $k=>$v){
    $suocang[$k]['type'] = "big_us_lock";
    $suocang[$k]['transfer_type'] = "ba-us";
    $suocang[$k]['transfer_us_id'] = "0";
    $suocang[$k]['qa_flag'] = "0";
}

//echo "锁仓(锁仓余额):".count($suocang)."<br />";

//锁仓利息
$sql = "select credit_id as us_id,flag,tx_amount as send_money,utime as ctime,tx_detail as detail from com_transfer_request2 WHERE flag=11 AND give_or_receive=2";
$db->query($sql);
$big_us_interest = $db->fetchAll();
foreach ($big_us_interest as $k=>$v){
    $big_us_interest[$k]['type'] = "big_us_interest";
    $big_us_interest[$k]['transfer_type'] = "ba-us";
    $big_us_interest[$k]['transfer_us_id'] = "0";
    $big_us_interest[$k]['qa_flag'] = "0";
}

//echo "锁仓利息:".count($big_us_interest)."<br />";

//员工动态调整(ba-us加锁定余额)
$sql = "select credit_id as us_id,tx_amount as send_money,ctime from com_base_balance2 WHERE tx_type='dynamic_tuning' AND debit_id='6C69520E-E454-127B-F474-452E65A3EE75'";
$db->query($sql);
$dynamic_tuning = $db->fetchAll();
foreach ($dynamic_tuning as $k=>$v){
    $dynamic_tuning[$k]['flag'] = 15;
    $dynamic_tuning[$k]['detail'] = "员工动态调整";
    $dynamic_tuning[$k]['type'] = "dynamic_tuning";
    $dynamic_tuning[$k]['transfer_type'] = "ba-us";
    $dynamic_tuning[$k]['transfer_us_id'] = "0";
    $dynamic_tuning[$k]['qa_flag'] = "0";
}

//echo "员工动态调整:".count($dynamic_tuning)."<br />";




//*****************************************US -> LA************************************************//

//点赞(点踩)(ccvt兑换积分)
$sql = "select credit_id as us_id,utime as ctime,tx_amount as send_money,tx_detail as detail,state as flag from us_glory_integral_change_log WHERE 1";
$db->query($sql);
$glory = $db->fetchAll();
foreach ($glory as $k=>$v){
    if ($v['flag']==1 && $v['detail']=="点赞"){
        $flag = 5;
        $type = "give_like";
    }elseif ($v['flag']==1 && $v['detail']=="ccvt兑换积分"){
        $flag = 8;
        $type = "ccvt_inte";
    }elseif ($v['flag']==2){
        $flag = 6;
        $type = "give_like";
    }
    $glory[$k]['flag'] = $flag;
    $glory[$k]['type'] = $type;
    $glory[$k]['transfer_type'] = "us-la";
    $glory[$k]['transfer_us_id'] = "0";
    $glory[$k]['qa_flag'] = "0";

}

//echo "点赞(点踩)(ccvt兑换积分):".count($glory)."<br />";


//*****************************************US -> CA************************************************//

//用户提现(com_transfer_request不存)
$sql = "select us_id,(base_amount+tx_fee) as send_money,tx_time as ctime from us_ca_withdraw_request WHERE qa_flag=1";
$db->query($sql);
$us_ca_withdraw_request = $db->fetchAll();
if ($us_ca_withdraw_request){
    foreach ($us_ca_withdraw_request as $k=>$v){
        $us_ca_withdraw_request[$k]['flag'] = 0;
        $us_ca_withdraw_request[$k]['ctime'] = date('Y-m-d H:i:s',$v['ctime']);
        $us_ca_withdraw_request[$k]['detail'] = "用户提现";
        $us_ca_withdraw_request[$k]['type'] = "ca_out";
        $us_ca_withdraw_request[$k]['transfer_type'] = "us-ca";
        $us_ca_withdraw_request[$k]['transfer_us_id'] = "0";
        $us_ca_withdraw_request[$k]['qa_flag'] = "0";
    }
}

//echo "用户提现(ca_out):".count($us_ca_withdraw_request)."<br />";

//*****************************************US -> BA************************************************//

//用户提现(com_transfer_request不存)
$sql = "select us_id,base_amount as send_money,tx_time as ctime from us_ba_withdraw_request WHERE qa_flag=1";
$db->query($sql);
$us_ba_withdraw_request = $db->fetchAll();
if ($us_ba_withdraw_request){
    foreach ($us_ba_withdraw_request as $k=>$v){
        $us_ba_withdraw_request[$k]['flag'] = 0;
        $us_ba_withdraw_request[$k]['ctime'] = date('Y-m-d H:i:s',$v['ctime']);
        $us_ba_withdraw_request[$k]['detail'] = "用户提现";
        $us_ba_withdraw_request[$k]['type'] = "ba_out";
        $us_ba_withdraw_request[$k]['transfer_type'] = "us-ba";
        $us_ba_withdraw_request[$k]['transfer_us_id'] = "0";
        $us_ba_withdraw_request[$k]['qa_flag'] = "0";
    }
}

//echo "用户提现(ba_out):".count($us_ba_withdraw_request)."<br />";


//离职回收(us锁定金额给ba)
$sql = "select credit_id as us_id,flag,tx_amount as send_money,utime as ctime,tx_detail as detail from com_transfer_request2 WHERE flag=15 AND tx_detail='离职回收'  AND give_or_receive=1";
$db->query($sql);
$gone_staff = $db->fetchAll();
foreach ($gone_staff as $k=>$v){
    $gone_staff[$k]['type'] = "gone_staff";
    $gone_staff[$k]['transfer_type'] = "us-ba";
    $gone_staff[$k]['transfer_us_id'] = "0";
    $gone_staff[$k]['qa_flag'] = "0";
}

//echo "离职回收(us锁定金额给ba):".count($gone_staff)."<br />";


//*****************************************US -> US************************************************//


//用户转账
$sql = "select us_id,transfer_id as transfer_us_id,tx_amount as send_money,tx_time as ctime,qa_flag from us_us_transfer_request WHERE qa_flag in (0,1)";
$db->query($sql);
$us_us_transfer = $db->fetchAll();
foreach ($us_us_transfer as $k=>$v){
    $us_us_transfer[$k]['flag'] = 13;
    $us_us_transfer[$k]['detail'] = "用户转账";
    $us_us_transfer[$k]['type'] = "us_us_transfer";
    $us_us_transfer[$k]['transfer_type'] = "us-us";
}

//echo "用户转账:".count($us_us_transfer)."<br />";

//$sql = "select us_id as transfer_us_id,transfer_id as us_id,tx_amount as send_money,tx_time as ctime,qa_flag from us_us_transfer_request WHERE qa_flag=2";
//$db->query($sql);
//$us_us_transfer_cancel = $db->fetchAll();
//foreach ($us_us_transfer_cancel as $k=>$v){
//    $us_us_transfer_cancel[$k]['flag'] = 16;
//    $us_us_transfer_cancel[$k]['detail'] = "转账撤回";
//    $us_us_transfer_cancel[$k]['type'] = "us_us_transfer_cancel";
//    $us_us_transfer_cancel[$k]['transfer_type'] = "us-us";
//}

//echo "转账撤回:".count($us_us_transfer_cancel)."<br />";


$list = array_merge(
    $reg_user,
    $invite_rows,
    $two_invite_send,
    $bot_rows,
    $glory,
    $voucher,
    $tiaozhang,
    $scale_changes,
    $us_ba_withdraw_request,
    $group_cashback,
    $us_us_transfer,
    //$us_us_transfer_cancel,
    $give_like_back,
    $suocang,
    $big_us_interest,
    $dynamic_tuning,
    $gone_staff,
    $ba_in,
    $us_ca_withdraw_request
);
array_multisort(array_column($list,'ctime'),SORT_ASC,$list);

//print_r(json_encode($list));
//die;
//echo count($list);


$ba_id = get_ba_id();
$la_id = get_la_id();
$ca_id = get_ca_id();
foreach ($list as $k=>$v){
    set_time_limit(0);
    into_transfer($v['us_id'],$v['send_money'],$v['ctime'],$v['flag'],$v['detail'],$v['type'],$v['transfer_type'],$ba_id,$la_id,$ca_id,$v['transfer_us_id'],$v['qa_flag']);
}


echo "ok";


//  ba-us(注册(reg_send)、邀请(invite_send)、二级邀请(two_invite_send)、聊天奖励(ba_send)、活动奖励(ba_tran)、升级返还(up_retuen)、群主奖励(group_cashback)、兑换码(voucher)、
//        点赞返还(give_like_back)、用户充值(ba_in)、员工分配(dynamic_tuning)、锁仓(big_us_lock)、锁仓奖励(big_us_interest)
//  us-la(点赞(点踩)(ccvt兑换积分)    赞踩消耗(give_like)  积分兑换(ccvt_inte))
//  us-us(转账(us_us_transfer_(in、out))   转账撤回(us_us_transfer_cancel))
//  us-ba(离职回收(gone_staff)(us锁定金额给ba),用户提现(ba_out))
//  us-ca(用户提现(ca_out))

//分别是余额加减和锁定余额   锁仓余额(big_us_lock)、员工动态调整(dynamic_tuning)这两个是加锁定余额)

//ba_out、ca_out、ba_in (com_transfer_request不存)
function into_transfer($us_id,$send_money,$time,$flag,$detail,$type,$transfer_type,$ba_id,$la_id,$ca_id,$transfer_us_id,$qa_flag){
    $db = new DB_COM();

    switch ($transfer_type){
        case "ba-us":
            //用户加钱
            $sql = "update us_base set";
            if ($type=='big_us_lock' or $type=='dynamic_tuning'){
                $sql .= " lock_amount=lock_amount+'{$send_money}'";
            }else{
                $sql .= " base_amount=base_amount+'{$send_money}'";
            }
            $sql .= " WHERE us_id='{$us_id}'";
            echo $sql."1"."<br />";
            $db -> query($sql);
            if (!$db->affectedRows()){
                echo "us加钱1错误";
            }

            //ba减钱
            $sql = "update ba_base set base_amount=base_amount-'{$send_money}' WHERE ba_id='{$ba_id}'";
            echo $sql."2"."<br />";
            $db -> query($sql);
            if (!$db->affectedRows()){
                echo "ba减钱1错误";
            }
            break;
        case "us-la":
            //用户减钱
            $sql = "update us_base set base_amount=base_amount-'{$send_money}' WHERE us_id='{$us_id}'";
            echo $sql."3"."<br />";
            $db -> query($sql);
            if (!$db->affectedRows()){
                echo "us减钱2错误";
            }

            //la加钱
            $sql = "update la_base set base_amount=base_amount+'{$send_money}' WHERE id='{$la_id}'";
            echo $sql."4"."<br />";
            $db->query($sql);
            if (!$db->affectedRows()){
                echo "la加钱2错误";
            }
            break;
        case "us-us":
            //用户减钱
            $sql = "update us_base set";
//            if ($qa_flag==2) {
//                $sql .= " lock_amount=lock_amount-'{$send_money}'";
//            }else{
            $sql .= " base_amount=base_amount-'{$send_money}'";
//            }
            $sql .= " WHERE us_id='{$us_id}'";
            echo $sql."1"."<br />";
            $db -> query($sql);
            if (!$db->affectedRows()){
                echo "us减钱1错误";
            }

            //用户加钱
            $sql = "update us_base set";
//            if ($qa_flag==2) {
//                $sql .= " base_amount=base_amount+'{$send_money}'";
//            }else
            if ($qa_flag==1){
                $sql .= " base_amount=base_amount+'{$send_money}'";
            }else{
                $sql .= " lock_amount=lock_amount+'{$send_money}'";
            }
            $sql .= " WHERE us_id='{$transfer_us_id}'";
            echo $sql."1"."<br />";
            $db -> query($sql);
            if (!$db->affectedRows()){
                echo "us加钱1错误";
            }
            break;
        case "us-ba":
            $sql = "update us_base set";
            if ($type=='gone_staff'){
                //用户锁定减钱
                $sql .= " lock_amount=lock_amount-'{$send_money}'";
            }elseif ($type=='ba_out'){
                //用户可用余额减钱
                $sql .= " base_amount=base_amount-'{$send_money}'";
            }
            $sql .= " WHERE us_id='{$us_id}'";
            echo $sql."6"."<br />";
            $db -> query($sql);
            if (!$db->affectedRows()){
                echo "us金额减钱4错误";
            }

            //ba加钱
            $sql = "update ba_base set base_amount=base_amount+'{$send_money}' WHERE ba_id='{$ba_id}'";
            echo $sql."7"."<br />";
            $db->query($sql);
            if (!$db->affectedRows()){
                echo "ba加钱4错误";
            }
            break;
        case "us-ca":
            //用户减钱
            $sql = "update us_base set base_amount=base_amount-'{$send_money}' WHERE us_id='{$us_id}'";
            echo $sql."8"."<br />";
            $db -> query($sql);
            if (!$db->affectedRows()){
                echo "us减钱8错误";
            }

            //ca加钱
            $sql = "update ca_base set base_amount=base_amount+'{$send_money}' WHERE ca_id='{$ca_id}'";
            echo $sql."8"."<br />";
            $db->query($sql);
            if (!$db->affectedRows()){
                echo "ca加钱8错误";
            }
            break;
    }


    //判断类型,指定值
    switch ($transfer_type){
        case "ba-us":
            $credit_id = $ba_id;
            $debit_id = $us_id;
            $transfer_credit_balance = get_ba_base_amount($credit_id);
            $dat_credit_balance = get_us_base_amount($debit_id);
            break;
        case "us-la":
            $credit_id = $us_id;
            $debit_id = $la_id;
            $transfer_credit_balance = get_us_base_amount($credit_id);
            $dat_credit_balance = get_la_base_amount($debit_id);
            break;
        case "us-us":
            $credit_id = $us_id;
            $debit_id = $transfer_us_id;
            $transfer_credit_balance = get_us_base_amount($credit_id);
            $dat_credit_balance = get_us_base_amount($debit_id);
            break;
        case "us-ba":
            $credit_id = $us_id;
            $debit_id = $ba_id;
            $transfer_credit_balance = get_us_base_amount($credit_id);
            $dat_credit_balance = get_ba_base_amount($debit_id);
            break;
        case "us-ca":
            $credit_id = $us_id;
            $debit_id = $ca_id;
            $transfer_credit_balance = get_us_base_amount($credit_id);
            $dat_credit_balance = get_ca_base_amount($debit_id);
            break;
    }



    /******************************转账记录表(ba_out、ca_out、ba_in不存)***************************************************/
    if ($type!='ba_out' && $type!='ca_out' && $type!='ba_in'){
        //赠送者
        $transfer['hash_id'] = hash('sha256', $credit_id . $flag . '127.0.0.1' . $time . rand(1000, 9999) . microtime());
        $prvs_hash = get_pre_hash($credit_id);
        $transfer['prvs_hash'] = $prvs_hash === 0 ? hash('sha256',$credit_id) : $prvs_hash;
        $transfer['credit_id'] = $credit_id;
        $transfer['debit_id'] = $debit_id;
        $transfer['tx_amount'] = -$send_money;
        $transfer['credit_balance'] = $transfer_credit_balance;
        $transfer['tx_hash'] = hash('sha256', $credit_id . $flag . '127.0.0.1' . $time . microtime());
        $transfer['flag'] = $flag;
        $transfer['transfer_type'] = $transfer_type;
        $transfer['transfer_state'] = 1;
        $transfer['tx_detail'] = $detail;
        $transfer['give_or_receive'] = 1;
        $transfer['ctime'] = strtotime($time);
        $transfer['utime'] = $time;
        $transfer['tx_count'] = transfer_get_pre_count($credit_id);
        $sql = $db->sqlInsert("com_transfer_request", $transfer);
        $id = $db->query($sql);
        if (!$id){
            echo $us_id."转账记录表1错误";
        }

        //接收者
        $dat['hash_id'] = hash('sha256', $debit_id . $flag . '127.0.0.1' . $time . rand(1000, 9999) . microtime());
        $prvs_hash = get_pre_hash($debit_id);
        $dat['prvs_hash'] = $prvs_hash === 0 ? hash('sha256',$debit_id) : $prvs_hash;
        $dat['credit_id'] = $debit_id;
        $dat['debit_id'] = $credit_id;
        $dat['tx_amount'] = $send_money;
        $dat['credit_balance'] = $dat_credit_balance;
        $dat['tx_hash'] = hash('sha256', $debit_id . $flag . '127.0.0.1' . $time . microtime());
        $dat['flag'] = $flag;
        $dat['transfer_type'] = $transfer_type;
        $dat['transfer_state'] = 1;
        $dat['tx_detail'] = $detail;
        $dat['give_or_receive'] = 2;
        $dat['ctime'] = strtotime($time);
        $dat['utime'] = $time;
        $dat['tx_count'] = transfer_get_pre_count($debit_id);

        $sql = $db->sqlInsert("com_transfer_request", $dat);
        $id = $db->query($sql);
        if (!$id){
            echo $us_id."转账记录表1错误";
        }
    }
    /***********************资金变动记录表***********************************/
    //减钱记录
    $tx_id = hash('sha256', $credit_id . $debit_id . $flag . '127.0.0.1' . $time . microtime());
    $com_balance_us['hash_id'] = hash('sha256', $credit_id . $type . '127.0.0.1' . $time . rand(1000, 9999) . microtime());
    $com_balance_us['tx_id'] = $tx_id;
    $prvs_hash = get_recharge_pre_hash($credit_id);
    $com_balance_us['prvs_hash'] = $prvs_hash===0 ? hash('sha256',$credit_id) : $prvs_hash;
    $com_balance_us["credit_id"] = $credit_id;
    $com_balance_us["debit_id"] = $debit_id;
    $com_balance_us["tx_type"] = $type=="us_us_transfer" ? $type."_out" : $type;
    $com_balance_us["tx_amount"] = -$send_money;
    $com_balance_us["credit_balance"] = $transfer_credit_balance;
    $com_balance_us["utime"] = strtotime($time);
    $com_balance_us["ctime"] = $time;
    $com_balance_us['tx_count'] = base_get_pre_count($credit_id);
    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    if (!$db->query($sql)) {
        echo "资金变动记录表错误";
    }

    //加钱记录
    $com_balance_ba['hash_id'] = hash('sha256', $debit_id. $type . '127.0.0.1' . $time . rand(1000, 9999) . microtime());
    $com_balance_ba['tx_id'] = $tx_id;
    $prvs_hash = get_recharge_pre_hash($debit_id);
    $com_balance_ba['prvs_hash'] = $prvs_hash===0 ? hash('sha256',$debit_id) : $prvs_hash;
    $com_balance_ba["credit_id"] = $debit_id;
    $com_balance_ba["debit_id"] = $credit_id;
    $com_balance_ba["tx_type"] = $type=="us_us_transfer" ? $type."_in" : $type;
    $com_balance_ba["tx_amount"] = $send_money;
    $com_balance_ba["credit_balance"] = $dat_credit_balance;
    $com_balance_ba["utime"] = strtotime($time);
    $com_balance_ba["ctime"] = $time;
    $com_balance_ba['tx_count'] = base_get_pre_count($debit_id);
    $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
    if (!$db->query($sql)) {
        echo "资金变动记录表错误";
    }
}





//获取ba余额
function get_ba_base_amount($ba_id){
    $db = new DB_COM();
    $sql = "select base_amount from ba_base WHERE ba_id='{$ba_id}'";
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

function get_ba_id(){
    $db = new DB_COM();
    $sql = "select ba_id from ba_base ORDER BY ctime ASC limit 1";
    $ba_id = $db->getField($sql,'ba_id');
    if ($ba_id==null){
        return 0;
    }
    return $ba_id;
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

//获取ca id
function get_ca_id()
{
    $db = new DB_COM();
    $sql = "select ca_id from ca_base limit 1";
    $db->query($sql);
    $id = $db->getField($sql,'ca_id');
    return $id;
}

//获取ca余额
function get_ca_base_amount($ca_id){
    $db = new DB_COM();
    $sql = "select base_amount from ca_base WHERE ca_id='{$ca_id}'";
    $db->query($sql);
    $amount = $db->getField($sql,'base_amount');
    return $amount;
}

function get_us_id($invite_code){
    $db = new DB_COM();
    $sql = "select us_id from us_base WHERE us_nm='{$invite_code}'";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows['us_id'];
}


/**
 * @param $credit_id
 * @return int|mixed
 * 获取上一个交易的链高度 （com_base_balance表）
 */
function base_get_pre_count($credit_id)
{
    $db = new DB_COM();
    $sql = "select tx_count from com_base_balance where credit_id = '{$credit_id}' order by ctime desc limit 1";
    $tx_count = $db->getField($sql, 'tx_count');
    if($tx_count == null)
        return 1;

    return $tx_count+1;
}

/**
 * @param $credit_id
 * @return int|mixed
 * 获取上一个交易的链高度 （com_transfer_request表）
 */
function transfer_get_pre_count($credit_id)
{
    $db = new DB_COM();
    $sql = "select tx_count from com_transfer_request where credit_id = '{$credit_id}' order by ctime desc limit 1";
    $tx_count = $db->getField($sql, 'tx_count');
    if($tx_count == null)
        return 1;
    return $tx_count+1;
}
<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

$db = new DB_COM();

$unit = get_la_base_unit();

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
        $two_invite_send[$k]['ctime'] = date('Y-m-d H:i:s',strtotime($v['ctime'])+10);
        $two_invite_send[$k]['flag'] = 2;
        $two_invite_send[$k]['detail'] = "二级邀请赠送";
        $two_invite_send[$k]['type'] = "two_invite_send";
        $two_invite_send[$k]['transfer_type'] = "ba-us";
        $two_invite_send[$k]['transfer_us_id'] = "0";
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
}

//echo "群聊奖励:".count($bot_rows)."<br />";


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
}

//echo "点赞(点踩)(ccvt兑换积分):".count($glory)."<br />";




//兑换码兑换
$sql = "select us_id,amount as send_money,exchange_time as ctime from us_voucher WHERE is_effective=2 AND us_id!=0";
$db->query($sql);
$voucher = $db->fetchAll();
foreach ($voucher as $k=>$v){
    $voucher[$k]['send_money'] = $v['send_money']*$unit;
    $voucher[$k]['flag'] = 7;
    $voucher[$k]['detail'] = "兑换码兑换";
    $voucher[$k]['type'] = "voucher";
    $voucher[$k]['transfer_type'] = "ba-us";
    $voucher[$k]['transfer_us_id'] = "0";
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
}

//echo "升级返还:".count($scale_changes)."<br />";

//用户提现(com_transfer_request不存)
$sql = "select us_id,base_amount as send_money,FROM_UNIXTIME(tx_time,'%Y-%m-%d %H:%i:%s') as ctime from us_ba_withdraw_request WHERE qa_flag=1";
$db->query($sql);
$us_ba_withdraw_request = $db->fetchAll();
if ($us_ba_withdraw_request){
    foreach ($us_ba_withdraw_request as $k=>$v){
        $us_ba_withdraw_request[$k]['flag'] = 0;
        $us_ba_withdraw_request[$k]['detail'] = "用户提现";
        $us_ba_withdraw_request[$k]['type'] = "ba_out";
        $us_ba_withdraw_request[$k]['transfer_type'] = "us-ba";
        $us_ba_withdraw_request[$k]['transfer_us_id'] = "0";
    }
}

//echo "用户提现:".count($us_ba_withdraw_request)."<br />";

//群主返现
$sql = "select credit_id as us_id,flag,tx_amount as send_money,utime as ctime,tx_detail as detail from com_transfer_request2 WHERE flag=12 AND give_or_receive=2";
$db->query($sql);
$group_cashback = $db->fetchAll();
foreach ($group_cashback as $k=>$v){
    $group_cashback[$k]['type'] = "group_cashback";
    $group_cashback[$k]['transfer_type'] = "ba-us";
    $group_cashback[$k]['transfer_us_id'] = "0";
}

//echo "群主返现:".count($group_cashback)."<br />";

//用户转账
$sql = "select credit_id as us_id,debit_id as transfer_us_id,flag,tx_amount as send_money,utime as ctime,tx_detail as detail from com_transfer_request2 WHERE flag=13 AND give_or_receive=1";
$db->query($sql);
$us_us_transfer = $db->fetchAll();
foreach ($us_us_transfer as $k=>$v){
    $us_us_transfer[$k]['type'] = "us_us_transfer";
    $us_us_transfer[$k]['transfer_type'] = "us-us";
}

//echo "用户转账:".count($us_us_transfer)."<br />";

//踩赞返还
$sql = "select credit_id as us_id,flag,tx_amount as send_money,utime as ctime,tx_detail as detail from com_transfer_request2 WHERE flag=14 AND give_or_receive=2";
$db->query($sql);
$give_like_back = $db->fetchAll();
foreach ($give_like_back as $k=>$v){
    $give_like_back[$k]['type'] = "give_like_back";
    $give_like_back[$k]['transfer_type'] = "ba-us";
    $give_like_back[$k]['transfer_us_id'] = "0";
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
}

//echo "员工动态调整:".count($dynamic_tuning)."<br />";

//离职回收(us锁定金额给ba)
$sql = "select credit_id as us_id,tx_amount as send_money,ctime from com_base_balance2 WHERE tx_type='gone_staff' AND debit_id='6C69520E-E454-127B-F474-452E65A3EE75'";
$db->query($sql);
$gone_staff = $db->fetchAll();
foreach ($gone_staff as $k=>$v){
    $gone_staff[$k]['flag'] = 15;
    $gone_staff[$k]['detail'] = "离职回收";
    $gone_staff[$k]['type'] = "gone_staff";
    $gone_staff[$k]['transfer_type'] = "us-ba";
    $gone_staff[$k]['transfer_us_id'] = "0";
}

//echo "离职回收(us锁定金额给ba):".count($gone_staff)."<br />";


$list = array_merge($reg_user,$invite_rows,$two_invite_send,$bot_rows,$glory,$voucher,$tiaozhang,$scale_changes,$us_ba_withdraw_request,$group_cashback,$us_us_transfer,$give_like_back,$suocang,$big_us_interest,$dynamic_tuning,$gone_staff);
array_multisort(array_column($list,'ctime'),SORT_ASC,$list);

//print_r(json_encode($list));
////echo count($list);
//die;

$ba_id = get_ba_id();
$la_id = get_la_id();
foreach ($list as $k=>$v){
    set_time_limit(0);
    echo $v;
    die;
    into_transfer($v['us_id'],$v['send_money'],$v['ctime'],$v['flag'],$v['detail'],$v['type'],$v['transfer_type'],$ba_id,$la_id,$v['transfer_us_id']);
}


echo "ok";


//ba-us(分给余额加减和锁定余额   锁仓余额(big_us_lock)、员工动态调整(dynamic_tuning)这两个是加锁定余额)  us-la(点赞)  us-us(转账)   us-ba(离职回收,用户提现)
function into_transfer($us_id,$send_money,$time,$flag,$detail,$type,$transfer_type,$ba_id,$la_id,$transfer_us_id){
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
            $sql .= "WHERE us_id='{$us_id}'";
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
        case "us-la":
            //用户减钱
            $sql = "update us_base set base_amount=base_amount-'{$send_money}' WHERE us_id='{$us_id}'";
            echo $sql."3"."<br />";
            $db -> query($sql);
            if (!$db->affectedRows()){
                echo "us减钱2错误";
            }

            //la加钱
            $sql = "update la_base set base_amount=base_amount+'{$send_money}' limit 1";
            echo $sql."4"."<br />";
            $db->query($sql);
            if (!$db->affectedRows()){
                echo "la加钱2错误";
            }
        case "us-us":
            //用户减钱
            $sql = "update us_base set base_amount=base_amount-'{$send_money}' WHERE us_id='{$us_id}'";
            echo $sql."5"."<br />";
            $db -> query($sql);
            if (!$db->affectedRows()){
                echo "us减钱3错误";
            }

            //用户加钱
            $sql = "update us_base set base_amount=base_amount+'{$send_money}' WHERE us_id='{$transfer_us_id}'";
            echo $sql."6"."<br />";
            $db -> query($sql);
            if (!$db->affectedRows()){
                echo "us加钱3错误";
            }
        case "us-ba":
            $sql = "update us_base set";
            if ($type=='gone_staff'){
                //用户锁定减钱
                $sql .= "set lock_amount=lock_amount-'{$send_money}'";
            }elseif ($type=='ba_out'){
                //用户可用余额减钱
                $sql .= "set base_amount=base_amount-'{$send_money}'";
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

    }


/******************************转账记录表(提现不存)***************************************************/
    if ($transfer_type=='ba-us'){
        //赠送者
        $data['hash_id'] = hash('md5', $ba_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
        $prvs_hash = get_pre_hash($ba_id);
        $data['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$ba_id) : $prvs_hash;
        $data['credit_id'] = $ba_id;
        $data['debit_id'] = $us_id;
        $data['tx_amount'] = $send_money;
        $data['credit_balance'] = get_ba_base_amount($ba_id);
        $data['tx_hash'] = hash('md5', $ba_id . $flag . get_ip() . time() . microtime());
        $data['flag'] = $flag;
        $data['transfer_type'] = $transfer_type;
        $data['transfer_state'] = 1;
        $data['tx_detail'] = $detail;
        $data['give_or_receive'] = 1;
        $data['ctime'] = strtotime($time);
        $data['utime'] = $time;
        $sql = $db->sqlInsert("com_transfer_request", $data);
        $id = $db->query($sql);
        if (!$id){
            echo $us_id."转账记录表1错误";
        }

        //接收者
        $dat['hash_id'] = hash('md5', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
        $prvs_hash = get_pre_hash($us_id);
        $dat['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$us_id) : $prvs_hash;
        $dat['credit_id'] = $us_id;
        $dat['debit_id'] = $ba_id;
        $dat['tx_amount'] = $send_money;
        $dat['credit_balance'] = get_us_base_amount($us_id);
        $dat['tx_hash'] = hash('md5', $us_id . $flag . get_ip() . time() . microtime());
        $dat['flag'] = $flag;
        $dat['transfer_type'] = $transfer_type;
        $dat['transfer_state'] = 1;
        $dat['tx_detail'] = $detail;
        $dat['give_or_receive'] = 2;
        $dat['ctime'] = strtotime($time);
        $dat['utime'] = $time;
        $sql = $db->sqlInsert("com_transfer_request", $dat);
        $id = $db->query($sql);
        if (!$id){
            echo $us_id."转账记录表1错误";
        }
    }elseif ($transfer_type=='us-la'){
        //赠送者
        $transfer['hash_id'] = hash('md5', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
        $prvs_hash = get_pre_hash($us_id);
        $transfer['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$us_id) : $prvs_hash;
        $transfer['credit_id'] = $us_id;
        $transfer['debit_id'] = $la_id;
        $transfer['tx_amount'] = $send_money;
        $transfer['credit_balance'] = get_us_base_amount($us_id);
        $transfer['tx_hash'] = hash('md5', $us_id . $flag . get_ip() . time() . microtime());
        $transfer['flag'] = $flag;
        $transfer['transfer_type'] = $transfer_type;
        $transfer['transfer_state'] = 1;
        $transfer['tx_detail'] = $detail;
        $transfer['give_or_receive'] = 1;
        $transfer['ctime'] = strtotime($time);
        $transfer['utime'] = $time;
        $sql = $db->sqlInsert("com_transfer_request", $transfer);
        $id = $db->query($sql);
        if (!$id){
            echo $us_id."转账记录表2错误";
        }

        //接收者(la)
        $dat['hash_id'] = hash('md5', $la_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
        $prvs_hash = get_pre_hash($la_id);
        $dat['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$la_id) : $prvs_hash;
        $dat['credit_id'] = $la_id;
        $dat['debit_id'] = $us_id;
        $dat['tx_amount'] = $send_money;
        $dat['credit_balance'] = get_la_base_amount($la_id);
        $dat['tx_hash'] = hash('md5', $la_id . $flag . get_ip() . time() . microtime());
        $dat['flag'] = $flag;
        $dat['transfer_type'] = $transfer_type;
        $dat['transfer_state'] = 1;
        $dat['tx_detail'] = $detail;
        $dat['give_or_receive'] = 2;
        $dat['ctime'] = strtotime($time);
        $dat['utime'] = $time;
        $sql = $db->sqlInsert("com_transfer_request", $dat);
        $id = $db->query($sql);
        if (!$id){
            echo $la_id."转账记录表2错误";
        }
    }elseif ($transfer_type=='us-us'){
        //赠送者
        $transfer['hash_id'] = hash('md5', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
        $prvs_hash = get_pre_hash($us_id);
        $transfer['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$us_id) : $prvs_hash;
        $transfer['credit_id'] = $us_id;
        $transfer['debit_id'] = $transfer_us_id;
        $transfer['tx_amount'] = $send_money;
        $transfer['credit_balance'] = get_us_base_amount($us_id);
        $transfer['tx_hash'] = hash('md5', $us_id . $flag . get_ip() . time() . microtime());
        $transfer['flag'] = $flag;
        $transfer['transfer_type'] = $transfer_type;
        $transfer['transfer_state'] = 1;
        $transfer['tx_detail'] = $detail;
        $transfer['give_or_receive'] = 1;
        $transfer['ctime'] = strtotime($time);
        $transfer['utime'] = $time;
        $sql = $db->sqlInsert("com_transfer_request", $transfer);
        $id = $db->query($sql);
        if (!$id){
            echo $us_id."转账记录表3错误";
        }

        //接收者(us)
        $dat['hash_id'] = hash('md5', $transfer_us_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
        $prvs_hash = get_pre_hash($transfer_us_id);
        $dat['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$transfer_us_id) : $prvs_hash;
        $dat['credit_id'] = $transfer_us_id;
        $dat['debit_id'] = $us_id;
        $dat['tx_amount'] = $send_money;
        $dat['credit_balance'] = get_us_base_amount($transfer_us_id);
        $dat['tx_hash'] = hash('md5', $transfer_us_id . $flag . get_ip() . time() . microtime());
        $dat['flag'] = $flag;
        $dat['transfer_type'] = $transfer_type;
        $dat['transfer_state'] = 1;
        $dat['tx_detail'] = $detail;
        $dat['give_or_receive'] = 2;
        $dat['ctime'] = strtotime($time);
        $dat['utime'] = $time;
        $sql = $db->sqlInsert("com_transfer_request", $dat);
        $id = $db->query($sql);
        if (!$id){
            echo $transfer_us_id."转账记录表3错误";
        }
    }elseif ($transfer_type=='us-ba'){
        if ($type!='ba_out'){
            //赠送者(us)
            $transfer['hash_id'] = hash('md5', $us_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
            $prvs_hash = get_pre_hash($us_id);
            $transfer['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$us_id) : $prvs_hash;
            $transfer['credit_id'] = $us_id;
            $transfer['debit_id'] = $ba_id;
            $transfer['tx_amount'] = $send_money;
            $transfer['credit_balance'] = get_us_base_amount($us_id);
            $transfer['tx_hash'] = hash('md5', $us_id . $flag . get_ip() . time() . microtime());
            $transfer['flag'] = $flag;
            $transfer['transfer_type'] = $transfer_type;
            $transfer['transfer_state'] = 1;
            $transfer['tx_detail'] = $detail;
            $transfer['give_or_receive'] = 1;
            $transfer['ctime'] = strtotime($time);
            $transfer['utime'] = $time;
            $sql = $db->sqlInsert("com_transfer_request", $transfer);
            $id = $db->query($sql);
            if (!$id){
                echo $us_id."转账记录表4错误";
            }

            //接收者(ba)
            $dat['hash_id'] = hash('md5', $ba_id . $flag . get_ip() . time() . rand(1000, 9999) . microtime());
            $prvs_hash = get_pre_hash($ba_id);
            $dat['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$ba_id) : $prvs_hash;
            $dat['credit_id'] = $ba_id;
            $dat['debit_id'] = $us_id;
            $dat['tx_amount'] = $send_money;
            $dat['credit_balance'] = get_ba_base_amount($ba_id);
            $dat['tx_hash'] = hash('md5', $ba_id . $flag . get_ip() . time() . microtime());
            $dat['flag'] = $flag;
            $dat['transfer_type'] = $transfer_type;
            $dat['transfer_state'] = 1;
            $dat['tx_detail'] = $detail;
            $dat['give_or_receive'] = 2;
            $dat['ctime'] = strtotime($time);
            $dat['utime'] = $time;
            $sql = $db->sqlInsert("com_transfer_request", $dat);
            $id = $db->query($sql);
            if (!$id){
                echo $la_id."转账记录表4错误";
            }
        }
    }


    /***********************资金变动记录表***********************************/
    if ($transfer_type=='ba-us'){
        //us添加基准资产变动记录
        $com_balance_us['hash_id'] = hash('md5', $us_id . $type . get_ip() . time() . rand(1000, 9999) . microtime());
        $com_balance_us['tx_id'] = $dat['tx_hash'];
        $prvs_hash = get_recharge_pre_hash($us_id);
        $com_balance_us['prvs_hash'] = $prvs_hash===0 ? hash('md5',$us_id) : $prvs_hash;
        $com_balance_us["credit_id"] = $us_id;
        $com_balance_us["debit_id"] = $ba_id;
        $com_balance_us["tx_type"] = $type;
        $com_balance_us["tx_amount"] = $send_money;
        $com_balance_us["credit_balance"] = get_us_base_amount($us_id);
        $com_balance_us["utime"] = strtotime($time);
        $com_balance_us["ctime"] = $time;

        $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
        if (!$db->query($sql)) {
            echo $us_id."资金变动1记录表错误";
        }

        //ba添加基准资产变动记录
        $com_balance_ba['hash_id'] = hash('md5', $ba_id. $type . get_ip() . time() . rand(1000, 9999) . microtime());
        $com_balance_ba['tx_id'] = $data['tx_hash'];
        $prvs_hash = get_recharge_pre_hash($ba_id);
        $com_balance_ba['prvs_hash'] = $prvs_hash===0 ? hash('md5',$ba_id) : $prvs_hash;
        $com_balance_ba["credit_id"] = $ba_id;
        $com_balance_ba["debit_id"] = $us_id;
        $com_balance_ba["tx_type"] = $type;
        $com_balance_ba["tx_amount"] = $send_money;
        $com_balance_ba["credit_balance"] = get_ba_base_amount($ba_id);
        $com_balance_ba["utime"] = strtotime($time);
        $com_balance_ba["ctime"] = $time;
        $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
        if (!$db->query($sql)) {
            echo $ba_id."资金变动1记录表错误";
        }
    }elseif ($transfer_type=='us-la'){
        //us添加基准资产变动记录
        $com_balance_us['hash_id'] = hash('md5', $us_id . $type . get_ip() . time() . rand(1000, 9999) . microtime());
        $com_balance_us['tx_id'] = $transfer['tx_hash'];
        $prvs_hash = get_recharge_pre_hash($us_id);
        $com_balance_us['prvs_hash'] = $prvs_hash===0 ? hash('md5',$us_id) : $prvs_hash;
        $com_balance_us["credit_id"] = $us_id;
        $com_balance_us["debit_id"] = $la_id;
        $com_balance_us["tx_type"] = $type;
        $com_balance_us["tx_amount"] = $send_money;
        $com_balance_us["credit_balance"] = get_us_base_amount($us_id);
        $com_balance_us["utime"] = strtotime($time);
        $com_balance_us["ctime"] = $time;
        $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
        if (!$db->query($sql)) {
            echo $us_id."资金变动2记录表错误";
        }

        //la添加基准资产变动记录
        $com_balance_ba['hash_id'] = hash('md5', $la_id. $type . get_ip() . time() . rand(1000, 9999) . microtime());
        $com_balance_ba['tx_id'] = $dat['tx_hash'];
        $prvs_hash = get_recharge_pre_hash($la_id);
        $com_balance_ba['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$la_id) : $prvs_hash;
        $com_balance_ba["credit_id"] = $la_id;
        $com_balance_ba["debit_id"] = $us_id;
        $com_balance_ba["tx_type"] = $type;
        $com_balance_ba["tx_amount"] = $send_money;
        $com_balance_ba["credit_balance"] = get_la_base_amount($la_id);
        $com_balance_ba["utime"] = strtotime($time);
        $com_balance_ba["ctime"] = $time;
        $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
        if (!$db->query($sql)) {
            echo $la_id."资金变动2记录表错误";
        }
    }elseif ($transfer_type=='us-us'){
        //us添加基准资产变动记录
        $com_balance_us['hash_id'] = hash('md5', $us_id . $type . get_ip() . time() . rand(1000, 9999) . microtime());
        $com_balance_us['tx_id'] = $transfer['tx_hash'];
        $prvs_hash = get_recharge_pre_hash($us_id);
        $com_balance_us['prvs_hash'] = $prvs_hash===0 ? hash('md5',$us_id) : $prvs_hash;
        $com_balance_us["credit_id"] = $us_id;
        $com_balance_us["debit_id"] = $transfer_us_id;
        $com_balance_us["tx_type"] = $type."_out";
        $com_balance_us["tx_amount"] = $send_money;
        $com_balance_us["credit_balance"] = get_us_base_amount($us_id);
        $com_balance_us["utime"] = strtotime($time);
        $com_balance_us["ctime"] = $time;
        $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
        if (!$db->query($sql)) {
            echo $us_id."资金变动3记录表错误";
        }

        //us添加基准资产变动记录
        $com_balance_ba['hash_id'] = hash('md5', $transfer_us_id. $type . get_ip() . time() . rand(1000, 9999) . microtime());
        $com_balance_ba['tx_id'] = $dat['tx_hash'];
        $prvs_hash = get_recharge_pre_hash($transfer_us_id);
        $com_balance_ba['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$transfer_us_id) : $prvs_hash;
        $com_balance_ba["credit_id"] = $transfer_us_id;
        $com_balance_ba["debit_id"] = $us_id;
        $com_balance_ba["tx_type"] = $type."_in";
        $com_balance_ba["tx_amount"] = $send_money;
        $com_balance_ba["credit_balance"] = get_us_base_amount($transfer_us_id);
        $com_balance_ba["utime"] = strtotime($time);
        $com_balance_ba["ctime"] = $time;
        $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
        if (!$db->query($sql)) {
            echo $transfer_us_id."资金变动3记录表错误";
        }
    }elseif ($transfer_type=='us-ba'){
        //us添加基准资产变动记录
        $com_balance_us['hash_id'] = hash('md5', $us_id . $type . get_ip() . time() . rand(1000, 9999) . microtime());
        $com_balance_us['tx_id'] = $transfer['tx_hash'];
        $prvs_hash = get_recharge_pre_hash($us_id);
        $com_balance_us['prvs_hash'] = $prvs_hash===0 ? hash('md5',$us_id) : $prvs_hash;
        $com_balance_us["credit_id"] = $us_id;
        $com_balance_us["debit_id"] = $transfer_us_id;
        $com_balance_us["tx_type"] = $type;
        $com_balance_us["tx_amount"] = $send_money;
        $com_balance_us["credit_balance"] = get_us_base_amount($us_id);
        $com_balance_us["utime"] = strtotime($time);
        $com_balance_us["ctime"] = $time;
        $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
        if (!$db->query($sql)) {
            echo $us_id."资金变动4记录表错误";
        }

        //ba添加基准资产变动记录
        $com_balance_ba['hash_id'] = hash('md5', $ba_id. $type . get_ip() . time() . rand(1000, 9999) . microtime());
        $com_balance_ba['tx_id'] = $dat['tx_hash'];
        $prvs_hash = get_recharge_pre_hash($ba_id);
        $com_balance_ba['prvs_hash'] = $prvs_hash === 0 ? hash('md5',$ba_id) : $prvs_hash;
        $com_balance_ba["credit_id"] = $ba_id;
        $com_balance_ba["debit_id"] = $us_id;
        $com_balance_ba["tx_type"] = $type;
        $com_balance_ba["tx_amount"] = $send_money;
        $com_balance_ba["credit_balance"] = get_ba_base_amount($ba_id);
        $com_balance_ba["utime"] = strtotime($time);
        $com_balance_ba["ctime"] = $time;
        $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
        if (!$db->query($sql)) {
            echo $ba_id."资金变动4记录表错误";
        }
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

function get_us_id($invite_code){
    $db = new DB_COM();
    $sql = "select us_id from us_base WHERE us_nm='{$invite_code}'";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows['us_id'];
}
<?php

//======================================
// 函数: 获取兑换码记录总数
//======================================
function  get_voucher_list_total()
{
    $db = new DB_COM();
    $sql = "SELECT id FROM us_voucher 1";
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}


//======================================
// 函数: 获取账户变动记录
// 参数: us_id            用户id
// 返回: rows             用户登录信息数组
//        chg_type           变动类型(ca_in/out:CA充值提现，ba_in/out:BA充值提现，us_in/out:用户转入转出)
//        chg_amount         变动金额
//        chg_balance        变动后账户余额
//        prvs_hash          交易HASH
//        ctime              变动时间
//======================================
function get_voucher_list($offset,$limit)
{
    $db = new DB_COM();
    $sql = "SELECT coupon_code,amount,a.ctime,is_effective,expiry_date,exchange_time,b.us_account FROM us_voucher as a left JOIN us_base as b on a.us_id=b.us_id WHERE 1 order by ctime desc limit $offset , $limit";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}

<?php

//======================================
// 函数: 获取兑换码记录总数
//======================================
function  get_voucher_list_total($is_effective)
{
    $db = new DB_COM();
    $sql = "SELECT id FROM us_voucher";
    if ($is_effective){
        $sql .= " where is_effective='{$is_effective}'";
    }
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
function get_voucher_list($offset,$limit,$is_effective)
{
    $db = new DB_COM();
    $sql = "SELECT id,coupon_code,amount,a.ctime,is_effective,expiry_date,exchange_time,a.us_id,b.us_account FROM us_voucher as a left JOIN us_base as b on a.us_id=b.us_id ";
    if ($is_effective){
        $sql .= " where is_effective='{$is_effective}'";
    }
    $sql .= " order by ctime desc limit $offset , $limit";
    $db->query($sql);
    $rows = $db->fetchAll();
    foreach ($rows as $k=>$v){
        if ($v['is_effective']==1){
            if (date("Y-m-d H:i:s")>$v['expiry_date']){
                $sql = "update us_voucher set is_effective=2 WHERE id='{$v['id']}'";
                $db->query($sql);
            }
        }
    }
    return $rows;
}

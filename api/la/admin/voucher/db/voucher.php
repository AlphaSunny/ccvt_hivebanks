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
// 函数: 获取兑换码记录记录
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


//======================================
// 函数: 生成兑换码
//======================================
function voucher_add($num,$price,$expiry_date)
{
    $db = new DB_COM();
    for($i=0;$i<$num;$i++){
        $data['id'] = get_guid();
        $data['coupon_code'] = "ccvt-".randomkeys(8);
        $data['amount'] = $price;
        $data['ctime'] = date('Y-m-d H:i:s');
        $data['utime'] = time();
        $data['effective_date'] = date('Y-m-d H:i:s');
        $data['expiry_date'] = $expiry_date;
        $sql = $db->sqlInsert("us_voucher", $data);
        $db->query($sql);
    }
    return true;
}
function randomkeys($length)
{
    $key= '';
    $pattern = '123456789abcdefghjklmnpqrstuvwxyz';
    for($i=0;$i<$length;$i++)
    {
        $key .= $pattern{mt_rand(0,30)};    //生成php随机数
    }
    return $key;
}
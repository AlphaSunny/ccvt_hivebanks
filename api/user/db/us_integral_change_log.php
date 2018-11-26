<?php

//======================================
// 函数: 获取荣耀积分变动记录
// 参数: us_id        用户id
// 返回: rows
//======================================
function  us_integral_change_log($us_id)
{  
    $db = new DB_COM();
    $unit = get_la_base_unit();
    $sql = "select tx_amount/'{$unit}' as tx_amount,utime,tx_detail from us_glory_integral_change_log WHERE debit_id='{$us_id}'";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}

<?php

//======================================
// 获取ca资金总和
// 参数:
// 返回:rows                       信息数组
//      sum(base_amount)           基准资金总和
//      sum(lock_amount)            锁定资金总和
//======================================
function get_la_sum_amout_info()
{
    $db = new DB_COM();
    $sql = "SELECT sum(base_amount) FROM la_base";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}


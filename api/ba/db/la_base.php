<?php

//======================================
// 获取设定的账户的基准数字货币代理
// 参数:
// 返回: $rows["base_currency"]   基准货币类型
//======================================
function get_la_base_base_currency()
{
    $db = new DB_COM();
    $sql = "SELECT base_currency FROM la_base limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows["base_currency"];
}
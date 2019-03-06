<?php

//======================================
// 函数: 获取la的基本信息
// 参数:
// 返回: row     信息数组
//======================================
function get_la_base_info()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM la_base";
    $db->query($sql);
    $row = $db->fetchRow();
    if ($row){
        $sql = "select ctime from la_admin order  by ctime ASC limit 1";
        $db->query($sql);
        $ctime = $db->getField($sql,'ctime');
        $row['ctime'] = date('Y-m-d H:i:s',$ctime);
    }
    return $row;
}
<?php

//======================================
// 函数: 转账总数查询
// 参数: us_id         用户id
//      type          查询类型
// 返回: count         记录总数
//======================================
function get_transfer_ccvt_total($us_id,$type)
{
    $db = new DB_COM();
    $sql = "select qa_id from us_us_transfer_request where";
    switch ($type){
        case 1:
            $sql .= " us_id='{$us_id}'";
            break;
        case 2:
            $sql .= " transfer_id='{$us_id}'";
    }
    $db->query($sql);
    return $count = $db->affectedRows();
}
//======================================
// 函数: 转账记录查询
// 参数: us_id         用户id
//      offset        查询起始位置
//      limit         查询个数
//      type          查询类型
// 返回: rows          查询数组
//======================================
function get_transfer_ccvt_list($us_id,$offset,$limit,$type)
{
    $db = new DB_COM();
    $unit = get_la_base_unit();
    $sql = "select qa_id,tx_amount/'{$unit}' as tx_amount,tx_time,qa_flag,b.us_account from us_us_transfer_request as a LEFT JOIN us_base as b ON";
    switch ($type){
        case 1:
            $sql .= " a.transfer_id=b.us_id where a.us_id='{$us_id}'";
            break;
        case 2:
            $sql .= " a.us_id=b.us_id where a.transfer_id='{$us_id}'";
            break;
    }
    $sql .= " order by a.tx_time limit $offset,$limit";
    $db->query($sql);
    return $res = $db->fetchAll();
}

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
    $sql = "select qa_id from us_us_transfer_request where us_id='{$us_id}'";
    switch ($type){
        case 1:
            $sql .= " AND qa_flag=0";
            break;
        case 2:
            $sql .= "  OR transfer_id='{$us_id}' AND qa_flag!=0";
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
    if ($type==1){
        $sql = "select qa_id,tx_amount/'{$unit}' as tx_amount,tx_time,qa_flag,b.us_account from us_us_transfer_request as a LEFT JOIN us_base as b ON a.transfer_id=b.us_id WHERE a.us_id='{$us_id}' AND qa_flag=0 order by a.tx_time limit $offset,$limit";
        $db->query($sql);
        $rows = $db->fetchAll();
    }else{
        $sql = "select qa_id,tx_amount/'{$unit}' as tx_amount,tx_time,qa_flag,b.us_account from us_us_transfer_request as a LEFT JOIN us_base as b ON a.transfer_id=b.us_id WHERE a.us_id='{$us_id}' AND qa_flag=0";
        $db->query($sql);
        $row1 = $db->fetchAll();
        foreach ($row1 as $k=>$v){
            $row1[$k]['in_or_out'] = 'out';
        }
        $sql = "select qa_id,tx_amount/'{$unit}' as tx_amount,tx_time,qa_flag,b.us_account from us_us_transfer_request as a LEFT JOIN us_base as b ON a.us_id=b.us_id WHERE a.transfer_id='{$us_id}' AND qa_flag!=0";
        $db->query($sql);
        $row2 = $db->fetchAll();
        foreach ($row2 as $k=>$v){
            $row2[$k]['in_or_out'] = 'in';
        }
        $rows = array_merge($row1,$row2);
        array_multisort(array_column($rows,'tx_time'),SORT_DESC,$rows);
        $rows = array_slice($rows,$offset,$limit);
    }

    return $rows;
}

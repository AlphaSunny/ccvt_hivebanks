<?php

//======================================
//  获取ba的列表
// 参数:
// 返回: rows          ba信息数组
//        ba_id        baID
//       ba_nm         代理商编号（内部唯一）
//       ba_account    代理商表示账号（内部唯一）
//       base_amount   基准资产余额
//       lock_amount   锁定余额
//       ba_type       代理商类型
//       ba_level      代理商等级
//       security_level安全等级
//       utime         更新时间
//       ctime         创建时间
//======================================
function get_ba_base_info()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_base";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}

/**
 * @param $flag
 * @return array
 * 1：注册赠送  2：邀请赠送  3：ba调账赠送   4:群聊奖励 5:全部
 */
function ba_gift($flag)
{
    $db = new DB_COM();
    if($flag!=5) {
        $sql = "select a.tx_amount/(select unit from la_base limit 1) as amount,a.tx_detail,
        b.us_account,b.wechat,DATE_FORMAT(FROM_UNIXTIME(a.ctime), '%Y-%m-%d %H:%i:%s') AS gift_time
      from com_transfer_request a ,us_base b where a.credit_id=b.us_id and a.flag='{$flag}'  order by a.ctime desc ;";
    }else{
        $sql = "select a.tx_amount/(select unit from la_base limit 1) as amount,a.tx_detail,
        b.us_account,b.wechat,DATE_FORMAT(FROM_UNIXTIME(a.ctime), '%Y-%m-%d %H:%i:%s') AS gift_time
      from com_transfer_request a ,us_base b where a.credit_id=b.us_id  order by a.ctime desc ;";
    }
    $db->query($sql);
    return $db->fetchAll();

}
////======================================
////  查询ba
//// 参数: ba_id         ba的id
//// 返回:
////       count        影响的行数
////======================================
//function get_ba_by_ba_id($ba_id){
//    $db = new DB_COM();
//    $sql = "select * from ba_base where ba_id='{$ba_id}' ";
//    $db->query($sql);
//    return $count = $db->affectedRows();
//}

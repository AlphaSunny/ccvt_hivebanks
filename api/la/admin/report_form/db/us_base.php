<?php

//======================================
// 获取用户资金总和
// 参数:
// 返回:rows                       信息数组
//      sum(base_amount)           基准资金总和
//      sum(lock_amount)            锁定资金总和
//======================================
function get_us_sum_amout_info()
{
    $db = new DB_COM();
    $sql = "SELECT sum(base_amount),sum(lock_amount) FROM us_base";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
// 获取注册ca数量
// 参数:  begin_limit_time     查询起始时间
//       end_limit_time       查询截至时间
// 返回: rows                  求和总数
//======================================
function get_us_sum_register_amout_info($begin_limit_time,$end_limit_time)
{
    $where ='';
    if($begin_limit_time){
        $where .= "tx_time >= '{$begin_limit_time}'";
    }
    if($end_limit_time){
        if($where){
            $where .= "AND tx_time <= '{$end_limit_time}'";
        }else{
            $where .= "tx_time <= '{$end_limit_time}'";
        }
    }
    if($where){
        $sql = "SELECT count(*) FROM us_base where '{$where}'";
    }else{
        $sql = "SELECT count(*) FROM us_base  ";
    }
    $db = new DB_COM();
//    $sql = "SELECT count(*) FROM us_base where ctime >= '{$begin_limit_time}' and ctime <= '{$end_limit_time}'";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows;
}

/**
 * @return array
 * ccvt赠送情况
 * IG:邀请总数
 * NDAG:国庆之后送出
 * NDBG:国庆之前送出
 * NDG:国庆节送出
 */
function gift_data(){
    $db = new DB_COM();
    $data = array();
    $sql_invite = "SELECT count(us_id)*50 as IG FROM us_base where invite_code!=0";
    $db->query($sql_invite);
    $rows_invite = $db->fetchRow();

    $sql_national_day = "SELECT count(us_id)*500 as NDG FROM us_base where ctime>'2018-09-30 23:59:59' and ctime<'2018-10-07 23:59:59'";
    $db->query($sql_national_day);
    $rows_national_day = $db->fetchRow();

    $sql_national_day_before = "SELECT count(us_id)*1000 as NDBG FROM us_base where ctime<'2018-09-30 23:59:59'";
    $db->query($sql_national_day_before);
    $rows_national_day_before = $db->fetchRow();

    $sql_national_day_after = "SELECT count(us_id)*50 as NDAG FROM us_base where  ctime>'2018-10-07 23:59:59'";
    $db->query($sql_national_day_after);
    $rows_national_day_after = $db->fetchRow();

    $data[] = array('t'=>$rows_invite['IG']+$rows_national_day_after['NDAG']+$rows_national_day_before['NDBG']+$rows_national_day['NDG']);
    $data[] = $rows_invite;
    $data[] = $rows_national_day;
    $data[] = $rows_national_day_before;
    $data[] = $rows_national_day_after;
    return $data;

}

/**
 * @return array
 * gift ccvt of register invite
 */
function gift_detail(){

    $db = new DB_COM();
    $sql_origin = "select sum(tx_amount)/100000000 as base_amount,credit_id as id
from com_base_balance  where tx_type in ('two_invite_send','reg_send') and debit_id = '6C69520E-E454-127B-F474-452E65A3EE75' 
and ctime>'2018-11-26' group by credit_id  order by base_amount desc;";
    $res_origin  = $db->query($sql_origin);
    $res_origin  = $db->fetchAll();
    foreach ($res_origin as $key=>$value)
    {
        $us_id = $value['id'];
        $sql = "select a.bind_info,a.bind_name from us_bind a   where a.us_id = '{$us_id}'";
        $res = $db->query($sql);
        $res = $db->fetchAll();
        foreach ($res as $k=>$v)
        {
            switch ($v['bind_name'])
            {
                case 'phone':
                    $res_origin[$key]['cellphone'] = substr($v['bind_info'],3);
                    break;
                case 'wechat':
                    $res_origin[$key]['wechat'] = $v['bind_info'];
                    break;
                case 'email':
                    $res_origin[$key]['email'] = $v['bind_info'];
                    break;
            }
        }

//        $sql_base = "select "
//        $res_origin[$key]['us_account'] = $res['us_account'];
        $res_origin[$key]['rank'] = $key+1;

    }
    return $res_origin;

//    $sql = "select a.invite_code,count(a.us_id) as count,
//(select us_account as us_account from us_base where us_nm=a.invite_code) as us_account,
//(select base_amount/(select unit from la_base limit 1) as us_account from us_base where us_nm=a.invite_code) as base_amount,
//(select us_id from us_base where us_nm=a.invite_code) as id,
//(select bind_info from us_bind where us_id=id and bind_type='text' and bind_name='cellphone' limit 1) as phone,
//(select bind_info from us_bind where us_id=id and bind_type='text' and bind_name='wechat' limit 1) as wechat,
//(select bind_info from us_bind where us_id=id and bind_type='text' and bind_name='email' limit 1) as email
//from us_base as a where invite_code!=0 and a.ctime>'2018-12-20' group by invite_code order by count desc; ";
//    $db->query($sql);
//    $rows = $db->fetchAll();
//    foreach ($rows as $k=>$v)
//    {
//        $rows[$k]['rank'] = $k+1;
//    }
//    return $rows;
}

/**
 * @param $day
 * @return array
 * 返回最近$day天的用户注册数
 */
function reg_daily($day){
    $db = new DB_COM();
    $sql = "select count(us_id) as num,DATE_FORMAT(FROM_UNIXTIME(UNIX_TIMESTAMP(ctime)), '%Y-%m-%d') as date 
            from us_base where DATE_FORMAT(FROM_UNIXTIME(UNIX_TIMESTAMP(ctime)), '%Y-%m-%d') between 
            date_sub(curdate(),interval {$day} day) and date_sub(curdate(),interval 1 day) group by DATE_FORMAT(FROM_UNIXTIME(UNIX_TIMESTAMP(ctime)), '%Y-%m-%d')";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}

/**
 * @param $day
 * @return array
 * 返回最近$day天的用户余额总额
 */
function total_daily($day){

    $data = array();
    $db = new DB_COM();

    for($day ;$day>0 ;$day--){

        $sql = "select sum(base_amount)/(select unit from la_base) as us_sum 
              from us_base where DATE_FORMAT(FROM_UNIXTIME(UNIX_TIMESTAMP(ctime)), '%Y-%m-%d') between 
              date_sub(curdate(),interval 99999 day) and date_sub(curdate(),interval {$day} day) ;";
        $db->query($sql);
        $row = $db->fetchRow();
        if($row) {
            $row['day'] = date("Y-m-d",strtotime("-$day day"));
            $row['ba_rest'] = 10000000000 - $row['us_sum'];
            $row['ca_rest'] = 0;
            $data[] = $row;
        }
    }
    return $data;
}

/**
 * @param
 * @return array
 * 荣耀积分排行
 */
function score_ranking(){

    $db = new DB_COM();
    $sql = "select a.base_amount,(SELECT wechat from us_base WHERE us_id=a.us_id) as wechat from us_asset as a WHERE a.asset_id='GLOP' ORDER BY a.base_amount DESC";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}
<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/11/30
 * Time: 下午1:32
 */

function reg_auto(){
    $db = new DB_COM();
    $sql = "select phone,name from big_account";
    $db->query($sql);
    $phones = $db->fetchAll();

    //判断有无注册信息
//    is_reg($phones);

    foreach ($phones as $k=>$v)
    {
        $tmp_phone = $v['phone'];
        $sql = "select us_id from us_bind  where SUBSTR(a.bind_info,4,100) = {$tmp_phone}";
        $db->query($sql);
        if($db->fetchRow())
            continue;
        $bind_data = array();
        $bind_data['bind_flag'] = 1;
        $bind_data['bind_info'] = sha1('wcnmm411');
        $bind_data['bind_name'] = 'password_login';
        $bind_data['bind_type'] = 'hash';
        $bind_data['us_id'] = get_guid();
        $bind_data['bind_id'] = get_guid();
        $bind_data['utime'] = time();
        $bind_data['ctime'] = date('Y-m-d H:i:s',time());

        $sql = $db->sqlInsert('us_bind',$bind_data);
        $res_pwd = $db->query($sql);

        $bind_phone = array();
        $bind_phone['bind_info'] = '86-'.$tmp_phone;
        $bind_phone['bind_type'] = 'text';
        $bind_phone['bind_name'] = 'cellphone';
        $bind_phone['us_id'] = $bind_data['us_id'];
        $bind_phone['bind_id'] = get_guid();
        $bind_phone['utime'] = time();
        $bind_phone['ctime'] = date('Y-m-d H:i:s',time());
        $bind_phone['bind_flag'] = 1;
        $db->sqlInsert('us_bind',$bind_phone);

        $sql = $db->sqlInsert('us_bind',$bind_phone);
        $res_phone = $db->query($sql);

        $base_info = array();
        $base_info['us_account'] = 'ccvt_'.$tmp_phone;
        $base_info['us_id'] = $bind_data['us_id'];
        $base_infp['base_amount'] = 50;
        $base_info['utime'] = time();
        $base_info['ctime'] = date('Y-m-d H:i:s' , time());
        $db->sqlInsert('us_base',$base_info);


        $sql = $db->sqlInsert('us_base',$base_info);
        $res_base = $db->query($sql);

        $BI_info = array();
        $BI_info['us_id'] = $base_info['us_id'];
        $BI_info['name'] = $v['name'];
        $BI_info['us_account'] = $base_info['us_account'];

        $sql = $db->sqlInsert('big_account_info',$BI_info);
        $BI_info_res = $db->query($sql);


        if(!($res_pwd&&$res_phone&&$res_base&&$BI_info_res))
            die('2');
//        gift_ccvt();



    }
}

function gift_ccvt(){

}
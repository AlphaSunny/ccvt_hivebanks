<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);



for($i=0;$i<20;$i++){
    $data['id'] = get_guid();
    $data['coupon_code'] = "ccvt-".randomkeys(8);
    $data['amount'] = 500;
    $data['ctime'] = date('Y-m-d H:i:s');
    $data['utime'] = time();
    $data['effective_date'] = date('Y-m-d H:i:s');
    $data['expiry_date'] = '2019-01-31 23:59:59';
    $db = new DB_COM();
    $sql = $db->sqlInsert("us_voucher", $data);
    $id = $db->query($sql);
    if (!$id){
        echo "添加记录失败";
    }
}

for($i=0;$i<20;$i++){
    $data['id'] = get_guid();
    $data['coupon_code'] = "ccvt-".randomkeys(8);
    $data['amount'] = 200;
    $data['ctime'] = date('Y-m-d H:i:s');
    $data['utime'] = time();
    $data['effective_date'] = date('Y-m-d H:i:s');
    $data['expiry_date'] = '2019-01-31 23:59:59';
    $db = new DB_COM();
    $sql = $db->sqlInsert("us_voucher", $data);
    $id = $db->query($sql);
    if (!$id){
        echo "添加记录失败";
    }
}
for($i=0;$i<3;$i++){
    $data['id'] = get_guid();
    $data['coupon_code'] = "ccvt-".randomkeys(8);
    $data['amount'] = 2000;
    $data['ctime'] = date('Y-m-d H:i:s');
    $data['utime'] = time();
    $data['effective_date'] = date('Y-m-d H:i:s');
    $data['expiry_date'] = '2019-01-31 23:59:59';
    $db = new DB_COM();
    $sql = $db->sqlInsert("us_voucher", $data);
    $id = $db->query($sql);
    if (!$id){
        echo "添加记录失败";
    }
}
for($i=0;$i<5;$i++){
    $data['id'] = get_guid();
    $data['coupon_code'] = "ccvt-".randomkeys(8);
    $data['amount'] = 5000;
    $data['ctime'] = date('Y-m-d H:i:s');
    $data['utime'] = time();
    $data['effective_date'] = date('Y-m-d H:i:s');
    $data['expiry_date'] = '2019-01-31 23:59:59';
    $db = new DB_COM();
    $sql = $db->sqlInsert("us_voucher", $data);
    $id = $db->query($sql);
    if (!$id){
        echo "添加记录失败";
    }
}
for($i=0;$i<1;$i++){
    $data['id'] = get_guid();
    $data['coupon_code'] = "ccvt-".randomkeys(8);
    $data['amount'] = 10000;
    $data['ctime'] = date('Y-m-d H:i:s');
    $data['utime'] = time();
    $data['effective_date'] = date('Y-m-d H:i:s');
    $data['expiry_date'] = '2019-01-31 23:59:59';
    $db = new DB_COM();
    $sql = $db->sqlInsert("us_voucher", $data);
    $id = $db->query($sql);
    if (!$id){
        echo "添加记录失败";
    }
}


//for($i=0;$i<100;$i++){
//    $data['id'] = get_guid();
//    $data['coupon_code'] = "ccvt-".randomkeys(8);
//    $data['amount'] = 50;
//    $data['ctime'] = date('Y-m-d H:i:s');
//    $data['utime'] = time();
//    $data['effective_date'] = date('Y-m-d H:i:s');
//    $data['expiry_date'] = '2018-12-31 23:59:59';
//    $db = new DB_COM();
//    $sql = $db->sqlInsert("us_voucher", $data);
//    $id = $db->query($sql);
//    if (!$id){
//        echo "添加记录失败";
//    }
//}
//
//for($i=0;$i<100;$i++){
//    $data['id'] = get_guid();
//    $data['coupon_code'] = "ccvt-".randomkeys(8);
//    $data['amount'] = 100;
//    $data['ctime'] = date('Y-m-d H:i:s');
//    $data['utime'] = time();
//    $data['effective_date'] = date('Y-m-d H:i:s');
//    $data['expiry_date'] = '2018-12-31 23:59:59';
//    $db = new DB_COM();
//    $sql = $db->sqlInsert("us_voucher", $data);
//    $id = $db->query($sql);
//    if (!$id){
//        echo "添加记录失败";
//    }
//}
//
//for($i=0;$i<50;$i++){
//    $data['id'] = get_guid();
//    $data['coupon_code'] = "ccvt-".randomkeys(8);
//    $data['amount'] = 200;
//    $data['ctime'] = date('Y-m-d H:i:s');
//    $data['utime'] = time();
//    $data['effective_date'] = date('Y-m-d H:i:s');
//    $data['expiry_date'] = '2018-12-31 23:59:59';
//    $db = new DB_COM();
//    $sql = $db->sqlInsert("us_voucher", $data);
//    $id = $db->query($sql);
//    if (!$id){
//        echo "添加记录失败";
//    }
//}
//
//for($i=0;$i<50;$i++){
//    $data['id'] = get_guid();
//    $data['coupon_code'] = "ccvt-".randomkeys(8);
//    $data['amount'] = 500;
//    $data['ctime'] = date('Y-m-d H:i:s');
//    $data['utime'] = time();
//    $data['effective_date'] = date('Y-m-d H:i:s');
//    $data['expiry_date'] = '2018-12-31 23:59:59';
//    $db = new DB_COM();
//    $sql = $db->sqlInsert("us_voucher", $data);
//    $id = $db->query($sql);
//    if (!$id){
//        echo "添加记录失败";
//    }
//}
//
//for($i=0;$i<50;$i++){
//    $data['id'] = get_guid();
//    $data['coupon_code'] = "ccvt-".randomkeys(8);
//    $data['amount'] = 1000;
//    $data['ctime'] = date('Y-m-d H:i:s');
//    $data['utime'] = time();
//    $data['effective_date'] = date('Y-m-d H:i:s');
//    $data['expiry_date'] = '2018-12-31 23:59:59';
//    $db = new DB_COM();
//    $sql = $db->sqlInsert("us_voucher", $data);
//    $id = $db->query($sql);
//    if (!$id){
//        echo "添加记录失败";
//    }
//}
echo "ok";


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
?>
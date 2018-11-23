<?php
require_once "../inc/common.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);



for($i=0;$i<10;$i++){
    $data['id'] = get_guid();
    $data['coupon_code'] = "ccvt-".randomkeys(8);
    $data['amount'] = 1000;
    $data['ctime'] = date('Y-m-d H:i:s');
    $data['utime'] = time();
    $db = new DB_COM();
    $sql = $db->sqlInsert("us_voucher", $data);
    $id = $db->query($sql);
    if (!$id){
        echo "添加记录失败";
    }
}
echo "ok";


function randomkeys($length)
{
    $key= '';
    $pattern = '123456789abcdefghjklmnpqrstuvwxyz';
    for($i=0;$i<$length;$i++)   
    {   
        $key .= $pattern{mt_rand(0,35)};    //生成php随机数   
    }   
    return $key;
}
?>
<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
==========================  机器人状态退出,短信通知 ==========================
GET参数


返回
  errcode = 0     请求成功

说明
  HASH值绑定
*/

php_begin();

$url = 'http://agent_service.fnying.com/sms/bot_status.php';
$post_data['cellphone']    = '15801075991';
$post_data['key_code']     = 'A89639D2-54E6-2BFE-803A-E201ADB0B6DD';
$o = "";
foreach ( $post_data as $k => $v )
{
    $o.= "$k=" . urlencode( $v ). "&" ;
}
$post_data = substr($o,0,-1);

$res = request_post($url, $post_data);
php_end($res);

// 返回数据
//$rtn_ary = array();
//$rtn_ary['errcode'] = '0';
//$rtn_ary['errmsg'] = '';
//$rtn_str = json_encode($rtn_ary);
//php_end($rtn_str);

function request_post($url = '', $param = '') {
    if (empty($url) || empty($param)) {
        return false;
    }

    $postUrl = $url;
    $curlPost = $param;
    $ch = curl_init();//初始化curl
    curl_setopt($ch, CURLOPT_URL,$postUrl);//抓取指定网页
    curl_setopt($ch, CURLOPT_HEADER, 0);//设置header
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//要求结果为字符串且输出到屏幕上
    curl_setopt($ch, CURLOPT_POST, 1);//post提交方式
    curl_setopt($ch, CURLOPT_POSTFIELDS, $curlPost);
    $data = curl_exec($ch);//运行curl
    curl_close($ch);

    return $data;
}



?>

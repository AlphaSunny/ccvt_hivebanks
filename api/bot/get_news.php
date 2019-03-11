<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取最新文章 ==========================

*/

php_begin();

//获取最新文章
$rows = get_news();
$content = '';
if ($rows){
    $json_string = file_get_contents('../../h5/assets/json/config_url.json');
    $data = json_decode($json_string, true);

    $content = $rows['title'].$data['api_url']."/h5/newsInfo.html?news_id=".$rows['news_id'];
}
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['content'] = $content;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>

<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取前十留言 ==========================

*/

php_begin();

//获取最新文章
$rows = get_leave_message();
$content = '';
if ($rows){
    $content = "TOP10:";
    foreach ($rows as $k=>$v){
        $content = $content.$v[$k];
    }
}
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['content'] = $content;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>

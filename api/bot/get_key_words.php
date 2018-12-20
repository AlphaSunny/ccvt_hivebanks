<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 根据关键词搜索答案 ==========================

*/

php_begin();
$args = array('ask','group_id');
chk_empty_args('GET', $args);
//问题
$ask = get_arg_str('GET','ask');
//群id
$group_id = get_arg_str('GET','group_id');
//获取答案
$rows = get_answer($ask,$group_id);
if (!$rows){
    exit_error('105','未找到答案');
}

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>

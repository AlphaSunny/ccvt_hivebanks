<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/10/9
 * Time: 下午1:30
 * la后台新闻列表
 */



require_once "../../../inc/common.php";
require_once "db/la_news.php";
require_once "../manage/db/la_admin.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

php_begin();
$args = array("token");
chk_empty_args('POST', $args);
$data = array();
// 用户token
$token = get_arg_str('POST', 'token', 128);

la_user_check($token);

// 取得分页参数
list($limit, $offset) = get_paging_arg('POST');

// 获取当前总记录
$total = news_list_total();

$list = news_list($offset,$limit);
if($list){

    $rtn_ary = array();
    $rtn_ary['errcode'] = '0';
    $rtn_ary['errmsg'] = '';
    $rtn_ary['rows'] = $list;
    $rtn_ary['total'] = $total;
    $rtn_str = json_encode($rtn_ary);
    php_end($rtn_str);
}

exit_error('-1','获取新闻列表失败');
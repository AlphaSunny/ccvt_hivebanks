<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/11/20
 * Time: 下午4:09
 */


/*
========================== 荣耀积分排行榜 ==========================
GET参数
  token             用户token
返回
rows            信息数组
    (all信息都会被返回)
说明
*/
require_once "../../../inc/common.php";
require_once  "db/la_admin.php";
require_once "../../db/la_func_common.php";
require_once "db/us_base.php";

php_begin();
$args = array("token");
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);

la_user_check($token);


// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');

// 记录数组总数
$total = score_ranking_total();
//荣耀积分排行榜
$score_ranking = score_ranking($offset,$limit);
if ($score_ranking){
    foreach ($score_ranking as $k=>$v){
        $score_ranking[$k]['ranking'] = $k+1;
        $score_ranking[$k]['base_amount'] = $v['base_amount']/get_la_base_unit();
    }
}

//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['total'] = $total;
$rtn_ary['rows'] = $score_ranking;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
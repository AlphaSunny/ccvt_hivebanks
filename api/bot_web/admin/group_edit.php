<?php

require_once '../../inc/common.php';
require_once 'db/bot.php';
require_once 'db/la_admin.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 群组编辑 ==========================
GET参数
  token                token

返回
  errcode = 0     请求成功
*/

php_begin();
$args = array('token','del','flirt','group_id','send_address','bind_account_notice','is_welcome','ranking_change_switch');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
// 群组id
$group_id = get_arg_str('GET', 'group_id');
// 群组名称
$group_name = get_arg_str('GET', 'group_name');

// 每天早上八点、晚上10推送当天统计    1：推送   2：不推送
$send_address = get_arg_str('GET', 'send_address');

// 是否绑定ccvt账号通知   1：通知   2：不通知
$bind_account_notice = get_arg_str('GET', 'bind_account_notice');

// 是否开启入群欢迎    1：开启   2：关闭
$is_welcome = get_arg_str('GET', 'is_welcome');

// 欢迎语
$welcome = get_arg_str('GET', 'welcome','255');

// 群介绍
$group_introduction = get_arg_str('GET', 'group_introduction');

// 群二维码
$src = get_arg_str('GET', 'src');

// 积分排名变化的通知  1:通知   2：不通知
$ranking_change_switch = get_arg_str('GET', 'ranking_change_switch');

// 新闻推送开关
$news_switch = get_arg_str('GET', 'news_switch');

// 新闻推送时间间隔
$chat_time = get_arg_str('GET', 'chat_time');
//验证token
$la_id = la_user_check($token);

$vail = 'edit';
//判断名称是否已添加
$is_name = check_group_name($group_name,$vail,$group_id);
if ($is_name){
    exit_error('109','名称已存在');
}


if ($chat_time){
    if ($chat_time % 10 != 0 || $chat_time<0)
        exit_error('109','间隔时间只能传10的倍数');
}

$date['is_admin_del'] = get_arg_str('GET', 'del');
$date['group_id'] = $group_id;
$date['name'] = $group_name;
$date['is_del'] = get_arg_str('GET', 'del');
$date['is_flirt'] = get_arg_str('GET', 'flirt');
$date['send_address'] = $send_address;
$date['bind_account_notice'] = $bind_account_notice;
$date['is_welcome'] = $is_welcome;
$date['welcome'] = $welcome;
$date['dis'] = $group_introduction;
$date['qr_code_address'] = $src;
$date['chat_time'] = $chat_time;
$date['ranking_change_switch'] = $ranking_change_switch;
$date['news_switch'] = $news_switch;
//修改群组
$row = save_group($date);
if (!$row){
    exit_error('109','修改失败');
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


<?php
require_once '../inc/common.php';
require_once 'db/bot_bind.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 随机奖励
根据分群等级，

从早上8点30分起至晚上9点30分为止，

每小时AI机器人将随机选择上一小时发言的用户给与随机数额的CCVT奖励。

奖励数额：

最小值=领域等级

最大值= 领域等级*10

若上一小时无人发言则不奖励。 ==========================

*/

php_begin();

//群名
$group_id = get_arg_str('GET','group_id');


//获取最新文章
$rows = random_reward($group_id);

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['content'] = $rows['name'];
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);




?>

<?php
$redis = new Redis();
print_r($redis);
$redis->connect('18.219.17.238', 6379); //连接Redis
$redis->auth('Windwin2018'); //密码验证
$redis->select(0);//选择数据库2
$redis->set( "testKey" , "Hello Redis"); //设置测试key
echo $redis->get("testKey");//输出value
?>

<?php
$redis = new Redis();
$redis->connect('18.219.17.238', 6379); //连接Redis
$redis->auth('mypasswords123sdfeak'); //密码验证
$redis->select(0);//选择数据库2
$redis->set( "testKey" , "Hello Redis"); //设置测试key
echo $redis->get("testKey");//输出value
?>

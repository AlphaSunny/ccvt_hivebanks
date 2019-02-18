<?php
$redis = new Redis();
$redis->connect('18.219.114.141', 6379); //连接Redis
$redis->auth('Windwin2018'); //密码验证
$redis->set( "testKey" , "Hello Redis"); //设置测试key
echo $redis->get("testKey");//输出value
?>
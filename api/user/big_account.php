<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/11/30
 * Time: 下午1:31
 */



require_once '../inc/common.php';
require_once 'db/big_account.php';


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 文件绑定 ==========================
GET参数
  token           用户token
  file_type       文件类型
  file_url        上传文件url
  file_hash       上传文件hash
返回
  errcode = 0     请求成功
说明
绑定SSH证书，身份证，护照，手持文件图片等
*/

php_begin();

reg_auto();

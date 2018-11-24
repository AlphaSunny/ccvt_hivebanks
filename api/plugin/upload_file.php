<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/11/24
 * Time: 下午2:08
 */


$key_code = $_REQUEST['key_code'];
$file = $_FILES['file'];

$url = 'http://agent_service.fnying.com/upload_file/upload.php';
$header = array('Content-Type: multipart/form-data');
//$fields = array('file' => '@' . $_FILES['file']['tmp_name'][0]);
$fields = array('file' => '@' . $_FILES['file']['tmp_name'][0],'key_code'=>$key_code);

$resource = curl_init();
curl_setopt($resource, CURLOPT_URL, $url);
curl_setopt($resource, CURLOPT_HTTPHEADER, $header);
curl_setopt($resource, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($resource, CURLOPT_POST, 1);
curl_setopt($resource, CURLOPT_POSTFIELDS, $fields);
//curl_setopt($resource, CURLOPT_COOKIE, 'apiToken=' . $token);
$result = json_decode(curl_exec($resource));
curl_close($resource);

var_dump($result);
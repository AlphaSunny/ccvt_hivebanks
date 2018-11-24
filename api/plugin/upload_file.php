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
$fields = array('file' => '@' . $_FILES,'key_code'=>$key_code);
$contents = file_get_contents($_FILES['file']['tmp_name']);
var_dump($contents);die;
$fields = array(
    'filetype'=>'jpg',
    'fileid'=>/*date(‘YmdGisu’) .*/ $_FILES['file']['name'],
    'content'=>$contents
);

//open connection
$ch = curl_init();

//set the url, number of POST vars, POST data
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_VERBOSE, 0);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible;)');
curl_setopt($ch,CURLOPT_URL,$url);
curl_setopt($ch,CURLOPT_POST,count($fields));
curl_setopt($ch,CURLOPT_POSTFIELDS,$fields);
curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);

//execute post
$output = curl_exec($ch);

var_dump($output);
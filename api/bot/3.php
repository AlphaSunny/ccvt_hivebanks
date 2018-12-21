<?php
function curl_get($url){

    $testurl = $url;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $testurl);
    //参数为1表示传输数据，为0表示直接输出显示。
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    //参数为0表示不带头文件，为1表示带头文件
    curl_setopt($ch, CURLOPT_HEADER,0);
    $output = curl_exec($ch);
    curl_close($ch);
    return $output;
}

$url = "https://ccvt_test.fnying.com/api/bot/search_statistical.php";
$group_name = urlencode("测试2");
$datetime = urlencode("2018-12-21");
$url = $url."?group_name='".$group_name."'&datetime=".$datetime;
echo $url;
$result = curl_get($url);
print_r($result);

?>

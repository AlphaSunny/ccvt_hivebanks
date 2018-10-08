<?php
//http://www.lampol-blog.com/detail/aid/ZDk5MmFNZ2pJL1pROW5QZU9KZ2FWdVlFTDVHRnRmZm4rNDMzSFlHNg%3D%3D 各种秘钥生成的教程
//生成密钥
#$opensslConfigPath = "D:\phpstudy\PHPTutorial\Apache\conf\openssl.cnf";
$config = array(
    "digest_alg" => "sha256",
    "private_key_bits" =>512,
    "private_key_type" => OPENSSL_KEYTYPE_RSA,
    #'config'=> $opensslConfigPath
);


//创建密钥对
$res = openssl_pkey_new($config);
//生成私钥
openssl_pkey_export($res, $privkey, null, $config);
//生成公钥
$pubKey = openssl_pkey_get_details($res)['key'];
print_r($privkey);
echo '<div style="height:100px;background:#ffe583">1</div>';
print_r(base64_encode($pubKey));
file_put_contents('private.key',$privkey);
file_put_contents('public.key',$pubKey);
?>

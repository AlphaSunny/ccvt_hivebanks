<?php
$config = array(
    "digest_alg" => "sha512",
    "private_key_bits" => 512,
    "private_key_type" => OPENSSL_KEYTYPE_RSA,
);

//1.创建公钥和私钥  返回资源
$res = openssl_pkey_new($config);

//从得到的资源中获取私钥  并把私钥赋给$privKey
openssl_pkey_export($res, $privKey);

print_r($privKey);
echo "<br />";
//从得到的资源中获取私钥  并把私钥赋给$pubKey
$pubKey = openssl_pkey_get_details($res);

$pubKey = $pubKey["key"];

print_r(base64_encode($pubKey));
echo "<br />";
print_r($pubKey);

echo "<br />";
$data = "1234";

openssl_public_encrypt($data, $encrypted, $pubKey);
echo $data;
echo base64_encode($encrypted);
echo "<br />";
$decrypted = base64_decode($encrypted);
openssl_private_decrypt($encrypted, $decrypted, $privKey);
echo $decrypted;
//var_dump(array('privKey'=>$privKey,'pubKey'=>$pubKey));
die;


?>

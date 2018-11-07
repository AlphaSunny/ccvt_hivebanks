function GetImgCode() {
    var src = config_api_url + '/api/inc/code.php';
    $('#email_imgCode').attr("src", src);
    $('#phone_imgCode').attr("src", src);
}

GetImgCode();

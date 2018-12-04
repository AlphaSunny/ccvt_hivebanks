$(function(){
    GetUsAccount();
    // var us_account = GetCookie('us_account');
    // $(".payNumber").val(us_account);
    // Transfer in/out record
    var token = GetCookie('user_token'),
    limit = 0,offset = 5,
    trans_api_url = 'log_balance.php';
    // AllRecord(token,limit,offset,trans_api_url,function (response){
    //     if(response.errcode == '0'){
    //         var data = response.rows;
    //
    //     }
    // },function (response){
    //     execI18n();
    //     layer.msg(response.errcode);
    //     if(response.errcode == '114'){
    //         window.location.href = 'login.html';
    //     }
    // });
});
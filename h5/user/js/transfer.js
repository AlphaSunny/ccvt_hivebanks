$(function () {
    GetUsAccount();
    var token = GetCookie("user_token");
    var is_pass_hash = "";
    //get bind info
    BindingInformation(token, function (response) {
        if(response.errcode == "0"){
            var data = response.rows;
            $.each(data, function (i, val) {
                if(data[i].bind_name == "pass_hash" && data[i].bind_flag == "1"){
                    is_pass_hash = "is_pass_hash";
                }
            });
            if(!is_pass_hash){
                alert("未绑定资金密码");
            }
        }
    }, function (response) {
        LayerFun(response.errcode);
    });

    // window.location.href = "funPasswordBind.html?transfer_funPass= transfer_funPass";
    // var us_account = GetCookie('us_account');
    // $(".payNumber").val(us_account);
    // Transfer in/out record
    var token = GetCookie('user_token'),
        limit = 0, offset = 5,
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
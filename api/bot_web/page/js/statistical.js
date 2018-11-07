$(function () {
    //获取参数
    var datetime = GetQueryString("datetime");
    var group_name = GetQueryString("group_name");

    //获取 statistics_user_token
    var token = GetCookie("statistics_user_token");
    if(token){
        $(".login").remove();
        $(".amount_box").fadeIn("fast");
        UserInformation(token, function (response) {
            if(response.errcode == "0"){
                var data = response.rows;
                $(".amount").text(data.base_amount);
            }
        }, function (response) {
            layer.msg("余额获取失败");
        })
    }

    //获取当前域名
    var url = getRootPath();

    $(".login").click(function () {
        window.location.href = url + "/api/bot_web/page/login.html?datetime=" + encodeURIComponent(datetime) + "&group_name=" + encodeURIComponent(group_name);
    })
    // function getRootPath() {
    //     //Get current URL
    //     var curWwwPath = window.document.location.href;
    //     //Get the directory after the host address
    //     var pathName = window.document.location.pathname;
    //     var pos = curWwwPath.indexOf(pathName);
    //     //Get the host address
    //     var localhostPath = curWwwPath.substring(0, pos);
    //     //Get the project name with "/"
    //     var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    //     return localhostPath;
    // }
    // var url = getRootPath();
    //
    // // Get URL parameters
    // function GetQueryString(name) {
    //     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    //     var r = window.location.search.substr(1).match(reg);
    //     if (r != null) return unescape(r[2]);
    //     return null;
    // }

    // var login_us = GetQueryString('user');
    // var login_ba = GetQueryString('ba');
    // var login_ca = GetQueryString('ca');
    //
    // function GetIndexCookie(name) {
    //     var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    //     if (arr != null) {
    //         return unescape(arr[2]);
    //     } else {
    //         return null;
    //     }
    // }
    //
    // var user_token = GetIndexCookie('user_token');
    // var ba_token = GetIndexCookie('ba_token');
    // var ca_token = GetIndexCookie('ca_token');
    //
    // if (user_token || login_us) {
    //     $('.usLogin').remove();
    //     $('.accountNone').removeClass('accountNone');
    // }
    // $('.baLogin').click(function () {
    //     if (ba_token || login_ba) {
    //         window.location.href = url+'/h5/ba/BaAccount.html';
    //     } else {
    //         window.location.href = url+'/h5/ba/BaLogin.html';
    //     }
    // });
    // $('.caLogin').click(function () {
    //     if (ca_token || login_ca) {
    //         window.location.href = url+'/h5/ca/CaAccount.html';
    //     } else {
    //         window.location.href = url+'/h5/ca/CaLogin.html';
    //     }
    // });
    //
    // $('.usLogin').click(function () {
    //     if (user_token) {
    //         window.location.href = url+'/h5/user/account.html';
    //     } else {
    //         window.location.href = url+'/h5/user/login.html';
    //     }
    // });
});
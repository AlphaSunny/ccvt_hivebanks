$(function () {
    var login_us = GetQueryString('user');
    var login_ba = GetQueryString('ba');
    var login_ca = GetQueryString('ca');

    function GetIndexCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }

    var user_token = GetIndexCookie('user_token');
    var ba_token = GetIndexCookie('ba_token');
    var ca_token = GetIndexCookie('ca_token');

    if (user_token || login_us) {
        $('.usLogin, .usRegister').remove();
        $('.accountNone').removeClass('accountNone');
    }
    $('.baLogin').click(function () {
        if (ba_token || login_ba) {
            window.location.href = 'ba/BaAccount.html';
        } else {
            window.location.href = 'ba/BaLogin.html';
        }
    });
    $('.caLogin').click(function () {
        if (ca_token || login_ca) {
            window.location.href = 'ca/CaAccount.html';
        } else {
            window.location.href = 'ca/CaLogin.html';
        }
    });

    $('.toAccountBtn').click(function () {
        if (login_us || user_token) {
            window.location.href = 'user/account.html';
        }
        if (login_ba && ba_token) {
            window.location.href = 'ba/BaAccount.html';
        }
        if (login_ca && ca_token) {
            window.location.href = 'ca/CaAccount.html';
        }
    });

    //click toggle
    $(document).on("click", ".leftNewsTitle", function () {
        $(this).addClass("activeNews").siblings(".leftNewsTitle").removeClass("activeNews");
    });

    //get news_id
    var news_id = GetQueryString("news_id");

    //get news info
    function GetNewsInfoFun(news_id) {
        GetNewsInfo(news_id, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                $(".title").text(data[0].title);
                $(".ctime").text(data[0].utime);
                $(".author").text(data[0].author);
                $(".news_content").html(data[0].content);
            }
        }, function (response) {
            return;
        });
    }

    GetNewsInfoFun(news_id);

    $(document).on("click", ".leftNewsTitle", function () {
        var news_id = $(this).attr("name");
        GetNewsInfoFun(news_id);
    });

    //get news list
    Get_News_List(function (response) {
        if (response.errcode == "0") {
            var data = response.rows;
            var li = "", li_first = "", li_other = "";
            $.each(data, function (i, val) {
                li += "<li class='leftNewsTitle' title='" + data[i].title + "' name='" + data[i].news_id + "'>" + data[i].title + "</li>"
            });
            $(".newsInfo_nav").html(li);

        }
    }, function (response) {
        return;
    });
});
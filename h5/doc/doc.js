$(function () {
    window.onload = function () {
        if (document.readyState === 'loading') {
            document.body.style.overflow = "hidden";
        } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
            document.body.style.overflow = "auto";
            var loading = document.querySelector(".loading");
            loading.parentNode.removeChild(loading);
        }
    };

    function GetIndexCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }

    var user_token = GetIndexCookie('user_token');

    if (user_token) {
        $('.usLogin').remove();
        $('.accountNone').removeClass('accountNone');
    }


    $('.toAccountBtn').click(function () {
        if (user_token) {
            window.location.href = 'user/account.html';
        }
    });

    //文档中心
    $(".doc_left").click(function () {
        var iframe = "";
        $(this).addClass("active").parent("li").siblings("li").children("a").removeClass("active");
        var src_name = $(this).attr("title");
        if(src_name == "tiro"){
            iframe = "<iframe src='../newsInfo.html?news_id=33A98FD6-E026-DA5E-0C2B-4CD21E30C8F7' frameborder='0' width='100%' height='100%'></iframe>";
        }else{
            iframe = "<iframe src='"+ src_name +".html' frameborder='0' width='100%' height='100%'></iframe>";
        }
        $(".doc_right").html("");
        $(".doc_right").append(iframe);
    })
});
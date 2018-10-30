$(function () {
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

    $('.baLogin').click(function () {
        if (ba_token) {
            window.location.href = 'ba/BaAccount.html';
        } else {
            window.location.href = 'ba/BaLogin.html';
        }
    });
    $('.caLogin').click(function () {
        if (ca_token) {
            window.location.href = 'ca/CaAccount.html';
        } else {
            window.location.href = 'ca/CaLogin.html';
        }
    });
    $('.usLogin').click(function () {
        if (user_token) {
            window.location.href = 'user/account.html';
        } else {
            window.location.href = 'user/login.html';
        }
    });

    Get_News_List(function (response) {
        if (response.errcode == "0") {
            var data = response.rows, a = "";
            $.each(data, function (i, val) {
                a += "<p><a href='javascript:;' name=" + data[i].news_id + ">" + data[i].title + "</a></p>"
            });
            $(".latestNewsText").html(a);
        }
    }, function (response) {
        if (response.errcode == "-1") {
            $(".latestNewsText").html("<span>暂无更多动态</span>");
        }
    });


    var latestNews = $(".latestNews");
    var latestNewsText = $(".latestNewsText");
    var scrollInterval = "";

    latestNews.hover(function () {
        clearInterval(scrollInterval);
    }, function () {
        scrollInterval = setInterval(function () {
            scrollNew(latestNews);
        }, 2000);
    }).trigger("mouseleave");

    function scrollNew(ele) {
        var lineHeight = ele.find("p:first").height();
        latestNewsText.animate({
            "marginTop": -lineHeight + "px"
        }, 2000)
    }

// , function () {
//         latestNewsText.css("marginTop", 0);
//     }

    // setInterval(function () {
    //     console.log("res");
    //     var height = $(".latestNewsText>p").height();
    //     console.log(height);
    //     $(".latestNewsText").css("transform","translateY("+height+")");
    // }, 3000);
});


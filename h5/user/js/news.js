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


    function notice(ul){
        var lineHeight = ul.find("p:first").height();
        var li = ul.find('p').eq(0).html();
        ul.append('<p>'+li+'</p>');
        var num = 0;
        setInterval(function(){
            num ++;
            if(num == ul.find('li').length){
                num = 1;
                ul.css({
                    marginTop:0
                });
            }
            $('.latestNewsText').animate({
                marginTop:-lineHeight * num
            },400);
        },2000);
    }

    notice($('.latestNewsText'));

    // var latestNews = $(".latestNews");
    // var latestNewsText = $(".latestNewsText");
    // var lineHeight = latestNewsText.find("p:first").height();
    // var length = latestNewsText.find("p").length;
    // var scrollInterval;
    // var num = 0;
    //
    // scrollInterval = setInterval(function () {
    //     num++;
    //     if (num == length) {
    //         num = 1;
    //         latestNewsText.css("marginTop", 0);
    //     }
    //     latestNewsText.animate({
    //         "marginTop": -lineHeight * num + "px"
    //     })
    // }, 2000);
    // latestNews.hover(function () {
    //     clearInterval(scrollInterval);
    // })
    // latestNews.hover(function () {
    //     clearInterval(scrollInterval);
    // }, function () {
    //     scrollInterval = setInterval(function () {
    //         scrollNew(latestNewsText);
    //     }, 2000);
    // }).trigger("mouseleave");
    //
    // function scrollNew(ele) {
    //     var lineHeight = ele.find("p:first").height();
    //     latestNewsText.animate({
    //         "marginTop": -lineHeight + "px"
    //     }, 2000, function () {
    //         var length = latestNewsText.find("p").length;
    //         // if()
    //     })
    // }

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


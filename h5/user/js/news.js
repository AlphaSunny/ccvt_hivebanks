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
            var data = response.rows, li = "";
            $.each(data, function (i, val) {
                li += "<li><a href='javascript:;' name=" + data[i].news_id + ">" + data[i].title + "</a></li>"
            });
            $(".latestNewsText").html(li);
        }
    }, function (response) {
        if (response.errcode == "-1") {
            $(".latestNewsText").html("<li>暂无更多动态</li>");
        }
    });


    var $this = $(".latestNews");
    var scrollTimer;
    $this.hover(function() {
        clearInterval(scrollTimer);
    }, function() {
        scrollTimer = setInterval(function() {
            scrollNews($this);
        }, 5000);
    }).trigger("mouseleave");

    function scrollNews(obj) {
        var $self = obj.find("ul");
        var lineHeight = $self.find("li:first").height();
        $self.animate({
            "marginTop": -lineHeight + "px"
        }, 2000, function() {
            $self.css({
                marginTop: 0
            }).find("li:first").appendTo($self);
        })
    }
});


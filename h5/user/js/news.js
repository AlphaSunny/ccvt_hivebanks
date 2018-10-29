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
                a+="<p><a href='javascript:;' name="+ data[i].news_id +">"+ data[i].title +"</a></p>"
            });
            $(".latestNewsText").html(a);
            // setInterval(function () {
            //     // console.log("res");
            //     $(".latestNewsText").css("transform","translateY(-2.5rem)");
            // }, 3000);

        }
    }, function (response) {
        if(response.errcode == "-1"){
            $(".latestNewsText").html("<span>暂无更多动态</span>");
        }
    });

    $.fn.extend({
        Scroll: function (opt, callback) {
            //参数初始化
            if (!opt) var opt = {};
            var _this = this.eq(0).find(".latestNewsText:first");
            var lineH = _this.find(".latestNewsText>p:first").height(), //获取行高
                line = opt.line ? parseInt(opt.line, 10) : parseInt(this.height() / lineH, 10), //每次滚动的行数，默认为一屏，即父容器高度
                speed = opt.speed ? parseInt(opt.speed, 10) : 500, //卷动速度，数值越大，速度越慢（毫秒）
                timer = opt.timer ? parseInt(opt.timer, 10) : 3000; //滚动的时间间隔（毫秒）
            if (line == 0) line = 1;
            var upHeight = 0 - line * lineH;
            //滚动函数
            scrollUp = function () {
                _this.animate({
                    marginTop: upHeight
                }, speed, function () {
                    for (var i = 1; i <= line; i++) {
                        _this.find(".latestNewsText>p:first").appendTo(_this);
                    }
                    _this.css({marginTop: 0});
                });
            };
            //鼠标事件绑定
            var timerID = "";
            _this.hover(function () {
                clearInterval(timerID);
            }, function () {
                timerID = setInterval("scrollUp()", timer);
            }).mouseout();
        }
    })
});

$(document).ready(function () {
    $(".latestNewsText").Scroll({line: 1, speed: 500, timer: 1000});
});

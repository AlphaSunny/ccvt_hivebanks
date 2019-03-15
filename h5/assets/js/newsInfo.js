$(function () {
    var login_us = GetQueryString('user');

    function GetIndexCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }

    var user_token = GetIndexCookie('user_token');

    if (user_token || login_us) {
        $('.usLogin,.usRegister').remove();
        $('.accountNone').removeClass('accountNone');
    }else{
        $(".accountNone").remove();
    }


    $('.toAccountBtn').click(function () {
        if (login_us || user_token) {
            window.location.href = 'user/account.html';
        }
    });

//     var opts = {
//         lines: 8, // The number of lines to draw
//         length: 10, // The length of each line
//         width: 2, // The line thickness
//         radius: 10, // The radius of the inner circle
//         scale: 1, // Scales overall size of the spinner
//         corners: 1, // Corner roundness (0..1)
//         color: '#ffffff', // CSS color or array of colors
//         fadeColor: 'transparent', // CSS color or array of colors
//         speed: 1, // Rounds per second
//         rotate: 0, // The rotation offset
//         animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
//         direction: 1, // 1: clockwise, -1: counterclockwise
//         zIndex: 2e9, // The z-index (defaults to 2000000000)
//         className: 'spinner', // The CSS class to assign to the spinner
//         top: '50%', // Top position relative to parent
//         left: '50%', // Left position relative to parent
//         shadow: '0 0 1px transparent', // Box-shadow for the lines
//         position: 'absolute' // Element positioning
//     };
//     var target = document.getElementById("mySpin");
//     var spinner = new Spinner(opts);
//
// //show loading
//     function ShowLoading(type) {
//         if (type == "show") {
//             spinner.spin(target);
//         }
//         if (type == "hide") {
//             spinner.spin();
//         }
//     }

    //click toggle
    $(document).on("click", ".leftNewsTitle", function () {
        $(this).addClass("activeNews").siblings(".leftNewsTitle").removeClass("activeNews");
    });

    //get news_id
    var news_id = GetQueryString("news_id");

    //get news info
    function GetNewsInfoFun(news_id) {
        var index = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        GetNewsInfo(news_id, function (response) {
            layer.close(index);
            if (response.errcode == "0") {
                var data = response.rows;
                $(".title").text(data[0].title);
                $(".ctime").text(data[0].utime);
                $(".author").text(data[0].author);
                $(".news_content").html(data[0].content);
                if (data[0].category == "1") {
                    $(".titles").text("CCVT 官方新闻");
                } else {
                    $(".titles").text("CCVT 行业新闻");
                }
            }
        }, function (response) {
            layer.close(index);
            layer.msg(response.errmsg);
        });
    }

    GetNewsInfoFun(news_id);

    $(document).on("click", ".leftNewsTitle", function () {
        var news_id = $(this).attr("name");
        GetNewsInfoFun(news_id);
    });

    function eachNewList(new_list) {
        var li = "";
        $.each(new_list, function (i, val) {
            li += "<li class='leftNewsTitle' title='" + new_list[i].title + "' name='" + new_list[i].news_id + "'>" + new_list[i].title + "</li>";
        });
        return li;
    }

    //get news list
    Get_News_List(function (response) {
        if (response.errcode == "0") {
            var data = response.rows, div = "";
            $.each(data, function (i, val) {
                var new_list = data[i].list;
                var li = eachNewList(new_list);
                div += "<div class='dropdown margin-bottom-5'>" +
                    "<button class='btn btn-success dropdown-toggle width-100 flex center space-between' type='button' id=" + data[i].category + " data-toggle='dropdown'>" + data[i].category_name + "<span class='caret'></span></button>" +
                    "<ul class='dropdown-menu width-100 newsInfo_nav'>" +
                    li +
                    "</ul>" +
                    "</div>"
            });

            $(".new_nav_box").html(div);
        }
    }, function (response) {
        layer.msg(response.errmsg);
    });
});
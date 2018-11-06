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
        $('.usLogin').remove();
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

    $('.usLogin').click(function () {
        if (user_token) {
            window.location.href = 'user/account.html';
        } else {
            window.location.href = 'user/login.html';
        }
    });

    $('.toAccountBtn').click(function () {
        if (login_us || user_token) {
            window.location.href = 'user/account.html';
        }
        // if (login_ba && ba_token) {
        //     window.location.href = 'ba/BaAccount.html';
        // }
        // if (login_ca && ca_token) {
        //     window.location.href = 'ca/CaAccount.html';
        // }
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


            // <div class="dropdown">
            //         <button class="btn btn-success dropdown-toggle width-100 flex center space-between" type="button" id="dropdownMenu1" data-toggle="dropdown">
            //         官方新闻
            //         <span class="caret"></span>
            //         </button>
            //         <ul class="dropdown-menu width-100 newsInfo_nav">
            //
            //         </ul>
            //         </div>
            // var li = "", li_first = "", li_other = "";
            // $.each(data, function (i, val) {
            //     li += "<li class='leftNewsTitle' title='" + data[i].title + "' name='" + data[i].news_id + "'>" + data[i].title + "</li>"
            // });
            // $(".newsInfo_nav").html(li);

        }
    }, function (response) {
        return;
    });
});
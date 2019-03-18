$(function () {
    let login_us = GetQueryString('user');

    function GetIndexCookie(name) {
        let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }

    let user_token = GetIndexCookie('user_token');

    if (user_token || login_us) {
        $('.usLogin,.usRegister').remove();
        $('.accountNone').removeClass('accountNone');
    } else {
        $(".accountNone").remove();
    }


    $('.toAccountBtn').click(function () {
        if (login_us || user_token) {
            window.location.href = 'user/account.html';
        }
    });


    //click toggle
    $(document).on("click", ".leftNewsTitle", function () {
        $(this).addClass("activeNews").siblings(".leftNewsTitle").removeClass("activeNews");
    });

    //get news_id
    let news_id = GetQueryString("news_id");

    //get news info
    function GetNewsInfoFun(news_id) {
        let index = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        GetNewsInfo(news_id, function (response) {
            layer.close(index);
            if (response.errcode == "0") {
                let data = response.rows;
                $(".title").text(data.title);
                $(".ctime").text(data.utime);
                $(".author").text(data.author);
                $(".news_content").html(data.content);
                if (data.category == "1") {
                    $(".titles").text("CCVT 官方新闻");
                } else {
                    $(".titles").text("CCVT 行业新闻");
                }

                let prev = data.prev;
                let next = data.next;
                if (!prev) {
                    $(".pre_news").remove();
                } else {
                    $(".pre_news").attr("name", prev.news_id);
                    $(".pre_news_title").text(prev.title);
                }
                if (!next) {
                    $(".next_news").remove();
                } else {
                    $(".next_news").attr({"name": next.news_id,"title":next.news_id});
                    $(".next_news_title").text(next.title);
                }
            }
        }, function (response) {
            layer.close(index);
            layer.msg(response.errmsg);
        });
    }

    GetNewsInfoFun(news_id);

    $(document).on("click", ".leftNewsTitle,.pre_next_news", function () {
        let news_id = $(this).attr("name");
        GetNewsInfoFun(news_id);
    });

    function eachNewList(new_list) {
        let li = "";
        $.each(new_list, function (i, val) {
            li += "<li class='leftNewsTitle' title='" + new_list[i].title + "' name='" + new_list[i].news_id + "'>" + new_list[i].title + "</li>";
        });
        return li;
    }

    //get news list
    Get_News_List(function (response) {
        if (response.errcode == "0") {
            let data = response.rows, div = "";
            $.each(data, function (i, val) {
                let new_list = data[i].list;
                let li = eachNewList(new_list);
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
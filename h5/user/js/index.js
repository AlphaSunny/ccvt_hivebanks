$(function () {
    let login_us = GetQueryString('user');
    let login_ba = GetQueryString('ba');
    let login_ca = GetQueryString('ca');

    function GetIndexCookie(name) {
        let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }

    let user_token = GetIndexCookie('user_token');
    let ba_token = GetIndexCookie('ba_token');
    let ca_token = GetIndexCookie('ca_token');

    if (user_token || login_us) {
        $('.usLogin, .usRegister,.phone_show>.btn').remove();
        $('.accountNone').removeClass('accountNone');
    }
    $('.baLogin').click(function () {
        if (ba_token || login_ba) {
            window.location.href = 'ba/BaAccount.html';
        } else {
            window.location.href = 'ba/BaLogin.html';
        }
    });

    $('.contract').click(function () {
        window.location.href = 'contract/robot_login.html';
    });

    $(".to_doc").click(function () {
        if (user_token) {
            window.location.href = 'http://www.fnying.com/h5/ccvt/index.html?t=' + decodeURI(user_token);
        }else {
            window.location.href = 'http://www.fnying.com/h5/ccvt/index.html?';
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
    });


    // scroll news
    let timer_news = "", margin_top = "", item_height = "";

    function AutoScroll(obj) {
        // let body_width = $(document).width();
        item_height = $(obj).find("ul>li").height();
        margin_top = "0px";
        $(obj).find("ul:first").animate({
            marginTop: -item_height
        }, 2000, function () {
            $(this).css({
                marginTop: margin_top
            }).find("li:first").appendTo(this);
        });
    }

    function start_Scroll() {
        timer_news = setInterval(() => {
            AutoScroll(".latestNews")
        }, 5000);
    }

    $('.latestNews').mouseenter(() => {
        clearInterval(timer_news);
    });

    $('.latestNews').mouseleave(() => {
        start_Scroll();
    });


    //get new list
    Get_News_List(function (response) {
        if (response.errcode == "0") {
            let data = response.new_rows, li = "";
            $.each(data, function (i, val) {
                li += "<li><a href='javascript:void(0)' class='toNewsInfo' name=" + data[i].news_id + ">" + data[i].title + "</a></li>"
            });
            $(".latestNewsText").html(li);
            start_Scroll();
        }
    }, function (response) {
        if (response.errcode == "-1") {
            $(".latestNewsText").html("<li>暂无更多动态</li>");

        }
    });

    //to news info
    $(document).on("click", ".toNewsInfo", function () {
        let news_id = $(this).attr("name");
        if (!news_id) {
            return;
        } else {
            window.location.href = "newsInfo.html?news_id=" + news_id;
        }
    });

    //close float qr
    $(".float_qr_close").click(function () {
        $(".float_qr_box").css("transform", "translateX(10rem)");
        setTimeout(function () {
            $(".float_qr_open").css("display", "flex");
        }, 1200);
    });

    //open float qr
    $(".float_qr_open").click(function () {
        $(".float_qr_box").css("transform", "translateX(0rem)");
        $(".float_qr_open").css("display", "none");
    });

});

//scroll
(function ($) {
    "use strict";

    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 60
    });

    $('#topNav').affix({
        offset: {
            top: 200
        }
    });

    new WOW().init();

    $('a.page-scroll').bind('click', function (event) {
        let $ele = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($ele.attr('href')).offset().top - 60)
        }, 1450, 'easeInOutExpo');
        event.preventDefault();
    });

    $('.navbar-collapse ul li a').click(function () {
        /* always close responsive nav after click */
        $('.navbar-toggle:visible').click();
    });

    $('#galleryModal').on('show.bs.modal', function (e) {
        $('#galleryImage').attr("src", $(e.relatedTarget).data("src"));
    });

})(jQuery);

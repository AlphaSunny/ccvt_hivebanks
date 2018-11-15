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

    $('.contract').click(function () {
        window.location.href = 'contract/index.html';
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
        // if (login_ba && ba_token) {
        //     window.location.href = 'ba/BaAccount.html';
        // }
        // if (login_ca && ca_token) {
        //     window.location.href = 'ca/CaAccount.html';
        // }
    });

    //get new list
    Get_News_List(function (response) {
        if (response.errcode == "0") {
            var data = response.new_rows, li = "";
            $.each(data, function (i, val) {
                li += "<li><a href='javascript:void(0)' class='toNewsInfo' name=" + data[i].news_id + ">" + data[i].title + "</a></li>"
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
    $this.hover(function () {
        clearInterval(scrollTimer);
    }, function () {
        scrollTimer = setInterval(function () {
            scrollNews($this);
        }, 6000);
    }).trigger("mouseleave");

    function scrollNews(obj) {
        var $self = obj.find("ul");
        var lineHeight = $self.find("li:first").height();
        $self.animate({
            "marginTop": -lineHeight + "px"
        }, 6000, function () {
            $self.css({
                marginTop: 0
            }).find("li:first").appendTo($self);
        })
    }

    //to news info
    $(document).on("click", ".toNewsInfo", function () {
        var news_id = $(this).attr("name");
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
        },1200);
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
        var $ele = $(this);
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

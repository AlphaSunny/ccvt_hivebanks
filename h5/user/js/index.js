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
    $('.caLogin').click(function () {
        if (ca_token || login_ca) {
            window.location.href = 'ca/CaAccount.html';
        } else {
            window.location.href = 'ca/CaLogin.html';
        }
    });
    // $('.usLogin').click(function () {
    //     if (user_token || login_us) {
    //         window.location.href = 'user/account.html';
    //     } else {
    //         window.location.href = 'user/login.html';
    //     }
    // });

    $('.toAccountBtn').click(function () {
        if (login_us || user_token) {
            window.location.href = 'user/account.html';
        }
        if (login_ba && ba_token) {
            window.location.href = 'ba/BaAccount.html';
        }
        if (login_ca && ca_token) {
            window.location.href = 'ca/CaAccount.html';
        }
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

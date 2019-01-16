$(function () {
    $('[data-toggle="tooltip"]').tooltip();
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
        $('.usLogin').remove();
        $('.accountNone').removeClass('accountNone');
    }


    $('.toAccountBtn').click(function () {
        if (login_us || user_token) {
            window.location.href = 'user/account.html';
        }
    });
});
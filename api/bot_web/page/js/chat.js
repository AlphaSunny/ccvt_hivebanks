$(function () {
    // Get URL parameters
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

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
            window.location.href = 'h5/ba/BaAccount.html';
        } else {
            window.location.href = 'h5/ba/BaLogin.html';
        }
    });
    $('.caLogin').click(function () {
        if (ca_token || login_ca) {
            window.location.href = 'h5/ca/CaAccount.html';
        } else {
            window.location.href = 'h5/ca/CaLogin.html';
        }
    });

    $('.usLogin').click(function () {
        if (user_token) {
            window.location.href = 'h5/user/account.html';
        } else {
            window.location.href = 'h5/user/login.html';
        }
    });
});
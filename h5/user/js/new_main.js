$(function () {
    //notice
    $(".msg-row").click(function () {
        $(".jt").toggleClass("active");
        $(".msg-content").slideToggle();
    });

    //back index
    $('.toIndexBtn').click(function () {
        window.location.href = '../../index.html?user=user';
    });

    $(".close_customize").click(function () {
        $(".customize_modal").addClass("none");
    });

// scroll Up
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.scrollup').fadeIn('slow');
        } else {
            $('.scrollup').fadeOut('slow');
        }
    });
    $('.scrollup').click(function () {
        $("html, body").animate({scrollTop: 0}, 1000);
        return false;
    });
});

//匹配手机号换成*号
function PhoneReplace(phone) {
    let reg = /^(\d{3})\d*(\d{4})$/;
    let rep_phone = phone.replace(reg, "$1****$2");
    return rep_phone;

}

//Get User Account
function GetUsAccount() {
    let us_account = GetCookie('us_account');
    $(".us_account").text(us_account);
}

//Data acquisition is empty
function GetDataEmpty(element, num) {
    let tr = '';
    tr = '<tr>' +
        '<td colspan="' + num + '" style="line-height: unset!important; text-align: center"><i class="iconfont icon-noData" style="font-size: 10rem"></i></td>' +
        '</tr>';
    $('#' + element).html(tr);
    return;
}

//Data acquisition failed
function GetDataFail(element, num) {
    let tr = '';
    tr = '<tr>' +
        '<td colspan="' + num + '" style="line-height: unset!important;"><i class="iconfont icon-loadFai" style="font-size: 10rem"></i></td>' +
        '</tr>';
    $('#' + element).html(tr);
}

//Formatted amount
function fmoney(s, n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";//Change the number of n here to determine the decimal place to keep.
    let l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    let t = "";
    for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r.substring(0, 2);//Keep 2 decimal places. If you want to change, change the last digit of substring.
};

//email address
function EmailList() {
    let emailList = {
        'qq.com': 'http://mail.qq.com',
        'gmail.com': 'http://mail.google.com',
        'sina.com': 'http://mail.sina.com.cn',
        '163.com': 'http://mail.163.com',
        '126.com': 'http://mail.126.com',
        'yeah.net': 'http://www.yeah.net/',
        'sohu.com': 'http://mail.sohu.com/',
        'tom.com': 'http://mail.tom.com/',
        'sogou.com': 'http://mail.sogou.com/',
        '139.com': 'http://mail.10086.cn/',
        'hotmail.com': 'http://www.hotmail.com',
        'live.com': 'http://login.live.com/',
        'live.cn': 'http://login.live.cn/',
        'live.com.cn': 'http://login.live.com.cn',
        '189.com': 'http://webmail16.189.cn/webmail/',
        'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
        'yahoo.cn': 'http://mail.cn.yahoo.com/',
        'eyou.com': 'http://www.eyou.com/',
        '21cn.com': 'http://mail.21cn.com/',
        '188.com': 'http://www.188.com/',
        'foxmail.com': 'http://www.foxmail.com'
    };
    return emailList;
}

//Popup message
function LayerFun(type) {
    if (type == "114") {
        DelCookie("user_token");
        window.location.href = "login.html";
        return;
    }
    layer.msg('<span class="i18n" name="' + type + '"></span>');
    execI18n();
    return;
}

function GetUserAgent() {
    let browser = {
        versions: function () {
            let u = navigator.userAgent, app = navigator.appVersion;
            return {   //Mobile terminal browser version information
                trident: u.indexOf('Trident') > -1, //IE kernel
                presto: u.indexOf('Presto') > -1, //opera kernel
                webKit: u.indexOf('AppleWebKit') > -1, //Apple, Google kernel
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //Firefox kernel
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //Whether it is a mobile terminal
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //Ios terminal
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //Android terminal or uc browser
                iPhone: u.indexOf('iPhone') > -1, //Whether it is an iPhone or QQHD browser
                iPad: u.indexOf('iPad') > -1, //Whether iPad
                webApp: u.indexOf('Safari') == -1 //Whether the web should be a program, no head and bottom
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };
    if (browser.versions.mobile) {//Determine if the mobile device is open
        let ua = navigator.userAgent.toLowerCase();//Get the object for judgment
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            //Open on WeChat
            return 'wx';
        }
        if (browser.versions.webApp) {
            // alert("webapp")
            return 'app';
        }
    } else {
        //Otherwise it is a PC browser
        return 'H5';
    }
}

//show loading
let index_loading = "";

function ShowLoading(type) {
    if (type == "show") {
        index_loading = layer.load(1, {
            shade: [0.1, '#fff']
        });
    } else if (type == "hide") {
        layer.close(index_loading);
    }
}

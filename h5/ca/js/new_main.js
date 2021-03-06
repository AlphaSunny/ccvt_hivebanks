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

    //get time
    // let time = new Date().toLocaleString('chinese', {hour12: false});
    // $(".time").text(time);

    // Icon link
    // let link = $('<link rel="stylesheet" href="//at.alicdn.com/t/font_626151_s2e3q5g4f2.css">');
    // $('head').append(link);

    //favicon
    // let link_icon = $("<link rel='shortcut icon' href='../favicon.ico' />");
    // $('head').append(link_icon);

    // //cnt.js
    // let cnt = $("<script src='../assets/js/cnt.js'></script>");
    // cnt.appendTo($("head"));

// Password strength verification
    $('#emailPass').keyup(function () {
        $('.email-pw-strength').css('display', 'block');
        let strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
        let mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        let enoughRegex = new RegExp("(?=.{6,}).*", "g");

        if (false == enoughRegex.test($(this).val())) {
            $('.emailRegisterBox #emailLevel').removeClass('pw-weak');
            $('.emailRegisterBox #emailLevel').removeClass('pw-medium');
            $('.emailRegisterBox #emailLevel').removeClass('pw-strong');
            $('.emailRegisterBox #emailLevel').addClass(' pw-defule');
            //When the password is less than six digits, the password strength picture is gray.
        }
        else if (strongRegex.test($(this).val())) {
            $('.emailRegisterBox #emailLevel').removeClass('pw-weak');
            $('.emailRegisterBox #emailLevel').removeClass('pw-medium');
            $('.emailRegisterBox #emailLevel').removeClass('pw-strong');
            $('.emailRegisterBox #emailLevel').addClass(' pw-strong');
            //The password is eight or more and the alphanumeric special characters are included, the strongest
        }
        else if (mediumRegex.test($(this).val())) {
            $('.emailRegisterBox #emailLevel').removeClass('pw-weak');
            $('.emailRegisterBox #emailLevel').removeClass('pw-medium');
            $('.emailRegisterBox #emailLevel').removeClass('pw-strong');
            $('.emailRegisterBox #emailLevel').addClass('pw-medium');
            //The password is seven or more and there are two of the letters, numbers, and special characters. The intensity is medium.
        }
        else {
            $('.emailRegisterBox #emailLevel').removeClass('pw-weak');
            $('.emailRegisterBox #emailLevel').removeClass('pw-medium');
            $('.emailRegisterBox #emailLevel').removeClass('pw-strong');
            $('.emailRegisterBox #emailLevel').addClass('pw-weak');
            //If the password is 6 or less, even if the letters, numbers, and special characters are included, the strength is weak.
        }
        return true;
    });

    $('#phonePass').keyup(function () {
        $('.phone-pw-strength').css('display', 'block');
        let strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
        let mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        let enoughRegex = new RegExp("(?=.{6,}).*", "g");

        if (false == enoughRegex.test($(this).val())) {
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-weak');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-medium');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-strong');
            $('.phoneRegisterBox #phoneLevel').addClass(' pw-defule');
            //When the password is less than six digits, the password strength picture is gray.
        }
        else if (strongRegex.test($(this).val())) {
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-weak');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-medium');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-strong');
            $('.phoneRegisterBox #phoneLevel').addClass(' pw-strong');
            //The password is eight or more and the alphanumeric special characters are included, the strongest
        }
        else if (mediumRegex.test($(this).val())) {
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-weak');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-medium');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-strong');
            $('.phoneRegisterBox #phoneLevel').addClass(' pw-medium');
            //The password is seven or more and there are two of the letters, numbers, and special characters. The intensity is medium.
        }
        else {
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-weak');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-medium');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-strong');
            $('.phoneRegisterBox #phoneLevel').addClass('pw-weak');
            //If the password is 6 or less, even if the letters, numbers, and special characters are included, the strength is weak.
        }
        return true;
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

//Get phone verification code
// let timer = null;

// function GetPhoneCodeFun(bind_type, $this, cfm_code) {
//     //Get country code
//     let country_code = $('.selected-dial-code').text().split("+")[1];
//     let cellphone = $('#phone').val();
//     if (cellphone == '') {
//         // LayerFun('phoneNotEmpty');
//         return;
//     }
//     GetPhoneCode(cellphone, country_code, bind_type, cfm_code, function (response) {
//         if (response.errcode == '0') {
//             // LayerFun('sendSuccess');
//             layer.msg("发送成功", {icon: 1});
//         }
//     }, function (response) {
//         clearInterval(timer);
//         $this.attr("disabled", false);
//         LayerFun(response.errcode);
//         $('.sixty').fadeOut('fast');
//         $('.getCodeText').fadeIn("fast");
//         GetImgCode();
//         return;
//     });
// };

// let countdown = 60;
//
// function setTime($this) {
//     $('.sixty').text(countdown + "s").fadeIn('fast');
//     $('.getCodeText').fadeOut();
//     $this.attr("disabled", true);
//     timer = setInterval(function () {
//         if (countdown > 0) {
//             countdown--;
//             $('.sixty').text(countdown + "s");
//         } else {
//             clearInterval(timer);
//             $this.attr("disabled", false);
//             $('.sixty').fadeOut('fast');
//             $('.getCodeText').fadeIn();
//             return;
//         }
//     }, 1000);
// }

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

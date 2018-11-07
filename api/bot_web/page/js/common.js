// Set the cookies function
function SetCookie(name, value) {
    var now = new Date();
    var time = now.getTime();

    // Valid for 2 hours
    time += 3600 * 1000 * 2;
    now.setTime(time);
    document.cookie = name + "=" + escape(value) + '; expires=' + now.toUTCString() + ';path=/';
}

// Take the cookies function
function GetCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    if (arr == null) {
        window.location.href = 'login.html';
    }
}

// Delete cookie function
function DelCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = GetCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ';path=/';
}


// Get URL parameters
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// Email format check
function IsEmail(s) {
    var patrn = /^(?:\w+\.?)*\w+@(?:\w+\.)*\w+$/;
    return patrn.exec(s);
}

function getRootPath() {
    //Get current URL
    var curWwwPath = window.document.location.href;
    //Get the directory after the host address
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //Get the host address
    var localhostPath = curWwwPath.substring(0, pos);
    //Get the project name with "/"
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return localhostPath;
}

var url = getRootPath();

//Get configuration file/Base currency type
var config_api_url = '', config_h5_url = '';
// userLanguage = getCookie('userLanguage');
$.ajax({
    url: url + "/h5/assets/json/config_url.json",
    async: false,
    type: "GET",
    dataType: "json",
    success: function (data) {
        config_api_url = data.api_url;
        config_h5_url = data.h5_url;
        var benchmark_type = data.benchmark_type.toUpperCase();
        var ca_currency = data.ca_currency.toUpperCase();
        $('.base_type').text(benchmark_type);
        $('.ca_currency').text(ca_currency);
        SetCookie('ca_currency', ca_currency);
        SetCookie('benchmark_type', benchmark_type);
        // if (!userLanguage) {
        //     SetCookie('userLanguage', data.userLanguage);
        // } else {
        //     return;
        // }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {

    }
});

//get img code
function GetImgCode() {
    var src = config_api_url + '/api/inc/code.php';
    $('#email_imgCode').attr("src", src);
    $('#phone_imgCode').attr("src", src);
}
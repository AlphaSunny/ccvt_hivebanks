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
    if (arr == null && name == "robot_token") {
        window.location.href = '../html/login.html';
        return;
    }
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

//Get failed error code prompt
function GetErrorCode(code) {
    $.getJSON(url + "/h5/assets/json/errcode.json", function (response) {
        $.each(response, function (i, val) {
            if (response[i].code == code) {
                layer.msg('<p class="i18n" name="' + code + '">' + response[i].code_value + '</p>');
                execI18n();
            }
        })
    })
}

//Get configuration file
var config_api_url = '', config_h5_url = '', userLanguage = GetCookie('userLanguage');
$.ajax({
    url: url + "/h5/assets/json/config_url.json",
    async: false,
    type: "GET",
    dataType: "json",
    success: function (data) {
        config_api_url = data.api_url;
        config_h5_url = data.h5_url;
        if (!userLanguage) {
            SetCookie('userLanguage', data.userLanguage);
        }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
    }
});

// Call API common function
function CallRobotApi(api_url, post_data, suc_func, error_func) {

    var api_site = config_api_url + '/api/bot_web/';

    post_data = post_data || {};
    suc_func = suc_func || function () {
    };
    error_func = error_func || function () {
    };

    $.ajax({
        url: api_site + api_url,
        dataType: "jsonp",
        data: post_data,
        success: function (response) {
            console.log(response);
            // API return failed
            if (response.errcode != 0) {
                error_func(response);
            } else {
                // Successfully process data
                suc_func(response);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // API error exception
            var response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // Exception handling
            error_func(response);
        }
    });
};

function RobotEmailLogin(email, pass_word_hash, suc_func, error_func) {
    var api_url = "email_login.php",
        post_data = {
            "email": email,
            "pass_word_hash": pass_word_hash
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

function EditGroup(token, group_name, del, flirt, group_id, suc_func, error_func) {
    var api_url = "group_info.php",
        post_data = {
            "token": token,
            "group_name": group_name,
            "del": del,
            "flirt": flirt,
            "group_id": group_id
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}
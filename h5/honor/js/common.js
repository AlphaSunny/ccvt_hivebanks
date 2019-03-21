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
        // window.location.href = 'login.html';
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
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {

    }
});

// Call API common function
function CallApi(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + '/api/user/';
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
}

// Call the API honor
function CallLeaderBoardsApi(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + '/api/leaderBoard/';
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
}

//get honor
function GetLeaderBoard(limit, offset, search_content, group_id, suc_func, error_func) {
    var api_url = 'leaderboard.php',
        post_data = {
            "limit": limit,
            "offset": offset,
            "search_content": search_content,
            "group_id": group_id
        };
    CallLeaderBoardsApi(api_url, post_data, suc_func, error_func);
}

//获取留言
function LeaveMessageList(suc_func, error_func) {
    var api_url = 'leave_message_list.php',
        post_data = {};
    CallLeaderBoardsApi(api_url, post_data, suc_func, error_func);
}

//get GetChatPerson
function GetChatPerson(wechat, group_id, search_content, limit, offset, suc_func, error_func) {
    var api_url = 'chat_person.php',
        post_data = {
            "wechat": wechat,
            "group_id": group_id,
            "search_content": search_content,
            "limit": limit,
            "offset": offset
        };
    CallLeaderBoardsApi(api_url, post_data, suc_func, error_func);
}

//zan/cai
function ConfirmZanCai(token, give_us_id, give_num, state, suc_func, error_func) {
    var api_url = 'give_like.php',
        post_data = {
            "token": token,
            "give_us_id": give_us_id,
            "give_num": give_num,
            "state": state
        };
    CallLeaderBoardsApi(api_url, post_data, suc_func, error_func);
}

//already zan cai
function AlreadyZanCaiNum(token, suc_func, error_func) {
    var api_url = 'praise_or_pointon_num.php',
        post_data = {
            "token": token
        };
    CallLeaderBoardsApi(api_url, post_data, suc_func, error_func);
}

// user information
function UserInformation(token, suc_func, error_func) {
    var api_url = 'info_base.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//获取群列表
function GetGroupList(suc_func, error_func) {
    var api_url = 'group_list.php',
        post_data = {};
    CallLeaderBoardsApi(api_url, post_data, suc_func, error_func);
}
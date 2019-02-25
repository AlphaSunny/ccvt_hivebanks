// Set the cookies function
function SetCookie(name, value) {
    let now = new Date();
    let time = now.getTime();
    // Valid for 2 hours
    time += 3600 * 1000 * 2;
    now.setTime(time);
    document.cookie = name + "=" + escape(value) + '; expires=' + now.toUTCString() + ';path=/';
}

// Take the cookies function
function GetCookie(name) {
    let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    if (arr == null) {
        window.location.href = "login.html";
        return;
    }
}

// Delete cookie function
function DelCookie(name) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = GetCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ';path=/';
}

// Get URL parameters
function GetQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// modify URL parameters
function replaceParamVal(paramName, replaceWith) {
    let oUrl = this.location.href.toString();
    let re = eval('/(' + paramName + '=)([^&]*)/gi');
    let nUrl = oUrl.replace(re, paramName + '=' + replaceWith);
    this.location = nUrl;
    window.location.href = nUrl
}

// Email format check
function IsEmail(s) {
    let patrn = /^(?:\w+\.?)*\w+@(?:\w+\.)*\w+$/;
    return patrn.exec(s);
}

function getRootPath() {
    //Get current URL
    let curWwwPath = window.document.location.href;
    //Get the directory after the host address
    let pathName = window.document.location.pathname;
    let pos = curWwwPath.indexOf(pathName);
    //Get the host address
    let localhostPath = curWwwPath.substring(0, pos);
    //Get the project name with "/"
    let projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return localhostPath;
}

let url = getRootPath();

//获取图形验证码
function GetImgCode() {
    let src = config_api_url + '/api/inc/code.php';
    // $('#email_imgCode').attr("src", src);
    $('#phone_imgCode').attr("src", src);
}

//Get configuration file
let config_api_url = '', config_h5_url = '', userLanguage = GetCookie('userLanguage');
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

// Call the API LA configuration function
function CallLaConfigApi(api_url, post_data, suc_func, error_func) {
    let api_site = config_api_url + '/api/la/admin/configure/';
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
            let response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // Exception handling
            error_func(response);
        }
    });
}

// Call API common function
function CallRobotApi(api_url, post_data, suc_func, error_func) {

    let api_site = config_api_url + '/api/bot_web/';

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
            // console.log(response);
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
            let response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // Exception handling
            error_func(response);
        }
    });
};
//新机器人后台
//手机登录
function RobotPhoneLogin(cellphone, country_code, pass_word_hash, cfm_code, suc_func, error_func) {
    let api_url = "phone_login.php",
        post_data = {
            "cellphone": cellphone,
            "country_code": country_code,
            "pass_word_hash": pass_word_hash,
            "cfm_code": cfm_code,
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

// function RobotEmailLogin(email, pass_word_hash, suc_func, error_func) {
//     let api_url = "email_login.php",
//         post_data = {
//             "email": email,
//             "pass_word_hash": pass_word_hash
//         };
//     CallRobotApi(api_url, post_data, suc_func, error_func);
// }

//获取群列表
function GetWeChatGroup(token, suc_func, error_func) {
    let api_url = "group_temporary.php",
        post_data = {
            "token": token
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//获取群类型
function GetWeChatGroupType(token, suc_func, error_func) {
    let api_url = "group_type.php",
        post_data = {
            "token": token
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//添加群
function SubmitAddGroup(token, group_id, group_type_id, suc_func, error_func) {
    let api_url = "group_submit_audit.php",
        post_data = {
            "token": token,
            "group_id": group_id,
            "group_type_id": group_type_id
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}


//==========

//编辑群主信息
function EditGroup(token, group_name, del, flirt, group_id, send_address, bind_account_notice, is_welcome, welcome, ranking_change_switch, src, group_introduction,news_notice, suc_func, error_func) {
    let api_url = "group_edit.php",
        post_data = {
            "token": token,
            "group_name": group_name,
            "del": del,
            "flirt": flirt,
            "group_id": group_id,
            "send_address": send_address,
            "bind_account_notice": bind_account_notice,
            "is_welcome": is_welcome,
            "welcome": welcome,
            "ranking_change_switch": ranking_change_switch,
            "src": src,
            "group_introduction": group_introduction,
            "news_notice": news_notice
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//添加群主信息
function AddGroup(token, group_name, del, flirt, suc_func, error_func) {
    let api_url = "group_add.php",
        post_data = {
            "token": token,
            "group_name": group_name,
            "del": del,
            "flirt": flirt
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//获取定时任务
function GetTaskList(token, suc_func, error_func) {
    let api_url = "timer_list.php",
        post_data = {
            "token": token
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//编辑任务信息
function EditTask(token, timer_id, time, content, send_type, tx_content, type, suc_func, error_func) {
    let api_url = "timer_edit.php",
        post_data = {
            "token": token,
            "timer_id": timer_id,
            "time": time,
            "content": content,
            "send_type": send_type,
            "tx_content": tx_content,
            "type": type
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//删除任务信息
function DelTask(token, timer_id, suc_func, error_func) {
    let api_url = "timer_del.php",
        post_data = {
            "token": token,
            "timer_id": timer_id
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//获取群列表
function GetGroupList(token, is_audit, suc_func, error_func) {
    let api_url = "group_list.php",
        post_data = {
            "token": token,
            "is_audit": is_audit
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//添加任务信息
function AddTask(token, time, group_id, content, send_type, tx_content, type, suc_func, error_func) {
    let api_url = "timer_add.php",
        post_data = {
            "token": token,
            "time": time,
            "group_id": group_id,
            "content": content,
            "send_type": send_type,
            "tx_content": tx_content,
            "type": type
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//查看群成员列表
function GetGroupMember(token, group_id, limit, offset, status, suc_func, error_func) {
    let api_url = "group_members_list.php",
        post_data = {
            "token": token,
            "group_id": group_id,
            "limit": limit,
            "offset": offset,
            "status": status
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//获取聊天记录
function GetNewsRecord(token, group_id, status, suc_func, error_func) {
    let api_url = "group_message_list.php",
        post_data = {
            "token": token,
            "group_id": group_id,
            "status": status
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//搜索获取统计列表
function GetAmount(token, start_time, end_time, nickname, limit, offset, suc_func, error_func) {
    let api_url = "iss_records_list.php",
        post_data = {
            "token": token,
            "start_time": start_time,
            "end_time": end_time,
            "nickname": nickname,
            "limit": limit,
            "offset": offset
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//获取key code
function GetKeyCode(token, suc_func, error_func) {
    let api_url = 'get_key_code.php',
        post_data = {
            'token': token
        };
    CallLaConfigApi(api_url, post_data, suc_func, error_func);
}

//获取ai关键字
function GetKeyWordList(token, search_keywords, limit, offset, suc_func, error_func) {
    let api_url = 'key_words_list.php',
        post_data = {
            'token': token,
            'search_keywords': search_keywords,
            'limit': limit,
            'offset': offset
        };
    CallRobotApi(api_url, post_data, suc_func, error_func, suc_func, error_func);
}

//设置关键字开关
function KeyWordsSwitch(token, status, _switch, group_id, key_id, suc_func, error_func) {
    let api_url = 'key_words_switch.php',
        post_data = {
            'token': token,
            'status': status,
            'switch': _switch,
            'group_id': group_id,
            'key_id': key_id
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//添加ai关键字
function AddKeyWord(token, ask, answer, send_type, group_id, suc_func, error_func) {
    let api_url = 'key_words_add.php',
        post_data = {
            'token': token,
            'ask': ask,
            'answer': answer,
            'send_type': send_type,
            'group_id': group_id
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//编辑ai关键字
function EditKeyWord(token, ask, answer, send_type, group_id, key_id, suc_func, error_func) {
    let api_url = 'key_words_edit.php',
        post_data = {
            'token': token,
            'ask': ask,
            'answer': answer,
            'send_type': send_type,
            'group_id': group_id,
            'key_id': key_id
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//删除ai关键字
function DelKeyWord(token, key_id, suc_func, error_func) {
    let api_url = 'key_words_del.php',
        post_data = {
            'token': token,
            'key_id': key_id
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//loading
let loading = "";

function ShowLoading(type) {
    if (type == "show") {
        loading = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
    }
    if (type == "hide") {
        layer.close(loading);
    }
}

window.onload = function () {
    $(".loading").fadeOut(300);
};
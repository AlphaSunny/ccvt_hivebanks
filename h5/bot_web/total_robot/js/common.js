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
    if (arr == null && name == "total_robot_token") {
        window.location.href = "login.html";
        return;
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

//获取图形验证码
function GetImgCode() {
    var src = config_api_url + '/api/inc/code.php';
    // $('#email_imgCode').attr("src", src);
    $('#phone_imgCode').attr("src", src);
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

// Call the API LA configuration function
function CallLaConfigApi(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + '/api/la/admin/configure/';
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

// Call API common function
function CallRobotApi(api_url, post_data, suc_func, error_func) {

    var api_site = config_api_url + '/api/bot_web/admin/';

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
            var response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // Exception handling
            error_func(response);
        }
    });
};

//LA_LOGIN
function LaLogin(user, pass_word_hash, suc_func, error_func) {
    var api_url = 'login.php',
        post_data = {
            'user': user,
            'pass_word_hash': pass_word_hash
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//获取群列表
function GetGroupList(token, is_audit, suc_func, error_func) {
    var api_url = 'group_list.php',
        post_data = {
            'token': token,
            'is_audit': is_audit
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//审核群列表
function ReviewGroup(token, review_group_id, is_audit, why, suc_func, error_func) {
    var api_url = 'group_audit.php',
        post_data = {
            'token': token,
            'group_id': review_group_id,
            'is_audit': is_audit,
            'why': why
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//编辑群信息
function EditGroup(token, group_name, admin_del, group_manager_name, group_id, suc_func, error_func) {
    var api_url = "group_edit.php",
        post_data = {
            "token": token,
            "group_name": group_name,
            "admin_del": admin_del,
            "group_manager_name": group_manager_name,
            "group_id": group_id
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//查看群成员列表
function GetGroupMember(token, group_id, limit, offset, status, suc_func, error_func) {
    var api_url = "group_members_list.php",
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
    var api_url = "group_message_list.php",
        post_data = {
            "token": token,
            "group_id": group_id,
            "status": status
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//获取定时任务
function GetTaskList(token, suc_func, error_func) {
    var api_url = "timer_list.php",
        post_data = {
            "token": token
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

//编辑任务信息
function EditTask(token, timer_id, time, content, suc_func, error_func) {
    var api_url = "timer_edit.php",
        post_data = {
            "token": token,
            "timer_id": timer_id,
            "time": time,
            "content": content
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//删除任务信息
function DelTask(token, timer_id, suc_func, error_func) {
    var api_url = "timer_del.php",
        post_data = {
            "token": token,
            "timer_id": timer_id
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//搜索获取统计列表
function GetAmount(token, group_id, start_time, end_time, nickname, limit, offset, suc_func, error_func) {
    var api_url = "iss_records_list.php",
        post_data = {
            "token": token,
            "group_id": group_id,
            "start_time": start_time,
            "end_time": end_time,
            "nickname": nickname,
            "limit": limit,
            "offset": offset
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//获取群类型
function GetGroupTypeAdmin(token, suc_func, error_func) {
    var api_url = "group_type.php",
        post_data = {
            "token": token
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//添加群类型
function AddGroupType(token, name, suc_func, error_func) {
    var api_url = "group_type_add.php",
        post_data = {
            "token": token,
            "name": name
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//删除群类型
function DeleteGroupType(token, type_id, suc_func, error_func) {
    var api_url = "group_type_del.php",
        post_data = {
            "token": token,
            "type_id": type_id
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//编辑群类型
function EditGroupType(token, type_id, name, suc_func, error_func) {
    var api_url = "group_type_edit.php",
        post_data = {
            "token": token,
            "type_id": type_id,
            "name": name,
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//踩-赞记录
function GiveLikeList(token, limit, offset, suc_func, error_func) {
    var api_url = "glory_integral_list.php",
        post_data = {
            "token": token,
            "limit": limit,
            "offset": offset
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//获取key code
function GetKeyCode(token, suc_func, error_func) {
    var api_url = 'get_key_code.php',
        post_data = {
            'token': token
        };
    CallLaConfigApi(api_url, post_data, suc_func, error_func);
}

//获取ai关键字
function GetKeyWordList(token, limit, offset, suc_func, error_func) {
    var api_url = 'key_words_list.php',
        post_data = {
            'token': token,
            'limit': limit,
            'offset': offset
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//添加ai关键字
function AddKeyWord(token, ask, answer, send_type, suc_func, error_func) {
    var api_url = 'key_words_add.php',
        post_data = {
            'token': token,
            'ask': ask,
            'answer': answer,
            'send_type': send_type
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//编辑ai关键字
function EditKeyWord(token, ask, answer, send_type, key_id, suc_func, error_func) {
    var api_url = 'key_words_edit.php',
        post_data = {
            'token': token,
            'ask': ask,
            'answer': answer,
            'send_type': send_type,
            'key_id': key_id
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

//删除ai关键字
function DelKeyWord(token, key_id, suc_func, error_func) {
    var api_url = 'key_words_del.php',
        post_data = {
            'token': token,
            'key_id': key_id
        };
    CallRobotApi(api_url, post_data, suc_func, error_func);
}

/**
 * Disable button
 * @param $this Button object
 * @param btnText Button text content defaults to "in process"
 * @return {boolean}
 */
function DisableClick($this, btnText) {
    if (!$this) {
        console.warn("$this Can not be empty");
        return true;
    }
    var status = Number($this.attr('data-clickStatus') || 1);
    if (status == 0) {
        return true;
    }

    btnText = btnText ? btnText : "loading...";
    $this.attr('data-clickStatus', 0);
    $this.html(btnText);
    return false;
}

/**
 * Activation button
 * @param $this Button object
 * @param btnText Button text content defaults to "in process"
 */
function ActiveClick($this, btnText) {
    if (!$this) {
        console.warn("$this Can not be empty");
        return;
    }
    btnText = btnText ? btnText : "确认";
    $this.attr('data-clickStatus', 1);
    $this.html(btnText);
}

window.onload = function () {
    $(".loading").fadeOut(300);
};

//loading
var loading = "";

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
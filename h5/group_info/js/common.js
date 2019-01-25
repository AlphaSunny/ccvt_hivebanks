// Get URL parameters
function GetQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//CallApi
function CallApi(api_url, post_data, suc_func, error_func) {
    let api_site = api_url + '/api/group_info/';
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

function _GetGroupList(limit, offset, search_name, scale, type_id, suc_func, error_func) {
    let api_url = "group_list.php";
    let post_data = {
        "limit": limit,
        "offset": offset,
        "search_name": search_name,
        "scale": scale,
        "type_id": type_id
    };
    CallApi(api_url, post_data, suc_func, error_func);
}

function GetGroupSearch(suc_func, error_func) {
    let api_url = "group_search.php";
    let post_data = {};
    CallApi(api_url, post_data, suc_func, error_func);
}
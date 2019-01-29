// Get URL parameters
function GetQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
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
let config_api_url = '';
$.ajax({
    url: url + "/h5/assets/json/config_url.json",
    async: false,
    type: "GET",
    dataType: "json",
    success: function (data) {
        config_api_url = data.api_url;
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {

    }
});

//CallApi
function CallApi(api_url, post_data, suc_func, error_func) {
    let api_site = config_api_url + '/api/group_info/';
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

function GetDoMainInfo(group_id, suc_func, error_func) {
    let api_url = "group_info.php";
    let post_data = {
        "group_id": group_id
    };
    CallApi(api_url, post_data, suc_func, error_func);
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

/**
 * Initialization page loading loading
 */
window.onload = function () {
    // $("header").css("background-image", "url(assets/img/banner-1.jpg)");
    if (document.readyState === 'loading') {
        document.body.style.overflow = "hidden";
    } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
        document.body.style.overflow = "auto";
        let loading = document.querySelector(".loading");
        loading.parentNode.removeChild(loading);
    }
};
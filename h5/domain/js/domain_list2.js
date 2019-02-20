$(function () {
    function GetIndexCookie(name) {
        let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }

    let user_token = GetIndexCookie('user_token');

    if (user_token) {
        $('.usLogin,.usRegister').remove();
        $('.accountNone').removeClass('none');
    } else {
        $('.accountNone').remove();
    }


    $('.toAccountBtn').click(function () {
        if (user_token) {
            window.location.href = 'user/account.html';
        }
    });

    //获取群列表
    let limit = 20, offset = 0, search_name = "", scale = "", type_id = "";

    function getGroupListFun(limit, offset, search_name, scale, type_id) {
        let count = "";
        _GetGroupList(limit, offset, search_name, scale, type_id, function (response) {
            ShowLoading("hide");
            if (response.errcode == "0") {
                let data = response.rows;
                let div = "", group_money = "";
                let total = response.total;
                let totalPage = Math.ceil(total / limit);
                if (totalPage <= 1) {
                    count = 1;
                } else if (1 < totalPage && totalPage <= 6) {
                    count = totalPage;
                } else {
                    count = 6;
                }
                if (total <= 0) {
                    $(".group_row").html("<h2>暂无数据</h2>");
                    return;
                }
                $.each(data, function (i, val) {
                    let scale = "<svg class='icon icon_grade' aria-hidden='true'><use xlink:href='#icon-v" + data[i].scale + "'></use></svg>";

                    if (!data[i].fee || data[i].fee <= 0) {
                        group_money = "<p class='group_money'>免费</p>";
                    } else {
                        group_money = "<p class='group_money'>" + data[i].fee + "</p>";
                    }

                    div += "<div class='col col-md-3 col-sm-6 col-xs-6 group_col'>" +
                        "<div class='group_container' title='" + data[i].name + "' id=" + data[i].id + ">" +
                        "<div class='group_head'>" +
                        "<button class='join_btn'>加入领域</button>" +
                        "<h3>" + scale + data[i].name + "</h3>" +
                        "<p>荣耀星数 ✨" + data[i].glory_number + "</p>" +
                        "<p>" + data[i].type_name + "</p>" +
                        group_money +
                        "</div>" +
                        "</div>" +
                        "</div>";
                });
                $(".group_row").html(div);
                $("#pagination").pagination({
                    currentPage: (limit + offset) / limit,
                    totalPage: totalPage,
                    isShow: false,
                    count: count,
                    prevPageText: "<<",
                    nextPageText: ">>",
                    callback: function (current) {
                        getGroupListFun(limit, (current - 1) * limit, search_name, scale, type_id);
                        ShowLoading("show");
                    }
                });
            }
        }, function (response) {
            ShowLoading("hide");
            ErrorPrompt(response.errmsg);
        });
    }

    getGroupListFun(limit, offset, search_name, scale, type_id);

    //前往群详情
    $(document).on("click", ".group_container", function () {
        let id = $(this).attr("id");
        window.location.href = "domain_info.html?id=" + id;
    });

    //加入领域
    $(document).on("click", ".join_btn", function (e) {
        e.preventDefault();
        e.stopPropagation();
        let fee = $(this).siblings(".group_money").text();
        console.log(fee);
        if (!user_token) {
            WarnPrompt("请先登录");
            return;
        } else if (fee != "免费") {
            //收费提示
            layer.confirm('您将支付' + fee + 'CCVT', {
                btn: ['支付', '取消'] //按钮
            }, function () {
                SuccessPrompt("支付成功");
            }, function () {
                WarnPrompt("已取消");
            });
        } else {
            SuccessPrompt("加入成功");
        }
    });

    //获取筛选列表
    GetGroupSearch(function (response) {
        let option_scale = "<option value=''>等级筛选</option>";
        let option_type = "<option value=''>类型筛选</option>";
        let scale_list = response.rows.scale_list;
        let type_list = response.rows.type_list;
        $.each(scale_list, function (i, val) {
            option_scale += "<option value=" + scale_list[i].scale + ">" + scale_list[i].scale + "</option>";
        });
        $("#level").html(option_scale);

        $.each(type_list, function (i, val) {
            option_type += "<option value=" + type_list[i].id + ">" + type_list[i].name + "</option>";
        });
        $("#type").html(option_type);
    }, function (response) {
        ErrorPrompt(response.errmsg);
    });

    //等级筛选
    $("#level").on("change", function () {
        scale = $(this).find("option:selected").val();
        type_id = "";
        search_name = "";
        // limit = 10;
        // offset = 0;
        if (!scale) {
            scale = "";
            ShowLoading("show");
            getGroupListFun(limit, offset, search_name, scale, type_id);
        }
        ShowLoading("show");
        getGroupListFun(limit, offset, search_name, scale, type_id);
    });

    //类型筛选
    $("#type").on("change", function () {
        type_id = $(this).find("option:selected").val();
        console.log(type_id);
        scale = "";
        search_name = "";
        // limit = 10;
        // offset = 0;
        if (!type_id) {
            console.log("不存在");
            type_id = "";
            ShowLoading("show");
            getGroupListFun(limit, offset, search_name, scale, type_id);
        }
        ShowLoading("show");
        getGroupListFun(limit, offset, search_name, scale, type_id);
    });


    //名称筛选
    function searchNameFun(search_name) {
        type_id = "";
        scale = "";

        ShowLoading("show");
        getGroupListFun(limit, offset, search_name, scale, type_id);
    }

    $(".search_icon").click(function () {
        search_name = $(".search_name_input").val();
        if (search_name.length <= 0) {
            WarnPrompt("请输入搜索内容");
            return;
        }
        searchNameFun(search_name);
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 13) {
            $(".search_icon").triggerHandler("click");
        }
    });

    $(".search_name_input").bind("input propertychange", function () {
        if ($(".search_name_input").val().length <= 0) {
            search_name = "";
            searchNameFun(search_name);
        }
    })
});
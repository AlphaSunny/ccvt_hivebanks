$(function () {
    var tr = "", td = "", limit = "10", offset = "0";

    function Fun(limit, offset) {
        GetLeaderBoard(limit, offset, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                $.each(data, function (i, val) {
                    if (data[i].sorting == "1") {
                        tr += "<tr>" +
                            "<td><svg class='icon' aria-hidden='true'><use xlink:href='#icon-first'></use></svg></td>" +
                            "<td><a href='javascript:;' title='查看聊天内容' class='link_name'>" + data[i].wechat + "</a></td>" +
                            "<td>" + data[i].base_amount + "</td>" +
                            "<td>" +
                            "<svg class='icon zan_icon' aria-hidden='true'><use xlink:href='#icon-zan'></use></svg>" +
                            "<span class='zan_num'>" + data[i].all_praise + "</span>&nbsp;|&nbsp;" +
                            "<svg class='icon cai_icon' aria-hidden='true'><use xlink:href='#icon-cai'></use></svg>" +
                            "<span class='cai_num'>" + data[i].all_point_on + "</span>" +
                            "</td>" +
                            "</tr>";
                    } else if (data[i].sorting == "2") {
                        tr += "<tr>" +
                            "<td><svg class='icon' aria-hidden='true'><use xlink:href='#icon-second'></use></svg></td>" +
                            "<td><a href='javascript:;' title='查看聊天内容' class='link_name'>" + data[i].wechat + "</a></td>" +
                            "<td>" + data[i].base_amount + "</td>" +
                            "<td>" +
                            "<svg class='icon zan_icon' aria-hidden='true'><use xlink:href='#icon-zan'></use></svg>" +
                            "<span class='zan_num'>" + data[i].all_praise + "</span>&nbsp;|&nbsp;" +
                            "<svg class='icon cai_icon' aria-hidden='true'><use xlink:href='#icon-cai'></use></svg>" +
                            "<span class='cai_num'>" + data[i].all_point_on + "</span>" +
                            "</td>" +
                            "</tr>";
                    } else if (data[i].sorting == "3") {
                        tr += "<tr>" +
                            "<td><svg class='icon' aria-hidden='true'><use xlink:href='#icon-third'></use></svg></td>" +
                            "<td><a href='javascript:;' title='查看聊天内容' class='link_name'>" + data[i].wechat + "</a></td>" +
                            "<td>" + data[i].base_amount + "</td>" +
                            "<td>" +
                            "<svg class='icon zan_icon' aria-hidden='true'><use xlink:href='#icon-zan'></use></svg>" +
                            "<span class='zan_num'>" + data[i].all_praise + "</span>&nbsp;|&nbsp;" +
                            "<svg class='icon cai_icon' aria-hidden='true'><use xlink:href='#icon-cai'></use></svg>" +
                            "<span class='cai_num'>" + data[i].all_point_on + "</span>" +
                            "</td>" +
                            "</tr>";
                    } else {
                        tr += "<tr>" +
                            "<td>" + data[i].sorting + "</td>" +
                            "<td><a href='javascript:;' title='查看聊天内容' class='link_name'>" + data[i].wechat + "</a></td>" +
                            "<td>" + data[i].base_amount + "</td>" +
                            "<td>" +
                            "<svg class='icon zan_icon' aria-hidden='true'><use xlink:href='#icon-zan'></use></svg>" +
                            "<span class='zan_num'>" + data[i].all_praise + "</span>&nbsp;|&nbsp;" +
                            "<svg class='icon cai_icon' aria-hidden='true'><use xlink:href='#icon-cai'></use></svg>" +
                            "<span class='cai_num'>" + data[i].all_point_on + "</span>" +
                            "</td>" +
                            "</tr>"
                    }
                });
                $("#leaderBoardBody").html(tr);
            }
        }, function (response) {
            alert(response.errmsg);
        });
    }

    Fun(limit, offset);

    $(".pre_btn").click(function () {
        if ($(this).attr("disabled")) {
            console.log("disabled")
        } else {
            console.log("no_disabled");
        }
    });

    $(document).on("click", ".link_name", function () {
        var wechat = $(this).text();
        window.location.href = "chat_person.html?wechat=" + wechat;
    });

    $(document).on("click", ".zan_icon,.cai_icon", function () {
        if ($(this).hasClass("zan_icon")) {
            $(".zan_h3").fadeIn("fast");
            $(".zan_text_box").fadeIn("fast");
            $(".cai_h3").fadeOut("fast");
            $(".cai_text_box").fadeOut("fast");
        } else if ($(this).hasClass("cai_icon")) {
            $(".cai_h3").fadeIn("fast");
            $(".cai_text_box").fadeIn("fast");
            $(".zan_h3").fadeOut("fast");
            $(".zan_text_box").fadeOut("fast");
        }
        $("#customize_modal").slideDown();
    });

    $(".customize_modal_cancel_btn").click(function () {
        $("#customize_modal").slideUp();
    });
});
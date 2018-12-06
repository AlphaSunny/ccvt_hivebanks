$(function () {
    function Fun() {
        var tr = "", td = "";
        GetLeaderBoard(function (response) {
            console.log(response);
        }, function (response) {

        });

        // $.each(arr, function (i, val) {
        //     if (arr[i].id == "1") {
        //         tr += "<tr>" +
        //             "<td><svg class='icon' aria-hidden='true'><use xlink:href='#icon-first'></use></svg></td>" +
        //             "<td><a href='javascript:;' title='查看聊天内容' class='link_name'>" + arr[i].name + "</a></td>" +
        //             "<td>" + arr[i].glory + "</td>" +
        //             "<td>" +
        //             "<svg class='icon zan_icon' aria-hidden='true'><use xlink:href='#icon-zan'></use></svg>" +
        //             "<span class='zan_num'>100</span>&nbsp;|&nbsp;" +
        //             "<svg class='icon cai_icon' aria-hidden='true'><use xlink:href='#icon-cai'></use></svg>" +
        //             "<span class='cai_num'>200</span>" +
        //             "</td>" +
        //             "</tr>";
        //     } else if (arr[i].id == "2") {
        //         tr += "<tr>" +
        //             "<td><svg class='icon' aria-hidden='true'><use xlink:href='#icon-second'></use></svg></td>" +
        //             "<td><a href='javascript:;' title='查看聊天内容' class='link_name'>" + arr[i].name + "</a></td>" +
        //             "<td>" + arr[i].glory + "</td>" +
        //             "<td>" +
        //             "<svg class='icon zan_icon' aria-hidden='true'><use xlink:href='#icon-zan'></use></svg>" +
        //             "<span class='zan_num'>100</span>&nbsp;|&nbsp;" +
        //             "<svg class='icon cai_icon' aria-hidden='true'><use xlink:href='#icon-cai'></use></svg>" +
        //             "<span class='cai_num'>100</span>" +
        //             "</td>" +
        //             "</tr>";
        //     } else if (arr[i].id == "3") {
        //         tr += "<tr>" +
        //             "<td><svg class='icon' aria-hidden='true'><use xlink:href='#icon-third'></use></svg></td>" +
        //             "<td><a href='javascript:;' title='查看聊天内容' class='link_name'>" + arr[i].name + "</a></td>" +
        //             "<td>" + arr[i].glory + "</td>" +
        //             "<td>" +
        //             "<svg class='icon zan_icon' aria-hidden='true'><use xlink:href='#icon-zan'></use></svg>" +
        //             "<span class='zan_num'>100</span>&nbsp;|&nbsp;" +
        //             "<svg class='icon cai_icon' aria-hidden='true'><use xlink:href='#icon-cai'></use></svg>" +
        //             "<span class='cai_num'>100</span>" +
        //             "</td>" +
        //             "</tr>";
        //     } else {
        //         tr += "<tr>" +
        //             "<td>" + arr[i].id + "</td>" +
        //             "<td><a href='javascript:;' title='查看聊天内容' class='link_name'>" + arr[i].name + "</a></td>" +
        //             "<td>" + arr[i].glory + "</td>" +
        //             "<td>" +
        //             "<svg class='icon zan_icon' aria-hidden='true'><use xlink:href='#icon-zan'></use></svg>" +
        //             "<span class='zan_num'>100</span>&nbsp;|&nbsp;" +
        //             "<svg class='icon cai_icon' aria-hidden='true'><use xlink:href='#icon-cai'></use></svg>" +
        //             "<span class='cai_num'>100</span>" +
        //             "</td>" +
        //             "</tr>"
        //     }
        // });
        // $("#leaderBoardBody").html(tr);
    }

    Fun();

    $(document).on("click", ".link_name", function () {
        window.location.href = "chat_person.html";
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
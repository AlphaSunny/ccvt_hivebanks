$(function () {
    let new_arr = [];
    LeaveMessageList(function (response) {
        let data = response.rows;
        $.each(data, function (index, item) {
            if (item.leave_message) {
                new_arr.push(item);
                leaveList();
            }
        });

    }, function (response) {
        layer.msg("留言获取失败");
    });

    //留言列表
    function leaveList() {
        let li = "";
        $.each(new_arr, function (index, item) {
            li += "<li>" +
                "<svg class='icon icon_grade' aria-hidden='true'><use xlink:href='#icon-v" + item.scale + "'></use></svg>&nbsp;" +
                "<span>" + item.wechat + "</span>:&nbsp;&nbsp;" +
                "<span class='message'>" + item.leave_message + "</span>" +
                "</li>";
        });
        $(".leave_message_list").html(li);
        leaveInterval();
    }

    //定时滚动留言
    function leaveInterval() {
        setInterval(function () {
            startScroll();
        }, 5000);
    }

    function startScroll() {
        let height = $(".leave_message_list_box").find("ul>li").height();
        let margin_top_0 = 0;
        $(".leave_message_list_box").find("ul:first").animate({
            marginTop: -height,
        }, 2000, "linear", function () {
            $(this).css({marginTop: margin_top_0}).find("li:first").appendTo(this);
        })
    }
});
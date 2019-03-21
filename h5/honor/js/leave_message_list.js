$(function () {
    LeaveMessageList(function (response) {
        let li = "", name = "", text = "", new_arr = [
            {
                scale: 3,
                wechat: "范德萨发发3",
                leave_message: "范德萨发发范德萨发发范德萨发发范德萨发发范德萨发发范德萨发发范德萨发发范德萨发发"
            },
            {
                scale: 2,
                wechat: "范德萨发发2",
                leave_message: "范德萨发发范德萨发发范德萨发发范德萨发发范德萨发发范德萨发发范德萨发发范德萨发发"
            },
            {
                scale: 1,
                wechat: "范德萨发发1",
                leave_message: "范德萨发发范德萨发发范德萨发发范德萨发发范德萨发发范德萨发发范德萨发发范德萨发发"
            },
            {
                scale: 4,
                wechat: "范德萨发发4",
                leave_message: "范德萨发发范德萨发发范德萨发发范德萨发发范德萨发发范德萨发发范德萨发发范德萨发发"
            },
        ];
        let data = response.rows;
        $.each(data, function (index, item) {
            if (item.leave_message) {
                new_arr.push(item);
            }
        });
        $.each(new_arr, function (index, item) {
            console.log(new_arr.length);
            li += "<li>" +
                "<svg class='icon icon_grade' aria-hidden='true'><use xlink:href='#icon-v" + item.scale + "'></use></svg>&nbsp;" +
                "<span>" + item.wechat + "</span>:&nbsp;&nbsp;" +
                "<span class='message'>" + item.leave_message + "</span>" +
                "</li>";
        });
        $(".leave_message_list").html(li);
        leaveInterval();
    }, function (response) {
        layer.msg("留言获取失败");
    });

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
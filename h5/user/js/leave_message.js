$(function () {
    let token = GetCookie("user_token");

    $(".leave_message_link").click(function () {
        $("#leave_message").modal("show");
        let length = $("#leave_message_text").val().length;
        $(".input_num").text(length);
    });

    $("#leave_message_text").bind("input", "propertychange", function () {
        let length = $(this).val().length;
        $(".input_num").text(length);
    });

    $(".confirm_leave_message_btn").click(function () {
        let leave_message = $("#leave_message_text").val();
        ShowLoading("show");
        LeaveMessage(token, leave_message, function (response) {
            ShowLoading("hide");
            if (response.errcode == "0") {
                SuccessPrompt("提交成功");
                $("#leave_message_text").val("");
                $(".leave_message_info").text(response.leave_message);
                $("#leave_message").modal("hide");
            }
        }, function (response) {
            ShowLoading("hide");
            ErrorPrompt(response.errmsg);
        })
    })
});
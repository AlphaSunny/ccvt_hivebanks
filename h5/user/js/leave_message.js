$(function () {
    let token = GetCookie("user_token");

    $("#leave_message_text").bind("input", "propertychange", function () {
        let length = $(this).val().length;
        $(".input_num").text(length);
    });

    $(".confirm_leave_message_btn").click(function () {
        let leave_message = $("#leave_message_text").val();
        LeaveMessage(token, leave_message, function (response) {
            if(response.errcode == "0"){
                SuccessPrompt("提交成功");
                $("#leave_message_text").val("");
                $("#leave_message").modal("hide");
            }
        }, function (response) {
            ErrorPrompt(response.errmsg);
        })
    })
});
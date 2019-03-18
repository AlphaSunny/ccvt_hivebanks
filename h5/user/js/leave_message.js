$(function () {
    let token = GetCookie("user_token");
    console.log(token);
    $("#leave_message_text").bind("input", "propertychange", function () {
        let length = $(this).val().length;
        console.log(length);
        $(".input_num").text(length);
    });
});
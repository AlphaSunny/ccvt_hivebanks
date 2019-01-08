$(function () {
    var token = GetCookie("robot_token");
    var is_audit = "1";

    function GetGroupListNav() {
        GetGroupList(token, is_audit, function (response) {
            if (response.errcode == "0") {
                var data = response.rows[0];
                $(".group_name_input").val(data.name);
                $(".group_name").text(data.name);
                if (data.is_admin_del == "1") {
                    $(".is_admin_del").val("1").addClass("active");
                } else {
                    $(".is_admin_del").val("2").removeClass("active");
                }
                if (data.is_flirt == "1") {
                    $(".is_flirt").val("1").addClass("active");
                } else {
                    $(".is_flirt").val("2").removeClass("active");
                }
                if (data.send_address == "1") {
                    $(".send_address").val("1").addClass("active");
                } else {
                    $(".send_address").val("2").removeClass("active");
                }
                if (data.bind_account_notice == "1") {
                    $(".bind_account_notice").val("1").addClass("active");
                } else {
                    $(".bind_account_notice").val("2").removeClass("active");
                }
                if (data.is_welcome == "1") {
                    $(".is_welcome").val("1").addClass("active");
                    $(".welcome_text").text(data.welcome).removeClass("none");
                } else {
                    $(".is_welcome").val("2").removeClass("active");
                    $(".welcome_text").text("").addClass("none");
                }


            }
        }, function (response) {
            layer.msg("请稍后再试");
        })
    }

    GetGroupListNav();
});
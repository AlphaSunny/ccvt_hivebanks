let token = GetCookie("user_token");
let is_audit = "1";

function GetGroupListNav() {
    GetGroupList(token, is_audit, function (response) {
        if (response.errcode == "0") {
            let data = response.rows[0];
            if (!data) {
                return;
            }
            SetCookie("group_id", data.id);
            $(".group_name_input").val(data.name);
            $(".group_name").text(data.name);
            $(".new_number").text(data.new_number);
            $(".message_number").text(data.messages_number);
            $(".members_number").text(data.members_number);
            $(".qr_code_address").attr("src", data.qr_code_address);
            $("#group_introduction").val(data.dis);
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
            if (data.news_switch == "1") {
                $(".newsSwitch").val("1").addClass("active");
                $(".news_chat_time_box").addClass("none");
            } else {
                $(".newsSwitch").val("2").removeClass("active");
                $(".news_chat_time_box").addClass("none");
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

            if (data.ranking_change_switch == "1") {
                $(".ranking_change_switch").val("1").addClass("active");
            } else {
                $(".ranking_change_switch").val("2").removeClass("active");
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

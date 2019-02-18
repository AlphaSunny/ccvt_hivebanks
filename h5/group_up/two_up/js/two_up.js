$(function () {
    let url_path = window.location.hostname;
    let url = "https://" + url_path + "/api/crontab/get_scale_us_data.php";
    $.ajax({
        type: "GET",
        dataType: "json",
        url: url,
        success: function (res) {
            let data = res.all_list;
            if (data == "") {
                ErrorPrompt("暂无数据");
                return;
            }
        }
    })
});
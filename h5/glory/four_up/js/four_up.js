$(function () {
    let url_path = window.location.hostname;
    let url = "https://" + url_path + "/api/crontab/get_scale_us_data.php";
    let all_list = [];
    $.ajax(
        {
            type: "GET",
            url: url,
            dataType: "json",
            success: function (res) {
                let data = res.all_list;
                if (data == "") {
                    ErrorPrompt("暂无数据");
                    return;
                }
                let item_list = res;
                $.each(item_list, function (i, val) {
                    console.log(i);
                    console.log(val);
                })
            }
        }
    )
});
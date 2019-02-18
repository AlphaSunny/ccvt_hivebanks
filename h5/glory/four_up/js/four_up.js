$(function () {
    let url_path = window.location.hostname;
    let url = "https://" + url_path + "/api/crontab/get_scale_us_data.php";
    let all_list = [],item_list_arr = [];
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
                    // console.log(i.indexOf("list_"));
                    if (i.indexOf("list_") > -1) {
                        // console.log(item_list[i]);
                        item_list_arr.push(item_list[i]);
                    }
                });
                console.log(item_list_arr);
            }
        }
    )
});
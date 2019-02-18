$(function () {
    let url_path = window.location.hostname;
    let url = "https://" + url_path + "/api/crontab/get_scale_us_data.php";
    let all_list = [], item_list_arr = [], item_length = 0;
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
                    if (i.indexOf("list_") > -1) {
                        item_list_arr.push(item_list[i]);
                    }
                });
                for (let i = 0; i < item_list_arr.length; i++) {
                    console.log(item_list_arr[i]);
                    for (let j = 0; j < item_list_arr[i].length; j++) {
                        console.log(item_list_arr[i].length);
                    }
                }
            }
        }
    )
});
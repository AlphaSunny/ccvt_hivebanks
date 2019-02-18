$(function () {
    let url_path = window.location.hostname;
    let url = "https://" + url_path + "/api/crontab/get_scale_us_data.php";
    let all_list = [], item_list_arr = [], div = "", ul = "";
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
                    div += "<div class='up_item'>" +
                        "<h2>4</h2>";
                    for (let j = 0; j < item_list_arr[i].length; j++) {
                        ul += "<ul>" +
                            "<li>" +
                            "<svg class='icon'><use xlink:href='#icon-lv1'></use></svg>" +
                            "<span>" + item_list_arr[i][j].wechat + "</span>" +
                            "</li>" +
                            "</ul>";
                    }
                    div.append(ul);
                }
                $(".up_content").html(div);
            }
        }
    )
});
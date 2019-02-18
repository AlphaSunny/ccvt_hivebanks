$(function () {
    let url_path = window.location.hostname;
    let url = "https://" + url_path + "/api/crontab/get_scale_us_data.php";
    let all_list = [], item_list_arr = [], level_list = [];
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
                        level_list.push(i);
                    }
                });
                for (let i = 0; i < item_list_arr.length; i++) {
                    let div = $("<div class='up_item'><h2><svg class='icon'><use xlink:href='#icon-lv"+ level_list[i].split("list_")[1] +"'></use></svg><span>" + level_list[i].split("list_")[1] + "</span>级用户</h2><ul class='item_ul'></ul></div>");
                    let li = "";
                    for (let j = 0; j < item_list_arr[i].length; j++) {
                        li += "<li>" +
                            "<svg class='icon'><use xlink:href='#icon-lv"+ level_list[i].split("list_")[1] +"'></use></svg>" +
                            "<span title=" + item_list_arr[i][j].wechat + ">" + item_list_arr[i][j].wechat + "</span>" +
                            "</li>";
                    }
                    div.find(".item_ul").html(li);
                    $(".up_content").append(div);
                }

            }
        }
    )
});
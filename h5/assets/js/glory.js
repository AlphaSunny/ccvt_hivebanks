$(function () {
    var h1_text = "首批创世用户升级荣耀等级";
    var index = 0;
    var timer = "";
    var li = "", li_2 = "";
    // timer = setInterval(function () {
    //     if (index >= 12) {
    //         clearInterval(timer);
    //         $("#first_box").remove();
    //         GetGlory();
    //     }
    //     var str = h1_text.substr(index, 2);
    //     index += 2;
    //     $(".first_text").text(str);
    // }, 1000);

    function GetGlory() {
        $.ajax({
            url: "https://ccvt.io/api/crontab/get_scale_us_data.php",
            type: "GET",
            dataType: "jsonp",
            success: function (response) {
                var data = response.rows;
                $.each(data, function (i, val) {
                    if (i <= 9) {
                        li += "<li class='wow bounceInRight' data-wow-delay=" + Number((i + 1) * 0.4) + 's' + ">" +
                            "<div>" + data[i].us_account + "</div>" +
                            "<div>" +
                            "<small>" + data[i].base_amount + "</small>" +
                            "<small>" + data[i].scale + "</small>" +
                            "</div>" +
                            "</li>";
                        $(".item").html(li);
                    } else if (10 <= i <= 19) {
                        li_2 += "<li class='wow bounceInLeft' data-wow-delay=" + Number((i + 1) * 0.4) + 's' + ">" +
                            "<div>" + data[i].us_account + "</div>" +
                            "<div>" +
                            "<small>" + data[i].base_amount + "</small>" +
                            "<small>" + data[i].scale + "</small>" +
                            "</div>" +
                            "</li>";
                        $(".item_2").html(li_2);
                    }
                });
            },
            error: function () {

            }
        });
    }
    GetGlory();
});
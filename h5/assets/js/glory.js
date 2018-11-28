$(function () {
    var li = "", li_2 = "";
    $.ajax({
        url: "https://ccvt_test.fnying.com/api/crontab/get_scale_us_data.php",
        type: "GET",
        dataType:"jsonp",
        success: function (response) {
            var data = response.rows;
            $.each(data, function (i, val) {
                console.log(val);
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
});
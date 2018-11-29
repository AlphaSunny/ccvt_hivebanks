$(function () {
    var li = "", li_2 = "";

    function GetGlory() {
        $.ajax({
            // url: "https://ccvt.io/api/crontab/get_scale_us_data.php",
            url: "https://ccvt_test.fnying.com/api/crontab/get_scale_us_data.php",
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
                alert("排行榜获取失败");
            }
        });
    }

    function SetProgress(i) {
        $(".progress_span").css("width", i + "%");
        $(".progress_text").text(i + "%");
    }

    var i = Math.ceil(Math.random() * 10);

    function doProgress() {
        if (i > 100) {
            $(".progress_span").css("width", "100%");
            $(".progress_text").text(100 + "%");
            $(".up_title").text("升级成功");

            setTimeout(function () {
                $(".up_title,#first_box").remove();
                GetGlory();
            },2000);
        }
        if (i <= 100) {
            setTimeout(function () {
                doProgress();
            },500);
            SetProgress(i);
            i += Math.ceil(Math.random() * 20);
        }
    }

    $(".first_text").click(function () {
        doProgress();
        $(this).remove();
        $(".progress_box").css("display","block");
    });
});
$(function () {
    var li = "", li_2 = "";

    function GetGlory() {
        $.ajax({
            url: "https://ccvt_test.fnying.com/api/crontab/get_scale_us_data.php",
            type: "GET",
            dataType: "jsonp",
            success: function (response) {
                var data = response.rows;
                $(".up_title,#first_box").remove();
                console.log(data.length);
                var first_col = Math.floor(data.length / 2); //12
                var first_col2 = Math.ceil(data.length / 2); //13
                console.log(first_col);
                console.log(first_col2);
                $(".leaderboard_2 ol").css("counter-reset","leaderboard_2 "+ Math.floor(data.length / 2) +"");
                $.each(data, function (i, val) {
                    if (i < Math.floor(data.length / 2)) {
                        li += "<li class='wow bounceInRight' data-wow-delay=" + Number((i + 1) * 0.2) + 's' + ">" +
                            "<div>" + data[i].us_account + "</div>" +
                            "</li>";
                        $(".item").html(li);
                    } else {
                        li_2 += "<li class='wow bounceInLeft' data-wow-delay=" + Number((i + 1) * 0.2) + 's' + ">" +
                            "<div>" + data[i].us_account + "</div>" +
                            "</li>";
                        $(".item_2").html(li_2);
                    }
                    //     if (i <= 9) {
                    //         li += "<li class='wow bounceInRight' data-wow-delay=" + Number((i + 1) * 0.4) + 's' + ">" +
                    //             "<div>" + data[i].us_account + "</div>" +
                    //             "</li>";
                    //         $(".item").html(li);
                    //     } else if (10 <= i <= 19) {
                    //         li_2 += "<li class='wow bounceInLeft' data-wow-delay=" + Number((i + 1) * 0.4) + 's' + ">" +
                    //             "<div>" + data[i].us_account + "</div>" +
                    //             "</li>";
                    //         $(".item_2").html(li_2);
                    //     }
                });
            },
            error: function () {
                alert("排行榜获取失败");
            }
        });
    }

    GetGlory();

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

            // setTimeout(function () {
            //     GetGlory();
            // },2000);
        }
        if (i <= 100) {
            setTimeout(function () {
                doProgress();
            }, 500);
            SetProgress(i);
            i += Math.ceil(Math.random() * 20);
        }
    }

    $(".first_text").click(function () {
        doProgress();
        $(this).remove();
        $(".progress_box").css("display", "block");
    });
});
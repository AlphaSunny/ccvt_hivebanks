$(function () {
    // var arr = [
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    //     {"name": "edwin", "level": "1", "glory": "100"},
    // ];
    var li = "", li_2 = "";
    $.ajax({
        url:"https://ccvt_test.fnying.com/api/crontab/get_scale_us_data.php",
        type:"GET",
        success:function (response) {
            if(response.errcode == "0"){
                var data = response.rows;
                $.each(data, function (i, val) {
                    if (i <= 9) {
                        li += "<li class='wow bounceInRight' data-wow-delay=" + Number((i + 1) * 0.4) + 's' + ">" +
                            "<div>" + arr[i].name + "</div>" +
                            "<div>" +
                            "<small>" + arr[i].glory + "</small>" +
                            "<small>" + arr[i].level + "</small>" +
                            "</div>" +
                            "</li>";
                        $(".item").html(li);
                    } else if (10 <= i <= 19) {
                        li_2 += "<li class='wow bounceInLeft' data-wow-delay=" + Number((i + 1) * 0.4) + 's' + ">" +
                            "<div>" + arr[i].name + "</div>" +
                            "<div>" +
                            "<small>" + arr[i].glory + "</small>" +
                            "<small>" + arr[i].level + "</small>" +
                            "</div>" +
                            "</li>";
                        $(".item_2").html(li_2);
                    }
                });
            }
        },
        error:function () {

        }
    });
});
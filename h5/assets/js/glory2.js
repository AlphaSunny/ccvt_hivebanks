$(function () {
    var arr_list = [];
    var h1 = "";

    var li = "";
    var i = 0;
    var timer = "";
    var length = "";

    function start() {
        if(i == 0){
            big_name(i);
            i++;
        }
        timer = setInterval(function () {
            big_name(i);
            i++;
        }, 3000);
    }


    function big_name(i) {
        if (i >= arr_list.length) {
            $(".big_name,.show_name").remove();
            $(".table_name").css("opacity","1");
            $(".num_box").css("display","flex");
            reverse();
            clearInterval(timer);
            return;
        }else {
            h1 = "<h1 class='wow rotateIn'>" + arr_list[i] + "</h1>";
            $('.big_name').html(h1);
            setTimeout(function () {
                append_anme(i);
            }, 3000)
        }
    }

    function append_anme(i) {
        li = "<li class='wow bounceInRight'>" + arr_list[i] + "</li>";
        $(".show_name>ul").prepend(li);
    }


    function reverse (){
        var arr_list_new_0 = arr_list;
        var arr_list_new = arr_list_new_0.reverse();
        length = Math.floor(arr_list_new.length / 3);
        $.each(arr_list_new, function (i, val) {
            if (i < length) {
                $(".name_one").append("<li class='wow rotateIn'>" + arr_list[i] + "</li>");
            } else if (length <= i && i < 2 * length) {
                $(".name_two").append("<li class='wow rotateIn'>" + arr_list[i] + "</li>");
            } else {
                $(".name_three").append("<li class='wow rotateIn'>" + arr_list[i] + "</li>");
            }
        });

    }

    $.ajax({
        url: "https://ccvt_test.fnying.com/api/crontab/get_scale_us_data.php",
        type: "GET",
        dataType: "jsonp",
        success: function (response) {
            var data = response.rows;

            $.each(data, function (i, val) {
                arr_list.push(data[i].us_account);
            });
            start();
            $(".num").text(arr_list.length);
        },
        error: function () {
            alert("获取失败");
        }
    });

});
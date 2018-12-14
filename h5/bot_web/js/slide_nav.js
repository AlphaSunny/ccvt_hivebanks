var url = getRootPath();
$.ajax({
    type: "GET",
    url: url + "/h5/bot_web/json/slide_nav.json",
    dataType:"json",
    success: function (res) {
        console.log(res);
    }
});
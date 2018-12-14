var url = getRootPath();
$.ajax({
    type: "POST",
    url: url + "bot_web/json/slide_nav.json",
    success: function (res) {
        console.log(res);
    }
});
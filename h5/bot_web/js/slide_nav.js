var url = getRootPath(),li = "";
$.ajax({
    type: "GET",
    url: url + "/h5/bot_web/json/slide_nav.json",
    dataType: "json",
    success: function (res) {
        console.log(res);
        $.each(res, function (i, val) {
            li+="<li>" +
                "<a class='app-menu__item' href="+ res[i].href +"></a>" +
                "<i class='app-menu__icon fa "+ res[i].fa_icon +"'></i>" +
                "<span class='app-menu__label'>"+ res[i].name +"</span>" +
                "</li>"
        });
        $(".app-menu").html(li);
    }
});
let li = "";
$.ajax({
    type: "GET",
    url: getRootPath() + "/h5/bot_web2/json/slide_nav.json",
    dataType: "json",
    success: function (res) {
        $.each(res, function (i, val) {
            li += "<li class='"+ res[i].class +"'>" +
                "<a class='app-menu__item' href=" + res[i].href + ">" +
                "<i class='app-menu__icon fa " + res[i].fa_icon + "'></i>" +
                "<span class='app-menu__label'>" + res[i].name + "</span>" +
                "</a>" +
                "</li>"
        });
        $(".app-menu").html(li);
    }
});
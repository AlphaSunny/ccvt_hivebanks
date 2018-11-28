$(function () {
    var arr = [
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
        {"name": "edwin", "level": "1", "glory": "100"},
    ];
    var li = "";
    $.each(arr, function (i, val) {
        li += "<li class='wow bounceInLeft' data-wow-delay=" + Number((i + 1) * 0.5) + 's' + ">" +
            "<div>" + arr[i].name + "</div>" +
            "<div>" +
            "<small>" + arr[i].glory + "</small>" +
            "<small>" + arr[i].level + "</small>" +
            "</div>" +
            "</li>"
    });
    $(".item").html(li);
});
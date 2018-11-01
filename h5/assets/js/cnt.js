var arr = document.cookie.match(new RegExp("(^| )UUID=([^;]*)(;|$)"));
var uuid = (arr != null) ? unescape(arr[2]) : '';
var ref = escape(document.referrer);
var url = escape(window.location.href);
var xmlhttp;
if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
} else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}
xmlhttp.open("GET", "http://www.fnying.com/php/cnt_action.php?referrer=" + ref + "&url=" + url + "&uuid=" + uuid, true);
xmlhttp.send();

$(function () {
    //获取uuid
    if (!uuid) {
        uuid = new Date().getTime();
        // 取得UUID
        var url = "http://www.fnying.com/php/get_uuid.php";
        $.get({
            url: url,
            dataType:"jsonp",
            success: function (response) {
                uuid = response.uuid;
                SetCookie('UUID', uuid);
            },
            error: function (response) {
                console.log(response);
            }
        })
    }
});
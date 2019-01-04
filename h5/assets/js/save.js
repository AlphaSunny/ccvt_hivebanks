// Set the cookies function
function SetCookieSave(name, value) {
    var now = new Date();
    var time = now.getTime();

    // Valid for 2 hours
    time += 3600 * 1000 * 24 * 7;
    now.setTime(time);
    document.cookie = name + "=" + escape(value) + '; expires=' + now.toUTCString() + ';path=/';
}

// Take the cookies function
function GetCookieSave(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    if (arr == null) {
        return null;
    }
}

// Delete cookie function
function DelCookieSave(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = GetCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ';path=/';
}
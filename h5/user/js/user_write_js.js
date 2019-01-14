// 通用js
(function () {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var pos = strFullPath.indexOf(strPath);
    var prePath = strFullPath.substring(0, pos);
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    var appRootPath = prePath + postPath;

    var jsHeader = "<script type='text/javascript' src='" + appRootPath + "/";
    var jsFooter = "'></script>";
    document.write(jsHeader + "user/language/jquery.i18n.properties.js" + jsFooter);
    document.write(jsHeader + "user/language/language.js" + jsFooter);
    document.write(jsHeader + "user/js/common.js" + jsFooter);
    document.write(jsHeader + "user/js/main.js" + jsFooter);
    document.write(jsHeader + "user/js/logout.js" + jsFooter);
})();

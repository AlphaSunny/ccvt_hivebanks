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
    document.write(jsHeader + "assets/js/jquery.min.js" + jsFooter);
    document.write(jsHeader + "assets/js/bootstrap.min.js" + jsFooter);
    document.write(jsHeader + "assets/js/jquery.pagination.min.js" + jsFooter);
    document.write(jsHeader + "assets/js/less.min.js" + jsFooter);
    document.write(jsHeader + "user/js/common.js" + jsFooter);
    document.write(jsHeader + "user/js/account.js" + jsFooter);
    document.write(jsHeader + "assets/js/logout.js" + jsFooter);
    document.write("<script type='text/javascript'>less.watch();</script>");
})();

// 通用css
(function () {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var pos = strFullPath.indexOf(strPath);
    var prePath = strFullPath.substring(0, pos);
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    var appRootPath = prePath + postPath;

    var cssHeader = "<link rel='stylesheet' type='text/css' href='" + appRootPath + "/";
    var cssHeaderLess = "<link rel='stylesheet/less' type='text/css' href='" + appRootPath + "/";
    var cssFooter = "'></link>";
    document.write(cssHeader + "assets/css/bootstrap.min.css" + cssFooter);
    document.write(cssHeader + "assets/css/jquery.pagination.css" + cssFooter);
    document.write(cssHeaderLess + "user/css/common_user.less" + cssFooter);
})();

// 通用css
(function () {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var pos = strFullPath.indexOf(strPath);
    var prePath = strFullPath.substring(0, pos);
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    var appRootPath = prePath + postPath;

    var cssHeaderLess = "<link rel='stylesheet/less' type='text/css' href='" + appRootPath + "/";
    var cssFooter = "'></link>";
    document.write(cssHeaderLess + "user/css/common_user.less" + cssFooter);
})();

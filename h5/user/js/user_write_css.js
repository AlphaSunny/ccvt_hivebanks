// 通用css
(function () {
    let strFullPath = window.document.location.href;
    let strPath = window.document.location.pathname;
    let pos = strFullPath.indexOf(strPath);
    let prePath = strFullPath.substring(0, pos);
    let postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    let appRootPath = prePath + postPath;

    let cssHeaderLess = "<link rel='stylesheet/less' type='text/css' href='" + appRootPath + "/";
    let cssFooter = "'></link>";
    document.write(cssHeaderLess + "user/css/common_user.less" + cssFooter);
})();

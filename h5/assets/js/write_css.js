// 通用css
(function () {
    let strFullPath = window.document.location.href;
    let strPath = window.document.location.pathname;
    let pos = strFullPath.indexOf(strPath);
    let prePath = strFullPath.substring(0, pos);
    let postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    let appRootPath = prePath + postPath;

    let cssHeader = "<link rel='stylesheet' type='text/css' href='" + appRootPath + "/";
    let cssHeaderLess = "<link rel='stylesheet/less' type='text/css' href='" + appRootPath + "/";
    let cssHeaderIco = "<link rel='shortcut icon' type='text/css' href='" + appRootPath + "/";
    let cssFooter = "'></link>";
    document.write(cssHeader + "assets/css/bootstrap.min.css" + cssFooter);
    document.write(cssHeader + "assets/css/jquery.pagination.css" + cssFooter);
    document.write(cssHeader + "assets/css/intlTelInput.css" + cssFooter);
    document.write(cssHeader + "assets/css/animate.css" + cssFooter);
    document.write(cssHeaderIco + "favicon.ico" + cssFooter);
    document.write(cssHeaderLess + "assets/css/common.less" + cssFooter);
    document.write('<link rel="stylesheet" href="//at.alicdn.com/t/font_626151_t6n32vq6jjq.css">');
})();

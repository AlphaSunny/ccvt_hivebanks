// 通用js
(function () {
    let strFullPath = window.document.location.href;
    let strPath = window.document.location.pathname;
    let pos = strFullPath.indexOf(strPath);
    let prePath = strFullPath.substring(0, pos);
    let postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    let appRootPath = prePath + postPath;

    let jsHeader = "<script type='text/javascript' src='" + appRootPath + "/";
    let jsFooter = "'></script>";
    document.write(jsHeader + "ca/js/common.js" + jsFooter);
    document.write(jsHeader + "ca/language/jquery.i18n.properties.js" + jsFooter);
    document.write(jsHeader + "ca/language/language.js" + jsFooter);
    document.write(jsHeader + "ca/js/new_main.js" + jsFooter);
    // document.write(jsHeader + "user/js/verify_withdraw.js" + jsFooter);
    // document.write(jsHeader + "user/js/get_bind_info.js" + jsFooter);
    document.write(jsHeader + "ca/js/ca_logout.js" + jsFooter);
})();

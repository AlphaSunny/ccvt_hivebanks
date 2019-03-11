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
    document.write(jsHeader + "la/assets/js/jquery-3.2.1.min.js" + jsFooter);
    document.write(jsHeader + "la/assets/js/bootstrap.min.js" + jsFooter);
    document.write(jsHeader + "la/assets/js/jquery.pagination.min.js" + jsFooter);
    document.write(jsHeader + "la/assets/language/jquery.i18n.properties.js" + jsFooter);
    document.write(jsHeader + "la/assets/language/language.js" + jsFooter);
    document.write(jsHeader + "la/assets/materialize/js/materialize.min.js" + jsFooter);
    document.write(jsHeader + "la/assets/js/jquery.metisMenu.js" + jsFooter);
    document.write(jsHeader + "la/assets/js/layer/layer.js" + jsFooter);
    document.write(jsHeader + "la/assets/js/layer/common.js" + jsFooter);
    document.write(jsHeader + "la/assets/js/layer/main.js" + jsFooter);
})();

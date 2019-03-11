// 通用css
(function () {
    let strFullPath = window.document.location.href;
    let strPath = window.document.location.pathname;
    let pos = strFullPath.indexOf(strPath);
    let prePath = strFullPath.substring(0, pos);
    let postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    let appRootPath = prePath + postPath;

    let cssHeaderLess = "<link rel='stylesheet' type='text/css' href='" + appRootPath + "/";
    let cssFooter = "'></link>";
    document.write(cssHeaderLess + "https://fonts.googleapis.com/icon?family=Material+Icons" + cssFooter);
    document.write(cssHeaderLess + "https://fonts.googleapis.com/css?family=Open+Sans" + cssFooter);
    document.write(cssHeaderLess + "la/assets/materialize/css/materialize.min.css" + cssFooter);
    document.write(cssHeaderLess + "la/assets/css/bootstrap.css" + cssFooter);
    document.write(cssHeaderLess + "la/assets/css/jquery.pagination.css" + cssFooter);
    document.write(cssHeaderLess + "la/assets/css/font-awesome.css" + cssFooter);
    document.write(cssHeaderLess + "la/assets/css/common.css" + cssFooter);
})();

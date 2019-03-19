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
    // document.write(jsHeader + "assets/js/jquery.min.js" + jsFooter);
    document.write(jsHeader + "https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js" + jsFooter);
    document.write(jsHeader + "assets/js/bootstrap.min.js" + jsFooter);
    document.write(jsHeader + "assets/js/less.min.js" + jsFooter);
    document.write(jsHeader + "assets/js/cnt.js" + jsFooter);
    document.write(jsHeader + "assets/js/jquery.pagination.min.js" + jsFooter);
    document.write(jsHeader + "assets/js/intlTelInput.js" + jsFooter);
    document.write(jsHeader + "assets/js/layer/layer.js" + jsFooter);
    document.write(jsHeader + "assets/js/sha.js" + jsFooter);
    document.write(jsHeader + "assets/js/clipboard.min.js" + jsFooter);
    document.write(jsHeader + "assets/js/jquery.qrcode.min.js" + jsFooter);
    document.write(jsHeader + "assets/js/prompt.js" + jsFooter);
    document.write(jsHeader + "assets/js/get_sms_count.js" + jsFooter);
    document.write("<script src='https://at.alicdn.com/t/font_1045318_ektzfreht57.js'></script>");
})();

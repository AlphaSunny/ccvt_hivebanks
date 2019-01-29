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
    document.write(jsHeader + "assets/js/cnt.js" + jsFooter);
    document.write(jsHeader + "assets/js/jquery.pagination.min.js" + jsFooter);
    document.write(jsHeader + "assets/js/intlTelInput.js" + jsFooter);
    document.write(jsHeader + "assets/js/layer/layer.js" + jsFooter);
    document.write(jsHeader + "assets/js/sha.js" + jsFooter);
    document.write(jsHeader + "assets/js/less.min.js" + jsFooter);
    document.write(jsHeader + "assets/js/clipboard.min.js" + jsFooter);
    document.write(jsHeader + "assets/js/jquery.qrcode.min.js" + jsFooter);
    document.write(jsHeader + "assets/js/prompt.js" + jsFooter);
    document.write(jsHeader + "assets/js/get_sms_count.js" + jsFooter);
    document.write("<script src='https://at.alicdn.com/t/font_626151_t6n32vq6jjq.js'></script>");
    // document.write("<script type='text/javascript'>less.watch();</script>");
})();

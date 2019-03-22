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
    document.write("<script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js'></script>");
    // document.write(jsHeader + "assets/js/bootstrap.min.js" + jsFooter);
    document.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js"></script>');
    // document.write(jsHeader + "assets/js/less.min.js" + jsFooter);
    document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/less.js/3.9.0/less.min.js"></script>');
    // document.write(jsHeader + "assets/js/layer/layer.js" + jsFooter);
    document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/layer/2.3/layer.js"></script>');
    document.write(jsHeader + "assets/js/cnt.js" + jsFooter);
    document.write(jsHeader + "assets/js/jquery.pagination.min.js" + jsFooter);
    document.write(jsHeader + "assets/js/intlTelInput.js" + jsFooter);
    document.write(jsHeader + "assets/js/sha.js" + jsFooter);
    document.write(jsHeader + "assets/js/clipboard.min.js" + jsFooter);
    document.write(jsHeader + "assets/js/jquery.qrcode.min.js" + jsFooter);
    document.write(jsHeader + "assets/js/prompt.js" + jsFooter);
    document.write(jsHeader + "assets/js/get_sms_count.js" + jsFooter);
    document.write("<script src='https://at.alicdn.com/t/font_1045318_ektzfreht57.js'></script>");
})();

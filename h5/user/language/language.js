/**
 * Cookie operation
 */
let getCookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        let expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            let date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        let path = options.path ? '; path=' + options.path : '';
        let domain = options.domain ? '; domain=' + options.domain : '';
        let s = [cookie, expires, path, domain, secure].join('');
        let secure = options.secure ? '; secure' : '';
        let c = [name, '=', encodeURIComponent(value)].join('');
        let cookie = [c, expires, path, domain, secure].join('');
        document.cookie = cookie;
    } else { // only name given, get cookie
        let cookieValue = null;
        if (document.cookie && document.cookie != '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

/**
 * Get browser language type
 * @return {string} Browser country language
 */
// let getNavLanguage = function(){
//     if(navigator.appName == "Netscape"){
//         let navLanguage = navigator.language;
//         return navLanguage.substr(0,2);
//     }
//     return false;
// }

/**
 * Set the language type: Default is English
 */
let i18nLanguage = "";

/*
Set the language types supported by the website
 */
let webLanguage = ['en','zh-CN', 'ja'];

/**
 * Execute page i18n method
 * @return
 */ 
let execI18n = function(){
    /*
    Get the resource file name
     */
    let optionEle = $("#i18n_pagename");
    if (optionEle.length < 1) {
        // console.log("未找到页面名称元素，请在页面写入\n <meta id=\"i18n_pagename\" content=\"页面名(对应语言包的语言文件名)\">");
        return false;
    };
    let sourceName = optionEle.attr('content');
    sourceName = sourceName.split('-');
        /*
        First get the language type selected before the user's browser device
         */
        if (getCookie("userLanguage")) {
            i18nLanguage = getCookie("userLanguage");
        } else {
            // Get the browser language
            // let navLanguage = getNavLanguage();
            // if (navLanguage) {
            //     // Determine if it is in the web support language array
            //     let charSize = $.inArray(navLanguage, webLanguage);
            //     if (charSize > -1) {
            //         i18nLanguage = navLanguage;
            //         // Save to cache
            //         getCookie("userLanguage",navLanguage);
            //     };
            // } else{
            //     console.log("not navigator");
            //     return false;
            // }
        }
        /* Need to introduce i18n file*/
        if ($.i18n == undefined) {
            // console.log("请引入i18n js 文件")
            return false;
        };

        /*
        Here you need to translate i18n
         */
        jQuery.i18n.properties({
            name : sourceName, //Resource file name
            path : 'language/i18n/' + i18nLanguage +'/', //Resource file path
            mode : 'map', //Use the value in the resource file as a Map
            language : i18nLanguage,
            checkAvailableLanguages:true,
            async:true,
            callback : function() {//Set the display content after loading successfully
                let insertEle = $(".i18n");
                // console.log(".i18n 写入中...");
                insertEle.each(function() {
                    // Get content write based on the name of the i18n element
                    $(this).html($.i18n.prop($(this).attr('name')));
                });
                // console.log("写入完毕");

                // console.log(".i18n-input 写入中...");
                let insertInputEle = $(".i18n-input");
                insertInputEle.each(function() {
                    let selectAttr = $(this).attr('selectattr');
                    if (!selectAttr) {
                        selectAttr = "value";
                    };
                    $(this).attr(selectAttr, $.i18n.prop($(this).attr('selectname')));
                });
                // console.log("写入完毕");
            }
        });
};

/*Page execution load execution*/
$(function(){

    /*Perform I18n translation*/
    execI18n();

    /*Set the language selection to the value in the cache by default*/
    // $("#language option[value="+i18nLanguage+"]").prop("selected",true);

    let languageList = $(".toggleLanguage");
    $.each(languageList, function (i, val) {
        if(i18nLanguage == $(this).attr("title")){
            $(".curr_language").text($(this).text());
        }
    });

    /* Choose a language */
    $("#language").on('change', function() {
        let language = $(this).children('option:selected').val();
        // console.log("language"+language);
        getCookie("userLanguage",language,{
            expires: 30,
            path:'/'
        });
        location.reload();
    });

    /* Choose a language */
    $(".toggleLanguage").on('click', function () {
        let language = $(this).attr("title");
        $(".curr_language").text($(this).text());
        $("#language").text($(this).text());
        getCookie("userLanguage", language, {
            expires: 30,
            path: '/'
        });
        location.reload();
    });
});
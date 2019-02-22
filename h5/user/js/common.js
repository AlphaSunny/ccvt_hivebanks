// Set the cookies function
function SetCookie(name, value) {
    let now = new Date();
    let time = now.getTime();

    // Valid for 2 hours
    time += 3600 * 1000 * 2;
    now.setTime(time);
    document.cookie = name + "=" + escape(value) + '; expires=' + now.toUTCString() + ';path=/';
}

// Take the cookies function
function GetCookie(name) {
    let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    if (arr == null) {
        window.location.href = 'login.html';
    }
}

// Delete cookie function
function DelCookie(name) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = GetCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ';path=/';
}


// Get URL parameters
function GetQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//时间戳转时间24小时制
function ToHour(new_time) {
    return new Date(parseInt(new_time) * 1000).toLocaleString("chinese", {hour12: false});
}

// Email format check
function IsEmail(s) {
    let patrn = /^(?:\w+\.?)*\w+@(?:\w+\.)*\w+$/;
    return patrn.exec(s);
}


function getRootPath() {
    //Get current URL
    let curWwwPath = window.document.location.href;
    //Get the directory after the host address
    let pathName = window.document.location.pathname;
    let pos = curWwwPath.indexOf(pathName);
    //Get the host address
    let localhostPath = curWwwPath.substring(0, pos);
    //Get the project name with "/"
    let projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return localhostPath;
}

let url = getRootPath();

//Get data failure prompt
function GetErrorCode(code) {
    $.getJSON(url + "/h5/assets/json/errcode.json", function (response) {
        $.each(response, function (i, val) {
            if (response[i].code_key == code) {
                layer.msg('<p class="i18n" name="' + code + '">' + response[i].code_value + '</p>');
                execI18n();
            }
        })
    })
}

//Get configuration file/Base currency type
let config_api_url = '', config_h5_url = '', userLanguage = GetCookie('userLanguage');
$.ajax({
    url: url + "/h5/assets/json/config_url.json",
    async: false,
    type: "GET",
    dataType: "json",
    success: function (data) {
        config_api_url = data.api_url;
        config_h5_url = data.h5_url;
        let benchmark_type = data.benchmark_type.toUpperCase();
        let ca_currency = data.ca_currency.toUpperCase();
        $('.base_type').text(benchmark_type);
        $('.ca_currency').text(ca_currency);
        SetCookie('ca_currency', ca_currency);
        SetCookie('benchmark_type', benchmark_type);
        if (!userLanguage) {
            SetCookie('userLanguage', data.userLanguage);
        } else {
            return;
        }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {

    }
});

// Call API common function
function CallApi(api_url, post_data, suc_func, error_func) {
    let api_site = config_api_url + '/api/user/';
    post_data = post_data || {};
    suc_func = suc_func || function () {
    };
    error_func = error_func || function () {
    };
    $.ajax({
        url: api_site + api_url,
        dataType: "jsonp",
        data: post_data,
        success: function (response) {
            // API return failed
            if (response.errcode != 0) {
                error_func(response);
            } else {
                // Successfully process data
                suc_func(response);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // API error exception
            let response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // Exception handling
            error_func(response);
        }
    });
}

// Call Ba API common function
function CallBaApi(api_url, post_data, suc_func, error_func) {
    let api_site = config_api_url + '/api/ba/';
    post_data = post_data || {};
    suc_func = suc_func || function () {
    };
    error_func = error_func || function () {
    };
    $.ajax({
        url: api_site + api_url,
        dataType: "jsonp",
        data: post_data,
        success: function (response) {
            // API return failed
            if (response.errcode != 0) {
                error_func(response);
            } else {
                // Successfully process data
                suc_func(response);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // API error exception
            let response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // Exception handling
            error_func(response);
        }
    });
}

// Call Ca API common function
function CallCaApi(api_url, post_data, suc_func, error_func) {
    let api_site = config_api_url + '/api/ca/';
    post_data = post_data || {};
    suc_func = suc_func || function () {
    };
    error_func = error_func || function () {
    };
    $.ajax({
        url: api_site + api_url,
        dataType: "jsonp",
        data: post_data,
        success: function (response) {
            // API return failed
            if (response.errcode != 0) {
                error_func(response);
            } else {
                // Successfully process data
                suc_func(response);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // API error exception
            let response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // Exception handling
            error_func(response);
        }
    });
}

// Call the la API registration function
function CallLaApi(api_url, post_data, suc_func, error_func) {
    let api_site = config_api_url + '/api/la/admin/admin/';
    post_data = post_data || {};
    suc_func = suc_func || function () {
    };
    error_func = error_func || function () {
    };
    $.ajax({
        url: api_site + api_url,
        dataType: "jsonp",
        data: post_data,
        success: function (response) {
            // API return failed
            if (response.errcode != 0) {
                error_func(response);
            } else {
                // Successfully process data
                suc_func(response);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // API error exception
            let response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // Exception handling
            error_func(response);
        }
    });
}

// Call the API LA configuration function
function CallLaConfigApi(api_url, post_data, suc_func, error_func) {
    let api_site = config_api_url + '/api/la/admin/configure/';
    post_data = post_data || {};
    suc_func = suc_func || function () {
    };
    error_func = error_func || function () {
    };
    $.ajax({
        url: api_site + api_url,
        dataType: "jsonp",
        data: post_data,
        success: function (response) {
            // API return failed
            if (response.errcode != 0) {
                error_func(response);
            } else {
                // Successfully process data
                suc_func(response);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // API error exception
            let response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // Exception handling
            error_func(response);
        }
    });
}

// Call the API news function
function CallNewsApi(api_url, post_data, suc_func, error_func) {
    let api_site = config_api_url + '/api/news/';
    post_data = post_data || {};
    suc_func = suc_func || function () {
    };
    error_func = error_func || function () {
    };
    $.ajax({
        url: api_site + api_url,
        dataType: "jsonp",
        data: post_data,
        success: function (response) {
            // API return failed
            if (response.errcode != 0) {
                error_func(response);
            } else {
                // Successfully process data
                suc_func(response);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // API error exception
            let response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // Exception handling
            error_func(response);
        }
    });
}

//Check if registration is allowed
function RegisterSwitch(type, suc_func, error_func) {
    let api_url = 'reg_lock.php',
        post_data = {
            'type': type
        };
    CallLaApi(api_url, post_data, suc_func, error_func);
}

//Get graphic verification code
function GetImgCode() {
    let src = config_api_url + '/api/inc/code.php';
    $('#email_imgCode').attr("src", src);
    $('#phone_imgCode').attr("src", src);
}

//get wechat name
function GetWeChatName(code, suc_func, error_func) {
    let api_url = 'get_code_wechat.php',
        post_data = {
            'code': code
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

// email registration
function EmailRegister(email, pass_word, pass_word_hash, invit_code, wechat, group_id, suc_func, error_func) {
    let api_url = 'reg_email.php',
        post_data = {
            'email': email,
            'pass_word_hash': pass_word_hash,
            'pass_word': pass_word,
            'invit_code': invit_code,
            'wechat': wechat,
            'group_id': group_id
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//Mobile phone registration processing
function PhoneRegister(country_code, cellphone, sms_code, pass_word, pass_word_hash, invit_code, wechat, group_id, suc_func, error_func) {
    let api_url = 'reg_phone.php',
        post_data = {
            'country_code': country_code,
            'cellphone': cellphone,
            'sms_code': sms_code,
            'pass_word': pass_word,
            'pass_word_hash': pass_word_hash,
            'invit_code': invit_code,
            'wechat': wechat,
            'group_id': group_id
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Mailbox login processing
function EmailLogin(email, pass_word_hash, cfm_code, suc_func, error_func) {
    let api_url = 'lgn_email.php',
        post_data = {
            'email': email,
            'pass_word_hash': pass_word_hash,
            'cfm_code': cfm_code
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Mobile phone login processing
function PhoneLogin(country_code, cellphone, pass_word_hash, cfm_code, suc_func, error_func) {
    let api_url = 'lgn_phone.php',
        post_data = {
            'country_code': country_code,
            'cellphone': cellphone,
            'pass_word_hash': pass_word_hash,
            'cfm_code': cfm_code
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

// Reset password (mailbox)
function ResetEmailPassword(email, cfm_code, pass_word_hash, confirm_pass_word_hash, suc_func, error_func) {
    let api_url = 'rst_pw_email.php',
        post_data = {
            'email': email,
            'cfm_code': cfm_code,
            'pass_word_hash': pass_word_hash,
            'confirm_pass_word_hash': confirm_pass_word_hash
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Reset Email Password--Get Email Authentication Code
function GetEmailCode(email, suc_func, error_func) {
    let api_url = 'cfm_email_preform.php',
        post_data = {
            'email': email
        };
    CallApi(api_url, post_data, suc_func, error_func)
}

// Reset password (phone)
function ResetPhonePassword(country_code, cellphone, sms_code, pass_word_hash, confirm_pass_word_hash, suc_func, error_func) {
    let api_url = 'rst_pw_phone.php',
        post_data = {
            'country_code': country_code,
            'cellphone': cellphone,
            'sms_code': sms_code,
            'pass_word_hash': pass_word_hash,
            'confirm_pass_word_hash': confirm_pass_word_hash
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

// Get user binding information
function BindingInformation(token, suc_func, error_func) {
    let api_url = 'info_bind.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//quick tread
function PointTreadSwitch(token, point_tread_switch, point_tread_num, suc_func, error_func) {
    let api_url = 'point_tread_switch.php',
        post_data = {
            'token': token,
            'point_tread_switch': point_tread_switch,
            'point_tread_num': point_tread_num
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//application group
function GetGroupType(token, suc_func, error_func) {
    let api_url = 'get_group_type_list.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

function ApplicationGroup(token, group_name, group_type_id, group_introduction, src, suc_func, error_func) {
    let api_url = 'application_group.php',
        post_data = {
            'token': token,
            'group_name': group_name,
            'group_type_id': group_type_id,
            'group_introduction': group_introduction,
            'src': src
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Modify user nickname
function ModifyNickName(token, us_account, suc_func, error_func) {
    let api_url = 'alter_us_account.php',
        post_data = {
            'token': token,
            'us_account': us_account
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

// user information
function UserInformation(token, suc_func, error_func) {
    let api_url = 'info_base.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//bind weChat group name
function BindWeChatName(token, wechat, suc_func, error_func) {
    let api_url = 'bnd_wechat.php',
        post_data = {
            'token': token,
            'wechat': wechat
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//bind weChat group name
function BindWeChatGroup(token, group_id, suc_func, error_func) {
    let api_url = 'bnd_group.php',
        post_data = {
            'token': token,
            'group_id': group_id
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

// User Change Record - Login Record - Transfer - BA / CA - Recharge / Withdrawal - Record
function AllRecord(token, limit, offset, api_url, suc_func, error_func) {
    let post_data = {
        'token': token,
        'limit': limit,
        'offset': offset
    };
    CallApi(api_url, post_data, suc_func, error_func);
}

//user to user transfer
function TransferCCVT(token, account, code, ccvt_num, pass_hash, suc_func, error_func) {
    let api_url = "us_transfer_ccvt.php",
        post_data = {
            'token': token,
            'account': account,
            'code': code,
            'ccvt_num': ccvt_num,
            'pass_hash': pass_hash
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//transfer list
function TransferList(token, limit, offset, type, suc_func, error_func) {
    let api_url = 'get_transfer_ccvt_list.php',
        post_data = {
            'token': token,
            'limit': limit,
            'offset': offset,
            'type': type
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

function TransferConfirm(token, qa_id, qa_flag, suc_func, error_func) {
    let api_url = 'us_deal_transfer_ccvt.php',
        post_data = {
            'token': token,
            'qa_id': qa_id,
            'qa_flag': qa_flag
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Get order transaction status
function TradingStatus(token, limit, offset, type, suc_func, error_func) {
    let api_url = 'log_balance.php',
        post_data = {
            'token': token,
            'limit': limit,
            'offset': offset,
            'type': type
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

// Text binding
function TextBind(token, text_type, text, text_hash, suc_func, error_func) {
    let api_url = 'bnd_text.php',
        post_data = {
            'token': token,
            'text_type': text_type,
            'text': text,
            'text_hash': text_hash,
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

// Text modification
function TextModify(token, text_type, text, text_hash, pass_word_hash, suc_func, error_func) {
    let api_url = 'change_text.php',
        post_data = {
            'token': token,
            'text_type': text_type,
            'text': text,
            'text_hash': text_hash,
            'pass_word_hash': pass_word_hash
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//get la_id
function GetLaId(token, suc_func, error_func) {
    let api_url = 'get_la_admin_info.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

// File binding
function FileBind(token, file_type, file_url, suc_func, error_func) {
    let api_url = 'bnd_file.php',
        post_data = {
            'token': token,
            'file_type': file_type,
            'file_url': file_url
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//hash binding
function Hash(token, hash_type, hash, pass_word_hash, confirm_pass_hash, phone, phoneCode, suc_func, error_func) {
    let api_url = 'bnd_hash.php',
        post_data = {
            'token': token,
            'hash': hash,
            'phone': phone,
            'phoneCode': phoneCode,
            'hash_type': hash_type,
            'pass_word_hash': pass_word_hash,
            'confirm_pass_hash': confirm_pass_hash
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//Google binding
function GoogleBind(token, email, suc_func, error_func) {
    let api_url = 'bnd_Google.php',
        post_data = {
            'token': token,
            'email': email
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Google verification
function GoogleVerify(token, code, suc_func, error_func) {
    let api_url = 'cfm_Google.php',
        post_data = {
            'token': token,
            'code': code
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//get ba recharge withdraw recode
function GetBaRateList(api_url, token, suc_func, error_func) {
    let post_data = {
        'token': token
    };
    CallBaApi(api_url, post_data, suc_func, error_func);
}

//Get the average value of the CA recharge cash withdrawal rate
function GetAverageRate(api_url, token, suc_func, error_func) {
    let post_data = {
        'token': token
    };
    CallCaApi(api_url, post_data, suc_func, error_func);
}

//Get a list of Cas that meet the withdrawal criteria
function GetMeetWithdrawCaList(api_url, token, base_amount, suc_func, error_func) {
    let post_data = {
        'token': token,
        'base_amount': base_amount
    };
    CallCaApi(api_url, post_data, suc_func, error_func);
}

//Assign recharge cash withdrawal
function GetAssignCa(api_url, token, ca_channel, suc_func, error_func) {
    let post_data = {
        'token': token,
        'ca_channel': ca_channel
    };
    CallCaApi(api_url, post_data, suc_func, error_func);
}

//Locked up cash amount (withdrawal request)
function LockWithdrawAmount(token, ca_id, base_amount, bit_amount, id_card, name, us_account_id, suc_func, error_func) {
    let api_url = 'us_withdraw_quest.php',
        post_data = {
            'token': token,
            'ca_id': ca_id,
            'base_amount': base_amount,
            'bit_amount': bit_amount,
            'id_card': id_card,
            'name': name,
            'us_account_id': us_account_id
        };
    CallCaApi(api_url, post_data, suc_func, error_func);
}

//User withdrawal order details
function GetWithdrawInfo(token, suc_func, error_func) {
    let api_url = 'order_ca_withdraw_list.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//get us_account_id
function GetUsAccountId(token, ca_channel, suc_func, error_func) {
    let api_url = 'get_specified_bank_card_list.php',
        post_data = {
            'token': token,
            'cash_channel': ca_channel
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//get phone code
function GetPhoneCode(cellphone, country_code, bind_type, cfm_code, suc_func, error_func) {
    let api_url = 'sms_send.php',
        post_data = {
            'cellphone': cellphone,
            'country_code': country_code,
            'bind_type': bind_type,
            'cfm_code': cfm_code
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Get the declaration list
function GetFaultReportList(token, suc_func, error_func) {
    let api_url = 'feedback_list.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Submit a failure report
function SubmitFaultReportInfo(token, sub_id, end_type, submit_name, submit_info, suc_func, error_func) {
    let api_url = 'feedback_submit.php',
        post_data = {
            'token': token,
            'sub_id': sub_id,
            'end_type': end_type,
            'submit_name': submit_name,
            'submit_info': submit_info
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Get the list of bank cards that users need to add
function GetBankList(token, suc_func, error_func) {
    let api_url = 'us_channel_list.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func)
}

//Confirm adding a bank card
function AddBank(token, cash_channel, cash_type, cash_address, name, idNum, pass_word_hash, suc_func, error_func) {
    let api_url = 'bank_card_business.php',
        post_data = {
            'token': token,
            'cash_channel': cash_channel,
            'cash_type': cash_type,
            'cash_address': cash_address,
            'name': name,
            'idNum': idNum,
            'pass_word_hash': pass_word_hash,
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Get the list of added bank cards
function GetAddBankList(token, suc_func, error_func) {
    let api_url = 'get_bank_card_list.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Delete the bound bank card Exchange
function DeleteBank(token, account_id, suc_func, error_func) {
    let api_url = 'del_us_bank_card.php',
        post_data = {
            'token': token,
            'account_id': account_id
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Exchange
function Exchange(token, voucher, suc_func, error_func) {
    let api_url = 'exchange_voucher.php',
        post_data = {
            'token': token,
            'voucher': voucher
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//TransformCCVT
function TransformCCVT(token, account, suc_func, error_func) {
    let api_url = 'turn_ccvt_integral.php',
        post_data = {
            'token': token,
            'account': account
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//weChat group
function WeChatGroupList(token, suc_func, error_func) {
    let api_url = 'group_list.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Login failure countdown
function CountDown(count, ErrorNum, LoginBtn, input, LoginError) {
    let counts = count;
    if (counts != 0) {
        counts--;
        ErrorNum.text(counts);
        LoginBtn.attr('disabled', true);
        input.attr('disabled', true);
    } else {
        LoginBtn.attr('disabled', false);
        input.attr('disabled', false);
        input.val('');
        LoginError.fadeOut();
        $(".alert-warning").fadeOut();
        return;
    }

    setTimeout(function () {
        CountDown(counts, ErrorNum, LoginBtn, input, LoginError)
    }, 1000)
};

//get key code
function GetKeyCode(token, suc_func, error_func) {
    let api_url = 'get_key_code.php',
        post_data = {
            'token': token
        };
    CallLaConfigApi(api_url, post_data, suc_func, error_func);
}

//get news list
function Get_News_List(suc_func, error_func) {
    let api_url = 'news_list.php',
        post_data = {};
    CallNewsApi(api_url, post_data, suc_func, error_func);
}

//get news info
function GetNewsInfo(news_id, suc_func, error_func) {
    let api_url = 'news_detail.php',
        post_data = {
            "news_id": news_id
        };
    CallNewsApi(api_url, post_data, suc_func, error_func);
}

/**
 * Disable button
 * @param $this Button object
 * @param btnText Button text content defaults to "in process"
 * @return {boolean}
 */
function DisableClick($this, btnText) {
    if (!$this) {
        console.warn("$this Can not be empty");
        return true;
    }
    let status = Number($this.attr('data-clickStatus') || 1);
    if (status == 0) {
        return true;
    }

    btnText = btnText ? btnText : "loading...";
    $this.attr('data-clickStatus', 0);
    $this.html(btnText);
    return false;
}

/**
 * Activation button
 * @param $this Button object
 * @param btnText Button text content defaults to "in process"
 */
function ActiveClick($this, btnText) {
    if (!$this) {
        console.warn("$this Can not be empty");
        return;
    }
    btnText = btnText ? btnText : "确认";
    $this.attr('data-clickStatus', 1);
    $this.html(btnText);
}

/**
 * Initialization page loading loading
 */
window.onload = function () {
    // $("header").css("background-image", "url(assets/img/banner-1.jpg)");
    if (document.readyState === 'loading') {
        document.body.style.overflow = "hidden";
    } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
        document.body.style.overflow = "auto";
        let loading = document.querySelector(".loading");
        loading.parentNode.removeChild(loading);
    }
};

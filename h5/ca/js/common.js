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
    if (arr == null && name == "ca_token") {
        DelCookie('ca_token');
        window.location.href = 'CaLogin.html';
    }else{
        DelCookie('user_token');
        window.location.href = '../user/login.html';
    }
}

// Take the us_cookies function
function GetUsCookie(name) {
    let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);

    if (arr == null && name == "user_token") {
        window.location.href = '../user/login.html';
        return;
    } else {
        window.location.href = 'CaLogin.html';
    }
}

// Delete cookie function
function DelCookie(name) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cookieVal = GetCookie(name);
    if (cookieVal != null) document.cookie = name + "=" + cookieVal + ";expires=" + exp.toGMTString();
}

// Get URL parameters
function GetQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
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

//Get failed error code prompt
function GetErrorCode(code) {
    $.getJSON(url + "/h5/assets/json/errcode.json", function (response) {
        $.each(response, function (i, val) {
            if (response[i].code == code) {
                layer.msg('<p class="i18n" name="' + code + '">' + response[i].code_value + '</p>');
                execI18n();
            }
        })
    })
}

//Get configuration file
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
            //console.log(json.stringify(response));
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

// Call the USER API common function
function CallUserApi(api_url, post_data, suc_func, error_func) {

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
            //console.log(json.stringify(response));
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

//Ca recharge margin la function
function CallLaBase(api_url, post_data, suc_func, error_func) {
    let api_site = config_api_url + '/api/base/';
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

//email registration
function EmailRegister(email, pass_word_hash, suc_func, error_func) {
    let api_url = 'mst_reg_email.php',
        post_data = {
            'email': email,
            'pass_word_hash': pass_word_hash
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

//Register your phone
function PhoneRegister(country_code, cellphone, pass_word_hash, sms_code, suc_func, error_func) {
    let api_url = 'mst_reg_phone.php',
        post_data = {
            'country_code': country_code,
            'cellphone': cellphone,
            'pass_word_hash': pass_word_hash,
            'sms_code': sms_code,
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

// 重置密码(邮箱)
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

//Reset Email Password - Get Verification Code
function GetEmailCode(email, suc_func, error_func) {
    let api_url = 'cfm_email_preform.php',
        post_data = {
            'email': email
        };
    CallApi(api_url, post_data, suc_func, error_func)
}

// 重置密码(手机)
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
        LoginError.fadeOut('fast');
        // email_cfm_code = drawPic();
        return;
    }

    setTimeout(function () {
        CountDown(counts, ErrorNum, LoginBtn, input, LoginError)
    }, 1000)
};

//Get phone verification code
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

//ca Recharge deposit
function RechargeManage(token, base_amount, suc_func, error_func) {
    let api_url = 'ca_recharge_quest.php',
        post_data = {
            'token': token,
            'base_amount': base_amount
        };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//caWithdrawal margin
function WithdrawManage(token, base_amount, fun_pass, suc_func, error_func) {
    let api_url = 'ca_withdraw_quest.php',
        post_data = {
            'token': token,
            'base_amount': base_amount,
            'fun_pass': fun_pass
        };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//Get the margin withdrawal address
function GetMarginWithdrawAddress(token, suc_func, error_func) {
    let api_url = 'get_bit_address_withdraw.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Add margin withdrawal address
function AddMarginWithdrawAddress(token, bit_address, fun_pass, suc_func, error_func) {
    let api_url = 'bit_address_withdraw_add.php',
        post_data = {
            'token': token,
            'bit_address': bit_address,
            'fun_pass': fun_pass
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//get ca base information
function GetCaInformation(token, suc_func, error_func) {
    let api_url = 'mst_info_base.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Modify ca nickname
function ModifyNickName(token, ca_account, suc_func, error_func) {
    let api_url = 'alter_ca_account.php',
        post_data = {
            'token': token,
            'ca_account': ca_account
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//get ca bind information
function GetCaBindInformation(token, suc_func, error_func) {
    let api_url = 'mst_info_bind.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

// CA Change Record - Login Record
function AllRecord(token, limit, offset, api_url, suc_func, error_func) {
    let post_data = {
        'token': token,
        'limit': limit,
        'offset': offset
    };
    CallApi(api_url, post_data, suc_func, error_func);
}

//get bank list
function GetBankList(token, suc_func, error_func) {
    let api_url = 'ca_channel_list.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//add bank
function AddAgencyType(token, ca_channel, card_nm, name, idNum, pass_word_hash, suc_func, error_func) {
    let api_url = 'ca_asset_account_add.php',
        post_data = {
            'token': token,
            'ca_channel': ca_channel,
            'card_nm': card_nm,
            'name': name,
            'idNum': idNum,
            'pass_word_hash': pass_word_hash
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//get added type
function GetAddAgencyType(token, suc_func, error_func) {
    let api_url = 'ca_get_asset_account.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//del asset account
function delAssetAccount(token, ca_channel, suc_func, error_func) {
    let api_url = 'del_asset_account.php',
        post_data = {
            'token': token,
            'ca_channel': ca_channel
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
            // 'pass_word_hash': pass_word_hash
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
function Hash(token, hash_type, hash, pass_word_hash, phone, phoneCode, suc_func, error_func) {
    let api_url = 'bnd_hash.php',
        post_data = {
            'token': token,
            'hash': hash,
            'phone': phone,
            'phoneCode': phoneCode,
            'hash_type': hash_type,
            'pass_word_hash': pass_word_hash
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

//Get a list of Cas that meet the withdrawal criteria
function GetMeetCaList(api_url, token, base_amount, suc_func, error_func) {
    let post_data = {
        'token': token,
        'base_amount': base_amount
    };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Get a list of Cas that meet the withdrawal criteria
function GetMeetWithdrawCaList(api_url, token, base_amount, suc_func, error_func) {
    let post_data = {
        'token': token,
        'base_amount': base_amount
    };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Assign recharge cash withdrawal
function GetAssignCa(api_url, token, ca_channel, suc_func, error_func) {
    let post_data = {
        'token': token,
        'ca_channel': ca_channel
    };
    CallApi(api_url, post_data, suc_func, error_func);
}

//lockRechargeAmount(Recharge request)
function LockRechargeAmount(token, ca_id, base_amount, bit_amount, ca_channel_en, us_level, suc_func, error_func) {
    let api_url = 'us_recharge_quest.php',
        post_data = {
            'token': token,
            'ca_id': ca_id,
            'base_amount': base_amount,
            'bit_amount': bit_amount,
            'ca_channel': ca_channel_en,
            'us_level': us_level
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//ca recharge address
function GetCaRechargeInfo(token, ca_id, ca_channel_en, suc_func, error_func) {
    let api_url = 'ca_recharge_order_info.php',
        post_data = {
            'token': token,
            'ca_id': ca_id,
            'ca_channel': ca_channel_en
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Get user balance
function GetUserBaseInfo(token, suc_func, error_func) {
    let api_url = 'info_base.php',
        post_data = {
            'token': token
        };
    CallUserApi(api_url, post_data, suc_func, error_func);
}

//get us_account_id
function GetUsAccountId(token, ca_channel, suc_func, error_func) {
    let api_url = 'get_specified_bank_card_list.php',
        post_data = {
            'token': token,
            'cash_channel': ca_channel
        };
    CallUserApi(api_url, post_data, suc_func, error_func);
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
    CallApi(api_url, post_data, suc_func, error_func);
}

//Get a list of top-up exchange rates
function GetRateList(token, suc_func, error_func) {
    let api_url = 'get_recharge_withdraw_rate.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Set up recharge rate
function SetRechargeRate(token, rate, minAmount, maxAmount, time, level, ca_type, pass_word_hash, suc_func, error_func) {
    let api_url = 'set_recharge_rate.php',
        post_data = {
            'token': token,
            'recharge_rate': rate,
            'recharge_min_amount': minAmount,
            'recharge_max_amount': maxAmount,
            'limit_time': time,
            'recharge_us_level': level,
            'ca_type': ca_type,
            'pass_word_hash': pass_word_hash,
        };
    CallApi(api_url, post_data, suc_func, error_func)
}

//Set up withdraw rate
function SetWithdrawRate(token, rate, minAmount, maxAmount, time, level, ca_type, pass_word_hash, suc_func, error_func) {
    let api_url = 'set_withdraw_rate.php',
        post_data = {
            'token': token,
            'withdraw_rate': rate,
            'withdraw_min_amount': minAmount,
            'withdraw_max_amount': maxAmount,
            'limit_time': time,
            'withdraw_us_level': level,
            'ca_type': ca_type,
            'pass_word_hash': pass_word_hash,
        };
    CallApi(api_url, post_data, suc_func, error_func)
}

//Get user recharge cash withdrawal processing list
function GetRechargeWithdrawList(api_url, token, type, suc_func, error_func) {
    var api_url = api_url,
        post_data = {
            'token': token,
            'type': type
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Recharge request confirmation processing
function RechargeConfirm(token, qa_id, type, suc_func, error_func) {
    let api_url = 'recharge_confirm.php',
        post_data = {
            'token': token,
            'type': type,
            'qa_id': qa_id
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//Recharge request refuse processing
function RechargeRefuse(token, type, qa_id, suc_func, error_func) {
    let api_url = 'recharge_confirm.php',
        post_data = {
            'token': token,
            'type': type,
            'qa_id': qa_id
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//Withdrawal request confirmation processing
function WithdrawConfirm(token, qa_id, type, suc_func, error_func) {
    let api_url = 'withdraw_confirm.php',
        post_data = {
            'token': token,
            'qa_id': qa_id,
            'type': type
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//withdraw request refuse processing
function WithdrawRefuse(token, qa_id, type, suc_func, error_func) {
    let api_url = 'withdraw_confirm.php',
        post_data = {
            'token': token,
            'qa_id': qa_id,
            'type': type
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//User withdrawal order details
function GetWithdrawInfo(token, suc_func, error_func) {
    let api_url = 'order_ca_withdraw_list.php',
        post_data = {
            'token': token
        };
    CallUserApi(api_url, post_data, suc_func, error_func);
}

//get key code
function GetKeyCode(token, suc_func, error_func) {
    let api_url = 'get_key_code.php',
        post_data = {
            'token': token
        };
    CallLaConfigApi(api_url, post_data, suc_func, error_func);
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
    btnText = btnText ? btnText : "confirm";
    $this.attr('data-clickStatus', 1);
    $this.html(btnText);
}

/**
 * Initialization page loading loading
 * */
window.onload = function () {
    if (document.readyState === 'complete') {
        document.body.style.overflow = "auto";
        let loading = document.querySelector(".loading");
        loading.parentNode.removeChild(loading);
    }
};
$('[data-toggle="tooltip"]').tooltip();

//new
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
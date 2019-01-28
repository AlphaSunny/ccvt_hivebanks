$(function () {
    //Get graphic verification code
    GetImgCode();
    //    Switch verification code
    $('#phone_imgCode').click(function () {
        GetImgCode();
    });

    // Switch mailbox and phone reset password
    $('.resetToggle').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
    });

    // Switch mailbox password reset
    $('.emailReset').click(function () {
        $('.phoneResetBox').fadeOut();
        $('.emailResetBox').fadeIn();
    });

    // Switch phone password reset
    $('.phoneReset').click(function () {
        $('.emailResetBox').fadeOut();
        $('.phoneResetBox').fadeIn();
        GetImgCode();
    });

    // Reset mailbox listener
    //email address
    $('.email').focus(function () {
        $(this).siblings('span').hide();
    });
    $('.email').blur(function () {
        let email = $(this).val();
        if (email.length <= 0) {//Email account is empty
            $('.email_tips').fadeIn().siblings('span').fadeOut();
            return;
        }
        if (!IsEmail(email)) {//Bad Mailbox Format
            $('.emailErrorTips').fadeIn().siblings('span').fadeOut();
            return;
        }
    });

    //E-mail verification code
    $('.emailcfmCode').focus(function () {
        $('.emailCode_tips').hide();
    });
    $('.emailcfmCode').blur(function () {
        let emailcfmCode = $(this).val();
        if (emailcfmCode.length <= 0) {//Email verification code is empty
            $('.emailCode_tips').fadeIn();
            return;
        }
    });

    //Mailbox new password
    $(".emailPassword").focus(function () {
        $(this).siblings('span').hide();
    });
    $('.emailPassword').blur(function () {
        let emailPassword = $(this).val();
        if (emailPassword.length <= 0) {
            $('.password_tips').fadeIn().siblings('span').hide();
            return;
        }
        if (emailPassword.length < 8) {
            $('.errEmailPass_tips').fadeIn().siblings('span').hide();
            return;
        }
    });

    $(".email_confirm_Password").focus(function () {
        $(this).siblings('span').hide();
    });
    $('.email_confirm_Password').blur(function () {
        let confirmemailPassword = $(this).val();
        if (confirmemailPassword.length <= 0) {
            $('.confirmpassword_tips').fadeIn().siblings('span').hide();
            return;
        }
        if (confirmemailPassword.length < 8) {
            $('.errconfirmEmailPass_tips').fadeIn().siblings('span').hide();
            return;
        }
        if ($('.emailPassword').val() != confirmemailPassword) {
            $('.TwoPassword_email').fadeIn().siblings('span').hide();
            return;
        }
    });

    // Reset email to get verification code
    $('.emailCodeBtn').click(function () {
        let email = $('.email').val();
        if (email.length <= 0) {
            $('.email_tips').fadeIn().siblings('span').fadeOut();
            return;
        } else if (!IsEmail(email)) {
            $('.emailErrorTips').fadeIn().siblings('span').fadeOut();
            return;
        }
        GetEmailCode(email, function (response) {
            LayerFun('sendSuccess');
        }, function (response) {
            LayerFun('sendFail');
            LayerFun(response.errcode);
            LayerFun(response.errcode);
            return;
        });

    });

    // Password reset (mailbox)
    $('.emailResetBtn').click(function () {
        let email = $('.email').val(),
            cfm_code = $('.emailcfmCode').val(),
            emailPassword = $('.emailPassword').val(),
            email_confirm_Password = $('.email_confirm_Password').val(),
            pass_word_hash = hex_sha1(emailPassword),
            confirm_pass_word_hash = hex_sha1(email_confirm_Password);

        if (email == '') {
            $('.email_tips').fadeIn().siblings('span').fadeOut();
            LayerFun('emailNotEmpty');
            return;
        }
        if (!IsEmail(email)) {
            $('.emailErrorTips').fadeIn().siblings('span').fadeOut();
            LayerFun('emailBad');
            return;
        }
        if (cfm_code == '') {
            $('.emailCode_tips').fadeIn();
            LayerFun('codeNotEmpty');
            return;
        }
        if (emailPassword == '') {
            $('.password_tips').fadeIn().siblings('span').hide();
            LayerFun('passwordNotEmpty');
            return;
        }
        if (email_confirm_Password == '') {
            $('.confirmpassword_tips').fadeIn().siblings('span').hide();
            LayerFun('confirmPasswordNotEmpty');
            return;
        }
        if (emailPassword != email_confirm_Password) {
            $('.TwoPassword_email').fadeIn().siblings('span').hide();
            LayerFun('TwoPassword');
            return;
        }
        let $this = $(this), btnText = $(this).text();
        if (DisableClick($this)) return;
        ResetEmailPassword(email, cfm_code, pass_word_hash, confirm_pass_word_hash, function (response) {
            ActiveClick($this, btnText);
            if (response.errcode == '0') {
                $('.email').val('');
                $('.emailcfmCode').val('');
                $('.emailPassword').val('');
                $('.email_confirm_Password').val('');
                LayerFun('modifySuccess');
            }

        }, function (response) {
            ActiveClick($this, btnText);
            LayerFun('modifyFail');
            if (response.errcode == '120') {
                $('.noEmailTips').fadeIn('fast');
                return;
            }

            if (response.errcode == '101') {
                LayerFun('accountOrCodeFail');
                execI18n();
                return;
            }
            if (response.errcode == "114") {
                DelCookie('token');
                window.location.href = 'login.html';
            }
        })
    });
    //Reset phone monitoring
    //phone account
    $('#phone').focus(function () {
        $(this).siblings('span').hide();
    });
    $('#phone').blur(function () {
        let phone = $(this).val();
        if (phone.length <= 0) {
            $('.phone_tips').fadeIn().siblings('span').hide();
            return;
        }
        if (isNaN(phone)) {
            $('.phoneErrorTips').fadeIn().siblings('span').hide();
            return;
        }
    });

    //Captcha
    $('.phoneCfmCode').focus(function () {
        $(this).siblings('span').hide();
    });
    $('.phoneCfmCode').blur(function () {
        let phoneCfmCode = $(this).val();
        if (phoneCfmCode.length <= 0) {
            $('.phoneImgCode_tips').fadeIn().siblings('span').hide();
            return;
        }
    });

    //phone code
    $('.phoneSmsCode').focus(function () {
        $(this).siblings('span').hide();
    });
    $('.phoneSmsCode').blur(function () {
        let phoneSmsCode = $(this).val();
        if (phoneSmsCode.length <= 0) {
            $('.phoneCode_tips').fadeIn();
            return;
        }
    });

    //new password
    $('.phonePassword').focus(function () {
        $(this).siblings('span').hide();
    });
    $('.phonePassword').blur(function () {
        let phonePassword = $(this).val();
        if (phonePassword.length <= 0) {
            $('.Phonepassword_tips').fadeIn().siblings('span').hide();
            return;
        }
        if (phonePassword.length < 8) {
            $('.errPhonePass_tips').fadeIn().siblings('span').hide();
            return;
        }
    });

    $('.confirmphonePassword').focus(function () {
        $(this).siblings('span').hide();
    });
    $('.confirmphonePassword').blur(function () {
        let confirmphonePassword = $(this).val();
        if (confirmphonePassword.length <= 0) {
            $('.ConfirmPhonepassword_tips').fadeIn().siblings('span').hide();
            return;
        }
        if (confirmphonePassword.length < 8) {
            $('.errconfirmPhonePass_tips').fadeIn().siblings('span').hide();
            return;
        }

        if ($('.phonePassword').val() != confirmphonePassword) {
            $('.TwoPassword_phone').fadeIn().siblings('span').hide();
            return;
        }
    });

    //Get phone verification code
    $('.phoneCodeBtn').click(function () {
        let country_code = $('.selected-dial-code').text().split("+")[1];
        let cellphone = $('#phone').val();
        let bind_type = '3', cfm_code = $('#phoneCfmCode').val();

        if (cellphone == '') {
            // LayerFun('phoneNotEmpty');
            WarnPrompt("请输入手机号码");
            return;
        }

        if (cfm_code <= 0) {
            // LayerFun('pleaseImgCode');
            WarnPrompt("请输入图形验证码");
            return;
        }
        ShowLoading("show");
        GetSmsCodeFun(cellphone, country_code, bind_type, cfm_code);
    });
    // Password reset (mobile phone)
    $('.phoneResetBtn').click(function () {
        // Get country code
        let country_code = $('.selected-dial-code').text().split("+")[1];
        let cellphone = $('.phone').val(),
            cfm_code = $('.phoneCfmCode').val(),
            sms_code = $('.phoneSmsCode').val(),
            phonePassword = $('.phonePassword').val(),
            confirmphonePassword = $('.confirmphonePassword').val(),
            pass_word_hash = hex_sha1(phonePassword),
            confirm_pass_word_hash = hex_sha1(confirmphonePassword);
        if (cellphone == '') {
            LayerFun('phoneNotEmpty');
            $('.phone_tips').fadeIn().siblings('span').hide();
            return;
        }

        if (cfm_code == '') {
            LayerFun('codeNotEmpty');
            $('.phoneImgCode_tips').fadeIn().siblings('span').hide();
            return;
        }
        if (sms_code == '') {
            LayerFun('codeNotEmpty');
            $('.phoneCode_tips').fadeIn();
            return;
        }

        if (phonePassword == '') {
            LayerFun('passwordNotEmpty');
            $('.Phonepassword_tips').fadeIn().siblings('span').hide();
            return;
        }

        if (phonePassword.length < 8) {
            LayerFun('passwordNotEmpty');
            $('.PasswordStructure').fadeIn().siblings('span').hide();
            return;
        }
        if (confirmphonePassword == '') {
            LayerFun('confirmPasswordNotEmpty');
            $('.ConfirmPhonepassword_tips').fadeIn().siblings('span').hide();
            return;
        }
        if (confirmphonePassword.length < 8) {
            LayerFun('confirmPasswordNotEmpty');
            $('.confirmPasswordStructure').fadeIn().siblings('span').hide();
            return;
        }
        if (phonePassword != confirmphonePassword) {
            $('.TwoPassword_phone').fadeIn().siblings('span').hide();
            LayerFun('TwoPassword');
            return;
        }

        let $this = $(this), btnText = $(this).text();
        if (DisableClick($this)) return;
        ResetPhonePassword(country_code, cellphone, sms_code, pass_word_hash, confirm_pass_word_hash, function (response) {
            ActiveClick($this, btnText);
            if (response.errcode == '0') {
                $('.phone').val('');
                $('.phoneCfmCode').val('');
                $('.phoneSmsCode').val('');
                $('.phonePassword').val('');
                $('.confirmphonePassword').val('');
                // LayerFun('modifySuccess');

                SuccessPrompt("修改成功");
                DelCookie('user_token');
                window.location.href = 'login.html';
            }

        }, function (response) {
            ActiveClick($this, btnText);
            // LayerFun('modifyFail');
            WarnPrompt("修改失败");
            if (response.errcode == '120') {
                $('.noPhonelTips').fadeIn('fast');
            }
            if (response.errcode == "114") {
                DelCookie('user_token');
                window.location.href = 'login.html';
            }
        });
    });
});

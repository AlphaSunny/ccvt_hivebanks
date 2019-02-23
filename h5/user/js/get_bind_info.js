function GetVerifyBindingInformation(token, type) {
    BindingInformation(token, function (response) {
        let data = response.rows;
        $.each(data, function (i, val) {
            if (data[i].bind_name == type && data[i].bind_flag == '1') {
                // return true;
                let info = data[i].bind_info;
                console.log(info);
                return info;
            }
        })
    }, function (response) {
        ErrorPrompt(response.errmsg)
    });
}